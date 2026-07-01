// Executive Dashboard screen.
(() => {
const { StatCard, Card, Badge, Avatar, AvatarGroup, ProgressBar } = window.TechyFuelOSDesignSystem_be0222;

function SectionHead({ title, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
      <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--fw-bold)' }}>{title}</h3>
      {action}
    </div>
  );
}
function LinkBtn({ children, onClick }) {
  return <button onClick={onClick} style={{ background: 'none', border: 'none', color: 'var(--text-link)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', cursor: 'pointer', padding: 0 }}>{children}</button>;
}

function fmtMoney(n) {
  if (!n) return '$0';
  if (n >= 1000000) return '$' + (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000)    return '$' + (n / 1000).toFixed(1) + 'K';
  return '$' + Math.round(n);
}

function fmtDueDate(ds) {
  if (!ds) return '—';
  const d = new Date(ds);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const diff = Math.round((d - today) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  return d.toLocaleDateString('en', { month: 'short', day: 'numeric' });
}

function fmtWhen(ds) {
  if (!ds) return '';
  const diff = Math.round((Date.now() - new Date(ds)) / 60000);
  if (diff < 60)  return diff + 'm ago';
  if (diff < 1440) return Math.round(diff / 60) + 'h ago';
  return Math.round(diff / 1440) + 'd ago';
}

const STATUS_TONE = {
  todo: 'brand', in_progress: 'brand', review: 'warning', done: 'success', backlog: 'neutral',
};
const STATUS_ICON = {
  todo: 'circle', in_progress: 'loader', review: 'eye', done: 'check', backlog: 'inbox',
};
const STATUS_BG = {
  todo:        ['var(--blue-50)',   'var(--blue-600)'],
  in_progress: ['var(--violet-50)','var(--violet-600)'],
  review:      ['var(--amber-50)', 'var(--amber-600)'],
  done:        ['var(--green-50)', 'var(--green-600)'],
  backlog:     ['var(--slate-100)','var(--slate-500)'],
};

function ActivityRow({ item }) {
  const [bg, fg] = STATUS_BG[item.status] || STATUS_BG.todo;
  const icon = STATUS_ICON[item.status] || 'activity';
  const label = item.status === 'in_progress' ? 'In progress' : item.status === 'done' ? 'Completed' : item.status === 'review' ? 'In review' : item.status || 'Task';
  return (
    <div style={{ display: 'flex', gap: 11, padding: '10px 0', borderBottom: '1px solid var(--border-subtle)' }}>
      <span style={{ width: 30, height: 30, flex: 'none', borderRadius: 'var(--radius-md)', background: bg, color: fg, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={icon} size={15} />
      </span>
      <div style={{ flex: 1, fontSize: 'var(--text-sm)', color: 'var(--text-body)', lineHeight: 1.45, minWidth: 0 }}>
        <strong style={{ color: 'var(--text-strong)', fontWeight: 'var(--fw-semibold)' }}>{item.title}</strong>
        {item.project && <span style={{ color: 'var(--text-muted)' }}> · {item.project}</span>}
        {item.assignee && <span style={{ color: 'var(--text-subtle)', fontSize: 'var(--text-xs)' }}> — {item.assignee}</span>}
      </div>
      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-subtle)', whiteSpace: 'nowrap' }}>{fmtWhen(item.created_at)}</span>
    </div>
  );
}

// ── Member dashboard — only their own tasks/projects/chat, no company-wide
//    figures (revenue, client list, other people's work) ──────────────────
function MemberDashboard() {
  useLucide();
  const [greeting, setGreeting] = React.useState((window.TFMyName || '').split(' ')[0] || '');
  const [myTasks,  setMyTasks]  = React.useState([]);
  const [unread,   setUnread]   = React.useState(0);
  const [loading,  setLoading]  = React.useState(true);

  React.useEffect(() => {
    if (!window.API) { setLoading(false); return; }
    const myId = window.TFMyMemberId;
    (async () => {
      try {
        const r = await window.API.getTasks({ assignedTo: myId });
        if (r.data) setMyTasks(r.data);
      } catch {}
      try {
        const count = await window.API.getUnreadCount(myId);
        setUnread(count || 0);
      } catch {}
      setLoading(false);
    })();
  }, []);

  const openTasks = myTasks.filter(t => t.status !== 'done');
  const doneTasks = myTasks.filter(t => t.status === 'done');
  const upcoming = openTasks.filter(t => t.due_date).sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
  const overdue = upcoming.filter(t => new Date(t.due_date) < new Date());
  const myProjects = Array.from(new Map(myTasks.filter(t => t.project_id && t.projects).map(t => [t.project_id, t.projects])).values());

  if (loading) return <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)' }}>Loading…</div>;

  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 'var(--text-2xs)', fontWeight: 'var(--fw-bold)', letterSpacing: 'var(--tracking-caps)', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>
          {greeting ? `Good morning, ${greeting}` : 'Good morning'}
        </div>
        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--fw-extrabold)', letterSpacing: '-0.02em' }}>My dashboard</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 16 }}>
        <StatCard label="Open tasks" value={String(openTasks.length)} icon={<Icon name="circle-check-big" />} tone="brand" />
        <StatCard label="Overdue" value={String(overdue.length)} icon={<Icon name="alert-circle" />} tone={overdue.length ? 'danger' : 'neutral'} />
        <StatCard label="Completed" value={String(doneTasks.length)} icon={<Icon name="check" />} tone="success" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        <Card padding="lg">
          <SectionHead title="My timeline" action={<LinkBtn onClick={() => window.TFNavigate && window.TFNavigate('tasks')}>View all tasks</LinkBtn>} />
          {upcoming.length === 0 ? (
            <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>No upcoming tasks — you're all caught up!</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {upcoming.slice(0, 8).map(t => {
                const isOverdue = new Date(t.due_date) < new Date();
                return (
                  <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 12, borderBottom: '1px solid var(--border-subtle)' }}>
                    <span style={{ width: 30, height: 30, flex: 'none', borderRadius: 'var(--radius-md)', background: isOverdue ? 'var(--red-50)' : 'var(--blue-50)', color: isOverdue ? 'var(--red-600)' : 'var(--blue-600)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon name={isOverdue ? 'alert-circle' : 'circle'} size={15} />
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.title}</div>
                      {t.projects?.name && <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{t.projects.name}</div>}
                    </div>
                    <Badge tone={isOverdue ? 'danger' : 'neutral'}>{fmtDueDate(t.due_date)}</Badge>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card padding="lg">
            <SectionHead title="My projects" />
            {myProjects.length === 0 ? (
              <div style={{ padding: '16px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>No projects yet</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {myProjects.map((p, i) => (
                  <div key={i} onClick={() => window.TFNavigate && window.TFNavigate('projects')} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', cursor: 'pointer' }}>
                    <Icon name="folder-kanban" size={16} style={{ color: 'var(--blue-600)' }} />
                    <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)' }}>{p.name}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card padding="lg">
            <SectionHead title="Team Chat" />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
                {unread > 0 ? `${unread} unread message${unread === 1 ? '' : 's'}` : 'All caught up'}
              </div>
              <LinkBtn onClick={() => window.TFNavigate && window.TFNavigate('chat')}>Open chat</LinkBtn>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ExecutiveDashboard() {
  useLucide();
  const [stats,     setStats]     = React.useState({ activeClients: 0, activeProjects: 0, openTasks: 0, revenue: 0 });
  const [deadlines, setDeadlines] = React.useState([]);
  const [activity,  setActivity]  = React.useState([]);
  const [tasksByStatus, setTasksByStatus] = React.useState({ todo: 0, in_progress: 0, review: 0, done: 0 });
  const [greeting,  setGreeting]  = React.useState('');
  const [clients,   setClients]   = React.useState([]);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [saving,    setSaving]    = React.useState(false);
  const [statsLoaded, setStatsLoaded] = React.useState(false);
  const [form, setForm] = React.useState({ name: '', client_id: '', budget: '', due_date: '', priority: 'medium', status: 'active' });

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  React.useEffect(() => {
    if (!window.API) return;

    (async () => {
      try {
        const s = await window.API.getDashboardStats();
        if (s) { setStats(s); setStatsLoaded(true); }
      } catch {}
      try {
        const r = await window.API.getTasks();
        if (r.data) {
          const upcoming = r.data
            .filter(t => t.due_date && t.status !== 'done')
            .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
            .slice(0, 4)
            .map(t => ({
              project: t.title,
              client: t.clients ? t.clients.name : (t.projects ? t.projects.name : ''),
              due: fmtDueDate(t.due_date),
              urgent: new Date(t.due_date) < new Date(),
              pct: 50,
              team: t.team_members ? [t.team_members.name] : [],
            }));
          setDeadlines(upcoming);
          const counts = { todo: 0, in_progress: 0, review: 0, done: 0 };
          r.data.forEach(t => { if (counts[t.status] !== undefined) counts[t.status]++; });
          setTasksByStatus(counts);
          const recent = [...r.data]
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 5)
            .map(t => ({ id: t.id, title: t.title, status: t.status, project: t.projects?.name || '', assignee: t.team_members?.name || '', created_at: t.created_at }));
          setActivity(recent);
        }
      } catch {}
      try {
        const r = await window.API.getTeam();
        if (r.data && r.data.length > 0) setGreeting(r.data[0].name.split(' ')[0]);
      } catch {}
      try {
        const r = await window.API.getClients();
        if (r.data) setClients(r.data);
      } catch {}
    })();
  }, []);

  async function handleNewProject() {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      const payload = { name: form.name, status: form.status, priority: form.priority };
      if (form.client_id) payload.client_id = form.client_id;
      if (form.budget)    payload.budget    = Number(form.budget);
      if (form.due_date)  payload.due_date  = form.due_date;
      if (window.API) await window.API.createProject(payload);
      setModalOpen(false);
      setForm({ name: '', client_id: '', budget: '', due_date: '', priority: 'medium', status: 'active' });
      if (window.TFNavigate) window.TFNavigate('projects');
    } finally { setSaving(false); }
  }

  const revenueDisplay = fmtMoney(stats.revenue);
  const totalTasks = Object.values(tasksByStatus).reduce((s, n) => s + n, 0);
  const donutSegments = [
    { value: tasksByStatus.in_progress || 0, color: 'var(--blue-600)' },
    { value: tasksByStatus.review       || 0, color: 'var(--sky-500)' },
    { value: tasksByStatus.todo         || 0, color: 'var(--violet-500)' },
    { value: tasksByStatus.done         || 0, color: 'var(--green-500)' },
  ];

  return (
    <div style={{ padding: 24, maxWidth: 1280, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontSize: 'var(--text-2xs)', fontWeight: 'var(--fw-bold)', letterSpacing: 'var(--tracking-caps)', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>
            {greeting ? `Good morning, ${greeting}` : 'Good morning'}
          </div>
          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--fw-extrabold)', letterSpacing: '-0.02em' }}>Executive dashboard</h1>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, height: 36, padding: '0 12px', background: 'var(--slate-0)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-body)' }}>
            <Icon name="calendar" size={16} style={{ color: 'var(--text-muted)' }} /> This month <Icon name="chevron-down" size={15} style={{ color: 'var(--text-subtle)' }} />
          </div>
          <button onClick={() => setModalOpen(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, height: 36, padding: '0 14px', background: 'var(--blue-600)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-brand)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', cursor: 'pointer' }}>
            <Icon name="plus" size={16} /> New project
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 16 }}>
        <StatCard label="Revenue (paid)" value={revenueDisplay} icon={<Icon name="dollar-sign" />} tone="success" />
        <StatCard label="Active projects" value={String(stats.activeProjects)} icon={<Icon name="folder-kanban" />} tone="brand" />
        <StatCard label="Open tasks" value={String(stats.openTasks)} icon={<Icon name="circle-check-big" />} tone="warning" />
        <StatCard label="Active clients" value={String(stats.activeClients)} icon={<Icon name="users" />} tone="violet" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 16 }}>
        <Card padding="lg">
          <SectionHead title="Revenue (paid invoices)" />
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 10 }}>
            <span style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--fw-extrabold)', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>{revenueDisplay}</span>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>total collected</span>
          </div>
          {statsLoaded && stats.revenue === 0 ? (
            <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>No paid invoices yet</div>
          ) : (
            <AreaLine data={[1,1,2,2,3,3,4,5,6,7,8, stats.revenue ? Math.round(stats.revenue / 1000) : 10]} id="rev" />
          )}
        </Card>
        <Card padding="lg">
          <SectionHead title="Tasks by status" />
          {totalTasks === 0 ? (
            <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>No tasks yet</div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <Donut segments={donutSegments} label={totalTasks} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                {[
                  ['In progress', tasksByStatus.in_progress, 'var(--blue-600)'],
                  ['Review',      tasksByStatus.review,      'var(--sky-500)'],
                  ['Todo',        tasksByStatus.todo,        'var(--violet-500)'],
                  ['Done',        tasksByStatus.done,        'var(--green-500)'],
                ].map(([l, n, c]) => (
                  <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--text-sm)' }}>
                    <span style={{ width: 9, height: 9, borderRadius: 3, background: c, flex: 'none' }} />
                    <span style={{ flex: 1, color: 'var(--text-body)' }}>{l}</span>
                    <span style={{ fontWeight: 'var(--fw-bold)', color: 'var(--text-strong)', fontVariantNumeric: 'tabular-nums' }}>{n}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card padding="lg">
          <SectionHead title="Recent tasks" />
          {activity.length === 0 ? (
            <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>No tasks yet</div>
          ) : (
            <div>{activity.map((a, i) => <ActivityRow key={i} item={a} />)}</div>
          )}
        </Card>
        <Card padding="lg">
          <SectionHead title="Upcoming deadlines" action={<LinkBtn onClick={() => window.TFNavigate && window.TFNavigate('calendar')}>Open calendar</LinkBtn>} />
          {deadlines.length === 0 ? (
            <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>No upcoming deadlines</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {deadlines.map((d, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.project}</div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{d.client}</div>
                    </div>
                    <Badge tone={d.urgent ? 'danger' : 'neutral'} dot={d.urgent}>{d.due}</Badge>
                  </div>
                  <ProgressBar value={d.pct} tone={d.urgent ? 'warning' : 'brand'} size="sm" />
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New project" onSubmit={handleNewProject} loading={saving} submitLabel="Create project">
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

// Members get their own personalized view (no company-wide revenue/client
// figures); everyone else gets the full executive dashboard.
function Dashboard() {
  return window.TFMyRole === 'member' ? <MemberDashboard /> : <ExecutiveDashboard />;
}

Object.assign(window, { Dashboard, TFSectionHead: SectionHead, TFLinkBtn: LinkBtn });
})();
