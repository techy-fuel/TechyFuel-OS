// Projects screen — project cards grid.
(() => {
  const {
    Card,
    Badge,
    AvatarGroup,
    ProgressBar
  } = window.TechyFuelOSDesignSystem_be0222;
  const PS = {
    active: ['info', 'In progress'],
    paused: ['neutral', 'Paused'],
    completed: ['success', 'Completed'],
    archived: ['neutral', 'Archived']
  };
  const PRIORITY_TONE = {
    high: 'danger',
    medium: 'warning',
    low: 'neutral'
  };
  const FALLBACK = [{
    id: 'f1',
    name: 'Nova Launch Campaign',
    clients: {
      name: 'Nova Tech'
    },
    status: 'active',
    priority: 'high',
    due_date: '2025-07-15',
    budget: 8000,
    spent: 5200,
    progress: 65
  }, {
    id: 'f2',
    name: 'Bloom Social Relaunch',
    clients: {
      name: 'Bloom Foods'
    },
    status: 'active',
    priority: 'medium',
    due_date: '2025-07-30',
    budget: 3500,
    spent: 1200,
    progress: 34
  }, {
    id: 'f3',
    name: 'Apex Lead Gen Ads',
    clients: {
      name: 'Apex Realty'
    },
    status: 'active',
    priority: 'high',
    due_date: '2025-06-28',
    budget: 5000,
    spent: 4100,
    progress: 82
  }, {
    id: 'f4',
    name: 'Spark Content Strategy',
    clients: {
      name: 'Spark Academy'
    },
    status: 'paused',
    priority: 'low',
    due_date: '2025-08-10',
    budget: 2000,
    spent: 400,
    progress: 20
  }, {
    id: 'f5',
    name: 'Nova Website Revamp',
    clients: {
      name: 'Nova Tech'
    },
    status: 'active',
    priority: 'medium',
    due_date: '2025-08-01',
    budget: 6000,
    spent: 1000,
    progress: 17
  }];
  function fmtBudget(n) {
    if (!n) return '$0';
    if (n >= 1000) return '$' + (n / 1000).toFixed(1) + 'K';
    return '$' + n;
  }
  function fmtDue(ds) {
    if (!ds) return '—';
    return new Date(ds).toLocaleDateString('en', {
      month: 'short',
      day: 'numeric'
    });
  }
  function spentPct(budget, spent) {
    if (!budget || !spent) return 0;
    return Math.round(spent / budget * 100);
  }
  function ProjectCard({
    p
  }) {
    const [st, sl] = PS[p.status] || ['neutral', p.status];
    const pct = p.progress || 0;
    const budgetPct = spentPct(p.budget, p.spent);
    const clientName = p.clients ? p.clients.name : '—';
    const due = fmtDue(p.due_date);
    return /*#__PURE__*/React.createElement(Card, {
      interactive: true,
      padding: "md",
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-md)',
        fontWeight: 'var(--fw-bold)',
        color: 'var(--text-strong)',
        letterSpacing: '-0.01em'
      }
    }, p.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-xs)',
        color: 'var(--text-muted)',
        marginTop: 2
      }
    }, clientName)), /*#__PURE__*/React.createElement(Icon, {
      name: "more-horizontal",
      size: 18,
      style: {
        color: 'var(--text-subtle)',
        cursor: 'pointer',
        flex: 'none'
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: PRIORITY_TONE[p.priority] || 'neutral',
      size: "sm"
    }, p.priority), /*#__PURE__*/React.createElement(Badge, {
      tone: st,
      dot: true
    }, sl)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: 'var(--text-xs)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--text-muted)',
        fontWeight: 'var(--fw-semibold)'
      }
    }, "Progress"), /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--text-strong)',
        fontWeight: 'var(--fw-bold)'
      }
    }, pct, "%")), /*#__PURE__*/React.createElement(ProgressBar, {
      value: pct,
      tone: p.status === 'completed' ? 'success' : 'brand',
      size: "sm"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 12,
        borderTop: '1px solid var(--border-subtle)'
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-2xs)',
        color: 'var(--text-subtle)',
        textTransform: 'uppercase',
        letterSpacing: 'var(--tracking-wide)',
        fontWeight: 'var(--fw-bold)'
      }
    }, "Budget · ", budgetPct, "% used"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-bold)',
        color: 'var(--text-strong)',
        fontVariantNumeric: 'tabular-nums'
      }
    }, fmtBudget(p.budget))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        fontSize: 'var(--text-xs)',
        color: 'var(--text-muted)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "calendar",
      size: 13
    }), " ", due))));
  }
  function Projects() {
    const [projects, setProjects] = React.useState(FALLBACK);
    const [activeCount, setActiveCount] = React.useState(FALLBACK.filter(p => p.status === 'active').length);
    const [totalBudget, setTotalBudget] = React.useState(FALLBACK.reduce((s, p) => s + (p.budget || 0), 0));
    React.useEffect(() => {
      if (!window.API) return;
      window.API.getProjects().then(r => {
        if (r.data && r.data.length > 0) {
          setProjects(r.data);
          setActiveCount(r.data.filter(p => p.status === 'active').length);
          setTotalBudget(r.data.reduce((s, p) => s + (p.budget || 0), 0));
        }
      }).catch(() => {});
    }, []);
    function fmtTotal(n) {
      if (n >= 1000) return '$' + (n / 1000).toFixed(1) + 'K';
      return '$' + n;
    }
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
        marginBottom: 18,
        flexWrap: 'wrap',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
      style: {
        fontSize: 'var(--text-3xl)',
        fontWeight: 'var(--fw-extrabold)',
        letterSpacing: '-0.02em'
      }
    }, "Projects"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 'var(--text-sm)',
        color: 'var(--text-muted)',
        marginTop: 2
      }
    }, activeCount, " active · ", fmtTotal(totalBudget), " in committed budget")), /*#__PURE__*/React.createElement("button", {
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
    }), " New project")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 16
      }
    }, projects.map((p, i) => /*#__PURE__*/React.createElement(ProjectCard, {
      key: p.id || i,
      p: p
    }))));
  }
  Object.assign(window, {
    Projects
  });
})();