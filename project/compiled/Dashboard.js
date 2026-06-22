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
  const TF_CLIENTS = [9, 11, 12, 14, 15, 18, 19, 22, 24, 26, 29, 32];
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
    who: 'Omar Ali',
    action: 'uploaded 6 reels to',
    target: 'Peak Fitness',
    time: '48m',
    icon: 'upload',
    tone: 'brand'
  }, {
    who: 'Lena Cruz',
    action: 'sent invoice INV-0481 to',
    target: 'Acme Studio',
    time: '2h',
    icon: 'receipt',
    tone: 'violet'
  }, {
    who: 'AI Assistant',
    action: 'flagged a deadline risk on',
    target: 'Orbit Web Build',
    time: '3h',
    icon: 'sparkles',
    tone: 'warning'
  }, {
    who: 'Tom Reed',
    action: 'won the deal with',
    target: 'Mediva Health',
    time: '5h',
    icon: 'trophy',
    tone: 'success'
  }];
  const TF_DEADLINES = [{
    project: 'Nova — launch campaign',
    client: 'Nova Skincare',
    due: 'Today',
    urgent: true,
    pct: 82,
    team: ['Sara Khan', 'Omar Ali']
  }, {
    project: 'Orbit — web build phase 2',
    client: 'Orbit Inc.',
    due: 'Tomorrow',
    pct: 64,
    team: ['Jay Park', 'Mia Wu', 'Tom Reed']
  }, {
    project: 'Peak — monthly content',
    client: 'Peak Fitness',
    due: 'Jun 24',
    pct: 45,
    team: ['Omar Ali', 'Lena Cruz']
  }, {
    project: 'Mediva — brand kit',
    client: 'Mediva Health',
    due: 'Jun 27',
    pct: 20,
    team: ['Sara Khan']
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
  function Dashboard() {
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
      label: "Monthly revenue",
      value: "$48,250",
      delta: "12.5%",
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "dollar-sign"
      }),
      tone: "success"
    }), /*#__PURE__*/React.createElement(StatCard, {
      label: "Active projects",
      value: "27",
      delta: "4.0%",
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "folder-kanban"
      }),
      tone: "brand"
    }), /*#__PURE__*/React.createElement(StatCard, {
      label: "Outstanding",
      value: "$9,420",
      delta: "-3.1%",
      deltaDirection: "down",
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "receipt"
      }),
      tone: "warning"
    }), /*#__PURE__*/React.createElement(StatCard, {
      label: "Active clients",
      value: "38",
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
    }, TF_DEADLINES.map((d, i) => /*#__PURE__*/React.createElement("div", {
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
    })))))));
  }
  Object.assign(window, {
    Dashboard,
    TFSectionHead: SectionHead,
    TFLinkBtn: LinkBtn
  });
})();