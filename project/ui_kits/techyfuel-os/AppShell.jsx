// App shell: left sidebar + glass top bar + content area.
(() => {
const { IconButton, Avatar, Badge } = window.TechyFuelOSDesignSystem_be0222;

const TF_NAV = [
  { group: 'Workspace', items: [
    { id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
    { id: 'tasks', label: 'Tasks', icon: 'circle-check-big', badge: '24' },
    { id: 'projects', label: 'Projects', icon: 'folder-kanban' },
    { id: 'calendar', label: 'Calendar', icon: 'calendar-days' },
  ]},
  { group: 'Clients', items: [
    { id: 'crm', label: 'Client CRM', icon: 'contact' },
    { id: 'pipeline', label: 'Sales pipeline', icon: 'filter' },
    { id: 'portal', label: 'Client portal', icon: 'panel-left-open' },
  ]},
  { group: 'Marketing', items: [
    { id: 'content', label: 'Content', icon: 'calendar-clock' },
    { id: 'ads', label: 'Meta Ads', icon: 'megaphone' },
  ]},
  { group: 'Business', items: [
    { id: 'finance', label: 'Finance', icon: 'wallet' },
    { id: 'reports', label: 'Reports', icon: 'chart-line' },
    { id: 'files', label: 'Files', icon: 'folder' },
    { id: 'team', label: 'Team', icon: 'users' },
    { id: 'settings', label: 'Settings', icon: 'settings' },
  ]},
];

function SidebarItem({ item, active, onClick }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left',
        padding: '8px 10px', borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer',
        fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', fontWeight: 'var(--fw-medium)',
        background: active ? 'var(--blue-50)' : hover ? 'var(--slate-100)' : 'transparent',
        color: active ? 'var(--blue-700)' : 'var(--text-body)',
        transition: 'background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)',
      }}
    >
      <Icon name={item.icon} size={18} style={{ color: active ? 'var(--blue-600)' : 'var(--text-muted)' }} />
      <span style={{ flex: 1 }}>{item.label}</span>
      {item.badge && (
        <span style={{ fontSize: 'var(--text-2xs)', fontWeight: 'var(--fw-bold)', color: active ? 'var(--blue-700)' : 'var(--text-muted)',
          background: active ? 'var(--blue-100)' : 'var(--slate-150)', borderRadius: 'var(--radius-full)', padding: '1px 7px', fontVariantNumeric: 'tabular-nums' }}>
          {item.badge}
        </span>
      )}
    </button>
  );
}

function Sidebar({ active, onNavigate }) {
  return (
    <aside style={{
      width: 'var(--sidebar-width)', flex: 'none', height: '100%', boxSizing: 'border-box',
      background: 'var(--slate-0)', borderRight: '1px solid var(--border-subtle)',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Brand */}
      <div style={{ height: 'var(--topbar-height)', display: 'flex', alignItems: 'center', gap: 9, padding: '0 16px', borderBottom: '1px solid var(--border-subtle)' }}>
        <img src="../../assets/techyfuel-mark.png" alt="" style={{ height: 26 }} />
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 'var(--fw-extrabold)', fontSize: 'var(--text-lg)', letterSpacing: '-0.02em', color: 'var(--text-strong)' }}>
          TechyFuel<span style={{ color: 'var(--blue-600)' }}> OS</span>
        </span>
      </div>
      {/* Nav */}
      <nav className="tf-scroll" style={{ flex: 1, overflowY: 'auto', padding: '12px 12px 8px' }}>
        {TF_NAV.map(section => (
          <div key={section.group} style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 'var(--text-2xs)', fontWeight: 'var(--fw-bold)', letterSpacing: 'var(--tracking-caps)', textTransform: 'uppercase', color: 'var(--text-subtle)', padding: '0 10px 6px' }}>
              {section.group}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {section.items.map(it => (
                <SidebarItem key={it.id} item={it} active={active === it.id} onClick={() => onNavigate(it.id)} />
              ))}
            </div>
          </div>
        ))}
      </nav>
      {/* Workspace footer */}
      <div style={{ padding: 12, borderTop: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 'var(--radius-md)', background: 'var(--slate-50)' }}>
          <Avatar name="Bright Pixel" size="sm" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Bright Pixel Co.</div>
            <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' }}>Pro · 14 seats</div>
          </div>
          <Icon name="chevrons-up-down" size={16} style={{ color: 'var(--text-subtle)' }} />
        </div>
      </div>
    </aside>
  );
}

function TopBar({ title, crumb, onOpenAI }) {
  return (
    <header style={{
      height: 'var(--topbar-height)', flex: 'none', display: 'flex', alignItems: 'center', gap: 16,
      padding: '0 24px', boxSizing: 'border-box',
      background: 'var(--glass-bg-strong)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-subtle)', position: 'sticky', top: 0, zIndex: 20,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>{crumb}</span>
        <Icon name="chevron-right" size={15} style={{ color: 'var(--text-subtle)' }} />
        <span style={{ fontSize: 'var(--text-md)', fontWeight: 'var(--fw-bold)', color: 'var(--text-strong)', letterSpacing: '-0.01em' }}>{title}</span>
      </div>
      <div style={{ flex: 1 }} />
      {/* Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: 280, maxWidth: '32vw', height: 36, padding: '0 12px',
        background: 'var(--slate-50)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)' }}>
        <Icon name="search" size={16} style={{ color: 'var(--text-subtle)' }} />
        <span style={{ flex: 1, fontSize: 'var(--text-sm)', color: 'var(--text-subtle)' }}>Search or ask AI…</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: 'var(--text-subtle)', background: 'var(--slate-0)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-xs)', padding: '1px 5px' }}>⌘K</span>
      </div>
      <button onClick={onOpenAI} style={{
        display: 'inline-flex', alignItems: 'center', gap: 7, height: 36, padding: '0 13px', borderRadius: 'var(--radius-md)',
        background: 'var(--grad-brand)', color: '#fff', border: 'none', cursor: 'pointer', boxShadow: 'var(--shadow-brand)',
        fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)' }}>
        <Icon name="sparkles" size={16} /> Ask AI
      </button>
      <IconButton label="Notifications" variant="ghost"><Icon name="bell" size={18} /></IconButton>
      <Avatar name="Sara Khan" status="online" />
    </header>
  );
}

function AppShell({ active, onNavigate, title, crumb, onOpenAI, children }) {
  useLucide();
  return (
    <div style={{ display: 'flex', height: '100%', width: '100%', background: 'var(--surface-page)' }}>
      <Sidebar active={active} onNavigate={onNavigate} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, height: '100%' }}>
        <TopBar title={title} crumb={crumb} onOpenAI={onOpenAI} />
        <main className="tf-scroll" style={{ flex: 1, overflowY: 'auto' }}>{children}</main>
      </div>
    </div>
  );
}

Object.assign(window, { AppShell, Sidebar, TopBar });
})();
