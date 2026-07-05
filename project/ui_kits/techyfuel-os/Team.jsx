// Team screen — members by department + workload.
(() => {
const { Card, Badge, Avatar, ProgressBar } = window.TechyFuelOSDesignSystem_be0222;

const DEPT_TONE = { Design: 'violet', Video: 'teal', Marketing: 'success', Development: 'info', Sales: 'warning', Admin: 'neutral', Content: 'teal', Leadership: 'brand' };
const ROLE_LABEL = { owner: 'Owner', admin: 'Admin', member: 'Member' };

function Team() {
  useLucide();
  const [team, setTeam] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [taskCounts, setTaskCounts] = React.useState({});
  const [progress, setProgress] = React.useState({}); // memberId -> { total, done, pct, secondsThisMonth, secondsAllTime }
  const [modalOpen, setModalOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState({ name: '', email: '', department: '', role: 'member' });

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  React.useEffect(() => {
    if (!window.API) { setLoading(false); return; }
    window.API.getAllTeamMembers().then(r => {
      setTeam(r.data || []);
    }).catch(() => {}).finally(() => setLoading(false));
    window.API.getTasks().then(r => {
      if (!r.data) return;
      const counts = {};
      r.data.filter(t => t.status !== 'done').forEach(t => {
        if (t.assigned_to) counts[t.assigned_to] = (counts[t.assigned_to] || 0) + 1;
      });
      setTaskCounts(counts);

      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      (window.API.getAllTimeEntries ? window.API.getAllTimeEntries() : Promise.resolve({ data: [] })).then(er => {
        const entries = er.data || [];
        const byMember = {};
        r.data.forEach(t => {
          if (!t.assigned_to) return;
          if (!byMember[t.assigned_to]) byMember[t.assigned_to] = { total: 0, done: 0, secondsThisMonth: 0, secondsAllTime: 0 };
          byMember[t.assigned_to].total++;
          if (t.status === 'done') byMember[t.assigned_to].done++;
        });
        entries.forEach(e => {
          if (!e.member_id) return;
          if (!byMember[e.member_id]) byMember[e.member_id] = { total: 0, done: 0, secondsThisMonth: 0, secondsAllTime: 0 };
          byMember[e.member_id].secondsAllTime += e.duration_seconds || 0;
          if (new Date(e.started_at) >= monthStart) byMember[e.member_id].secondsThisMonth += e.duration_seconds || 0;
        });
        const result = {};
        Object.keys(byMember).forEach(id => {
          const b = byMember[id];
          result[id] = { ...b, pct: b.total > 0 ? Math.round((b.done / b.total) * 100) : 0 };
        });
        setProgress(result);
      }).catch(() => {});
    }).catch(() => {});
  }, []);

  function fmtHours(totalSeconds) {
    if (!totalSeconds) return '0h';
    const h = totalSeconds / 3600;
    return h < 1 ? Math.round(totalSeconds / 60) + 'm' : h.toFixed(1) + 'h';
  }

  async function handleInviteMember() {
    if (!form.name.trim()) { alert('Name is required.'); return; }
    if (!form.email.trim()) { alert('Email is required.'); return; }
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        role: form.role,
        status: 'active',
      };
      if (form.department) payload.department = form.department;
      if (window.API) {
        const { data, error } = await window.API.addTeamMember(payload);
        if (error) {
          const msg = error.message || error.details || JSON.stringify(error);
          alert('Could not add member:\n\n' + msg);
          return;
        }
        if (data) setTeam(prev => [...prev, data]);
      }
      setModalOpen(false);
      setForm({ name: '', email: '', department: '', role: 'member' });
    } catch (err) {
      alert('Error: ' + (err.message || JSON.stringify(err)));
    } finally { setSaving(false); }
  }

  async function toggleStatus(m, e) {
    e.stopPropagation();
    const suspending = m.status !== 'inactive';
    if (suspending) {
      const warn = m.role === 'owner' ? '\n\nThis member is an Owner — suspending them will block their access too.' : '';
      if (!window.confirm(`Suspend ${m.name}? They will lose access to TechyFuel OS immediately.${warn}`)) return;
    }
    const newStatus = suspending ? 'inactive' : 'active';
    setTeam(prev => prev.map(t => t.id === m.id ? { ...t, status: newStatus } : t));
    if (window.API) {
      try { await window.API.setTeamMemberStatus(m.id, newStatus); } catch {}
    }
  }

  const departments = [...new Set(team.map(m => m.department).filter(Boolean))];
  const maxTasks = Math.max(...team.map(m => taskCounts[m.id] || 0), 1);

  return (
    <div style={{ padding: 24, maxWidth: 1280, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--fw-extrabold)', letterSpacing: '-0.02em' }}>Team</h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 2 }}>{team.length} members · {departments.length} departments</p>
        </div>
        <button onClick={() => setModalOpen(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, height: 36, padding: '0 14px', background: 'var(--blue-600)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-brand)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', cursor: 'pointer' }}>
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
      {loading && <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>Loading…</div>}
      {!loading && team.length === 0 && (
        <div style={{ padding: '60px 24px', textAlign: 'center' }}>
          <Icon name="users" size={40} style={{ color: 'var(--text-subtle)', marginBottom: 12 }} />
          <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--fw-bold)', color: 'var(--text-strong)', marginBottom: 6 }}>No team members yet</div>
          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>Invite your first teammate to get started.</div>
        </div>
      )}
      {!loading && team.length > 0 && (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {team.map((m, i) => {
          const tasks = taskCounts[m.id] || 0;
          const load = maxTasks > 0 ? Math.round((tasks / maxTasks) * 100) : 0;
          const tone = DEPT_TONE[m.department] || 'neutral';
          const suspended = m.status === 'inactive';
          const prog = progress[m.id] || { total: 0, done: 0, pct: 0, secondsThisMonth: 0, secondsAllTime: 0 };
          return (
            <Card key={m.id || i} interactive padding="md" style={suspended ? { opacity: 0.6 } : undefined}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <Avatar name={m.name} size="lg" status={suspended ? 'offline' : 'online'} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 'var(--text-md)', fontWeight: 'var(--fw-bold)', color: 'var(--text-strong)' }}>{m.name}</span>
                    {suspended && <Badge tone="danger" size="sm">Suspended</Badge>}
                  </div>
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)' }}>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 'var(--fw-semibold)' }}>Progress · {prog.done}/{prog.total} tasks done</span>
                  <span style={{ color: 'var(--text-strong)', fontWeight: 'var(--fw-bold)' }}>{prog.pct}%</span>
                </div>
                <ProgressBar value={prog.pct} tone="success" size="sm" />
                <div style={{ display: 'flex', gap: 14, fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icon name="timer" size={12} /> {fmtHours(prog.secondsThisMonth)} this month</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icon name="history" size={12} /> {fmtHours(prog.secondsAllTime)} all time</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, paddingTop: 12, borderTop: '1px solid var(--border-subtle)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Icon name="circle-check-big" size={14} /> {tasks} active tasks</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Icon name="mail" size={14} /> {m.email || '—'}</span>
                <button onClick={e => toggleStatus(m, e)}
                  style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 5, height: 26, padding: '0 9px', background: 'transparent', border: `1px solid ${suspended ? 'var(--green-300)' : 'var(--red-200)'}`, borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-2xs)', fontWeight: 'var(--fw-semibold)', color: suspended ? 'var(--green-600)' : 'var(--red-600)', cursor: 'pointer' }}>
                  <Icon name={suspended ? 'user-check' : 'user-x'} size={12} /> {suspended ? 'Reactivate' : 'Suspend'}
                </button>
              </div>
            </Card>
          );
        })}
      </div>
      )}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Invite member" onSubmit={handleInviteMember} loading={saving} submitLabel="Add member">
        <div style={FF.row2}>
          <FormRow label="Full name" required>
            <input style={FF.input} placeholder="Name…" value={form.name} onChange={e => set('name', e.target.value)} />
          </FormRow>
          <FormRow label="Email" required>
            <input style={FF.input} type="email" placeholder="email@agency.com" value={form.email} onChange={e => set('email', e.target.value)} />
          </FormRow>
        </div>
        <div style={FF.row2}>
          <FormRow label="Department">
            <input style={FF.input} placeholder="Design, Marketing…" value={form.department} onChange={e => set('department', e.target.value)} />
          </FormRow>
          <FormRow label="Role">
            <select style={FF.select} value={form.role} onChange={e => set('role', e.target.value)}>
              <option value="member">Member</option>
              <option value="admin">Admin</option>
              <option value="owner">Owner</option>
            </select>
          </FormRow>
        </div>
      </Modal>
    </div>
  );
}
Object.assign(window, { Team });
})();
