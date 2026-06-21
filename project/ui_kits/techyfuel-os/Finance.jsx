// Finance screen — revenue, profit, invoices.
(() => {
const { Card, Badge, Avatar, StatCard } = window.TechyFuelOSDesignSystem_be0222;
const PROFIT = [12, 14, 13, 17, 16, 19, 21, 20, 24, 23, 26, 29];
const INVOICES = [
  { id: 'INV-2026-0481', client: 'Nova Skincare', amount: '$12,400', status: 'paid', due: 'Jun 30' },
  { id: 'INV-2026-0480', client: 'Orbit Inc.', amount: '$28,900', status: 'sent', due: 'Jul 2' },
  { id: 'INV-2026-0479', client: 'Mediva Health', amount: '$18,000', status: 'overdue', due: 'Jun 12' },
  { id: 'INV-2026-0478', client: 'Peak Fitness', amount: '$9,200', status: 'paid', due: 'Jun 8' },
  { id: 'INV-2026-0477', client: 'Verde Foods', amount: '$22,300', status: 'draft', due: '—' },
];
const IS = { paid: ['success', 'Paid'], sent: ['info', 'Sent'], overdue: ['danger', 'Overdue'], draft: ['neutral', 'Draft'] };
function Finance() {
  return (
    <div style={{ padding: 24, maxWidth: 1280, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
        <div><h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--fw-extrabold)', letterSpacing: '-0.02em' }}>Finance</h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 2 }}>June 2026 · 5 invoices this cycle</p></div>
        <button style={{ display: 'inline-flex', alignItems: 'center', gap: 7, height: 36, padding: '0 14px', background: 'var(--blue-600)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-brand)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', cursor: 'pointer' }}><Icon name="plus" size={16} /> New invoice</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 16 }}>
        <StatCard label="Monthly revenue" value="$48,250" delta="12.5%" icon={<Icon name="trending-up" />} tone="success" />
        <StatCard label="Net profit" value="$29,180" delta="8.4%" icon={<Icon name="piggy-bank" />} tone="brand" />
        <StatCard label="Expenses" value="$19,070" delta="3.0%" deltaDirection="down" icon={<Icon name="credit-card" />} tone="violet" />
        <StatCard label="Outstanding" value="$46,900" delta="—" icon={<Icon name="receipt" />} tone="warning" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16 }}>
        <Card padding="lg">
          <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--fw-bold)', marginBottom: 4 }}>Net profit</h3>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 12 }}><span style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--fw-extrabold)', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>$232K</span><span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-bold)', color: 'var(--green-600)' }}>+18% YTD</span></div>
          <Bars data={PROFIT} color="var(--green-500)" highlight="var(--green-600)" height={140} />
        </Card>
        <Card padding="none">
          <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--fw-bold)' }}>Invoices</h3>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-body)' }}><Icon name="download" size={14} /> Export</span>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr>{['Invoice', 'Client', 'Amount', 'Status', 'Due'].map((h, i) => <th key={h} style={{ textAlign: i === 2 ? 'right' : 'left', padding: '10px 18px', fontSize: 'var(--text-2xs)', fontWeight: 'var(--fw-bold)', letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase', color: 'var(--text-subtle)' }}>{h}</th>)}</tr></thead>
            <tbody>{INVOICES.map((inv, i) => { const [t, l] = IS[inv.status]; return (
              <tr key={i} style={{ borderTop: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '11px 18px', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-body)' }}>{inv.id}</td>
                <td style={{ padding: '11px 18px', fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)' }}>{inv.client}</td>
                <td style={{ padding: '11px 18px', textAlign: 'right', fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-bold)', color: 'var(--text-strong)', fontVariantNumeric: 'tabular-nums' }}>{inv.amount}</td>
                <td style={{ padding: '11px 18px' }}><Badge tone={t} dot>{l}</Badge></td>
                <td style={{ padding: '11px 18px', fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>{inv.due}</td>
              </tr>
            ); })}</tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
Object.assign(window, { Finance });
})();
