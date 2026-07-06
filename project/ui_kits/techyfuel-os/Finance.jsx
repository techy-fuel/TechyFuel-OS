// Finance screen — revenue, invoices, multi-currency, PDF export.
(() => {
const { Card, StatCard, Badge, Tabs } = window.TechyFuelOSDesignSystem_be0222;

const IS = {
  paid:      { tone: 'success', label: 'Paid' },
  sent:      { tone: 'info',    label: 'Sent' },
  overdue:   { tone: 'danger',  label: 'Overdue' },
  draft:     { tone: 'neutral', label: 'Draft' },
  cancelled: { tone: 'neutral', label: 'Cancelled' },
};

const EXPENSE_CATEGORIES = {
  salary:   { tone: 'violet',  label: 'Salary' },
  tools:    { tone: 'info',    label: 'Tools' },
  ads:      { tone: 'warning', label: 'Ads' },
  freelance:{ tone: 'brand',   label: 'Freelance' },
  office:   { tone: 'teal',    label: 'Office' },
  other:    { tone: 'neutral', label: 'Other' },
};

const CURRENCIES = [
  { code: 'USD', symbol: '$',   name: 'US Dollar' },
  { code: 'EUR', symbol: '€',   name: 'Euro' },
  { code: 'GBP', symbol: '£',   name: 'British Pound' },
  { code: 'AED', symbol: 'AED', name: 'UAE Dirham' },
  { code: 'SAR', symbol: 'SAR', name: 'Saudi Riyal' },
  { code: 'OMR', symbol: 'OMR', name: 'Omani Rial' },
  { code: 'PKR', symbol: '₨',   name: 'Pakistani Rupee' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$',  name: 'Australian Dollar' },
];

function addRecurrenceInterval(dateStr, interval) {
  const d = new Date((dateStr || new Date().toISOString().slice(0, 10)) + 'T00:00:00Z');
  if (interval === 'weekly') d.setUTCDate(d.getUTCDate() + 7);
  else if (interval === 'quarterly') d.setUTCMonth(d.getUTCMonth() + 3);
  else d.setUTCMonth(d.getUTCMonth() + 1); // 'monthly' default
  return d.toISOString().slice(0, 10);
}

function getCurrencySymbol(code) {
  return (CURRENCIES.find(c => c.code === code) || CURRENCIES[0]).symbol;
}

function fmtAmt(n, currency) {
  if (!n && n !== 0) return (getCurrencySymbol(currency || 'PKR')) + '0';
  const sym = getCurrencySymbol(currency || 'PKR');
  const num = Number(n).toLocaleString('en', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  return sym + num;
}

// Convert an amount between any two supported currencies using USD-based
// rates ({ PKR: 278.5, SAR: 3.75, ... } == 1 USD in that currency). Returns
// null when a required rate hasn't loaded yet, so callers can show a
// friendly "—" instead of a wrong number.
function convertCurrency(amount, from, to, rates) {
  if (amount === '' || amount === null || amount === undefined || isNaN(Number(amount))) return null;
  from = from || 'USD'; to = to || 'USD';
  const n = Number(amount);
  if (from === to) return n;
  if (!rates) return null;
  const usd = from === 'USD' ? n : (rates[from] ? n / rates[from] : null);
  if (usd === null) return null;
  if (to === 'USD') return usd;
  return rates[to] ? usd * rates[to] : null;
}

function fmtDate(ds) {
  if (!ds) return '—';
  return new Date(ds).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' });
}

function buildMonthlyBars(invoices, rates) {
  const months = Array.from({ length: 12 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (11 - i));
    return { key: d.toISOString().slice(0, 7), val: 0 };
  });
  for (const inv of invoices) {
    if (inv.status !== 'paid') continue;
    const pkr = convertCurrency(inv.amount, inv.currency || 'PKR', 'PKR', rates);
    if (pkr === null) continue;
    const key = (inv.due_date || inv.created_at || '').slice(0, 7);
    const m = months.find(x => x.key === key);
    if (m) m.val += pkr;
  }
  return months.map(m => m.val);
}

function readAgencyBranding() {
  const saved = (() => { try { return JSON.parse(localStorage.getItem('tf_settings') || '{}'); } catch { return {}; } })();
  return {
    agencyName:    saved.agencyName    || 'TechyFuel OS',
    tagline:       saved.tagline       || '',
    agencyEmail:   saved.agencyEmail   || '',
    agencyPhone:   saved.agencyPhone   || '',
    agencyWebsite: saved.agencyWebsite || '',
    agencyAddress: saved.agencyAddress || '',
    logoUrl:       saved.logoUrl       || '',
    paymentAccount: saved.paymentAccount || '',
    paymentSwift:   saved.paymentSwift   || '',
    paymentPayoneer:saved.paymentPayoneer|| '',
    signatureName:  saved.signatureName  || '',
    signatureTitle: saved.signatureTitle || '',
  };
}

function invoiceItemsOf(inv) {
  const items = (inv.invoice_items || []).slice().sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  if (items.length) return items;
  // Legacy single-amount invoices have no line items — render one row so
  // the itemized template still looks right instead of an empty table.
  return [{ description: `Services — ${inv.invoice_no}`, qty: 1, unit_price: inv.amount || 0 }];
}

// ── Branded invoice document (used for both PDF export and email share) ──
function buildInvoiceHtml(inv, clients) {
  const b = readAgencyBranding();
  const clientObj   = clients.find(c => c.id === inv.client_id) || {};
  const clientName  = inv.clients?.name || clientObj.company || clientObj.name || '—';
  const clientEmail = clientObj.email || '';
  const clientPhone = clientObj.phone || '';
  const currency    = inv.currency || 'PKR';
  const items       = invoiceItemsOf(inv);
  const total       = items.reduce((s, it) => s + (Number(it.qty) || 0) * (Number(it.unit_price) || 0), 0);
  const rowsHtml = items.map((it, i) => `
    <tr style="background:${i % 2 ? '#f8fafc' : '#fff'}">
      <td style="padding:12px 16px;font-size:13px;color:#334155">${it.description}</td>
      <td style="padding:12px 16px;font-size:13px;color:#334155;text-align:center">${Number(it.qty) || 0}</td>
      <td style="padding:12px 16px;font-size:13px;color:#334155;text-align:right">${fmtAmt(it.unit_price, currency)}</td>
      <td style="padding:12px 16px;font-size:13px;font-weight:700;color:#0f172a;text-align:right">${fmtAmt((Number(it.qty) || 0) * (Number(it.unit_price) || 0), currency)}</td>
    </tr>`).join('');

  const stripe = (top) => `
    <div style="position:absolute;${top ? 'top:0' : 'bottom:0'};right:0;width:260px;height:90px;overflow:hidden;${top ? '' : 'transform:scaleY(-1)'}">
      <div style="position:absolute;top:-30px;right:-60px;width:340px;height:130px;background:#0f172a;transform:rotate(-8deg)"></div>
      <div style="position:absolute;top:-10px;right:-90px;width:340px;height:70px;background:#2563eb;transform:rotate(-8deg)"></div>
    </div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>Invoice ${inv.invoice_no}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #0f172a; background: #fff; }
  .sheet { position: relative; max-width: 820px; margin: 0 auto; padding: 40px 48px; overflow: hidden; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 28px; position: relative; z-index: 2; }
  .brand-row { display: flex; align-items: center; gap: 12px; }
  .brand-row img { height: 44px; }
  .brand { font-size: 21px; font-weight: 800; letter-spacing: -0.02em; color: #0f172a; }
  .brand-sub { font-size: 11px; color: #64748b; margin-top: 2px; }
  .invoice-box { text-align: right; }
  .invoice-box h1 { font-size: 26px; font-weight: 900; letter-spacing: 0.05em; color: #0f172a; margin-bottom: 8px; }
  .invoice-no { display: inline-block; background: #1e40af; color: #fff; font-size: 12px; font-weight: 700; padding: 6px 14px; border-radius: 4px; letter-spacing: 0.03em; }
  .billto { margin: 28px 0 22px; position: relative; z-index: 2; }
  .billto label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #94a3b8; display: block; margin-bottom: 6px; }
  .billto .name { font-size: 15px; font-weight: 700; color: #0f172a; }
  .billto .sub { font-size: 12px; color: #64748b; margin-top: 2px; }
  .meta-right { text-align: right; font-size: 12px; color: #64748b; }
  .meta-right b { color: #0f172a; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 20px; position: relative; z-index: 2; }
  thead th { text-align: left; padding: 11px 16px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #fff; background: #0f172a; }
  thead th:nth-child(2) { text-align: center; }
  thead th:nth-child(3), thead th:nth-child(4) { text-align: right; }
  .totals { margin-left: auto; width: 260px; position: relative; z-index: 2; margin-bottom: 28px; }
  .totals-row { display: flex; justify-content: space-between; padding: 7px 0; font-size: 13px; color: #64748b; }
  .totals-row.total { border-top: 2px solid #0f172a; padding-top: 12px; margin-top: 4px; font-size: 18px; font-weight: 800; color: #0f172a; }
  .lower { display: flex; justify-content: space-between; gap: 32px; margin-bottom: 32px; position: relative; z-index: 2; }
  .payment label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #94a3b8; display: block; margin-bottom: 8px; }
  .payment .row { font-size: 12px; color: #334155; margin-bottom: 4px; }
  .payment .row b { color: #0f172a; display: inline-block; width: 76px; }
  .thanks { font-size: 15px; font-weight: 700; color: #0f172a; margin-bottom: 8px; }
  .notes { font-size: 12px; color: #64748b; max-width: 260px; }
  .signature { text-align: right; margin-top: 24px; }
  .signature .name { font-size: 14px; font-weight: 700; font-style: italic; color: #0f172a; }
  .signature .title { font-size: 11px; color: #64748b; margin-top: 2px; }
  .footer { position: relative; background: #0f172a; color: #fff; padding: 18px 48px; display: flex; justify-content: space-around; font-size: 11px; overflow: hidden; }
  .footer-item { display: flex; align-items: center; gap: 6px; position: relative; z-index: 2; }
  .footer-item b { display: block; font-size: 9px; text-transform: uppercase; letter-spacing: 0.06em; color: #93c5fd; }
  @media print { @page { margin: 0; } }
</style>
</head>
<body>
<div class="sheet">
  ${stripe(true)}
  <div class="header">
    <div class="brand-row">
      ${b.logoUrl ? `<img src="${b.logoUrl}" alt=""/>` : ''}
      <div>
        <div class="brand">${b.agencyName}</div>
        ${b.tagline ? `<div class="brand-sub">${b.tagline}</div>` : ''}
      </div>
    </div>
    <div class="invoice-box">
      <h1>INVOICE</h1>
      <div class="invoice-no">NO:#${inv.invoice_no}</div>
    </div>
  </div>

  <div class="billto" style="display:flex;justify-content:space-between">
    <div>
      <label>Invoice To</label>
      <div class="name">${clientName}</div>
      ${clientEmail ? `<div class="sub">${clientEmail}</div>` : ''}
      ${clientPhone ? `<div class="sub">${clientPhone}</div>` : ''}
    </div>
    <div class="meta-right">
      <div>Date: <b>${fmtDate(inv.created_at || new Date().toISOString())}</b></div>
      <div>Due date: <b>${fmtDate(inv.due_date)}</b></div>
      <div>Status: <b>${(IS[inv.status] || { label: inv.status }).label}</b></div>
    </div>
  </div>

  <table>
    <thead><tr><th>Description</th><th>Qty</th><th>Unit Price</th><th>Total</th></tr></thead>
    <tbody>${rowsHtml}</tbody>
  </table>

  <div class="totals">
    <div class="totals-row"><span>Subtotal</span><span>${fmtAmt(total, currency)}</span></div>
    <div class="totals-row total"><span>Total</span><span>${fmtAmt(total, currency)}</span></div>
  </div>

  <div class="lower">
    <div class="payment">
      <label>Payment Method</label>
      ${b.paymentAccount ? `<div class="row"><b>Account</b>${b.paymentAccount}</div>` : ''}
      ${b.paymentSwift ? `<div class="row"><b>Swift</b>${b.paymentSwift}</div>` : ''}
      ${b.paymentPayoneer ? `<div class="row"><b>Payoneer</b>${b.paymentPayoneer}</div>` : ''}
    </div>
    <div>
      <div class="thanks">Thanks for your business!</div>
      <div class="notes">${inv.notes || 'Please make payment by the due date above. Contact us with any questions about this invoice.'}</div>
      ${b.signatureName ? `<div class="signature"><div class="name">${b.signatureName}</div><div class="title">${b.signatureTitle || ''}</div></div>` : ''}
    </div>
  </div>
</div>

<div class="footer">
  ${stripe(false)}
  ${b.agencyPhone ? `<div class="footer-item"><div><b>Phone</b>${b.agencyPhone}</div></div>` : ''}
  ${b.agencyWebsite ? `<div class="footer-item"><div><b>Website</b>${b.agencyWebsite}</div></div>` : ''}
  ${b.agencyAddress ? `<div class="footer-item"><div><b>Address</b>${b.agencyAddress}</div></div>` : ''}
  ${b.agencyEmail ? `<div class="footer-item"><div><b>Email</b>${b.agencyEmail}</div></div>` : ''}
</div>
</body>
</html>`;
}

// ── PDF invoice print ─────────────────────────────────────────────
function printInvoicePDF(inv, clients) {
  const printScript = '<script>window.onload = function() { window.print(); };<\/script>';
  const html = buildInvoiceHtml(inv, clients).replace('</body>', printScript + '</body>');
  const win = window.open('', '_blank', 'width=900,height=700');
  if (win) { win.document.write(html); win.document.close(); }
}

async function financeAuthHeader() {
  try {
    const { data } = await window.db.auth.getSession();
    const token = data?.session?.access_token;
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch { return {}; }
}

// ── Share invoice via Email / WhatsApp ─────────────────────────────
function ShareInvoiceModal({ inv, clients, onClose }) {
  const clientObj = clients.find(c => c.id === inv.client_id) || {};
  const [to, setTo] = React.useState(clientObj.email || '');
  const [phone, setPhone] = React.useState(clientObj.phone || '');
  const [sending, setSending] = React.useState(false);
  const [result, setResult] = React.useState(null); // { ok, error }
  const b = readAgencyBranding();
  const items = invoiceItemsOf(inv);
  const total = items.reduce((s, it) => s + (Number(it.qty) || 0) * (Number(it.unit_price) || 0), 0);

  async function sendEmail() {
    if (!to.trim()) { setResult({ ok: false, error: 'Enter a recipient email address.' }); return; }
    setSending(true);
    setResult(null);
    try {
      const headers = { 'Content-Type': 'application/json', ...(await financeAuthHeader()) };
      const res = await fetch('/api/email-send', {
        method: 'POST', headers,
        body: JSON.stringify({
          to: to.trim(),
          subject: `Invoice ${inv.invoice_no} from ${b.agencyName}`,
          body: `Please find invoice ${inv.invoice_no} for ${fmtAmt(total, inv.currency)} below. Due ${fmtDate(inv.due_date)}.`,
          html: buildInvoiceHtml(inv, clients),
        }),
      });
      const json = await res.json();
      setResult(json.ok ? { ok: true } : { ok: false, error: json.error || 'Could not send the email.' });
    } catch (err) {
      setResult({ ok: false, error: err.message || 'Could not send the email.' });
    } finally { setSending(false); }
  }

  function shareWhatsApp() {
    const digits = phone.replace(/\D/g, '');
    const text = `Hi${clientObj.name ? ' ' + clientObj.name : ''}, here's invoice ${inv.invoice_no} from ${b.agencyName} for ${fmtAmt(total, inv.currency)}, due ${fmtDate(inv.due_date)}. Please reach out if you'd like the PDF copy sent by email too.`;
    window.open(`https://wa.me/${digits}?text=${encodeURIComponent(text)}`, '_blank');
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9000, background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: 'var(--slate-0)', borderRadius: 'var(--radius-2xl)', boxShadow: '0 25px 60px rgba(0,0,0,0.3)', width: '100%', maxWidth: 440, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', borderBottom: '1px solid var(--border-subtle)' }}>
          <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--fw-bold)', color: 'var(--text-strong)', margin: 0 }}>Share invoice {inv.invoice_no}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4, borderRadius: 'var(--radius-sm)', display: 'flex' }}>
            <Icon name="x" size={18} />
          </button>
        </div>
        <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 16 }}>

          <div>
            <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-bold)', color: 'var(--text-strong)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Icon name="mail" size={15} /> Send by email
            </h3>
            <input style={FF.input} type="email" placeholder="client@example.com" value={to} onChange={e => setTo(e.target.value)} />
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 6 }}>Sends the branded invoice as a formatted email from your connected mailbox.</p>
            {result && (
              <div style={{ marginTop: 8, fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-semibold)', color: result.ok ? 'var(--green-600)' : 'var(--red-600)' }}>
                {result.ok ? 'Email sent!' : result.error}
              </div>
            )}
            <button onClick={sendEmail} disabled={sending} style={{ marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 7, height: 36, padding: '0 16px', background: 'var(--blue-600)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', cursor: sending ? 'wait' : 'pointer', opacity: sending ? 0.75 : 1 }}>
              <Icon name="send" size={14} /> {sending ? 'Sending…' : 'Send email'}
            </button>
          </div>

          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 16 }}>
            <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-bold)', color: 'var(--text-strong)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Icon name="message-circle" size={15} /> Share on WhatsApp
            </h3>
            <input style={FF.input} placeholder="+92 300 1234567" value={phone} onChange={e => setPhone(e.target.value)} />
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 6 }}>Opens WhatsApp with a prefilled message summarizing the invoice (WhatsApp links can't attach a PDF directly — send the PDF by email or attach it manually in the chat).</p>
            <button onClick={shareWhatsApp} disabled={!phone.trim()} style={{ marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 7, height: 36, padding: '0 16px', background: 'var(--green-600)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', cursor: phone.trim() ? 'pointer' : 'not-allowed', opacity: phone.trim() ? 1 : 0.6 }}>
              <Icon name="message-circle" size={14} /> Open WhatsApp
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────
function Finance() {
  useLucide();
  const [activeTab, setActiveTab] = React.useState('invoices');
  const [invoices, setInvoices] = React.useState([]);
  const [clients,  setClients]  = React.useState([]);
  const [projects, setProjects] = React.useState([]);
  const [loading,  setLoading]  = React.useState(true);
  const [search,   setSearch]   = React.useState('');
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editInv,   setEditInv]   = React.useState(null);
  const [saving,    setSaving]    = React.useState(false);
  const [form, setForm] = React.useState({ invoice_no: '', client_id: '', amount: '', due_date: '', status: 'draft', currency: 'PKR' });
  const [items, setItems] = React.useState([]); // [{ description, qty, unit_price }]
  const [fxRates, setFxRates] = React.useState(null); // { base: 'USD', rates: { PKR: 278.5, ... }, fetchedAt }
  const [previewCurrency, setPreviewCurrency] = React.useState('PKR');
  const [shareInv, setShareInv] = React.useState(null); // invoice currently open in the Share modal

  // ── Expenses state ──────────────────────────────────────────────
  const [expenses,    setExpenses]    = React.useState([]);
  const [expLoading,  setExpLoading]  = React.useState(true);
  const [expSearch,   setExpSearch]   = React.useState('');
  const [expModalOpen, setExpModalOpen] = React.useState(false);
  const [editExp,     setEditExp]     = React.useState(null);
  const [expSaving,   setExpSaving]   = React.useState(false);
  const [expForm, setExpForm] = React.useState({ description: '', category: 'salary', amount: '', currency: 'PKR', date: new Date().toISOString().slice(0, 10), project_id: '', client_id: '' });
  const [expPreviewCurrency, setExpPreviewCurrency] = React.useState('USD');

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }
  function setEx(k, v) { setExpForm(f => ({ ...f, [k]: v })); }

  React.useEffect(() => {
    if (!window.API) { setLoading(false); setExpLoading(false); return; }
    (async () => {
      try {
        const [invRes, cliRes, projRes] = await Promise.all([window.API.getInvoices(), window.API.getClients(), window.API.getProjects()]);
        if (invRes.data) setInvoices(invRes.data);
        if (cliRes.data) setClients(cliRes.data);
        if (projRes.data) setProjects(projRes.data);
      } catch {}
      finally { setLoading(false); }
    })();
    (async () => {
      try {
        const expRes = await window.API.getExpenses();
        if (expRes.data) setExpenses(expRes.data);
      } catch {}
      finally { setExpLoading(false); }
    })();
    if (window.API.getFxRates) {
      window.API.getFxRates().then(r => { if (r && r.rates) setFxRates(r); }).catch(() => {});
    }
  }, []);

  // Keep the "convert to" preview currency from pointing at whatever
  // currency the invoice itself is already in.
  React.useEffect(() => {
    if (form.currency === previewCurrency) {
      setPreviewCurrency(form.currency === 'PKR' ? 'USD' : 'PKR');
    }
  }, [form.currency]);

  React.useEffect(() => {
    if (expForm.currency === expPreviewCurrency) {
      setExpPreviewCurrency(expForm.currency === 'PKR' ? 'USD' : 'PKR');
    }
  }, [expForm.currency]);

  function openNewExpense() {
    setEditExp(null);
    setExpForm({ description: '', category: 'salary', amount: '', currency: 'PKR', date: new Date().toISOString().slice(0, 10), project_id: '', client_id: '' });
    setExpModalOpen(true);
  }

  function openEditExpense(exp) {
    setEditExp(exp);
    setExpForm({
      description: exp.description || '',
      category:    exp.category    || 'other',
      amount:      exp.amount      ? String(exp.amount) : '',
      currency:    exp.currency    || 'PKR',
      date:        exp.date        ? exp.date.slice(0, 10) : new Date().toISOString().slice(0, 10),
      project_id:  exp.project_id  || '',
      client_id:   exp.client_id   || '',
    });
    setExpModalOpen(true);
  }

  async function handleSaveExpense() {
    if (!expForm.description.trim() || !expForm.amount) return;
    setExpSaving(true);
    try {
      const payload = { description: expForm.description.trim(), category: expForm.category, amount: Number(expForm.amount), currency: expForm.currency, date: expForm.date };
      if (expForm.project_id) payload.project_id = expForm.project_id;
      if (expForm.client_id)  payload.client_id  = expForm.client_id;
      const projObj = projects.find(p => p.id === expForm.project_id);
      const cliObj  = clients.find(c => c.id === expForm.client_id);
      const projectsData = projObj ? { name: projObj.name } : null;
      const clientsData  = cliObj  ? { name: cliObj.company || cliObj.name } : null;

      if (editExp && window.API) {
        const { data } = await window.API.updateExpense(editExp.id, payload);
        if (data) setExpenses(prev => prev.map(e => e.id === editExp.id ? { ...data, projects: projectsData || e.projects, clients: clientsData || e.clients } : e));
      } else if (window.API) {
        const { data } = await window.API.createExpense(payload);
        if (data) setExpenses(prev => [{ ...data, projects: projectsData, clients: clientsData }, ...prev]);
      }
      setExpModalOpen(false);
    } catch {}
    finally { setExpSaving(false); }
  }

  async function handleDeleteExpense(exp) {
    if (!window.confirm('Delete this expense?')) return;
    try { await window.API.deleteExpense(exp.id); } catch {}
    setExpenses(prev => prev.filter(e => e.id !== exp.id));
  }

  function handleExportExpensesCSV() {
    const rows = [
      ['Description', 'Category', 'Amount', 'Currency', 'Date', 'Project', 'Client'],
      ...filteredExpenses.map(e => [e.description, (EXPENSE_CATEGORIES[e.category] || {}).label || e.category, e.amount || 0, e.currency || 'PKR', e.date || '', e.projects?.name || '', e.clients?.name || '']),
    ];
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'expenses.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  function openNew() {
    setEditInv(null);
    setForm({ invoice_no: '', client_id: '', amount: '', due_date: '', status: 'draft', currency: 'PKR', is_recurring: false, recurrence_interval: 'monthly' });
    setItems([]);
    setModalOpen(true);
  }

  function openEdit(inv) {
    setEditInv(inv);
    setForm({
      invoice_no: inv.invoice_no || '',
      client_id:  inv.client_id  || '',
      amount:     inv.amount     ? String(inv.amount) : '',
      due_date:   inv.due_date   ? inv.due_date.slice(0, 10) : '',
      status:     inv.status     || 'draft',
      currency:   inv.currency   || 'PKR',
      is_recurring: !!inv.is_recurring,
      recurrence_interval: inv.recurrence_interval || 'monthly',
    });
    const existing = (inv.invoice_items || []).slice().sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    setItems(existing.map(it => ({ description: it.description, qty: String(it.qty), unit_price: String(it.unit_price) })));
    setModalOpen(true);
  }

  function addItemRow() { setItems(prev => [...prev, { description: '', qty: '1', unit_price: '' }]); }
  function removeItemRow(i) { setItems(prev => prev.filter((_, idx) => idx !== i)); }
  function setItemField(i, field, val) { setItems(prev => prev.map((it, idx) => idx === i ? { ...it, [field]: val } : it)); }
  const itemsTotal = items.reduce((s, it) => s + (Number(it.qty) || 0) * (Number(it.unit_price) || 0), 0);

  async function handleSave() {
    if (!form.invoice_no.trim()) return;
    setSaving(true);
    try {
      const validItems = items.filter(it => it.description.trim());
      const payload = { invoice_no: form.invoice_no, status: form.status, currency: form.currency };
      if (form.client_id) payload.client_id = form.client_id;
      payload.amount = validItems.length ? itemsTotal : (form.amount ? Number(form.amount) : 0);
      if (form.due_date)  payload.due_date  = form.due_date;
      payload.is_recurring = !!form.is_recurring;
      payload.recurrence_interval = form.is_recurring ? form.recurrence_interval : null;
      payload.next_run_date = form.is_recurring ? addRecurrenceInterval(form.due_date || new Date().toISOString().slice(0, 10), form.recurrence_interval) : null;
      // Track when it was actually marked paid, so Dashboard's "This month"
      // revenue filter has a real date to go on instead of just due_date.
      if (form.status === 'paid' && editInv?.status !== 'paid') payload.paid_at = new Date().toISOString();
      else if (form.status !== 'paid' && editInv?.status === 'paid') payload.paid_at = null;
      const clientObj = clients.find(c => c.id === form.client_id);
      const clientsData = clientObj ? { name: clientObj.company || clientObj.name } : null;

      let invId = editInv?.id;
      let savedInv = null;
      if (editInv && window.API) {
        const { data } = await window.API.updateInvoice(editInv.id, payload);
        savedInv = data;
        if (data) setInvoices(prev => prev.map(i => i.id === editInv.id ? { ...data, clients: clientsData || i.clients, invoice_items: i.invoice_items } : i));
      } else if (window.API) {
        const { data } = await window.API.createInvoice(payload);
        savedInv = data;
        invId = data?.id;
        if (data) setInvoices(prev => [{ ...data, clients: clientsData, invoice_items: [] }, ...prev]);
      }

      if (invId && window.API) {
        const { data: savedItems } = await window.API.saveInvoiceItems(invId, validItems);
        setInvoices(prev => prev.map(i => i.id === invId ? { ...i, invoice_items: savedItems || [] } : i));
      }

      setModalOpen(false);
    } catch {}
    finally { setSaving(false); }
  }

  async function handleStatusChange(inv, newStatus) {
    if (!window.API) return;
    const changes = { status: newStatus };
    if (newStatus === 'paid' && inv.status !== 'paid') changes.paid_at = new Date().toISOString();
    else if (newStatus !== 'paid' && inv.status === 'paid') changes.paid_at = null;
    try {
      await window.API.updateInvoice(inv.id, changes);
      setInvoices(prev => prev.map(i => i.id === inv.id ? { ...i, ...changes } : i));
    } catch {}
  }

  function handleExportCSV() {
    const rows = [
      ['Invoice #', 'Client', 'Amount', 'Currency', 'Status', 'Due Date'],
      ...filtered.map(inv => [inv.invoice_no, inv.clients?.name || '', inv.amount || 0, inv.currency || 'PKR', inv.status, inv.due_date || '']),
    ];
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'invoices.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  const filtered = invoices.filter(inv => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (inv.invoice_no || '').toLowerCase().includes(q) || (inv.clients?.name || '').toLowerCase().includes(q);
  });

  const rates = fxRates && fxRates.rates;
  const toPKR = (amount, currency) => convertCurrency(amount, currency || 'PKR', 'PKR', rates) || 0;
  const paidRevenue  = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + toPKR(i.amount, i.currency), 0);
  const outstanding  = invoices.filter(i => ['sent', 'overdue'].includes(i.status)).reduce((s, i) => s + toPKR(i.amount, i.currency), 0);
  const totalAmount  = invoices.reduce((s, i) => s + toPKR(i.amount, i.currency), 0);
  const monthBars    = buildMonthlyBars(invoices, rates);
  const monthName    = new Date().toLocaleDateString('en', { month: 'long', year: 'numeric' });

  const filteredExpenses = expenses.filter(e => {
    if (!expSearch) return true;
    const q = expSearch.toLowerCase();
    return (e.description || '').toLowerCase().includes(q) || (e.category || '').toLowerCase().includes(q);
  });
  const curMonthKey    = new Date().toISOString().slice(0, 7);
  const totalExpenses  = expenses.reduce((s, e) => s + toPKR(e.amount, e.currency), 0);
  const totalSalaries  = expenses.filter(e => e.category === 'salary').reduce((s, e) => s + toPKR(e.amount, e.currency), 0);
  const monthExpenses  = expenses.filter(e => (e.date || '').slice(0, 7) === curMonthKey).reduce((s, e) => s + toPKR(e.amount, e.currency), 0);

  const selectStyle = { height: 26, padding: '0 6px', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-body)', background: 'var(--slate-0)', cursor: 'pointer' };

  return (
    <div style={{ padding: 24, maxWidth: 1280, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--fw-extrabold)', letterSpacing: '-0.02em' }}>Finance</h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 2 }}>
            {monthName} · {invoices.length} invoice{invoices.length !== 1 ? 's' : ''}
            {rates && <span style={{ marginLeft: 6 }}>· live FX rates loaded</span>}
          </p>
        </div>
        <button onClick={activeTab === 'invoices' ? openNew : openNewExpense} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, height: 36, padding: '0 14px', background: 'var(--blue-600)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-brand)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', cursor: 'pointer' }}>
          <Icon name="plus" size={16} /> {activeTab === 'invoices' ? 'New invoice' : 'Add expense'}
        </button>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Tabs value={activeTab} onChange={setActiveTab} tabs={[
          { id: 'invoices', label: 'Invoices', icon: <Icon name="receipt" size={16} />, count: invoices.length },
          { id: 'expenses', label: 'Expenses', icon: <Icon name="wallet" size={16} />, count: expenses.length },
        ]} />
      </div>

      {activeTab === 'invoices' && (
      <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 16 }}>
        <StatCard label="Revenue (paid, PKR)" value={fmtAmt(paidRevenue, 'PKR')} delta="—" icon={<Icon name="trending-up" />} tone="success" />
        <StatCard label="Total invoiced (PKR)" value={fmtAmt(totalAmount, 'PKR')} delta="—" icon={<Icon name="receipt" />} tone="brand" />
        <StatCard label="Outstanding"          value={fmtAmt(outstanding, 'PKR')} delta="—" icon={<Icon name="clock" />}   tone="warning" />
        <StatCard label="Invoices"             value={String(invoices.length)}    delta="—" icon={<Icon name="file-text" />} tone="violet" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16 }}>
        <Card padding="lg">
          <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--fw-bold)', marginBottom: 4 }}>Paid revenue (PKR)</h3>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--fw-extrabold)', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>{fmtAmt(paidRevenue, 'PKR')}</span>
          </div>
          <Bars data={monthBars} color="var(--green-400)" highlight="var(--green-600)" height={140} />
        </Card>

        <Card padding="none">
          <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--fw-bold)', flex: 1 }}>Invoices</h3>
            <div style={{ position: 'relative' }}>
              <Icon name="search" size={14} style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search invoices…" style={{ height: 32, padding: '0 10px 0 28px', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', color: 'var(--text-body)', background: 'var(--slate-50)', outline: 'none', width: 160 }} />
            </div>
            <button onClick={handleExportCSV} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 32, padding: '0 11px', background: 'var(--slate-0)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-body)', cursor: 'pointer' }}>
              <Icon name="download" size={13} /> CSV
            </button>
          </div>

          {loading && <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>Loading…</div>}

          {!loading && filtered.length === 0 && (
            <div style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
              {search ? 'No invoices match your search.' : 'No invoices yet. Create your first one.'}
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr>
                {['Invoice', 'Client', 'Amount', 'Status', 'Due', ''].map((h, i) => (
                  <th key={i} style={{ textAlign: i === 2 ? 'right' : 'left', padding: '10px 16px', fontSize: 'var(--text-2xs)', fontWeight: 'var(--fw-bold)', letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase', color: 'var(--text-subtle)' }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {filtered.map((inv, i) => {
                  const clientName = inv.clients?.name || '—';
                  const isOverdue  = inv.status !== 'paid' && inv.due_date && new Date(inv.due_date) < new Date();
                  return (
                    <tr key={inv.id || i} style={{ borderTop: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '10px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-body)' }}>
                          {inv.invoice_no}
                          {inv.is_recurring && <Icon name="repeat" size={12} style={{ color: 'var(--blue-500)' }} title={`Repeats ${inv.recurrence_interval || 'monthly'}`} />}
                        </div>
                        <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-muted)', marginTop: 2 }}>{inv.currency || 'PKR'}</div>
                      </td>
                      <td style={{ padding: '10px 16px', fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)' }}>{clientName}</td>
                      <td style={{ padding: '10px 16px', textAlign: 'right', fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-bold)', color: 'var(--text-strong)', fontVariantNumeric: 'tabular-nums' }}>
                        {fmtAmt(inv.amount, inv.currency)}
                        {(inv.currency || 'PKR') !== 'PKR' && rates && (
                          <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-muted)', fontWeight: 'var(--fw-medium)', marginTop: 2 }}>
                            ≈ {fmtAmt(toPKR(inv.amount, inv.currency), 'PKR')}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '10px 16px' }}>
                        <select value={inv.status} onChange={e => handleStatusChange(inv, e.target.value)} style={selectStyle}>
                          <option value="draft">Draft</option>
                          <option value="sent">Sent</option>
                          <option value="paid">Paid</option>
                          <option value="overdue">Overdue</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td style={{ padding: '10px 16px', fontSize: 'var(--text-sm)', color: isOverdue ? 'var(--red-600)' : 'var(--text-muted)', fontWeight: isOverdue ? 'var(--fw-semibold)' : undefined }}>{fmtDate(inv.due_date)}</td>
                      <td style={{ padding: '10px 16px' }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button onClick={() => openEdit(inv)} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, height: 27, padding: '0 9px', background: 'transparent', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-muted)', cursor: 'pointer' }}>
                            <Icon name="pencil" size={11} /> Edit
                          </button>
                          <button onClick={() => printInvoicePDF(inv, clients)} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, height: 27, padding: '0 9px', background: 'transparent', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-semibold)', color: 'var(--blue-600)', cursor: 'pointer' }}>
                            <Icon name="file-down" size={11} /> PDF
                          </button>
                          <button onClick={() => setShareInv(inv)} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, height: 27, padding: '0 9px', background: 'transparent', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-semibold)', color: 'var(--green-600)', cursor: 'pointer' }}>
                            <Icon name="share-2" size={11} /> Share
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </Card>
      </div>
      </>
      )}

      {activeTab === 'expenses' && (
      <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 16 }}>
        <StatCard label="Total expenses (PKR)" value={fmtAmt(totalExpenses, 'PKR')} delta="—" icon={<Icon name="wallet" />}       tone="warning" />
        <StatCard label="Salaries (PKR)"       value={fmtAmt(totalSalaries, 'PKR')} delta="—" icon={<Icon name="user-plus" />}   tone="violet" />
        <StatCard label="This month (PKR)"     value={fmtAmt(monthExpenses, 'PKR')} delta="—" icon={<Icon name="calendar" />}     tone="info" />
        <StatCard label="Entries"             value={String(expenses.length)}      delta="—" icon={<Icon name="receipt" />}      tone="brand" />
      </div>

      <Card padding="none">
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--fw-bold)', flex: 1 }}>Expenses</h3>
          <div style={{ position: 'relative' }}>
            <Icon name="search" size={14} style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
            <input value={expSearch} onChange={e => setExpSearch(e.target.value)} placeholder="Search expenses…" style={{ height: 32, padding: '0 10px 0 28px', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', color: 'var(--text-body)', background: 'var(--slate-50)', outline: 'none', width: 200 }} />
          </div>
          <button onClick={handleExportExpensesCSV} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 32, padding: '0 11px', background: 'var(--slate-0)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-body)', cursor: 'pointer' }}>
            <Icon name="download" size={13} /> CSV
          </button>
        </div>

        {expLoading && <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>Loading…</div>}

        {!expLoading && filteredExpenses.length === 0 && (
          <div style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
            {expSearch ? 'No expenses match your search.' : 'No expenses yet. Log your first one — salaries, tools, ads, and more.'}
          </div>
        )}

        {!expLoading && filteredExpenses.length > 0 && (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr>
              {['Description', 'Category', 'Amount', 'Date', 'Project / Client', ''].map((h, i) => (
                <th key={i} style={{ textAlign: i === 2 ? 'right' : 'left', padding: '10px 16px', fontSize: 'var(--text-2xs)', fontWeight: 'var(--fw-bold)', letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase', color: 'var(--text-subtle)' }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filteredExpenses.map((exp, i) => {
                const cat = EXPENSE_CATEGORIES[exp.category] || EXPENSE_CATEGORIES.other;
                return (
                  <tr key={exp.id || i} style={{ borderTop: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '10px 16px', fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)' }}>{exp.description}</td>
                    <td style={{ padding: '10px 16px' }}><Badge tone={cat.tone} size="sm">{cat.label}</Badge></td>
                    <td style={{ padding: '10px 16px', textAlign: 'right', fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-bold)', color: 'var(--text-strong)', fontVariantNumeric: 'tabular-nums' }}>
                      {fmtAmt(exp.amount, exp.currency || 'PKR')}
                      {(exp.currency || 'PKR') !== 'PKR' && rates && (
                        <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-muted)', fontWeight: 'var(--fw-medium)', marginTop: 2 }}>
                          ≈ {fmtAmt(toPKR(exp.amount, exp.currency), 'PKR')}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '10px 16px', fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>{fmtDate(exp.date)}</td>
                    <td style={{ padding: '10px 16px', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{exp.projects?.name || exp.clients?.name || '—'}</td>
                    <td style={{ padding: '10px 16px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => openEditExpense(exp)} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, height: 27, padding: '0 9px', background: 'transparent', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-muted)', cursor: 'pointer' }}>
                          <Icon name="pencil" size={11} /> Edit
                        </button>
                        <button onClick={() => handleDeleteExpense(exp)} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, height: 27, padding: '0 9px', background: 'transparent', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-semibold)', color: 'var(--red-600)', cursor: 'pointer' }}>
                          <Icon name="trash-2" size={11} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </Card>
      </>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editInv ? 'Edit invoice' : 'New invoice'} onSubmit={handleSave} loading={saving} submitLabel={editInv ? 'Save changes' : 'Create invoice'}>
        <div style={FF.row2}>
          <FormRow label="Invoice #" required>
            <input style={FF.input} placeholder="INV-2026-001" value={form.invoice_no} onChange={e => set('invoice_no', e.target.value)} />
          </FormRow>
          <FormRow label="Status">
            <select style={FF.select} value={form.status} onChange={e => set('status', e.target.value)}>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </FormRow>
        </div>
        <FormRow label="Client">
          <select style={FF.select} value={form.client_id} onChange={e => set('client_id', e.target.value)}>
            <option value="">No client</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.company || c.name}</option>)}
          </select>
        </FormRow>
        <FormRow label="Line items (optional — leave empty to just enter a total amount)">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {items.map((it, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 60px 90px 24px', gap: 6, alignItems: 'center' }}>
                <input style={FF.input} placeholder="Description (e.g. Website Design)" value={it.description} onChange={e => setItemField(i, 'description', e.target.value)} />
                <input style={{ ...FF.input, padding: '0 6px', textAlign: 'center' }} type="number" min="0" placeholder="Qty" value={it.qty} onChange={e => setItemField(i, 'qty', e.target.value)} />
                <input style={{ ...FF.input, padding: '0 6px' }} type="number" min="0" placeholder="Unit price" value={it.unit_price} onChange={e => setItemField(i, 'unit_price', e.target.value)} />
                <button onClick={() => removeItemRow(i)} type="button" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, background: 'transparent', border: 'none', color: 'var(--red-500)', cursor: 'pointer' }}>
                  <Icon name="x" size={14} />
                </button>
              </div>
            ))}
            <button onClick={addItemRow} type="button" style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 5, height: 28, padding: '0 10px', background: 'transparent', border: '1px dashed var(--border-default)', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-body)', cursor: 'pointer' }}>
              <Icon name="plus" size={12} /> Add item
            </button>
          </div>
        </FormRow>
        <div style={FF.row2}>
          <FormRow label={items.filter(it => it.description.trim()).length ? 'Amount (total of line items)' : 'Amount'}>
            <input style={FF.input} type="number" placeholder="0" disabled={!!items.filter(it => it.description.trim()).length}
              value={items.filter(it => it.description.trim()).length ? itemsTotal : form.amount}
              onChange={e => set('amount', e.target.value)} />
          </FormRow>
          <FormRow label="Currency">
            <select style={FF.select} value={form.currency} onChange={e => set('currency', e.target.value)}>
              {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.symbol} {c.name} ({c.code})</option>)}
            </select>
          </FormRow>
        </div>
        <FormRow label="Convert to (preview only — doesn't change the invoice)">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <select style={{ ...FF.select, flex: '0 0 auto', width: 100 }} value={previewCurrency} onChange={e => setPreviewCurrency(e.target.value)}>
              {CURRENCIES.filter(c => c.code !== form.currency).map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
            </select>
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-bold)', color: 'var(--text-strong)', fontVariantNumeric: 'tabular-nums' }}>
              {(items.filter(it => it.description.trim()).length ? itemsTotal : form.amount)
                ? (rates
                    ? fmtAmt(convertCurrency(items.filter(it => it.description.trim()).length ? itemsTotal : form.amount, form.currency, previewCurrency, rates), previewCurrency)
                    : 'Rates loading…')
                : '—'}
            </span>
          </div>
        </FormRow>
        <FormRow label="Due date">
          <input style={FF.input} type="date" value={form.due_date} onChange={e => set('due_date', e.target.value)} />
        </FormRow>
        <FormRow label="Repeat">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 'var(--text-sm)', color: 'var(--text-body)', cursor: 'pointer' }}>
              <input type="checkbox" checked={!!form.is_recurring} onChange={e => set('is_recurring', e.target.checked)} />
              Auto-create the next invoice
            </label>
            {form.is_recurring && (
              <select style={{ ...FF.select, flex: '0 0 auto', width: 140 }} value={form.recurrence_interval} onChange={e => set('recurrence_interval', e.target.value)}>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
              </select>
            )}
          </div>
          {form.is_recurring && (
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 6 }}>
              A new draft invoice for the same client/amount will be created automatically {form.recurrence_interval} after the due date above.
            </div>
          )}
        </FormRow>
      </Modal>

      {shareInv && <ShareInvoiceModal inv={shareInv} clients={clients} onClose={() => setShareInv(null)} />}

      <Modal open={expModalOpen} onClose={() => setExpModalOpen(false)} title={editExp ? 'Edit expense' : 'Add expense'} onSubmit={handleSaveExpense} loading={expSaving} submitLabel={editExp ? 'Save changes' : 'Add expense'}>
        <FormRow label="Description" required>
          <input style={FF.input} placeholder="e.g. July salary — Ali Raza" value={expForm.description} onChange={e => setEx('description', e.target.value)} />
        </FormRow>
        <div style={FF.row2}>
          <FormRow label="Category">
            <select style={FF.select} value={expForm.category} onChange={e => setEx('category', e.target.value)}>
              {Object.entries(EXPENSE_CATEGORIES).map(([id, c]) => <option key={id} value={id}>{c.label}</option>)}
            </select>
          </FormRow>
          <FormRow label="Amount" required>
            <input style={FF.input} type="number" placeholder="0" value={expForm.amount} onChange={e => setEx('amount', e.target.value)} />
          </FormRow>
        </div>
        <FormRow label="Currency">
          <select style={FF.select} value={expForm.currency} onChange={e => setEx('currency', e.target.value)}>
            {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.symbol} {c.name} ({c.code})</option>)}
          </select>
        </FormRow>
        <FormRow label="Convert to (preview only — doesn't change the expense)">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <select style={{ ...FF.select, flex: '0 0 auto', width: 100 }} value={expPreviewCurrency} onChange={e => setExpPreviewCurrency(e.target.value)}>
              {CURRENCIES.filter(c => c.code !== expForm.currency).map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
            </select>
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-bold)', color: 'var(--text-strong)', fontVariantNumeric: 'tabular-nums' }}>
              {expForm.amount
                ? (rates
                    ? fmtAmt(convertCurrency(expForm.amount, expForm.currency, expPreviewCurrency, rates), expPreviewCurrency)
                    : 'Rates loading…')
                : '—'}
            </span>
          </div>
        </FormRow>
        <div style={FF.row2}>
          <FormRow label="Date">
            <input style={FF.input} type="date" value={expForm.date} onChange={e => setEx('date', e.target.value)} />
          </FormRow>
          <FormRow label="Project (optional)">
            <select style={FF.select} value={expForm.project_id} onChange={e => setEx('project_id', e.target.value)}>
              <option value="">No project</option>
              {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </FormRow>
        </div>
        <FormRow label="Client (optional)">
          <select style={FF.select} value={expForm.client_id} onChange={e => setEx('client_id', e.target.value)}>
            <option value="">No client</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.company || c.name}</option>)}
          </select>
        </FormRow>
      </Modal>
    </div>
  );
}

Object.assign(window, { Finance });
})();
