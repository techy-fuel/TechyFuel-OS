// Projects screen — project cards grid.
(() => {
const { Card, Badge, AvatarGroup, ProgressBar } = window.TechyFuelOSDesignSystem_be0222;

const PS = {
  active:    ['info',    'In progress'],
  paused:    ['neutral', 'Paused'],
  completed: ['success', 'Completed'],
  archived:  ['neutral', 'Archived'],
};
const PRIORITY_TONE = { high: 'danger', medium: 'warning', low: 'neutral' };

function fmtBudget(n) {
  if (!n) return '$0';
  if (n >= 1000) return '$' + (n / 1000).toFixed(1) + 'K';
  return '$' + n;
}
function fmtDue(ds) {
  if (!ds) return '—';
  return new Date(ds).toLocaleDateString('en', { month: 'short', day: 'numeric' });
}
function spentPct(budget, spent) {
  if (!budget || !spent) return 0;
  return Math.round((spent / budget) * 100);
}

function ProjectCard({ p, onEdit, onDelete }) {
  const [st, sl] = PS[p.status] || ['neutral', p.status];
  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuRef = React.useRef(null);
  const pct = p.progress || 0;
  const budgetPct = spentPct(p.budget, p.spent);
  const clientName = p.clients ? p.clients.name : '—';
  const due = fmtDue(p.due_date);

  React.useEffect(() => {
    if (!menuOpen) return;
    function onClickOutside(e) { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [menuOpen]);

  return (
    <Card interactive padding="md" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <div>
          <div style={{ fontSize: 'var(--text-md)', fontWeight: 'var(--fw-bold)', color: 'var(--text-strong)', letterSpacing: '-0.01em' }}>{p.name}</div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 2 }}>{clientName}</div>
        </div>
        <div ref={menuRef} style={{ position: 'relative', flex: 'none' }}>
          <button onClick={e => { e.stopPropagation(); setMenuOpen(o => !o); }} style={{ background: 'none', border: 'none', padding: 2, display: 'flex', cursor: 'pointer', color: 'var(--text-subtle)' }}>
            <Icon name="more-horizontal" size={18} />
          </button>
          {menuOpen && (
            <div onClick={e => e.stopPropagation()} style={{ position: 'absolute', top: 'calc(100% + 4px)', right: 0, zIndex: 50,
              background: 'var(--slate-0)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xl)', minWidth: 140, overflow: 'hidden' }}>
              <div onClick={() => { setMenuOpen(false); onEdit(p); }}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', cursor: 'pointer', fontSize: 'var(--text-sm)', color: 'var(--text-body)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--slate-50)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <Icon name="pencil" size={14} style={{ color: 'var(--text-muted)' }} /> Edit
              </div>
              <div onClick={() => { setMenuOpen(false); onDelete(p); }}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', cursor: 'pointer', fontSize: 'var(--text-sm)', color: '#dc2626', borderTop: '1px solid var(--border-subtle)' }}
                onMouseEnter={e => e.currentTarget.style.background = '#fff1f2'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <Icon name="trash-2" size={14} style={{ color: '#dc2626' }} /> Delete
              </div>
            </div>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        <Badge tone={PRIORITY_TONE[p.priority] || 'neutral'} size="sm">{p.priority}</Badge>
        <Badge tone={st} dot>{sl}</Badge>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)' }}>
          <span style={{ color: 'var(--text-muted)', fontWeight: 'var(--fw-semibold)' }}>Progress</span>
          <span style={{ color: 'var(--text-strong)', fontWeight: 'var(--fw-bold)' }}>{pct}%</span>
        </div>
        <ProgressBar value={pct} tone={p.status === 'completed' ? 'success' : 'brand'} size="sm" />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid var(--border-subtle)' }}>
        <div>
          <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wide)', fontWeight: 'var(--fw-bold)' }}>Budget · {budgetPct}% used</div>
          <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-bold)', color: 'var(--text-strong)', fontVariantNumeric: 'tabular-nums' }}>{fmtBudget(p.budget)}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}><Icon name="calendar" size={13} /> {due}</span>
        </div>
      </div>
    </Card>
  );
}

function Projects() {
  useLucide();
  const [projects, setProjects] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [activeCount, setActiveCount] = React.useState(0);
  const [totalBudget, setTotalBudget] = React.useState(0);
  const [clients, setClients] = React.useState([]);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState({ name: '', client_id: '', budget: '', due_date: '', priority: 'medium', status: 'active' });
  const [addProjectError, setAddProjectError] = React.useState('');

  const [editProject, setEditProject] = React.useState(null);
  const [editForm, setEditForm] = React.useState({});
  const [editSaving, setEditSaving] = React.useState(false);
  const [editProjectError, setEditProjectError] = React.useState('');

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }
  function setEF(k, v) { setEditForm(f => ({ ...f, [k]: v })); }

  function openEdit(p) {
    setEditProjectError('');
    setEditProject(p);
    setEditForm({
      name: p.name || '', client_id: p.client_id || '', budget: p.budget ? String(p.budget) : '',
      due_date: p.due_date ? p.due_date.slice(0, 10) : '', priority: p.priority || 'medium', status: p.status || 'active',
    });
  }

  async function handleUpdateProject() {
    if (!editProject || !editForm.name?.trim()) return;
    setEditSaving(true);
    setEditProjectError('');
    try {
      const changes = { name: editForm.name.trim(), priority: editForm.priority, status: editForm.status };
      changes.client_id = editForm.client_id || null;
      changes.budget    = editForm.budget ? Number(editForm.budget) : null;
      changes.due_date  = editForm.due_date || null;
      if (!window.API) { setEditProject(null); return; }
      const { data, error } = await window.API.updateProject(editProject.id, changes);
      if (error) { setEditProjectError(error.message || 'Could not save changes. Please try again.'); return; }
      const clientObj = clients.find(c => c.id === changes.client_id);
      const updated = { ...editProject, ...(data || changes), clients: clientObj ? { name: clientObj.company || clientObj.name } : null };
      setProjects(prev => prev.map(p => p.id === editProject.id ? updated : p));
      setActiveCount(prev => {
        const wasActive = editProject.status === 'active', isActive = updated.status === 'active';
        if (wasActive && !isActive) return prev - 1;
        if (!wasActive && isActive) return prev + 1;
        return prev;
      });
      setTotalBudget(prev => prev - (editProject.budget || 0) + (updated.budget || 0));
      setEditProject(null);
    } finally { setEditSaving(false); }
  }

  async function handleDeleteProject(p) {
    if (!window.confirm(`Delete "${p.name}"? This can't be undone.`)) return;
    try { if (window.API) await window.API.deleteProject(p.id); } catch {}
    setProjects(prev => prev.filter(x => x.id !== p.id));
    if (p.status === 'active') setActiveCount(prev => Math.max(0, prev - 1));
    setTotalBudget(prev => Math.max(0, prev - (p.budget || 0)));
  }

  React.useEffect(() => {
    if (!window.API) { setLoading(false); return; }
    window.API.getProjects().then(r => {
      const data = r.data || [];
      setProjects(data);
      setActiveCount(data.filter(p => p.status === 'active').length);
      setTotalBudget(data.reduce((s, p) => s + (p.budget || 0), 0));
    }).catch(() => {}).finally(() => setLoading(false));
    window.API.getClients().then(r => { if (r.data) setClients(r.data); }).catch(() => {});
  }, []);

  function fmtTotal(n) {
    if (n >= 1000) return '$' + (n / 1000).toFixed(1) + 'K';
    return '$' + n;
  }

  async function handleAddProject() {
    if (!form.name.trim()) return;
    setSaving(true);
    setAddProjectError('');
    try {
      const payload = { name: form.name, status: form.status, priority: form.priority };
      if (form.client_id) payload.client_id = form.client_id;
      if (form.budget)    payload.budget    = Number(form.budget);
      if (form.due_date)  payload.due_date  = form.due_date;
      if (window.API) {
        const { data, error } = await window.API.createProject(payload);
        if (error) { setAddProjectError(error.message || 'Could not create the project. Please try again.'); return; }
        if (data) {
          const clientName = clients.find(c => c.id === form.client_id)?.name || null;
          const newP = { ...data, clients: clientName ? { name: clientName } : null };
          setProjects(prev => [...prev, newP]);
          if (data.status === 'active') setActiveCount(prev => prev + 1);
          setTotalBudget(prev => prev + (data.budget || 0));
        }
      }
      setModalOpen(false);
      setForm({ name: '', client_id: '', budget: '', due_date: '', priority: 'medium', status: 'active' });
    } finally { setSaving(false); }
  }

  return (
    <div style={{ padding: 24, maxWidth: 1280, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--fw-extrabold)', letterSpacing: '-0.02em' }}>Projects</h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 2 }}>{activeCount} active · {fmtTotal(totalBudget)} in committed budget</p>
        </div>
        <button onClick={() => setModalOpen(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, height: 36, padding: '0 14px', background: 'var(--blue-600)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-brand)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', cursor: 'pointer' }}>
          <Icon name="plus" size={16} /> New project
        </button>
      </div>
      {loading && <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>Loading…</div>}

      {!loading && projects.length === 0 && (
        <div style={{ padding: '60px 24px', textAlign: 'center' }}>
          <Icon name="folder-kanban" size={40} style={{ color: 'var(--text-subtle)', marginBottom: 12 }} />
          <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--fw-bold)', color: 'var(--text-strong)', marginBottom: 6 }}>No projects yet</div>
          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>Create your first project to get started.</div>
        </div>
      )}

      {!loading && projects.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {projects.map((p, i) => <ProjectCard key={p.id || i} p={p} onEdit={openEdit} onDelete={handleDeleteProject} />)}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => { setModalOpen(false); setAddProjectError(''); }} title="New project" onSubmit={handleAddProject} loading={saving} submitLabel="Create project">
        {addProjectError && (
          <div style={{ marginBottom: 14, padding: '8px 12px', borderRadius: 'var(--radius-md)', background: '#fff1f2', border: '1px solid #fecdd3', color: '#be123c', fontSize: 'var(--text-sm)' }}>
            {addProjectError}
          </div>
        )}
        <FormRow label="Project name" required>
          <input style={FF.input} placeholder="Project name…" value={form.name} onChange={e => set('name', e.target.value)} />
        </FormRow>
        <FormRow label="Client">
          <select style={FF.select} value={form.client_id} onChange={e => set('client_id', e.target.value)}>
            <option value="">No client</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.company || c.name}</option>)}
          </select>
        </FormRow>
        <div style={FF.row2}>
          <FormRow label="Priority">
            <select style={FF.select} value={form.priority} onChange={e => set('priority', e.target.value)}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </FormRow>
          <FormRow label="Status">
            <select style={FF.select} value={form.status} onChange={e => set('status', e.target.value)}>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
            </select>
          </FormRow>
        </div>
        <div style={FF.row2}>
          <FormRow label="Budget ($)">
            <input style={FF.input} type="number" placeholder="0" value={form.budget} onChange={e => set('budget', e.target.value)} />
          </FormRow>
          <FormRow label="Due date">
            <input style={FF.input} type="date" value={form.due_date} onChange={e => set('due_date', e.target.value)} />
          </FormRow>
        </div>
      </Modal>

      <Modal open={!!editProject} onClose={() => setEditProject(null)} title="Edit project" onSubmit={handleUpdateProject} loading={editSaving} submitLabel="Save changes">
        {editProjectError && (
          <div style={{ marginBottom: 14, padding: '8px 12px', borderRadius: 'var(--radius-md)', background: '#fff1f2', border: '1px solid #fecdd3', color: '#be123c', fontSize: 'var(--text-sm)' }}>
            {editProjectError}
          </div>
        )}
        <FormRow label="Project name" required>
          <input style={FF.input} placeholder="Project name…" value={editForm.name || ''} onChange={e => setEF('name', e.target.value)} />
        </FormRow>
        <FormRow label="Client">
          <select style={FF.select} value={editForm.client_id || ''} onChange={e => setEF('client_id', e.target.value)}>
            <option value="">No client</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.company || c.name}</option>)}
          </select>
        </FormRow>
        <div style={FF.row2}>
          <FormRow label="Priority">
            <select style={FF.select} value={editForm.priority || 'medium'} onChange={e => setEF('priority', e.target.value)}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </FormRow>
          <FormRow label="Status">
            <select style={FF.select} value={editForm.status || 'active'} onChange={e => setEF('status', e.target.value)}>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </select>
          </FormRow>
        </div>
        <div style={FF.row2}>
          <FormRow label="Budget ($)">
            <input style={FF.input} type="number" placeholder="0" value={editForm.budget || ''} onChange={e => setEF('budget', e.target.value)} />
          </FormRow>
          <FormRow label="Due date">
            <input style={FF.input} type="date" value={editForm.due_date || ''} onChange={e => setEF('due_date', e.target.value)} />
          </FormRow>
        </div>
      </Modal>
    </div>
  );
}
Object.assign(window, { Projects });
})();
