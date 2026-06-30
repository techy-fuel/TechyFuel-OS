// Docs.jsx — Rich Documents & File Storage
(() => {
const { Card, Badge, Avatar } = window.TechyFuelOSDesignSystem_be0222;

const BLOCK_TYPES = [
  { type: 'paragraph', label: 'Text', icon: 'type' },
  { type: 'h1', label: 'Heading 1', icon: 'heading-1' },
  { type: 'h2', label: 'Heading 2', icon: 'heading-2' },
  { type: 'h3', label: 'Heading 3', icon: 'heading-3' },
  { type: 'bullet', label: 'Bullet list', icon: 'list' },
  { type: 'numbered', label: 'Numbered list', icon: 'list-ordered' },
  { type: 'checklist', label: 'To-do', icon: 'check-square' },
  { type: 'code', label: 'Code block', icon: 'code' },
  { type: 'quote', label: 'Quote', icon: 'quote' },
  { type: 'image', label: 'Image', icon: 'image' },
  { type: 'table', label: 'Table', icon: 'table' },
  { type: 'divider', label: 'Divider', icon: 'minus' },
];

function uid() { return Math.random().toString(36).slice(2) + Date.now().toString(36); }

function mkBlock(type = 'paragraph') {
  const id = uid();
  if (type === 'table') return { id, type, rows: [['', ''], ['', '']] };
  if (type === 'checklist') return { id, type, text: '', checked: false };
  if (type === 'code') return { id, type, code: '', language: 'javascript' };
  if (type === 'image') return { id, type, url: '', caption: '' };
  if (type === 'divider') return { id, type };
  return { id, type, text: '' };
}

// ── Single Block ──────────────────────────────────────────────────────────────
function Block({ block, index, onChange, onKeyDown, elRef }) {
  const base = { outline: 'none', width: '100%', border: 'none', background: 'transparent', fontFamily: 'var(--font-sans)', resize: 'none', padding: 0 };

  function detectMarkdown(val) {
    if (val === '# ') return onChange({ ...block, type: 'h1', text: '' });
    if (val === '## ') return onChange({ ...block, type: 'h2', text: '' });
    if (val === '### ') return onChange({ ...block, type: 'h3', text: '' });
    if (val === '- ' || val === '* ') return onChange({ ...block, type: 'bullet', text: '' });
    if (val === '1. ') return onChange({ ...block, type: 'numbered', text: '' });
    if (val === '[] ' || val === '[ ] ') return onChange({ ...block, type: 'checklist', text: '', checked: false });
    if (val === '```') return onChange({ ...block, type: 'code', code: '', language: 'javascript' });
    if (val === '> ') return onChange({ ...block, type: 'quote', text: '' });
    if (val === '---') return onChange({ ...block, type: 'divider' });
    onChange({ ...block, text: val });
  }

  if (block.type === 'divider') return <hr style={{ border: 'none', borderTop: '2px solid var(--slate-200)', margin: '12px 0' }} />;

  if (block.type === 'image') {
    if (block.url) return (
      <div style={{ textAlign: 'center', margin: '8px 0' }}>
        <img src={block.url} alt={block.caption} style={{ maxWidth: '100%', borderRadius: 8, maxHeight: 400 }} />
        <input value={block.caption || ''} onChange={e => onChange({ ...block, caption: e.target.value })} placeholder="Caption..." style={{ ...base, textAlign: 'center', fontSize: 13, color: 'var(--text-muted)', marginTop: 6, display: 'block' }} />
      </div>
    );
    return (
      <div style={{ border: '2px dashed var(--slate-300)', borderRadius: 10, padding: 32, textAlign: 'center', cursor: 'pointer', background: 'var(--slate-50)' }}
        onClick={() => { const u = prompt('Paste image URL:'); if (u) onChange({ ...block, url: u }); }}>
        <Icon name="image" size={28} style={{ color: 'var(--slate-400)' }} />
        <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: '8px 0 0' }}>Click to embed image URL</p>
      </div>
    );
  }

  if (block.type === 'code') return (
    <div style={{ background: '#1e2530', borderRadius: 10, overflow: 'hidden', margin: '4px 0' }}>
      <div style={{ padding: '8px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ display: 'flex', gap: 5 }}>
          {['#ff5f57','#febc2e','#28c840'].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
        </div>
        <select value={block.language || 'javascript'} onChange={e => onChange({ ...block, language: e.target.value })}
          style={{ background: 'transparent', border: 'none', color: '#8899aa', fontSize: 12, cursor: 'pointer', marginLeft: 8 }}>
          {['javascript','typescript','python','html','css','sql','bash','json','go','rust'].map(l => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>
      <textarea ref={elRef} value={block.code || ''} onChange={e => onChange({ ...block, code: e.target.value })} onKeyDown={e => onKeyDown(e, block, index)}
        rows={Math.max(3, (block.code || '').split('\n').length + 1)}
        style={{ ...base, color: '#a8d8ea', fontSize: 13.5, fontFamily: 'monospace', lineHeight: 1.65, padding: '14px 18px', display: 'block' }}
        placeholder="// write code here..." />
    </div>
  );

  if (block.type === 'table') return (
    <div style={{ overflowX: 'auto', margin: '4px 0' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 14 }}>
        <tbody>
          {(block.rows || []).map((row, ri) => (
            <tr key={ri} style={{ background: ri === 0 ? 'var(--slate-50)' : 'white' }}>
              {row.map((cell, ci) => (
                <td key={ci} style={{ border: '1px solid var(--slate-200)', padding: 0, minWidth: 120 }}>
                  <input value={cell} onChange={e => { const rows = block.rows.map((r, rr) => rr === ri ? r.map((c, cc) => cc === ci ? e.target.value : c) : r); onChange({ ...block, rows }); }}
                    style={{ ...base, fontSize: 14, padding: '7px 11px', fontWeight: ri === 0 ? 600 : 400 }} />
                </td>
              ))}
              <td style={{ padding: '0 4px', border: '1px solid var(--slate-200)' }}>
                <button onClick={() => onChange({ ...block, rows: block.rows.filter((_, i) => i !== ri) })} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px 5px', fontSize: 14 }}>×</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
        <button onClick={() => onChange({ ...block, rows: [...block.rows, block.rows[0]?.map(() => '') || ['', '']] })} style={{ fontSize: 12, color: 'var(--blue-600)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>+ Add row</button>
        <button onClick={() => onChange({ ...block, rows: block.rows.map(r => [...r, '']) })} style={{ fontSize: 12, color: 'var(--blue-600)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>+ Add column</button>
      </div>
    </div>
  );

  if (block.type === 'checklist') return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '2px 0' }}>
      <input type="checkbox" checked={!!block.checked} onChange={e => onChange({ ...block, checked: e.target.checked })} style={{ marginTop: 4, accentColor: 'var(--blue-600)', cursor: 'pointer', width: 16, height: 16, flexShrink: 0 }} />
      <textarea ref={elRef} value={block.text || ''} onChange={e => detectMarkdown(e.target.value)} onKeyDown={e => onKeyDown(e, block, index)} rows={1}
        style={{ ...base, fontSize: 15, lineHeight: 1.65, flex: 1, textDecoration: block.checked ? 'line-through' : 'none', color: block.checked ? 'var(--text-muted)' : 'inherit' }}
        placeholder="To-do..."
        onInput={e => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }} />
    </div>
  );

  const styles = {
    paragraph: { fontSize: 15, lineHeight: 1.75, color: 'var(--text-body)' },
    h1: { fontSize: 33, fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.025em', marginTop: 8 },
    h2: { fontSize: 25, fontWeight: 700, lineHeight: 1.3, letterSpacing: '-0.015em', marginTop: 6 },
    h3: { fontSize: 19, fontWeight: 600, lineHeight: 1.4, marginTop: 4 },
    bullet: { fontSize: 15, lineHeight: 1.75, paddingLeft: 18 },
    numbered: { fontSize: 15, lineHeight: 1.75, paddingLeft: 22 },
    quote: { fontSize: 15, lineHeight: 1.75, borderLeft: '3px solid var(--blue-400)', paddingLeft: 18, color: 'var(--text-muted)', fontStyle: 'italic' },
  };
  const ph = { paragraph: "Type '/' for commands...", h1: 'Heading 1', h2: 'Heading 2', h3: 'Heading 3', bullet: 'List item', numbered: 'List item', quote: 'Blockquote' };

  return (
    <div style={{ position: 'relative' }}>
      {block.type === 'bullet' && <span style={{ position: 'absolute', left: 5, top: 9, width: 5, height: 5, borderRadius: '50%', background: 'var(--text-muted)' }} />}
      {block.type === 'numbered' && <span style={{ position: 'absolute', left: 0, top: 2, fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.75, minWidth: 18 }}>{index + 1}.</span>}
      <textarea ref={elRef} value={block.text || ''} onChange={e => detectMarkdown(e.target.value)} onKeyDown={e => onKeyDown(e, block, index)} rows={1}
        style={{ ...base, ...(styles[block.type] || styles.paragraph) }}
        placeholder={ph[block.type] || ''}
        onInput={e => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }} />
    </div>
  );
}

// ── Slash Command Menu ─────────────────────────────────────────────────────────
function SlashMenu({ pos, query, onSelect, onClose }) {
  const filtered = BLOCK_TYPES.filter(b => b.label.toLowerCase().includes((query||'').toLowerCase()) || b.type.includes(query||''));
  const [sel, setSel] = React.useState(0);
  React.useEffect(() => { setSel(0); }, [query]);
  React.useEffect(() => {
    function kd(e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); setSel(s => Math.min(s+1, filtered.length-1)); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setSel(s => Math.max(s-1, 0)); }
      else if (e.key === 'Enter') { e.preventDefault(); if (filtered[sel]) onSelect(filtered[sel].type); }
      else if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', kd, true);
    return () => window.removeEventListener('keydown', kd, true);
  }, [sel, filtered]);
  if (!filtered.length) return null;
  return (
    <div style={{ position: 'fixed', top: pos.y, left: pos.x, zIndex: 9000, background: 'white', border: '1px solid var(--slate-200)', borderRadius: 10, boxShadow: 'var(--shadow-xl)', padding: 6, minWidth: 200, maxHeight: 320, overflowY: 'auto' }}>
      <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, padding: '4px 10px 6px', textTransform: 'uppercase', letterSpacing: 0.6, margin: 0 }}>Insert block</p>
      {filtered.map((b, i) => (
        <button key={b.type} onClick={() => onSelect(b.type)} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left', padding: '8px 10px', borderRadius: 7, border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: 14, background: i === sel ? 'var(--blue-50)' : 'transparent', color: i === sel ? 'var(--blue-700)' : 'var(--text-body)' }}>
          <Icon name={b.icon} size={15} /> {b.label}
        </button>
      ))}
    </div>
  );
}

// ── Block Editor ──────────────────────────────────────────────────────────────
function BlockEditor({ blocks, onChange }) {
  const [slash, setSlash] = React.useState(null);
  const refs = React.useRef({});

  function update(updated) { onChange(blocks.map(b => b.id === updated.id ? updated : b)); }

  function handleKD(e, block, idx) {
    const val = block.code !== undefined ? (block.code || '') : (block.text || '');

    if (e.key === '/' && !val) {
      const rect = e.target.getBoundingClientRect();
      setSlash({ blockId: block.id, pos: { x: rect.left, y: rect.bottom + 6 }, query: '' });
      e.preventDefault(); return;
    }
    if (slash?.blockId === block.id) {
      if (e.key === 'Backspace' && !slash.query) { setSlash(null); return; }
      if (e.key.length === 1 && e.key !== '/') { setSlash(s => ({ ...s, query: s.query + e.key })); }
    }

    if (e.key === 'Enter' && !e.shiftKey && block.type !== 'code') {
      e.preventDefault();
      const nb = mkBlock('paragraph');
      const nb2 = [...blocks]; nb2.splice(idx + 1, 0, nb);
      onChange(nb2);
      setTimeout(() => refs.current[nb.id]?.focus(), 20);
    }
    if (e.key === 'Backspace' && !val && blocks.length > 1) {
      e.preventDefault();
      onChange(blocks.filter(b => b.id !== block.id));
      setTimeout(() => refs.current[blocks[idx-1]?.id]?.focus(), 20);
    }
    if (e.key === 'ArrowUp' && idx > 0) refs.current[blocks[idx-1].id]?.focus();
    if (e.key === 'ArrowDown' && idx < blocks.length - 1) refs.current[blocks[idx+1].id]?.focus();
  }

  function insertBlock(type, afterId) {
    const idx = blocks.findIndex(b => b.id === afterId);
    const cur = blocks[idx];
    const isEmpty = cur && cur.type === 'paragraph' && !cur.text;
    if (isEmpty) {
      const nb = mkBlock(type);
      onChange(blocks.map(b => b.id === afterId ? { ...nb, id: b.id } : b));
      setTimeout(() => refs.current[afterId]?.focus(), 20);
    } else {
      const nb = mkBlock(type);
      const arr = [...blocks]; arr.splice(idx + 1, 0, nb);
      onChange(arr);
      setTimeout(() => refs.current[nb.id]?.focus(), 20);
    }
    setSlash(null);
  }

  return (
    <div onClick={() => slash && setSlash(null)}>
      {blocks.map((b, i) => (
        <div key={b.id} style={{ padding: '1px 0' }}>
          <Block block={b} index={i} onChange={update} onKeyDown={handleKD} elRef={el => refs.current[b.id] = el} />
        </div>
      ))}
      <div style={{ padding: '16px 0 120px', color: 'var(--slate-300)', fontSize: 14, cursor: 'text' }}
        onClick={() => { const nb = mkBlock(); onChange([...blocks, nb]); setTimeout(() => refs.current[nb.id]?.focus(), 20); }}>
        Click to keep writing...
      </div>
      {slash && <SlashMenu pos={slash.pos} query={slash.query} onSelect={t => insertBlock(t, slash.blockId)} onClose={() => setSlash(null)} />}
    </div>
  );
}

// ── Version History ────────────────────────────────────────────────────────────
function VersionHistory({ docId, onRestore, onClose }) {
  const [versions, setVersions] = React.useState([]);
  const [sel, setSel] = React.useState(null);
  React.useEffect(() => {
    if (!window.API || !docId) return;
    (async () => { try { const { data } = await window.API.getDocVersions(docId); setVersions(data || []); } catch {} })();
  }, [docId]);
  return (
    <div style={{ width: 300, borderLeft: '1px solid var(--slate-200)', display: 'flex', flexDirection: 'column', flexShrink: 0, overflow: 'hidden' }}>
      <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--slate-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>Version History</h3>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}><Icon name="x" size={16} /></button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 12 }}>
        {!versions.length && <p style={{ color: 'var(--text-muted)', fontSize: 14, textAlign: 'center', marginTop: 32 }}>No versions saved yet.<br/>Versions are created auto-saved periodically.</p>}
        {versions.map((v, i) => (
          <div key={v.id} onClick={() => setSel(sel?.id === v.id ? null : v)}
            style={{ padding: '10px 12px', borderRadius: 8, border: `1px solid ${sel?.id === v.id ? 'var(--blue-400)' : 'var(--slate-200)'}`, marginBottom: 8, cursor: 'pointer', background: sel?.id === v.id ? 'var(--blue-50)' : 'white' }}>
            <p style={{ fontSize: 13, fontWeight: 600, margin: '0 0 2px' }}>Version {versions.length - i}</p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>{new Date(v.created_at).toLocaleString()}</p>
            {sel?.id === v.id && (
              <button onClick={e => { e.stopPropagation(); onRestore(v.content); }}
                style={{ marginTop: 8, fontSize: 12, background: 'var(--blue-600)', color: 'white', border: 'none', borderRadius: 6, padding: '5px 12px', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                Restore this version
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── File Preview ───────────────────────────────────────────────────────────────
function FilePreview({ file, onClose }) {
  const t = file.file_type || '';
  const n = file.name || '';
  const isImg = t.startsWith('image/') || /\.(png|jpe?g|gif|webp|svg)$/i.test(n);
  const isPdf = t === 'application/pdf' || /\.pdf$/i.test(n);
  const isVid = t.startsWith('video/') || /\.(mp4|webm|mov)$/i.test(n);
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }} onClick={onClose}>
      <div style={{ background: 'white', borderRadius: 14, overflow: 'hidden', maxWidth: '88vw', maxHeight: '88vh', display: 'flex', flexDirection: 'column', minWidth: 400 }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: '13px 20px', borderBottom: '1px solid var(--slate-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>{file.name}</p>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}><Icon name="x" size={18} /></button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          {isImg && <img src={file.url} alt={file.name} style={{ maxWidth: '100%', maxHeight: '72vh', borderRadius: 8, objectFit: 'contain' }} />}
          {isPdf && <iframe src={file.url} style={{ width: 680, height: '72vh', border: 'none', borderRadius: 4 }} />}
          {isVid && <video src={file.url} controls style={{ maxWidth: '100%', maxHeight: '72vh', borderRadius: 8 }} />}
          {!isImg && !isPdf && !isVid && (
            <div style={{ textAlign: 'center', padding: 48 }}>
              <Icon name="file" size={52} style={{ color: 'var(--slate-300)' }} />
              <p style={{ color: 'var(--text-muted)', margin: '14px 0 18px', fontSize: 15 }}>Preview not available</p>
              <a href={file.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--blue-600)', fontWeight: 600, fontSize: 14, textDecoration: 'none', background: 'var(--blue-50)', padding: '8px 18px', borderRadius: 8 }}>Open file ↗</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Files Browser ─────────────────────────────────────────────────────────────
function FilesBrowser({ projectId }) {
  const [allFolders, setAllFolders] = React.useState([]);
  const [files, setFiles] = React.useState([]);
  const [currentFolder, setCurrentFolder] = React.useState(null);
  const [crumb, setCrumb] = React.useState([]);
  const [preview, setPreview] = React.useState(null);
  const [uploading, setUploading] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [newName, setNewName] = React.useState('');
  const [showNew, setShowNew] = React.useState(false);
  const [drag, setDrag] = React.useState(false);
  const [view, setView] = React.useState('grid'); // 'grid' | 'list'

  async function load() {
    if (!window.API) return;
    try { const { data } = await window.API.getFolders(projectId); setAllFolders(data || []); } catch {}
    try { const { data } = await window.API.getFiles({ projectId, folderId: currentFolder }); setFiles(data || []); } catch {}
  }
  React.useEffect(() => { if (projectId) load(); }, [projectId, currentFolder]);

  async function upload(fileList) {
    if (!fileList?.length || !window.API) return;
    setUploading(true);
    for (const f of Array.from(fileList)) {
      try {
        const path = `${projectId}/${Date.now()}_${f.name}`;
        const url = await window.API.uploadFile('project-files', path, f);
        const rec = { name: f.name, url, file_type: f.type, file_size: f.size, folder_id: currentFolder };
        if (projectId) rec.project_id = projectId;
        const { error } = await window.API.createFile(rec);
        if (error) throw error;
      } catch (err) {
        const msg = (err && (err.message || err.error_description || err.msg)) || JSON.stringify(err);
        alert('Upload failed for "' + f.name + '":\n\n' + msg);
        console.error('[Upload error]', err);
      }
    }
    setUploading(false); load();
  }

  async function createFolder() {
    if (!newName.trim() || !window.API) return;
    try { await window.API.createFolder({ name: newName.trim(), project_id: projectId, parent_id: currentFolder }); setNewName(''); setShowNew(false); load(); } catch {}
  }

  const folders = allFolders.filter(f => f.parent_id === currentFolder);
  const filtered = files.filter(f => !search || f.name?.toLowerCase().includes(search.toLowerCase()));

  function fmt(bytes) {
    if (!bytes) return '—';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes/1024).toFixed(1) + ' KB';
    return (bytes/1048576).toFixed(1) + ' MB';
  }
  function FileIco({ file }) {
    const t = file.file_type || '';
    if (t.startsWith('image/')) return <Icon name="image" size={22} style={{ color: '#3b82f6' }} />;
    if (t === 'application/pdf') return <Icon name="file-text" size={22} style={{ color: '#ef4444' }} />;
    if (t.startsWith('video/')) return <Icon name="video" size={22} style={{ color: '#8b5cf6' }} />;
    if (t.includes('sheet') || t.includes('excel')) return <Icon name="table" size={22} style={{ color: '#22c55e' }} />;
    return <Icon name="file" size={22} style={{ color: 'var(--slate-400)' }} />;
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '14px 24px', borderBottom: '1px solid var(--slate-200)', display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, position: 'relative', minWidth: 200 }}>
          <Icon name="search" size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search files..."
            style={{ width: '100%', paddingLeft: 30, paddingRight: 12, height: 36, border: '1px solid var(--slate-200)', borderRadius: 8, fontSize: 14, fontFamily: 'var(--font-sans)', outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <button onClick={() => setView(v => v === 'grid' ? 'list' : 'grid')} style={{ height: 36, padding: '0 12px', border: '1px solid var(--slate-200)', borderRadius: 8, background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' }}>
          <Icon name={view === 'grid' ? 'list' : 'grid-2x2'} size={15} />
        </button>
        <button onClick={() => setShowNew(true)} style={{ height: 36, padding: '0 14px', border: '1px solid var(--slate-200)', borderRadius: 8, background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontFamily: 'var(--font-sans)', color: 'var(--text-body)' }}>
          <Icon name="folder-plus" size={15} /> New folder
        </button>
        <label style={{ height: 36, padding: '0 16px', background: 'var(--blue-600)', color: 'white', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 600 }}>
          <Icon name="upload" size={15} /> Upload
          <input type="file" multiple style={{ display: 'none' }} onChange={e => upload(e.target.files)} />
        </label>
      </div>

      {/* Breadcrumb */}
      <div style={{ padding: '8px 24px', display: 'flex', alignItems: 'center', gap: 5, fontSize: 14 }}>
        <button onClick={() => { setCurrentFolder(null); setCrumb([]); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: crumb.length ? 'var(--blue-600)' : 'var(--text-body)', padding: 0, fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: !crumb.length ? 600 : 400 }}>
          <Icon name="folder" size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />All Files
        </button>
        {crumb.map((bc, i) => (
          <React.Fragment key={bc.id}>
            <Icon name="chevron-right" size={13} style={{ color: 'var(--text-muted)' }} />
            <button onClick={() => { setCurrentFolder(bc.id); setCrumb(c => c.slice(0, i+1)); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: i === crumb.length-1 ? 'var(--text-body)' : 'var(--blue-600)', padding: 0, fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: i === crumb.length-1 ? 600 : 400 }}>
              {bc.name}
            </button>
          </React.Fragment>
        ))}
      </div>

      {showNew && (
        <div style={{ padding: '6px 24px 10px', display: 'flex', gap: 8 }}>
          <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Folder name..." autoFocus
            onKeyDown={e => { if (e.key === 'Enter') createFolder(); if (e.key === 'Escape') { setShowNew(false); setNewName(''); } }}
            style={{ flex: 1, height: 34, padding: '0 12px', border: '1px solid var(--blue-400)', borderRadius: 7, fontSize: 14, fontFamily: 'var(--font-sans)', outline: 'none' }} />
          <button onClick={createFolder} style={{ height: 34, padding: '0 14px', background: 'var(--blue-600)', color: 'white', border: 'none', borderRadius: 7, cursor: 'pointer', fontSize: 14, fontFamily: 'var(--font-sans)' }}>Create</button>
          <button onClick={() => { setShowNew(false); setNewName(''); }} style={{ height: 34, padding: '0 12px', background: 'none', border: '1px solid var(--slate-200)', borderRadius: 7, cursor: 'pointer', fontSize: 14, color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' }}>Cancel</button>
        </div>
      )}

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 24px 32px', position: 'relative' }}
        onDragOver={e => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)}
        onDrop={e => { e.preventDefault(); setDrag(false); upload(e.dataTransfer.files); }}>
        {drag && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(59,130,246,0.08)', border: '3px dashed var(--blue-400)', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 12, pointerEvents: 'none' }}>
            <div style={{ textAlign: 'center', color: 'var(--blue-600)' }}>
              <Icon name="upload-cloud" size={44} />
              <p style={{ fontSize: 18, fontWeight: 700, margin: '8px 0 0' }}>Drop to upload</p>
            </div>
          </div>
        )}
        {uploading && <div style={{ padding: '10px 14px', background: 'var(--blue-50)', borderRadius: 8, marginBottom: 12, color: 'var(--blue-700)', fontSize: 14, fontWeight: 500 }}>⟳ Uploading files...</div>}

        {/* Folders */}
        {folders.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.6, margin: '0 0 10px' }}>Folders</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 10 }}>
              {folders.map(f => (
                <div key={f.id} onClick={() => { setCurrentFolder(f.id); setCrumb(c => [...c, { id: f.id, name: f.name }]); }}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', border: '1px solid var(--slate-200)', borderRadius: 9, cursor: 'pointer', background: 'white', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--slate-50)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                  <Icon name="folder" size={20} style={{ color: '#f59e0b', flexShrink: 0 }} />
                  <span style={{ fontSize: 14, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Files */}
        {filtered.length > 0 && (
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.6, margin: '0 0 10px' }}>Files ({filtered.length})</p>
            {view === 'grid' ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(175px, 1fr))', gap: 10 }}>
                {filtered.map(f => {
                  const isImg = f.file_type?.startsWith('image/');
                  return (
                    <div key={f.id} onClick={() => setPreview(f)}
                      style={{ border: '1px solid var(--slate-200)', borderRadius: 10, overflow: 'hidden', cursor: 'pointer', background: 'white', transition: 'box-shadow 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
                      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
                      {isImg ? (
                        <div style={{ height: 110, overflow: 'hidden', background: 'var(--slate-100)' }}>
                          <img src={f.url} alt={f.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      ) : (
                        <div style={{ height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--slate-50)' }}>
                          <FileIco file={f} />
                        </div>
                      )}
                      <div style={{ padding: '8px 11px' }}>
                        <p style={{ fontSize: 13, fontWeight: 500, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</p>
                        <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '2px 0 0' }}>{fmt(f.file_size)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ border: '1px solid var(--slate-200)', borderRadius: 10, overflow: 'hidden' }}>
                {filtered.map((f, i) => (
                  <div key={f.id} onClick={() => setPreview(f)}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', borderBottom: i < filtered.length-1 ? '1px solid var(--slate-100)' : 'none', cursor: 'pointer', background: 'white' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--slate-50)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                    <FileIco file={f} />
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <p style={{ fontSize: 14, fontWeight: 500, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</p>
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{fmt(f.file_size)}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{new Date(f.created_at).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {folders.length === 0 && filtered.length === 0 && !uploading && (
          <div style={{ textAlign: 'center', padding: '64px 40px', color: 'var(--text-muted)' }}>
            <Icon name="folder-open" size={44} style={{ color: 'var(--slate-200)' }} />
            <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-heading)', margin: '14px 0 6px' }}>No files here yet</p>
            <p style={{ fontSize: 14, margin: 0 }}>Drag & drop files or click Upload to get started</p>
          </div>
        )}
      </div>
      {preview && <FilePreview file={preview} onClose={() => setPreview(null)} />}
    </div>
  );
}

// ── Main Docs Screen ───────────────────────────────────────────────────────────
function Docs() {
  const [projects, setProjects] = React.useState([]);
  const [project, setProject] = React.useState(null);
  const [docs, setDocs] = React.useState([]);
  const [doc, setDoc] = React.useState(null);
  const [blocks, setBlocks] = React.useState([mkBlock()]);
  const [title, setTitle] = React.useState('Untitled');
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [showVersions, setShowVersions] = React.useState(false);
  const [tab, setTab] = React.useState('docs');
  const [search, setSearch] = React.useState('');
  const [tasks, setTasks] = React.useState([]);
  const [linkedTask, setLinkedTask] = React.useState(null);
  const [peers, setPeers] = React.useState([]);
  const [docCh, setDocCh] = React.useState(null);
  const timer = React.useRef(null);

  React.useEffect(() => {
    if (!window.API) return;
    (async () => { try { const { data } = await window.API.getProjects(); if (data?.length) { setProjects(data); setProject(data[0]); } } catch {} })();
  }, []);

  React.useEffect(() => {
    if (!project || !window.API) return;
    setDoc(null); setDocs([]);
    (async () => {
      try { const { data } = await window.API.getDocs(project.id); setDocs(data || []); } catch {}
      try { const { data } = await window.API.getTasks({ projectId: project.id }); setTasks(data || []); } catch {}
    })();
  }, [project?.id]);

  // Realtime collaboration
  React.useEffect(() => {
    if (!doc || !window.db) return;
    const myId = (() => { let id = localStorage.getItem('_tf_doc_uid'); if (!id) { id = uid(); localStorage.setItem('_tf_doc_uid', id); } return id; })();
    const myName = localStorage.getItem('tf_chat_member') || 'Someone';
    const ch = window.db.channel(`doc:${doc.id}`)
      .on('broadcast', { event: 'edit' }, ({ payload }) => {
        if (payload.uid !== myId) {
          setBlocks(payload.blocks);
          setPeers(prev => {
            const ex = prev.find(p => p.id === payload.uid);
            if (ex) return prev.map(p => p.id === payload.uid ? { ...p, ts: Date.now() } : p);
            return [...prev, { id: payload.uid, name: payload.name, ts: Date.now() }];
          });
        }
      })
      .subscribe();
    setDocCh({ ch, myId, myName });
    return () => { window.db.removeChannel(ch); setPeers([]); };
  }, [doc?.id]);

  function bcast(newBlocks) {
    if (!docCh) return;
    docCh.ch.send({ type: 'broadcast', event: 'edit', payload: { blocks: newBlocks, uid: docCh.myId, name: docCh.myName } });
  }

  async function save(b = blocks, t = title) {
    if (!doc || !window.API) return;
    setSaving(true);
    try {
      await window.API.updateDoc(doc.id, { content: b, title: t, updated_at: new Date().toISOString() });
      setSaved(true); setTimeout(() => setSaved(false), 2000);
      // 15% chance to snapshot version
      if (Math.random() < 0.15) {
        try { await window.API.createDocVersion({ document_id: doc.id, content: b, title: t }); } catch {}
      }
    } catch {}
    setSaving(false);
  }

  function handleBlocks(nb) {
    setBlocks(nb); setSaved(false); bcast(nb);
    clearTimeout(timer.current); timer.current = setTimeout(() => save(nb, title), 1500);
  }
  function handleTitle(e) {
    const t = e.target.value; setTitle(t); setSaved(false);
    clearTimeout(timer.current); timer.current = setTimeout(() => save(blocks, t), 1500);
  }

  async function newDoc() {
    if (!project || !window.API) return;
    try {
      const { data } = await window.API.createDoc({ title: 'Untitled', content: [mkBlock()], project_id: project.id });
      if (data) { setDocs(prev => [data, ...prev]); openDoc(data); }
    } catch {}
  }

  function openDoc(d) {
    setDoc(d); setTitle(d.title || 'Untitled');
    setBlocks(d.content?.length ? d.content : [mkBlock()]);
    setLinkedTask(d.task_id || null);
    setShowVersions(false);
  }

  async function linkTask(taskId) {
    setLinkedTask(taskId || null);
    if (doc && window.API) { try { await window.API.updateDoc(doc.id, { task_id: taskId || null }); } catch {} }
  }

  const filteredDocs = docs.filter(d => !search || d.title?.toLowerCase().includes(search.toLowerCase()));
  const activePeers = peers.filter(p => Date.now() - p.ts < 30000);

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      {/* Sidebar */}
      <div style={{ width: 255, borderRight: '1px solid var(--slate-200)', display: 'flex', flexDirection: 'column', background: 'var(--slate-50)', flexShrink: 0, overflow: 'hidden' }}>
        <div style={{ padding: '14px 14px 10px' }}>
          <select value={project?.id || ''} onChange={e => setProject(projects.find(p => p.id === e.target.value))}
            style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--slate-200)', borderRadius: 8, fontSize: 14, fontFamily: 'var(--font-sans)', background: 'white', outline: 'none', cursor: 'pointer' }}>
            <option value="">— Select project —</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div style={{ display: 'flex', padding: '0 10px 10px', gap: 4 }}>
          {['docs','files'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: '6px 0', border: 'none', borderRadius: 7, cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-sans)', background: tab === t ? 'var(--blue-600)' : 'transparent', color: tab === t ? 'white' : 'var(--text-muted)' }}>
              {t === 'docs' ? 'Docs' : 'Files'}
            </button>
          ))}
        </div>
        {tab === 'docs' && (
          <>
            <div style={{ padding: '0 10px 8px', position: 'relative' }}>
              <Icon name="search" size={13} style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search docs..."
                style={{ width: '100%', paddingLeft: 28, paddingRight: 8, height: 32, border: '1px solid var(--slate-200)', borderRadius: 7, fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none', boxSizing: 'border-box', background: 'white' }} />
            </div>
            <button onClick={newDoc} style={{ margin: '0 10px 10px', padding: '8px 0', background: 'var(--blue-600)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-sans)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <Icon name="plus" size={14} /> New Document
            </button>
            <div style={{ flex: 1, overflowY: 'auto', padding: '0 8px 16px' }}>
              {!filteredDocs.length && <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 13, marginTop: 24 }}>No documents yet</p>}
              {filteredDocs.map(d => (
                <button key={d.id} onClick={() => openDoc(d)}
                  style={{ width: '100%', textAlign: 'left', padding: '8px 10px', borderRadius: 8, border: 'none', cursor: 'pointer', background: doc?.id === d.id ? 'var(--blue-50)' : 'transparent', marginBottom: 2, fontFamily: 'var(--font-sans)' }}
                  onMouseEnter={e => { if (doc?.id !== d.id) e.currentTarget.style.background = 'var(--slate-100)'; }}
                  onMouseLeave={e => { if (doc?.id !== d.id) e.currentTarget.style.background = 'transparent'; }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <Icon name="file-text" size={14} style={{ color: doc?.id === d.id ? 'var(--blue-600)' : 'var(--text-muted)', flexShrink: 0 }} />
                    <span style={{ fontSize: 14, fontWeight: doc?.id === d.id ? 600 : 400, color: doc?.id === d.id ? 'var(--blue-700)' : 'var(--text-body)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.title || 'Untitled'}</span>
                  </div>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '2px 0 0 21px' }}>{new Date(d.updated_at || d.created_at).toLocaleDateString()}</p>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {tab === 'files' ? (
          project ? <FilesBrowser projectId={project.id} /> :
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 15 }}>Select a project to view files</div>
        ) : doc ? (
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              {/* Toolbar */}
              <div style={{ padding: '10px 28px', borderBottom: '1px solid var(--slate-200)', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: saving ? 'var(--blue-600)' : saved ? 'var(--green-600)' : 'transparent' }}>
                  {saving ? '⟳ Saving...' : '✓ Saved'}
                </span>
                <div style={{ flex: 1 }} />
                {activePeers.map(p => (
                  <span key={p.id} style={{ fontSize: 12, background: 'var(--green-100)', color: 'var(--green-700)', borderRadius: 20, padding: '3px 10px', fontWeight: 600 }}>
                    👁 {p.name}
                  </span>
                ))}
                <select value={linkedTask || ''} onChange={e => linkTask(e.target.value)}
                  style={{ height: 32, padding: '0 10px', border: '1px solid var(--slate-200)', borderRadius: 7, fontSize: 13, fontFamily: 'var(--font-sans)', background: 'white', cursor: 'pointer', maxWidth: 180, color: linkedTask ? 'var(--blue-700)' : 'var(--text-muted)' }}>
                  <option value="">🔗 Link to task</option>
                  {tasks.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                </select>
                <button onClick={() => setShowVersions(v => !v)}
                  style={{ height: 32, padding: '0 12px', border: `1px solid ${showVersions ? 'var(--blue-400)' : 'var(--slate-200)'}`, borderRadius: 7, background: showVersions ? 'var(--blue-50)' : 'white', cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-sans)', color: showVersions ? 'var(--blue-700)' : 'var(--text-body)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Icon name="history" size={14} /> History
                </button>
                <button onClick={() => save()}
                  style={{ height: 32, padding: '0 16px', background: 'var(--blue-600)', color: 'white', border: 'none', borderRadius: 7, cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-sans)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Icon name="save" size={14} /> Save
                </button>
              </div>

              {/* Editor */}
              <div style={{ flex: 1, overflowY: 'auto' }}>
                <div style={{ maxWidth: 760, margin: '0 auto', padding: '40px 40px 0' }}>
                  <textarea value={title} onChange={handleTitle} placeholder="Document title..."
                    rows={1} style={{ width: '100%', border: 'none', outline: 'none', fontSize: 37, fontWeight: 800, letterSpacing: '-0.025em', fontFamily: 'var(--font-sans)', resize: 'none', padding: 0, marginBottom: 6, lineHeight: 1.2, background: 'transparent', color: 'var(--text-heading)' }}
                    onInput={e => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }} />
                  <div style={{ display: 'flex', gap: 14, fontSize: 13, color: 'var(--text-muted)', marginBottom: 32, flexWrap: 'wrap' }}>
                    {project && <span>📁 {project.name}</span>}
                    {linkedTask && <span>🔗 {tasks.find(t => t.id === linkedTask)?.title}</span>}
                    <span>Edited {new Date(doc.updated_at || doc.created_at).toLocaleDateString()}</span>
                  </div>
                  <BlockEditor blocks={blocks} onChange={handleBlocks} />
                </div>
              </div>
            </div>
            {showVersions && <VersionHistory docId={doc.id} onRestore={content => { setBlocks(content); setShowVersions(false); save(content); }} onClose={() => setShowVersions(false)} />}
          </div>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, color: 'var(--text-muted)' }}>
            <Icon name="file-text" size={52} style={{ color: 'var(--slate-200)' }} />
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-heading)', margin: '0 0 6px' }}>No document open</p>
              <p style={{ fontSize: 14, margin: 0 }}>Select a project, then create or open a document</p>
            </div>
            {project && (
              <button onClick={newDoc} style={{ padding: '10px 22px', background: 'var(--blue-600)', color: 'white', border: 'none', borderRadius: 9, cursor: 'pointer', fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-sans)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon name="plus" size={16} /> New Document
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { Docs });
})();
