import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Content calendar screen — weekly social planner.
(() => {
  const {
    Card,
    Badge,
    Avatar
  } = window.TechyFuelOSDesignSystem_be0222;
  const PLAT = {
    instagram: ['instagram', 'var(--violet-500)'],
    facebook: ['facebook', 'var(--blue-600)'],
    linkedin: ['linkedin', 'var(--sky-600)'],
    youtube: ['youtube', 'var(--red-500)'],
    tiktok: ['music', 'var(--slate-900)']
  };
  const DAYS = ['Mon 23', 'Tue 24', 'Wed 25', 'Thu 26', 'Fri 27', 'Sat 28', 'Sun 29'];
  const POSTS = {
    0: [{
      p: 'instagram',
      t: 'Reel — morning routine',
      s: 'scheduled',
      who: 'Lena Cruz'
    }, {
      p: 'facebook',
      t: 'Carousel — 5 tips',
      s: 'draft',
      who: 'Omar Ali'
    }],
    1: [{
      p: 'linkedin',
      t: 'Founder story post',
      s: 'approval',
      who: 'Sara Khan'
    }],
    2: [{
      p: 'youtube',
      t: 'Product demo (long)',
      s: 'scheduled',
      who: 'Omar Ali'
    }, {
      p: 'tiktok',
      t: 'Trend remix',
      s: 'draft',
      who: 'Lena Cruz'
    }],
    3: [{
      p: 'instagram',
      t: 'UGC repost',
      s: 'scheduled',
      who: 'Lena Cruz'
    }],
    4: [{
      p: 'instagram',
      t: 'Launch teaser',
      s: 'approval',
      who: 'Sara Khan'
    }, {
      p: 'facebook',
      t: 'Event promo',
      s: 'scheduled',
      who: 'Omar Ali'
    }],
    5: [],
    6: [{
      p: 'linkedin',
      t: 'Weekly recap',
      s: 'draft',
      who: 'Sara Khan'
    }]
  };
  const SS = {
    scheduled: ['success', 'Scheduled'],
    draft: ['neutral', 'Draft'],
    approval: ['warning', 'Approval']
  };
  function PostCard({
    post
  }) {
    const [pi, pc] = PLAT[post.p];
    const [st, sl] = SS[post.s];
    return /*#__PURE__*/_jsxs("div", {
      style: {
        background: 'var(--slate-0)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: 9,
        boxShadow: 'var(--shadow-xs)',
        cursor: 'pointer'
      },
      children: [/*#__PURE__*/_jsxs("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          marginBottom: 6
        },
        children: [/*#__PURE__*/_jsx("span", {
          style: {
            width: 22,
            height: 22,
            borderRadius: 'var(--radius-sm)',
            background: 'var(--slate-50)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: pc
          },
          children: /*#__PURE__*/_jsx(Icon, {
            name: pi,
            size: 13
          })
        }), /*#__PURE__*/_jsx(Badge, {
          tone: st,
          size: "sm",
          children: sl
        })]
      }), /*#__PURE__*/_jsx("div", {
        style: {
          fontSize: 'var(--text-xs)',
          fontWeight: 'var(--fw-semibold)',
          color: 'var(--text-strong)',
          lineHeight: 1.35
        },
        children: post.t
      })]
    });
  }
  function ContentCalendar() {
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
            children: "Content calendar"
          }), /*#__PURE__*/_jsx("p", {
            style: {
              fontSize: 'var(--text-sm)',
              color: 'var(--text-muted)',
              marginTop: 2
            },
            children: "Week of Jun 23 · 9 posts across 5 platforms"
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
              gap: 6,
              height: 36,
              padding: '0 10px',
              background: 'var(--slate-0)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-md)'
            },
            children: [/*#__PURE__*/_jsx(Icon, {
              name: "chevron-left",
              size: 16,
              style: {
                color: 'var(--text-muted)',
                cursor: 'pointer'
              }
            }), /*#__PURE__*/_jsx("span", {
              style: {
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--fw-semibold)',
                color: 'var(--text-body)'
              },
              children: "This week"
            }), /*#__PURE__*/_jsx(Icon, {
              name: "chevron-right",
              size: 16,
              style: {
                color: 'var(--text-muted)',
                cursor: 'pointer'
              }
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
            }), " Plan post"]
          })]
        })]
      }), /*#__PURE__*/_jsx(Card, {
        padding: "none",
        style: {
          overflow: 'hidden'
        },
        children: /*#__PURE__*/_jsx("div", {
          style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)'
          },
          children: DAYS.map((d, i) => /*#__PURE__*/_jsxs("div", {
            style: {
              borderRight: i < 6 ? '1px solid var(--border-subtle)' : 'none',
              minHeight: 360
            },
            children: [/*#__PURE__*/_jsx("div", {
              style: {
                padding: '11px 12px',
                borderBottom: '1px solid var(--border-subtle)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--fw-bold)',
                color: i === 4 ? 'var(--blue-700)' : 'var(--text-strong)',
                background: i === 4 ? 'var(--blue-50)' : 'transparent'
              },
              children: d
            }), /*#__PURE__*/_jsx("div", {
              style: {
                padding: 8,
                display: 'flex',
                flexDirection: 'column',
                gap: 8
              },
              children: (POSTS[i] || []).map((p, j) => /*#__PURE__*/_jsx(PostCard, {
                post: p
              }, j))
            })]
          }, i))
        })
      })]
    });
  }
  Object.assign(window, {
    ContentCalendar
  });
})();