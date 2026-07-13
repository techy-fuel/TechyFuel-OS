// Tasks — Kanban board screen.
(() => {
const { Card, Badge, Avatar, AvatarGroup, Tabs } = window.TechyFuelOSDesignSystem_be0222;

function addRecurrenceInterval(dateStr, interval) {
  const d = new Date((dateStr || new Date().toISOString().slice(0, 10)) + 'T00:00:00Z');
  if (interval === 'weekly') d.setUTCDate(d.getUTCDate() + 7);
  else if (interval === 'daily') d.setUTCDate(d.getUTCDate() + 1);
  else d.setUTCMonth(d.getUTCMonth() + 1); // 'monthly' default
  return d.toISOString().slice(0, 10);
}

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

const EMPTY_TASKS = { backlog: [], todo: [], in_progress: [], review: [], done: [] };

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

function TaskCard({ task, onEdit, onDragStart, onDragEnd, dragging, isTimerRunning, onApprove, onReject }) {
  const [hover, setHover] = React.useState(false);
  const p = TF_PRIORITY[task.priority] || TF_PRIORITY.medium;
  const dueStr = fmtDue(task.due_date);
  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'done';
  const canReview = task.approval_status === 'pending' && task.created_by === window.TFMyMemberId;
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      onClick={() => onEdit && onEdit(task)}
      draggable
      onDragStart={e => { e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', task.id); onDragStart && onDragStart(task); }}
      onDragEnd={() => onDragEnd && onDragEnd()}
      style={{ background: 'var(--slate-0)', border: `1px solid ${hover ? 'var(--slate-200)' : 'var(--border-subtle)'}`,
        borderRadius: 'var(--radius-lg)', padding: 12, boxShadow: hover ? 'var(--shadow-md)' : 'var(--shadow-xs)',
        cursor: dragging ? 'grabbing' : 'pointer', opacity: dragging ? 0.4 : 1,
        transform: hover && !dragging ? 'translateY(-1px)' : 'none', transition: 'all var(--dur-fast) var(--ease-out)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
        {task.project_name && <Badge tone="neutral" size="sm">{task.project_name}</Badge>}
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, fontSize: 'var(--text-2xs)', fontWeight: 'var(--fw-bold)', color: p.color, background: p.bg, borderRadius: 'var(--radius-full)', padding: '2px 7px' }}>
          <Icon name={p.icon} size={12} /> {p.label}
        </span>
        {task.client_id && <span title="Visible in client portal" style={{ display: 'inline-flex', alignItems: 'center', gap: 2, fontSize: 'var(--text-2xs)', fontWeight: 'var(--fw-bold)', color: 'var(--violet-600)', background: 'var(--violet-50)', borderRadius: 'var(--radius-full)', padding: '2px 7px' }}><Icon name="user" size={10} /> Client</span>}
        {task.is_recurring && <span title="Recurring task"><Icon name="repeat" size={12} style={{ color: 'var(--blue-500)' }} /></span>}
        {isTimerRunning && <span title="Timer running" style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 'var(--text-2xs)', fontWeight: 'var(--fw-bold)', color: 'var(--green-700)', background: 'var(--green-50)', borderRadius: 'var(--radius-full)', padding: '2px 7px' }}><Icon name="timer" size={11} /> Live</span>}
        {task.approval_status === 'pending' && <span title="Waiting for approval" style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 'var(--text-2xs)', fontWeight: 'var(--fw-bold)', color: 'var(--amber-700)', background: 'var(--amber-50)', borderRadius: 'var(--radius-full)', padding: '2px 7px' }}><Icon name="clock" size={11} /> Pending review</span>}
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
      {canReview && (
        <div style={{ display: 'flex', gap: 6, marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border-subtle)' }}>
          <button onClick={e => { e.stopPropagation(); onApprove && onApprove(task); }}
            style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 5, height: 28, background: 'var(--green-600)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-semibold)', cursor: 'pointer' }}>
            <Icon name="check" size={13} /> Approve
          </button>
          <button onClick={e => { e.stopPropagation(); onReject && onReject(task); }}
            style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 5, height: 28, background: 'transparent', color: 'var(--red-600)', border: '1px solid var(--red-200)', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-semibold)', cursor: 'pointer' }}>
            <Icon name="x" size={13} /> Send back
          </button>
        </div>
      )}
    </div>
  );
}

function StatusDot({ status }) {
  const cfg = COLUMN_CONFIG.find(c => c.id === status) || COLUMN_CONFIG[1];
  return <span style={{ width: 8, height: 8, borderRadius: '50%', background: cfg.dot, display: 'inline-block', flexShrink: 0 }} />;
}

function TaskListView({ allTasks, onAdd, onEdit, onToggle }) {
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
                    <span onClick={e => { e.stopPropagation(); onToggle && onToggle(t); }} title={t.done ? 'Mark as not done' : 'Mark as done'}
                      style={{ width: 14, height: 14, borderRadius: 3, border: `2px solid ${t.done ? 'var(--green-400)' : 'var(--border-strong)'}`, background: t.done ? 'var(--green-400)' : 'transparent', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer' }}>
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

function AttachArea({ files, onChange }) {
  const ref = React.useRef();
  function add(e) {
    const picked = Array.from(e.target.files || []);
    onChange(prev => [...prev, ...picked]);
    e.target.value = '';
  }
  function remove(name) { onChange(prev => prev.filter(f => f.name !== name)); }
  return (
    <div>
      <input ref={ref} type="file" multiple style={{ display: 'none' }} onChange={add} />
      <button type="button" onClick={() => ref.current.click()}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 32, padding: '0 12px', border: '1px dashed var(--border-strong)', borderRadius: 'var(--radius-md)', background: 'transparent', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-muted)', cursor: 'pointer' }}>
        <Icon name="paperclip" size={13} /> Attach files
      </button>
      {files.length > 0 && (
        <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {files.map(f => (
            <div key={f.name} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 10px', background: 'var(--slate-50)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
              <Icon name="file" size={13} style={{ color: 'var(--text-subtle)', flexShrink: 0 }} />
              <span style={{ flex: 1, fontSize: 'var(--text-xs)', color: 'var(--text-body)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</span>
              <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-subtle)', flexShrink: 0 }}>{f.size > 1048576 ? (f.size/1048576).toFixed(1)+' MB' : Math.round(f.size/1024)+' KB'}</span>
              <button type="button" onClick={() => remove(f.name)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-subtle)', padding: 0, display: 'inline-flex' }}>
                <Icon name="x" size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

async function uploadTaskFiles(taskId, files) {
  if (!window.API || !files.length) return;
  for (const file of files) {
    const filePath = `tasks/${taskId}/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
    try { await window.API.uploadFile('files', filePath, file); } catch(_) {}
    try {
      await window.API.createFile({
        name: file.name, file_path: filePath,
        mime_type: file.type || 'application/octet-stream',
        file_size: file.size, task_id: taskId,
      });
    } catch(_) {}
  }
}

function TasksBoard() {
  useLucide();
  const [activeTab, setActiveTab] = React.useState('kanban');
  const [taskMap, setTaskMap]     = React.useState(EMPTY_TASKS);
  const [allTasks, setAllTasks]   = React.useState([]);
  const [totalOpen, setTotalOpen] = React.useState(0);
  const [loading,   setLoading]   = React.useState(true);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [saving, setSaving]       = React.useState(false);
  const [addTaskError, setAddTaskError] = React.useState('');
  const [team, setTeam]           = React.useState([]);
  const [projects, setProjects]   = React.useState([]);
  const [clients,  setClients]    = React.useState([]);
  const [form, setForm] = React.useState({ title: '', priority: 'medium', status: 'todo', due_date: '', assigned_to: '', project_id: '', client_id: '', is_recurring: false, recurrence_interval: 'weekly' });
  const [attachments, setAttachments] = React.useState([]);

  // Edit task state
  const [editTask, setEditTask]       = React.useState(null);
  const [editForm, setEditForm]       = React.useState({});
  const [editSaving, setEditSaving]   = React.useState(false);
  const [editAttachments, setEditAttachments] = React.useState([]);
  const [reviewFeedback, setReviewFeedback] = React.useState(null); // latest approval_requests row, once resolved

  // Time tracking — the one entry (if any) currently running for me, and
  // this task's logged total, both refreshed whenever the edit modal opens.
  const [runningEntry, setRunningEntry] = React.useState(null);
  const [taskTotalSeconds, setTaskTotalSeconds] = React.useState(0);
  const [timerBusy, setTimerBusy] = React.useState(false);
  const [timerTick, setTimerTick] = React.useState(0);
  const [timerError, setTimerError] = React.useState('');

  React.useEffect(() => {
    if (!runningEntry) return;
    const t = setInterval(() => setTimerTick(n => n + 1), 1000);
    return () => clearInterval(t);
  }, [runningEntry]);

  // Kanban drag-and-drop
  const [draggedId, setDraggedId] = React.useState(null);
  const [dragOverCol, setDragOverCol] = React.useState(null);

  // Approve/Send back feedback prompt: { task, approved } while open, else null
  const [reviewPrompt, setReviewPrompt] = React.useState(null);
  const [reviewComment, setReviewComment] = React.useState('');
  const [reviewSaving, setReviewSaving] = React.useState(false);

  async function confirmReviewDecision() {
    if (!reviewPrompt) return;
    setReviewSaving(true);
    try {
      await resolveTaskApproval(reviewPrompt.task, reviewPrompt.approved, reviewComment.trim());
      setReviewPrompt(null);
      setReviewComment('');
    } finally { setReviewSaving(false); }
  }

  function openEdit(task) {
    setEditTask(task);
    setEditForm({ title: task.title, priority: task.priority || 'medium', status: task.status || 'todo', due_date: task.due_date || '', assigned_to: task.assigned_to || '', client_id: task.client_id || '' });
    setEditAttachments([]);
    setTimerError('');
    setReviewFeedback(null);
    refreshTimeTracking(task.id);
    if (task.approval_status === 'approved' || task.approval_status === 'rejected') {
      window.API?.getLatestApprovalForTask?.(task.id).then(({ data }) => { if (data) setReviewFeedback(data); }).catch(() => {});
    }
  }
  function setEF(k, v) { setEditForm(f => ({ ...f, [k]: v })); }

  async function refreshTimeTracking(taskId) {
    if (!window.API || !window.API.getTimeEntriesForTask) return;
    try {
      const [{ data: entries }, { data: running }] = await Promise.all([
        window.API.getTimeEntriesForTask(taskId),
        window.API.getRunningTimeEntry ? window.API.getRunningTimeEntry(window.TFMyMemberId) : Promise.resolve({ data: null }),
      ]);
      setTaskTotalSeconds((entries || []).reduce((s, e) => s + (e.duration_seconds || 0), 0));
      setRunningEntry(running || null);
    } catch {}
  }

  async function handleStartTimer(taskId) {
    if (timerBusy) return;
    if (!window.API || !window.TFMyMemberId) { setTimerError('Could not identify your account. Please refresh the page and try again.'); return; }
    setTimerBusy(true);
    setTimerError('');
    try {
      const { data, error } = await window.API.startTimeEntry(taskId, window.TFMyMemberId);
      if (error) { setTimerError(error.message || 'Could not start the timer. Please try again.'); return; }
      if (data) setRunningEntry(data);
    } finally { setTimerBusy(false); }
  }

  async function handleStopTimer() {
    if (!window.API || !runningEntry || timerBusy) return;
    setTimerBusy(true);
    setTimerError('');
    try {
      const { data, error } = await window.API.stopTimeEntry(runningEntry.id);
      if (error) { setTimerError(error.message || 'Could not stop the timer. Please try again.'); return; }
      setRunningEntry(null);
      if (data && editTask && data.task_id === editTask.id) {
        setTaskTotalSeconds(s => s + (data.duration_seconds || 0));
      }
    } finally { setTimerBusy(false); }
  }

  // Marking a task done while its timer is still running would otherwise
  // keep counting silently in the background with no way to stop it once
  // the task leaves the board's "in progress" view -- so completing a task
  // always stops its own timer first.
  async function stopTimerIfRunningOnTask(taskId) {
    if (!window.API || !runningEntry || runningEntry.task_id !== taskId) return;
    try {
      const { data } = await window.API.stopTimeEntry(runningEntry.id);
      setRunningEntry(null);
      if (data && editTask && data.task_id === editTask.id) {
        setTaskTotalSeconds(s => s + (data.duration_seconds || 0));
      }
    } catch {}
  }

  function fmtDuration(totalSeconds) {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    if (h === 0) return `${m}m`;
    return `${h}h ${m}m`;
  }

  // Second-level ticking clock (unlike fmtDuration, which rounds to minutes
  // and would look frozen at "0m" for the timer's entire first minute).
  function fmtClock(totalSeconds) {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    const pad = n => String(n).padStart(2, '0');
    return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
  }

  async function moveTask(task, newStatus) {
    if (!task || task.status === newStatus) return;
    const updated = { ...task, status: newStatus, done: newStatus === 'done' };
    setAllTasks(prev => prev.map(t => t.id === task.id ? updated : t));
    setTaskMap(prev => {
      const next = {};
      COLUMN_CONFIG.forEach(c => { next[c.id] = (prev[c.id] || []).filter(t => t.id !== task.id); });
      next[newStatus] = [...(next[newStatus] || []), updated];
      return next;
    });
    const wasOpen = task.status !== 'done', isOpen = newStatus !== 'done';
    if (wasOpen && !isOpen) setTotalOpen(prev => Math.max(0, prev - 1));
    if (!wasOpen && isOpen) setTotalOpen(prev => prev + 1);
    if (newStatus === 'done') await stopTimerIfRunningOnTask(task.id);
    if (window.API && task.id && !String(task.id).startsWith('f')) {
      try { await window.API.updateTask(task.id, { status: newStatus }); } catch {}
    }
    if (newStatus === 'review') await submitForReview(task);
  }

  function toggleTaskDone(task) {
    return moveTask(task, task.status === 'done' ? 'todo' : 'done');
  }

  function patchTaskLocal(taskId, changes) {
    setAllTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...changes } : t));
    setTaskMap(prev => {
      const next = {};
      COLUMN_CONFIG.forEach(c => { next[c.id] = (prev[c.id] || []).map(t => t.id === taskId ? { ...t, ...changes } : t); });
      return next;
    });
  }

  // Marks a task as awaiting sign-off from whoever created/assigned it —
  // this is the actual "submission" a team member does: moving a task to
  // Review creates a real approval_requests row + notifies the creator,
  // instead of the status change silently going nowhere.
  async function submitForReview(task) {
    if (!window.API || !task.created_by || task.created_by === window.TFMyMemberId) return;
    try {
      await window.API.createApproval({ task_id: task.id, requested_by: window.TFMyMemberId, approver_id: task.created_by, status: 'pending' });
      await window.API.updateTask(task.id, { requires_approval: true, approval_status: 'pending' });
      patchTaskLocal(task.id, { approval_status: 'pending' });
      const me = team.find(m => m.id === window.TFMyMemberId);
      if (window.API.createNotification) {
        await window.API.createNotification({
          recipient_id: task.created_by, type: 'approval',
          title: `${me?.name || 'A team member'} submitted "${task.title}" for review`,
          body: 'Tap to review and approve, or send it back.',
          link_screen: 'tasks', link_id: task.id,
        });
      }
    } catch {}
  }

  async function resolveTaskApproval(task, approved, comment) {
    if (!window.API) return;
    try {
      const { data: pending } = await window.API.getPendingApprovalForTask(task.id);
      if (!pending) return;
      const newStatus = approved ? 'done' : 'in_progress';
      await window.API.resolveApproval(pending.id, approved ? 'approved' : 'rejected', comment || '', task.id, newStatus);
      if (approved) await stopTimerIfRunningOnTask(task.id);
      patchTaskLocal(task.id, { status: newStatus, done: approved, approval_status: approved ? 'approved' : 'rejected' });
      setTaskMap(prev => {
        const next = {};
        COLUMN_CONFIG.forEach(c => { next[c.id] = (prev[c.id] || []).filter(t => t.id !== task.id); });
        next[newStatus] = [...(next[newStatus] || []), { ...task, status: newStatus, done: approved, approval_status: approved ? 'approved' : 'rejected' }];
        return next;
      });
      if (pending.requested_by && window.API.createNotification) {
        const me = team.find(m => m.id === window.TFMyMemberId);
        const verb = approved ? 'approved' : 'sent back';
        await window.API.createNotification({
          recipient_id: pending.requested_by, type: 'approval',
          title: `${me?.name || 'A reviewer'} ${verb} "${task.title}"`,
          body: comment || (approved ? 'No additional feedback.' : 'Take another look and resubmit when ready.'),
          link_screen: 'tasks', link_id: task.id,
        });
      }
    } catch {}
  }

  async function handleUpdateTask() {
    if (!editTask || !editForm.title?.trim()) return;
    setEditSaving(true);
    try {
      const changes = { title: editForm.title, priority: editForm.priority, status: editForm.status, due_date: editForm.due_date || null, assigned_to: editForm.assigned_to || null, client_id: editForm.client_id || null };
      if (changes.status === 'done') await stopTimerIfRunningOnTask(editTask.id);
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
      await uploadTaskFiles(editTask.id, editAttachments);
      setEditAttachments([]);
      setEditTask(null);
      if (changes.status === 'review' && editTask.status !== 'review') await submitForReview(updated);
    } finally { setEditSaving(false); }
  }

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  React.useEffect(() => {
    if (!window.API) { setLoading(false); return; }
    (async () => {
      try {
        const { data } = await window.API.getTasks();
        if (data) {
          const map  = { backlog: [], todo: [], in_progress: [], review: [], done: [] };
          const flat = [];
          data.forEach(t => {
            const key = t.status || 'todo';
            if (!map[key]) map[key] = [];
            const task = { id: t.id, title: t.title, priority: t.priority, due_date: t.due_date,
              status: t.status || 'todo', done: t.status === 'done', assigned_to: t.assigned_to,
              client_id: t.client_id || null, is_recurring: t.is_recurring || false,
              assigned_to_name: t.team_members ? t.team_members.name : null,
              project_name: t.projects ? t.projects.name : null,
              created_by: t.created_by || null, approval_status: t.approval_status || null };
            map[key].push(task);
            flat.push(task);
          });
          setTaskMap(map);
          setAllTasks(flat);
          setTotalOpen(map.todo.length + map.in_progress.length + map.review.length + map.backlog.length);
        }
      } catch {}
      setLoading(false);
    })();
    (async () => { try { const { data } = await window.API.getTeam();     if (data) setTeam(data); } catch {} })();
    (async () => { try { const { data } = await window.API.getProjects(); if (data) setProjects(data); } catch {} })();
    (async () => { try { const { data } = await window.API.getClients();  if (data) setClients(data); } catch {} })();
    (async () => {
      if (!window.API.getRunningTimeEntry || !window.TFMyMemberId) return;
      try { const { data } = await window.API.getRunningTimeEntry(window.TFMyMemberId); setRunningEntry(data || null); } catch {}
    })();
  }, []);

  async function handleAddTask() {
    if (!form.title.trim()) return;
    setSaving(true);
    setAddTaskError('');
    try {
      const payload = { title: form.title, priority: form.priority, status: form.status };
      if (form.due_date)    payload.due_date    = form.due_date;
      if (form.assigned_to) payload.assigned_to = form.assigned_to;
      if (form.project_id)  payload.project_id  = form.project_id;
      if (form.client_id)   payload.client_id   = form.client_id;
      payload.is_recurring = !!form.is_recurring;
      payload.recurrence_interval = form.is_recurring ? form.recurrence_interval : null;
      payload.next_run_date = form.is_recurring ? addRecurrenceInterval(form.due_date, form.recurrence_interval) : null;

      if (window.API) {
        const { data, error } = await window.API.createTask(payload);
        if (error) { setAddTaskError(error.message || 'Could not create the task. Please try again.'); return; }
        if (data) {
          const assigneeName = team.find(m => m.id === form.assigned_to)?.name || null;
          const projectName  = projects.find(p => p.id === form.project_id)?.name || null;
          const clientName = clients.find(c => c.id === form.client_id)?.company || clients.find(c => c.id === form.client_id)?.name || null;
          const newTask = { id: data.id, title: data.title, priority: data.priority, due_date: data.due_date,
            status: data.status || 'todo', done: false, assigned_to: form.assigned_to || null,
            client_id: form.client_id || null, client_name: clientName,
            assigned_to_name: assigneeName, project_name: projectName,
            attachment_count: attachments.length, created_by: data.created_by || null, approval_status: null };
          setTaskMap(prev => ({ ...prev, [newTask.status]: [...(prev[newTask.status] || []), newTask] }));
          setAllTasks(prev => [...prev, newTask]);
          if (newTask.status !== 'done') setTotalOpen(prev => prev + 1);
          await uploadTaskFiles(data.id, attachments);
          if (newTask.status === 'review') await submitForReview(newTask);
        }
      }
      setModalOpen(false);
      setForm({ title: '', priority: 'medium', status: 'todo', due_date: '', assigned_to: '', project_id: '', client_id: '', is_recurring: false, recurrence_interval: 'weekly' });
      setAttachments([]);
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

      {loading && <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>Loading…</div>}

      {!loading && activeTab === 'kanban' && (
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
                <div
                  onDragOver={e => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; if (dragOverCol !== col.id) setDragOverCol(col.id); }}
                  onDragLeave={() => setDragOverCol(prev => prev === col.id ? null : prev)}
                  onDrop={e => {
                    e.preventDefault();
                    const taskId = e.dataTransfer.getData('text/plain');
                    const task = allTasks.find(t => t.id === taskId);
                    moveTask(task, col.id);
                    setDragOverCol(null);
                    setDraggedId(null);
                  }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 10, borderRadius: 'var(--radius-xl)', padding: 10, minHeight: 120,
                    background: dragOverCol === col.id ? 'var(--blue-50)' : 'var(--slate-100)',
                    outline: dragOverCol === col.id ? '2px dashed var(--blue-300)' : '2px dashed transparent', outlineOffset: -2,
                    transition: 'background var(--dur-fast), outline-color var(--dur-fast)' }}>
                  {colTasks.map((t, i) => (
                    <TaskCard key={t.id || i} task={t} onEdit={openEdit}
                      isTimerRunning={!!(runningEntry && runningEntry.task_id === t.id)}
                      dragging={draggedId === t.id}
                      onDragStart={() => setDraggedId(t.id)}
                      onDragEnd={() => { setDraggedId(null); setDragOverCol(null); }}
                      onApprove={t2 => setReviewPrompt({ task: t2, approved: true })}
                      onReject={t2 => setReviewPrompt({ task: t2, approved: false })} />
                  ))}
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

      {!loading && activeTab === 'list' && (
        <TaskListView allTasks={allTasks} onAdd={() => setModalOpen(true)} onEdit={openEdit} onToggle={toggleTaskDone} />
      )}

      {!loading && activeTab === 'calendar' && (
        <TaskCalView allTasks={allTasks} onAdd={() => setModalOpen(true)} onEdit={openEdit} />
      )}

      <Modal open={!!editTask} onClose={() => setEditTask(null)} title="Edit task" onSubmit={handleUpdateTask} loading={editSaving} submitLabel="Save changes">
        {reviewFeedback && (
          <div style={{ marginBottom: 14, padding: '10px 12px', borderRadius: 'var(--radius-md)',
            background: reviewFeedback.status === 'approved' ? 'var(--green-50)' : 'var(--amber-50)',
            border: `1px solid ${reviewFeedback.status === 'approved' ? 'var(--green-200)' : 'var(--amber-200)'}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-bold)',
              color: reviewFeedback.status === 'approved' ? 'var(--green-700)' : 'var(--amber-800)', marginBottom: reviewFeedback.comment ? 4 : 0 }}>
              <Icon name={reviewFeedback.status === 'approved' ? 'check-circle' : 'corner-up-left'} size={13} />
              {reviewFeedback.team_members?.name || 'Reviewer'} {reviewFeedback.status === 'approved' ? 'approved this' : 'sent this back'}
            </div>
            {reviewFeedback.comment && <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-body)' }}>{reviewFeedback.comment}</div>}
          </div>
        )}
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
        <FormRow label="Visible to client">
          <select style={FF.select} value={editForm.client_id || ''} onChange={e => setEF('client_id', e.target.value)}>
            <option value="">Agency only</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.company || c.name}</option>)}
          </select>
        </FormRow>
        <FormRow label="Time tracking">
          {(() => {
            const runningOnThis = runningEntry && editTask && runningEntry.task_id === editTask.id;
            const runningOnOther = runningEntry && editTask && runningEntry.task_id !== editTask.id;
            const liveSeconds = runningOnThis ? Math.floor((Date.now() - new Date(runningEntry.started_at)) / 1000) : 0;
            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {runningOnThis && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--red-500)', flexShrink: 0, animation: 'tf-pulse 1.4s ease-in-out infinite' }} />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xl)', fontWeight: 'var(--fw-bold)', color: 'var(--text-strong)', fontVariantNumeric: 'tabular-nums' }}>
                      {fmtClock(liveSeconds)}
                    </span>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>this session</span>
                  </div>
                )}
                <style>{'@keyframes tf-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.25; } }'}</style>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {runningOnThis ? (
                    <button onClick={handleStopTimer} disabled={timerBusy} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, height: 34, padding: '0 14px', background: 'var(--red-50)', color: 'var(--red-600)', border: '1px solid var(--red-100)', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', cursor: timerBusy ? 'wait' : 'pointer' }}>
                      <Icon name="square" size={13} /> Stop
                    </button>
                  ) : (
                    <button onClick={() => handleStartTimer(editTask.id)} disabled={timerBusy || runningOnOther} title={runningOnOther ? 'Stop your timer on the other task first' : ''} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, height: 34, padding: '0 14px', background: runningOnOther ? 'var(--slate-100)' : 'var(--blue-50)', color: runningOnOther ? 'var(--text-subtle)' : 'var(--blue-600)', border: `1px solid ${runningOnOther ? 'var(--border-subtle)' : 'var(--blue-100)'}`, borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', cursor: (timerBusy || runningOnOther) ? 'not-allowed' : 'pointer' }}>
                      <Icon name="play" size={13} /> Start timer
                    </button>
                  )}
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                    {runningOnOther ? 'Timer running on another task' : `${fmtDuration(taskTotalSeconds + liveSeconds)} logged total`}
                  </span>
                </div>
              </div>
            );
          })()}
          {timerError && (
            <div style={{ marginTop: 8, padding: '8px 12px', borderRadius: 'var(--radius-md)', background: '#fff1f2', border: '1px solid #fecdd3', color: '#be123c', fontSize: 'var(--text-xs)' }}>
              {timerError}
            </div>
          )}
        </FormRow>
        <FormRow label="Attachments">
          <AttachArea files={editAttachments} onChange={setEditAttachments} />
        </FormRow>
      </Modal>

      <Modal open={!!reviewPrompt} onClose={() => { setReviewPrompt(null); setReviewComment(''); }}
        title={reviewPrompt?.approved ? 'Approve task' : 'Send task back'}
        onSubmit={confirmReviewDecision} loading={reviewSaving}
        submitLabel={reviewSaving ? 'Saving…' : (reviewPrompt?.approved ? 'Approve' : 'Send back')}>
        <FormRow label={`Feedback for ${reviewPrompt?.task?.assigned_to_name || 'the assignee'} (optional)`}>
          <textarea style={{ ...FF.input, height: 90, padding: '8px 10px', resize: 'vertical', fontFamily: 'var(--font-sans)' }}
            placeholder={reviewPrompt?.approved ? 'Looks great — thanks!' : 'What needs to change before this is ready?'}
            value={reviewComment} onChange={e => setReviewComment(e.target.value)} />
        </FormRow>
      </Modal>

      <Modal open={modalOpen} onClose={() => { setModalOpen(false); setAddTaskError(''); }} title="Add task" onSubmit={handleAddTask} loading={saving} submitLabel="Add task">
        {addTaskError && (
          <div style={{ marginBottom: 14, padding: '8px 12px', borderRadius: 'var(--radius-md)', background: '#fff1f2', border: '1px solid #fecdd3', color: '#be123c', fontSize: 'var(--text-sm)' }}>
            {addTaskError}
          </div>
        )}
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
        <div style={FF.row2}>
          <FormRow label="Project">
            <select style={FF.select} value={form.project_id} onChange={e => set('project_id', e.target.value)}>
              <option value="">No project</option>
              {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </FormRow>
          <FormRow label="Visible to client">
            <select style={FF.select} value={form.client_id} onChange={e => set('client_id', e.target.value)}>
              <option value="">Agency only</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.company || c.name}</option>)}
            </select>
          </FormRow>
        </div>
        <FormRow label="Attachments">
          <AttachArea files={attachments} onChange={setAttachments} />
        </FormRow>
        <FormRow label="Repeat">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 'var(--text-sm)', color: 'var(--text-body)', cursor: 'pointer' }}>
              <input type="checkbox" checked={!!form.is_recurring} onChange={e => set('is_recurring', e.target.checked)} />
              Auto-create the next task
            </label>
            {form.is_recurring && (
              <select style={{ ...FF.select, flex: '0 0 auto', width: 140 }} value={form.recurrence_interval} onChange={e => set('recurrence_interval', e.target.value)}>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            )}
          </div>
        </FormRow>
      </Modal>
    </div>
  );
}

Object.assign(window, { TasksBoard });
})();
