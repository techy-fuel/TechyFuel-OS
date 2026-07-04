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
    children,
    onClick
  }) {
    return /*#__PURE__*/React.createElement("button", {
      onClick: onClick,
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

  // Home/reporting currency is PKR — getDashboardStats() already converts
  // every invoice into PKR (via live FX rates) before summing, regardless of
  // what currency the client actually paid in.
  function fmtMoney(n) {
    if (!n) return '₨0';
    if (n >= 1000000) return '₨' + (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return '₨' + (n / 1000).toFixed(1) + 'K';
    return '₨' + Math.round(n);
  }
  function fxToPKR(amount, currency, rates) {
    const n = Number(amount);
    if (!n) return 0;
    if (!currency || currency === 'PKR') return n;
    if (!rates) return 0;
    const usd = currency === 'USD' ? n : rates[currency] ? n / rates[currency] : null;
    if (usd === null) return 0;
    return rates.PKR ? usd * rates.PKR : 0;
  }
  const PERIODS = [{
    id: 'month',
    label: 'This month'
  }, {
    id: 'last_month',
    label: 'Last month'
  }, {
    id: 'quarter',
    label: 'This quarter'
  }, {
    id: 'year',
    label: 'This year'
  }, {
    id: 'all',
    label: 'All time'
  }];
  function fmtDueDate(ds) {
    if (!ds) return '—';
    const d = new Date(ds);
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
  function fmtWhen(ds) {
    if (!ds) return '';
    const diff = Math.round((Date.now() - new Date(ds)) / 60000);
    if (diff < 60) return diff + 'm ago';
    if (diff < 1440) return Math.round(diff / 60) + 'h ago';
    return Math.round(diff / 1440) + 'd ago';
  }
  const STATUS_TONE = {
    todo: 'brand',
    in_progress: 'brand',
    review: 'warning',
    done: 'success',
    backlog: 'neutral'
  };
  const STATUS_ICON = {
    todo: 'circle',
    in_progress: 'loader',
    review: 'eye',
    done: 'check',
    backlog: 'inbox'
  };
  const STATUS_BG = {
    todo: ['var(--blue-50)', 'var(--blue-600)'],
    in_progress: ['var(--violet-50)', 'var(--violet-600)'],
    review: ['var(--amber-50)', 'var(--amber-600)'],
    done: ['var(--green-50)', 'var(--green-600)'],
    backlog: ['var(--slate-100)', 'var(--slate-500)']
  };
  function ActivityRow({
    item
  }) {
    const [bg, fg] = STATUS_BG[item.status] || STATUS_BG.todo;
    const icon = STATUS_ICON[item.status] || 'activity';
    const label = item.status === 'in_progress' ? 'In progress' : item.status === 'done' ? 'Completed' : item.status === 'review' ? 'In review' : item.status || 'Task';
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
      name: icon,
      size: 15
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        fontSize: 'var(--text-sm)',
        color: 'var(--text-body)',
        lineHeight: 1.45,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("strong", {
      style: {
        color: 'var(--text-strong)',
        fontWeight: 'var(--fw-semibold)'
      }
    }, item.title), item.project && /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--text-muted)'
      }
    }, " · ", item.project), item.assignee && /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--text-subtle)',
        fontSize: 'var(--text-xs)'
      }
    }, " — ", item.assignee)), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-xs)',
        color: 'var(--text-subtle)',
        whiteSpace: 'nowrap'
      }
    }, fmtWhen(item.created_at)));
  }

  // ── Member dashboard — only their own tasks/projects/chat, no company-wide
  //    figures (revenue, client list, other people's work) ──────────────────
  function MemberDashboard() {
    useLucide();
    const [greeting, setGreeting] = React.useState((window.TFMyName || '').split(' ')[0] || '');
    const [myTasks, setMyTasks] = React.useState([]);
    const [unread, setUnread] = React.useState(0);
    const [loading, setLoading] = React.useState(true);
    React.useEffect(() => {
      if (!window.API) {
        setLoading(false);
        return;
      }
      const myId = window.TFMyMemberId;
      (async () => {
        try {
          const r = await window.API.getTasks({
            assignedTo: myId
          });
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
    if (loading) return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 48,
        textAlign: 'center',
        color: 'var(--text-muted)'
      }
    }, "Loading…");
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 24,
        maxWidth: 1100,
        margin: '0 auto'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: 20
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-2xs)',
        fontWeight: 'var(--fw-bold)',
        letterSpacing: 'var(--tracking-caps)',
        textTransform: 'uppercase',
        color: 'var(--text-muted)',
        marginBottom: 4
      }
    }, greeting ? `Good morning, ${greeting}` : 'Good morning'), /*#__PURE__*/React.createElement("h1", {
      style: {
        fontSize: 'var(--text-3xl)',
        fontWeight: 'var(--fw-extrabold)',
        letterSpacing: '-0.02em'
      }
    }, "My dashboard")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 16,
        marginBottom: 16
      }
    }, /*#__PURE__*/React.createElement(StatCard, {
      label: "Open tasks",
      value: String(openTasks.length),
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "circle-check-big"
      }),
      tone: "brand"
    }), /*#__PURE__*/React.createElement(StatCard, {
      label: "Overdue",
      value: String(overdue.length),
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "alert-circle"
      }),
      tone: overdue.length ? 'danger' : 'neutral'
    }), /*#__PURE__*/React.createElement(StatCard, {
      label: "Completed",
      value: String(doneTasks.length),
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "check"
      }),
      tone: "success"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement(Card, {
      padding: "lg"
    }, /*#__PURE__*/React.createElement(SectionHead, {
      title: "My timeline",
      action: /*#__PURE__*/React.createElement(LinkBtn, {
        onClick: () => window.TFNavigate && window.TFNavigate('tasks')
      }, "View all tasks")
    }), upcoming.length === 0 ? /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '32px 0',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: 'var(--text-sm)'
      }
    }, "No upcoming tasks — you're all caught up!") : /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }
    }, upcoming.slice(0, 8).map(t => {
      const isOverdue = new Date(t.due_date) < new Date();
      return /*#__PURE__*/React.createElement("div", {
        key: t.id,
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          paddingBottom: 12,
          borderBottom: '1px solid var(--border-subtle)'
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          width: 30,
          height: 30,
          flex: 'none',
          borderRadius: 'var(--radius-md)',
          background: isOverdue ? 'var(--red-50)' : 'var(--blue-50)',
          color: isOverdue ? 'var(--red-600)' : 'var(--blue-600)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center'
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: isOverdue ? 'alert-circle' : 'circle',
        size: 15
      })), /*#__PURE__*/React.createElement("div", {
        style: {
          flex: 1,
          minWidth: 0
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--fw-semibold)',
          color: 'var(--text-strong)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }
      }, t.title), t.projects?.name && /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 'var(--text-xs)',
          color: 'var(--text-muted)'
        }
      }, t.projects.name)), /*#__PURE__*/React.createElement(Badge, {
        tone: isOverdue ? 'danger' : 'neutral'
      }, fmtDueDate(t.due_date)));
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement(Card, {
      padding: "lg"
    }, /*#__PURE__*/React.createElement(SectionHead, {
      title: "My projects"
    }), myProjects.length === 0 ? /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '16px 0',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: 'var(--text-sm)'
      }
    }, "No projects yet") : /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }
    }, myProjects.map((p, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      onClick: () => window.TFNavigate && window.TFNavigate('projects'),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 0',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "folder-kanban",
      size: 16,
      style: {
        color: 'var(--blue-600)'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-semibold)',
        color: 'var(--text-strong)'
      }
    }, p.name))))), /*#__PURE__*/React.createElement(Card, {
      padding: "lg"
    }, /*#__PURE__*/React.createElement(SectionHead, {
      title: "Team Chat"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-sm)',
        color: 'var(--text-muted)'
      }
    }, unread > 0 ? `${unread} unread message${unread === 1 ? '' : 's'}` : 'All caught up'), /*#__PURE__*/React.createElement(LinkBtn, {
      onClick: () => window.TFNavigate && window.TFNavigate('chat')
    }, "Open chat"))))));
  }
  const TODAY_KEY = new Date().toISOString().slice(0, 10);
  function DailyBriefing({
    briefing,
    onDismiss,
    onOpenAI
  }) {
    if (!briefing) return null;
    const {
      overdueTasks,
      dueTodayTasks,
      overdueInvoices,
      overdueInvoiceTotal,
      weekDeadlines
    } = briefing;
    const nothingUrgent = overdueTasks === 0 && dueTodayTasks === 0 && overdueInvoices === 0;
    const lines = [];
    if (overdueTasks > 0) lines.push({
      icon: 'alert-circle',
      color: 'var(--red-600)',
      text: `${overdueTasks} task${overdueTasks === 1 ? '' : 's'} overdue`
    });
    if (dueTodayTasks > 0) lines.push({
      icon: 'clock',
      color: 'var(--amber-600)',
      text: `${dueTodayTasks} task${dueTodayTasks === 1 ? '' : 's'} due today`
    });
    if (overdueInvoices > 0) lines.push({
      icon: 'wallet',
      color: 'var(--red-600)',
      text: `${overdueInvoices} invoice${overdueInvoices === 1 ? '' : 's'} overdue (${fmtMoney(overdueInvoiceTotal)})`
    });
    if (weekDeadlines > 0) lines.push({
      icon: 'calendar-days',
      color: 'var(--blue-600)',
      text: `${weekDeadlines} deadline${weekDeadlines === 1 ? '' : 's'} this week`
    });
    return /*#__PURE__*/React.createElement(Card, {
      padding: "lg",
      style: {
        marginBottom: 16,
        background: 'var(--grad-brand-soft, linear-gradient(135deg, var(--blue-50), var(--slate-0)))',
        border: '1px solid var(--blue-100)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 38,
        height: 38,
        flexShrink: 0,
        borderRadius: 'var(--radius-lg)',
        background: 'var(--blue-600)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "sparkles",
      size: 18,
      style: {
        color: '#fff'
      }
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-base)',
        fontWeight: 'var(--fw-bold)',
        color: 'var(--text-strong)',
        marginBottom: 4
      }
    }, "Today's briefing"), nothingUrgent ? /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-sm)',
        color: 'var(--text-muted)'
      }
    }, "Nothing urgent — everything's on track. 🎉") : /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '6px 18px'
      }
    }, lines.map((l, i) => /*#__PURE__*/React.createElement("span", {
      key: i,
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-semibold)',
        color: 'var(--text-body)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: l.icon,
      size: 14,
      style: {
        color: l.color
      }
    }), " ", l.text))))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        flexShrink: 0
      }
    }, !nothingUrgent && /*#__PURE__*/React.createElement("button", {
      onClick: onOpenAI,
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        height: 30,
        padding: '0 10px',
        background: 'var(--slate-0)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-md)',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--fw-semibold)',
        color: 'var(--text-body)',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "message-circle",
      size: 13
    }), " Ask AI what to prioritize"), /*#__PURE__*/React.createElement("button", {
      onClick: onDismiss,
      title: "Dismiss for today",
      style: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: 'var(--text-muted)',
        padding: 4,
        display: 'flex'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "x",
      size: 16
    })))));
  }
  function ExecutiveDashboard() {
    useLucide();
    const [stats, setStats] = React.useState({
      activeClients: 0,
      activeProjects: 0,
      openTasks: 0,
      revenue: 0
    });
    const [deadlines, setDeadlines] = React.useState([]);
    const [activity, setActivity] = React.useState([]);
    const [tasksByStatus, setTasksByStatus] = React.useState({
      todo: 0,
      in_progress: 0,
      review: 0,
      done: 0
    });
    const [greeting, setGreeting] = React.useState('');
    const [clients, setClients] = React.useState([]);
    const [modalOpen, setModalOpen] = React.useState(false);
    const [saving, setSaving] = React.useState(false);
    const [statsLoaded, setStatsLoaded] = React.useState(false);
    const [form, setForm] = React.useState({
      name: '',
      client_id: '',
      budget: '',
      due_date: '',
      priority: 'medium',
      status: 'active'
    });
    const [period, setPeriod] = React.useState('month');
    const [periodOpen, setPeriodOpen] = React.useState(false);
    const periodRef = React.useRef(null);
    const [briefing, setBriefing] = React.useState(null);
    const [briefingDismissed, setBriefingDismissed] = React.useState(() => localStorage.getItem('tf_briefing_dismissed') === TODAY_KEY);
    function set(k, v) {
      setForm(f => ({
        ...f,
        [k]: v
      }));
    }
    React.useEffect(() => {
      function onClickOutside(e) {
        if (periodRef.current && !periodRef.current.contains(e.target)) setPeriodOpen(false);
      }
      document.addEventListener('mousedown', onClickOutside);
      return () => document.removeEventListener('mousedown', onClickOutside);
    }, []);

    // Revenue is the only figure that's period-scoped — refetch it whenever
    // the period picker changes.
    React.useEffect(() => {
      if (!window.API) return;
      (async () => {
        try {
          const s = await window.API.getDashboardStats(period);
          if (s) {
            setStats(s);
            setStatsLoaded(true);
          }
        } catch {}
      })();
    }, [period]);
    React.useEffect(() => {
      if (!window.API) return;
      (async () => {
        try {
          const r = await window.API.getTasks();
          if (r.data) {
            const upcoming = r.data.filter(t => t.due_date && t.status !== 'done').sort((a, b) => new Date(a.due_date) - new Date(b.due_date)).slice(0, 4).map(t => ({
              project: t.title,
              client: t.clients ? t.clients.name : t.projects ? t.projects.name : '',
              due: fmtDueDate(t.due_date),
              urgent: new Date(t.due_date) < new Date(),
              pct: 50,
              team: t.team_members ? [t.team_members.name] : []
            }));
            setDeadlines(upcoming);
            const counts = {
              todo: 0,
              in_progress: 0,
              review: 0,
              done: 0
            };
            r.data.forEach(t => {
              if (counts[t.status] !== undefined) counts[t.status]++;
            });
            setTasksByStatus(counts);
            const recent = [...r.data].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5).map(t => ({
              id: t.id,
              title: t.title,
              status: t.status,
              project: t.projects?.name || '',
              assignee: t.team_members?.name || '',
              created_at: t.created_at
            }));
            setActivity(recent);
            const today0 = new Date();
            today0.setHours(0, 0, 0, 0);
            const weekAhead = new Date(today0.getTime() + 7 * 86400000);
            const openTasksWithDue = r.data.filter(t => t.status !== 'done' && t.due_date);
            const overdueTasks = openTasksWithDue.filter(t => new Date(t.due_date) < today0).length;
            const dueTodayTasks = openTasksWithDue.filter(t => {
              const d = new Date(t.due_date);
              d.setHours(0, 0, 0, 0);
              return d.getTime() === today0.getTime();
            }).length;
            const weekDeadlines = openTasksWithDue.filter(t => {
              const d = new Date(t.due_date);
              return d >= today0 && d <= weekAhead;
            }).length;
            let overdueInvoices = 0,
              overdueInvoiceTotal = 0;
            try {
              const invRes = await window.API.getInvoices();
              const fx = window.API.getFxRates ? await window.API.getFxRates().catch(() => null) : null;
              const rates = fx && fx.rates;
              (invRes.data || []).filter(inv => inv.status !== 'paid' && inv.status !== 'cancelled' && inv.due_date && new Date(inv.due_date) < today0).forEach(inv => {
                overdueInvoices++;
                overdueInvoiceTotal += fxToPKR(inv.amount, inv.currency, rates);
              });
            } catch {}
            setBriefing({
              overdueTasks,
              dueTodayTasks,
              weekDeadlines,
              overdueInvoices,
              overdueInvoiceTotal
            });
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
    function dismissBriefing() {
      localStorage.setItem('tf_briefing_dismissed', TODAY_KEY);
      setBriefingDismissed(true);
    }
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
    const revenueDisplay = fmtMoney(stats.revenue);
    const totalTasks = Object.values(tasksByStatus).reduce((s, n) => s + n, 0);
    const donutSegments = [{
      value: tasksByStatus.in_progress || 0,
      color: 'var(--blue-600)'
    }, {
      value: tasksByStatus.review || 0,
      color: 'var(--sky-500)'
    }, {
      value: tasksByStatus.todo || 0,
      color: 'var(--violet-500)'
    }, {
      value: tasksByStatus.done || 0,
      color: 'var(--green-500)'
    }];
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
    }, greeting ? `Good morning, ${greeting}` : 'Good morning'), /*#__PURE__*/React.createElement("h1", {
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
      ref: periodRef,
      style: {
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => setPeriodOpen(o => !o),
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        height: 36,
        padding: '0 12px',
        background: 'var(--slate-0)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-md)',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-semibold)',
        color: 'var(--text-body)',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "calendar",
      size: 16,
      style: {
        color: 'var(--text-muted)'
      }
    }), " ", (PERIODS.find(p => p.id === period) || PERIODS[0]).label, " ", /*#__PURE__*/React.createElement(Icon, {
      name: "chevron-down",
      size: 15,
      style: {
        color: 'var(--text-subtle)'
      }
    })), periodOpen && /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 'calc(100% + 6px)',
        left: 0,
        zIndex: 200,
        background: 'var(--slate-0)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-xl)',
        minWidth: 160,
        overflow: 'hidden'
      }
    }, PERIODS.map(p => /*#__PURE__*/React.createElement("div", {
      key: p.id,
      onClick: () => {
        setPeriod(p.id);
        setPeriodOpen(false);
      },
      style: {
        padding: '9px 14px',
        fontSize: 'var(--text-sm)',
        fontWeight: p.id === period ? 'var(--fw-bold)' : 'var(--fw-medium)',
        color: p.id === period ? 'var(--blue-600)' : 'var(--text-body)',
        background: p.id === period ? 'var(--blue-50)' : 'transparent',
        cursor: 'pointer'
      },
      onMouseEnter: e => {
        if (p.id !== period) e.currentTarget.style.background = 'var(--slate-50)';
      },
      onMouseLeave: e => {
        if (p.id !== period) e.currentTarget.style.background = 'transparent';
      }
    }, p.label)))), /*#__PURE__*/React.createElement("button", {
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
    }), " New project"))), !briefingDismissed && /*#__PURE__*/React.createElement(DailyBriefing, {
      briefing: briefing,
      onDismiss: dismissBriefing,
      onOpenAI: () => window.TFOpenAI && window.TFOpenAI()
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 16,
        marginBottom: 16
      }
    }, /*#__PURE__*/React.createElement(StatCard, {
      label: "Revenue (paid, PKR)",
      value: revenueDisplay,
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "dollar-sign"
      }),
      tone: "success"
    }), /*#__PURE__*/React.createElement(StatCard, {
      label: "Active projects",
      value: String(stats.activeProjects),
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "folder-kanban"
      }),
      tone: "brand"
    }), /*#__PURE__*/React.createElement(StatCard, {
      label: "Open tasks",
      value: String(stats.openTasks),
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "circle-check-big"
      }),
      tone: "warning"
    }), /*#__PURE__*/React.createElement(StatCard, {
      label: "Active clients",
      value: String(stats.activeClients),
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
      title: "Revenue (paid invoices)"
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
    }, revenueDisplay), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-sm)',
        color: 'var(--text-muted)'
      }
    }, "collected · ", (PERIODS.find(p => p.id === period) || PERIODS[0]).label.toLowerCase())), statsLoaded && stats.revenue === 0 ? /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '32px 0',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: 'var(--text-sm)'
      }
    }, "No paid invoices yet") : /*#__PURE__*/React.createElement(AreaLine, {
      data: [1, 1, 2, 2, 3, 3, 4, 5, 6, 7, 8, stats.revenue ? Math.round(stats.revenue / 1000) : 10],
      id: "rev"
    })), /*#__PURE__*/React.createElement(Card, {
      padding: "lg"
    }, /*#__PURE__*/React.createElement(SectionHead, {
      title: "Tasks by status"
    }), totalTasks === 0 ? /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '32px 0',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: 'var(--text-sm)'
      }
    }, "No tasks yet") : /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement(Donut, {
      segments: donutSegments,
      label: totalTasks
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        flex: 1
      }
    }, [['In progress', tasksByStatus.in_progress, 'var(--blue-600)'], ['Review', tasksByStatus.review, 'var(--sky-500)'], ['Todo', tasksByStatus.todo, 'var(--violet-500)'], ['Done', tasksByStatus.done, 'var(--green-500)']].map(([l, n, c]) => /*#__PURE__*/React.createElement("div", {
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
      title: "Recent tasks"
    }), activity.length === 0 ? /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '32px 0',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: 'var(--text-sm)'
      }
    }, "No tasks yet") : /*#__PURE__*/React.createElement("div", null, activity.map((a, i) => /*#__PURE__*/React.createElement(ActivityRow, {
      key: i,
      item: a
    })))), /*#__PURE__*/React.createElement(Card, {
      padding: "lg"
    }, /*#__PURE__*/React.createElement(SectionHead, {
      title: "Upcoming deadlines",
      action: /*#__PURE__*/React.createElement(LinkBtn, {
        onClick: () => window.TFNavigate && window.TFNavigate('calendar')
      }, "Open calendar")
    }), deadlines.length === 0 ? /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '32px 0',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: 'var(--text-sm)'
      }
    }, "No upcoming deadlines") : /*#__PURE__*/React.createElement("div", {
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
        color: 'var(--text-strong)',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }
    }, d.project), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-xs)',
        color: 'var(--text-muted)'
      }
    }, d.client)), /*#__PURE__*/React.createElement(Badge, {
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

  // Members get their own personalized view (no company-wide revenue/client
  // figures); everyone else gets the full executive dashboard.
  function Dashboard() {
    return window.TFMyRole === 'member' ? /*#__PURE__*/React.createElement(MemberDashboard, null) : /*#__PURE__*/React.createElement(ExecutiveDashboard, null);
  }
  Object.assign(window, {
    Dashboard,
    TFSectionHead: SectionHead,
    TFLinkBtn: LinkBtn
  });
})();