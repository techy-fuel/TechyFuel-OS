import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// App shell: left sidebar + glass top bar + content area.
(() => {
  const {
    IconButton,
    Avatar,
    Badge
  } = window.TechyFuelOSDesignSystem_be0222;
  const TF_NAV = [{
    group: 'Workspace',
    items: [{
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'layout-dashboard'
    }, {
      id: 'tasks',
      label: 'Tasks',
      icon: 'circle-check-big',
      badge: '24'
    }, {
      id: 'projects',
      label: 'Projects',
      icon: 'folder-kanban'
    }, {
      id: 'calendar',
      label: 'Calendar',
      icon: 'calendar-days'
    }]
  }, {
    group: 'Clients',
    items: [{
      id: 'crm',
      label: 'Client CRM',
      icon: 'contact'
    }, {
      id: 'pipeline',
      label: 'Sales pipeline',
      icon: 'filter'
    }, {
      id: 'portal',
      label: 'Client portal',
      icon: 'panel-left-open'
    }]
  }, {
    group: 'Marketing',
    items: [{
      id: 'content',
      label: 'Content',
      icon: 'calendar-clock'
    }, {
      id: 'ads',
      label: 'Meta Ads',
      icon: 'megaphone'
    }]
  }, {
    group: 'Business',
    items: [{
      id: 'finance',
      label: 'Finance',
      icon: 'wallet'
    }, {
      id: 'reports',
      label: 'Reports',
      icon: 'chart-line'
    }, {
      id: 'files',
      label: 'Files',
      icon: 'folder'
    }, {
      id: 'team',
      label: 'Team',
      icon: 'users'
    }, {
      id: 'settings',
      label: 'Settings',
      icon: 'settings'
    }]
  }];
  function SidebarItem({
    item,
    active,
    onClick
  }) {
    const [hover, setHover] = React.useState(false);
    return /*#__PURE__*/_jsxs("button", {
      onClick: onClick,
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => setHover(false),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        width: '100%',
        textAlign: 'left',
        padding: '8px 10px',
        borderRadius: 'var(--radius-md)',
        border: 'none',
        cursor: 'pointer',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-base)',
        fontWeight: 'var(--fw-medium)',
        background: active ? 'var(--blue-50)' : hover ? 'var(--slate-100)' : 'transparent',
        color: active ? 'var(--blue-700)' : 'var(--text-body)',
        transition: 'background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)'
      },
      children: [/*#__PURE__*/_jsx(Icon, {
        name: item.icon,
        size: 18,
        style: {
          color: active ? 'var(--blue-600)' : 'var(--text-muted)'
        }
      }), /*#__PURE__*/_jsx("span", {
        style: {
          flex: 1
        },
        children: item.label
      }), item.badge && /*#__PURE__*/_jsx("span", {
        style: {
          fontSize: 'var(--text-2xs)',
          fontWeight: 'var(--fw-bold)',
          color: active ? 'var(--blue-700)' : 'var(--text-muted)',
          background: active ? 'var(--blue-100)' : 'var(--slate-150)',
          borderRadius: 'var(--radius-full)',
          padding: '1px 7px',
          fontVariantNumeric: 'tabular-nums'
        },
        children: item.badge
      })]
    });
  }
  function Sidebar({
    active,
    onNavigate
  }) {
    return /*#__PURE__*/_jsxs("aside", {
      style: {
        width: 'var(--sidebar-width)',
        flex: 'none',
        height: '100%',
        boxSizing: 'border-box',
        background: 'var(--slate-0)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column'
      },
      children: [/*#__PURE__*/_jsxs("div", {
        style: {
          height: 'var(--topbar-height)',
          display: 'flex',
          alignItems: 'center',
          gap: 9,
          padding: '0 16px',
          borderBottom: '1px solid var(--border-subtle)'
        },
        children: [/*#__PURE__*/_jsx("img", {
          src: "../../assets/techyfuel-mark.png",
          alt: "",
          style: {
            height: 26
          }
        }), /*#__PURE__*/_jsxs("span", {
          style: {
            fontFamily: 'var(--font-display)',
            fontWeight: 'var(--fw-extrabold)',
            fontSize: 'var(--text-lg)',
            letterSpacing: '-0.02em',
            color: 'var(--text-strong)'
          },
          children: ["TechyFuel", /*#__PURE__*/_jsx("span", {
            style: {
              color: 'var(--blue-600)'
            },
            children: " OS"
          })]
        })]
      }), /*#__PURE__*/_jsx("nav", {
        className: "tf-scroll",
        style: {
          flex: 1,
          overflowY: 'auto',
          padding: '12px 12px 8px'
        },
        children: TF_NAV.map(section => /*#__PURE__*/_jsxs("div", {
          style: {
            marginBottom: 14
          },
          children: [/*#__PURE__*/_jsx("div", {
            style: {
              fontSize: 'var(--text-2xs)',
              fontWeight: 'var(--fw-bold)',
              letterSpacing: 'var(--tracking-caps)',
              textTransform: 'uppercase',
              color: 'var(--text-subtle)',
              padding: '0 10px 6px'
            },
            children: section.group
          }), /*#__PURE__*/_jsx("div", {
            style: {
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            },
            children: section.items.map(it => /*#__PURE__*/_jsx(SidebarItem, {
              item: it,
              active: active === it.id,
              onClick: () => onNavigate(it.id)
            }, it.id))
          })]
        }, section.group))
      }), /*#__PURE__*/_jsx("div", {
        style: {
          padding: 12,
          borderTop: '1px solid var(--border-subtle)'
        },
        children: /*#__PURE__*/_jsxs("div", {
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '8px 10px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--slate-50)'
          },
          children: [/*#__PURE__*/_jsx(Avatar, {
            name: "Bright Pixel",
            size: "sm"
          }), /*#__PURE__*/_jsxs("div", {
            style: {
              flex: 1,
              minWidth: 0
            },
            children: [/*#__PURE__*/_jsx("div", {
              style: {
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--fw-semibold)',
                color: 'var(--text-strong)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              },
              children: "Bright Pixel Co."
            }), /*#__PURE__*/_jsx("div", {
              style: {
                fontSize: 'var(--text-2xs)',
                color: 'var(--text-muted)'
              },
              children: "Pro · 14 seats"
            })]
          }), /*#__PURE__*/_jsx(Icon, {
            name: "chevrons-up-down",
            size: 16,
            style: {
              color: 'var(--text-subtle)'
            }
          })]
        })
      })]
    });
  }
  function TopBar({
    title,
    crumb,
    onOpenAI
  }) {
    return /*#__PURE__*/_jsxs("header", {
      style: {
        height: 'var(--topbar-height)',
        flex: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '0 24px',
        boxSizing: 'border-box',
        background: 'var(--glass-bg-strong)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-subtle)',
        position: 'sticky',
        top: 0,
        zIndex: 20
      },
      children: [/*#__PURE__*/_jsxs("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          minWidth: 0
        },
        children: [/*#__PURE__*/_jsx("span", {
          style: {
            fontSize: 'var(--text-sm)',
            color: 'var(--text-muted)'
          },
          children: crumb
        }), /*#__PURE__*/_jsx(Icon, {
          name: "chevron-right",
          size: 15,
          style: {
            color: 'var(--text-subtle)'
          }
        }), /*#__PURE__*/_jsx("span", {
          style: {
            fontSize: 'var(--text-md)',
            fontWeight: 'var(--fw-bold)',
            color: 'var(--text-strong)',
            letterSpacing: '-0.01em'
          },
          children: title
        })]
      }), /*#__PURE__*/_jsx("div", {
        style: {
          flex: 1
        }
      }), /*#__PURE__*/_jsxs("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          width: 280,
          maxWidth: '32vw',
          height: 36,
          padding: '0 12px',
          background: 'var(--slate-50)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-md)'
        },
        children: [/*#__PURE__*/_jsx(Icon, {
          name: "search",
          size: 16,
          style: {
            color: 'var(--text-subtle)'
          }
        }), /*#__PURE__*/_jsx("span", {
          style: {
            flex: 1,
            fontSize: 'var(--text-sm)',
            color: 'var(--text-subtle)'
          },
          children: "Search or ask AI…"
        }), /*#__PURE__*/_jsx("span", {
          style: {
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-2xs)',
            color: 'var(--text-subtle)',
            background: 'var(--slate-0)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-xs)',
            padding: '1px 5px'
          },
          children: "⌘K"
        })]
      }), /*#__PURE__*/_jsxs("button", {
        onClick: onOpenAI,
        style: {
          display: 'inline-flex',
          alignItems: 'center',
          gap: 7,
          height: 36,
          padding: '0 13px',
          borderRadius: 'var(--radius-md)',
          background: 'var(--grad-brand)',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          boxShadow: 'var(--shadow-brand)',
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--fw-semibold)'
        },
        children: [/*#__PURE__*/_jsx(Icon, {
          name: "sparkles",
          size: 16
        }), " Ask AI"]
      }), /*#__PURE__*/_jsx(IconButton, {
        label: "Notifications",
        variant: "ghost",
        children: /*#__PURE__*/_jsx(Icon, {
          name: "bell",
          size: 18
        })
      }), /*#__PURE__*/_jsx(Avatar, {
        name: "Sara Khan",
        status: "online"
      })]
    });
  }
  function AppShell({
    active,
    onNavigate,
    title,
    crumb,
    onOpenAI,
    children
  }) {
    useLucide();
    return /*#__PURE__*/_jsxs("div", {
      style: {
        display: 'flex',
        height: '100%',
        width: '100%',
        background: 'var(--surface-page)'
      },
      children: [/*#__PURE__*/_jsx(Sidebar, {
        active: active,
        onNavigate: onNavigate
      }), /*#__PURE__*/_jsxs("div", {
        style: {
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          height: '100%'
        },
        children: [/*#__PURE__*/_jsx(TopBar, {
          title: title,
          crumb: crumb,
          onOpenAI: onOpenAI
        }), /*#__PURE__*/_jsx("main", {
          className: "tf-scroll",
          style: {
            flex: 1,
            overflowY: 'auto'
          },
          children: children
        })]
      })]
    });
  }
  Object.assign(window, {
    AppShell,
    Sidebar,
    TopBar
  });
})();