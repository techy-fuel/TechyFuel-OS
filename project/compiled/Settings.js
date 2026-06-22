// Settings screen.
(() => {
  const {
    Card,
    Badge,
    Avatar,
    Switch,
    Input
  } = window.TechyFuelOSDesignSystem_be0222;
  const NAV = [['building-2', 'Agency branding', true], ['shield-check', 'Team permissions', false], ['bell', 'Email notifications', false], ['plug', 'Integrations', false], ['key-round', 'API access', false]];
  const INTEGRATIONS = [{
    name: 'Meta Business',
    icon: 'facebook',
    tone: 'var(--blue-600)',
    on: true
  }, {
    name: 'Google Ads',
    icon: 'badge-dollar-sign',
    tone: 'var(--green-600)',
    on: true
  }, {
    name: 'Slack',
    icon: 'slack',
    tone: 'var(--violet-500)',
    on: true
  }, {
    name: 'Stripe',
    icon: 'credit-card',
    tone: 'var(--blue-500)',
    on: false
  }];
  function Row({
    title,
    desc,
    control
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '14px 0',
        borderBottom: '1px solid var(--border-subtle)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-semibold)',
        color: 'var(--text-strong)'
      }
    }, title), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-xs)',
        color: 'var(--text-muted)',
        marginTop: 2
      }
    }, desc)), control);
  }
  function Settings() {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 24,
        maxWidth: 1100,
        margin: '0 auto'
      }
    }, /*#__PURE__*/React.createElement("h1", {
      style: {
        fontSize: 'var(--text-3xl)',
        fontWeight: 'var(--fw-extrabold)',
        letterSpacing: '-0.02em',
        marginBottom: 18
      }
    }, "Settings"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '220px 1fr',
        gap: 20,
        alignItems: 'start'
      }
    }, /*#__PURE__*/React.createElement(Card, {
      padding: "sm",
      style: {
        position: 'sticky',
        top: 84
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }
    }, NAV.map(([ic, l, act], i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 10px',
        borderRadius: 'var(--radius-md)',
        background: act ? 'var(--blue-50)' : 'transparent',
        color: act ? 'var(--blue-700)' : 'var(--text-body)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-medium)',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: ic,
      size: 17,
      style: {
        color: act ? 'var(--blue-600)' : 'var(--text-muted)'
      }
    }), l)))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
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
    }, "Agency branding"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 'var(--text-sm)',
        color: 'var(--text-muted)',
        marginBottom: 16
      }
    }, "This appears across the client portal and reports."), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        marginBottom: 18
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 56,
        height: 56,
        borderRadius: 'var(--radius-xl)',
        background: 'var(--grad-brand)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 'var(--shadow-brand)'
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: "../../assets/techyfuel-mark.png",
      alt: "",
      style: {
        height: 32,
        filter: 'brightness(0) invert(1)'
      }
    })), /*#__PURE__*/React.createElement("button", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        height: 34,
        padding: '0 13px',
        background: 'var(--slate-0)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-md)',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-semibold)',
        color: 'var(--text-body)',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "upload",
      size: 15
    }), " Upload logo")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement(Input, {
      label: "Agency name",
      defaultValue: "Bright Pixel Co."
    }), /*#__PURE__*/React.createElement(Input, {
      label: "Support email",
      defaultValue: "hello@brightpixel.co",
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "mail",
        size: 16
      })
    }))), /*#__PURE__*/React.createElement(Card, {
      padding: "lg"
    }, /*#__PURE__*/React.createElement("h3", {
      style: {
        fontSize: 'var(--text-lg)',
        fontWeight: 'var(--fw-bold)',
        marginBottom: 4
      }
    }, "Email notifications"), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 8
      }
    }, /*#__PURE__*/React.createElement(Row, {
      title: "New client approvals",
      desc: "When a client approves or requests a revision",
      control: /*#__PURE__*/React.createElement(Switch, {
        defaultChecked: true
      })
    }), /*#__PURE__*/React.createElement(Row, {
      title: "Deadline reminders",
      desc: "Daily digest of tasks due within 48 hours",
      control: /*#__PURE__*/React.createElement(Switch, {
        defaultChecked: true
      })
    }), /*#__PURE__*/React.createElement(Row, {
      title: "AI risk alerts",
      desc: "When the assistant detects a deadline or budget risk",
      control: /*#__PURE__*/React.createElement(Switch, {
        defaultChecked: true
      })
    }), /*#__PURE__*/React.createElement(Row, {
      title: "Weekly summary",
      desc: "Monday recap of revenue, tasks and pipeline",
      control: /*#__PURE__*/React.createElement(Switch, null)
    }))), /*#__PURE__*/React.createElement(Card, {
      padding: "lg"
    }, /*#__PURE__*/React.createElement("h3", {
      style: {
        fontSize: 'var(--text-lg)',
        fontWeight: 'var(--fw-bold)',
        marginBottom: 16
      }
    }, "Integrations"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 12
      }
    }, INTEGRATIONS.map((it, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: 12,
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--slate-50)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 36,
        height: 36,
        borderRadius: 'var(--radius-md)',
        background: 'var(--slate-0)',
        border: '1px solid var(--border-subtle)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: it.tone
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: it.icon,
      size: 18
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-semibold)',
        color: 'var(--text-strong)'
      }
    }, it.name), it.on ? /*#__PURE__*/React.createElement(Badge, {
      tone: "success",
      dot: true
    }, "Connected") : /*#__PURE__*/React.createElement("button", {
      style: {
        height: 28,
        padding: '0 12px',
        background: 'var(--blue-600)',
        color: '#fff',
        border: 'none',
        borderRadius: 'var(--radius-md)',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--fw-semibold)',
        cursor: 'pointer'
      }
    }, "Connect"))))))));
  }
  Object.assign(window, {
    Settings
  });
})();