// Global "Quick Add" — press Ctrl/Cmd+J or the sidebar "+" button from any
// screen to create a Task, Client, Project or Invoice without navigating
// away from whatever you're doing. Kept intentionally minimal (only the
// fields each table actually requires) — full editing still happens on the
// dedicated screens.
(() => {

const TYPES = [
  { id: 'task',    label: 'Task',    icon: 'circle-check-big' },
  { id: 'client',  label: 'Client',  icon: 'contact' },
  { id: 'project', label: 'Project', icon: 'folder-kanban' },
  { id: 'invoice', label: 'Invoice', icon: 'wallet' },
];

const EMPTY = {
  task:    { title: '', client_id: '', project_id: '', assigned_to: '', due_date: '', priority: 'medium' },
  client:  { name: '', company: '', email: '', phone: '' },
  project: { name: '', client_id: '', due_date: '', priority: 'medium' },
  invoice: { client_id: '', amount: '', currency: 'PKR', due_date: '' },
};

function QuickAddModal({ open, onClose, onNavigate }) {
  const [type, setType] = React.useState('task');
  const [form, setForm] = React.useState(EMPTY.task);
  const [clients, setClients] = React.useState([]);
  const [projects, setProjects] = React.useState([]);
  const [team, setTeam] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    if (!open || !window.API) return;
    setError('');
    (async () => {
      try {
        const [c, p, t] = await Promise.all([
          window.API.getClients(), window.API.getProjects(), window.API.getTeam(),
        ]);
        setClients(c.data || []); setProjects(p.data || []); setTeam(t.data || []);
      } catch {}
    })();
  }, [open]);

  React.useEffect(() => { setForm(EMPTY[type]); setError(''); }, [type]);

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  async function handleSubmit() {
    if (!window.API) return;
    setError('');
    if (type === 'task' && !form.title.trim())        return setError('Title is required.');
    if (type === 'client' && !form.name.trim())        return setError('Name is required.');
    if (type === 'project' && !form.name.trim())       return setError('Name is required.');
    if (type === 'invoice' && (!form.client_id || !form.amount)) return setError('Client and amount are required.');

    setLoading(true);
    try {
      if (type === 'task') {
        await window.API.createTask({
          title: form.title.trim(),
          client_id: form.client_id || null,
          project_id: form.project_id || null,
          assigned_to: form.assigned_to || null,
          due_date: form.due_date || null,
          priority: form.priority,
          created_by: window.TFMyMemberId || null,
        });
      } else if (type === 'client') {
        await window.API.createClient({
          name: form.name.trim(), company: form.company || null, email: form.email || null, phone: form.phone || null,
        });
      } else if (type === 'project') {
        await window.API.createProject({
          name: form.name.trim(), client_id: form.client_id || null, due_date: form.due_date || null,
          priority: form.priority, created_by: window.TFMyMemberId || null,
        });
      } else if (type === 'invoice') {
        await window.API.createInvoice({
          client_id: form.client_id, amount: Number(form.amount), currency: form.currency, due_date: form.due_date || null, status: 'draft',
        });
      }
      onClose();
      if (onNavigate) onNavigate(type === 'task' ? 'tasks' : type === 'client' ? 'crm' : type === 'project' ? 'projects' : 'finance');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Quick add" onSubmit={handleSubmit} loading={loading} submitLabel="Create">
      <div style={{ display: 'flex', gap: 6, marginBottom: 18 }}>
        {TYPES.map(t => (
          <button key={t.id} onClick={() => setType(t.id)} style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, padding: '10px 6px',
            border: `1px solid ${type === t.id ? 'var(--blue-500)' : 'var(--border-default)'}`,
            background: type === t.id ? 'var(--blue-50)' : 'var(--slate-0)', borderRadius: 'var(--radius-md)', cursor: 'pointer',
          }}>
            <Icon name={t.icon} size={17} style={{ color: type === t.id ? 'var(--blue-600)' : 'var(--text-muted)' }} />
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-semibold)', color: type === t.id ? 'var(--blue-700)' : 'var(--text-body)' }}>{t.label}</span>
          </button>
        ))}
      </div>

      {error && (
        <div style={{ marginBottom: 14, padding: '8px 12px', borderRadius: 'var(--radius-md)', background: '#fff1f2', border: '1px solid #fecdd3', color: '#be123c', fontSize: 'var(--text-sm)' }}>
          {error}
        </div>
      )}

      {type === 'task' && (
        <>
          <FormRow label="Title" required><input style={FF.input} value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Follow up with client" autoFocus /></FormRow>
          <div style={FF.row2}>
            <FormRow label="Client"><select style={FF.select} value={form.client_id} onChange={e => set('client_id', e.target.value)}><option value="">None</option>{clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></FormRow>
            <FormRow label="Project"><select style={FF.select} value={form.project_id} onChange={e => set('project_id', e.target.value)}><option value="">None</option>{projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></FormRow>
          </div>
          <div style={FF.row2}>
            <FormRow label="Assigned to"><select style={FF.select} value={form.assigned_to} onChange={e => set('assigned_to', e.target.value)}><option value="">Unassigned</option>{team.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}</select></FormRow>
            <FormRow label="Due date"><input type="date" style={FF.input} value={form.due_date} onChange={e => set('due_date', e.target.value)} /></FormRow>
          </div>
          <FormRow label="Priority">
            <select style={FF.select} value={form.priority} onChange={e => set('priority', e.target.value)}>
              <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="urgent">Urgent</option>
            </select>
          </FormRow>
        </>
      )}

      {type === 'client' && (
        <>
          <FormRow label="Name" required><input style={FF.input} value={form.name} onChange={e => set('name', e.target.value)} placeholder="Client or company name" autoFocus /></FormRow>
          <div style={FF.row2}>
            <FormRow label="Company"><input style={FF.input} value={form.company} onChange={e => set('company', e.target.value)} /></FormRow>
            <FormRow label="Phone"><input style={FF.input} value={form.phone} onChange={e => set('phone', e.target.value)} /></FormRow>
          </div>
          <FormRow label="Email"><input type="email" style={FF.input} value={form.email} onChange={e => set('email', e.target.value)} /></FormRow>
        </>
      )}

      {type === 'project' && (
        <>
          <FormRow label="Name" required><input style={FF.input} value={form.name} onChange={e => set('name', e.target.value)} placeholder="Project name" autoFocus /></FormRow>
          <div style={FF.row2}>
            <FormRow label="Client"><select style={FF.select} value={form.client_id} onChange={e => set('client_id', e.target.value)}><option value="">None</option>{clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></FormRow>
            <FormRow label="Due date"><input type="date" style={FF.input} value={form.due_date} onChange={e => set('due_date', e.target.value)} /></FormRow>
          </div>
          <FormRow label="Priority">
            <select style={FF.select} value={form.priority} onChange={e => set('priority', e.target.value)}>
              <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
            </select>
          </FormRow>
        </>
      )}

      {type === 'invoice' && (
        <>
          <FormRow label="Client" required>
            <select style={FF.select} value={form.client_id} onChange={e => set('client_id', e.target.value)} autoFocus>
              <option value="">Select a client…</option>{clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </FormRow>
          <div style={FF.row2}>
            <FormRow label="Amount" required><input type="number" min="0" step="0.01" style={FF.input} value={form.amount} onChange={e => set('amount', e.target.value)} placeholder="0.00" /></FormRow>
            <FormRow label="Currency">
              <select style={FF.select} value={form.currency} onChange={e => set('currency', e.target.value)}>
                <option value="PKR">PKR</option><option value="USD">USD</option><option value="EUR">EUR</option><option value="GBP">GBP</option>
              </select>
            </FormRow>
          </div>
          <FormRow label="Due date"><input type="date" style={FF.input} value={form.due_date} onChange={e => set('due_date', e.target.value)} /></FormRow>
        </>
      )}
    </Modal>
  );
}

Object.assign(window, { QuickAddModal });
})();
