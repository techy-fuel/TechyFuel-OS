import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Client CRM screen — table + selectable profile panel.
(() => {
  const {
    Card,
    Badge,
    Avatar,
    Tabs,
    Input
  } = window.TechyFuelOSDesignSystem_be0222;
  const TF_STATUS = {
    lead: {
      tone: 'brand',
      label: 'Lead'
    },
    proposal: {
      tone: 'violet',
      label: 'Proposal sent'
    },
    negotiation: {
      tone: 'warning',
      label: 'Negotiation'
    },
    active: {
      tone: 'success',
      label: 'Active client'
    },
    completed: {
      tone: 'neutral',
      label: 'Completed'
    },
    lost: {
      tone: 'danger',
      label: 'Lost'
    }
  };
  const TF_CLIENTS_DATA = [{
    id: 1,
    company: 'Nova Skincare',
    contact: 'Amelia Stone',
    email: 'amelia@novaskin.co',
    country: '🇺🇸 United States',
    industry: 'E-commerce',
    status: 'active',
    value: '$12,400',
    source: 'Referral',
    site: 'novaskin.co',
    wa: '+1 415 555 0182'
  }, {
    id: 2,
    company: 'Orbit Inc.',
    contact: 'Daniel Wu',
    email: 'dan@orbit.io',
    country: '🇬🇧 United Kingdom',
    industry: 'SaaS',
    status: 'active',
    value: '$28,900',
    source: 'Inbound',
    site: 'orbit.io',
    wa: '+44 20 7946 0958'
  }, {
    id: 3,
    company: 'Mediva Health',
    contact: 'Priya Nair',
    email: 'priya@mediva.health',
    country: '🇦🇪 UAE',
    industry: 'Healthcare',
    status: 'negotiation',
    value: '$18,000',
    source: 'LinkedIn',
    site: 'mediva.health',
    wa: '+971 50 123 4567'
  }, {
    id: 4,
    company: 'Peak Fitness',
    contact: 'Marco Bianchi',
    email: 'marco@peakfit.com',
    country: '🇮🇹 Italy',
    industry: 'Fitness',
    status: 'active',
    value: '$9,200',
    source: 'Referral',
    site: 'peakfit.com',
    wa: '+39 06 5555 123'
  }, {
    id: 5,
    company: 'Lumen Cafe',
    contact: 'Sofia Reyes',
    email: 'sofia@lumencafe.com',
    country: '🇪🇸 Spain',
    industry: 'Hospitality',
    status: 'proposal',
    value: '$6,500',
    source: 'Instagram',
    site: 'lumencafe.com',
    wa: '+34 91 555 0199'
  }, {
    id: 6,
    company: 'Atlas Realty',
    contact: 'James Carter',
    email: 'james@atlasrealty.com',
    country: '🇺🇸 United States',
    industry: 'Real estate',
    status: 'lead',
    value: '$15,000',
    source: 'Cold outreach',
    site: 'atlasrealty.com',
    wa: '+1 212 555 0143'
  }, {
    id: 7,
    company: 'Verde Foods',
    contact: 'Lena Müller',
    email: 'lena@verdefoods.de',
    country: '🇩🇪 Germany',
    industry: 'CPG',
    status: 'completed',
    value: '$22,300',
    source: 'Referral',
    site: 'verdefoods.de',
    wa: '+49 30 5555 012'
  }];
  const TF_TIMELINE = [{
    icon: 'phone',
    tone: 'brand',
    text: 'Discovery call completed',
    time: 'Jun 18 · 32 min'
  }, {
    icon: 'file-text',
    tone: 'violet',
    text: 'Proposal v2 sent ($12,400/mo retainer)',
    time: 'Jun 15'
  }, {
    icon: 'mail',
    tone: 'success',
    text: 'Replied to onboarding email',
    time: 'Jun 12'
  }, {
    icon: 'calendar-check',
    tone: 'warning',
    text: 'Kickoff meeting scheduled',
    time: 'Jun 10'
  }];
  function Th({
    children,
    w
  }) {
    return /*#__PURE__*/_jsx("th", {
      style: {
        textAlign: 'left',
        padding: '0 14px 10px',
        fontSize: 'var(--text-2xs)',
        fontWeight: 'var(--fw-bold)',
        letterSpacing: 'var(--tracking-wide)',
        textTransform: 'uppercase',
        color: 'var(--text-subtle)',
        width: w
      },
      children: children
    });
  }
  function ClientRow({
    c,
    selected,
    onClick
  }) {
    const [hover, setHover] = React.useState(false);
    const s = TF_STATUS[c.status];
    return /*#__PURE__*/_jsxs("tr", {
      onClick: onClick,
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => setHover(false),
      style: {
        cursor: 'pointer',
        background: selected ? 'var(--blue-50)' : hover ? 'var(--slate-50)' : 'transparent',
        transition: 'background var(--dur-fast) var(--ease-out)'
      },
      children: [/*#__PURE__*/_jsx("td", {
        style: {
          padding: '11px 14px',
          borderTop: '1px solid var(--border-subtle)'
        },
        children: /*#__PURE__*/_jsxs("div", {
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: 10
          },
          children: [/*#__PURE__*/_jsx(Avatar, {
            name: c.company,
            size: "sm"
          }), /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx("div", {
              style: {
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--fw-semibold)',
                color: 'var(--text-strong)'
              },
              children: c.company
            }), /*#__PURE__*/_jsx("div", {
              style: {
                fontSize: 'var(--text-xs)',
                color: 'var(--text-muted)'
              },
              children: c.site
            })]
          })]
        })
      }), /*#__PURE__*/_jsx("td", {
        style: {
          padding: '11px 14px',
          borderTop: '1px solid var(--border-subtle)',
          fontSize: 'var(--text-sm)',
          color: 'var(--text-body)'
        },
        children: c.contact
      }), /*#__PURE__*/_jsx("td", {
        style: {
          padding: '11px 14px',
          borderTop: '1px solid var(--border-subtle)'
        },
        children: /*#__PURE__*/_jsx(Badge, {
          tone: s.tone,
          dot: true,
          children: s.label
        })
      }), /*#__PURE__*/_jsx("td", {
        style: {
          padding: '11px 14px',
          borderTop: '1px solid var(--border-subtle)',
          fontSize: 'var(--text-sm)',
          color: 'var(--text-body)'
        },
        children: c.industry
      }), /*#__PURE__*/_jsx("td", {
        style: {
          padding: '11px 14px',
          borderTop: '1px solid var(--border-subtle)',
          fontSize: 'var(--text-sm)',
          color: 'var(--text-body)'
        },
        children: c.country
      }), /*#__PURE__*/_jsx("td", {
        style: {
          padding: '11px 14px',
          borderTop: '1px solid var(--border-subtle)',
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--fw-bold)',
          color: 'var(--text-strong)',
          textAlign: 'right',
          fontVariantNumeric: 'tabular-nums'
        },
        children: c.value
      })]
    });
  }
  function ProfileField({
    icon,
    label,
    value
  }) {
    return /*#__PURE__*/_jsxs("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '9px 0',
        borderBottom: '1px solid var(--border-subtle)'
      },
      children: [/*#__PURE__*/_jsx(Icon, {
        name: icon,
        size: 16,
        style: {
          color: 'var(--text-subtle)',
          flex: 'none'
        }
      }), /*#__PURE__*/_jsx("span", {
        style: {
          fontSize: 'var(--text-xs)',
          color: 'var(--text-muted)',
          width: 76,
          flex: 'none'
        },
        children: label
      }), /*#__PURE__*/_jsx("span", {
        style: {
          fontSize: 'var(--text-sm)',
          color: 'var(--text-strong)',
          fontWeight: 'var(--fw-medium)',
          textAlign: 'right',
          flex: 1
        },
        children: value
      })]
    });
  }
  function CRM() {
    const [selId, setSelId] = React.useState(1);
    const sel = TF_CLIENTS_DATA.find(c => c.id === selId);
    const s = TF_STATUS[sel.status];
    return /*#__PURE__*/_jsxs("div", {
      style: {
        padding: 24
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
            children: "Client CRM"
          }), /*#__PURE__*/_jsx("p", {
            style: {
              fontSize: 'var(--text-sm)',
              color: 'var(--text-muted)',
              marginTop: 2
            },
            children: "38 clients · $112.7K in active retainers"
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
            name: "user-plus",
            size: 16
          }), " Add client"]
        })]
      }), /*#__PURE__*/_jsxs("div", {
        style: {
          display: 'grid',
          gridTemplateColumns: 'minmax(0,1fr) 320px',
          gap: 16,
          alignItems: 'start'
        },
        children: [/*#__PURE__*/_jsxs(Card, {
          padding: "none",
          children: [/*#__PURE__*/_jsxs("div", {
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: 14,
              borderBottom: '1px solid var(--border-subtle)'
            },
            children: [/*#__PURE__*/_jsx("div", {
              style: {
                width: 230
              },
              children: /*#__PURE__*/_jsx(Input, {
                size: "sm",
                placeholder: "Search clients…",
                iconLeft: /*#__PURE__*/_jsx(Icon, {
                  name: "search",
                  size: 16
                })
              })
            }), /*#__PURE__*/_jsxs("div", {
              style: {
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                height: 30,
                padding: '0 11px',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--fw-semibold)',
                color: 'var(--text-body)',
                cursor: 'pointer'
              },
              children: [/*#__PURE__*/_jsx(Icon, {
                name: "filter",
                size: 15,
                style: {
                  color: 'var(--text-muted)'
                }
              }), " Status"]
            }), /*#__PURE__*/_jsx("div", {
              style: {
                flex: 1
              }
            }), /*#__PURE__*/_jsx("span", {
              style: {
                fontSize: 'var(--text-xs)',
                color: 'var(--text-muted)'
              },
              children: "7 of 38"
            })]
          }), /*#__PURE__*/_jsxs("table", {
            style: {
              width: '100%',
              borderCollapse: 'collapse'
            },
            children: [/*#__PURE__*/_jsx("thead", {
              children: /*#__PURE__*/_jsxs("tr", {
                children: [/*#__PURE__*/_jsx(Th, {
                  children: "Company"
                }), /*#__PURE__*/_jsx(Th, {
                  children: "Contact"
                }), /*#__PURE__*/_jsx(Th, {
                  children: "Status"
                }), /*#__PURE__*/_jsx(Th, {
                  children: "Industry"
                }), /*#__PURE__*/_jsx(Th, {
                  children: "Country"
                }), /*#__PURE__*/_jsx(Th, {
                  w: "90",
                  children: "Value"
                })]
              })
            }), /*#__PURE__*/_jsx("tbody", {
              children: TF_CLIENTS_DATA.map(c => /*#__PURE__*/_jsx(ClientRow, {
                c: c,
                selected: c.id === selId,
                onClick: () => setSelId(c.id)
              }, c.id))
            })]
          })]
        }), /*#__PURE__*/_jsxs(Card, {
          padding: "none",
          style: {
            overflow: 'hidden',
            position: 'sticky',
            top: 84
          },
          children: [/*#__PURE__*/_jsxs("div", {
            style: {
              background: 'var(--grad-hero)',
              padding: '20px 18px',
              borderBottom: '1px solid var(--border-subtle)'
            },
            children: [/*#__PURE__*/_jsxs("div", {
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: 12
              },
              children: [/*#__PURE__*/_jsx(Avatar, {
                name: sel.company,
                size: "lg"
              }), /*#__PURE__*/_jsxs("div", {
                style: {
                  flex: 1,
                  minWidth: 0
                },
                children: [/*#__PURE__*/_jsx("div", {
                  style: {
                    fontSize: 'var(--text-lg)',
                    fontWeight: 'var(--fw-bold)',
                    color: 'var(--text-strong)',
                    letterSpacing: '-0.01em'
                  },
                  children: sel.company
                }), /*#__PURE__*/_jsx("div", {
                  style: {
                    marginTop: 4
                  },
                  children: /*#__PURE__*/_jsx(Badge, {
                    tone: s.tone,
                    dot: true,
                    children: s.label
                  })
                })]
              })]
            }), /*#__PURE__*/_jsx("div", {
              style: {
                display: 'flex',
                gap: 8,
                marginTop: 14
              },
              children: [['mail', 'Email'], ['message-circle', 'WhatsApp'], ['calendar-plus', 'Meeting']].map(([ic, l]) => /*#__PURE__*/_jsxs("button", {
                style: {
                  flex: 1,
                  display: 'inline-flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                  padding: '8px 0',
                  background: 'var(--slate-0)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'var(--text-2xs)',
                  fontWeight: 'var(--fw-semibold)',
                  color: 'var(--text-body)'
                },
                children: [/*#__PURE__*/_jsx(Icon, {
                  name: ic,
                  size: 17,
                  style: {
                    color: 'var(--blue-600)'
                  }
                }), " ", l]
              }, l))
            })]
          }), /*#__PURE__*/_jsxs("div", {
            style: {
              padding: '6px 18px 14px'
            },
            children: [/*#__PURE__*/_jsx(ProfileField, {
              icon: "user",
              label: "Contact",
              value: sel.contact
            }), /*#__PURE__*/_jsx(ProfileField, {
              icon: "at-sign",
              label: "Email",
              value: sel.email
            }), /*#__PURE__*/_jsx(ProfileField, {
              icon: "globe",
              label: "Website",
              value: sel.site
            }), /*#__PURE__*/_jsx(ProfileField, {
              icon: "target",
              label: "Source",
              value: sel.source
            }), /*#__PURE__*/_jsx(ProfileField, {
              icon: "banknote",
              label: "Value",
              value: sel.value + '/mo'
            })]
          }), /*#__PURE__*/_jsxs("div", {
            style: {
              padding: '0 18px 18px'
            },
            children: [/*#__PURE__*/_jsx("div", {
              style: {
                fontSize: 'var(--text-2xs)',
                fontWeight: 'var(--fw-bold)',
                letterSpacing: 'var(--tracking-caps)',
                textTransform: 'uppercase',
                color: 'var(--text-subtle)',
                marginBottom: 10
              },
              children: "Communication timeline"
            }), /*#__PURE__*/_jsx("div", {
              children: TF_TIMELINE.map((t, i) => {
                const tones = {
                  brand: 'var(--blue-600)',
                  violet: 'var(--violet-500)',
                  success: 'var(--green-500)',
                  warning: 'var(--amber-500)'
                };
                return /*#__PURE__*/_jsxs("div", {
                  style: {
                    display: 'flex',
                    gap: 10,
                    paddingBottom: i < TF_TIMELINE.length - 1 ? 12 : 0
                  },
                  children: [/*#__PURE__*/_jsxs("div", {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center'
                    },
                    children: [/*#__PURE__*/_jsx("span", {
                      style: {
                        width: 26,
                        height: 26,
                        borderRadius: '50%',
                        background: 'var(--slate-50)',
                        border: '1px solid var(--border-default)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: tones[t.tone]
                      },
                      children: /*#__PURE__*/_jsx(Icon, {
                        name: t.icon,
                        size: 13
                      })
                    }), i < TF_TIMELINE.length - 1 && /*#__PURE__*/_jsx("span", {
                      style: {
                        width: 1.5,
                        flex: 1,
                        background: 'var(--border-default)',
                        marginTop: 3
                      }
                    })]
                  }), /*#__PURE__*/_jsxs("div", {
                    style: {
                      paddingBottom: 2
                    },
                    children: [/*#__PURE__*/_jsx("div", {
                      style: {
                        fontSize: 'var(--text-sm)',
                        color: 'var(--text-body)',
                        lineHeight: 1.4
                      },
                      children: t.text
                    }), /*#__PURE__*/_jsx("div", {
                      style: {
                        fontSize: 'var(--text-xs)',
                        color: 'var(--text-subtle)',
                        marginTop: 1
                      },
                      children: t.time
                    })]
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
    CRM
  });
})();