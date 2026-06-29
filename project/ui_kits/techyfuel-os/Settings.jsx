// Settings screen.
(() => {
const { Card, Badge, Avatar, Switch } = window.TechyFuelOSDesignSystem_be0222;

const NAV_ITEMS = [
  ['building-2',   'Agency branding'],
  ['users',        'Team permissions'],
  ['bell',         'Email notifications'],
  ['plug',         'Integrations'],
  ['key-round',    'API access'],
];

const STORAGE_KEY = 'tf_settings';
function loadSaved() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch { return {}; }
}
function saveSettings(obj) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(obj)); } catch {}
}

/* ── Notification row ─────────────────────────────────────────── */
function NotifRow({ title, desc, field, notif, setNotif }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 0', borderBottom: '1px solid var(--border-subtle)' }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)' }}>{title}</div>
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 2 }}>{desc}</div>
      </div>
      <Switch checked={!!notif[field]} onChange={v => {
        const next = { ...notif, [field]: v };
        setNotif(next);
        const saved = loadSaved();
        saveSettings({ ...saved, notifications: next });
      }} />
    </div>
  );
}

/* ── Settings ─────────────────────────────────────────────────── */
function Settings() {
  const saved = loadSaved();

  const [tab,       setTab]       = React.useState('Agency branding');
  const [team,      setTeam]      = React.useState([]);
  const [agencyName, setAgencyName] = React.useState(saved.agencyName || '');
  const [agencyEmail, setAgencyEmail] = React.useState(saved.agencyEmail || '');
  const [saved2,    setSaved2]    = React.useState(false);

  const defaultNotif = { approvals: true, deadlines: true, ai_alerts: true, weekly: false };
  const [notif, setNotif] = React.useState({ ...defaultNotif, ...(saved.notifications || {}) });

  const [integ, setInteg] = React.useState(saved.integrations || {
    meta: false, google: false, slack: false, stripe: false,
  });

  const [apiKey] = React.useState(saved.apiKey || ('tf_live_' + Math.random().toString(36).slice(2, 18)));

  React.useEffect(() => {
    if (!window.API) return;
    (async () => {
      try {
        const { data } = await window.API.getTeam();
        if (data) setTeam(data);
      } catch {}
    })();
    const sk = loadSaved();
    if (!sk.apiKey) saveSettings({ ...sk, apiKey });
  }, []);

  function handleSaveBranding() {
    const sk = loadSaved();
    saveSettings({ ...sk, agencyName, agencyEmail });
    setSaved2(true);
    setTimeout(() => setSaved2(false), 2000);
  }

  function toggleInteg(key) {
    const next = { ...integ, [key]: !integ[key] };
    setInteg(next);
    const sk = loadSaved();
    saveSettings({ ...sk, integrations: next });
  }

  const inputStyle = {
    width: '100%', height: 36, padding: '0 10px', border: '1px solid var(--border-default)',
    borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)',
    color: 'var(--text-strong)', background: 'var(--slate-0)', boxSizing: 'border-box', outline: 'none',
  };

  const INTEG_LIST = [
    { key: 'meta',   name: 'Meta Business',  icon: 'facebook',         color: 'var(--blue-600)' },
    { key: 'google', name: 'Google Ads',      icon: 'badge-dollar-sign', color: 'var(--green-600)' },
    { key: 'slack',  name: 'Slack',           icon: 'slack',            color: 'var(--violet-500)' },
    { key: 'stripe', name: 'Stripe',          icon: 'credit-card',      color: 'var(--blue-500)' },
  ];

  const ROLE_COLORS = { admin: 'var(--violet-600)', manager: 'var(--blue-600)', member: 'var(--green-700)', viewer: 'var(--slate-500)' };

  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: '0 auto' }}>
      <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--fw-extrabold)', letterSpacing: '-0.02em', marginBottom: 18 }}>Settings</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 20, alignItems: 'start' }}>

        {/* Sidebar nav */}
        <Card padding="sm" style={{ position: 'sticky', top: 84 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {NAV_ITEMS.map(([ic, label]) => {
              const act = tab === label;
              return (
                <div key={label} onClick={() => setTab(label)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 'var(--radius-md)', background: act ? 'var(--blue-50)' : 'transparent', color: act ? 'var(--blue-700)' : 'var(--text-body)', fontSize: 'var(--text-sm)', fontWeight: act ? 'var(--fw-semibold)' : 'var(--fw-medium)', cursor: 'pointer', transition: 'background 0.12s' }}>
                  <Icon name={ic} size={17} style={{ color: act ? 'var(--blue-600)' : 'var(--text-muted)' }} />{label}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Content panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* ── Agency branding ── */}
          {tab === 'Agency branding' && (
            <Card padding="lg">
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--fw-bold)', marginBottom: 4 }}>Agency branding</h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginBottom: 20 }}>Appears across the client portal and reports.</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                <span style={{ width: 56, height: 56, borderRadius: 'var(--radius-xl)', background: 'var(--grad-brand)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-brand)' }}>
                  <img src="../../assets/techyfuel-mark.png" alt="" style={{ height: 32, filter: 'brightness(0) invert(1)' }} />
                </span>
                <button style={{ display: 'inline-flex', alignItems: 'center', gap: 7, height: 34, padding: '0 13px', background: 'var(--slate-0)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-body)', cursor: 'pointer' }}>
                  <Icon name="upload" size={15} /> Upload logo
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 'var(--tracking-caps)' }}>Agency name</label>
                  <input style={inputStyle} value={agencyName} onChange={e => setAgencyName(e.target.value)} placeholder="Your agency name" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 'var(--tracking-caps)' }}>Support email</label>
                  <input style={inputStyle} value={agencyEmail} onChange={e => setAgencyEmail(e.target.value)} placeholder="support@agency.com" type="email" />
                </div>
              </div>
              <button onClick={handleSaveBranding} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, height: 36, padding: '0 18px', background: saved2 ? 'var(--green-600)' : 'var(--blue-600)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', cursor: 'pointer', transition: 'background 0.2s' }}>
                <Icon name={saved2 ? 'check' : 'save'} size={16} /> {saved2 ? 'Saved!' : 'Save changes'}
              </button>
            </Card>
          )}

          {/* ── Team permissions ── */}
          {tab === 'Team permissions' && (
            <Card padding="lg">
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--fw-bold)', marginBottom: 4 }}>Team permissions</h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginBottom: 20 }}>Manage your team members and their access levels.</p>
              {team.length === 0 ? (
                <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>No team members found.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {team.map((m, i) => (
                    <div key={m.id || i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                      <Avatar name={m.name} src={m.avatar_url} size="sm" />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)' }}>{m.name}</div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{m.email || m.role}</div>
                      </div>
                      <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-semibold)', padding: '3px 10px', borderRadius: 'var(--radius-full)', background: 'var(--slate-100)', color: ROLE_COLORS[m.role] || 'var(--text-body)', textTransform: 'capitalize' }}>
                        {m.role || 'member'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}

          {/* ── Email notifications ── */}
          {tab === 'Email notifications' && (
            <Card padding="lg">
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--fw-bold)', marginBottom: 4 }}>Email notifications</h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginBottom: 8 }}>Choose which emails you receive. Changes save automatically.</p>
              <NotifRow title="New client approvals"  desc="When a client approves or requests a revision"           field="approvals" notif={notif} setNotif={setNotif} />
              <NotifRow title="Deadline reminders"    desc="Daily digest of tasks due within 48 hours"               field="deadlines" notif={notif} setNotif={setNotif} />
              <NotifRow title="AI risk alerts"        desc="When the assistant detects a deadline or budget risk"     field="ai_alerts" notif={notif} setNotif={setNotif} />
              <NotifRow title="Weekly summary"        desc="Monday recap of revenue, tasks and pipeline"             field="weekly"    notif={notif} setNotif={setNotif} />
            </Card>
          )}

          {/* ── Integrations ── */}
          {tab === 'Integrations' && (
            <Card padding="lg">
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--fw-bold)', marginBottom: 16 }}>Integrations</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {INTEG_LIST.map(it => (
                  <div key={it.key} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14, border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', background: integ[it.key] ? 'var(--green-50)' : 'var(--slate-50)' }}>
                    <span style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--slate-0)', border: '1px solid var(--border-subtle)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: it.color }}>
                      <Icon name={it.icon} size={18} />
                    </span>
                    <span style={{ flex: 1, fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)' }}>{it.name}</span>
                    {integ[it.key]
                      ? <button onClick={() => toggleInteg(it.key)} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, height: 28, padding: '0 10px', background: 'transparent', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-muted)', cursor: 'pointer' }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green-500)', display: 'inline-block' }} />Connected</button>
                      : <button onClick={() => toggleInteg(it.key)} style={{ height: 28, padding: '0 12px', background: 'var(--blue-600)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-semibold)', cursor: 'pointer' }}>Connect</button>
                    }
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* ── API access ── */}
          {tab === 'API access' && (
            <Card padding="lg">
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--fw-bold)', marginBottom: 4 }}>API access</h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginBottom: 20 }}>Use this key to access TechyFuel OS data from external tools.</p>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 'var(--tracking-caps)' }}>API Key</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  <input readOnly value={apiKey} style={{ ...inputStyle, flex: 1, fontFamily: 'monospace', letterSpacing: '0.03em', color: 'var(--text-muted)', background: 'var(--slate-50)' }} />
                  <button onClick={() => { try { navigator.clipboard.writeText(apiKey); } catch {} }} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 36, padding: '0 14px', background: 'var(--slate-0)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-body)', cursor: 'pointer' }}>
                    <Icon name="copy" size={15} /> Copy
                  </button>
                </div>
              </div>
              <div style={{ padding: 14, background: 'var(--amber-50)', border: '1px solid var(--amber-200)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)', color: 'var(--amber-800)', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <Icon name="alert-triangle" size={15} style={{ flexShrink: 0, marginTop: 1 }} />
                Keep this key secret. Do not share it publicly or commit it to code.
              </div>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Settings });
})();
