// Client Portal screen — the client-facing view (previewed inside the agency app).
(() => {
const { Card, Badge, Avatar, AvatarGroup, ProgressBar } = window.TechyFuelOSDesignSystem_be0222;

const TF_MILESTONES = [
  { label: 'Discovery & strategy', state: 'done' },
  { label: 'Brand & creative direction', state: 'done' },
  { label: 'Campaign production', state: 'active' },
  { label: 'Launch & optimization', state: 'todo' },
  { label: 'Reporting & handover', state: 'todo' },
];
const TF_APPROVALS = [
  { name: 'Homepage hero — v3', type: 'Design', who: 'Sara Khan', time: '2h ago', status: 'pending' },
  { name: 'Launch reel — 30s cut', type: 'Video', who: 'Omar Ali', time: 'Yesterday', status: 'pending' },
  { name: 'Instagram carousel set', type: 'Social', who: 'Lena Cruz', time: 'Jun 18', status: 'approved' },
];
const TF_FILES = [
  { name: 'Brand guidelines.pdf', size: '4.2 MB', icon: 'file-text', tone: 'var(--red-500)' },
  { name: 'Launch hero.png', size: '1.8 MB', icon: 'image', tone: 'var(--violet-500)' },
  { name: 'Campaign reel.mp4', size: '38 MB', icon: 'video', tone: 'var(--blue-500)' },
  { name: 'Service agreement.pdf', size: '320 KB', icon: 'file-check', tone: 'var(--green-500)' },
];

function ClientPortal() {
  return (
    <div>
      {/* Client-facing banner */}
      <div style={{ background: 'var(--grad-brand)', padding: '26px 24px', color: '#fff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ width: 46, height: 46, borderRadius: 'var(--radius-xl)', background: 'rgba(255,255,255,0.16)', backdropFilter: 'blur(8px)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.25)' }}><Icon name="panel-left-open" size={22} style={{ color: '#fff' }} /></span>
            <div>
              <div style={{ fontSize: 'var(--text-2xs)', fontWeight: 'var(--fw-bold)', letterSpacing: 'var(--tracking-caps)', textTransform: 'uppercase', opacity: 0.85 }}>Client portal · preview</div>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--fw-extrabold)', letterSpacing: '-0.02em' }}>Nova Skincare workspace</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 22 }}>
            {[['Project health', 'On track'], ['Next milestone', 'Jun 28'], ['Your manager', 'Sara K.']].map(([k, v]) => (
              <div key={k}><div style={{ fontSize: 'var(--text-2xs)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wide)', opacity: 0.8 }}>{k}</div><div style={{ fontSize: 'var(--text-md)', fontWeight: 'var(--fw-bold)' }}>{v}</div></div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: 24, display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 16 }}>
        {/* Progress */}
        <Card padding="lg" style={{ gridColumn: '1 / -1' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--fw-bold)' }}>Project progress</h3>
            <Badge tone="success" dot>62% complete</Badge>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
            {TF_MILESTONES.map((m, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 9, position: 'relative' }}>
                {i < TF_MILESTONES.length - 1 && <div style={{ position: 'absolute', top: 15, left: '50%', width: '100%', height: 2, background: m.state === 'done' ? 'var(--blue-500)' : 'var(--border-default)' }} />}
                <span style={{ position: 'relative', zIndex: 1, width: 32, height: 32, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  background: m.state === 'done' ? 'var(--blue-600)' : m.state === 'active' ? 'var(--slate-0)' : 'var(--slate-100)',
                  border: m.state === 'active' ? '2px solid var(--blue-600)' : '2px solid transparent',
                  color: m.state === 'done' ? '#fff' : m.state === 'active' ? 'var(--blue-600)' : 'var(--text-subtle)' }}>
                  {m.state === 'done' ? <Icon name="check" size={16} /> : m.state === 'active' ? <span style={{ width: 9, height: 9, borderRadius: '50%', background: 'var(--blue-600)' }} /> : <span style={{ fontSize: 11, fontWeight: 700 }}>{i + 1}</span>}
                </span>
                <span style={{ fontSize: 'var(--text-xs)', fontWeight: m.state === 'active' ? 'var(--fw-bold)' : 'var(--fw-medium)', color: m.state === 'todo' ? 'var(--text-subtle)' : 'var(--text-strong)', textAlign: 'center', lineHeight: 1.3 }}>{m.label}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Approvals */}
        <Card padding="lg">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--fw-bold)' }}>Awaiting your approval</h3>
            <Badge tone="warning">2 pending</Badge>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {TF_APPROVALS.map((a, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: 'var(--slate-50)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
                <span style={{ width: 38, height: 38, flex: 'none', borderRadius: 'var(--radius-md)', background: 'var(--slate-0)', border: '1px solid var(--border-subtle)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}><Icon name={a.type === 'Video' ? 'video' : a.type === 'Social' ? 'instagram' : 'image'} size={18} /></span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)' }}>{a.name}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{a.who} · {a.time}</div>
                </div>
                {a.status === 'approved'
                  ? <Badge tone="success" dot>Approved</Badge>
                  : <div style={{ display: 'flex', gap: 6 }}>
                      <button style={{ width: 32, height: 32, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'var(--green-600)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}><Icon name="check" size={16} /></button>
                      <button style={{ width: 32, height: 32, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'var(--slate-0)', color: 'var(--text-muted)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}><Icon name="rotate-ccw" size={15} /></button>
                    </div>}
              </div>
            ))}
          </div>
        </Card>

        {/* Files + invoice */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card padding="lg">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--fw-bold)' }}>Shared files</h3>
              {window.TFLinkBtn ? React.createElement(window.TFLinkBtn, null, 'All files') : null}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {TF_FILES.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '8px 6px', borderRadius: 'var(--radius-md)' }}>
                  <Icon name={f.icon} size={18} style={{ color: f.tone, flex: 'none' }} />
                  <span style={{ flex: 1, fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-medium)', color: 'var(--text-strong)' }}>{f.name}</span>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-subtle)' }}>{f.size}</span>
                  <Icon name="download" size={16} style={{ color: 'var(--text-muted)', cursor: 'pointer' }} />
                </div>
              ))}
            </div>
          </Card>
          <Card padding="lg" style={{ background: 'var(--slate-900)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 'var(--text-2xs)', fontWeight: 'var(--fw-bold)', letterSpacing: 'var(--tracking-caps)', textTransform: 'uppercase', color: 'var(--slate-400)' }}>Latest invoice</div>
                <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--fw-extrabold)', color: '#fff', marginTop: 4, fontVariantNumeric: 'tabular-nums' }}>$12,400</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--slate-400)', marginTop: 2 }}>INV-2026-0481 · due Jun 30</div>
              </div>
              <button style={{ display: 'inline-flex', alignItems: 'center', gap: 7, height: 38, padding: '0 16px', background: '#fff', color: 'var(--slate-900)', border: 'none', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-bold)', cursor: 'pointer' }}><Icon name="download" size={16} /> Download</button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ClientPortal });
})();
