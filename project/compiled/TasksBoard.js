// Tasks — Kanban board screen.
(() => {
  const {
    Card,
    Badge,
    Avatar,
    AvatarGroup,
    Tabs
  } = window.TechyFuelOSDesignSystem_be0222;
  const TF_PRIORITY = {
    urgent: {
      color: 'var(--red-600)',
      bg: 'var(--red-50)',
      label: 'Urgent',
      icon: 'chevrons-up'
    },
    high: {
      color: 'var(--amber-600)',
      bg: 'var(--amber-50)',
      label: 'High',
      icon: 'chevron-up'
    },
    medium: {
      color: 'var(--blue-600)',
      bg: 'var(--blue-50)',
      label: 'Medium',
      icon: 'equal'
    },
    low: {
      color: 'var(--slate-500)',
      bg: 'var(--slate-100)',
      label: 'Low',
      icon: 'chevron-down'
    }
  };
  const COLUMN_CONFIG = [{
    id: 'backlog',
    label: 'Backlog',
    dot: 'var(--slate-400)',
    dbStatus: null
  }, {
    id: 'todo',
    label: 'To do',
    dot: 'var(--blue-500)',
    dbStatus: 'todo'
  }, {
    id: 'in_progress',
    label: 'In progress',
    dot: 'var(--violet-500)',
    dbStatus: 'in_progress'
  }, {
    id: 'review',
    label: 'Review',
    dot: 'var(--amber-500)',
    dbStatus: 'review'
  }, {
    id: 'done',
    label: 'Completed',
    dot: 'var(--green-500)',
    dbStatus: 'done'
  }];
  const FALLBACK_TASKS = {
    backlog: [],
    todo: [{
      id: 'f1',
      title: 'Write 30 captions',
      priority: 'medium',
      assigned_to_name: 'Zara Ahmed',
      due_date: '2025-07-01',
      project_name: 'Bloom Social Relaunch'
    }, {
      id: 'f2',
      title: 'Set up CMS',
      priority: 'low',
      assigned_to_name: 'Omar Sheikh',
      due_date: '2025-07-10',
      project_name: 'Nova Website Revamp'
    }],
    in_progress: [{
      id: 'f3',
      title: 'Finalise ad creatives',
      priority: 'high',
      assigned_to_name: 'Zara Ahmed',
      due_date: '2025-06-25',
      project_name: 'Nova Launch Campaign'
    }, {
      id: 'f4',
      title: 'Wireframes for homepage',
      priority: 'medium',
      assigned_to_name: 'Ali Raza',
      due_date: '2025-06-30',
      project_name: 'Nova Website Revamp'
    }],
    review: [{
      id: 'f5',
      title: 'Client approval — round 2',
      priority: 'high',
      assigned_to_name: 'Ali Raza',
      due_date: '2025-06-24',
      project_name: 'Nova Launch Campaign'
    }],
    done: [{
      id: 'f6',
      title: 'Launch Meta campaign',
      priority: 'high',
      assigned_to_name: 'Omar Sheikh',
      due_date: '2025-06-20',
      project_name: 'Apex Lead Gen Ads',
      done: true
    }]
  };
  function fmtDue(ds) {
    if (!ds) return '—';
    const d = new Date(ds);
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    const diff = Math.round((d - t) / 86400000);
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Tomorrow';
    return d.toLocaleDateString('en', {
      month: 'short',
      day: 'numeric'
    });
  }
  function TaskCard({
    task
  }) {
    const [hover, setHover] = React.useState(false);
    const p = TF_PRIORITY[task.priority] || TF_PRIORITY.medium;
    const dueStr = fmtDue(task.due_date);
    const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'done';
    return /*#__PURE__*/React.createElement("div", {
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => setHover(false),
      style: {
        background: 'var(--slate-0)',
        border: `1px solid ${hover ? 'var(--slate-200)' : 'var(--border-subtle)'}`,
        borderRadius: 'var(--radius-lg)',
        padding: 12,
        boxShadow: hover ? 'var(--shadow-md)' : 'var(--shadow-xs)',
        cursor: 'grab',
        transform: hover ? 'translateY(-1px)' : 'none',
        transition: 'all var(--dur-fast) var(--ease-out)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        marginBottom: 8
      }
    }, task.project_name && /*#__PURE__*/React.createElement(Badge, {
      tone: "neutral",
      size: "sm"
    }, task.project_name), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 2,
        fontSize: 'var(--text-2xs)',
        fontWeight: 'var(--fw-bold)',
        color: p.color,
        background: p.bg,
        borderRadius: 'var(--radius-full)',
        padding: '2px 7px'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: p.icon,
      size: 12
    }), " ", p.label)), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-semibold)',
        color: 'var(--text-strong)',
        lineHeight: 1.4,
        marginBottom: 10,
        textDecoration: task.done ? 'line-through' : 'none',
        opacity: task.done ? 0.6 : 1
      }
    }, task.title), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        color: 'var(--text-muted)',
        fontSize: 'var(--text-xs)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        color: isOverdue ? 'var(--red-600)' : 'var(--text-muted)',
        fontWeight: isOverdue ? 'var(--fw-bold)' : 'var(--fw-medium)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "calendar",
      size: 13
    }), " ", dueStr), /*#__PURE__*/React.createElement("div", {
      style: {
        marginLeft: 'auto'
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: task.assigned_to_name || '?',
      size: "xs"
    }))));
  }
  function TasksBoard() {
    const [taskMap, setTaskMap] = React.useState(FALLBACK_TASKS);
    const [totalOpen, setTotalOpen] = React.useState(5);
    React.useEffect(() => {
      if (!window.API) return;
      window.API.getTasks().then(r => {
        if (!r.data) return;
        const map = {
          backlog: [],
          todo: [],
          in_progress: [],
          review: [],
          done: []
        };
        r.data.forEach(t => {
          const key = t.status || 'todo';
          if (!map[key]) map[key] = [];
          map[key].push({
            id: t.id,
            title: t.title,
            priority: t.priority,
            due_date: t.due_date,
            status: t.status,
            done: t.status === 'done',
            assigned_to_name: t.team_members ? t.team_members.name : null,
            project_name: t.projects ? t.projects.name : null
          });
        });
        setTaskMap(map);
        const open = map.todo.length + map.in_progress.length + map.review.length + map.backlog.length;
        setTotalOpen(open);
      }).catch(() => {});
    }, []);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        boxSizing: 'border-box'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginBottom: 14,
        flexWrap: 'wrap',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
      style: {
        fontSize: 'var(--text-3xl)',
        fontWeight: 'var(--fw-extrabold)',
        letterSpacing: '-0.02em'
      }
    }, "Tasks"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 'var(--text-sm)',
        color: 'var(--text-muted)',
        marginTop: 2
      }
    }, "All projects · ", totalOpen, " open tasks")), /*#__PURE__*/React.createElement("button", {
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
    }), " Add task")), /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: 16
      }
    }, /*#__PURE__*/React.createElement(Tabs, {
      defaultValue: "kanban",
      tabs: [{
        id: 'list',
        label: 'List',
        icon: /*#__PURE__*/React.createElement(Icon, {
          name: "list",
          size: 16
        })
      }, {
        id: 'kanban',
        label: 'Board',
        icon: /*#__PURE__*/React.createElement(Icon, {
          name: "columns-3",
          size: 16
        }),
        count: totalOpen
      }, {
        id: 'calendar',
        label: 'Calendar',
        icon: /*#__PURE__*/React.createElement(Icon, {
          name: "calendar",
          size: 16
        })
      }]
    })), /*#__PURE__*/React.createElement("div", {
      className: "tf-scroll",
      style: {
        flex: 1,
        display: 'flex',
        gap: 14,
        overflowX: 'auto',
        paddingBottom: 8,
        alignItems: 'flex-start'
      }
    }, COLUMN_CONFIG.map(col => {
      const colTasks = taskMap[col.id] || [];
      return /*#__PURE__*/React.createElement("div", {
        key: col.id,
        style: {
          width: 268,
          flex: 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: 10
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '2px 4px'
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: col.dot
        }
      }), /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--fw-bold)',
          color: 'var(--text-strong)'
        }
      }, col.label), /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 'var(--text-xs)',
          fontWeight: 'var(--fw-bold)',
          color: 'var(--text-muted)',
          background: 'var(--slate-150)',
          borderRadius: 'var(--radius-full)',
          padding: '0px 7px',
          fontVariantNumeric: 'tabular-nums'
        }
      }, colTasks.length), /*#__PURE__*/React.createElement(Icon, {
        name: "plus",
        size: 15,
        style: {
          color: 'var(--text-subtle)',
          marginLeft: 'auto',
          cursor: 'pointer'
        }
      })), /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          background: 'var(--slate-100)',
          borderRadius: 'var(--radius-xl)',
          padding: 10,
          minHeight: 120
        }
      }, colTasks.map((t, i) => /*#__PURE__*/React.createElement(TaskCard, {
        key: t.id || i,
        task: t
      })), /*#__PURE__*/React.createElement("button", {
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          padding: '8px 0',
          background: 'transparent',
          border: '1px dashed var(--border-strong)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--text-xs)',
          fontWeight: 'var(--fw-semibold)',
          cursor: 'pointer'
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "plus",
        size: 14
      }), " Add task")));
    })));
  }
  Object.assign(window, {
    TasksBoard
  });
})();