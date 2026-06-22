// Sales pipeline screen — deal kanban.
(() => {
  const {
    Card,
    Badge,
    Avatar
  } = window.TechyFuelOSDesignSystem_be0222;
  const STAGE_CONFIG = [{
    id: 'lead',
    label: 'New lead',
    dot: 'var(--slate-400)'
  }, {
    id: 'qualified',
    label: 'Qualified',
    dot: 'var(--blue-500)'
  }, {
    id: 'proposal',
    label: 'Proposal sent',
    dot: 'var(--violet-500)'
  }, {
    id: 'negotiation',
    label: 'Negotiation',
    dot: 'var(--amber-500)'
  }, {
    id: 'won',
    label: 'Won',
    dot: 'var(--green-500)'
  }, {
    id: 'lost',
    label: 'Lost',
    dot: 'var(--red-400)'
  }];
  const FALLBACK_DEALS = [{
    id: 'f1',
    title: 'Swift — Full Marketing Retainer',
    clients: {
      name: 'Swift Logistics'
    },
    value: 4800,
    stage: 'proposal',
    team_members: {
      name: 'Sara Khan'
    }
  }, {
    id: 'f2',
    title: 'Spark — Ads Management Upsell',
    clients: {
      name: 'Spark Academy'
    },
    value: 1200,
    stage: 'qualified',
    team_members: {
      name: 'Sara Khan'
    }
  }, {
    id: 'f3',
    title: 'Apex — Q3 Campaign Expansion',
    clients: {
      name: 'Apex Realty'
    },
    value: 3500,
    stage: 'negotiation',
    team_members: {
      name: 'Sara Khan'
    }
  }];
  function fmtVal(n) {
    if (!n) return '$0';
    if (n >= 1000) return '$' + (n / 1000).toFixed(1) + 'K';
    return '$' + n;
  }
  function Deal({
    d
  }) {
    const [h, sh] = React.useState(false);
    const clientName = d.clients ? d.clients.name : '—';
    const assignedName = d.team_members ? d.team_members.name : null;
    return /*#__PURE__*/React.createElement("div", {
      onMouseEnter: () => sh(true),
      onMouseLeave: () => sh(false),
      style: {
        background: 'var(--slate-0)',
        border: `1px solid ${h ? 'var(--slate-200)' : 'var(--border-subtle)'}`,
        borderRadius: 'var(--radius-lg)',
        padding: 11,
        boxShadow: h ? 'var(--shadow-md)' : 'var(--shadow-xs)',
        cursor: 'grab',
        transition: 'all var(--dur-fast) var(--ease-out)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 6
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-bold)',
        color: 'var(--text-strong)'
      }
    }, clientName), d.probability >= 80 && /*#__PURE__*/React.createElement(Icon, {
      name: "flame",
      size: 14,
      style: {
        color: 'var(--red-500)'
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-xs)',
        color: 'var(--text-muted)',
        marginBottom: 8,
        lineHeight: 1.3
      }
    }, d.title), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-lg)',
        fontWeight: 'var(--fw-extrabold)',
        color: 'var(--blue-600)',
        letterSpacing: '-0.02em',
        fontVariantNumeric: 'tabular-nums',
        marginBottom: 9
      }
    }, fmtVal(d.value)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }
    }, d.probability != null && /*#__PURE__*/React.createElement(Badge, {
      tone: "neutral",
      size: "sm"
    }, d.probability, "% prob."), assignedName && /*#__PURE__*/React.createElement(Avatar, {
      name: assignedName,
      size: "xs"
    })));
  }
  function Pipeline() {
    const [stageMap, setStageMap] = React.useState(() => {
      const m = {};
      STAGE_CONFIG.forEach(s => {
        m[s.id] = [];
      });
      FALLBACK_DEALS.forEach(d => {
        if (!m[d.stage]) m[d.stage] = [];
        m[d.stage].push(d);
      });
      return m;
    });
    const [totals, setTotals] = React.useState({
      count: FALLBACK_DEALS.length,
      value: FALLBACK_DEALS.reduce((s, d) => s + d.value, 0)
    });
    React.useEffect(() => {
      if (!window.API) return;
      window.API.getPipeline().then(r => {
        if (!r.data) return;
        const m = {};
        STAGE_CONFIG.forEach(s => {
          m[s.id] = [];
        });
        r.data.forEach(d => {
          const key = d.stage || 'lead';
          if (!m[key]) m[key] = [];
          m[key].push(d);
        });
        setStageMap(m);
        const openDeals = r.data.filter(d => d.stage !== 'won' && d.stage !== 'lost');
        setTotals({
          count: openDeals.length,
          value: openDeals.reduce((s, d) => s + (d.value || 0), 0)
        });
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
    }, "Sales pipeline"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 'var(--text-sm)',
        color: 'var(--text-muted)',
        marginTop: 2
      }
    }, totals.count, " open deals · ", fmtVal(totals.value), " weighted value")), /*#__PURE__*/React.createElement("button", {
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
    }), " Add deal")), /*#__PURE__*/React.createElement("div", {
      className: "tf-scroll",
      style: {
        flex: 1,
        display: 'flex',
        gap: 14,
        overflowX: 'auto',
        paddingBottom: 8,
        alignItems: 'flex-start'
      }
    }, STAGE_CONFIG.map(s => {
      const deals = stageMap[s.id] || [];
      const stageTotal = deals.reduce((a, d) => a + (d.value || 0), 0);
      return /*#__PURE__*/React.createElement("div", {
        key: s.id,
        style: {
          width: 230,
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
          background: s.dot
        }
      }), /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--fw-bold)',
          color: 'var(--text-strong)'
        }
      }, s.label), /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 'var(--text-2xs)',
          fontWeight: 'var(--fw-bold)',
          color: 'var(--text-muted)',
          marginLeft: 'auto',
          fontVariantNumeric: 'tabular-nums'
        }
      }, fmtVal(stageTotal))), /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          background: 'var(--slate-100)',
          borderRadius: 'var(--radius-xl)',
          padding: 10,
          minHeight: 100
        }
      }, deals.map((d, i) => /*#__PURE__*/React.createElement(Deal, {
        key: d.id || i,
        d: d
      }))));
    })));
  }
  Object.assign(window, {
    Pipeline
  });
})();