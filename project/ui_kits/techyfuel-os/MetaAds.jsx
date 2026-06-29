// Meta Ads Center screen.
(() => {
const { Card, Badge, Avatar, ProgressBar } = window.TechyFuelOSDesignSystem_be0222;

const CAMP_STATUS = {
  active:  { tone: 'success', label: 'Active' },
  review:  { tone: 'warning', label: 'In review' },
  paused:  { tone: 'neutral', label: 'Paused' },
  ended:   { tone: 'neutral', label: 'Ended' },
  draft:   { tone: 'neutral', label: 'Draft' },
};

function fmtSpend(n) {
  if (!n && n !== 0) return '$0';
  if (n >= 1000) return '$' + (n / 1000).toFixed(1) + 'K';
  return '$' + Math.round(n);
}
function budgetPace(spent, budgetDaily) {
  if (!budgetDaily || budgetDaily === 0) return 0;
  return Math.min(100, Math.round((spent / (budgetDaily * 30)) * 100));
}

function AdStat({ label, value, sub, color }) {
  return (
    <Card padding="md" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <span style={{ fontSize: 'var(--text-2xs)', fontWeight: 'var(--fw-bold)', letterSpacing: 'var(--tracking-caps)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{label}</span>
      <span style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--fw-extrabold)', letterSpacing: '-0.02em', color: color || 'var(--text-strong)', fontVariantNumeric: 'tabular-nums' }}>{value}</span>
      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-subtle)' }}>{sub}</span>
    </Card>
  );
}

function MetaAds() {
  const [campaigns, setCampaigns] = React.useState([]);
  const [loading,   setLoading]   = React.useState(true);
  const [clients,   setClients]   = React.useState([]);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [saving,    setSaving]    = React.useState(false);
  const [form, setForm] = React.useState({ name: '', client_id: '', platform: 'meta', budget_daily: '', status: 'draft' });

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  React.useEffect(() => {
    if (!window.API) { setLoading(false); return; }
    window.API.getAdCampaigns()
      .then(r => { if (r.data) setCampaigns(r.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
    window.API.getClients().then(r => { if (r.data) setClients(r.data); }).catch(() => {});
  }, []);

  async function handleNewCampaign() {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      const payload = { name: form.name, platform: form.platform, status: form.status, spent: 0, impressions: 0, clicks: 0, conversions: 0 };
      if (form.client_id)    payload.client_id    = form.client_id;
      if (form.budget_daily) payload.budget_daily = Number(form.budget_daily);
      if (window.API) {
        const { data } = await window.API.createCampaign(payload);
        if (data) {
          const clientObj = clients.find(c => c.id === form.client_id);
          setCampaigns(prev => [{ ...data, clients: clientObj ? { name: clientObj.company || clientObj.name } : null }, ...prev]);
        }
      }
      setModalOpen(false);
      setForm({ name: '', client_id: '', platform: 'meta', budget_daily: '', status: 'draft' });
    } finally { setSaving(false); }
  }

  const totalSpend  = campaigns.reduce((s, c) => s + (c.spent || 0), 0);
  const totalImpr   = campaigns.reduce((s, c) => s + (c.impressions || 0), 0);
  const totalLeads  = campaigns.reduce((s, c) => s + (c.conversions || 0), 0);
  const avgCPL      = totalLeads > 0 ? '$' + (totalSpend / totalLeads).toFixed(2) : '—';
  const activeCnt   = campaigns.filter(c => c.status === 'active').length;

  return (
    <div style={{ padding: 24, maxWidth: 1280, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ width: 42, height: 42, borderRadius: 'var(--radius-lg)', background: 'var(--grad-brand)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-brand)' }}>
            <Icon name="megaphone" size={22} style={{ color: '#fff' }} />
          </span>
          <div>
            <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--fw-extrabold)', letterSpacing: '-0.02em' }}>Meta Ads Center</h1>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 2 }}>
              {campaigns.length} campaign{campaigns.length !== 1 ? 's' : ''} · {activeCnt} active
            </p>
          </div>
        </div>
        <button onClick={() => setModalOpen(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, height: 36, padding: '0 14px', background: 'var(--blue-600)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-brand)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', cursor: 'pointer' }}>
          <Icon name="plus" size={16} /> New campaign
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 16 }}>
        <AdStat label="Total ad spend"    value={fmtSpend(totalSpend)}         sub="All campaigns" />
        <AdStat label="Total impressions" value={totalImpr.toLocaleString()}    sub="Across all platforms" color="var(--violet-600)" />
        <AdStat label="Cost per lead"     value={avgCPL}                        sub="Avg across campaigns" color="var(--blue-600)" />
        <AdStat label="Conversions"       value={String(totalLeads)}            sub="Total leads generated" />
      </div>

      <Card padding="none">
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--fw-bold)' }}>Campaigns by client</h3>
        </div>

        {loading && (
          <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>Loading…</div>
        )}

        {!loading && campaigns.length === 0 && (
          <div style={{ padding: '48px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <span style={{ width: 52, height: 52, borderRadius: 'var(--radius-xl)', background: 'var(--slate-100)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="megaphone" size={24} style={{ color: 'var(--text-subtle)' }} />
            </span>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)' }}>No campaigns yet</div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 4 }}>Create your first campaign using the button above</div>
            </div>
          </div>
        )}

        {!loading && campaigns.length > 0 && (
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
                    <td style={{ padding: '12px 18px', width: 130 }}>
                      <ProgressBar value={pace} tone={pace > 85 ? 'warning' : 'brand'} size="sm" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New campaign" onSubmit={handleNewCampaign} loading={saving} submitLabel="Create">
        <FormRow label="Campaign name" required>
          <input style={FF.input} placeholder="e.g. Summer Lead Gen Q3" value={form.name} onChange={e => set('name', e.target.value)} />
        </FormRow>
        <div style={FF.row2}>
          <FormRow label="Platform">
            <select style={FF.select} value={form.platform} onChange={e => set('platform', e.target.value)}>
              <option value="meta">Meta (FB/IG)</option>
              <option value="google">Google</option>
              <option value="tiktok">TikTok</option>
              <option value="linkedin">LinkedIn</option>
            </select>
          </FormRow>
          <FormRow label="Status">
            <select style={FF.select} value={form.status} onChange={e => set('status', e.target.value)}>
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
            </select>
          </FormRow>
        </div>
        <div style={FF.row2}>
          <FormRow label="Client">
            <select style={FF.select} value={form.client_id} onChange={e => set('client_id', e.target.value)}>
              <option value="">No client</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.company || c.name}</option>)}
            </select>
          </FormRow>
          <FormRow label="Daily budget ($)">
            <input style={FF.input} type="number" placeholder="0" value={form.budget_daily} onChange={e => set('budget_daily', e.target.value)} />
          </FormRow>
        </div>
      </Modal>
    </div>
  );
}

Object.assign(window, { MetaAds });
})();
