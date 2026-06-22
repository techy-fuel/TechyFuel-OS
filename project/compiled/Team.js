// Team screen — members by department + workload.
(() => {
  const {
    Card,
    Badge,
    Avatar,
    ProgressBar
  } = window.TechyFuelOSDesignSystem_be0222;
  const DEPT = {
    Design: 'violet',
    Video: 'teal',
    Marketing: 'success',
    Development: 'info',
    Sales: 'warning',
    Admin: 'neutral'
  };
  const TEAM = [{
    name: 'Sara Khan',
    role: 'Creative Lead',
    dept: 'Design',
    load: 88,
    tasks: 12,
    status: 'online'
  }, {
    name: 'Omar Ali',
    role: 'Senior Editor',
    dept: 'Video',
    load: 72,
    tasks: 9,
    status: 'online'
  }, {
    name: 'Lena Cruz',
    role: 'Social Manager',
    dept: 'Marketing',
    load: 64,
    tasks: 14,
    status: 'busy'
  }, {
    name: 'Jay Park',
    role: 'Full-stack Dev',
    dept: 'Development',
    load: 91,
    tasks: 7,
    status: 'busy'
  }, {
    name: 'Mia Wu',
    role: 'UI Designer',
    dept: 'Design',
    load: 55,
    tasks: 8,
    status: 'away'
  }, {
    name: 'Tom Reed',
    role: 'Account Exec',
    dept: 'Sales',
    load: 43,
    tasks: 6,
    status: 'online'
  }];
  function Team() {
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
    }, "Team"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 'var(--text-sm)',
        color: 'var(--text-muted)',
        marginTop: 2
      }
    }, "14 members · 6 departments · 69% avg utilization")), /*#__PURE__*/React.createElement("button", {
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
      name: "user-plus",
      size: 16
    }), " Invite member")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        flexWrap: 'wrap',
        marginBottom: 18
      }
    }, Object.keys(DEPT).map(d => /*#__PURE__*/React.createElement("span", {
      key: d,
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        padding: '6px 12px',
        background: 'var(--slate-0)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-full)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-semibold)',
        color: 'var(--text-body)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: `var(--${DEPT[d] === 'neutral' ? 'slate-400' : DEPT[d] === 'info' ? 'blue-500' : DEPT[d] + '-500'})`
      }
    }), d))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 16
      }
    }, TEAM.map((m, i) => /*#__PURE__*/React.createElement(Card, {
      key: i,
      interactive: true,
      padding: "md"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: m.name,
      size: "lg",
      status: m.status
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-md)',
        fontWeight: 'var(--fw-bold)',
        color: 'var(--text-strong)'
      }
    }, m.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-xs)',
        color: 'var(--text-muted)'
      }
    }, m.role)), /*#__PURE__*/React.createElement(Badge, {
      tone: DEPT[m.dept],
      size: "sm"
    }, m.dept)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        marginBottom: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: 'var(--text-xs)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--text-muted)',
        fontWeight: 'var(--fw-semibold)'
      }
    }, "Workload"), /*#__PURE__*/React.createElement("span", {
      style: {
        color: m.load > 85 ? 'var(--red-600)' : 'var(--text-strong)',
        fontWeight: 'var(--fw-bold)'
      }
    }, m.load, "%")), /*#__PURE__*/React.createElement(ProgressBar, {
      value: m.load,
      tone: m.load > 85 ? 'danger' : m.load > 70 ? 'warning' : 'brand',
      size: "sm"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 16,
        paddingTop: 12,
        borderTop: '1px solid var(--border-subtle)',
        fontSize: 'var(--text-xs)',
        color: 'var(--text-muted)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "circle-check-big",
      size: 14
    }), " ", m.tasks, " active tasks"))))));
  }
  Object.assign(window, {
    Team
  });
})();