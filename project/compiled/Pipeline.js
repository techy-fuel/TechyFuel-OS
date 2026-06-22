// Sales pipeline screen — deal kanban.
(() => {
  const {
    Card,
    Badge,
    Avatar
  } = window.TechyFuelOSDesignSystem_be0222;
  const STAGES = [{
    id: 'new',
    label: 'New lead',
    dot: 'var(--slate-400)',
    deals: [{
      co: 'Bright Studio',
      val: '$8K',
      who: 'Tom Reed',
      tag: 'Inbound'
    }, {
      co: 'Kite Apparel',
      val: '$5K',
      who: 'Tom Reed',
      tag: 'Instagram'
    }]
  }, {
    id: 'contacted',
    label: 'Contacted',
    dot: 'var(--blue-500)',
    deals: [{
      co: 'Mediva Health',
      val: '$18K',
      who: 'Sara Khan',
      tag: 'LinkedIn'
    }]
  }, {
    id: 'discovery',
    label: 'Discovery call',
    dot: 'var(--sky-500)',
    deals: [{
      co: 'Atlas Realty',
      val: '$15K',
      who: 'Tom Reed',
      tag: 'Referral'
    }, {
      co: 'Lumen Cafe',
      val: '$6.5K',
      who: 'Lena Cruz',
      tag: 'Cold'
    }]
  }, {
    id: 'proposal',
    label: 'Proposal sent',
    dot: 'var(--violet-500)',
    deals: [{
      co: 'Orbit Inc.',
      val: '$28.9K',
      who: 'Sara Khan',
      tag: 'Inbound',
      hot: true
    }]
  }, {
    id: 'negotiation',
    label: 'Negotiation',
    dot: 'var(--amber-500)',
    deals: [{
      co: 'Verde Foods',
      val: '$22.3K',
      who: 'Tom Reed',
      tag: 'Referral',
      hot: true
    }]
  }, {
    id: 'won',
    label: 'Won',
    dot: 'var(--green-500)',
    deals: [{
      co: 'Nova Skincare',
      val: '$12.4K',
      who: 'Sara Khan',
      tag: 'Referral'
    }]
  }];
  function Deal({
    d
  }) {
    const [h, sh] = React.useState(false);
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
        marginBottom: 8
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-bold)',
        color: 'var(--text-strong)'
      }
    }, d.co), d.hot && /*#__PURE__*/React.createElement(Icon, {
      name: "flame",
      size: 14,
      style: {
        color: 'var(--red-500)'
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-lg)',
        fontWeight: 'var(--fw-extrabold)',
        color: 'var(--blue-600)',
        letterSpacing: '-0.02em',
        fontVariantNumeric: 'tabular-nums',
        marginBottom: 9
      }
    }, d.val), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: "neutral",
      size: "sm"
    }, d.tag), /*#__PURE__*/React.createElement(Avatar, {
      name: d.who,
      size: "xs"
    })));
  }
  function Pipeline() {
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
    }, "8 open deals · $119.6K weighted value")), /*#__PURE__*/React.createElement("button", {
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
    }, STAGES.map(s => {
      const total = s.deals.reduce((a, d) => a + parseFloat(d.val.replace(/[$K]/g, '')), 0);
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
      }, "$", total, "K")), /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          background: 'var(--slate-100)',
          borderRadius: 'var(--radius-xl)',
          padding: 10,
          minHeight: 100
        }
      }, s.deals.map((d, i) => /*#__PURE__*/React.createElement(Deal, {
        key: i,
        d: d
      }))));
    })));
  }
  Object.assign(window, {
    Pipeline
  });
})();