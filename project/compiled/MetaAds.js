import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    return /*#__PURE__*/_jsxs(Card, {
      padding: "md",
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      },
      children: [/*#__PURE__*/_jsx("span", {
        style: {
          fontSize: 'var(--text-2xs)',
          fontWeight: 'var(--fw-bold)',
          letterSpacing: 'var(--tracking-caps)',
          textTransform: 'uppercase',
          color: 'var(--text-muted)'
        },
        children: label
      }), /*#__PURE__*/_jsxs("div", {
        style: {
          display: 'flex',
          alignItems: 'baseline',
          gap: 8
        },
        children: [/*#__PURE__*/_jsx("span", {
          style: {
            fontSize: 'var(--text-3xl)',
            fontWeight: 'var(--fw-extrabold)',
            letterSpacing: '-0.02em',
            color: color || 'var(--text-strong)',
            fontVariantNumeric: 'tabular-nums'
          },
          children: value
        }), /*#__PURE__*/_jsxs("span", {
          style: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: 2,
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--fw-bold)',
            color: pos ? 'var(--green-600)' : 'var(--red-600)'
          },
          children: [/*#__PURE__*/_jsx(Icon, {
            name: pos ? 'trending-up' : 'trending-down',
            size: 13
          }), " ", delta]
        })]
      }), /*#__PURE__*/_jsx("span", {
        style: {
          fontSize: 'var(--text-xs)',
          color: 'var(--text-subtle)'
        },
        children: sub
      })]
    });
  }
  function MetaAds() {
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
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: 12
          },
          children: [/*#__PURE__*/_jsx("span", {
            style: {
              width: 42,
              height: 42,
              borderRadius: 'var(--radius-lg)',
              background: 'var(--grad-brand)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-brand)'
            },
            children: /*#__PURE__*/_jsx(Icon, {
              name: "megaphone",
              size: 22,
              style: {
                color: '#fff'
              }
            })
          }), /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx("h1", {
              style: {
                fontSize: 'var(--text-3xl)',
                fontWeight: 'var(--fw-extrabold)',
                letterSpacing: '-0.02em'
              },
              children: "Meta Ads Center"
            }), /*#__PURE__*/_jsx("p", {
              style: {
                fontSize: 'var(--text-sm)',
                color: 'var(--text-muted)',
                marginTop: 2
              },
              children: "5 ad accounts · 12 active campaigns"
            })]
          })]
        }), /*#__PURE__*/_jsxs("div", {
          style: {
            display: 'flex',
            gap: 8
          },
          children: [/*#__PURE__*/_jsxs("div", {
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
            },
            children: [/*#__PURE__*/_jsx(Icon, {
              name: "calendar",
              size: 16,
              style: {
                color: 'var(--text-muted)'
              }
            }), " Last 30 days"]
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
            }), " New campaign"]
          })]
        })]
      }), /*#__PURE__*/_jsxs("div", {
        style: {
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 16,
          marginBottom: 16
        },
        children: [/*#__PURE__*/_jsx(AdStat, {
          label: "Ad spend",
          value: "$15.8K",
          delta: "18%",
          sub: "Budget $22K · 72% used"
        }), /*#__PURE__*/_jsx(AdStat, {
          label: "ROAS",
          value: "5.4×",
          delta: "0.8×",
          sub: "Target 4.0× · exceeding",
          color: "var(--green-600)"
        }), /*#__PURE__*/_jsx(AdStat, {
          label: "Cost per lead",
          value: "$4.31",
          delta: "9%",
          dir: "down",
          sub: "Down from $4.74",
          color: "var(--blue-600)"
        }), /*#__PURE__*/_jsx(AdStat, {
          label: "Leads generated",
          value: "1,106",
          delta: "22%",
          sub: "416 marked qualified"
        })]
      }), /*#__PURE__*/_jsxs("div", {
        style: {
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 16,
          marginBottom: 16
        },
        children: [/*#__PURE__*/_jsxs(Card, {
          padding: "lg",
          children: [/*#__PURE__*/_jsxs("div", {
            style: {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 14
            },
            children: [/*#__PURE__*/_jsx("h3", {
              style: {
                fontSize: 'var(--text-lg)',
                fontWeight: 'var(--fw-bold)'
              },
              children: "Ad spend"
            }), /*#__PURE__*/_jsx(Badge, {
              tone: "brand",
              children: "$ thousands"
            })]
          }), /*#__PURE__*/_jsx(Bars, {
            data: TF_SPEND,
            labels: ['', '', 'M', '', '', 'J', '', '', 'A', '', '', 'S'],
            color: "var(--blue-400)",
            highlight: "var(--blue-600)"
          })]
        }), /*#__PURE__*/_jsxs(Card, {
          padding: "lg",
          children: [/*#__PURE__*/_jsxs("div", {
            style: {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 14
            },
            children: [/*#__PURE__*/_jsx("h3", {
              style: {
                fontSize: 'var(--text-lg)',
                fontWeight: 'var(--fw-bold)'
              },
              children: "ROAS trend"
            }), /*#__PURE__*/_jsx(Badge, {
              tone: "success",
              dot: true,
              children: "Improving"
            })]
          }), /*#__PURE__*/_jsx(AreaLine, {
            data: TF_ROAS,
            color: "var(--green-600)",
            id: "roas"
          })]
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
            children: "Campaigns by client"
          }), window.TFLinkBtn ? React.createElement(window.TFLinkBtn, null, 'Export report') : null]
        }), /*#__PURE__*/_jsxs("table", {
          style: {
            width: '100%',
            borderCollapse: 'collapse'
          },
          children: [/*#__PURE__*/_jsx("thead", {
            children: /*#__PURE__*/_jsx("tr", {
              children: ['Campaign', 'Status', 'Spend', 'ROAS', 'CPL', 'Leads', 'Budget pace'].map((h, i) => /*#__PURE__*/_jsx("th", {
                style: {
                  textAlign: i > 1 && i < 6 ? 'right' : 'left',
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
            children: TF_CAMPAIGNS.map((c, i) => {
              const s = CAMP_STATUS[c.status];
              return /*#__PURE__*/_jsxs("tr", {
                style: {
                  borderTop: '1px solid var(--border-subtle)'
                },
                children: [/*#__PURE__*/_jsx("td", {
                  style: {
                    padding: '12px 18px'
                  },
                  children: /*#__PURE__*/_jsxs("div", {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10
                    },
                    children: [/*#__PURE__*/_jsx(Avatar, {
                      name: c.client,
                      size: "sm"
                    }), /*#__PURE__*/_jsxs("div", {
                      children: [/*#__PURE__*/_jsx("div", {
                        style: {
                          fontSize: 'var(--text-sm)',
                          fontWeight: 'var(--fw-semibold)',
                          color: 'var(--text-strong)'
                        },
                        children: c.name
                      }), /*#__PURE__*/_jsx("div", {
                        style: {
                          fontSize: 'var(--text-xs)',
                          color: 'var(--text-muted)'
                        },
                        children: c.client
                      })]
                    })]
                  })
                }), /*#__PURE__*/_jsx("td", {
                  style: {
                    padding: '12px 18px'
                  },
                  children: /*#__PURE__*/_jsx(Badge, {
                    tone: s.tone,
                    dot: true,
                    children: s.label
                  })
                }), /*#__PURE__*/_jsx("td", {
                  style: {
                    padding: '12px 18px',
                    textAlign: 'right',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--fw-semibold)',
                    color: 'var(--text-strong)',
                    fontVariantNumeric: 'tabular-nums'
                  },
                  children: c.spend
                }), /*#__PURE__*/_jsx("td", {
                  style: {
                    padding: '12px 18px',
                    textAlign: 'right',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--fw-bold)',
                    color: 'var(--green-600)',
                    fontVariantNumeric: 'tabular-nums'
                  },
                  children: c.roas
                }), /*#__PURE__*/_jsx("td", {
                  style: {
                    padding: '12px 18px',
                    textAlign: 'right',
                    fontSize: 'var(--text-sm)',
                    color: 'var(--text-body)',
                    fontVariantNumeric: 'tabular-nums'
                  },
                  children: c.cpl
                }), /*#__PURE__*/_jsx("td", {
                  style: {
                    padding: '12px 18px',
                    textAlign: 'right',
                    fontSize: 'var(--text-sm)',
                    color: 'var(--text-body)',
                    fontVariantNumeric: 'tabular-nums'
                  },
                  children: c.leads
                }), /*#__PURE__*/_jsx("td", {
                  style: {
                    padding: '12px 18px',
                    width: 130
                  },
                  children: /*#__PURE__*/_jsx(ProgressBar, {
                    value: c.pace,
                    tone: c.pace > 85 ? 'warning' : 'brand',
                    size: "sm"
                  })
                })]
              }, i);
            })
          })]
        })]
      })]
    });
  }
  Object.assign(window, {
    MetaAds
  });
})();