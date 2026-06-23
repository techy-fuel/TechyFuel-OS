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

const FALLBACK = [
  { id: 'f1', name: 'Nova Launch Campaign',   clients: { name: 'Nova Tech' },    status: 'active',    priority: 'high',   due_date: '2025-07-15', budget: 8000,  spent: 5200, progress: 65 },
  { id: 'f2', name: 'Bloom Social Relaunch',  clients: { name: 'Bloom Foods' },  status: 'active',    priority: 'medium', due_date: '2025-07-30', budget: 3500,  spent: 1200, progress: 34 },
  { id: 'f3', name: 'Apex Lead Gen Ads',      clients: { name: 'Apex Realty' },  status: 'active',    priority: 'high',   due_date: '2025-06-28', budget: 5000,  spent: 4100, progress: 82 },
  { id: 'f4', name: 'Spark Content Strategy', clients: { name: 'Spark Academy' },status: 'paused',    priority: 'low',    due_date: '2025-08-10', budget: 2000,  spent: 400,  progress: 20 },
  { id: 'f5', name: 'Nova Website Revamp',    clients: { name: 'Nova Tech' },    status: 'active',    priority: 'medium', due_date: '2025-08-01', budget: 6000,  spent: 1000, progress: 17 },
];

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

function ProjectCard({ p }) {
  const [st, sl] = PS[p.status] || ['neutral', p.status];
  const pct = p.progress || 0;
  const budgetPct = spentPct(p.budget, p.spent);
  const clientName = p.clients ? p.clients.name : '—';
  const due = fmtDue(p.due_date);
  return (
    <Card interactive padding="md" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <div>
          <div style={{ fontSize: 'var(--text-md)', fontWeight: 'var(--fw-bold)', color: 'var(--text-strong)', letterSpacing: '-0.01em' }}>{p.name}</div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 2 }}>{clientName}</div>
        </div>
        <Icon name="more-horizontal" size={18} style={{ color: 'var(--text-subtle)', cursor: 'pointer', flex: 'none' }} />
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
  const [projects, setProjects] = React.useState(FALLBACK);
  const [activeCount, setActiveCount] = React.useState(FALLBACK.filter(p => p.status === 'active').length);
  const [totalBudget, setTotalBudget] = React.useState(FALLBACK.reduce((s, p) => s + (p.budget || 0), 0));
  const [clients, setClients] = React.useState([]);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState({ name: '', client_id: '', budget: '', due_date: '', priority: 'medium', status: 'active' });

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  React.useEffect(() => {
    if (!window.API) return;
    window.API.getProjects().then(r => {
      if (r.data && r.data.length > 0) {
        setProjects(r.data);
        setActiveCount(r.data.filter(p => p.status === 'active').length);
        setTotalBudget(r.data.reduce((s, p) => s + (p.budget || 0), 0));
      }
    }).catch(() => {});
    window.API.getClients().then(r => { if (r.data) setClients(r.data); }).catch(() => {});
  }, []);

  function fmtTotal(n) {
    if (n >= 1000) return '$' + (n / 1000).toFixed(1) + 'K';
    return '$' + n;
  }

  async function handleAddProject() {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      const payload = { name: form.name, status: form.status, priority: form.priority };
      if (form.client_id) payload.client_id = form.client_id;
      if (form.budget)    payload.budget    = Number(form.budget);
      if (form.due_date)  payload.due_date  = form.due_date;
      if (window.API) {
        const { data, error } = await window.API.createProject(payload);
        if (!error && data) {
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {projects.map((p, i) => <ProjectCard key={p.id || i} p={p} />)}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New project" onSubmit={handleAddProject} loading={saving} submitLabel="Create project">
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
    </div>
  );
}
Object.assign(window, { Projects });
})();
