import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Tasks — Kanban board screen.
(() => {
  const {
    Card,
    Badge,
    Avatar,
    AvatarGroup,
    Tabs
  } = window.TechyFuelOSDesignSystem_be0222;
  const TF_PRIORITY = {
    urgent: {
      color: 'var(--red-600)',
      bg: 'var(--red-50)',
      label: 'Urgent',
      icon: 'chevrons-up'
    },
    high: {
      color: 'var(--amber-600)',
      bg: 'var(--amber-50)',
      label: 'High',
      icon: 'chevron-up'
    },
    medium: {
      color: 'var(--blue-600)',
      bg: 'var(--blue-50)',
      label: 'Medium',
      icon: 'equal'
    },
    low: {
      color: 'var(--slate-500)',
      bg: 'var(--slate-100)',
      label: 'Low',
      icon: 'chevron-down'
    }
  };
  const TYPE_TONE = {
    Design: 'violet',
    Video: 'teal',
    Ads: 'brand',
    Web: 'info',
    SEO: 'warning',
    Social: 'success'
  };
  const TF_COLUMNS = [{
    id: 'backlog',
    label: 'Backlog',
    dot: 'var(--slate-400)',
    tasks: [{
      t: 'Q3 content strategy deck',
      type: 'Social',
      pri: 'low',
      who: 'Lena Cruz',
      due: 'Jul 2',
      sub: '0/4'
    }, {
      t: 'Competitor SEO audit — Orbit',
      type: 'SEO',
      pri: 'medium',
      who: 'Jay Park',
      due: 'Jul 5',
      sub: '1/6'
    }]
  }, {
    id: 'todo',
    label: 'To do',
    dot: 'var(--blue-500)',
    tasks: [{
      t: 'Reels batch — Peak Fitness',
      type: 'Video',
      pri: 'high',
      who: 'Omar Ali',
      due: 'Jun 24',
      sub: '2/8',
      cmt: 3
    }, {
      t: 'Landing page wireframes',
      type: 'Web',
      pri: 'medium',
      who: 'Mia Wu',
      due: 'Jun 25',
      sub: '0/5'
    }, {
      t: 'Meta ad creatives v3',
      type: 'Ads',
      pri: 'urgent',
      who: 'Sara Khan',
      due: 'Today',
      sub: '3/5',
      cmt: 6
    }]
  }, {
    id: 'progress',
    label: 'In progress',
    dot: 'var(--violet-500)',
    tasks: [{
      t: 'Homepage hero design',
      type: 'Design',
      pri: 'high',
      who: 'Sara Khan',
      due: 'Jun 23',
      sub: '4/6',
      cmt: 2,
      team: ['Sara Khan', 'Mia Wu']
    }, {
      t: 'Brand kit — Mediva',
      type: 'Design',
      pri: 'medium',
      who: 'Tom Reed',
      due: 'Jun 27',
      sub: '2/7'
    }]
  }, {
    id: 'review',
    label: 'Review',
    dot: 'var(--amber-500)',
    tasks: [{
      t: 'Launch campaign captions',
      type: 'Social',
      pri: 'urgent',
      who: 'Lena Cruz',
      due: 'Today',
      sub: '5/5',
      cmt: 1,
      flag: true
    }, {
      t: 'Product demo edit',
      type: 'Video',
      pri: 'high',
      who: 'Omar Ali',
      due: 'Jun 23',
      sub: '6/6'
    }]
  }, {
    id: 'done',
    label: 'Completed',
    dot: 'var(--green-500)',
    tasks: [{
      t: 'Logo refresh — Nova',
      type: 'Design',
      pri: 'medium',
      who: 'Sara Khan',
      due: 'Jun 18',
      sub: '6/6',
      done: true
    }, {
      t: 'June ad report',
      type: 'Ads',
      pri: 'low',
      who: 'Jay Park',
      due: 'Jun 17',
      sub: '3/3',
      done: true
    }]
  }];
  function TaskCard({
    task
  }) {
    const [hover, setHover] = React.useState(false);
    const p = TF_PRIORITY[task.pri];
    return /*#__PURE__*/_jsxs("div", {
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => setHover(false),
      style: {
        background: 'var(--slate-0)',
        border: `1px solid ${hover ? 'var(--slate-200)' : 'var(--border-subtle)'}`,
        borderRadius: 'var(--radius-lg)',
        padding: 12,
        boxShadow: hover ? 'var(--shadow-md)' : 'var(--shadow-xs)',
        cursor: 'grab',
        transform: hover ? 'translateY(-1px)' : 'none',
        transition: 'all var(--dur-fast) var(--ease-out)'
      },
      children: [/*#__PURE__*/_jsxs("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          marginBottom: 8
        },
        children: [/*#__PURE__*/_jsx(Badge, {
          tone: TYPE_TONE[task.type],
          size: "sm",
          children: task.type
        }), /*#__PURE__*/_jsxs("span", {
          style: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: 2,
            fontSize: 'var(--text-2xs)',
            fontWeight: 'var(--fw-bold)',
            color: p.color,
            background: p.bg,
            borderRadius: 'var(--radius-full)',
            padding: '2px 7px'
          },
          children: [/*#__PURE__*/_jsx(Icon, {
            name: p.icon,
            size: 12
          }), " ", p.label]
        }), task.flag && /*#__PURE__*/_jsx(Icon, {
          name: "flag",
          size: 13,
          style: {
            color: 'var(--red-500)',
            marginLeft: 'auto'
          }
        })]
      }), /*#__PURE__*/_jsx("div", {
        style: {
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--fw-semibold)',
          color: 'var(--text-strong)',
          lineHeight: 1.4,
          marginBottom: 10,
          textDecoration: task.done ? 'line-through' : 'none',
          opacity: task.done ? 0.6 : 1
        },
        children: task.t
      }), /*#__PURE__*/_jsxs("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          color: 'var(--text-muted)',
          fontSize: 'var(--text-xs)'
        },
        children: [/*#__PURE__*/_jsxs("span", {
          style: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4
          },
          children: [/*#__PURE__*/_jsx(Icon, {
            name: "check-square",
            size: 13
          }), " ", task.sub]
        }), task.cmt && /*#__PURE__*/_jsxs("span", {
          style: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4
          },
          children: [/*#__PURE__*/_jsx(Icon, {
            name: "message-square",
            size: 13
          }), " ", task.cmt]
        }), /*#__PURE__*/_jsxs("span", {
          style: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            color: task.due === 'Today' ? 'var(--red-600)' : 'var(--text-muted)',
            fontWeight: task.due === 'Today' ? 'var(--fw-bold)' : 'var(--fw-medium)'
          },
          children: [/*#__PURE__*/_jsx(Icon, {
            name: "calendar",
            size: 13
          }), " ", task.due]
        }), /*#__PURE__*/_jsx("div", {
          style: {
            marginLeft: 'auto'
          },
          children: task.team ? /*#__PURE__*/_jsx(AvatarGroup, {
            people: task.team,
            size: "xs",
            max: 2
          }) : /*#__PURE__*/_jsx(Avatar, {
            name: task.who,
            size: "xs"
          })
        })]
      })]
    });
  }
  function TasksBoard() {
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
          marginBottom: 14,
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
            children: "Tasks"
          }), /*#__PURE__*/_jsx("p", {
            style: {
              fontSize: 'var(--text-sm)',
              color: 'var(--text-muted)',
              marginTop: 2
            },
            children: "All projects · 24 open tasks"
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
          }), " Add task"]
        })]
      }), /*#__PURE__*/_jsx("div", {
        style: {
          marginBottom: 16
        },
        children: /*#__PURE__*/_jsx(Tabs, {
          defaultValue: "kanban",
          tabs: [{
            id: 'list',
            label: 'List',
            icon: /*#__PURE__*/_jsx(Icon, {
              name: "list",
              size: 16
            })
          }, {
            id: 'kanban',
            label: 'Board',
            icon: /*#__PURE__*/_jsx(Icon, {
              name: "columns-3",
              size: 16
            }),
            count: 24
          }, {
            id: 'calendar',
            label: 'Calendar',
            icon: /*#__PURE__*/_jsx(Icon, {
              name: "calendar",
              size: 16
            })
          }]
        })
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
        children: TF_COLUMNS.map(col => /*#__PURE__*/_jsxs("div", {
          style: {
            width: 268,
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
                background: col.dot
              }
            }), /*#__PURE__*/_jsx("span", {
              style: {
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--fw-bold)',
                color: 'var(--text-strong)'
              },
              children: col.label
            }), /*#__PURE__*/_jsx("span", {
              style: {
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--fw-bold)',
                color: 'var(--text-muted)',
                background: 'var(--slate-150)',
                borderRadius: 'var(--radius-full)',
                padding: '0px 7px',
                fontVariantNumeric: 'tabular-nums'
              },
              children: col.tasks.length
            }), /*#__PURE__*/_jsx(Icon, {
              name: "plus",
              size: 15,
              style: {
                color: 'var(--text-subtle)',
                marginLeft: 'auto',
                cursor: 'pointer'
              }
            })]
          }), /*#__PURE__*/_jsxs("div", {
            style: {
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              background: 'var(--slate-100)',
              borderRadius: 'var(--radius-xl)',
              padding: 10,
              minHeight: 120
            },
            children: [col.tasks.map((t, i) => /*#__PURE__*/_jsx(TaskCard, {
              task: t
            }, i)), /*#__PURE__*/_jsxs("button", {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                padding: '8px 0',
                background: 'transparent',
                border: '1px dashed var(--border-strong)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--fw-semibold)',
                cursor: 'pointer'
              },
              children: [/*#__PURE__*/_jsx(Icon, {
                name: "plus",
                size: 14
              }), " Add task"]
            })]
          })]
        }, col.id))
      })]
    });
  }
  Object.assign(window, {
    TasksBoard
  });
})();