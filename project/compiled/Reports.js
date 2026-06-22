// Reports center screen.
(() => {
  const {
    Card,
    Badge,
    Avatar
  } = window.TechyFuelOSDesignSystem_be0222;
  const REPORTS = [{
    name: 'Client performance report',
    desc: 'Per-client retainer, deliverables & satisfaction',
    icon: 'users',
    tone: ['var(--blue-50)', 'var(--blue-600)'],
    runs: 'Auto · monthly'
  }, {
    name: 'Team productivity report',
    desc: 'Utilization, output and on-time delivery by member',
    icon: 'gauge',
    tone: ['var(--violet-50)', 'var(--violet-600)'],
    runs: 'Auto · weekly'
  }, {
    name: 'Revenue & profit report',
    desc: 'MRR, net profit, expenses and forecast',
    icon: 'trending-up',
    tone: ['var(--green-50)', 'var(--green-600)'],
    runs: 'Auto · monthly'
  }, {
    name: 'Ads performance report',
    desc: 'Spend, ROAS, CPL and leads across ad accounts',
    icon: 'megaphone',
    tone: ['var(--amber-50)', 'var(--amber-600)'],
    runs: 'Manual'
  }, {
    name: 'Project status report',
    desc: 'Milestones, budget burn and risk flags',
    icon: 'folder-kanban',
    tone: ['var(--teal-50)', 'var(--teal-600)'],
    runs: 'Auto · weekly'
  }, {
    name: 'Content engagement report',
    desc: 'Reach, engagement and best-performing posts',
    icon: 'heart',
    tone: ['var(--red-50)', 'var(--red-600)'],
    runs: 'Manual'
  }];
  function Reports() {
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
    }, "Reporting center"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 'var(--text-sm)',
        color: 'var(--text-muted)',
        marginTop: 2
      }
    }, "6 report templates · export to PDF or Excel")), /*#__PURE__*/React.createElement("button", {
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
    }), " Build report")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 16
      }
    }, REPORTS.map((r, i) => /*#__PURE__*/React.createElement(Card, {
      key: i,
      interactive: true,
      padding: "md",
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 42,
        height: 42,
        borderRadius: 'var(--radius-lg)',
        background: r.tone[0],
        color: r.tone[1],
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: r.icon,
      size: 21
    })), /*#__PURE__*/React.createElement(Badge, {
      tone: r.runs === 'Manual' ? 'neutral' : 'success',
      size: "sm"
    }, r.runs)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-md)',
        fontWeight: 'var(--fw-bold)',
        color: 'var(--text-strong)'
      }
    }, r.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-xs)',
        color: 'var(--text-muted)',
        marginTop: 4,
        lineHeight: 1.45
      }
    }, r.desc)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        paddingTop: 12,
        borderTop: '1px solid var(--border-subtle)'
      }
    }, /*#__PURE__*/React.createElement("button", {
      style: {
        flex: 1,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        height: 32,
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
      name: "file-text",
      size: 14,
      style: {
        color: 'var(--red-500)'
      }
    }), " PDF"), /*#__PURE__*/React.createElement("button", {
      style: {
        flex: 1,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        height: 32,
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
      name: "sheet",
      size: 14,
      style: {
        color: 'var(--green-600)'
      }
    }), " Excel"))))));
  }
  Object.assign(window, {
    Reports
  });
})();