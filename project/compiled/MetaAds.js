// Meta Ads Center screen.
(() => {
  const {
    Card,
    Badge,
    Avatar,
    ProgressBar
  } = window.TechyFuelOSDesignSystem_be0222;
  const TF_SPEND = [3.2, 3.6, 4.1, 3.9, 4.8, 5.2, 4.9, 5.6, 6.1, 5.8, 6.4, 7.0];
  const TF_ROAS = [2.8, 3.1, 3.4, 3.2, 3.9, 4.2, 4.6, 4.4, 5.1, 4.9, 5.4, 6.2];
  const TF_CAMPAIGNS = [{
    name: 'Nova — Summer launch',
    client: 'Nova Skincare',
    status: 'active',
    spend: '$4,820',
    roas: '6.2×',
    cpl: '$3.18',
    leads: 412,
    pace: 78
  }, {
    name: 'Peak — Membership drive',
    client: 'Peak Fitness',
    status: 'active',
    spend: '$2,140',
    roas: '4.8×',
    cpl: '$4.02',
    leads: 268,
    pace: 64
  }, {
    name: 'Orbit — Demo signups',
    client: 'Orbit Inc.',
    status: 'active',
    spend: '$6,310',
    roas: '5.4×',
    cpl: '$8.40',
    leads: 188,
    pace: 91
  }, {
    name: 'Lumen — Grand opening',
    client: 'Lumen Cafe',
    status: 'review',
    spend: '$980',
    roas: '3.1×',
    cpl: '$2.74',
    leads: 142,
    pace: 42
  }, {
    name: 'Mediva — Awareness',
    client: 'Mediva Health',
    status: 'paused',
    spend: '$1,560',
    roas: '2.4×',
    cpl: '$6.90',
    leads: 96,
    pace: 30
  }];
  const CAMP_STATUS = {
    active: {
      tone: 'success',
      label: 'Active'
    },
    review: {
      tone: 'warning',
      label: 'In review'
    },
    paused: {
      tone: 'neutral',
      label: 'Paused'
    }
  };
  function AdStat({
    label,
    value,
    delta,
    dir,
    sub,
    color
  }) {
    const pos = dir !== 'down';
    return /*#__PURE__*/React.createElement(Card, {
      padding: "md",
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-2xs)',
        fontWeight: 'var(--fw-bold)',
        letterSpacing: 'var(--tracking-caps)',
        textTransform: 'uppercase',
        color: 'var(--text-muted)'
      }
    }, label), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'baseline',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-3xl)',
        fontWeight: 'var(--fw-extrabold)',
        letterSpacing: '-0.02em',
        color: color || 'var(--text-strong)',
        fontVariantNumeric: 'tabular-nums'
      }
    }, value), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 2,
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--fw-bold)',
        color: pos ? 'var(--green-600)' : 'var(--red-600)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: pos ? 'trending-up' : 'trending-down',
      size: 13
    }), " ", delta)), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-xs)',
        color: 'var(--text-subtle)'
      }
    }, sub));
  }
  function MetaAds() {
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
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 42,
        height: 42,
        borderRadius: 'var(--radius-lg)',
        background: 'var(--grad-brand)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 'var(--shadow-brand)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "megaphone",
      size: 22,
      style: {
        color: '#fff'
      }
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
      style: {
        fontSize: 'var(--text-3xl)',
        fontWeight: 'var(--fw-extrabold)',
        letterSpacing: '-0.02em'
      }
    }, "Meta Ads Center"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 'var(--text-sm)',
        color: 'var(--text-muted)',
        marginTop: 2
      }
    }, "5 ad accounts · 12 active campaigns"))), /*#__PURE__*/React.createElement("div", {
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
    }), " Last 30 days"), /*#__PURE__*/React.createElement("button", {
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
    }), " New campaign"))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 16,
        marginBottom: 16
      }
    }, /*#__PURE__*/React.createElement(AdStat, {
      label: "Ad spend",
      value: "$15.8K",
      delta: "18%",
      sub: "Budget $22K · 72% used"
    }), /*#__PURE__*/React.createElement(AdStat, {
      label: "ROAS",
      value: "5.4×",
      delta: "0.8×",
      sub: "Target 4.0× · exceeding",
      color: "var(--green-600)"
    }), /*#__PURE__*/React.createElement(AdStat, {
      label: "Cost per lead",
      value: "$4.31",
      delta: "9%",
      dir: "down",
      sub: "Down from $4.74",
      color: "var(--blue-600)"
    }), /*#__PURE__*/React.createElement(AdStat, {
      label: "Leads generated",
      value: "1,106",
      delta: "22%",
      sub: "416 marked qualified"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 16,
        marginBottom: 16
      }
    }, /*#__PURE__*/React.createElement(Card, {
      padding: "lg"
    }, /*#__PURE__*/React.createElement("div", {
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
    }, "Ad spend"), /*#__PURE__*/React.createElement(Badge, {
      tone: "brand"
    }, "$ thousands")), /*#__PURE__*/React.createElement(Bars, {
      data: TF_SPEND,
      labels: ['', '', 'M', '', '', 'J', '', '', 'A', '', '', 'S'],
      color: "var(--blue-400)",
      highlight: "var(--blue-600)"
    })), /*#__PURE__*/React.createElement(Card, {
      padding: "lg"
    }, /*#__PURE__*/React.createElement("div", {
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
    }, "ROAS trend"), /*#__PURE__*/React.createElement(Badge, {
      tone: "success",
      dot: true
    }, "Improving")), /*#__PURE__*/React.createElement(AreaLine, {
      data: TF_ROAS,
      color: "var(--green-600)",
      id: "roas"
    }))), /*#__PURE__*/React.createElement(Card, {
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
    }, "Campaigns by client"), window.TFLinkBtn ? React.createElement(window.TFLinkBtn, null, 'Export report') : null), /*#__PURE__*/React.createElement("table", {
      style: {
        width: '100%',
        borderCollapse: 'collapse'
      }
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, ['Campaign', 'Status', 'Spend', 'ROAS', 'CPL', 'Leads', 'Budget pace'].map((h, i) => /*#__PURE__*/React.createElement("th", {
      key: h,
      style: {
        textAlign: i > 1 && i < 6 ? 'right' : 'left',
        padding: '10px 18px',
        fontSize: 'var(--text-2xs)',
        fontWeight: 'var(--fw-bold)',
        letterSpacing: 'var(--tracking-wide)',
        textTransform: 'uppercase',
        color: 'var(--text-subtle)'
      }
    }, h)))), /*#__PURE__*/React.createElement("tbody", null, TF_CAMPAIGNS.map((c, i) => {
      const s = CAMP_STATUS[c.status];
      return /*#__PURE__*/React.createElement("tr", {
        key: i,
        style: {
          borderTop: '1px solid var(--border-subtle)'
        }
      }, /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '12px 18px'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 10
        }
      }, /*#__PURE__*/React.createElement(Avatar, {
        name: c.client,
        size: "sm"
      }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--fw-semibold)',
          color: 'var(--text-strong)'
        }
      }, c.name), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 'var(--text-xs)',
          color: 'var(--text-muted)'
        }
      }, c.client)))), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '12px 18px'
        }
      }, /*#__PURE__*/React.createElement(Badge, {
        tone: s.tone,
        dot: true
      }, s.label)), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '12px 18px',
          textAlign: 'right',
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--fw-semibold)',
          color: 'var(--text-strong)',
          fontVariantNumeric: 'tabular-nums'
        }
      }, c.spend), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '12px 18px',
          textAlign: 'right',
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--fw-bold)',
          color: 'var(--green-600)',
          fontVariantNumeric: 'tabular-nums'
        }
      }, c.roas), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '12px 18px',
          textAlign: 'right',
          fontSize: 'var(--text-sm)',
          color: 'var(--text-body)',
          fontVariantNumeric: 'tabular-nums'
        }
      }, c.cpl), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '12px 18px',
          textAlign: 'right',
          fontSize: 'var(--text-sm)',
          color: 'var(--text-body)',
          fontVariantNumeric: 'tabular-nums'
        }
      }, c.leads), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '12px 18px',
          width: 130
        }
      }, /*#__PURE__*/React.createElement(ProgressBar, {
        value: c.pace,
        tone: c.pace > 85 ? 'warning' : 'brand',
        size: "sm"
      })));
    })))));
  }
  Object.assign(window, {
    MetaAds
  });
})();