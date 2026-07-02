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

// ── PDF invoice print ─────────────────────────────────────────────
function printInvoicePDF(inv, clients) {
  const saved = (() => { try { return JSON.parse(localStorage.getItem('tf_settings') || '{}'); } catch { return {}; } })();
  const agencyName  = saved.agencyName  || 'TechyFuel OS';
  const agencyEmail = saved.agencyEmail || '';
  const clientName  = inv.clients?.name || '—';
  const currency    = inv.currency || 'PKR';
  const sym         = getCurrencySymbol(currency);
  const amount      = fmtAmt(inv.amount, currency);
  const status      = IS[inv.status] || { label: inv.status };
  const statusColors = { paid: '#16a34a', sent: '#2563eb', overdue: '#dc2626', draft: '#64748b', cancelled: '#94a3b8' };
  const statusColor  = statusColors[inv.status] || '#64748b';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>Invoice ${inv.invoice_no}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #0f172a; background: #fff; padding: 48px; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 48px; }
  .brand { font-size: 22px; font-weight: 800; letter-spacing: -0.02em; color: #1e40af; }
  .brand-sub { font-size: 12px; color: #64748b; margin-top: 4px; }
  .invoice-label { text-align: right; }
  .invoice-label h1 { font-size: 32px; font-weight: 900; letter-spacing: -0.03em; color: #0f172a; }
  .invoice-label .inv-no { font-size: 13px; color: #64748b; font-family: monospace; margin-top: 4px; }
  .meta { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 32px; margin-bottom: 40px; padding: 24px; background: #f8fafc; border-radius: 10px; }
  .meta-item label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #94a3b8; display: block; margin-bottom: 6px; }
  .meta-item span { font-size: 14px; font-weight: 600; color: #0f172a; }
  .status-badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 12px; font-weight: 700; background: ${statusColor}18; color: ${statusColor}; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
  th { text-align: left; padding: 10px 16px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: #94a3b8; border-bottom: 2px solid #e2e8f0; }
  td { padding: 14px 16px; font-size: 14px; color: #334155; border-bottom: 1px solid #f1f5f9; }
  .amount-col { text-align: right; font-weight: 700; font-size: 15px; color: #0f172a; }
  .totals { margin-left: auto; width: 280px; }
  .totals-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; color: #64748b; }
  .totals-row.total { border-top: 2px solid #0f172a; padding-top: 14px; margin-top: 6px; font-size: 20px; font-weight: 800; color: #0f172a; }
  .footer { margin-top: 56px; padding-top: 20px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-size: 12px; color: #94a3b8; }
  @media print {
    body { padding: 24px; }
    @page { margin: 12mm; }
  }
</style>
</head>
<body>
<div class="header">
  <div>
    <div class="brand">${agencyName}</div>
    ${agencyEmail ? `<div class="brand-sub">${agencyEmail}</div>` : ''}
  </div>
  <div class="invoice-label">
    <h1>INVOICE</h1>
    <div class="inv-no">${inv.invoice_no}</div>
  </div>
</div>

<div class="meta">
  <div class="meta-item">
    <label>Billed to</label>
    <span>${clientName}</span>
  </div>
  <div class="meta-item">
    <label>Due date</label>
    <span>${fmtDate(inv.due_date)}</span>
  </div>
  <div class="meta-item">
    <label>Status</label>
    <span class="status-badge">${status.label}</span>
  </div>
</div>

<table>
  <thead>
    <tr>
      <th>Description</th>
      <th>Currency</th>
      <th style="text-align:right">Amount</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Services — ${inv.invoice_no}</td>
      <td>${currency}</td>
      <td class="amount-col">${amount}</td>
    </tr>
  </tbody>
</table>

<div class="totals">
  <div class="totals-row"><span>Subtotal</span><span>${amount}</span></div>
  <div class="totals-row total"><span>Total</span><span>${amount}</span></div>
</div>

<div class="footer">
  <span>Generated by ${agencyName}</span>
  <span>${new Date().toLocaleDateString('en', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
</div>

<script>window.onload = function() { window.print(); };<\/script>
</body>
</html>`;

  const win = window.open('', '_blank', 'width=900,height=700');
  if (win) { win.document.write(html); win.document.close(); }
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
  const [fxRates, setFxRates] = React.useState(null); // { base: 'USD', rates: { PKR: 278.5, ... }, fetchedAt }
  const [previewCurrency, setPreviewCurrency] = React.useState('PKR');

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
    setForm({ invoice_no: '', client_id: '', amount: '', due_date: '', status: 'draft', currency: 'USD' });
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
    });
    setModalOpen(true);
  }

  async function handleSave() {
    if (!form.invoice_no.trim()) return;
    setSaving(true);
    try {
      const payload = { invoice_no: form.invoice_no, status: form.status, currency: form.currency };
      if (form.client_id) payload.client_id = form.client_id;
      if (form.amount)    payload.amount    = Number(form.amount);
      if (form.due_date)  payload.due_date  = form.due_date;
      const clientObj = clients.find(c => c.id === form.client_id);
      const clientsData = clientObj ? { name: clientObj.company || clientObj.name } : null;

      if (editInv && window.API) {
        const { data } = await window.API.updateInvoice(editInv.id, payload);
        if (data) setInvoices(prev => prev.map(i => i.id === editInv.id ? { ...data, clients: clientsData || i.clients } : i));
      } else if (window.API) {
        const { data } = await window.API.createInvoice(payload);
        if (data) setInvoices(prev => [{ ...data, clients: clientsData }, ...prev]);
      }
      setModalOpen(false);
    } catch {}
    finally { setSaving(false); }
  }

  async function handleStatusChange(inv, newStatus) {
    if (!window.API) return;
    try {
      await window.API.updateInvoice(inv.id, { status: newStatus });
      setInvoices(prev => prev.map(i => i.id === inv.id ? { ...i, status: newStatus } : i));
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
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-body)' }}>{inv.invoice_no}</div>
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
        <div style={FF.row2}>
          <FormRow label="Amount">
            <input style={FF.input} type="number" placeholder="0" value={form.amount} onChange={e => set('amount', e.target.value)} />
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
              {form.amount
                ? (rates
                    ? fmtAmt(convertCurrency(form.amount, form.currency, previewCurrency, rates), previewCurrency)
                    : 'Rates loading…')
                : '—'}
            </span>
          </div>
        </FormRow>
        <FormRow label="Due date">
          <input style={FF.input} type="date" value={form.due_date} onChange={e => set('due_date', e.target.value)} />
        </FormRow>
      </Modal>

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
