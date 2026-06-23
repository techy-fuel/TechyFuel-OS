// Tasks — Kanban board screen.
(() => {
const { Card, Badge, Avatar, AvatarGroup, Tabs } = window.TechyFuelOSDesignSystem_be0222;

const TF_PRIORITY = {
  urgent: { color: 'var(--red-600)',   bg: 'var(--red-50)',   label: 'Urgent', icon: 'chevrons-up' },
  high:   { color: 'var(--amber-600)', bg: 'var(--amber-50)', label: 'High',   icon: 'chevron-up' },
  medium: { color: 'var(--blue-600)',  bg: 'var(--blue-50)',  label: 'Medium', icon: 'equal' },
  low:    { color: 'var(--slate-500)', bg: 'var(--slate-100)',label: 'Low',    icon: 'chevron-down' },
};

const COLUMN_CONFIG = [
  { id: 'backlog',     label: 'Backlog',     dot: 'var(--slate-400)',  dbStatus: null },
  { id: 'todo',        label: 'To do',       dot: 'var(--blue-500)',   dbStatus: 'todo' },
  { id: 'in_progress', label: 'In progress', dot: 'var(--violet-500)', dbStatus: 'in_progress' },
  { id: 'review',      label: 'Review',      dot: 'var(--amber-500)',  dbStatus: 'review' },
  { id: 'done',        label: 'Completed',   dot: 'var(--green-500)',  dbStatus: 'done' },
];

const FALLBACK_TASKS = {
  backlog:     [],
  todo:        [
    { id: 'f1', title: 'Write 30 captions',       priority: 'medium', status: 'todo',        assigned_to_name: 'Zara Ahmed',  due_date: '2025-07-01', project_name: 'Bloom Social Relaunch' },
    { id: 'f2', title: 'Set up CMS',              priority: 'low',    status: 'todo',        assigned_to_name: 'Omar Sheikh', due_date: '2025-07-10', project_name: 'Nova Website Revamp' },
  ],
  in_progress: [
    { id: 'f3', title: 'Finalise ad creatives',   priority: 'high',   status: 'in_progress', assigned_to_name: 'Zara Ahmed',  due_date: '2025-06-25', project_name: 'Nova Launch Campaign' },
    { id: 'f4', title: 'Wireframes for homepage', priority: 'medium', status: 'in_progress', assigned_to_name: 'Ali Raza',    due_date: '2025-06-30', project_name: 'Nova Website Revamp' },
  ],
  review:      [
    { id: 'f5', title: 'Client approval round 2', priority: 'high',   status: 'review',      assigned_to_name: 'Ali Raza',    due_date: '2025-06-24', project_name: 'Nova Launch Campaign' },
  ],
  done:        [
    { id: 'f6', title: 'Launch Meta campaign',    priority: 'high',   status: 'done',        assigned_to_name: 'Omar Sheikh', due_date: '2025-06-20', project_name: 'Apex Lead Gen Ads', done: true },
  ],
};

const FALLBACK_FLAT = Object.values(FALLBACK_TASKS).flat();

function fmtDue(ds) {
  if (!ds) return '—';
  const d = new Date(ds); const t = new Date(); t.setHours(0,0,0,0);
  const diff = Math.round((d - t) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  return d.toLocaleDateString('en', { month: 'short', day: 'numeric' });
}

function fmtDateFull(ds) {
  if (!ds) return '—';
  return new Date(ds).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' });
}

function TaskCard({ task, onEdit }) {
  const [hover, setHover] = React.useState(false);
  const p = TF_PRIORITY[task.priority] || TF_PRIORITY.medium;
  const dueStr = fmtDue(task.due_date);
  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'done';
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      onClick={() => onEdit && onEdit(task)}
      style={{ background: 'var(--slate-0)', border: `1px solid ${hover ? 'var(--slate-200)' : 'var(--border-subtle)'}`,
        borderRadius: 'var(--radius-lg)', padding: 12, boxShadow: hover ? 'var(--shadow-md)' : 'var(--shadow-xs)',
        cursor: 'pointer', transform: hover ? 'translateY(-1px)' : 'none', transition: 'all var(--dur-fast) var(--ease-out)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        {task.project_name && <Badge tone="neutral" size="sm">{task.project_name}</Badge>}
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, fontSize: 'var(--text-2xs)', fontWeight: 'var(--fw-bold)', color: p.color, background: p.bg, borderRadius: 'var(--radius-full)', padding: '2px 7px' }}>
          <Icon name={p.icon} size={12} /> {p.label}
        </span>
        {hover && <span style={{ marginLeft: 'auto', color: 'var(--text-subtle)' }}><Icon name="pencil" size={12} /></span>}
      </div>
      <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)', lineHeight: 1.4, marginBottom: 10, textDecoration: task.done ? 'line-through' : 'none', opacity: task.done ? 0.6 : 1 }}>{task.title}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: isOverdue ? 'var(--red-600)' : 'var(--text-muted)', fontWeight: isOverdue ? 'var(--fw-bold)' : 'var(--fw-medium)' }}>
          <Icon name="calendar" size={13} /> {dueStr}
        </span>
        <div style={{ marginLeft: 'auto' }}>
          <Avatar name={task.assigned_to_name || '?'} size="xs" />
        </div>
      </div>
    </div>
  );
}

function StatusDot({ status }) {
  const cfg = COLUMN_CONFIG.find(c => c.id === status) || COLUMN_CONFIG[1];
  return <span style={{ width: 8, height: 8, borderRadius: '50%', background: cfg.dot, display: 'inline-block', flexShrink: 0 }} />;
}

function TaskListView({ allTasks, onAdd, onEdit }) {
  const thStyle = { textAlign: 'left', padding: '10px 12px', fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-bold)', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-subtle)', whiteSpace: 'nowrap' };
  const tdStyle = { padding: '10px 12px', fontSize: 'var(--text-sm)', borderBottom: '1px solid var(--border-subtle)', verticalAlign: 'middle' };

  if (!allTasks.length) return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
      <Icon name="check-square" size={40} style={{ color: 'var(--text-subtle)' }} />
      <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>No tasks yet</p>
      <button onClick={onAdd} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 34, padding: '0 14px', background: 'var(--blue-600)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', cursor: 'pointer' }}>
        <Icon name="plus" size={15} /> Add task
      </button>
    </div>
  );

  return (
    <div className="tf-scroll" style={{ flex: 1, overflowY: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--slate-0)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-xs)', border: '1px solid var(--border-subtle)' }}>
        <thead>
          <tr style={{ background: 'var(--slate-50)' }}>
            <th style={thStyle}>Title</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Priority</th>
            <th style={thStyle}>Assignee</th>
            <th style={thStyle}>Due date</th>
            <th style={thStyle}>Project</th>
          </tr>
        </thead>
        <tbody>
          {allTasks.map((t, i) => {
            const p = TF_PRIORITY[t.priority] || TF_PRIORITY.medium;
            const cfg = COLUMN_CONFIG.find(c => c.id === t.status) || COLUMN_CONFIG[1];
            const isOverdue = t.due_date && new Date(t.due_date) < new Date() && t.status !== 'done';
            return (
              <tr key={t.id || i} onClick={() => onEdit && onEdit(t)}
                style={{ cursor: 'pointer', transition: 'background var(--dur-fast)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--blue-50)'}
                onMouseLeave={e => e.currentTarget.style.background = ''}>
                <td style={{ ...tdStyle, fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)', maxWidth: 280 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 14, height: 14, borderRadius: 3, border: `2px solid ${t.done ? 'var(--green-400)' : 'var(--border-strong)'}`, background: t.done ? 'var(--green-400)' : 'transparent', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {t.done && <Icon name="check" size={9} style={{ color: '#fff' }} />}
                    </span>
                    <span style={{ textDecoration: t.done ? 'line-through' : 'none', opacity: t.done ? 0.55 : 1 }}>{t.title}</span>
                  </div>
                </td>
                <td style={tdStyle}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-body)' }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: cfg.dot }} />
                    {cfg.label}
                  </span>
                </td>
                <td style={tdStyle}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-bold)', color: p.color, background: p.bg, borderRadius: 'var(--radius-full)', padding: '2px 8px' }}>
                    <Icon name={p.icon} size={11} /> {p.label}
                  </span>
                </td>
                <td style={tdStyle}>
                  {t.assigned_to_name
                    ? <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <Avatar name={t.assigned_to_name} size="xs" />
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-body)' }}>{t.assigned_to_name}</span>
                      </div>
                    : <span style={{ color: 'var(--text-subtle)', fontSize: 'var(--text-xs)' }}>—</span>
                  }
                </td>
                <td style={{ ...tdStyle, color: isOverdue ? 'var(--red-600)' : 'var(--text-muted)', fontWeight: isOverdue ? 'var(--fw-bold)' : undefined, fontSize: 'var(--text-xs)' }}>
                  {fmtDateFull(t.due_date)}
                </td>
                <td style={tdStyle}>
                  {t.project_name
                    ? <Badge tone="neutral" size="sm">{t.project_name}</Badge>
                    : <span style={{ color: 'var(--text-subtle)', fontSize: 'var(--text-xs)' }}>—</span>
                  }
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function TaskCalView({ allTasks, onAdd, onEdit }) {
  const today = new Date();
  const [year,  setYear]  = React.useState(today.getFullYear());
  const [month, setMonth] = React.useState(today.getMonth());

  const monthName = new Date(year, month, 1).toLocaleDateString('en', { month: 'long', year: 'numeric' });

  // Build days grid (Mon-Sun, 6 rows max)
  const firstDay = new Date(year, month, 1);
  const lastDay  = new Date(year, month + 1, 0);
  let startOffset = firstDay.getDay() - 1; // Mon=0
  if (startOffset < 0) startOffset = 6;
  const days = [];
  for (let i = 0; i < startOffset; i++) days.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++) days.push(d);
  while (days.length % 7 !== 0) days.push(null);

  // Group tasks by date string
  const tasksByDate = {};
  allTasks.forEach(t => {
    if (!t.due_date) return;
    const key = t.due_date.slice(0, 10);
    if (!tasksByDate[key]) tasksByDate[key] = [];
    tasksByDate[key].push(t);
  });

  function prev() { if (month === 0) { setYear(y => y - 1); setMonth(11); } else setMonth(m => m - 1); }
  function next() { if (month === 11) { setYear(y => y + 1); setMonth(0); } else setMonth(m => m + 1); }
  function goToday() { setYear(today.getFullYear()); setMonth(today.getMonth()); }

  const DOW = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      {/* Nav */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <button onClick={prev} style={{ width: 30, height: 30, border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', background: 'var(--slate-0)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="chevron-left" size={16} style={{ color: 'var(--text-muted)' }} />
        </button>
        <span style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--fw-bold)', color: 'var(--text-strong)', minWidth: 160, textAlign: 'center' }}>{monthName}</span>
        <button onClick={next} style={{ width: 30, height: 30, border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', background: 'var(--slate-0)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="chevron-right" size={16} style={{ color: 'var(--text-muted)' }} />
        </button>
        <button onClick={goToday} style={{ height: 30, padding: '0 12px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', background: 'var(--slate-0)', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-muted)' }}>Today</button>
        <button onClick={onAdd} style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 6, height: 30, padding: '0 12px', background: 'var(--blue-600)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-semibold)', cursor: 'pointer' }}>
          <Icon name="plus" size={13} /> Add task
        </button>
      </div>

      {/* Grid */}
      <div className="tf-scroll" style={{ flex: 1, overflowY: 'auto' }}>
        {/* DOW headers */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1, marginBottom: 1 }}>
          {DOW.map(d => (
            <div key={d} style={{ padding: '6px 8px', textAlign: 'center', fontSize: 'var(--text-2xs)', fontWeight: 'var(--fw-bold)', color: 'var(--text-muted)', background: 'var(--slate-50)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{d}</div>
          ))}
        </div>
        {/* Day cells */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1 }}>
          {days.map((day, i) => {
            if (!day) return <div key={`e-${i}`} style={{ background: 'var(--slate-50)', minHeight: 96 }} />;
            const dateStr = `${year}-${String(month + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
            const dayTasks = tasksByDate[dateStr] || [];
            const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
            return (
              <div key={dateStr} style={{ background: 'var(--slate-0)', minHeight: 96, padding: 6, border: isToday ? '2px solid var(--blue-400)' : '1px solid var(--border-subtle)', borderRadius: 4, boxSizing: 'border-box' }}>
                <div style={{ fontSize: 'var(--text-xs)', fontWeight: isToday ? 'var(--fw-extrabold)' : 'var(--fw-semibold)', color: isToday ? 'var(--blue-600)' : 'var(--text-muted)', marginBottom: 4, width: 22, height: 22, borderRadius: '50%', background: isToday ? 'var(--blue-100)' : 'transparent', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                  {day}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {dayTasks.slice(0, 3).map((t, ti) => {
                    const p = TF_PRIORITY[t.priority] || TF_PRIORITY.medium;
                    return (
                      <div key={t.id || ti} title={t.title} onClick={e => { e.stopPropagation(); onEdit && onEdit(t); }}
                        style={{ fontSize: 11, fontWeight: 'var(--fw-semibold)', color: p.color, background: p.bg, borderRadius: 3, padding: '2px 5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', cursor: 'pointer' }}>
                        {t.title}
                      </div>
                    );
                  })}
                  {dayTasks.length > 3 && (
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 'var(--fw-semibold)', padding: '1px 5px' }}>+{dayTasks.length - 3} more</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function TasksBoard() {
  const [activeTab, setActiveTab] = React.useState('kanban');
  const [taskMap, setTaskMap]     = React.useState(FALLBACK_TASKS);
  const [allTasks, setAllTasks]   = React.useState(FALLBACK_FLAT);
  const [totalOpen, setTotalOpen] = React.useState(5);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [saving, setSaving]       = React.useState(false);
  const [team, setTeam]           = React.useState([]);
  const [projects, setProjects]   = React.useState([]);
  const [form, setForm] = React.useState({ title: '', priority: 'medium', status: 'todo', due_date: '', assigned_to: '', project_id: '' });

  // Edit task state
  const [editTask, setEditTask]   = React.useState(null);
  const [editForm, setEditForm]   = React.useState({});
  const [editSaving, setEditSaving] = React.useState(false);

  function openEdit(task) {
    setEditTask(task);
    setEditForm({ title: task.title, priority: task.priority || 'medium', status: task.status || 'todo', due_date: task.due_date || '', assigned_to: task.assigned_to || '' });
  }
  function setEF(k, v) { setEditForm(f => ({ ...f, [k]: v })); }

  async function handleUpdateTask() {
    if (!editTask || !editForm.title?.trim()) return;
    setEditSaving(true);
    try {
      const changes = { title: editForm.title, priority: editForm.priority, status: editForm.status, due_date: editForm.due_date || null, assigned_to: editForm.assigned_to || null };
      if (window.API && editTask.id && !editTask.id.startsWith('f')) {
        const { error } = await window.API.updateTask(editTask.id, changes);
        if (error) { setEditSaving(false); return; }
      }
      // Update local state
      const assigneeName = team.find(m => m.id === changes.assigned_to)?.name || editTask.assigned_to_name || null;
      const updated = { ...editTask, ...changes, done: changes.status === 'done', assigned_to_name: assigneeName };
      setAllTasks(prev => prev.map(t => t.id === editTask.id ? updated : t));
      setTaskMap(prev => {
        const next = {};
        COLUMN_CONFIG.forEach(c => { next[c.id] = (prev[c.id] || []).filter(t => t.id !== editTask.id); });
        const col = updated.status || 'todo';
        next[col] = [...(next[col] || []), updated];
        return next;
      });
      const openCount = t => t.status !== 'done';
      setTotalOpen(prev => {
        const wasOpen = openCount(editTask);
        const isOpen  = openCount(updated);
        if (wasOpen && !isOpen) return prev - 1;
        if (!wasOpen && isOpen) return prev + 1;
        return prev;
      });
      setEditTask(null);
    } finally { setEditSaving(false); }
  }

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  React.useEffect(() => {
    if (!window.API) return;
    window.API.getTasks().then(r => {
      if (!r.data) return;
      const map  = { backlog: [], todo: [], in_progress: [], review: [], done: [] };
      const flat = [];
      r.data.forEach(t => {
        const key = t.status || 'todo';
        if (!map[key]) map[key] = [];
        const task = { id: t.id, title: t.title, priority: t.priority, due_date: t.due_date,
          status: t.status || 'todo', done: t.status === 'done',
          assigned_to_name: t.team_members ? t.team_members.name : null,
          project_name: t.projects ? t.projects.name : null };
        map[key].push(task);
        flat.push(task);
      });
      setTaskMap(map);
      setAllTasks(flat);
      setTotalOpen(map.todo.length + map.in_progress.length + map.review.length + map.backlog.length);
    }).catch(() => {});
    window.API.getTeam().then(r => { if (r.data) setTeam(r.data); }).catch(() => {});
    window.API.getProjects().then(r => { if (r.data) setProjects(r.data); }).catch(() => {});
  }, []);

  async function handleAddTask() {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      const payload = { title: form.title, priority: form.priority, status: form.status };
      if (form.due_date)    payload.due_date    = form.due_date;
      if (form.assigned_to) payload.assigned_to = form.assigned_to;
      if (form.project_id)  payload.project_id  = form.project_id;

      if (window.API) {
        const { data, error } = await window.API.createTask(payload);
        if (!error && data) {
          const assigneeName = team.find(m => m.id === form.assigned_to)?.name || null;
          const projectName  = projects.find(p => p.id === form.project_id)?.name || null;
          const newTask = { id: data.id, title: data.title, priority: data.priority, due_date: data.due_date,
            status: data.status || 'todo', done: false, assigned_to_name: assigneeName, project_name: projectName };
          setTaskMap(prev => ({ ...prev, [newTask.status]: [...(prev[newTask.status] || []), newTask] }));
          setAllTasks(prev => [...prev, newTask]);
          if (newTask.status !== 'done') setTotalOpen(prev => prev + 1);
        }
      }
      setModalOpen(false);
      setForm({ title: '', priority: 'medium', status: 'todo', due_date: '', assigned_to: '', project_id: '' });
    } finally { setSaving(false); }
  }

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--fw-extrabold)', letterSpacing: '-0.02em' }}>Tasks</h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 2 }}>All projects · {totalOpen} open tasks</p>
        </div>
        <button onClick={() => setModalOpen(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, height: 36, padding: '0 14px', background: 'var(--blue-600)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-brand)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', cursor: 'pointer' }}>
          <Icon name="plus" size={16} /> Add task
        </button>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Tabs value={activeTab} onChange={setActiveTab} tabs={[
          { id: 'list',     label: 'List',     icon: <Icon name="list" size={16} /> },
          { id: 'kanban',   label: 'Board',    icon: <Icon name="columns-3" size={16} />, count: totalOpen },
          { id: 'calendar', label: 'Calendar', icon: <Icon name="calendar" size={16} /> },
        ]} />
      </div>

      {activeTab === 'kanban' && (
        <div className="tf-scroll" style={{ flex: 1, display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 8, alignItems: 'flex-start' }}>
          {COLUMN_CONFIG.map(col => {
            const colTasks = taskMap[col.id] || [];
            return (
              <div key={col.id} style={{ width: 268, flex: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '2px 4px' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: col.dot }} />
                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-bold)', color: 'var(--text-strong)' }}>{col.label}</span>
                  <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-bold)', color: 'var(--text-muted)', background: 'var(--slate-150)', borderRadius: 'var(--radius-full)', padding: '0px 7px' }}>{colTasks.length}</span>
                  <Icon name="plus" size={15} onClick={() => { set('status', col.id === 'backlog' ? 'todo' : col.id); setModalOpen(true); }} style={{ color: 'var(--text-subtle)', marginLeft: 'auto', cursor: 'pointer' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, background: 'var(--slate-100)', borderRadius: 'var(--radius-xl)', padding: 10, minHeight: 120 }}>
                  {colTasks.map((t, i) => <TaskCard key={t.id || i} task={t} onEdit={openEdit} />)}
                  <button onClick={() => { set('status', col.id === 'backlog' ? 'todo' : col.id); setModalOpen(true); }}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '8px 0', background: 'transparent', border: '1px dashed var(--border-strong)', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-semibold)', cursor: 'pointer' }}>
                    <Icon name="plus" size={14} /> Add task
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'list' && (
        <TaskListView allTasks={allTasks} onAdd={() => setModalOpen(true)} onEdit={openEdit} />
      )}

      {activeTab === 'calendar' && (
        <TaskCalView allTasks={allTasks} onAdd={() => setModalOpen(true)} onEdit={openEdit} />
      )}

      <Modal open={!!editTask} onClose={() => setEditTask(null)} title="Edit task" onSubmit={handleUpdateTask} loading={editSaving} submitLabel="Save changes">
        <FormRow label="Title" required>
          <input style={FF.input} placeholder="Task title…" value={editForm.title || ''} onChange={e => setEF('title', e.target.value)} />
        </FormRow>
        <div style={FF.row2}>
          <FormRow label="Status">
            <select style={FF.select} value={editForm.status || 'todo'} onChange={e => setEF('status', e.target.value)}>
              <option value="backlog">Backlog</option>
              <option value="todo">To do</option>
              <option value="in_progress">In progress</option>
              <option value="review">Review</option>
              <option value="done">Done</option>
            </select>
          </FormRow>
          <FormRow label="Priority">
            <select style={FF.select} value={editForm.priority || 'medium'} onChange={e => setEF('priority', e.target.value)}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </FormRow>
        </div>
        <div style={FF.row2}>
          <FormRow label="Due date">
            <input style={FF.input} type="date" value={editForm.due_date || ''} onChange={e => setEF('due_date', e.target.value)} />
          </FormRow>
          <FormRow label="Assign to">
            <select style={FF.select} value={editForm.assigned_to || ''} onChange={e => setEF('assigned_to', e.target.value)}>
              <option value="">Unassigned</option>
              {team.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </FormRow>
        </div>
      </Modal>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add task" onSubmit={handleAddTask} loading={saving} submitLabel="Add task">
        <FormRow label="Title" required>
          <input style={FF.input} placeholder="Task title…" value={form.title} onChange={e => set('title', e.target.value)} />
        </FormRow>
        <div style={FF.row2}>
          <FormRow label="Priority">
            <select style={FF.select} value={form.priority} onChange={e => set('priority', e.target.value)}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </FormRow>
          <FormRow label="Status">
            <select style={FF.select} value={form.status} onChange={e => set('status', e.target.value)}>
              <option value="todo">To do</option>
              <option value="in_progress">In progress</option>
              <option value="review">Review</option>
              <option value="done">Done</option>
            </select>
          </FormRow>
        </div>
        <div style={FF.row2}>
          <FormRow label="Due date">
            <input style={FF.input} type="date" value={form.due_date} onChange={e => set('due_date', e.target.value)} />
          </FormRow>
          <FormRow label="Assign to">
            <select style={FF.select} value={form.assigned_to} onChange={e => set('assigned_to', e.target.value)}>
              <option value="">Unassigned</option>
              {team.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </FormRow>
        </div>
        <FormRow label="Project">
          <select style={FF.select} value={form.project_id} onChange={e => set('project_id', e.target.value)}>
            <option value="">No project</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </FormRow>
      </Modal>
    </div>
  );
}

Object.assign(window, { TasksBoard });
})();
