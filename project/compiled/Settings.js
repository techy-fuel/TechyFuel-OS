// Settings screen.
(() => {
  const {
    Card,
    Badge,
    Avatar,
    Switch
  } = window.TechyFuelOSDesignSystem_be0222;
  const NAV_ITEMS = [['building-2', 'Agency branding'], ['users', 'Team permissions'], ['bell', 'Email notifications'], ['plug', 'Integrations'], ['key-round', 'API access']];
  const STORAGE_KEY = 'tf_settings';
  function loadSaved() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    } catch {
      return {};
    }
  }
  function saveSettings(obj) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
    } catch {}
  }

  /* ── Notification row ─────────────────────────────────────────── */
  function NotifRow({
    title,
    desc,
    field,
    notif,
    setNotif
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
    }, desc)), /*#__PURE__*/React.createElement(Switch, {
      checked: !!notif[field],
      onChange: v => {
        const next = {
          ...notif,
          [field]: v
        };
        setNotif(next);
        const saved = loadSaved();
        saveSettings({
          ...saved,
          notifications: next
        });
      }
    }));
  }

  /* ── Settings ─────────────────────────────────────────────────── */
  function Settings() {
    const saved = loadSaved();
    const [tab, setTab] = React.useState('Agency branding');
    const [team, setTeam] = React.useState([]);
    const [agencyName, setAgencyName] = React.useState(saved.agencyName || '');
    const [agencyEmail, setAgencyEmail] = React.useState(saved.agencyEmail || '');
    const [logoUrl, setLogoUrl] = React.useState(saved.logoUrl || '');
    const [saved2, setSaved2] = React.useState(false);
    const [toast, setToast] = React.useState('');
    const logoInputRef = React.useRef(null);
    function showToast(msg) {
      setToast(msg);
      setTimeout(() => setToast(''), 3000);
    }
    const defaultNotif = {
      approvals: true,
      deadlines: true,
      ai_alerts: true,
      weekly: false
    };
    const [notif, setNotif] = React.useState({
      ...defaultNotif,
      ...(saved.notifications || {})
    });
    const [integ, setInteg] = React.useState(saved.integrations || {
      meta: false,
      google: false,
      slack: false,
      stripe: false
    });
    const [apiKey] = React.useState(saved.apiKey || 'tf_live_' + Math.random().toString(36).slice(2, 18));
    React.useEffect(() => {
      if (!window.API) return;
      (async () => {
        try {
          const {
            data
          } = await window.API.getTeam();
          if (data) setTeam(data);
        } catch {}
      })();
      const sk = loadSaved();
      if (!sk.apiKey) saveSettings({
        ...sk,
        apiKey
      });
    }, []);
    function handleSaveBranding() {
      const sk = loadSaved();
      saveSettings({
        ...sk,
        agencyName,
        agencyEmail,
        logoUrl
      });
      setSaved2(true);
      showToast('Branding saved!');
      setTimeout(() => setSaved2(false), 2500);
    }
    function handleLogoUpload(e) {
      const file = e.target.files[0];
      if (!file) return;
      if (file.size > 2 * 1024 * 1024) {
        showToast('Image must be under 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = ev => {
        setLogoUrl(ev.target.result);
        showToast('Logo ready — click Save changes to apply');
      };
      reader.readAsDataURL(file);
    }
    function toggleInteg(key) {
      const next = {
        ...integ,
        [key]: !integ[key]
      };
      setInteg(next);
      const sk = loadSaved();
      saveSettings({
        ...sk,
        integrations: next
      });
    }
    const inputStyle = {
      width: '100%',
      height: 36,
      padding: '0 10px',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-md)',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-sm)',
      color: 'var(--text-strong)',
      background: 'var(--slate-0)',
      boxSizing: 'border-box',
      outline: 'none'
    };
    const INTEG_LIST = [{
      key: 'meta',
      name: 'Meta Business',
      icon: 'facebook',
      color: 'var(--blue-600)'
    }, {
      key: 'google',
      name: 'Google Ads',
      icon: 'badge-dollar-sign',
      color: 'var(--green-600)'
    }, {
      key: 'slack',
      name: 'Slack',
      icon: 'slack',
      color: 'var(--violet-500)'
    }, {
      key: 'stripe',
      name: 'Stripe',
      icon: 'credit-card',
      color: 'var(--blue-500)'
    }];
    const ROLE_COLORS = {
      admin: 'var(--violet-600)',
      manager: 'var(--blue-600)',
      member: 'var(--green-700)',
      viewer: 'var(--slate-500)'
    };
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
    }, "Settings"), toast && /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'fixed',
        top: 20,
        right: 24,
        zIndex: 9999,
        background: 'var(--green-600)',
        color: '#fff',
        padding: '10px 18px',
        borderRadius: 'var(--radius-md)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-semibold)',
        boxShadow: 'var(--shadow-xl)',
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 16
    }), " ", toast), /*#__PURE__*/React.createElement("div", {
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
    }, NAV_ITEMS.map(([ic, label]) => {
      const act = tab === label;
      return /*#__PURE__*/React.createElement("div", {
        key: label,
        onClick: () => setTab(label),
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '8px 10px',
          borderRadius: 'var(--radius-md)',
          background: act ? 'var(--blue-50)' : 'transparent',
          color: act ? 'var(--blue-700)' : 'var(--text-body)',
          fontSize: 'var(--text-sm)',
          fontWeight: act ? 'var(--fw-semibold)' : 'var(--fw-medium)',
          cursor: 'pointer',
          transition: 'background 0.12s'
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: ic,
        size: 17,
        style: {
          color: act ? 'var(--blue-600)' : 'var(--text-muted)'
        }
      }), label);
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }
    }, tab === 'Agency branding' && /*#__PURE__*/React.createElement(Card, {
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
        marginBottom: 20
      }
    }, "Appears across the client portal and reports."), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        marginBottom: 20
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 56,
        height: 56,
        borderRadius: 'var(--radius-xl)',
        background: logoUrl ? 'var(--slate-100)' : 'var(--grad-brand)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 'var(--shadow-brand)',
        overflow: 'hidden'
      }
    }, logoUrl ? /*#__PURE__*/React.createElement("img", {
      src: logoUrl,
      alt: "Logo",
      style: {
        width: 56,
        height: 56,
        objectFit: 'cover'
      }
    }) : /*#__PURE__*/React.createElement("img", {
      src: "../../assets/techyfuel-mark.png",
      alt: "",
      style: {
        height: 32,
        filter: 'brightness(0) invert(1)'
      }
    })), /*#__PURE__*/React.createElement("input", {
      ref: logoInputRef,
      type: "file",
      accept: "image/*",
      style: {
        display: 'none'
      },
      onChange: handleLogoUpload
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => logoInputRef.current && logoInputRef.current.click(),
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
    }), " Upload logo"), logoUrl && /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        setLogoUrl('');
        showToast('Logo removed');
      },
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        height: 26,
        padding: '0 10px',
        background: 'transparent',
        border: 'none',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--fw-semibold)',
        color: 'var(--red-500)',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "x",
      size: 12
    }), " Remove"))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 16,
        marginBottom: 20
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
      style: {
        display: 'block',
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--fw-semibold)',
        color: 'var(--text-muted)',
        marginBottom: 6,
        textTransform: 'uppercase',
        letterSpacing: 'var(--tracking-caps)'
      }
    }, "Agency name"), /*#__PURE__*/React.createElement("input", {
      style: inputStyle,
      value: agencyName,
      onChange: e => setAgencyName(e.target.value),
      placeholder: "Your agency name"
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
      style: {
        display: 'block',
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--fw-semibold)',
        color: 'var(--text-muted)',
        marginBottom: 6,
        textTransform: 'uppercase',
        letterSpacing: 'var(--tracking-caps)'
      }
    }, "Support email"), /*#__PURE__*/React.createElement("input", {
      style: inputStyle,
      value: agencyEmail,
      onChange: e => setAgencyEmail(e.target.value),
      placeholder: "support@agency.com",
      type: "email"
    }))), /*#__PURE__*/React.createElement("button", {
      onClick: handleSaveBranding,
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        height: 36,
        padding: '0 18px',
        background: saved2 ? 'var(--green-600)' : 'var(--blue-600)',
        color: '#fff',
        border: 'none',
        borderRadius: 'var(--radius-md)',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-semibold)',
        cursor: 'pointer',
        transition: 'background 0.2s'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: saved2 ? 'check' : 'save',
      size: 16
    }), " ", saved2 ? 'Saved!' : 'Save changes')), tab === 'Team permissions' && /*#__PURE__*/React.createElement(Card, {
      padding: "lg"
    }, /*#__PURE__*/React.createElement("h3", {
      style: {
        fontSize: 'var(--text-lg)',
        fontWeight: 'var(--fw-bold)',
        marginBottom: 4
      }
    }, "Team permissions"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 'var(--text-sm)',
        color: 'var(--text-muted)',
        marginBottom: 20
      }
    }, "Manage your team members and their access levels."), team.length === 0 ? /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '32px 0',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: 'var(--text-sm)'
      }
    }, "No team members found.") : /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 0
      }
    }, team.map((m, i) => /*#__PURE__*/React.createElement("div", {
      key: m.id || i,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '12px 0',
        borderBottom: '1px solid var(--border-subtle)'
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: m.name,
      src: m.avatar_url,
      size: "sm"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-semibold)',
        color: 'var(--text-strong)'
      }
    }, m.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-xs)',
        color: 'var(--text-muted)'
      }
    }, m.email || m.role)), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--fw-semibold)',
        padding: '3px 10px',
        borderRadius: 'var(--radius-full)',
        background: 'var(--slate-100)',
        color: ROLE_COLORS[m.role] || 'var(--text-body)',
        textTransform: 'capitalize'
      }
    }, m.role || 'member'))))), tab === 'Email notifications' && /*#__PURE__*/React.createElement(Card, {
      padding: "lg"
    }, /*#__PURE__*/React.createElement("h3", {
      style: {
        fontSize: 'var(--text-lg)',
        fontWeight: 'var(--fw-bold)',
        marginBottom: 4
      }
    }, "Email notifications"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 'var(--text-sm)',
        color: 'var(--text-muted)',
        marginBottom: 8
      }
    }, "Choose which emails you receive. Changes save automatically."), /*#__PURE__*/React.createElement(NotifRow, {
      title: "New client approvals",
      desc: "When a client approves or requests a revision",
      field: "approvals",
      notif: notif,
      setNotif: setNotif
    }), /*#__PURE__*/React.createElement(NotifRow, {
      title: "Deadline reminders",
      desc: "Daily digest of tasks due within 48 hours",
      field: "deadlines",
      notif: notif,
      setNotif: setNotif
    }), /*#__PURE__*/React.createElement(NotifRow, {
      title: "AI risk alerts",
      desc: "When the assistant detects a deadline or budget risk",
      field: "ai_alerts",
      notif: notif,
      setNotif: setNotif
    }), /*#__PURE__*/React.createElement(NotifRow, {
      title: "Weekly summary",
      desc: "Monday recap of revenue, tasks and pipeline",
      field: "weekly",
      notif: notif,
      setNotif: setNotif
    })), tab === 'Integrations' && /*#__PURE__*/React.createElement(Card, {
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
    }, INTEG_LIST.map(it => /*#__PURE__*/React.createElement("div", {
      key: it.key,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: 14,
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        background: integ[it.key] ? 'var(--green-50)' : 'var(--slate-50)'
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
        color: it.color
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
    }, it.name), integ[it.key] ? /*#__PURE__*/React.createElement("button", {
      onClick: () => toggleInteg(it.key),
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        height: 28,
        padding: '0 10px',
        background: 'transparent',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-md)',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--fw-semibold)',
        color: 'var(--text-muted)',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 6,
        height: 6,
        borderRadius: '50%',
        background: 'var(--green-500)',
        display: 'inline-block'
      }
    }), "Connected") : /*#__PURE__*/React.createElement("button", {
      onClick: () => toggleInteg(it.key),
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
    }, "Connect"))))), tab === 'API access' && /*#__PURE__*/React.createElement(Card, {
      padding: "lg"
    }, /*#__PURE__*/React.createElement("h3", {
      style: {
        fontSize: 'var(--text-lg)',
        fontWeight: 'var(--fw-bold)',
        marginBottom: 4
      }
    }, "API access"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 'var(--text-sm)',
        color: 'var(--text-muted)',
        marginBottom: 20
      }
    }, "Use this key to access TechyFuel OS data from external tools."), /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: 16
      }
    }, /*#__PURE__*/React.createElement("label", {
      style: {
        display: 'block',
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--fw-semibold)',
        color: 'var(--text-muted)',
        marginBottom: 6,
        textTransform: 'uppercase',
        letterSpacing: 'var(--tracking-caps)'
      }
    }, "API Key"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("input", {
      readOnly: true,
      value: apiKey,
      style: {
        ...inputStyle,
        flex: 1,
        fontFamily: 'monospace',
        letterSpacing: '0.03em',
        color: 'var(--text-muted)',
        background: 'var(--slate-50)'
      }
    }), /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        try {
          navigator.clipboard.writeText(apiKey);
        } catch {}
      },
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        height: 36,
        padding: '0 14px',
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
      name: "copy",
      size: 15
    }), " Copy"))), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 14,
        background: 'var(--amber-50)',
        border: '1px solid var(--amber-200)',
        borderRadius: 'var(--radius-md)',
        fontSize: 'var(--text-xs)',
        color: 'var(--amber-800)',
        display: 'flex',
        gap: 8,
        alignItems: 'flex-start'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "alert-triangle",
      size: 15,
      style: {
        flexShrink: 0,
        marginTop: 1
      }
    }), "Keep this key secret. Do not share it publicly or commit it to code.")))));
  }
  Object.assign(window, {
    Settings
  });
})();