import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Projects screen — project cards grid.
(() => {
  const {
    Card,
    Badge,
    AvatarGroup,
    ProgressBar
  } = window.TechyFuelOSDesignSystem_be0222;
  const PT = {
    Design: 'violet',
    Video: 'teal',
    'Social Media': 'success',
    'Meta Ads': 'brand',
    'Web Dev': 'info',
    SEO: 'warning'
  };
  const PS = {
    planning: ['neutral', 'Planning'],
    progress: ['info', 'In progress'],
    review: ['warning', 'Review'],
    approval: ['violet', 'Client approval'],
    done: ['success', 'Completed']
  };
  const PROJECTS = [{
    name: 'Summer launch campaign',
    client: 'Nova Skincare',
    type: 'Meta Ads',
    status: 'progress',
    pct: 78,
    budget: '$12.4K',
    spent: 72,
    team: ['Sara Khan', 'Omar Ali', 'Lena Cruz'],
    due: 'Jun 28'
  }, {
    name: 'Web build — phase 2',
    client: 'Orbit Inc.',
    type: 'Web Dev',
    status: 'progress',
    pct: 64,
    budget: '$28.9K',
    spent: 58,
    team: ['Jay Park', 'Mia Wu'],
    due: 'Jul 4'
  }, {
    name: 'Brand kit & guidelines',
    client: 'Mediva Health',
    type: 'Design',
    status: 'approval',
    pct: 90,
    budget: '$18.0K',
    spent: 81,
    team: ['Sara Khan', 'Tom Reed'],
    due: 'Jun 27'
  }, {
    name: 'Monthly content — June',
    client: 'Peak Fitness',
    type: 'Social Media',
    status: 'review',
    pct: 45,
    budget: '$9.2K',
    spent: 40,
    team: ['Omar Ali', 'Lena Cruz'],
    due: 'Jun 24'
  }, {
    name: 'SEO foundation audit',
    client: 'Atlas Realty',
    type: 'SEO',
    status: 'planning',
    pct: 12,
    budget: '$6.0K',
    spent: 8,
    team: ['Jay Park'],
    due: 'Jul 10'
  }, {
    name: 'Product demo series',
    client: 'Verde Foods',
    type: 'Video',
    status: 'done',
    pct: 100,
    budget: '$22.3K',
    spent: 96,
    team: ['Omar Ali', 'Mia Wu', 'Tom Reed'],
    due: 'Jun 18'
  }];
  function ProjectCard({
    p
  }) {
    const [st, sl] = PS[p.status];
    return /*#__PURE__*/_jsxs(Card, {
      interactive: true,
      padding: "md",
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 14
      },
      children: [/*#__PURE__*/_jsxs("div", {
        style: {
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 8
        },
        children: [/*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsx("div", {
            style: {
              fontSize: 'var(--text-md)',
              fontWeight: 'var(--fw-bold)',
              color: 'var(--text-strong)',
              letterSpacing: '-0.01em'
            },
            children: p.name
          }), /*#__PURE__*/_jsx("div", {
            style: {
              fontSize: 'var(--text-xs)',
              color: 'var(--text-muted)',
              marginTop: 2
            },
            children: p.client
          })]
        }), /*#__PURE__*/_jsx(Icon, {
          name: "more-horizontal",
          size: 18,
          style: {
            color: 'var(--text-subtle)',
            cursor: 'pointer',
            flex: 'none'
          }
        })]
      }), /*#__PURE__*/_jsxs("div", {
        style: {
          display: 'flex',
          gap: 6
        },
        children: [/*#__PURE__*/_jsx(Badge, {
          tone: PT[p.type],
          size: "sm",
          children: p.type
        }), /*#__PURE__*/_jsx(Badge, {
          tone: st,
          dot: true,
          children: sl
        })]
      }), /*#__PURE__*/_jsxs("div", {
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: 6
        },
        children: [/*#__PURE__*/_jsxs("div", {
          style: {
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 'var(--text-xs)'
          },
          children: [/*#__PURE__*/_jsx("span", {
            style: {
              color: 'var(--text-muted)',
              fontWeight: 'var(--fw-semibold)'
            },
            children: "Progress"
          }), /*#__PURE__*/_jsxs("span", {
            style: {
              color: 'var(--text-strong)',
              fontWeight: 'var(--fw-bold)'
            },
            children: [p.pct, "%"]
          })]
        }), /*#__PURE__*/_jsx(ProgressBar, {
          value: p.pct,
          tone: p.status === 'done' ? 'success' : 'brand',
          size: "sm"
        })]
      }), /*#__PURE__*/_jsxs("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: 12,
          borderTop: '1px solid var(--border-subtle)'
        },
        children: [/*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsxs("div", {
            style: {
              fontSize: 'var(--text-2xs)',
              color: 'var(--text-subtle)',
              textTransform: 'uppercase',
              letterSpacing: 'var(--tracking-wide)',
              fontWeight: 'var(--fw-bold)'
            },
            children: ["Budget · ", p.spent, "% used"]
          }), /*#__PURE__*/_jsx("div", {
            style: {
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--fw-bold)',
              color: 'var(--text-strong)',
              fontVariantNumeric: 'tabular-nums'
            },
            children: p.budget
          })]
        }), /*#__PURE__*/_jsxs("div", {
          style: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: 6
          },
          children: [/*#__PURE__*/_jsx(AvatarGroup, {
            people: p.team,
            size: "xs",
            max: 3
          }), /*#__PURE__*/_jsxs("span", {
            style: {
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 'var(--text-xs)',
              color: 'var(--text-muted)'
            },
            children: [/*#__PURE__*/_jsx(Icon, {
              name: "calendar",
              size: 13
            }), " ", p.due]
          })]
        })]
      })]
    });
  }
  function Projects() {
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
            children: "Projects"
          }), /*#__PURE__*/_jsx("p", {
            style: {
              fontSize: 'var(--text-sm)',
              color: 'var(--text-muted)',
              marginTop: 2
            },
            children: "27 active · $96.8K in committed budget"
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
          }), " New project"]
        })]
      }), /*#__PURE__*/_jsx("div", {
        style: {
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16
        },
        children: PROJECTS.map((p, i) => /*#__PURE__*/_jsx(ProjectCard, {
          p: p
        }, i))
      })]
    });
  }
  Object.assign(window, {
    Projects
  });
})();