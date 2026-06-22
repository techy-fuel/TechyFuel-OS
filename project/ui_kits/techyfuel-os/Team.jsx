// Team screen — members by department + workload.
(() => {
const { Card, Badge, Avatar, ProgressBar } = window.TechyFuelOSDesignSystem_be0222;

const DEPT_TONE = { Design: 'violet', Video: 'teal', Marketing: 'success', Development: 'info', Sales: 'warning', Admin: 'neutral', Content: 'teal', Leadership: 'brand' };
const ROLE_LABEL = { owner: 'Owner', admin: 'Admin', member: 'Member' };

const FALLBACK_TEAM = [
  { id: '11111111-1111-1111-1111-111111111111', name: 'Sara Khan',     role: 'owner',  department: 'Leadership', status: 'active' },
  { id: '22222222-2222-2222-2222-222222222222', name: 'Ali Raza',      role: 'admin',  department: 'Design',     status: 'active' },
  { id: '33333333-3333-3333-3333-333333333333', name: 'Zara Ahmed',    role: 'member', department: 'Marketing',  status: 'active' },
  { id: '44444444-4444-4444-4444-444444444444', name: 'Omar Sheikh',   role: 'member', department: 'Development',status: 'active' },
  { id: '55555555-5555-5555-5555-555555555555', name: 'Hina Malik',    role: 'member', department: 'Content',    status: 'active' },
];

function Team() {
  const [team, setTeam] = React.useState(FALLBACK_TEAM);
  const [taskCounts, setTaskCounts] = React.useState({});

  React.useEffect(() => {
    if (!window.API) return;
    window.API.getTeam().then(r => {
      if (r.data && r.data.length > 0) setTeam(r.data);
    }).catch(() => {});
    window.API.getTasks().then(r => {
      if (!r.data) return;
      const counts = {};
      r.data.filter(t => t.status !== 'done').forEach(t => {
        if (t.assigned_to) counts[t.assigned_to] = (counts[t.assigned_to] || 0) + 1;
      });
      setTaskCounts(counts);
    }).catch(() => {});
  }, []);

  const departments = [...new Set(team.map(m => m.department).filter(Boolean))];
  const maxTasks = Math.max(...team.map(m => taskCounts[m.id] || 0), 1);

  return (
    <div style={{ padding: 24, maxWidth: 1280, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--fw-extrabold)', letterSpacing: '-0.02em' }}>Team</h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 2 }}>{team.length} members · {departments.length} departments</p>
        </div>
        <button style={{ display: 'inline-flex', alignItems: 'center', gap: 7, height: 36, padding: '0 14px', background: 'var(--blue-600)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-brand)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', cursor: 'pointer' }}>
          <Icon name="user-plus" size={16} /> Invite member
        </button>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
        {departments.map(d => {
          const tone = DEPT_TONE[d] || 'neutral';
          const dotColor = tone === 'neutral' ? 'var(--slate-400)' : tone === 'info' ? 'var(--blue-500)' : `var(--${tone}-500)`;
          return (
            <span key={d} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '6px 12px', background: 'var(--slate-0)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-body)' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: dotColor }} />{d}
            </span>
          );
        })}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {team.map((m, i) => {
          const tasks = taskCounts[m.id] || 0;
          const load = maxTasks > 0 ? Math.round((tasks / maxTasks) * 100) : 0;
          const tone = DEPT_TONE[m.department] || 'neutral';
          return (
            <Card key={m.id || i} interactive padding="md">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <Avatar name={m.name} size="lg" status="online" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 'var(--text-md)', fontWeight: 'var(--fw-bold)', color: 'var(--text-strong)' }}>{m.name}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{ROLE_LABEL[m.role] || m.role}</div>
                </div>
                <Badge tone={tone} size="sm">{m.department || 'Team'}</Badge>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)' }}>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 'var(--fw-semibold)' }}>Workload</span>
                  <span style={{ color: load > 85 ? 'var(--red-600)' : 'var(--text-strong)', fontWeight: 'var(--fw-bold)' }}>{load}%</span>
                </div>
                <ProgressBar value={load} tone={load > 85 ? 'danger' : load > 70 ? 'warning' : 'brand'} size="sm" />
              </div>
              <div style={{ display: 'flex', gap: 16, paddingTop: 12, borderTop: '1px solid var(--border-subtle)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Icon name="circle-check-big" size={14} /> {tasks} active tasks</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Icon name="mail" size={14} /> {m.email || '—'}</span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
Object.assign(window, { Team });
})();
