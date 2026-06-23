// Content calendar screen — weekly social planner.
(() => {
const { Card, Badge, Avatar } = window.TechyFuelOSDesignSystem_be0222;
const PLAT = {
  instagram: ['instagram', 'var(--violet-500)'],
  facebook:  ['facebook',  'var(--blue-600)'],
  linkedin:  ['linkedin',  'var(--sky-600)'],
  twitter:   ['twitter',   'var(--sky-400)'],
  youtube:   ['youtube',   'var(--red-500)'],
  tiktok:    ['music',     'var(--slate-900)'],
};
const SS = { scheduled: ['success', 'Scheduled'], draft: ['neutral', 'Draft'], approval: ['warning', 'Approval'], published: ['info', 'Published'], rejected: ['danger', 'Rejected'] };

function getWeekDays() {
  const today = new Date();
  const dow = today.getDay(); // 0=Sun
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1));
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    days.push({
      label: d.toLocaleDateString('en', { weekday: 'short', day: 'numeric' }),
      dateStr: d.toISOString().split('T')[0],
      dayIndex: i,
    });
  }
  return days;
}

const FALLBACK_POSTS = {
  0: [{ id: 'f1', platform: 'instagram', title: 'Summer Menu Drop',    status: 'scheduled', assigned_to_name: 'Hina Malik' }],
  1: [{ id: 'f2', platform: 'linkedin',  title: 'Client Testimonial', status: 'scheduled', assigned_to_name: 'Hina Malik' }],
  2: [{ id: 'f3', platform: 'instagram', title: 'Product Launch Reel', status: 'draft',     assigned_to_name: 'Zara Ahmed' }],
  3: [], 4: [], 5: [], 6: [],
};

function PostCard({ post }) {
  const [pi, pc] = PLAT[post.platform] || ['image', 'var(--slate-500)'];
  const [st, sl] = SS[post.status] || ['neutral', post.status];
  return (
    <div style={{ background: 'var(--slate-0)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: 9, boxShadow: 'var(--shadow-xs)', cursor: 'pointer' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
        <span style={{ width: 22, height: 22, borderRadius: 'var(--radius-sm)', background: 'var(--slate-50)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: pc }}><Icon name={pi} size={13} /></span>
        <Badge tone={st} size="sm">{sl}</Badge>
      </div>
      <div style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)', lineHeight: 1.35 }}>{post.title}</div>
      {post.assigned_to_name && (
        <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-muted)', marginTop: 5 }}>{post.assigned_to_name}</div>
      )}
    </div>
  );
}

function ContentCalendar() {
  const [postMap, setPostMap] = React.useState(FALLBACK_POSTS);
  const [totalPosts, setTotalPosts] = React.useState(3);
  const days = React.useMemo(() => getWeekDays(), []);
  const [weekLabel, setWeekLabel] = React.useState('This week');
  const [clients, setClients] = React.useState([]);
  const [team, setTeam] = React.useState([]);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState({ title: '', platform: 'instagram', status: 'draft', scheduled_at: '', client_id: '', assigned_to: '' });

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  React.useEffect(() => {
    if (!window.API) return;
    window.API.getContent().then(r => {
      if (!r.data || r.data.length === 0) return;
      const startOfWeek = new Date(days[0].dateStr);
      startOfWeek.setHours(0, 0, 0, 0);
      const endOfWeek = new Date(days[6].dateStr);
      endOfWeek.setHours(23, 59, 59, 999);

      const map = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
      let count = 0;
      r.data.forEach(post => {
        if (!post.scheduled_at) {
          map[0] = map[0] || [];
          map[0].push({ id: post.id, platform: post.platform, title: post.title, status: post.status, assigned_to_name: post.team_members ? post.team_members.name : null });
          count++;
          return;
        }
        const pd = new Date(post.scheduled_at);
        const dayDiff = Math.round((pd - startOfWeek) / 86400000);
        if (dayDiff >= 0 && dayDiff < 7) {
          map[dayDiff].push({ id: post.id, platform: post.platform, title: post.title, status: post.status, assigned_to_name: post.team_members ? post.team_members.name : null });
          count++;
        }
      });

      const hasPosts = Object.values(map).some(arr => arr.length > 0);
      if (hasPosts) {
        setPostMap(map);
        setTotalPosts(r.data.length);
      }
    }).catch(() => {});
    window.API.getClients().then(r => { if (r.data) setClients(r.data); }).catch(() => {});
    window.API.getTeam().then(r => { if (r.data) setTeam(r.data); }).catch(() => {});
  }, []);

  async function handleAddPost() {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      const payload = { title: form.title, platform: form.platform, status: form.status };
      if (form.scheduled_at) payload.scheduled_at = form.scheduled_at + ':00';
      if (form.client_id)    payload.client_id    = form.client_id;
      if (form.assigned_to)  payload.assigned_to  = form.assigned_to;
      if (window.API) {
        const { data, error } = await window.API.createPost(payload);
        if (!error && data) {
          const assigneeName = team.find(m => m.id === form.assigned_to)?.name || null;
          const newPost = { id: data.id, platform: data.platform, title: data.title, status: data.status, assigned_to_name: assigneeName };
          setPostMap(prev => ({ ...prev, 0: [...(prev[0] || []), newPost] }));
          setTotalPosts(prev => prev + 1);
        }
      }
      setModalOpen(false);
      setForm({ title: '', platform: 'instagram', status: 'draft', scheduled_at: '', client_id: '', assigned_to: '' });
    } finally { setSaving(false); }
  }

  const platforms = new Set(
    Object.values(postMap).flat().map(p => p.platform).filter(Boolean)
  );

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--fw-extrabold)', letterSpacing: '-0.02em' }}>Content calendar</h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 2 }}>{weekLabel} · {totalPosts} posts across {platforms.size || 3} platforms</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 36, padding: '0 10px', background: 'var(--slate-0)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)' }}>
            <Icon name="chevron-left" size={16} style={{ color: 'var(--text-muted)', cursor: 'pointer' }} />
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-body)' }}>{weekLabel}</span>
            <Icon name="chevron-right" size={16} style={{ color: 'var(--text-muted)', cursor: 'pointer' }} />
          </div>
          <button onClick={() => setModalOpen(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, height: 36, padding: '0 14px', background: 'var(--blue-600)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-brand)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', cursor: 'pointer' }}>
            <Icon name="plus" size={16} /> Plan post
          </button>
        </div>
      </div>
      <Card padding="none" style={{ overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
          {days.map((day, i) => {
            const isToday = day.dateStr === new Date().toISOString().split('T')[0];
            return (
              <div key={i} style={{ borderRight: i < 6 ? '1px solid var(--border-subtle)' : 'none', minHeight: 360 }}>
                <div style={{ padding: '11px 12px', borderBottom: '1px solid var(--border-subtle)', fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-bold)', color: isToday ? 'var(--blue-700)' : 'var(--text-strong)', background: isToday ? 'var(--blue-50)' : 'transparent' }}>{day.label}</div>
                <div style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {(postMap[i] || []).map((p, j) => <PostCard key={p.id || j} post={p} />)}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Plan post" onSubmit={handleAddPost} loading={saving} submitLabel="Add post">
        <FormRow label="Post title" required>
          <input style={FF.input} placeholder="Post caption or title…" value={form.title} onChange={e => set('title', e.target.value)} />
        </FormRow>
        <div style={FF.row2}>
          <FormRow label="Platform">
            <select style={FF.select} value={form.platform} onChange={e => set('platform', e.target.value)}>
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
              <option value="linkedin">LinkedIn</option>
              <option value="twitter">Twitter</option>
              <option value="youtube">YouTube</option>
              <option value="tiktok">TikTok</option>
            </select>
          </FormRow>
          <FormRow label="Status">
            <select style={FF.select} value={form.status} onChange={e => set('status', e.target.value)}>
              <option value="draft">Draft</option>
              <option value="approval">Needs approval</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </FormRow>
        </div>
        <div style={FF.row2}>
          <FormRow label="Scheduled at">
            <input style={FF.input} type="datetime-local" value={form.scheduled_at} onChange={e => set('scheduled_at', e.target.value)} />
          </FormRow>
          <FormRow label="Assign to">
            <select style={FF.select} value={form.assigned_to} onChange={e => set('assigned_to', e.target.value)}>
              <option value="">Unassigned</option>
              {team.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </FormRow>
        </div>
        <FormRow label="Client">
          <select style={FF.select} value={form.client_id} onChange={e => set('client_id', e.target.value)}>
            <option value="">No client</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.company || c.name}</option>)}
          </select>
        </FormRow>
      </Modal>
    </div>
  );
}
Object.assign(window, { ContentCalendar });
})();
