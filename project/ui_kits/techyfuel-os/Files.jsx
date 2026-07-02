// Files screen — folder manager.
(() => {
const { Card, Badge, Avatar } = window.TechyFuelOSDesignSystem_be0222;

const FOLDERS = [
  { name: 'Designs',   color: 'var(--violet-500)', bg: 'var(--violet-50)', icon: 'palette',   mimeKeys: ['figma', 'image'] },
  { name: 'Videos',    color: 'var(--teal-500)',   bg: 'var(--teal-50)',   icon: 'film',       mimeKeys: ['video'] },
  { name: 'Documents', color: 'var(--blue-500)',   bg: 'var(--blue-50)',   icon: 'file-text',  mimeKeys: ['pdf', 'doc', 'sheet', 'excel', 'txt'] },
  { name: 'Contracts', color: 'var(--green-500)',  bg: 'var(--green-50)',  icon: 'file-check', mimeKeys: ['contract'] },
];

function mimeIcon(mime) {
  if (!mime) return { icon: 'file', color: 'var(--slate-400)' };
  if (mime.startsWith('application/vnd.google-apps.document'))     return { icon: 'file-text',    color: '#4285F4' };
  if (mime.startsWith('application/vnd.google-apps.spreadsheet'))  return { icon: 'sheet',         color: '#0F9D58' };
  if (mime.startsWith('application/vnd.google-apps.presentation')) return { icon: 'presentation',  color: '#F4B400' };
  if (mime.startsWith('application/vnd.google-apps.folder'))       return { icon: 'folder',        color: '#0F9D58' };
  if (mime.startsWith('application/vnd.google-apps'))              return { icon: 'hard-drive',     color: '#0F9D58' };
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
  useLucide();
  const [files, setFiles]     = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [uploading, setUploading] = React.useState(false);
  const [drivePicking, setDrivePicking] = React.useState(false);
  const fileInputRef = React.useRef();

  React.useEffect(() => {
    if (!window.API) { setLoading(false); return; }
    window.API.getFiles().then(r => {
      if (r.data) setFiles(r.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  async function handleFileSelect(e) {
    const selected = Array.from(e.target.files || []);
    if (!selected.length) return;
    setUploading(true);
    for (const file of selected) {
      const filePath = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
      let savedToDb = false;

      // Try Supabase Storage upload
      if (window.API) {
        try { await window.API.uploadFile('files', filePath, file); } catch(_) {}
      }

      // Save metadata to files table
      if (window.API) {
        try {
          const payload = {
            name:      file.name,
            file_path: filePath,
            mime_type: file.type || 'application/octet-stream',
            file_size: file.size,
          };
          const result = await window.API.createFile(payload);
          if (result && result.data) {
            setFiles(prev => [{ ...result.data, team_members: null }, ...prev]);
            savedToDb = true;
          }
        } catch(_) {}
      }

      // Always show in list even if DB save failed
      if (!savedToDb) {
        setFiles(prev => [{
          id: 'local_' + Date.now(),
          name: file.name,
          file_path: filePath,
          mime_type: file.type || 'application/octet-stream',
          file_size: file.size,
          created_at: new Date().toISOString(),
          team_members: null,
        }, ...prev]);
      }
    }
    setUploading(false);
    e.target.value = '';
  }

  async function handleConnectDrive() {
    const gdrive = readIntegrationsCfg().gdrive || {};
    if (!gdrive.driveClientId || !gdrive.driveApiKey) {
      alert('Connect Google Drive first: go to Integrations → Google Drive and add your OAuth Client ID + API Key.');
      if (window.TFNavigate) window.TFNavigate('integrations');
      return;
    }
    setDrivePicking(true);
    try {
      const docs = await pickFilesFromGoogleDrive({ clientId: gdrive.driveClientId, apiKey: gdrive.driveApiKey });
      for (const doc of docs) {
        const payload = {
          name: doc.name,
          file_path: doc.url || `https://drive.google.com/file/d/${doc.id}/view`,
          mime_type: doc.mimeType || 'application/vnd.google-apps.file',
          file_size: doc.sizeBytes ? Number(doc.sizeBytes) : null,
        };
        if (window.API) {
          try {
            const result = await window.API.createFile(payload);
            if (result && result.data) { setFiles(prev => [{ ...result.data, team_members: null }, ...prev]); continue; }
          } catch (_) {}
        }
        setFiles(prev => [{ id: 'drive_' + doc.id, ...payload, created_at: new Date().toISOString(), team_members: null }, ...prev]);
      }
    } catch (err) {
      alert('Could not connect to Google Drive: ' + (err.message || err));
    } finally {
      setDrivePicking(false);
    }
  }

  function folderCount(f) {
    return files.filter(file => f.mimeKeys.some(k => (file.mime_type || '').toLowerCase().includes(k))).length;
  }
  function folderSize(f) {
    const total = files.filter(file => f.mimeKeys.some(k => (file.mime_type || '').toLowerCase().includes(k))).reduce((s, file) => s + (file.file_size || 0), 0);
    return fmtSize(total) === '—' ? '0 KB' : fmtSize(total);
  }

  return (
    <div style={{ padding: 24, maxWidth: 1280, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--fw-extrabold)', letterSpacing: '-0.02em' }}>Files</h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 2 }}>{files.length} files · Shared workspace</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={handleConnectDrive} disabled={drivePicking}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 7, height: 36, padding: '0 14px', background: '#fff', color: '#0F9D58', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', cursor: drivePicking ? 'not-allowed' : 'pointer', opacity: drivePicking ? 0.7 : 1 }}>
            <Icon name={drivePicking ? 'loader' : 'hard-drive'} size={16} /> {drivePicking ? 'Connecting…' : 'Connect Google Drive'}
          </button>
          <button onClick={() => fileInputRef.current.click()} disabled={uploading}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 7, height: 36, padding: '0 14px', background: 'var(--blue-600)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-brand)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', cursor: uploading ? 'not-allowed' : 'pointer', opacity: uploading ? 0.7 : 1 }}>
            <Icon name={uploading ? 'loader' : 'upload'} size={16} /> {uploading ? 'Uploading…' : 'Upload'}
          </button>
        </div>
        <input ref={fileInputRef} type="file" multiple style={{ display: 'none' }} onChange={handleFileSelect} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
        {FOLDERS.map((f, i) => (
          <Card key={i} interactive padding="md" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <span style={{ width: 44, height: 44, borderRadius: 'var(--radius-lg)', background: f.bg, color: f.color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={f.icon} size={22} /></span>
            <div>
              <div style={{ fontSize: 'var(--text-md)', fontWeight: 'var(--fw-bold)', color: 'var(--text-strong)' }}>{f.name}</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 2 }}>{folderCount(f)} files · {folderSize(f)}</div>
            </div>
          </Card>
        ))}
      </div>
      <Card padding="none">
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--fw-bold)' }}>Recent files</h3>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Team access · version controlled</span>
        </div>
        {loading && (
          <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>Loading…</div>
        )}
        {!loading && files.length === 0 && (
          <div style={{ padding: '48px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <span style={{ width: 52, height: 52, borderRadius: 'var(--radius-xl)', background: 'var(--slate-100)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="folder-open" size={26} style={{ color: 'var(--text-subtle)' }} />
            </span>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)' }}>No files yet</div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 4 }}>Upload your first file using the button above</div>
            </div>
          </div>
        )}
        {!loading && files.map((f, i) => {
          const { icon, color } = mimeIcon(f.mime_type);
          const uploaderName = f.team_members ? f.team_members.name : '—';
          const isDrive = isDriveFile(f);
          return (
            <div key={f.id || i} onClick={() => f.url && window.open(f.url, '_blank')}
              style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 18px', borderTop: '1px solid var(--border-subtle)', cursor: f.url ? 'pointer' : 'default' }}>
              <span style={{ width: 34, height: 34, flex: 'none', borderRadius: 'var(--radius-md)', background: 'var(--slate-50)', border: '1px solid var(--border-subtle)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: color }}><Icon name={icon} size={17} /></span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                  {isDrive ? <span style={{ color: '#0F9D58', fontWeight: 'var(--fw-semibold)' }}>Google Drive</span> : uploaderName} · {fmtWhen(f.created_at)}
                </div>
              </div>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-subtle)', width: 64, textAlign: 'right' }}>{fmtSize(f.file_size)}</span>
              <Icon name={isDrive ? 'external-link' : 'download'} size={17}
                onClick={e => { e.stopPropagation(); if (f.url) window.open(f.url, '_blank'); }}
                style={{ color: 'var(--text-muted)', cursor: 'pointer' }} />
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
