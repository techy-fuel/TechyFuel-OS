// App shell: left sidebar + glass top bar + content area.
(() => {
  const {
    IconButton,
    Avatar,
    Badge
  } = window.TechyFuelOSDesignSystem_be0222;
  const TF_NAV = [{
    group: 'Workspace',
    items: [{
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'layout-dashboard'
    }, {
      id: 'tasks',
      label: 'Tasks',
      icon: 'circle-check-big'
    }, {
      id: 'projects',
      label: 'Projects',
      icon: 'folder-kanban'
    }, {
      id: 'calendar',
      label: 'Calendar',
      icon: 'calendar-days'
    }]
  }, {
    group: 'Clients',
    items: [{
      id: 'crm',
      label: 'Client CRM',
      icon: 'contact'
    }, {
      id: 'pipeline',
      label: 'Sales pipeline',
      icon: 'filter'
    }, {
      id: 'portal',
      label: 'Client portal',
      icon: 'panel-left-open'
    }]
  }, {
    group: 'Marketing',
    items: [{
      id: 'content',
      label: 'Content',
      icon: 'calendar-clock'
    }, {
      id: 'ads',
      label: 'Meta Ads',
      icon: 'megaphone'
    }]
  }, {
    group: 'Business',
    items: [{
      id: 'finance',
      label: 'Finance',
      icon: 'wallet'
    }, {
      id: 'reports',
      label: 'Reports',
      icon: 'chart-line'
    }, {
      id: 'docs',
      label: 'Docs & Files',
      icon: 'file-text'
    }, {
      id: 'team',
      label: 'Team',
      icon: 'users'
    }, {
      id: 'chat',
      label: 'Team Chat',
      icon: 'message-square'
    }, {
      id: 'automations',
      label: 'Automations',
      icon: 'zap'
    }, {
      id: 'settings',
      label: 'Settings',
      icon: 'settings'
    }]
  }];
  function readTFSettings() {
    try {
      return JSON.parse(localStorage.getItem('tf_settings') || '{}');
    } catch {
      return {};
    }
  }
  function SidebarItem({
    item,
    active,
    onClick
  }) {
    const [hover, setHover] = React.useState(false);
    return /*#__PURE__*/React.createElement("button", {
      onClick: onClick,
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => setHover(false),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        width: '100%',
        textAlign: 'left',
        padding: '8px 10px',
        borderRadius: 'var(--radius-md)',
        border: 'none',
        cursor: 'pointer',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-base)',
        fontWeight: 'var(--fw-medium)',
        background: active ? 'var(--blue-50)' : hover ? 'var(--slate-100)' : 'transparent',
        color: active ? 'var(--blue-700)' : 'var(--text-body)',
        transition: 'background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: item.icon,
      size: 18,
      style: {
        color: active ? 'var(--blue-600)' : 'var(--text-muted)'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1
      }
    }, item.label), item.badge && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-2xs)',
        fontWeight: 'var(--fw-bold)',
        color: active ? 'var(--blue-700)' : 'var(--text-muted)',
        background: active ? 'var(--blue-100)' : 'var(--slate-150)',
        borderRadius: 'var(--radius-full)',
        padding: '1px 7px',
        fontVariantNumeric: 'tabular-nums'
      }
    }, item.badge));
  }
  function Sidebar({
    active,
    onNavigate
  }) {
    const s0 = readTFSettings();
    const [agencyName, setAgencyName] = React.useState(s0.agencyName || '');
    const [logoUrl, setLogoUrl] = React.useState(s0.logoUrl || '');
    const [teamCount, setTeamCount] = React.useState(null);
    const [taskBadge, setTaskBadge] = React.useState(null);
    React.useEffect(() => {
      if (window.API) {
        (async () => {
          try {
            const {
              data: team
            } = await window.API.getTeam();
            if (Array.isArray(team)) setTeamCount(team.length);
          } catch {}
          try {
            const {
              data: tasks
            } = await window.API.getTasks();
            if (Array.isArray(tasks)) {
              const open = tasks.filter(t => t.status !== 'done' && t.status !== 'completed').length;
              setTaskBadge(open > 0 ? String(open) : null);
            }
          } catch {}
        })();
      }
      function onSettingsChange() {
        const s = readTFSettings();
        setAgencyName(s.agencyName || '');
        setLogoUrl(s.logoUrl || '');
      }
      window.addEventListener('tf-settings-saved', onSettingsChange);
      window.addEventListener('storage', onSettingsChange);
      return () => {
        window.removeEventListener('tf-settings-saved', onSettingsChange);
        window.removeEventListener('storage', onSettingsChange);
      };
    }, []);
    const displayName = agencyName || 'My Agency';
    const navWithBadge = TF_NAV.map(g => ({
      ...g,
      items: g.items.map(it => it.id === 'tasks' ? {
        ...it,
        badge: taskBadge || undefined
      } : it)
    }));
    return /*#__PURE__*/React.createElement("aside", {
      style: {
        width: 'var(--sidebar-width)',
        flex: 'none',
        height: '100%',
        boxSizing: 'border-box',
        background: 'var(--slate-0)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: 'var(--topbar-height)',
        display: 'flex',
        alignItems: 'center',
        gap: 9,
        padding: '0 16px',
        borderBottom: '1px solid var(--border-subtle)'
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: "../../assets/techyfuel-mark.png",
      alt: "",
      style: {
        height: 26
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 'var(--fw-extrabold)',
        fontSize: 'var(--text-lg)',
        letterSpacing: '-0.02em',
        color: 'var(--text-strong)'
      }
    }, "TechyFuel", /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--blue-600)'
      }
    }, " OS"))), /*#__PURE__*/React.createElement("nav", {
      className: "tf-scroll",
      style: {
        flex: 1,
        overflowY: 'auto',
        padding: '12px 12px 8px'
      }
    }, navWithBadge.map(section => /*#__PURE__*/React.createElement("div", {
      key: section.group,
      style: {
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-2xs)',
        fontWeight: 'var(--fw-bold)',
        letterSpacing: 'var(--tracking-caps)',
        textTransform: 'uppercase',
        color: 'var(--text-subtle)',
        padding: '0 10px 6px'
      }
    }, section.group), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }
    }, section.items.map(it => /*#__PURE__*/React.createElement(SidebarItem, {
      key: it.id,
      item: it,
      active: active === it.id,
      onClick: () => onNavigate(it.id)
    })))))), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 12,
        borderTop: '1px solid var(--border-subtle)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 10px',
        borderRadius: 'var(--radius-md)',
        background: 'var(--slate-50)'
      }
    }, logoUrl ? /*#__PURE__*/React.createElement("img", {
      src: logoUrl,
      alt: "logo",
      style: {
        width: 28,
        height: 28,
        borderRadius: 'var(--radius-sm)',
        objectFit: 'cover',
        flexShrink: 0
      }
    }) : /*#__PURE__*/React.createElement(Avatar, {
      name: displayName,
      size: "sm"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-semibold)',
        color: 'var(--text-strong)',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }, displayName), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-2xs)',
        color: 'var(--text-muted)'
      }
    }, teamCount !== null ? `${teamCount} team member${teamCount !== 1 ? 's' : ''}` : 'Loading…')), /*#__PURE__*/React.createElement(Icon, {
      name: "chevrons-up-down",
      size: 16,
      style: {
        color: 'var(--text-subtle)'
      }
    }))));
  }
  function TopBar({
    title,
    crumb,
    onOpenAI,
    onNavigate
  }) {
    const s0 = readTFSettings();
    const [agencyName, setAgencyName] = React.useState(s0.agencyName || '');
    const [notifOpen, setNotifOpen] = React.useState(false);
    const [avatarOpen, setAvatarOpen] = React.useState(false);
    const [notifs, setNotifs] = React.useState([]);
    const notifRef = React.useRef(null);
    const avatarRef = React.useRef(null);
    React.useEffect(() => {
      function onSettingsChange() {
        const s = readTFSettings();
        setAgencyName(s.agencyName || '');
      }
      window.addEventListener('tf-settings-saved', onSettingsChange);
      window.addEventListener('storage', onSettingsChange);
      return () => {
        window.removeEventListener('tf-settings-saved', onSettingsChange);
        window.removeEventListener('storage', onSettingsChange);
      };
    }, []);
    React.useEffect(() => {
      function onClickOutside(e) {
        if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
        if (avatarRef.current && !avatarRef.current.contains(e.target)) setAvatarOpen(false);
      }
      document.addEventListener('mousedown', onClickOutside);
      return () => document.removeEventListener('mousedown', onClickOutside);
    }, []);
    function openNotifs() {
      setNotifOpen(o => !o);
      setAvatarOpen(false);
      if (!notifOpen && window.API) {
        (async () => {
          try {
            const {
              data: tasks
            } = await window.API.getTasks();
            if (!Array.isArray(tasks)) return;
            const now = new Date();
            const items = tasks.filter(t => t.status !== 'done' && t.due_date).map(t => ({
              ...t,
              _overdue: new Date(t.due_date) < now
            })).filter(t => t._overdue || new Date(t.due_date) - now < 48 * 3600 * 1000).sort((a, b) => new Date(a.due_date) - new Date(b.due_date)).slice(0, 8);
            setNotifs(items);
          } catch {}
        })();
      }
    }
    const avatarName = agencyName || 'TF';
    const dropStyle = {
      position: 'absolute',
      top: 'calc(100% + 8px)',
      right: 0,
      zIndex: 200,
      background: 'var(--slate-0)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-xl)',
      minWidth: 260,
      overflow: 'hidden'
    };
    return /*#__PURE__*/React.createElement("header", {
      style: {
        height: 'var(--topbar-height)',
        flex: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '0 24px',
        boxSizing: 'border-box',
        background: 'var(--glass-bg-strong)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-subtle)',
        position: 'sticky',
        top: 0,
        zIndex: 20
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("span", {
      onClick: () => onNavigate && onNavigate('dashboard'),
      style: {
        fontSize: 'var(--text-sm)',
        color: 'var(--text-muted)',
        cursor: 'pointer'
      },
      onMouseEnter: e => e.target.style.color = 'var(--blue-600)',
      onMouseLeave: e => e.target.style.color = 'var(--text-muted)'
    }, crumb), /*#__PURE__*/React.createElement(Icon, {
      name: "chevron-right",
      size: 15,
      style: {
        color: 'var(--text-subtle)'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-md)',
        fontWeight: 'var(--fw-bold)',
        color: 'var(--text-strong)',
        letterSpacing: '-0.01em'
      }
    }, title)), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }), /*#__PURE__*/React.createElement("button", {
      onClick: onOpenAI,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        width: 280,
        maxWidth: '32vw',
        height: 36,
        padding: '0 12px',
        background: 'var(--slate-50)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
        fontFamily: 'var(--font-sans)',
        textAlign: 'left'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "search",
      size: 16,
      style: {
        color: 'var(--text-subtle)'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        fontSize: 'var(--text-sm)',
        color: 'var(--text-subtle)'
      }
    }, "Search or ask AI…"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-2xs)',
        color: 'var(--text-subtle)',
        background: 'var(--slate-0)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-xs)',
        padding: '1px 5px'
      }
    }, "⌘K")), /*#__PURE__*/React.createElement("button", {
      onClick: onOpenAI,
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        height: 36,
        padding: '0 13px',
        borderRadius: 'var(--radius-md)',
        background: 'var(--grad-brand)',
        color: '#fff',
        border: 'none',
        cursor: 'pointer',
        boxShadow: 'var(--shadow-brand)',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-semibold)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "sparkles",
      size: 16
    }), " Ask AI"), /*#__PURE__*/React.createElement("div", {
      ref: notifRef,
      style: {
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: openNotifs,
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 36,
        height: 36,
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
        background: notifOpen ? 'var(--slate-100)' : 'transparent',
        cursor: 'pointer',
        color: 'var(--text-body)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "bell",
      size: 18
    })), notifOpen && /*#__PURE__*/React.createElement("div", {
      style: dropStyle
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '12px 14px 8px',
        borderBottom: '1px solid var(--border-subtle)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-bold)',
        color: 'var(--text-strong)'
      }
    }, "Notifications"), notifs.length === 0 ? /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '20px 14px',
        fontSize: 'var(--text-sm)',
        color: 'var(--text-muted)',
        textAlign: 'center'
      }
    }, "No upcoming deadlines") : notifs.map(t => /*#__PURE__*/React.createElement("div", {
      key: t.id,
      onClick: () => {
        setNotifOpen(false);
        onNavigate && onNavigate('tasks');
      },
      style: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        padding: '10px 14px',
        borderBottom: '1px solid var(--border-subtle)',
        cursor: 'pointer',
        background: 'transparent'
      },
      onMouseEnter: e => e.currentTarget.style.background = 'var(--slate-50)',
      onMouseLeave: e => e.currentTarget.style.background = 'transparent'
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        marginTop: 2,
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: t._overdue ? 'var(--red-500)' : 'var(--amber-400)',
        flexShrink: 0
      }
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-medium)',
        color: 'var(--text-strong)'
      }
    }, t.title), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-xs)',
        color: t._overdue ? 'var(--red-500)' : 'var(--text-muted)',
        marginTop: 2
      }
    }, t._overdue ? 'Overdue · ' : 'Due · ', new Date(t.due_date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    }))))), /*#__PURE__*/React.createElement("div", {
      onClick: () => {
        setNotifOpen(false);
        onNavigate && onNavigate('tasks');
      },
      style: {
        padding: '10px 14px',
        fontSize: 'var(--text-xs)',
        color: 'var(--blue-600)',
        fontWeight: 'var(--fw-semibold)',
        cursor: 'pointer',
        textAlign: 'center'
      }
    }, "View all tasks →"))), /*#__PURE__*/React.createElement("div", {
      ref: avatarRef,
      style: {
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement("div", {
      onClick: () => {
        setAvatarOpen(o => !o);
        setNotifOpen(false);
      },
      style: {
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: avatarName,
      status: "online"
    })), avatarOpen && /*#__PURE__*/React.createElement("div", {
      style: {
        ...dropStyle,
        minWidth: 200
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '12px 14px',
        borderBottom: '1px solid var(--border-subtle)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-bold)',
        color: 'var(--text-strong)'
      }
    }, agencyName || 'My Agency'), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-xs)',
        color: 'var(--text-muted)',
        marginTop: 2
      }
    }, "Agency account")), [{
      label: 'Settings',
      icon: 'settings',
      screen: 'settings'
    }, {
      label: 'Team',
      icon: 'users',
      screen: 'team'
    }].map(item => /*#__PURE__*/React.createElement("div", {
      key: item.screen,
      onClick: () => {
        setAvatarOpen(false);
        onNavigate && onNavigate(item.screen);
      },
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '9px 14px',
        cursor: 'pointer',
        fontSize: 'var(--text-sm)',
        color: 'var(--text-body)'
      },
      onMouseEnter: e => e.currentTarget.style.background = 'var(--slate-50)',
      onMouseLeave: e => e.currentTarget.style.background = 'transparent'
    }, /*#__PURE__*/React.createElement(Icon, {
      name: item.icon,
      size: 15,
      style: {
        color: 'var(--text-muted)'
      }
    }), " ", item.label)))));
  }
  const FULL_HEIGHT_SCREENS = new Set(['chat', 'docs']);
  function AppShell({
    active,
    onNavigate,
    title,
    crumb,
    onOpenAI,
    children
  }) {
    useLucide();
    const fullH = FULL_HEIGHT_SCREENS.has(active);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        height: '100%',
        width: '100%',
        background: 'var(--surface-page)'
      }
    }, /*#__PURE__*/React.createElement(Sidebar, {
      active: active,
      onNavigate: onNavigate
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        height: '100%'
      }
    }, /*#__PURE__*/React.createElement(TopBar, {
      title: title,
      crumb: crumb,
      onOpenAI: onOpenAI,
      onNavigate: onNavigate
    }), /*#__PURE__*/React.createElement("main", {
      className: fullH ? '' : 'tf-scroll',
      style: {
        flex: 1,
        overflowY: fullH ? 'hidden' : 'auto',
        overflow: fullH ? 'hidden' : undefined
      }
    }, children)));
  }
  Object.assign(window, {
    AppShell,
    Sidebar,
    TopBar
  });
})();