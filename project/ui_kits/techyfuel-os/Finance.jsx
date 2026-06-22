// Finance screen — revenue, profit, invoices.
(() => {
const { Card, Badge, Avatar, StatCard } = window.TechyFuelOSDesignSystem_be0222;
const PROFIT = [12, 14, 13, 17, 16, 19, 21, 20, 24, 23, 26, 29];

const IS = {
  paid:      ['success', 'Paid'],
  sent:      ['info',    'Sent'],
  overdue:   ['danger',  'Overdue'],
  draft:     ['neutral', 'Draft'],
  cancelled: ['neutral', 'Cancelled'],
};

const FALLBACK_INVOICES = [
  { id: 'f1', invoice_no: 'INV-2025-001', clients: { name: 'Nova Tech' },    amount: 4500, status: 'paid',    due_date: '2025-06-01' },
  { id: 'f2', invoice_no: 'INV-2025-002', clients: { name: 'Bloom Foods' },  amount: 2800, status: 'sent',    due_date: '2025-06-30' },
  { id: 'f3', invoice_no: 'INV-2025-003', clients: { name: 'Apex Realty' },  amount: 3200, status: 'overdue', due_date: '2025-06-15' },
  { id: 'f4', invoice_no: 'INV-2025-004', clients: { name: 'Spark Academy' },amount: 1900, status: 'draft',   due_date: '2025-07-15' },
];

function fmtAmt(n) {
  if (!n && n !== 0) return '$0';
  return '$' + Number(n).toLocaleString();
}
function fmtDate(ds) {
  if (!ds) return '—';
  return new Date(ds).toLocaleDateString('en', { month: 'short', day: 'numeric', year: '2-digit' });
}

function Finance() {
  const [invoices, setInvoices] = React.useState(FALLBACK_INVOICES);

  React.useEffect(() => {
    if (!window.API) return;
    window.API.getInvoices().then(r => {
      if (r.data && r.data.length > 0) setInvoices(r.data);
    }).catch(() => {});
  }, []);

  const paidRevenue = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + Number(i.amount || 0), 0);
  const outstanding = invoices.filter(i => i.status === 'sent' || i.status === 'overdue').reduce((s, i) => s + Number(i.amount || 0), 0);
  const totalAmount = invoices.reduce((s, i) => s + Number(i.amount || 0), 0);
  const now = new Date();
  const monthName = now.toLocaleDateString('en', { month: 'long', year: 'numeric' });

  return (
    <div style={{ padding: 24, maxWidth: 1280, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--fw-extrabold)', letterSpacing: '-0.02em' }}>Finance</h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 2 }}>{monthName} · {invoices.length} invoices</p>
        </div>
        <button style={{ display: 'inline-flex', alignItems: 'center', gap: 7, height: 36, padding: '0 14px', background: 'var(--blue-600)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-brand)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', cursor: 'pointer' }}>
          <Icon name="plus" size={16} /> New invoice
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 16 }}>
        <StatCard label="Revenue (paid)" value={fmtAmt(paidRevenue)} delta="12.5%" icon={<Icon name="trending-up" />} tone="success" />
        <StatCard label="Total invoiced" value={fmtAmt(totalAmount)} delta="8.4%" icon={<Icon name="receipt" />} tone="brand" />
        <StatCard label="Outstanding" value={fmtAmt(outstanding)} delta="—" icon={<Icon name="clock" />} tone="warning" />
        <StatCard label="Invoices" value={String(invoices.length)} delta="—" icon={<Icon name="file-text" />} tone="violet" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16 }}>
        <Card padding="lg">
          <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--fw-bold)', marginBottom: 4 }}>Net profit</h3>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--fw-extrabold)', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>$232K</span>
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-bold)', color: 'var(--green-600)' }}>+18% YTD</span>
          </div>
          <Bars data={PROFIT} color="var(--green-500)" highlight="var(--green-600)" height={140} />
        </Card>
        <Card padding="none">
          <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--fw-bold)' }}>Invoices</h3>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-body)', cursor: 'pointer' }}><Icon name="download" size={14} /> Export</span>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr>
              {['Invoice', 'Client', 'Amount', 'Status', 'Due'].map((h, i) => (
                <th key={h} style={{ textAlign: i === 2 ? 'right' : 'left', padding: '10px 18px', fontSize: 'var(--text-2xs)', fontWeight: 'var(--fw-bold)', letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase', color: 'var(--text-subtle)' }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {invoices.map((inv, i) => {
                const [t, l] = IS[inv.status] || ['neutral', inv.status];
                const clientName = inv.clients ? inv.clients.name : '—';
                return (
                  <tr key={inv.id || i} style={{ borderTop: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '11px 18px', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-body)' }}>{inv.invoice_no}</td>
                    <td style={{ padding: '11px 18px', fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)' }}>{clientName}</td>
                    <td style={{ padding: '11px 18px', textAlign: 'right', fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-bold)', color: 'var(--text-strong)', fontVariantNumeric: 'tabular-nums' }}>{fmtAmt(inv.amount)}</td>
                    <td style={{ padding: '11px 18px' }}><Badge tone={t} dot>{l}</Badge></td>
                    <td style={{ padding: '11px 18px', fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>{fmtDate(inv.due_date)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
Object.assign(window, { Finance });
})();
