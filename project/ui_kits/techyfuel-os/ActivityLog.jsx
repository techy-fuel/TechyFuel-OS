// Activity Log — audit trail of actions across the app.
(() => {
const { Card, Badge } = window.TechyFuelOSDesignSystem_be0222;

const ENTITY_ICON = {
  task: 'circle-check-big', project: 'folder-kanban', client: 'contact',
  document: 'file-text', file: 'paperclip', team_member: 'user-plus',
  call: 'phone', message: 'message-square', expense: 'wallet',
};
const ENTITY_LABEL = {
  task: 'Task', project: 'Project', client: 'Client',
  document: 'Document', file: 'File', team_member: 'Team member',
  call: 'Call', message: 'Message', expense: 'Expense',
};
const ENTITY_TONE = {
  task: 'brand', project: 'info', client: 'success',
  document: 'violet', file: 'teal', team_member: 'warning',
  call: 'danger', message: 'neutral', expense: 'warning',
};
const ACTION_LABEL = {
  created: 'created', updated: 'updated', deleted: 'deleted',
  uploaded: 'uploaded', invited: 'invited',
  started: 'started', ended: 'ended', sent: 'sent',
  suspended: 'suspended', reactivated: 'reactivated',
};

function fmtWhen(ts) {
  if (!ts) return '';
  const diff = Math.round((Date.now() - new Date(ts)) / 60000);
  if (diff < 1) return 'just now';
  if (diff < 60) return diff + 'm ago';
  if (diff < 1440) return Math.round(diff / 60) + 'h ago';
  return Math.round(diff / 1440) + 'd ago';
}

function initials(name) {
  if (!name) return '?';
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

function ActivityRow({ item }) {
  const icon = ENTITY_ICON[item.entity_type] || 'activity';
  const tone = ENTITY_TONE[item.entity_type] || 'neutral';
  const actorName = item.team_members?.name || 'Someone';
  const entityLabel = ENTITY_LABEL[item.entity_type] || item.entity_type;
  const actionLabel = ACTION_LABEL[item.action] || item.action;

  return (
    <div style={{ display: 'flex', gap: 12, padding: '13px 4px', borderBottom: '1px solid var(--border-subtle)' }}>
      <div style={{ width: 32, height: 32, flex: 'none', borderRadius: '50%', background: 'var(--blue-600)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>
        {initials(actorName)}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-body)', lineHeight: 1.5 }}>
          <strong style={{ color: 'var(--text-strong)', fontWeight: 'var(--fw-semibold)' }}>{actorName}</strong>
          {' '}{actionLabel}{' '}
          <Badge tone={tone} size="sm" style={{ display: 'inline-flex', verticalAlign: 'middle' }}>
            <Icon name={icon} size={11} style={{ marginRight: 4 }} />{entityLabel}
          </Badge>
          {item.entity_name && <span style={{ fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)' }}> "{item.entity_name}"</span>}
        </div>
      </div>
      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-subtle)', whiteSpace: 'nowrap', flex: 'none' }}>{fmtWhen(item.created_at)}</span>
    </div>
  );
}

function ActivityLog() {
  useLucide();
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [filter, setFilter] = React.useState('');

  const load = React.useCallback(() => {
    if (!window.API) { setLoading(false); return; }
    setLoading(true);
    window.API.getActivityLog({ entityType: filter || undefined, limit: 150 })
      .then(r => { if (r.data) setItems(r.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [filter]);

  React.useEffect(() => { load(); }, [load]);

  const entityTypes = Object.keys(ENTITY_LABEL);

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--fw-extrabold)', letterSpacing: '-0.02em' }}>Activity Log</h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 2 }}>Recent actions across your workspace</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <select value={filter} onChange={e => setFilter(e.target.value)}
            style={{ height: 34, padding: '0 10px', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', color: 'var(--text-body)', background: 'var(--slate-0)', cursor: 'pointer', outline: 'none' }}>
            <option value="">All activity</option>
            {entityTypes.map(t => <option key={t} value={t}>{ENTITY_LABEL[t]}s</option>)}
          </select>
          <button onClick={load} title="Refresh" style={{ width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--slate-0)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <Icon name="refresh-cw" size={15} />
          </button>
        </div>
      </div>

      <Card padding="md">
        {loading && <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>Loading activity…</div>}
        {!loading && items.length === 0 && (
          <div style={{ padding: '48px 24px', textAlign: 'center' }}>
            <Icon name="activity" size={32} style={{ color: 'var(--text-subtle)', marginBottom: 10 }} />
            <div style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)' }}>No activity yet</div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 4 }}>Actions like creating tasks, projects, or docs will show up here.</div>
          </div>
        )}
        {!loading && items.map(item => <ActivityRow key={item.id} item={item} />)}
      </Card>
    </div>
  );
}
Object.assign(window, { ActivityLog });
})();
