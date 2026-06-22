import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Client Portal screen — the client-facing view (previewed inside the agency app).
(() => {
  const {
    Card,
    Badge,
    Avatar,
    AvatarGroup,
    ProgressBar
  } = window.TechyFuelOSDesignSystem_be0222;
  const TF_MILESTONES = [{
    label: 'Discovery & strategy',
    state: 'done'
  }, {
    label: 'Brand & creative direction',
    state: 'done'
  }, {
    label: 'Campaign production',
    state: 'active'
  }, {
    label: 'Launch & optimization',
    state: 'todo'
  }, {
    label: 'Reporting & handover',
    state: 'todo'
  }];
  const TF_APPROVALS = [{
    name: 'Homepage hero — v3',
    type: 'Design',
    who: 'Sara Khan',
    time: '2h ago',
    status: 'pending'
  }, {
    name: 'Launch reel — 30s cut',
    type: 'Video',
    who: 'Omar Ali',
    time: 'Yesterday',
    status: 'pending'
  }, {
    name: 'Instagram carousel set',
    type: 'Social',
    who: 'Lena Cruz',
    time: 'Jun 18',
    status: 'approved'
  }];
  const TF_FILES = [{
    name: 'Brand guidelines.pdf',
    size: '4.2 MB',
    icon: 'file-text',
    tone: 'var(--red-500)'
  }, {
    name: 'Launch hero.png',
    size: '1.8 MB',
    icon: 'image',
    tone: 'var(--violet-500)'
  }, {
    name: 'Campaign reel.mp4',
    size: '38 MB',
    icon: 'video',
    tone: 'var(--blue-500)'
  }, {
    name: 'Service agreement.pdf',
    size: '320 KB',
    icon: 'file-check',
    tone: 'var(--green-500)'
  }];
  function ClientPortal() {
    return /*#__PURE__*/_jsxs("div", {
      children: [/*#__PURE__*/_jsx("div", {
        style: {
          background: 'var(--grad-brand)',
          padding: '26px 24px',
          color: '#fff'
        },
        children: /*#__PURE__*/_jsxs("div", {
          style: {
            maxWidth: 1100,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16
          },
          children: [/*#__PURE__*/_jsxs("div", {
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: 14
            },
            children: [/*#__PURE__*/_jsx("span", {
              style: {
                width: 46,
                height: 46,
                borderRadius: 'var(--radius-xl)',
                background: 'rgba(255,255,255,0.16)',
                backdropFilter: 'blur(8px)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(255,255,255,0.25)'
              },
              children: /*#__PURE__*/_jsx(Icon, {
                name: "panel-left-open",
                size: 22,
                style: {
                  color: '#fff'
                }
              })
            }), /*#__PURE__*/_jsxs("div", {
              children: [/*#__PURE__*/_jsx("div", {
                style: {
                  fontSize: 'var(--text-2xs)',
                  fontWeight: 'var(--fw-bold)',
                  letterSpacing: 'var(--tracking-caps)',
                  textTransform: 'uppercase',
                  opacity: 0.85
                },
                children: "Client portal · preview"
              }), /*#__PURE__*/_jsx("div", {
                style: {
                  fontSize: 'var(--text-2xl)',
                  fontWeight: 'var(--fw-extrabold)',
                  letterSpacing: '-0.02em'
                },
                children: "Nova Skincare workspace"
              })]
            })]
          }), /*#__PURE__*/_jsx("div", {
            style: {
              display: 'flex',
              gap: 22
            },
            children: [['Project health', 'On track'], ['Next milestone', 'Jun 28'], ['Your manager', 'Sara K.']].map(([k, v]) => /*#__PURE__*/_jsxs("div", {
              children: [/*#__PURE__*/_jsx("div", {
                style: {
                  fontSize: 'var(--text-2xs)',
                  textTransform: 'uppercase',
                  letterSpacing: 'var(--tracking-wide)',
                  opacity: 0.8
                },
                children: k
              }), /*#__PURE__*/_jsx("div", {
                style: {
                  fontSize: 'var(--text-md)',
                  fontWeight: 'var(--fw-bold)'
                },
                children: v
              })]
            }, k))
          })]
        })
      }), /*#__PURE__*/_jsxs("div", {
        style: {
          maxWidth: 1100,
          margin: '0 auto',
          padding: 24,
          display: 'grid',
          gridTemplateColumns: '1.5fr 1fr',
          gap: 16
        },
        children: [/*#__PURE__*/_jsxs(Card, {
          padding: "lg",
          style: {
            gridColumn: '1 / -1'
          },
          children: [/*#__PURE__*/_jsxs("div", {
            style: {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 18
            },
            children: [/*#__PURE__*/_jsx("h3", {
              style: {
                fontSize: 'var(--text-lg)',
                fontWeight: 'var(--fw-bold)'
              },
              children: "Project progress"
            }), /*#__PURE__*/_jsx(Badge, {
              tone: "success",
              dot: true,
              children: "62% complete"
            })]
          }), /*#__PURE__*/_jsx("div", {
            style: {
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 8
            },
            children: TF_MILESTONES.map((m, i) => /*#__PURE__*/_jsxs("div", {
              style: {
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 9,
                position: 'relative'
              },
              children: [i < TF_MILESTONES.length - 1 && /*#__PURE__*/_jsx("div", {
                style: {
                  position: 'absolute',
                  top: 15,
                  left: '50%',
                  width: '100%',
                  height: 2,
                  background: m.state === 'done' ? 'var(--blue-500)' : 'var(--border-default)'
                }
              }), /*#__PURE__*/_jsx("span", {
                style: {
                  position: 'relative',
                  zIndex: 1,
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: m.state === 'done' ? 'var(--blue-600)' : m.state === 'active' ? 'var(--slate-0)' : 'var(--slate-100)',
                  border: m.state === 'active' ? '2px solid var(--blue-600)' : '2px solid transparent',
                  color: m.state === 'done' ? '#fff' : m.state === 'active' ? 'var(--blue-600)' : 'var(--text-subtle)'
                },
                children: m.state === 'done' ? /*#__PURE__*/_jsx(Icon, {
                  name: "check",
                  size: 16
                }) : m.state === 'active' ? /*#__PURE__*/_jsx("span", {
                  style: {
                    width: 9,
                    height: 9,
                    borderRadius: '50%',
                    background: 'var(--blue-600)'
                  }
                }) : /*#__PURE__*/_jsx("span", {
                  style: {
                    fontSize: 11,
                    fontWeight: 700
                  },
                  children: i + 1
                })
              }), /*#__PURE__*/_jsx("span", {
                style: {
                  fontSize: 'var(--text-xs)',
                  fontWeight: m.state === 'active' ? 'var(--fw-bold)' : 'var(--fw-medium)',
                  color: m.state === 'todo' ? 'var(--text-subtle)' : 'var(--text-strong)',
                  textAlign: 'center',
                  lineHeight: 1.3
                },
                children: m.label
              })]
            }, i))
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
              children: "Awaiting your approval"
            }), /*#__PURE__*/_jsx(Badge, {
              tone: "warning",
              children: "2 pending"
            })]
          }), /*#__PURE__*/_jsx("div", {
            style: {
              display: 'flex',
              flexDirection: 'column',
              gap: 10
            },
            children: TF_APPROVALS.map((a, i) => /*#__PURE__*/_jsxs("div", {
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: 12,
                background: 'var(--slate-50)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-subtle)'
              },
              children: [/*#__PURE__*/_jsx("span", {
                style: {
                  width: 38,
                  height: 38,
                  flex: 'none',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--slate-0)',
                  border: '1px solid var(--border-subtle)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-muted)'
                },
                children: /*#__PURE__*/_jsx(Icon, {
                  name: a.type === 'Video' ? 'video' : a.type === 'Social' ? 'instagram' : 'image',
                  size: 18
                })
              }), /*#__PURE__*/_jsxs("div", {
                style: {
                  flex: 1,
                  minWidth: 0
                },
                children: [/*#__PURE__*/_jsx("div", {
                  style: {
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--fw-semibold)',
                    color: 'var(--text-strong)'
                  },
                  children: a.name
                }), /*#__PURE__*/_jsxs("div", {
                  style: {
                    fontSize: 'var(--text-xs)',
                    color: 'var(--text-muted)'
                  },
                  children: [a.who, " · ", a.time]
                })]
              }), a.status === 'approved' ? /*#__PURE__*/_jsx(Badge, {
                tone: "success",
                dot: true,
                children: "Approved"
              }) : /*#__PURE__*/_jsxs("div", {
                style: {
                  display: 'flex',
                  gap: 6
                },
                children: [/*#__PURE__*/_jsx("button", {
                  style: {
                    width: 32,
                    height: 32,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'var(--green-600)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer'
                  },
                  children: /*#__PURE__*/_jsx(Icon, {
                    name: "check",
                    size: 16
                  })
                }), /*#__PURE__*/_jsx("button", {
                  style: {
                    width: 32,
                    height: 32,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'var(--slate-0)',
                    color: 'var(--text-muted)',
                    border: '1px solid var(--border-default)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer'
                  },
                  children: /*#__PURE__*/_jsx(Icon, {
                    name: "rotate-ccw",
                    size: 15
                  })
                })]
              })]
            }, i))
          })]
        }), /*#__PURE__*/_jsxs("div", {
          style: {
            display: 'flex',
            flexDirection: 'column',
            gap: 16
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
                children: "Shared files"
              }), window.TFLinkBtn ? React.createElement(window.TFLinkBtn, null, 'All files') : null]
            }), /*#__PURE__*/_jsx("div", {
              style: {
                display: 'flex',
                flexDirection: 'column',
                gap: 4
              },
              children: TF_FILES.map((f, i) => /*#__PURE__*/_jsxs("div", {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: 11,
                  padding: '8px 6px',
                  borderRadius: 'var(--radius-md)'
                },
                children: [/*#__PURE__*/_jsx(Icon, {
                  name: f.icon,
                  size: 18,
                  style: {
                    color: f.tone,
                    flex: 'none'
                  }
                }), /*#__PURE__*/_jsx("span", {
                  style: {
                    flex: 1,
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--fw-medium)',
                    color: 'var(--text-strong)'
                  },
                  children: f.name
                }), /*#__PURE__*/_jsx("span", {
                  style: {
                    fontSize: 'var(--text-xs)',
                    color: 'var(--text-subtle)'
                  },
                  children: f.size
                }), /*#__PURE__*/_jsx(Icon, {
                  name: "download",
                  size: 16,
                  style: {
                    color: 'var(--text-muted)',
                    cursor: 'pointer'
                  }
                })]
              }, i))
            })]
          }), /*#__PURE__*/_jsx(Card, {
            padding: "lg",
            style: {
              background: 'var(--slate-900)'
            },
            children: /*#__PURE__*/_jsxs("div", {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              },
              children: [/*#__PURE__*/_jsxs("div", {
                children: [/*#__PURE__*/_jsx("div", {
                  style: {
                    fontSize: 'var(--text-2xs)',
                    fontWeight: 'var(--fw-bold)',
                    letterSpacing: 'var(--tracking-caps)',
                    textTransform: 'uppercase',
                    color: 'var(--slate-400)'
                  },
                  children: "Latest invoice"
                }), /*#__PURE__*/_jsx("div", {
                  style: {
                    fontSize: 'var(--text-2xl)',
                    fontWeight: 'var(--fw-extrabold)',
                    color: '#fff',
                    marginTop: 4,
                    fontVariantNumeric: 'tabular-nums'
                  },
                  children: "$12,400"
                }), /*#__PURE__*/_jsx("div", {
                  style: {
                    fontSize: 'var(--text-xs)',
                    color: 'var(--slate-400)',
                    marginTop: 2
                  },
                  children: "INV-2026-0481 · due Jun 30"
                })]
              }), /*#__PURE__*/_jsxs("button", {
                style: {
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 7,
                  height: 38,
                  padding: '0 16px',
                  background: '#fff',
                  color: 'var(--slate-900)',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--fw-bold)',
                  cursor: 'pointer'
                },
                children: [/*#__PURE__*/_jsx(Icon, {
                  name: "download",
                  size: 16
                }), " Download"]
              })]
            })
          })]
        })]
      })]
    });
  }
  Object.assign(window, {
    ClientPortal
  });
})();