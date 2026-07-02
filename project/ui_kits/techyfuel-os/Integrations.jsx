// Integrations.jsx — Third-party tool connections
(() => {
const { Card, Badge, Switch } = window.TechyFuelOSDesignSystem_be0222;

const STORAGE_KEY = 'tf_integrations';
function readCfg() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch { return {}; } }
function saveCfg(cfg) { localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg)); }

const INTEGRATIONS = [
  {
    id: 'slack', name: 'Slack', category: 'Communication',
    icon: '💬', color: '#4A154B',
    desc: 'Ping a Slack channel when tasks are updated, completed, or overdue.',
    fields: [{ key: 'webhookUrl', label: 'Webhook URL', placeholder: 'https://hooks.slack.com/services/...' }],
    testable: true,
  },
  {
    id: 'zoom', name: 'Zoom / Google Meet', category: 'Communication',
    icon: '📹', color: '#2D8CFF',
    desc: 'One-click meeting links from tasks. Paste your Zoom or Meet base URL.',
    fields: [
      { key: 'zoomUrl', label: 'Zoom Personal Link', placeholder: 'https://zoom.us/j/your-id' },
      { key: 'meetUrl', label: 'Google Meet Link', placeholder: 'https://meet.google.com/xxx-xxxx-xxx' },
    ],
  },
  {
    id: 'gcal', name: 'Google Calendar', category: 'Calendar',
    icon: '📅', color: '#4285F4',
    desc: 'Export all task deadlines as an iCal file to import into any calendar app.',
    action: 'export',
  },
  {
    id: 'gmail', name: 'Gmail / Outlook', category: 'Email',
    icon: '✉️', color: '#EA4335',
    desc: 'Forward emails to your TechyFuel inbox to auto-create tasks.',
    fields: [{ key: 'forwardEmail', label: 'Forward-to Email', placeholder: 'tasks@youragency.techyfuel.io', readonly: true }],
  },
  {
    id: 'github', name: 'GitHub / GitLab', category: 'Development',
    icon: '🐙', color: '#24292E',
    desc: 'Show commit activity linked to tasks using your repo webhook.',
    fields: [
      { key: 'githubToken', label: 'Personal Access Token', placeholder: 'ghp_...', type: 'password' },
      { key: 'githubRepo', label: 'Repository (owner/repo)', placeholder: 'techyfuel/my-project' },
    ],
    testable: true,
  },
  {
    id: 'zapier', name: 'Zapier', category: 'Automation',
    icon: '⚡', color: '#FF4A00',
    desc: 'Connect 1000+ apps via Zapier. Send your Zap webhook URL here.',
    fields: [{ key: 'zapierUrl', label: 'Zap Webhook URL', placeholder: 'https://hooks.zapier.com/hooks/catch/...' }],
    testable: true,
  },
  {
    id: 'stripe', name: 'Stripe', category: 'Finance',
    icon: '💳', color: '#635BFF',
    desc: 'Track invoice payments and log Stripe charges per project.',
    fields: [{ key: 'stripeKey', label: 'Stripe Secret Key', placeholder: 'sk_live_...', type: 'password' }],
    testable: true,
  },
  {
    id: 'figma', name: 'Figma', category: 'Design',
    icon: '🎨', color: '#F24E1E',
    desc: 'Embed Figma design previews directly inside tasks and documents.',
    fields: [{ key: 'figmaToken', label: 'Figma API Token', placeholder: 'figd_...' }],
    embedable: true,
  },
  {
    id: 'loom', name: 'Loom', category: 'Design',
    icon: '🎬', color: '#625DF5',
    desc: 'Attach Loom video recordings to tasks and chat messages as inline previews.',
    embedable: true,
  },
  {
    id: 'gdrive', name: 'Google Drive', category: 'File Storage',
    icon: '🗂️', color: '#0F9D58',
    desc: "Pick real files straight from your Drive using Google's file picker — from the Files screen.",
    fields: [
      { key: 'driveClientId', label: 'OAuth Client ID', placeholder: 'xxx.apps.googleusercontent.com' },
      { key: 'driveApiKey',   label: 'API Key (for Picker)', placeholder: 'AIza...' },
    ],
    note: 'In Google Cloud Console: enable the "Google Drive API" and "Google Picker API", create an OAuth 2.0 Client ID (Web application — add your site\'s URL under Authorized JavaScript origins), and create an API key restricted to the Picker API. Once saved here, use "Connect Google Drive" on the Files screen.',
  },
];

const CATEGORIES = [...new Set(INTEGRATIONS.map(i => i.category))];

// ── Figma Embed Preview ────────────────────────────────────────────────────────
function FigmaViewer({ onClose }) {
  const [url, setUrl] = React.useState('');
  const [embedUrl, setEmbedUrl] = React.useState('');
  function embed() {
    if (!url) return;
    // Convert share URL to embed URL
    const match = url.match(/figma\.com\/(file|proto|design)\/([^/?]+)/);
    if (match) {
      setEmbedUrl(`https://www.figma.com/embed?embed_host=techyfuel&url=${encodeURIComponent(url)}`);
    } else {
      setEmbedUrl(url);
    }
  }
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }} onClick={onClose}>
      <div style={{ background: 'white', borderRadius: 14, overflow: 'hidden', width: '90vw', height: '85vh', display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--slate-200)', display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{ fontSize: 18 }}>🎨</span>
          <input value={url} onChange={e => setUrl(e.target.value)} placeholder="Paste Figma share URL..."
            style={{ flex: 1, height: 36, padding: '0 12px', border: '1px solid var(--slate-200)', borderRadius: 8, fontSize: 14, fontFamily: 'var(--font-sans)', outline: 'none' }}
            onKeyDown={e => e.key === 'Enter' && embed()} />
          <button onClick={embed} style={{ padding: '0 18px', height: 36, background: '#F24E1E', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-sans)' }}>Preview</button>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}><Icon name="x" size={18} /></button>
        </div>
        <div style={{ flex: 1, position: 'relative', background: 'var(--slate-50)' }}>
          {embedUrl ? (
            <iframe src={embedUrl} style={{ width: '100%', height: '100%', border: 'none' }} allowFullScreen />
          ) : (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', gap: 12 }}>
              <span style={{ fontSize: 48 }}>🎨</span>
              <p style={{ fontSize: 15 }}>Paste a Figma URL above and click Preview</p>
              <p style={{ fontSize: 13 }}>Supports File, Prototype, and Design links</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Loom Embed Preview ─────────────────────────────────────────────────────────
function LoomViewer({ onClose }) {
  const [url, setUrl] = React.useState('');
  const [embedUrl, setEmbedUrl] = React.useState('');
  function embed() {
    if (!url) return;
    const match = url.match(/loom\.com\/share\/([a-f0-9]+)/);
    if (match) setEmbedUrl(`https://www.loom.com/embed/${match[1]}`);
    else setEmbedUrl(url);
  }
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }} onClick={onClose}>
      <div style={{ background: 'white', borderRadius: 14, overflow: 'hidden', width: '80vw', maxWidth: 900, display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--slate-200)', display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{ fontSize: 18 }}>🎬</span>
          <input value={url} onChange={e => setUrl(e.target.value)} placeholder="Paste Loom share URL..."
            style={{ flex: 1, height: 36, padding: '0 12px', border: '1px solid var(--slate-200)', borderRadius: 8, fontSize: 14, fontFamily: 'var(--font-sans)', outline: 'none' }}
            onKeyDown={e => e.key === 'Enter' && embed()} />
          <button onClick={embed} style={{ padding: '0 18px', height: 36, background: '#625DF5', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-sans)' }}>Load</button>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}><Icon name="x" size={18} /></button>
        </div>
        {embedUrl ? (
          <div style={{ position: 'relative', paddingBottom: '56.25%' }}>
            <iframe src={embedUrl} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }} allowFullScreen allow="autoplay" />
          </div>
        ) : (
          <div style={{ padding: '60px 40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: 48 }}>🎬</span>
            <p style={{ fontSize: 15, margin: '12px 0 0' }}>Paste a Loom share link and click Load</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── iCal Export ────────────────────────────────────────────────────────────────
async function exportICal() {
  let tasks = [];
  if (window.API) {
    try { const { data } = await window.API.getTasks(); tasks = data || []; } catch {}
  }
  const lines = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//TechyFuel OS//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
  ];
  for (const t of tasks) {
    if (!t.due_date) continue;
    const dt = t.due_date.replace(/-/g, '');
    lines.push('BEGIN:VEVENT');
    lines.push(`UID:task-${t.id}@techyfuel.os`);
    lines.push(`DTSTART;VALUE=DATE:${dt}`);
    lines.push(`DTEND;VALUE=DATE:${dt}`);
    lines.push(`SUMMARY:${(t.title || 'Task').replace(/[\\;,]/g, '\\$&')}`);
    lines.push(`STATUS:${t.status === 'done' ? 'COMPLETED' : 'NEEDS-ACTION'}`);
    lines.push('END:VEVENT');
  }
  lines.push('END:VCALENDAR');
  const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'techyfuel-tasks.ics';
  a.click();
}

// ── Integration Card ───────────────────────────────────────────────────────────
function IntegrationCard({ integ, cfg, onChange }) {
  const connected = !!(integ.fields?.some(f => cfg[f.key]) || integ.action);
  const [open, setOpen] = React.useState(false);
  const [local, setLocal] = React.useState(() => { const o = {}; (integ.fields || []).forEach(f => { o[f.key] = cfg[f.key] || ''; }); return o; });
  const [testing, setTesting] = React.useState(false);
  const [testResult, setTestResult] = React.useState(null);
  const [figmaOpen, setFigmaOpen] = React.useState(false);
  const [loomOpen, setLoomOpen] = React.useState(false);

  function save() {
    onChange({ ...cfg, ...local });
    setOpen(false);
    setTestResult(null);
  }

  async function test() {
    setTesting(true); setTestResult(null);
    try {
      if (integ.id === 'slack') {
        const res = await fetch(local.webhookUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: '✅ TechyFuel OS connected successfully!' }) });
        setTestResult(res.ok ? 'success' : 'error');
      } else if (integ.id === 'zapier') {
        const res = await fetch(local.zapierUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ source: 'TechyFuel OS', test: true, timestamp: new Date().toISOString() }) });
        setTestResult(res.ok ? 'success' : 'error');
      } else if (integ.id === 'stripe') {
        const res = await fetch('https://api.stripe.com/v1/balance', { headers: { Authorization: `Bearer ${local.stripeKey}` } });
        setTestResult(res.ok ? 'success' : 'error');
      } else if (integ.id === 'github') {
        const res = await fetch(`https://api.github.com/repos/${local.githubRepo}/commits?per_page=1`, { headers: { Authorization: `token ${local.githubToken}`, Accept: 'application/vnd.github.v3+json' } });
        setTestResult(res.ok ? 'success' : 'error');
      } else {
        setTestResult('success');
      }
    } catch { setTestResult('error'); }
    setTesting(false);
  }

  const isConnected = integ.fields?.some(f => !f.readonly && cfg[f.key]);

  return (
    <>
      <div style={{ background: 'white', border: '1px solid var(--slate-200)', borderRadius: 14, overflow: 'hidden', transition: 'box-shadow 0.15s' }}
        onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
        onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
        <div style={{ padding: '20px 20px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: integ.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>
              {integ.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: 'var(--text-heading)' }}>{integ.name}</h3>
                {isConnected && <span style={{ fontSize: 11, fontWeight: 700, background: '#dcfce7', color: '#15803d', borderRadius: 20, padding: '2px 8px' }}>Connected</span>}
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>{integ.desc}</p>
            </div>
          </div>
        </div>
        <div style={{ padding: '12px 20px 16px', borderTop: '1px solid var(--slate-100)', display: 'flex', gap: 8 }}>
          {integ.action === 'export' && (
            <button onClick={exportICal} style={{ flex: 1, padding: '8px 0', background: integ.color, color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-sans)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <Icon name="download" size={14} /> Export .ics
            </button>
          )}
          {integ.embedable && integ.id === 'figma' && (
            <button onClick={() => setFigmaOpen(true)} style={{ flex: 1, padding: '8px 0', background: integ.color, color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-sans)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <Icon name="eye" size={14} /> Open Figma Viewer
            </button>
          )}
          {integ.embedable && integ.id === 'loom' && (
            <button onClick={() => setLoomOpen(true)} style={{ flex: 1, padding: '8px 0', background: integ.color, color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-sans)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <Icon name="play" size={14} /> Open Loom Player
            </button>
          )}
          {integ.fields && (
            <button onClick={() => setOpen(o => !o)} style={{ flex: 1, padding: '8px 0', background: open ? 'var(--slate-100)' : isConnected ? 'var(--slate-50)' : integ.color, color: open ? 'var(--text-body)' : isConnected ? 'var(--text-body)' : 'white', border: `1px solid ${isConnected || open ? 'var(--slate-200)' : 'transparent'}`, borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-sans)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <Icon name={isConnected ? 'settings' : 'plug'} size={14} />
              {isConnected ? 'Configure' : 'Connect'}
            </button>
          )}
          {integ.id === 'zoom' && cfg.zoomUrl && (
            <button onClick={() => window.open(cfg.zoomUrl, '_blank')} style={{ padding: '8px 14px', background: integ.color, color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-sans)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Icon name="video" size={14} /> Start
            </button>
          )}
        </div>

        {/* Config panel */}
        {open && integ.fields && (
          <div style={{ padding: '16px 20px 20px', borderTop: '1px solid var(--slate-100)', background: 'var(--slate-50)' }}>
            {integ.fields.map(f => (
              <div key={f.key} style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: 0.5 }}>{f.label}</label>
                <input
                  value={f.readonly ? `tasks@${(window.location.hostname || 'youragency').replace('www.','')}` : local[f.key]}
                  onChange={e => !f.readonly && setLocal(l => ({ ...l, [f.key]: e.target.value }))}
                  type={f.type || 'text'}
                  placeholder={f.placeholder}
                  readOnly={f.readonly}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--slate-200)', borderRadius: 8, fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none', background: f.readonly ? 'var(--slate-100)' : 'white', boxSizing: 'border-box', color: f.readonly ? 'var(--text-muted)' : 'inherit' }}
                />
              </div>
            ))}
            {integ.note && (
              <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6, margin: '0 0 12px', background: 'white', border: '1px solid var(--slate-200)', borderRadius: 8, padding: '10px 12px' }}>
                {integ.note}
              </p>
            )}
            {testResult && (
              <div style={{ padding: '8px 12px', borderRadius: 7, background: testResult === 'success' ? '#dcfce7' : '#fee2e2', color: testResult === 'success' ? '#15803d' : '#dc2626', fontSize: 13, fontWeight: 600, marginBottom: 12 }}>
                {testResult === 'success' ? '✅ Connection successful!' : '❌ Connection failed. Check your credentials.'}
              </div>
            )}
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={save} style={{ flex: 1, padding: '9px 0', background: integ.color, color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-sans)' }}>Save</button>
              {integ.testable && <button onClick={test} disabled={testing} style={{ flex: 1, padding: '9px 0', background: 'white', color: 'var(--text-body)', border: '1px solid var(--slate-200)', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-sans)' }}>{testing ? 'Testing...' : 'Test'}</button>}
              {isConnected && <button onClick={() => { const n = {}; integ.fields.forEach(f => { n[f.key] = ''; }); onChange({ ...cfg, ...n }); setLocal({}); setOpen(false); }} style={{ padding: '9px 14px', background: 'none', color: 'var(--red-500)', border: '1px solid var(--red-200)', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-sans)' }}>Disconnect</button>}
            </div>
          </div>
        )}
      </div>
      {figmaOpen && <FigmaViewer onClose={() => setFigmaOpen(false)} />}
      {loomOpen && <LoomViewer onClose={() => setLoomOpen(false)} />}
    </>
  );
}

// ── Main Screen ────────────────────────────────────────────────────────────────
function Integrations() {
  useLucide();
  const [cfg, setCfg] = React.useState(readCfg);
  const [filter, setFilter] = React.useState('All');

  function handleChange(id, updated) {
    const next = { ...cfg, [id]: updated };
    setCfg(next);
    saveCfg(next);
  }

  const cats = ['All', ...CATEGORIES];
  const visible = filter === 'All' ? INTEGRATIONS : INTEGRATIONS.filter(i => i.category === filter);
  const connectedCount = INTEGRATIONS.filter(i => i.fields?.some(f => !f.readonly && cfg[i.id]?.[f.key])).length;

  return (
    <div style={{ padding: '28px 32px', maxWidth: 1100, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', margin: '0 0 6px' }}>Integrations</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 15, margin: 0 }}>
          Connect your favorite tools. {connectedCount > 0 && <span style={{ color: 'var(--green-600)', fontWeight: 600 }}>{connectedCount} active</span>}
        </p>
      </div>

      {/* Category filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {cats.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)}
            style={{ padding: '6px 16px', borderRadius: 20, border: '1px solid', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)', borderColor: filter === cat ? 'var(--blue-500)' : 'var(--slate-200)', background: filter === cat ? 'var(--blue-50)' : 'white', color: filter === cat ? 'var(--blue-700)' : 'var(--text-body)' }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
        {visible.map(integ => (
          <IntegrationCard key={integ.id} integ={integ} cfg={cfg[integ.id] || {}} onChange={updated => handleChange(integ.id, updated)} />
        ))}
      </div>

      {/* Info box */}
      <div style={{ marginTop: 32, padding: '18px 22px', background: 'var(--blue-50)', borderRadius: 12, border: '1px solid var(--blue-100)', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        <Icon name="info" size={18} style={{ color: 'var(--blue-600)', marginTop: 1, flexShrink: 0 }} />
        <div>
          <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--blue-800)', margin: '0 0 4px' }}>Custom integrations via Webhooks</p>
          <p style={{ fontSize: 13, color: 'var(--blue-700)', margin: 0 }}>
            Need something not listed? Use the <strong>Automations → Webhooks</strong> tab to connect any tool with a custom HTTP endpoint. Works with Make, n8n, Pipedream, and any custom API.
          </p>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Integrations });
})();
