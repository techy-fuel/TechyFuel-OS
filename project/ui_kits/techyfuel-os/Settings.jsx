// Settings screen.
(() => {
const { Card, Badge, Avatar, Switch, Input } = window.TechyFuelOSDesignSystem_be0222;
const NAV = [['building-2', 'Agency branding', true], ['shield-check', 'Team permissions', false], ['bell', 'Email notifications', false], ['plug', 'Integrations', false], ['key-round', 'API access', false]];
const INTEGRATIONS = [
  { name: 'Meta Business', icon: 'facebook', tone: 'var(--blue-600)', on: true },
  { name: 'Google Ads', icon: 'badge-dollar-sign', tone: 'var(--green-600)', on: true },
  { name: 'Slack', icon: 'slack', tone: 'var(--violet-500)', on: true },
  { name: 'Stripe', icon: 'credit-card', tone: 'var(--blue-500)', on: false },
];
function Row({ title, desc, control }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 0', borderBottom: '1px solid var(--border-subtle)' }}>
      <div style={{ flex: 1 }}><div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)' }}>{title}</div>
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 2 }}>{desc}</div></div>
      {control}
    </div>
  );
}
function Settings() {
  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: '0 auto' }}>
      <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--fw-extrabold)', letterSpacing: '-0.02em', marginBottom: 18 }}>Settings</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 20, alignItems: 'start' }}>
        <Card padding="sm" style={{ position: 'sticky', top: 84 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {NAV.map(([ic, l, act], i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 'var(--radius-md)', background: act ? 'var(--blue-50)' : 'transparent', color: act ? 'var(--blue-700)' : 'var(--text-body)', fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-medium)', cursor: 'pointer' }}>
                <Icon name={ic} size={17} style={{ color: act ? 'var(--blue-600)' : 'var(--text-muted)' }} />{l}
              </div>
            ))}
          </div>
        </Card>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card padding="lg">
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--fw-bold)', marginBottom: 4 }}>Agency branding</h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginBottom: 16 }}>This appears across the client portal and reports.</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 18 }}>
              <span style={{ width: 56, height: 56, borderRadius: 'var(--radius-xl)', background: 'var(--grad-brand)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-brand)' }}><img src="../../assets/techyfuel-mark.png" alt="" style={{ height: 32, filter: 'brightness(0) invert(1)' }} /></span>
              <button style={{ display: 'inline-flex', alignItems: 'center', gap: 7, height: 34, padding: '0 13px', background: 'var(--slate-0)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-body)', cursor: 'pointer' }}><Icon name="upload" size={15} /> Upload logo</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Input label="Agency name" defaultValue="Bright Pixel Co." />
              <Input label="Support email" defaultValue="hello@brightpixel.co" iconLeft={<Icon name="mail" size={16} />} />
            </div>
          </Card>
          <Card padding="lg">
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--fw-bold)', marginBottom: 4 }}>Email notifications</h3>
            <div style={{ marginTop: 8 }}>
              <Row title="New client approvals" desc="When a client approves or requests a revision" control={<Switch defaultChecked />} />
              <Row title="Deadline reminders" desc="Daily digest of tasks due within 48 hours" control={<Switch defaultChecked />} />
              <Row title="AI risk alerts" desc="When the assistant detects a deadline or budget risk" control={<Switch defaultChecked />} />
              <Row title="Weekly summary" desc="Monday recap of revenue, tasks and pipeline" control={<Switch />} />
            </div>
          </Card>
          <Card padding="lg">
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--fw-bold)', marginBottom: 16 }}>Integrations</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {INTEGRATIONS.map((it, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', background: 'var(--slate-50)' }}>
                  <span style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--slate-0)', border: '1px solid var(--border-subtle)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: it.tone }}><Icon name={it.icon} size={18} /></span>
                  <span style={{ flex: 1, fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)' }}>{it.name}</span>
                  {it.on ? <Badge tone="success" dot>Connected</Badge> : <button style={{ height: 28, padding: '0 12px', background: 'var(--blue-600)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-semibold)', cursor: 'pointer' }}>Connect</button>}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
Object.assign(window, { Settings });
})();
