import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Finance screen — revenue, profit, invoices.
(() => {
  const {
    Card,
    Badge,
    Avatar,
    StatCard
  } = window.TechyFuelOSDesignSystem_be0222;
  const PROFIT = [12, 14, 13, 17, 16, 19, 21, 20, 24, 23, 26, 29];
  const INVOICES = [{
    id: 'INV-2026-0481',
    client: 'Nova Skincare',
    amount: '$12,400',
    status: 'paid',
    due: 'Jun 30'
  }, {
    id: 'INV-2026-0480',
    client: 'Orbit Inc.',
    amount: '$28,900',
    status: 'sent',
    due: 'Jul 2'
  }, {
    id: 'INV-2026-0479',
    client: 'Mediva Health',
    amount: '$18,000',
    status: 'overdue',
    due: 'Jun 12'
  }, {
    id: 'INV-2026-0478',
    client: 'Peak Fitness',
    amount: '$9,200',
    status: 'paid',
    due: 'Jun 8'
  }, {
    id: 'INV-2026-0477',
    client: 'Verde Foods',
    amount: '$22,300',
    status: 'draft',
    due: '—'
  }];
  const IS = {
    paid: ['success', 'Paid'],
    sent: ['info', 'Sent'],
    overdue: ['danger', 'Overdue'],
    draft: ['neutral', 'Draft']
  };
  function Finance() {
    return /*#__PURE__*/_jsxs("div", {
      style: {
        padding: 24,
        maxWidth: 1280,
        margin: '0 auto'
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
            children: "Finance"
          }), /*#__PURE__*/_jsx("p", {
            style: {
              fontSize: 'var(--text-sm)',
              color: 'var(--text-muted)',
              marginTop: 2
            },
            children: "June 2026 · 5 invoices this cycle"
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
          }), " New invoice"]
        })]
      }), /*#__PURE__*/_jsxs("div", {
        style: {
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 16,
          marginBottom: 16
        },
        children: [/*#__PURE__*/_jsx(StatCard, {
          label: "Monthly revenue",
          value: "$48,250",
          delta: "12.5%",
          icon: /*#__PURE__*/_jsx(Icon, {
            name: "trending-up"
          }),
          tone: "success"
        }), /*#__PURE__*/_jsx(StatCard, {
          label: "Net profit",
          value: "$29,180",
          delta: "8.4%",
          icon: /*#__PURE__*/_jsx(Icon, {
            name: "piggy-bank"
          }),
          tone: "brand"
        }), /*#__PURE__*/_jsx(StatCard, {
          label: "Expenses",
          value: "$19,070",
          delta: "3.0%",
          deltaDirection: "down",
          icon: /*#__PURE__*/_jsx(Icon, {
            name: "credit-card"
          }),
          tone: "violet"
        }), /*#__PURE__*/_jsx(StatCard, {
          label: "Outstanding",
          value: "$46,900",
          delta: "—",
          icon: /*#__PURE__*/_jsx(Icon, {
            name: "receipt"
          }),
          tone: "warning"
        })]
      }), /*#__PURE__*/_jsxs("div", {
        style: {
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
          gap: 16
        },
        children: [/*#__PURE__*/_jsxs(Card, {
          padding: "lg",
          children: [/*#__PURE__*/_jsx("h3", {
            style: {
              fontSize: 'var(--text-lg)',
              fontWeight: 'var(--fw-bold)',
              marginBottom: 4
            },
            children: "Net profit"
          }), /*#__PURE__*/_jsxs("div", {
            style: {
              display: 'flex',
              alignItems: 'baseline',
              gap: 8,
              marginBottom: 12
            },
            children: [/*#__PURE__*/_jsx("span", {
              style: {
                fontSize: 'var(--text-2xl)',
                fontWeight: 'var(--fw-extrabold)',
                letterSpacing: '-0.02em',
                fontVariantNumeric: 'tabular-nums'
              },
              children: "$232K"
            }), /*#__PURE__*/_jsx("span", {
              style: {
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--fw-bold)',
                color: 'var(--green-600)'
              },
              children: "+18% YTD"
            })]
          }), /*#__PURE__*/_jsx(Bars, {
            data: PROFIT,
            color: "var(--green-500)",
            highlight: "var(--green-600)",
            height: 140
          })]
        }), /*#__PURE__*/_jsxs(Card, {
          padding: "none",
          children: [/*#__PURE__*/_jsxs("div", {
            style: {
              padding: '14px 18px',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            },
            children: [/*#__PURE__*/_jsx("h3", {
              style: {
                fontSize: 'var(--text-lg)',
                fontWeight: 'var(--fw-bold)'
              },
              children: "Invoices"
            }), /*#__PURE__*/_jsxs("span", {
              style: {
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--fw-semibold)',
                color: 'var(--text-body)'
              },
              children: [/*#__PURE__*/_jsx(Icon, {
                name: "download",
                size: 14
              }), " Export"]
            })]
          }), /*#__PURE__*/_jsxs("table", {
            style: {
              width: '100%',
              borderCollapse: 'collapse'
            },
            children: [/*#__PURE__*/_jsx("thead", {
              children: /*#__PURE__*/_jsx("tr", {
                children: ['Invoice', 'Client', 'Amount', 'Status', 'Due'].map((h, i) => /*#__PURE__*/_jsx("th", {
                  style: {
                    textAlign: i === 2 ? 'right' : 'left',
                    padding: '10px 18px',
                    fontSize: 'var(--text-2xs)',
                    fontWeight: 'var(--fw-bold)',
                    letterSpacing: 'var(--tracking-wide)',
                    textTransform: 'uppercase',
                    color: 'var(--text-subtle)'
                  },
                  children: h
                }, h))
              })
            }), /*#__PURE__*/_jsx("tbody", {
              children: INVOICES.map((inv, i) => {
                const [t, l] = IS[inv.status];
                return /*#__PURE__*/_jsxs("tr", {
                  style: {
                    borderTop: '1px solid var(--border-subtle)'
                  },
                  children: [/*#__PURE__*/_jsx("td", {
                    style: {
                      padding: '11px 18px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 'var(--text-xs)',
                      color: 'var(--text-body)'
                    },
                    children: inv.id
                  }), /*#__PURE__*/_jsx("td", {
                    style: {
                      padding: '11px 18px',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--fw-semibold)',
                      color: 'var(--text-strong)'
                    },
                    children: inv.client
                  }), /*#__PURE__*/_jsx("td", {
                    style: {
                      padding: '11px 18px',
                      textAlign: 'right',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--fw-bold)',
                      color: 'var(--text-strong)',
                      fontVariantNumeric: 'tabular-nums'
                    },
                    children: inv.amount
                  }), /*#__PURE__*/_jsx("td", {
                    style: {
                      padding: '11px 18px'
                    },
                    children: /*#__PURE__*/_jsx(Badge, {
                      tone: t,
                      dot: true,
                      children: l
                    })
                  }), /*#__PURE__*/_jsx("td", {
                    style: {
                      padding: '11px 18px',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--text-muted)'
                    },
                    children: inv.due
                  })]
                }, i);
              })
            })]
          })]
        })]
      })]
    });
  }
  Object.assign(window, {
    Finance
  });
})();