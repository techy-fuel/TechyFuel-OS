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
    signatureImageUrl: saved.signatureImageUrl || '',
    servicesLine:  saved.servicesLine  || '',
  };
}

// The real ribbon graphic, traced straight from the client's own vector
// design file (real <path> data, not a raster approximation) — inlined
// directly as SVG markup rather than an <img src>. An earlier version
// used a base64 PNG via <img>, but testing showed the invoice's
// window.open()+document.write()+window.print() popup can fire print
// before an external/decoded image finishes, silently dropping it from
// the exported PDF; inline SVG has no decode step so it's always ready.
// Header and footer use different paths (not a plain mirror) because
// the original art recolors which slat continues into the rule line —
// blue into the blue top line, dark into the dark bottom line.
function invoiceRibbonSvg(isFooter) {
  const svg = isFooter ? `<svg viewBox="1650 3085 710 324" style="display:block;height:96px;width:auto;overflow:visible">
      <defs>
        <linearGradient id="invRibbonFooterBlue1" gradientUnits="userSpaceOnUse" x1="1658.7872" y1="3258.478" x2="1949.4452" y2="3258.478">
          <stop offset="0" stop-color="#0A45C6"/><stop offset="1" stop-color="#1371E0"/>
        </linearGradient>
        <linearGradient id="invRibbonFooterBlue2" gradientUnits="userSpaceOnUse" x1="2059.9717" y1="3225.9062" x2="2351.1702" y2="3225.9062">
          <stop offset="0" stop-color="#0A45C6"/><stop offset="1" stop-color="#1371E0"/>
        </linearGradient>
      </defs>
      <path fill="#3B3B3B" d="M2540.1,3101c-2.5,0.1-5,0.3-7.4,0.3c-78.1,0-156.1,0-234.2,0.1c-12.6,0-25.1,1.1-37.3,4.7
        c-23.8,7.1-42.8,21-58.6,40c-46.5,55.8-93.3,111.2-139.9,166.8c-16.1,19.2-32,38.5-48.4,57.4c-18.1,20.9-41.3,32.8-68.4,37.3
        c-1.1,0.2-2.2,0.5-3.4,0.8c-644.9,0-1289.8,0-1934.7,0.1c-3.7,0-4.9-0.8-4.6-4.6c0.4-3.8,0.1-7.6,0.1-11.4c2.8-0.1,5.6-0.3,8.4-0.3
        c562.7,0,1125.5,0,1688.2,0c32,0,60.3-9.6,83.6-32c11.5-11,20.9-23.9,31.2-36.1c46.1-54.8,92-109.6,138.1-164.4
        c8.9-10.7,18-21.2,26.8-32c19-23.1,43.3-37.1,72.8-41.8c0.8-0.1,1.6-0.5,2.4-0.7c160.3,0,320.5,0,480.8-0.1c3.7,0,4.9,0.8,4.6,4.6
        C2539.8,3093.4,2540.1,3097.2,2540.1,3101z"/>
      <path fill="url(#invRibbonFooterBlue1)" d="M1658.8,3372.6
        c3.4-7.4,9.5-12.7,14.5-18.8c31.8-38.2,63.8-76.2,95.7-114.2c17.4-20.7,34.4-41.7,52.3-62c16-18.1,36.6-28.8,60.6-31.8
        c21.4-2.6,43-0.7,64.5-1.1c1.1,0,2.5-0.2,3,1.1c0.4,1.2-0.7,2.1-1.4,2.9c-9.4,11.3-18.8,22.5-28.2,33.7
        c-21.4,25.4-42.7,50.9-64.1,76.3c-22.9,27.3-45.4,55.1-69,81.8c-16.5,18.6-38.1,28.6-62.9,31.1c-1.8,0.2-3.6,0-5.2,0.9
        C1698.6,3372.6,1678.7,3372.6,1658.8,3372.6z"/>
      <path fill="url(#invRibbonFooterBlue2)" d="M2351.2,3113.4c-8.8,9-16.3,19-24.4,28.5
        c-28.4,33.6-56.6,67.3-84.9,101c-17.6,20.9-35.1,42-52.9,62.8c-15.8,18.4-36.2,29-60,32.8c-13.1,2.1-26.3,0.7-39.5,1
        c-8.3,0.2-16.6,0.1-24.9,0c-1.5,0-3.6,0.8-4.4-1c-0.6-1.4,1.1-2.6,2-3.6c10.6-12.8,21.3-25.5,32-38.2
        c21.5-25.6,42.9-51.1,64.4-76.7c21-25.1,41.7-50.4,63.3-75.1c15.3-17.5,35.2-27.6,58.2-31.5c1.3-0.2,2.5-0.6,3.8-0.9
        c21.2,0,42.4,0,63.6,0.1C2348.5,3112.5,2350.3,3111.4,2351.2,3113.4z"/>
    </svg>` : `<svg viewBox="900 131 700 366" style="display:block;height:96px;width:auto;overflow:visible">
      <defs>
        <linearGradient id="invRibbonHeaderBlue" gradientUnits="userSpaceOnUse" x1="1470.498" y1="795.4946" x2="1004.796" y2="-331.9948">
          <stop offset="0" stop-color="#0A45C6"/><stop offset="1" stop-color="#1371E0"/>
        </linearGradient>
      </defs>
      <path fill="url(#invRibbonHeaderBlue)" d="M2541,149.5c-2.8,0.1-5.6,0.2-8.4,0.2c-298.5,0-597.1,0-895.6,0c-31.2,0-59.5,8.9-84,28.6
        c-11.3,9.1-20.3,20.4-29.6,31.5c-30.9,36.8-61.9,73.6-92.8,110.4c-29.9,35.7-59.7,71.5-89.8,107c-12.5,14.8-23.8,30.7-39.4,42.6
        c-18.5,14.1-39.1,23-62.1,26.1c-1,0.1-1.9,0.5-2.8,0.8c-409.8,0-819.7,0-1229.5,0.1c-3.7,0-4.9-0.8-4.6-4.6
        c0.4-4.4,0.1-8.9,0.1-13.4c2.8-0.1,5.6-0.3,8.4-0.3c317.4,0,634.8,0,952.3,0c32.1,0,61.2-8.5,86.4-28.8
        c13.6-10.9,23.8-24.9,34.9-38c34.3-40.7,68.5-81.5,102.7-122.2c30.5-36.3,61.1-72.5,91.4-109c22.2-26.7,49.9-43.1,84.3-48.2
        c1-0.1,1.9-0.5,2.8-0.8c390.3,0,780.5,0,1170.8-0.1c3.7,0,4.9,0.8,4.6,4.6C2540.7,140.5,2541,145,2541,149.5z"/>
      <path fill="#3B3B3B" d="M1692.1,168.4c-1.7,5.4-6.1,8.8-9.5,12.9c-42.6,50.9-85.3,101.7-128,152.5c-15.6,18.6-30.9,37.4-47,55.6
        c-19,21.4-43.1,34.1-71.7,37c-24,2.4-48.2,0.5-72.2,1c-1.1,0-2.6,0.4-3-1c-0.4-1.4,0.9-2.4,1.7-3.3c10.9-13.1,21.9-26.1,32.8-39.2
        c33.6-40,67.3-80.1,100.9-120.1c16.1-19.2,31.9-38.8,48.5-57.5c19.8-22.3,45-34.5,74.7-37.2c1.3-0.1,2.6-0.5,3.8-0.7
        C1646.2,168.4,1669.1,168.4,1692.1,168.4z"/>
      <path fill="#3B3B3B" d="M904.7,464.6c2.2-5.7,6.8-9.5,10.6-14c44.2-52.8,88.5-105.5,132.8-158.3c13.9-16.6,27.5-33.5,42-49.6
        c18.8-20.9,42.7-33.2,70.7-36.1c24-2.6,48.2-0.6,72.3-1c1.1,0,2.6-0.4,3.1,0.9c0.6,1.7-0.9,2.7-1.8,3.7
        c-14.2,17-28.5,33.9-42.7,50.9c-42.3,50.4-84.6,100.7-126.8,151.1c-11.8,14.2-23.9,27.9-40.3,37.1c-14.5,8.2-29.9,13.3-46.5,14.6
        c-1.1,0.1-2.2,0.5-3.3,0.7C951.3,464.6,928,464.6,904.7,464.6z"/>
    </svg>`;
  // Anchored to the header's own BOTTOM edge (right where the dark rule
  // sits) / the footer's own TOP edge (where its rule sits) so the
  // graphic bridges from just above one rule line down to the other,
  // same as the reference — not floating with a gap.
  const posStyle = isFooter ? 'top:-2px' : 'bottom:-2px';
  return `<div style="position:absolute;${posStyle};right:360px;">${svg}</div>`;
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
  const clientName  = inv.clients?.name || clientObj.name || clientObj.company || '—';
  const clientEmail = clientObj.email || '';
  const clientPhone = clientObj.phone || '';
  const currency    = inv.currency || 'PKR';
  const items       = invoiceItemsOf(inv);
  const total       = items.reduce((s, it) => s + (Number(it.qty) || 0) * (Number(it.unit_price) || 0), 0);
  const rowsHtml = items.map((it, i) => `
    <tr style="background:${i % 2 ? '#f0f1f3' : '#fafafa'}">
      <td style="padding:14px 18px;font-size:14px;font-weight:600;color:#1e293b">${it.description}</td>
      <td style="padding:14px 18px;font-size:14px;color:#334155;text-align:center">${String(Number(it.qty) || 0).padStart(2, '0')}</td>
      <td style="padding:14px 18px;font-size:14px;color:#334155;text-align:center">${fmtAmt(it.unit_price, currency)}</td>
      <td style="padding:14px 18px;font-size:14px;font-weight:700;color:#0f172a;text-align:center;background:rgba(15,23,42,0.05)">${fmtAmt((Number(it.qty) || 0) * (Number(it.unit_price) || 0), currency)}</td>
    </tr>`).join('');

  const noteLines = (inv.notes || '').split('\n').map(l => l.trim()).filter(Boolean);
  const notesHtml = (noteLines.length ? noteLines : [
    `Thank you for choosing ${b.agencyName}.`,
    'Payment is due on or before the due date above.',
    'Please include the Invoice Number as your payment reference.',
  ]).map(l => `<li>${l}</li>`).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>Invoice ${inv.invoice_no}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; color-adjust: exact; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #0f172a; background: #fff; }
  .sheet { position: relative; max-width: 860px; margin: 0 auto; }
  .topbar { height: 5px; background: #2563eb; }
  .header { position: relative; display: flex; justify-content: space-between; padding: 26px 48px 20px; overflow: visible; }
  .header.with-tagline { align-items: flex-start; min-height: 130px; }
  .header.compact { align-items: center; min-height: 90px; }
  .brand-row { display: flex; align-items: center; gap: 12px; position: relative; z-index: 2; }
  .brand-row img { height: 52px; object-fit: contain; }
  .brand { font-size: 22px; font-weight: 800; letter-spacing: -0.02em; color: #0f172a; }
  .invoice-box { text-align: right; position: relative; z-index: 2; }
  .invoice-box .tagline { font-size: 12px; font-weight: 600; color: #475569; margin-bottom: 2px; }
  .invoice-box h1 { font-size: 34px; font-weight: 800; letter-spacing: 0.02em; color: #1e293b; }
  .rule-dark { height: 3px; background: #1f2937; }
  .services-line { padding: 10px 48px; font-size: 11px; color: #475569; }
  .billto-row { display: flex; justify-content: space-between; align-items: flex-start; padding: 26px 48px 22px; }
  .billto label { font-size: 13px; color: #334155; display: block; margin-bottom: 4px; }
  .billto .name { font-size: 17px; font-weight: 800; color: #2563eb; text-transform: uppercase; }
  .billto .sub { font-size: 12px; color: #64748b; margin-top: 2px; }
  .billto .contact-line { font-size: 12px; color: #334155; margin-top: 6px; }
  .invoice-no-box { display: inline-block; background: #2563eb; color: #fff; font-size: 15px; font-weight: 700; padding: 8px 18px; border-radius: 3px; letter-spacing: 0.02em; margin-bottom: 8px; }
  .meta-right { text-align: right; font-size: 12px; color: #334155; }
  .meta-right .row { display: flex; justify-content: flex-end; gap: 14px; }
  .meta-right .row span:first-child { color: #64748b; }
  .meta-right .row span:last-child { font-weight: 700; color: #0f172a; min-width: 90px; text-align: left; }
  table { width: calc(100% - 96px); margin: 0 48px 24px; border-collapse: collapse; }
  thead th { text-align: left; padding: 13px 18px; font-size: 14px; font-weight: 700; color: #fff; background: #1f2937; }
  thead th:first-child { background: linear-gradient(90deg, #1d4ed8, #3b82f6); }
  thead th:nth-child(2), thead th:nth-child(3), thead th:nth-child(4) { text-align: center; }
  .lower-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 24px; padding: 0 48px 24px; }
  .payment h3 { font-size: 14px; font-weight: 700; color: #2563eb; margin-bottom: 10px; }
  .payment .row { font-size: 12px; color: #334155; margin-bottom: 5px; }
  .payment .row b { color: #0f172a; display: inline-block; width: 80px; }
  .total-box { background: #2563eb; color: #fff; display: flex; align-items: center; justify-content: space-between; gap: 24px; padding: 14px 22px; border-radius: 3px; min-width: 260px; }
  .total-box .label { font-size: 15px; font-weight: 700; }
  .total-box .value { font-size: 20px; font-weight: 800; }
  .thanks-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 24px; padding: 0 48px 28px; }
  .thanks { font-size: 16px; font-weight: 800; color: #0f172a; margin-bottom: 6px; }
  .notes h4 { font-size: 13px; font-weight: 700; color: #2563eb; margin-bottom: 6px; }
  .notes ul { list-style: none; font-size: 11px; color: #475569; max-width: 320px; }
  .notes li { margin-bottom: 3px; }
  .notes li::before { content: '- '; }
  .signature { text-align: right; }
  .signature img { height: 46px; object-fit: contain; margin-bottom: 2px; }
  .signature .name { font-size: 14px; font-weight: 800; letter-spacing: 0.02em; color: #0f172a; border-top: 1px solid #cbd5e1; padding-top: 6px; margin-top: 4px; min-width: 160px; }
  .signature .title { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; margin-top: 2px; }
  .contact-section { padding: 4px 48px 24px; }
  .contact-section h4 { font-size: 15px; font-weight: 800; color: #2563eb; margin-bottom: 8px; }
  .contact-section .row { font-size: 12px; color: #1e293b; margin-bottom: 3px; }
  .contact-section .row b { display: inline-block; width: 76px; font-weight: 700; }
  .footer { position: relative; overflow: visible; min-height: 70px; }
  .footer .rule-dark { position: relative; z-index: 2; }
  @media print {
    @page { margin: 0; }
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; color-adjust: exact !important; }
  }
</style>
</head>
<body>
<div class="sheet">
  <div class="topbar"></div>
  <div class="header ${b.tagline ? 'with-tagline' : 'compact'}">
    ${invoiceRibbonSvg(false)}
    <div class="brand-row">
      ${b.logoUrl ? `<img src="${b.logoUrl}" alt=""/>` : `<div class="brand">${b.agencyName}</div>`}
    </div>
    <div class="invoice-box">
      ${b.tagline ? `<div class="tagline">${b.tagline}</div>` : ''}
      <h1>INVOICE</h1>
    </div>
  </div>
  <div class="rule-dark"></div>
  ${b.servicesLine ? `<div class="services-line">${b.servicesLine}</div>` : ''}

  <div class="billto-row">
    <div class="billto">
      <label>Invoice To:</label>
      <div class="name">${clientName}</div>
      ${clientObj.company && clientObj.company !== clientName ? `<div class="sub">${clientObj.company}</div>` : ''}
      ${clientPhone ? `<div class="contact-line">P : ${clientPhone}</div>` : ''}
      ${clientEmail ? `<div class="contact-line">E : ${clientEmail}</div>` : ''}
    </div>
    <div class="meta-right">
      <div class="invoice-no-box">INVOICE NO:#${inv.invoice_no}</div>
      <div class="row"><span>Invoice Date</span><span>${fmtDate(inv.created_at || new Date().toISOString())}</span></div>
      <div class="row"><span>Due Date</span><span>${fmtDate(inv.due_date)}</span></div>
    </div>
  </div>

  <table>
    <thead><tr><th>Item description</th><th>Quantity</th><th>Unit Price</th><th>Total Price</th></tr></thead>
    <tbody>${rowsHtml}</tbody>
  </table>

  <div class="lower-row">
    <div class="payment">
      <h3>Payment method</h3>
      ${b.paymentAccount ? `<div class="row"><b>Account</b>${b.paymentAccount}</div>` : ''}
      ${b.paymentSwift ? `<div class="row"><b>Swift</b>${b.paymentSwift}</div>` : ''}
      ${b.paymentPayoneer ? `<div class="row"><b>Payoneer</b>${b.paymentPayoneer}</div>` : ''}
    </div>
    <div class="total-box"><span class="label">Total</span><span class="value">${fmtAmt(total, currency)}</span></div>
  </div>

  <div class="thanks-row">
    <div>
      <div class="thanks">Thanks for your business!</div>
      <div class="notes">
        <h4>Notes</h4>
        <ul>${notesHtml}</ul>
      </div>
    </div>
    ${b.signatureName ? `
    <div class="signature">
      ${b.signatureImageUrl ? `<img src="${b.signatureImageUrl}" alt=""/>` : ''}
      <div class="name">${b.signatureName}</div>
      <div class="title">${b.signatureTitle || ''}</div>
    </div>` : ''}
  </div>

  <div class="contact-section">
    <h4>Contact</h4>
    ${b.agencyPhone ? `<div class="row"><b>Phone</b>: ${b.agencyPhone}</div>` : ''}
    ${b.agencyWebsite ? `<div class="row"><b>Web Site</b>: ${b.agencyWebsite}</div>` : ''}
    ${b.agencyAddress ? `<div class="row"><b>Address</b>: ${b.agencyAddress}</div>` : ''}
    ${b.agencyEmail ? `<div class="row"><b>Email</b>: ${b.agencyEmail}</div>` : ''}
  </div>

  <div class="footer">
    <div class="rule-dark"></div>
    ${invoiceRibbonSvg(true)}
  </div>
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
      const clientsData = clientObj ? { name: clientObj.name || clientObj.company } : null;

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
