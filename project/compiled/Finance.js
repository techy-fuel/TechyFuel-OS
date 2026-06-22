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
    }, "Finance"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 'var(--text-sm)',
        color: 'var(--text-muted)',
        marginTop: 2
      }
    }, "June 2026 · 5 invoices this cycle")), /*#__PURE__*/React.createElement("button", {
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
    }), " New invoice")), /*#__PURE__*/React.createElement("div", {
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
        name: "trending-up"
      }),
      tone: "success"
    }), /*#__PURE__*/React.createElement(StatCard, {
      label: "Net profit",
      value: "$29,180",
      delta: "8.4%",
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "piggy-bank"
      }),
      tone: "brand"
    }), /*#__PURE__*/React.createElement(StatCard, {
      label: "Expenses",
      value: "$19,070",
      delta: "3.0%",
      deltaDirection: "down",
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "credit-card"
      }),
      tone: "violet"
    }), /*#__PURE__*/React.createElement(StatCard, {
      label: "Outstanding",
      value: "$46,900",
      delta: "—",
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "receipt"
      }),
      tone: "warning"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 2fr',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement(Card, {
      padding: "lg"
    }, /*#__PURE__*/React.createElement("h3", {
      style: {
        fontSize: 'var(--text-lg)',
        fontWeight: 'var(--fw-bold)',
        marginBottom: 4
      }
    }, "Net profit"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'baseline',
        gap: 8,
        marginBottom: 12
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-2xl)',
        fontWeight: 'var(--fw-extrabold)',
        letterSpacing: '-0.02em',
        fontVariantNumeric: 'tabular-nums'
      }
    }, "$232K"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--fw-bold)',
        color: 'var(--green-600)'
      }
    }, "+18% YTD")), /*#__PURE__*/React.createElement(Bars, {
      data: PROFIT,
      color: "var(--green-500)",
      highlight: "var(--green-600)",
      height: 140
    })), /*#__PURE__*/React.createElement(Card, {
      padding: "none"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '14px 18px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement("h3", {
      style: {
        fontSize: 'var(--text-lg)',
        fontWeight: 'var(--fw-bold)'
      }
    }, "Invoices"), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--fw-semibold)',
        color: 'var(--text-body)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "download",
      size: 14
    }), " Export")), /*#__PURE__*/React.createElement("table", {
      style: {
        width: '100%',
        borderCollapse: 'collapse'
      }
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, ['Invoice', 'Client', 'Amount', 'Status', 'Due'].map((h, i) => /*#__PURE__*/React.createElement("th", {
      key: h,
      style: {
        textAlign: i === 2 ? 'right' : 'left',
        padding: '10px 18px',
        fontSize: 'var(--text-2xs)',
        fontWeight: 'var(--fw-bold)',
        letterSpacing: 'var(--tracking-wide)',
        textTransform: 'uppercase',
        color: 'var(--text-subtle)'
      }
    }, h)))), /*#__PURE__*/React.createElement("tbody", null, INVOICES.map((inv, i) => {
      const [t, l] = IS[inv.status];
      return /*#__PURE__*/React.createElement("tr", {
        key: i,
        style: {
          borderTop: '1px solid var(--border-subtle)'
        }
      }, /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '11px 18px',
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-xs)',
          color: 'var(--text-body)'
        }
      }, inv.id), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '11px 18px',
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--fw-semibold)',
          color: 'var(--text-strong)'
        }
      }, inv.client), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '11px 18px',
          textAlign: 'right',
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--fw-bold)',
          color: 'var(--text-strong)',
          fontVariantNumeric: 'tabular-nums'
        }
      }, inv.amount), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '11px 18px'
        }
      }, /*#__PURE__*/React.createElement(Badge, {
        tone: t,
        dot: true
      }, l)), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '11px 18px',
          fontSize: 'var(--text-sm)',
          color: 'var(--text-muted)'
        }
      }, inv.due));
    }))))));
  }
  Object.assign(window, {
    Finance
  });
})();