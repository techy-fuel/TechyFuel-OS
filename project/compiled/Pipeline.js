import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    return /*#__PURE__*/_jsxs("div", {
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
      },
      children: [/*#__PURE__*/_jsxs("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 8
        },
        children: [/*#__PURE__*/_jsx("span", {
          style: {
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--fw-bold)',
            color: 'var(--text-strong)'
          },
          children: d.co
        }), d.hot && /*#__PURE__*/_jsx(Icon, {
          name: "flame",
          size: 14,
          style: {
            color: 'var(--red-500)'
          }
        })]
      }), /*#__PURE__*/_jsx("div", {
        style: {
          fontSize: 'var(--text-lg)',
          fontWeight: 'var(--fw-extrabold)',
          color: 'var(--blue-600)',
          letterSpacing: '-0.02em',
          fontVariantNumeric: 'tabular-nums',
          marginBottom: 9
        },
        children: d.val
      }), /*#__PURE__*/_jsxs("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        },
        children: [/*#__PURE__*/_jsx(Badge, {
          tone: "neutral",
          size: "sm",
          children: d.tag
        }), /*#__PURE__*/_jsx(Avatar, {
          name: d.who,
          size: "xs"
        })]
      })]
    });
  }
  function Pipeline() {
    return /*#__PURE__*/_jsxs("div", {
      style: {
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        boxSizing: 'border-box'
      },
      children: [/*#__PURE__*/_jsxs("div", {
        style: {
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: 18,
          flexWrap: 'wrap',
          gap: 12
        },
        children: [/*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsx("h1", {
            style: {
              fontSize: 'var(--text-3xl)',
              fontWeight: 'var(--fw-extrabold)',
              letterSpacing: '-0.02em'
            },
            children: "Sales pipeline"
          }), /*#__PURE__*/_jsx("p", {
            style: {
              fontSize: 'var(--text-sm)',
              color: 'var(--text-muted)',
              marginTop: 2
            },
            children: "8 open deals · $119.6K weighted value"
          })]
        }), /*#__PURE__*/_jsxs("button", {
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
          },
          children: [/*#__PURE__*/_jsx(Icon, {
            name: "plus",
            size: 16
          }), " Add deal"]
        })]
      }), /*#__PURE__*/_jsx("div", {
        className: "tf-scroll",
        style: {
          flex: 1,
          display: 'flex',
          gap: 14,
          overflowX: 'auto',
          paddingBottom: 8,
          alignItems: 'flex-start'
        },
        children: STAGES.map(s => {
          const total = s.deals.reduce((a, d) => a + parseFloat(d.val.replace(/[$K]/g, '')), 0);
          return /*#__PURE__*/_jsxs("div", {
            style: {
              width: 230,
              flex: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: 10
            },
            children: [/*#__PURE__*/_jsxs("div", {
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '2px 4px'
              },
              children: [/*#__PURE__*/_jsx("span", {
                style: {
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: s.dot
                }
              }), /*#__PURE__*/_jsx("span", {
                style: {
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--fw-bold)',
                  color: 'var(--text-strong)'
                },
                children: s.label
              }), /*#__PURE__*/_jsxs("span", {
                style: {
                  fontSize: 'var(--text-2xs)',
                  fontWeight: 'var(--fw-bold)',
                  color: 'var(--text-muted)',
                  marginLeft: 'auto',
                  fontVariantNumeric: 'tabular-nums'
                },
                children: ["$", total, "K"]
              })]
            }), /*#__PURE__*/_jsx("div", {
              style: {
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                background: 'var(--slate-100)',
                borderRadius: 'var(--radius-xl)',
                padding: 10,
                minHeight: 100
              },
              children: s.deals.map((d, i) => /*#__PURE__*/_jsx(Deal, {
                d: d
              }, i))
            })]
          }, s.id);
        })
      })]
    });
  }
  Object.assign(window, {
    Pipeline
  });
})();