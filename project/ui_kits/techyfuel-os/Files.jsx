// Files screen — folder manager.
(() => {
const { Card, Badge, Avatar } = window.TechyFuelOSDesignSystem_be0222;

const FOLDERS = [
  { name: 'Designs',   count: 248, color: 'var(--violet-500)', bg: 'var(--violet-50)', icon: 'palette',       size: '4.2 GB' },
  { name: 'Videos',    count: 86,  color: 'var(--teal-500)',   bg: 'var(--teal-50)',   icon: 'film',           size: '38 GB' },
  { name: 'Documents', count: 412, color: 'var(--blue-500)',   bg: 'var(--blue-50)',   icon: 'file-text',      size: '1.1 GB' },
  { name: 'Contracts', count: 64,  color: 'var(--green-500)',  bg: 'var(--green-50)',  icon: 'file-check',     size: '320 MB' },
];

const FALLBACK_FILES = [
  { id: 'f1', name: 'Nova — launch hero v3.fig',       mime_type: 'figma',   file_size: 12582912,  team_members: { name: 'Ali Raza' },    created_at: new Date(Date.now() - 7200000).toISOString() },
  { id: 'f2', name: 'Bloom — social pack.zip',         mime_type: 'zip',     file_size: 52428800,  team_members: { name: 'Hina Malik' },  created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: 'f3', name: 'Apex — brand guidelines.pdf',     mime_type: 'pdf',     file_size: 8800000,   team_members: { name: 'Sara Khan' },   created_at: new Date(Date.now() - 172800000).toISOString() },
  { id: 'f4', name: 'Spark — service agreement.pdf',   mime_type: 'pdf',     file_size: 327680,    team_members: { name: 'Zara Ahmed' },  created_at: new Date(Date.now() - 259200000).toISOString() },
  { id: 'f5', name: 'Swift — proposal deck.pptx',      mime_type: 'pptx',    file_size: 163840000, team_members: { name: 'Omar Sheikh' }, created_at: new Date(Date.now() - 345600000).toISOString() },
];

function mimeIcon(mime) {
  if (!mime) return { icon: 'file', color: 'var(--slate-400)' };
  if (mime.includes('pdf'))    return { icon: 'file-text',     color: 'var(--red-500)' };
  if (mime.includes('image'))  return { icon: 'image',         color: 'var(--violet-500)' };
  if (mime.includes('video'))  return { icon: 'video',         color: 'var(--teal-500)' };
  if (mime.includes('zip') || mime.includes('archive')) return { icon: 'folder-archive', color: 'var(--amber-500)' };
  if (mime.includes('figma'))  return { icon: 'figma',         color: 'var(--violet-500)' };
  if (mime.includes('pptx') || mime.includes('presentation')) return { icon: 'presentation', color: 'var(--orange-500)' };
  if (mime.includes('doc') || mime.includes('word')) return { icon: 'file-text', color: 'var(--blue-500)' };
  if (mime.includes('sheet') || mime.includes('excel')) return { icon: 'sheet', color: 'var(--green-500)' };
  return { icon: 'file', color: 'var(--slate-400)' };
}

function fmtSize(bytes) {
  if (!bytes) return '—';
  if (bytes >= 1073741824) return (bytes / 1073741824).toFixed(1) + ' GB';
  if (bytes >= 1048576)    return (bytes / 1048576).toFixed(0) + ' MB';
  if (bytes >= 1024)       return (bytes / 1024).toFixed(0) + ' KB';
  return bytes + ' B';
}

function fmtWhen(ds) {
  if (!ds) return '—';
  const d = new Date(ds); const now = new Date();
  const diff = Math.round((now - d) / 3600000);
  if (diff < 1) return 'Just now';
  if (diff < 24) return diff + 'h ago';
  if (diff < 48) return 'Yesterday';
  return d.toLocaleDateString('en', { month: 'short', day: 'numeric' });
}

function Files() {
  const [files, setFiles] = React.useState(FALLBACK_FILES);
  const [totalFiles, setTotalFiles] = React.useState(810);

  React.useEffect(() => {
    if (!window.API) return;
    window.API.getFiles().then(r => {
      if (r.data && r.data.length > 0) {
        setFiles(r.data);
        setTotalFiles(r.data.length);
      }
    }).catch(() => {});
  }, []);

  return (
    <div style={{ padding: 24, maxWidth: 1280, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--fw-extrabold)', letterSpacing: '-0.02em' }}>Files</h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 2 }}>{totalFiles} files · Shared workspace</p>
        </div>
        <button style={{ display: 'inline-flex', alignItems: 'center', gap: 7, height: 36, padding: '0 14px', background: 'var(--blue-600)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-brand)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', cursor: 'pointer' }}>
          <Icon name="upload" size={16} /> Upload
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
        {FOLDERS.map((f, i) => (
          <Card key={i} interactive padding="md" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <span style={{ width: 44, height: 44, borderRadius: 'var(--radius-lg)', background: f.bg, color: f.color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={f.icon} size={22} /></span>
            <div>
              <div style={{ fontSize: 'var(--text-md)', fontWeight: 'var(--fw-bold)', color: 'var(--text-strong)' }}>{f.name}</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 2 }}>{f.count} files · {f.size}</div>
            </div>
          </Card>
        ))}
      </div>
      <Card padding="none">
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--fw-bold)' }}>Recent files</h3>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Team access · version controlled</span>
        </div>
        {files.map((f, i) => {
          const { icon, color } = mimeIcon(f.mime_type);
          const uploaderName = f.team_members ? f.team_members.name : '—';
          return (
            <div key={f.id || i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 18px', borderTop: '1px solid var(--border-subtle)' }}>
              <span style={{ width: 34, height: 34, flex: 'none', borderRadius: 'var(--radius-md)', background: 'var(--slate-50)', border: '1px solid var(--border-subtle)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: color }}><Icon name={icon} size={17} /></span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{uploaderName} · {fmtWhen(f.created_at)}</div>
              </div>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-subtle)', width: 64, textAlign: 'right' }}>{fmtSize(f.file_size)}</span>
              <Icon name="download" size={17} style={{ color: 'var(--text-muted)', cursor: 'pointer' }} />
              <Icon name="more-vertical" size={17} style={{ color: 'var(--text-subtle)', cursor: 'pointer' }} />
            </div>
          );
        })}
      </Card>
    </div>
  );
}
Object.assign(window, { Files });
})();
