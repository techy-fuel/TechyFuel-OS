// Executive Dashboard screen.
(() => {
  const {
    StatCard,
    Card,
    Badge,
    Avatar,
    AvatarGroup,
    ProgressBar
  } = window.TechyFuelOSDesignSystem_be0222;
  const TF_REVENUE = [22, 26, 24, 31, 29, 35, 38, 36, 42, 40, 45, 48.2];
  const TF_CLIENTS_CHART = [9, 11, 12, 14, 15, 18, 19, 22, 24, 26, 29, 32];
  function SectionHead({
    title,
    action
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement("h3", {
      style: {
        fontSize: 'var(--text-lg)',
        fontWeight: 'var(--fw-bold)'
      }
    }, title), action);
  }
  function LinkBtn({
    children
  }) {
    return /*#__PURE__*/React.createElement("button", {
      style: {
        background: 'none',
        border: 'none',
        color: 'var(--text-link)',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-semibold)',
        cursor: 'pointer',
        padding: 0
      }
    }, children);
  }
  const TF_ACTIVITY = [{
    who: 'Sara Khan',
    action: 'approved the homepage design for',
    target: 'Nova Skincare',
    time: '12m',
    icon: 'check',
    tone: 'success'
  }, {
    who: 'Ali Raza',
    action: 'uploaded new creatives to',
    target: 'Nova Tech',
    time: '48m',
    icon: 'upload',
    tone: 'brand'
  }, {
    who: 'Hina Malik',
    action: 'scheduled 3 posts for',
    target: 'Bloom Foods',
    time: '2h',
    icon: 'calendar',
    tone: 'violet'
  }, {
    who: 'AI Assistant',
    action: 'flagged a deadline risk on',
    target: 'Apex Lead Gen Ads',
    time: '3h',
    icon: 'sparkles',
    tone: 'warning'
  }, {
    who: 'Omar Sheikh',
    action: 'completed wireframes for',
    target: 'Nova Website Revamp',
    time: '5h',
    icon: 'check',
    tone: 'success'
  }];
  function ActivityRow({
    a
  }) {
    const tones = {
      success: ['var(--green-50)', 'var(--green-600)'],
      brand: ['var(--blue-50)', 'var(--blue-600)'],
      violet: ['var(--violet-50)', 'var(--violet-600)'],
      warning: ['var(--amber-50)', 'var(--amber-600)']
    };
    const [bg, fg] = tones[a.tone] || tones.brand;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 11,
        padding: '10px 0',
        borderBottom: '1px solid var(--border-subtle)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 30,
        height: 30,
        flex: 'none',
        borderRadius: 'var(--radius-md)',
        background: bg,
        color: fg,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: a.icon,
      size: 15
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        fontSize: 'var(--text-sm)',
        color: 'var(--text-body)',
        lineHeight: 1.45
      }
    }, /*#__PURE__*/React.createElement("strong", {
      style: {
        color: 'var(--text-strong)',
        fontWeight: 'var(--fw-semibold)'
      }
    }, a.who), " ", a.action, " ", /*#__PURE__*/React.createElement("strong", {
      style: {
        color: 'var(--text-strong)',
        fontWeight: 'var(--fw-semibold)'
      }
    }, a.target)), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-xs)',
        color: 'var(--text-subtle)',
        whiteSpace: 'nowrap'
      }
    }, a.time));
  }
  function fmtMoney(n) {
    if (!n) return '$0';
    if (n >= 1000) return '$' + (n / 1000).toFixed(1) + 'K';
    return '$' + n;
  }
  function fmtDueDate(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diff = Math.round((d - today) / 86400000);
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Tomorrow';
    return d.toLocaleDateString('en', {
      month: 'short',
      day: 'numeric'
    });
  }
  const FALLBACK_DEADLINES = [{
    project: 'Apex Lead Gen Ads',
    client: 'Apex Realty',
    due: 'Jun 28',
    urgent: false,
    pct: 82,
    team: ['Sara Khan', 'Ali Raza']
  }, {
    project: 'Nova Launch Campaign',
    client: 'Nova Tech',
    due: 'Jul 15',
    urgent: false,
    pct: 65,
    team: ['Zara Ahmed']
  }];
  function Dashboard() {
    const [stats, setStats] = React.useState({
      activeClients: 0,
      activeProjects: 0,
      openTasks: 0,
      revenue: 0
    });
    const [deadlines, setDeadlines] = React.useState(FALLBACK_DEADLINES);
    const [loaded, setLoaded] = React.useState(false);
    const [clients, setClients] = React.useState([]);
    const [modalOpen, setModalOpen] = React.useState(false);
    const [saving, setSaving] = React.useState(false);
    const [form, setForm] = React.useState({
      name: '',
      client_id: '',
      budget: '',
      due_date: '',
      priority: 'medium',
      status: 'active'
    });
    function set(k, v) {
      setForm(f => ({
        ...f,
        [k]: v
      }));
    }
    React.useEffect(() => {
      if (!window.API) return;
      window.API.getDashboardStats().then(s => {
        if (s) {
          setStats(s);
          setLoaded(true);
        }
      }).catch(() => {});
      window.API.getTasks().then(r => {
        if (!r.data) return;
        const upcoming = r.data.filter(t => t.due_date && t.status !== 'done').sort((a, b) => new Date(a.due_date) - new Date(b.due_date)).slice(0, 4).map(t => ({
          project: t.title,
          client: t.clients ? t.clients.name : t.projects ? t.projects.name : '',
          due: fmtDueDate(t.due_date),
          urgent: new Date(t.due_date) < new Date(),
          pct: t.projects ? t.projects.progress || 50 : 50,
          team: t.team_members ? [t.team_members.name] : []
        }));
        if (upcoming.length > 0) setDeadlines(upcoming);
      }).catch(() => {});
      window.API.getClients().then(r => {
        if (r.data) setClients(r.data);
      }).catch(() => {});
    }, []);
    async function handleNewProject() {
      if (!form.name.trim()) return;
      setSaving(true);
      try {
        const payload = {
          name: form.name,
          status: form.status,
          priority: form.priority
        };
        if (form.client_id) payload.client_id = form.client_id;
        if (form.budget) payload.budget = Number(form.budget);
        if (form.due_date) payload.due_date = form.due_date;
        if (window.API) await window.API.createProject(payload);
        setModalOpen(false);
        setForm({
          name: '',
          client_id: '',
          budget: '',
          due_date: '',
          priority: 'medium',
          status: 'active'
        });
        if (window.TFNavigate) window.TFNavigate('projects');
      } finally {
        setSaving(false);
      }
    }
    const revenueDisplay = loaded ? fmtMoney(stats.revenue) : '$12,400';
    const projectsDisplay = loaded ? String(stats.activeProjects) : '5';
    const tasksDisplay = loaded ? String(stats.openTasks) : '6';
    const clientsDisplay = loaded ? String(stats.activeClients) : '4';
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 24,
        maxWidth: 1280,
        margin: '0 auto'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginBottom: 20,
        flexWrap: 'wrap',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-2xs)',
        fontWeight: 'var(--fw-bold)',
        letterSpacing: 'var(--tracking-caps)',
        textTransform: 'uppercase',
        color: 'var(--text-muted)',
        marginBottom: 4
      }
    }, "Good morning, Sara"), /*#__PURE__*/React.createElement("h1", {
      style: {
        fontSize: 'var(--text-3xl)',
        fontWeight: 'var(--fw-extrabold)',
        letterSpacing: '-0.02em'
      }
    }, "Executive dashboard")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        height: 36,
        padding: '0 12px',
        background: 'var(--slate-0)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-md)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-semibold)',
        color: 'var(--text-body)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "calendar",
      size: 16,
      style: {
        color: 'var(--text-muted)'
      }
    }), " This month ", /*#__PURE__*/React.createElement(Icon, {
      name: "chevron-down",
      size: 15,
      style: {
        color: 'var(--text-subtle)'
      }
    })), /*#__PURE__*/React.createElement("button", {
      onClick: () => setModalOpen(true),
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        height: 36,
        padding: '0 14px',
        background: 'var(--blue-600)',
        color: '#fff',
        border: 'none',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-brand)',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-semibold)',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "plus",
      size: 16
    }), " New project"))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 16,
        marginBottom: 16
      }
    }, /*#__PURE__*/React.createElement(StatCard, {
      label: "Revenue (paid)",
      value: revenueDisplay,
      delta: "12.5%",
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "dollar-sign"
      }),
      tone: "success"
    }), /*#__PURE__*/React.createElement(StatCard, {
      label: "Active projects",
      value: projectsDisplay,
      delta: "4.0%",
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "folder-kanban"
      }),
      tone: "brand"
    }), /*#__PURE__*/React.createElement(StatCard, {
      label: "Open tasks",
      value: tasksDisplay,
      delta: "-3.1%",
      deltaDirection: "down",
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "circle-check-big"
      }),
      tone: "warning"
    }), /*#__PURE__*/React.createElement(StatCard, {
      label: "Active clients",
      value: clientsDisplay,
      delta: "6.2%",
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "users"
      }),
      tone: "violet"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: 16,
        marginBottom: 16
      }
    }, /*#__PURE__*/React.createElement(Card, {
      padding: "lg"
    }, /*#__PURE__*/React.createElement(SectionHead, {
      title: "Revenue growth",
      action: /*#__PURE__*/React.createElement(Badge, {
        tone: "success",
        dot: true
      }, "+24% YTD")
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'baseline',
        gap: 10,
        marginBottom: 10
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-3xl)',
        fontWeight: 'var(--fw-extrabold)',
        letterSpacing: '-0.02em',
        fontVariantNumeric: 'tabular-nums'
      }
    }, "$432.6K"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-sm)',
        color: 'var(--text-muted)'
      }
    }, "last 12 months")), /*#__PURE__*/React.createElement(AreaLine, {
      data: TF_REVENUE,
      id: "rev"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: 8,
        fontSize: 'var(--text-2xs)',
        color: 'var(--text-subtle)'
      }
    }, /*#__PURE__*/React.createElement("span", null, "Jul"), /*#__PURE__*/React.createElement("span", null, "Sep"), /*#__PURE__*/React.createElement("span", null, "Nov"), /*#__PURE__*/React.createElement("span", null, "Jan"), /*#__PURE__*/React.createElement("span", null, "Mar"), /*#__PURE__*/React.createElement("span", null, "May"))), /*#__PURE__*/React.createElement(Card, {
      padding: "lg"
    }, /*#__PURE__*/React.createElement(SectionHead, {
      title: "Project status"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement(Donut, {
      segments: [{
        value: 11,
        color: 'var(--blue-600)'
      }, {
        value: 7,
        color: 'var(--sky-500)'
      }, {
        value: 5,
        color: 'var(--violet-500)'
      }, {
        value: 4,
        color: 'var(--green-500)'
      }]
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        flex: 1
      }
    }, [['In progress', 11, 'var(--blue-600)'], ['Review', 7, 'var(--sky-500)'], ['Client approval', 5, 'var(--violet-500)'], ['Completed', 4, 'var(--green-500)']].map(([l, n, c]) => /*#__PURE__*/React.createElement("div", {
      key: l,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontSize: 'var(--text-sm)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 9,
        height: 9,
        borderRadius: 3,
        background: c,
        flex: 'none'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        color: 'var(--text-body)'
      }
    }, l), /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 'var(--fw-bold)',
        color: 'var(--text-strong)',
        fontVariantNumeric: 'tabular-nums'
      }
    }, n))))))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement(Card, {
      padding: "lg"
    }, /*#__PURE__*/React.createElement(SectionHead, {
      title: "Recent activity",
      action: /*#__PURE__*/React.createElement(LinkBtn, null, "View all")
    }), /*#__PURE__*/React.createElement("div", null, TF_ACTIVITY.map((a, i) => /*#__PURE__*/React.createElement(ActivityRow, {
      key: i,
      a: a
    })))), /*#__PURE__*/React.createElement(Card, {
      padding: "lg"
    }, /*#__PURE__*/React.createElement(SectionHead, {
      title: "Upcoming deadlines",
      action: /*#__PURE__*/React.createElement(LinkBtn, null, "Open calendar")
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 14
      }
    }, deadlines.map((d, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 7
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-semibold)',
        color: 'var(--text-strong)'
      }
    }, d.project), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-xs)',
        color: 'var(--text-muted)'
      }
    }, d.client)), /*#__PURE__*/React.createElement(AvatarGroup, {
      people: d.team,
      size: "xs",
      max: 3
    }), /*#__PURE__*/React.createElement(Badge, {
      tone: d.urgent ? 'danger' : 'neutral',
      dot: d.urgent
    }, d.due)), /*#__PURE__*/React.createElement(ProgressBar, {
      value: d.pct,
      tone: d.urgent ? 'warning' : 'brand',
      size: "sm"
    })))))), /*#__PURE__*/React.createElement(Modal, {
      open: modalOpen,
      onClose: () => setModalOpen(false),
      title: "New project",
      onSubmit: handleNewProject,
      loading: saving,
      submitLabel: "Create project"
    }, /*#__PURE__*/React.createElement(FormRow, {
      label: "Project name",
      required: true
    }, /*#__PURE__*/React.createElement("input", {
      style: FF.input,
      placeholder: "Project name…",
      value: form.name,
      onChange: e => set('name', e.target.value)
    })), /*#__PURE__*/React.createElement(FormRow, {
      label: "Client"
    }, /*#__PURE__*/React.createElement("select", {
      style: FF.select,
      value: form.client_id,
      onChange: e => set('client_id', e.target.value)
    }, /*#__PURE__*/React.createElement("option", {
      value: ""
    }, "No client"), clients.map(c => /*#__PURE__*/React.createElement("option", {
      key: c.id,
      value: c.id
    }, c.company || c.name)))), /*#__PURE__*/React.createElement("div", {
      style: FF.row2
    }, /*#__PURE__*/React.createElement(FormRow, {
      label: "Priority"
    }, /*#__PURE__*/React.createElement("select", {
      style: FF.select,
      value: form.priority,
      onChange: e => set('priority', e.target.value)
    }, /*#__PURE__*/React.createElement("option", {
      value: "low"
    }, "Low"), /*#__PURE__*/React.createElement("option", {
      value: "medium"
    }, "Medium"), /*#__PURE__*/React.createElement("option", {
      value: "high"
    }, "High"))), /*#__PURE__*/React.createElement(FormRow, {
      label: "Status"
    }, /*#__PURE__*/React.createElement("select", {
      style: FF.select,
      value: form.status,
      onChange: e => set('status', e.target.value)
    }, /*#__PURE__*/React.createElement("option", {
      value: "active"
    }, "Active"), /*#__PURE__*/React.createElement("option", {
      value: "paused"
    }, "Paused")))), /*#__PURE__*/React.createElement("div", {
      style: FF.row2
    }, /*#__PURE__*/React.createElement(FormRow, {
      label: "Budget ($)"
    }, /*#__PURE__*/React.createElement("input", {
      style: FF.input,
      type: "number",
      placeholder: "0",
      value: form.budget,
      onChange: e => set('budget', e.target.value)
    })), /*#__PURE__*/React.createElement(FormRow, {
      label: "Due date"
    }, /*#__PURE__*/React.createElement("input", {
      style: FF.input,
      type: "date",
      value: form.due_date,
      onChange: e => set('due_date', e.target.value)
    })))));
  }
  Object.assign(window, {
    Dashboard,
    TFSectionHead: SectionHead,
    TFLinkBtn: LinkBtn
  });
})();