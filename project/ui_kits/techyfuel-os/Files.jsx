// Files screen — folder manager.
(() => {
const { Card, Badge, Avatar, AvatarGroup } = window.TechyFuelOSDesignSystem_be0222;
const FOLDERS = [
  { name: 'Designs', count: 248, color: 'var(--violet-500)', bg: 'var(--violet-50)', icon: 'palette', size: '4.2 GB' },
  { name: 'Videos', count: 86, color: 'var(--teal-500)', bg: 'var(--teal-50)', icon: 'film', size: '38 GB' },
  { name: 'Documents', count: 412, color: 'var(--blue-500)', bg: 'var(--blue-50)', icon: 'file-text', size: '1.1 GB' },
  { name: 'Contracts', count: 64, color: 'var(--green-500)', bg: 'var(--green-50)', icon: 'file-check', size: '320 MB' },
];
const FILES = [
  { name: 'Nova — launch hero v3.fig', icon: 'figma', tone: 'var(--violet-500)', size: '12 MB', who: 'Sara Khan', when: '2h ago', v: 'v3' },
  { name: 'Peak — reel master.mp4', icon: 'video', tone: 'var(--teal-500)', size: '420 MB', who: 'Omar Ali', when: 'Yesterday', v: 'v2' },
  { name: 'Mediva — brand guidelines.pdf', icon: 'file-text', tone: 'var(--red-500)', size: '8.4 MB', who: 'Tom Reed', when: 'Jun 18', v: 'v1' },
  { name: 'Orbit — service agreement.pdf', icon: 'file-check', tone: 'var(--green-500)', size: '320 KB', who: 'Lena Cruz', when: 'Jun 17', v: 'Signed' },
  { name: 'Verde — packaging set.zip', icon: 'folder-archive', tone: 'var(--amber-500)', size: '156 MB', who: 'Mia Wu', when: 'Jun 15', v: 'Final' },
];
function Files() {
  return (
    <div style={{ padding: 24, maxWidth: 1280, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
        <div><h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--fw-extrabold)', letterSpacing: '-0.02em' }}>Files</h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 2 }}>810 files · 43.6 GB of 100 GB used</p></div>
        <button style={{ display: 'inline-flex', alignItems: 'center', gap: 7, height: 36, padding: '0 14px', background: 'var(--blue-600)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-brand)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', cursor: 'pointer' }}><Icon name="upload" size={16} /> Upload</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
        {FOLDERS.map((f, i) => (
          <Card key={i} interactive padding="md" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <span style={{ width: 44, height: 44, borderRadius: 'var(--radius-lg)', background: f.bg, color: f.color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={f.icon} size={22} /></span>
            <div><div style={{ fontSize: 'var(--text-md)', fontWeight: 'var(--fw-bold)', color: 'var(--text-strong)' }}>{f.name}</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 2 }}>{f.count} files · {f.size}</div></div>
          </Card>
        ))}
      </div>
      <Card padding="none">
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--fw-bold)' }}>Recent files</h3>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Team access · version controlled</span>
        </div>
        {FILES.map((f, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 18px', borderTop: '1px solid var(--border-subtle)' }}>
            <span style={{ width: 34, height: 34, flex: 'none', borderRadius: 'var(--radius-md)', background: 'var(--slate-50)', border: '1px solid var(--border-subtle)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: f.tone }}><Icon name={f.icon} size={17} /></span>
            <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)' }}>{f.name}</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{f.who} · {f.when}</div></div>
            <Badge tone="neutral" size="sm">{f.v}</Badge>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-subtle)', width: 64, textAlign: 'right' }}>{f.size}</span>
            <Icon name="download" size={17} style={{ color: 'var(--text-muted)', cursor: 'pointer' }} />
            <Icon name="more-vertical" size={17} style={{ color: 'var(--text-subtle)', cursor: 'pointer' }} />
          </div>
        ))}
      </Card>
    </div>
  );
}
Object.assign(window, { Files });
})();
