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
      window.dispatchEvent(new Event('tf-settings-saved'));
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

  /* ── Team Permissions Tab ─────────────────────────────────────── */
  function TeamPermissionsTab({
    team,
    setTeam,
    inputStyle,
    showToast,
    ROLE_COLORS
  }) {
    const ROLES = ['admin', 'manager', 'member', 'viewer'];
    const [editingRole, setEditingRole] = React.useState(null);
    const [inviteOpen, setInviteOpen] = React.useState(false);
    const [inviteName, setInviteName] = React.useState('');
    const [inviteEmail, setInviteEmail] = React.useState('');
    const [inviteRole, setInviteRole] = React.useState('member');
    const [saving, setSaving] = React.useState(false);
    async function handleRoleChange(member, newRole) {
      if (!window.API) return;
      const prev = team;
      setTeam(team.map(m => m.id === member.id ? {
        ...m,
        role: newRole
      } : m));
      setEditingRole(null);
      try {
        await window.API.updateTeamMember(member.id, {
          role: newRole
        });
        showToast('Role updated!');
      } catch {
        setTeam(prev);
        showToast('Failed to update role');
      }
    }
    async function handleRemove(member) {
      if (!window.API) return;
      if (!confirm(`Remove ${member.name} from the team?`)) return;
      try {
        await window.API.updateTeamMember(member.id, {
          status: 'inactive'
        });
        setTeam(team.filter(m => m.id !== member.id));
        showToast(`${member.name} removed`);
      } catch {
        showToast('Failed to remove member');
      }
    }
    async function handleInvite() {
      if (!inviteName.trim() || !inviteEmail.trim()) {
        showToast('Name and email required');
        return;
      }
      if (!window.API) return;
      setSaving(true);
      try {
        const {
          data
        } = await window.API.addTeamMember({
          name: inviteName.trim(),
          email: inviteEmail.trim(),
          role: inviteRole,
          status: 'active'
        });
        if (data) setTeam(prev => [...prev, data]);
        setInviteOpen(false);
        setInviteName('');
        setInviteEmail('');
        setInviteRole('member');
        showToast('Team member added!');
      } catch {
        showToast('Failed to add member');
      }
      setSaving(false);
    }
    const ROLE_BG = {
      admin: 'var(--violet-50)',
      manager: 'var(--blue-50)',
      member: 'var(--green-50)',
      viewer: 'var(--slate-100)'
    };
    return /*#__PURE__*/React.createElement(Card, {
      padding: "lg"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4
      }
    }, /*#__PURE__*/React.createElement("h3", {
      style: {
        fontSize: 'var(--text-lg)',
        fontWeight: 'var(--fw-bold)'
      }
    }, "Team permissions"), /*#__PURE__*/React.createElement("button", {
      onClick: () => setInviteOpen(true),
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        height: 34,
        padding: '0 14px',
        background: 'var(--blue-600)',
        color: '#fff',
        border: 'none',
        borderRadius: 'var(--radius-md)',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-semibold)',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "user-plus",
      size: 15
    }), " Invite member")), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 'var(--text-sm)',
        color: 'var(--text-muted)',
        marginBottom: 20
      }
    }, "Manage your team members and their access levels."), inviteOpen && /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.4)',
        zIndex: 500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        background: 'var(--slate-0)',
        borderRadius: 'var(--radius-xl)',
        padding: 28,
        width: 420,
        boxShadow: 'var(--shadow-xl)'
      }
    }, /*#__PURE__*/React.createElement("h3", {
      style: {
        fontSize: 'var(--text-lg)',
        fontWeight: 'var(--fw-bold)',
        marginBottom: 20
      }
    }, "Add team member"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 14
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
    }, "Full name"), /*#__PURE__*/React.createElement("input", {
      style: inputStyle,
      value: inviteName,
      onChange: e => setInviteName(e.target.value),
      placeholder: "e.g. Ahmed Khan"
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
    }, "Email"), /*#__PURE__*/React.createElement("input", {
      style: inputStyle,
      value: inviteEmail,
      onChange: e => setInviteEmail(e.target.value),
      placeholder: "ahmed@agency.com",
      type: "email"
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
    }, "Role"), /*#__PURE__*/React.createElement("select", {
      value: inviteRole,
      onChange: e => setInviteRole(e.target.value),
      style: {
        ...inputStyle,
        cursor: 'pointer'
      }
    }, ROLES.map(r => /*#__PURE__*/React.createElement("option", {
      key: r,
      value: r,
      style: {
        textTransform: 'capitalize'
      }
    }, r.charAt(0).toUpperCase() + r.slice(1)))))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 10,
        marginTop: 22
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: handleInvite,
      disabled: saving,
      style: {
        flex: 1,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 7,
        height: 38,
        background: 'var(--blue-600)',
        color: '#fff',
        border: 'none',
        borderRadius: 'var(--radius-md)',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-semibold)',
        cursor: saving ? 'not-allowed' : 'pointer',
        opacity: saving ? 0.7 : 1
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "user-plus",
      size: 15
    }), " ", saving ? 'Adding…' : 'Add member'), /*#__PURE__*/React.createElement("button", {
      onClick: () => setInviteOpen(false),
      style: {
        height: 38,
        padding: '0 16px',
        background: 'transparent',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-md)',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-sm)',
        cursor: 'pointer',
        color: 'var(--text-body)'
      }
    }, "Cancel")))), team.length === 0 ? /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '32px 0',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: 'var(--text-sm)'
      }
    }, "No team members yet. Invite someone!") : /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column'
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
        flex: 1,
        minWidth: 0
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
    }, m.email)), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => setEditingRole(editingRole === m.id ? null : m.id),
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        height: 28,
        padding: '0 10px',
        background: ROLE_BG[m.role] || 'var(--slate-100)',
        color: ROLE_COLORS[m.role] || 'var(--text-body)',
        border: 'none',
        borderRadius: 'var(--radius-full)',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--fw-semibold)',
        cursor: 'pointer',
        textTransform: 'capitalize'
      }
    }, m.role || 'member', " ", /*#__PURE__*/React.createElement(Icon, {
      name: "chevron-down",
      size: 11
    })), editingRole === m.id && /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        right: 0,
        top: 'calc(100% + 4px)',
        zIndex: 100,
        background: 'var(--slate-0)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-lg)',
        overflow: 'hidden',
        minWidth: 130
      }
    }, ROLES.map(r => /*#__PURE__*/React.createElement("div", {
      key: r,
      onClick: () => handleRoleChange(m, r),
      style: {
        padding: '8px 14px',
        fontSize: 'var(--text-sm)',
        cursor: 'pointer',
        color: ROLE_COLORS[r] || 'var(--text-body)',
        fontWeight: m.role === r ? 'var(--fw-bold)' : 'var(--fw-medium)',
        textTransform: 'capitalize',
        background: m.role === r ? 'var(--slate-50)' : 'transparent'
      },
      onMouseEnter: e => e.currentTarget.style.background = 'var(--slate-50)',
      onMouseLeave: e => e.currentTarget.style.background = m.role === r ? 'var(--slate-50)' : 'transparent'
    }, r.charAt(0).toUpperCase() + r.slice(1))))), /*#__PURE__*/React.createElement("button", {
      onClick: () => handleRemove(m),
      title: "Remove member",
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 28,
        height: 28,
        background: 'transparent',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
        color: 'var(--text-subtle)'
      },
      onMouseEnter: e => {
        e.currentTarget.style.background = 'var(--red-50)';
        e.currentTarget.style.color = 'var(--red-500)';
        e.currentTarget.style.borderColor = 'var(--red-200)';
      },
      onMouseLeave: e => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.color = 'var(--text-subtle)';
        e.currentTarget.style.borderColor = 'var(--border-subtle)';
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "user-minus",
      size: 13
    }))))));
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
    const [integCreds, setIntegCreds] = React.useState(saved.integCreds || {});
    const [integExpanded, setIntegExpanded] = React.useState(null);
    const [integDraft, setIntegDraft] = React.useState({});
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
    function openInteg(it) {
      setIntegDraft({
        ...(integCreds[it.key] || {})
      });
      setIntegExpanded(it.key);
    }
    function saveInteg(key) {
      const cleaned = Object.fromEntries(Object.entries(integDraft).filter(([, v]) => v.trim()));
      const next = {
        ...integCreds,
        [key]: Object.keys(cleaned).length > 0 ? cleaned : undefined
      };
      if (!Object.keys(cleaned).length) delete next[key];
      setIntegCreds(next);
      const sk = loadSaved();
      saveSettings({
        ...sk,
        integCreds: next
      });
      setIntegExpanded(null);
      showToast(Object.keys(cleaned).length > 0 ? 'Integration saved!' : 'Integration disconnected');
    }
    function disconnectInteg(key) {
      const next = {
        ...integCreds
      };
      delete next[key];
      setIntegCreds(next);
      const sk = loadSaved();
      saveSettings({
        ...sk,
        integCreds: next
      });
      setIntegExpanded(null);
      showToast('Integration disconnected');
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
      color: 'var(--blue-600)',
      fields: [{
        id: 'accessToken',
        label: 'Access Token',
        placeholder: 'EAAxxxxxxx...',
        type: 'password'
      }, {
        id: 'accountId',
        label: 'Ad Account ID',
        placeholder: 'act_123456789'
      }]
    }, {
      key: 'google',
      name: 'Google Ads',
      icon: 'badge-dollar-sign',
      color: 'var(--green-600)',
      fields: [{
        id: 'customerId',
        label: 'Customer ID',
        placeholder: '123-456-7890'
      }, {
        id: 'developerToken',
        label: 'Developer Token',
        placeholder: 'ABcDef...',
        type: 'password'
      }]
    }, {
      key: 'slack',
      name: 'Slack',
      icon: 'slack',
      color: 'var(--violet-500)',
      fields: [{
        id: 'webhookUrl',
        label: 'Webhook URL',
        placeholder: 'https://hooks.slack.com/services/...'
      }]
    }, {
      key: 'stripe',
      name: 'Stripe',
      icon: 'credit-card',
      color: 'var(--blue-500)',
      fields: [{
        id: 'publishableKey',
        label: 'Publishable Key',
        placeholder: 'pk_live_...'
      }, {
        id: 'secretKey',
        label: 'Secret Key',
        placeholder: 'sk_live_...',
        type: 'password'
      }]
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
    }), " ", saved2 ? 'Saved!' : 'Save changes')), tab === 'Team permissions' && /*#__PURE__*/React.createElement(TeamPermissionsTab, {
      team: team,
      setTeam: setTeam,
      inputStyle: inputStyle,
      showToast: showToast,
      ROLE_COLORS: ROLE_COLORS
    }), tab === 'Email notifications' && /*#__PURE__*/React.createElement(Card, {
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
        marginBottom: 4
      }
    }, "Integrations"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 'var(--text-sm)',
        color: 'var(--text-muted)',
        marginBottom: 18
      }
    }, "Connect your tools by entering API credentials. Keys are stored locally in your browser."), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }
    }, INTEG_LIST.map(it => {
      const creds = integCreds[it.key];
      const connected = creds && Object.values(creds).some(v => v);
      const expanded = integExpanded === it.key;
      return /*#__PURE__*/React.createElement("div", {
        key: it.key,
        style: {
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          background: connected ? 'var(--green-50)' : 'var(--slate-0)'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '12px 16px'
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
          color: it.color,
          flexShrink: 0
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: it.icon,
        size: 18
      })), /*#__PURE__*/React.createElement("div", {
        style: {
          flex: 1
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--fw-semibold)',
          color: 'var(--text-strong)'
        }
      }, it.name), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 'var(--text-xs)',
          color: connected ? 'var(--green-600)' : 'var(--text-muted)',
          marginTop: 2
        }
      }, connected ? '● Connected' : 'Not configured')), /*#__PURE__*/React.createElement("button", {
        onClick: () => {
          if (expanded) {
            setIntegExpanded(null);
          } else {
            openInteg(it);
          }
        },
        style: {
          display: 'inline-flex',
          alignItems: 'center',
          gap: 5,
          height: 30,
          padding: '0 12px',
          background: connected ? 'transparent' : 'var(--blue-600)',
          color: connected ? 'var(--text-body)' : '#fff',
          border: connected ? '1px solid var(--border-default)' : 'none',
          borderRadius: 'var(--radius-md)',
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--text-xs)',
          fontWeight: 'var(--fw-semibold)',
          cursor: 'pointer'
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: expanded ? 'chevron-up' : connected ? 'settings' : 'plug',
        size: 13
      }), expanded ? 'Cancel' : connected ? 'Edit' : 'Configure')), expanded && /*#__PURE__*/React.createElement("div", {
        style: {
          padding: '0 16px 16px',
          borderTop: '1px solid var(--border-subtle)',
          background: 'var(--slate-50)'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          paddingTop: 14,
          display: 'flex',
          flexDirection: 'column',
          gap: 12
        }
      }, it.fields.map(f => /*#__PURE__*/React.createElement("div", {
        key: f.id
      }, /*#__PURE__*/React.createElement("label", {
        style: {
          display: 'block',
          fontSize: 'var(--text-xs)',
          fontWeight: 'var(--fw-semibold)',
          color: 'var(--text-muted)',
          marginBottom: 5,
          textTransform: 'uppercase',
          letterSpacing: 'var(--tracking-caps)'
        }
      }, f.label), /*#__PURE__*/React.createElement("input", {
        type: f.type || 'text',
        placeholder: f.placeholder,
        value: integDraft[f.id] || '',
        onChange: e => setIntegDraft(d => ({
          ...d,
          [f.id]: e.target.value
        })),
        style: {
          ...inputStyle,
          fontFamily: f.type === 'password' ? 'monospace' : 'var(--font-sans)'
        }
      }))), /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          gap: 8,
          marginTop: 4
        }
      }, /*#__PURE__*/React.createElement("button", {
        onClick: () => saveInteg(it.key),
        style: {
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          height: 34,
          padding: '0 16px',
          background: 'var(--blue-600)',
          color: '#fff',
          border: 'none',
          borderRadius: 'var(--radius-md)',
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--fw-semibold)',
          cursor: 'pointer'
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "save",
        size: 14
      }), " Save credentials"), connected && /*#__PURE__*/React.createElement("button", {
        onClick: () => disconnectInteg(it.key),
        style: {
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          height: 34,
          padding: '0 14px',
          background: 'transparent',
          color: 'var(--red-600)',
          border: '1px solid var(--red-200)',
          borderRadius: 'var(--radius-md)',
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--fw-semibold)',
          cursor: 'pointer'
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "unplug",
        size: 14
      }), " Disconnect")))));
    }))), tab === 'API access' && /*#__PURE__*/React.createElement(Card, {
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