// Meta Ads Center screen.
(() => {
const { Card, Badge, Avatar, ProgressBar } = window.TechyFuelOSDesignSystem_be0222;

const TF_SPEND = [3.2, 3.6, 4.1, 3.9, 4.8, 5.2, 4.9, 5.6, 6.1, 5.8, 6.4, 7.0];
const TF_ROAS  = [2.8, 3.1, 3.4, 3.2, 3.9, 4.2, 4.6, 4.4, 5.1, 4.9, 5.4, 6.2];

const CAMP_STATUS = {
  active:  { tone: 'success', label: 'Active' },
  review:  { tone: 'warning', label: 'In review' },
  paused:  { tone: 'neutral', label: 'Paused' },
  ended:   { tone: 'neutral', label: 'Ended' },
  draft:   { tone: 'neutral', label: 'Draft' },
};

const FALLBACK_CAMPAIGNS = [
  { id: 'f1', name: 'Nova — Lead Gen Q2',        clients: { name: 'Nova Tech' },    status: 'active', spent: 2840, impressions: 184200, clicks: 3210, conversions: 142, budget_daily: 150 },
  { id: 'f2', name: 'Apex — Property Listings',   clients: { name: 'Apex Realty' }, status: 'active', spent: 4100, impressions: 98500,  clicks: 1870, conversions: 89,  budget_daily: 200 },
  { id: 'f3', name: 'Bloom — Brand Awareness',    clients: { name: 'Bloom Foods' }, status: 'paused', spent: 400,  impressions: 22000,  clicks: 310,  conversions: 8,   budget_daily: 50 },
];

function fmtSpend(n) {
  if (!n && n !== 0) return '$0';
  if (n >= 1000) return '$' + (n / 1000).toFixed(1) + 'K';
  return '$' + Math.round(n);
}
function calcCPL(spent, conversions) {
  if (!conversions || conversions === 0) return '—';
  return '$' + (spent / conversions).toFixed(2);
}
function calcROAS(conversions, spent) {
  if (!spent || spent === 0) return '—';
  const rev = conversions * 35;
  return (rev / spent).toFixed(1) + '×';
}
function budgetPace(spent, budgetDaily) {
  if (!budgetDaily || budgetDaily === 0) return 50;
  const monthlyBudget = budgetDaily * 30;
  return Math.min(100, Math.round((spent / monthlyBudget) * 100));
}

function AdStat({ label, value, delta, dir, sub, color }) {
  const pos = dir !== 'down';
  return (
    <Card padding="md" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <span style={{ fontSize: 'var(--text-2xs)', fontWeight: 'var(--fw-bold)', letterSpacing: 'var(--tracking-caps)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--fw-extrabold)', letterSpacing: '-0.02em', color: color || 'var(--text-strong)', fontVariantNumeric: 'tabular-nums' }}>{value}</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-bold)', color: pos ? 'var(--green-600)' : 'var(--red-600)' }}>
          <Icon name={pos ? 'trending-up' : 'trending-down'} size={13} /> {delta}
        </span>
      </div>
      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-subtle)' }}>{sub}</span>
    </Card>
  );
}

function MetaAds() {
  const [campaigns, setCampaigns] = React.useState(FALLBACK_CAMPAIGNS);

  React.useEffect(() => {
    if (!window.API) return;
    window.API.getAdCampaigns().then(r => {
      if (r.data && r.data.length > 0) setCampaigns(r.data);
    }).catch(() => {});
  }, []);

  const totalSpend = campaigns.reduce((s, c) => s + (c.spent || 0), 0);
  const totalLeads = campaigns.reduce((s, c) => s + (c.conversions || 0), 0);
  const avgCPL = totalLeads > 0 ? (totalSpend / totalLeads).toFixed(2) : '—';
  const activeCnt = campaigns.filter(c => c.status === 'active').length;

  return (
    <div style={{ padding: 24, maxWidth: 1280, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ width: 42, height: 42, borderRadius: 'var(--radius-lg)', background: 'var(--grad-brand)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-brand)' }}><Icon name="megaphone" size={22} style={{ color: '#fff' }} /></span>
          <div>
            <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--fw-extrabold)', letterSpacing: '-0.02em' }}>Meta Ads Center</h1>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 2 }}>{campaigns.length} campaigns · {activeCnt} active</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, height: 36, padding: '0 12px', background: 'var(--slate-0)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-body)' }}><Icon name="calendar" size={16} style={{ color: 'var(--text-muted)' }} /> All time</div>
          <button style={{ display: 'inline-flex', alignItems: 'center', gap: 7, height: 36, padding: '0 14px', background: 'var(--blue-600)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-brand)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', cursor: 'pointer' }}><Icon name="plus" size={16} /> New campaign</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 16 }}>
        <AdStat label="Total ad spend" value={fmtSpend(totalSpend)} delta="18%" sub="All active campaigns" />
        <AdStat label="Total impressions" value={campaigns.reduce((s,c)=>s+(c.impressions||0),0).toLocaleString()} delta="12%" sub="Across all platforms" color="var(--violet-600)" />
        <AdStat label="Cost per lead" value={avgCPL === '—' ? '—' : '$' + avgCPL} delta="9%" dir="down" sub="Avg across campaigns" color="var(--blue-600)" />
        <AdStat label="Conversions" value={String(totalLeads)} delta="22%" sub="Total leads generated" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <Card padding="lg">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--fw-bold)' }}>Ad spend trend</h3><Badge tone="brand">$ thousands</Badge>
          </div>
          <Bars data={TF_SPEND} labels={['','','M','','','J','','','A','','','S']} color="var(--blue-400)" highlight="var(--blue-600)" />
        </Card>
        <Card padding="lg">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--fw-bold)' }}>Performance trend</h3><Badge tone="success" dot>Improving</Badge>
          </div>
          <AreaLine data={TF_ROAS} color="var(--green-600)" id="roas" />
        </Card>
      </div>

      <Card padding="none">
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--fw-bold)' }}>Campaigns by client</h3>
          {window.TFLinkBtn ? React.createElement(window.TFLinkBtn, null, 'Export report') : null}
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr>
            {['Campaign', 'Status', 'Spend', 'Impressions', 'Clicks', 'Conversions', 'Budget pace'].map((h, i) => (
              <th key={h} style={{ textAlign: i > 1 && i < 6 ? 'right' : 'left', padding: '10px 18px', fontSize: 'var(--text-2xs)', fontWeight: 'var(--fw-bold)', letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase', color: 'var(--text-subtle)' }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {campaigns.map((c, i) => {
              const s = CAMP_STATUS[c.status] || CAMP_STATUS.paused;
              const pace = budgetPace(c.spent, c.budget_daily);
              const clientName = c.clients ? c.clients.name : '—';
              return (
                <tr key={c.id || i} style={{ borderTop: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '12px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Avatar name={clientName} size="sm" />
                      <div>
                        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)' }}>{c.name}</div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{clientName}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 18px' }}><Badge tone={s.tone} dot>{s.label}</Badge></td>
                  <td style={{ padding: '12px 18px', textAlign: 'right', fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)', fontVariantNumeric: 'tabular-nums' }}>{fmtSpend(c.spent)}</td>
                  <td style={{ padding: '12px 18px', textAlign: 'right', fontSize: 'var(--text-sm)', color: 'var(--text-body)', fontVariantNumeric: 'tabular-nums' }}>{(c.impressions || 0).toLocaleString()}</td>
                  <td style={{ padding: '12px 18px', textAlign: 'right', fontSize: 'var(--text-sm)', color: 'var(--text-body)', fontVariantNumeric: 'tabular-nums' }}>{(c.clicks || 0).toLocaleString()}</td>
                  <td style={{ padding: '12px 18px', textAlign: 'right', fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-bold)', color: 'var(--green-600)', fontVariantNumeric: 'tabular-nums' }}>{c.conversions || 0}</td>
                  <td style={{ padding: '12px 18px', width: 130 }}><ProgressBar value={pace} tone={pace > 85 ? 'warning' : 'brand'} size="sm" /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

Object.assign(window, { MetaAds });
})();
