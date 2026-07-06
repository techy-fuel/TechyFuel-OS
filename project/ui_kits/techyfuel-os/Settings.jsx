// Settings screen.
(() => {
const { Card, Badge, Avatar, Switch } = window.TechyFuelOSDesignSystem_be0222;

const NAV_ITEMS = [
  ['building-2',   'Agency branding'],
  ['users',        'Team permissions'],
  ['bell',         'Email notifications'],
  ['plug',         'Integrations'],
  ['key-round',    'API access'],
];

const STORAGE_KEY = 'tf_settings';
function loadSaved() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch { return {}; }
}
function saveSettings(obj) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
    window.dispatchEvent(new Event('tf-settings-saved'));
  } catch {}
}

/* ── Notification row ─────────────────────────────────────────── */
function NotifRow({ title, desc, field, notif, setNotif }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 0', borderBottom: '1px solid var(--border-subtle)' }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)' }}>{title}</div>
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 2 }}>{desc}</div>
      </div>
      <Switch checked={!!notif[field]} onChange={v => {
        const next = { ...notif, [field]: v };
        setNotif(next);
        const saved = loadSaved();
        saveSettings({ ...saved, notifications: next });
      }} />
    </div>
  );
}

/* ── Team Permissions Tab ─────────────────────────────────────── */
function TeamPermissionsTab({ team, setTeam, inputStyle, showToast, ROLE_COLORS }) {
  const ROLES = ['admin', 'manager', 'member', 'viewer'];
  const [editingRole, setEditingRole] = React.useState(null);
  const [inviteOpen,  setInviteOpen]  = React.useState(false);
  const [inviteName,  setInviteName]  = React.useState('');
  const [inviteEmail, setInviteEmail] = React.useState('');
  const [inviteRole,  setInviteRole]  = React.useState('member');
  const [saving,      setSaving]      = React.useState(false);

  async function handleRoleChange(member, newRole) {
    if (!window.API) return;
    const prev = team;
    setTeam(team.map(m => m.id === member.id ? { ...m, role: newRole } : m));
    setEditingRole(null);
    try {
      await window.API.updateTeamMember(member.id, { role: newRole });
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
      await window.API.updateTeamMember(member.id, { status: 'inactive' });
      setTeam(team.filter(m => m.id !== member.id));
      showToast(`${member.name} removed`);
    } catch { showToast('Failed to remove member'); }
  }

  async function handleInvite() {
    if (!inviteName.trim() || !inviteEmail.trim()) { showToast('Name and email required'); return; }
    if (!window.API) return;
    setSaving(true);
    try {
      const savedSettings = loadSaved();
      const { data } = await window.API.addTeamMember({ name: inviteName.trim(), email: inviteEmail.trim(), role: inviteRole, status: 'active' });
      if (data) setTeam(prev => [...prev, data]);
      setInviteOpen(false);

      // Send invite email via API
      try {
        const res = await fetch('/api/invite', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: inviteName.trim(),
            email: inviteEmail.trim(),
            role: inviteRole,
            agencyName: savedSettings.agencyName || '',
            appUrl: window.location.origin,
          }),
        });
        const json = await res.json();
        if (json.skipped) {
          showToast('Member added! (Set RESEND_API_KEY to send invite emails)');
        } else if (json.ok) {
          showToast('Member added & invite email sent!');
        } else {
          showToast('Member added (email failed — check RESEND_API_KEY)');
        }
      } catch {
        showToast('Member added! (Email could not be sent)');
      }

      setInviteName(''); setInviteEmail(''); setInviteRole('member');
    } catch { showToast('Failed to add member'); }
    setSaving(false);
  }

  const ROLE_BG = { admin: 'var(--violet-50)', manager: 'var(--blue-50)', member: 'var(--green-50)', viewer: 'var(--slate-100)' };

  return (
    <Card padding="lg">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--fw-bold)' }}>Team permissions</h3>
        <button onClick={() => setInviteOpen(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 34, padding: '0 14px', background: 'var(--blue-600)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', cursor: 'pointer' }}>
          <Icon name="user-plus" size={15} /> Invite member
        </button>
      </div>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginBottom: 20 }}>Manage your team members and their access levels.</p>

      {/* Invite modal */}
      {inviteOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'var(--slate-0)', borderRadius: 'var(--radius-xl)', padding: 28, width: 420, boxShadow: 'var(--shadow-xl)' }}>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--fw-bold)', marginBottom: 20 }}>Add team member</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 'var(--tracking-caps)' }}>Full name</label>
                <input style={inputStyle} value={inviteName} onChange={e => setInviteName(e.target.value)} placeholder="e.g. Ahmed Khan" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 'var(--tracking-caps)' }}>Email</label>
                <input style={inputStyle} value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="ahmed@agency.com" type="email" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 'var(--tracking-caps)' }}>Role</label>
                <select value={inviteRole} onChange={e => setInviteRole(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                  {ROLES.map(r => <option key={r} value={r} style={{ textTransform: 'capitalize' }}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
              <button onClick={handleInvite} disabled={saving} style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7, height: 38, background: 'var(--blue-600)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
                <Icon name="user-plus" size={15} /> {saving ? 'Adding…' : 'Add member'}
              </button>
              <button onClick={() => setInviteOpen(false)} style={{ height: 38, padding: '0 16px', background: 'transparent', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', cursor: 'pointer', color: 'var(--text-body)' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {team.length === 0 ? (
        <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>No team members yet. Invite someone!</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {team.map((m, i) => (
            <div key={m.id || i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: '1px solid var(--border-subtle)' }}>
              <Avatar name={m.name} src={m.avatar_url} size="sm" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)' }}>{m.name}</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{m.email}</div>
              </div>

              {/* Role dropdown */}
              <div style={{ position: 'relative' }}>
                <button onClick={() => setEditingRole(editingRole === m.id ? null : m.id)} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, height: 28, padding: '0 10px', background: ROLE_BG[m.role] || 'var(--slate-100)', color: ROLE_COLORS[m.role] || 'var(--text-body)', border: 'none', borderRadius: 'var(--radius-full)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-semibold)', cursor: 'pointer', textTransform: 'capitalize' }}>
                  {m.role || 'member'} <Icon name="chevron-down" size={11} />
                </button>
                {editingRole === m.id && (
                  <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 4px)', zIndex: 100, background: 'var(--slate-0)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)', overflow: 'hidden', minWidth: 130 }}>
                    {ROLES.map(r => (
                      <div key={r} onClick={() => handleRoleChange(m, r)} style={{ padding: '8px 14px', fontSize: 'var(--text-sm)', cursor: 'pointer', color: ROLE_COLORS[r] || 'var(--text-body)', fontWeight: m.role === r ? 'var(--fw-bold)' : 'var(--fw-medium)', textTransform: 'capitalize', background: m.role === r ? 'var(--slate-50)' : 'transparent' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--slate-50)'}
                        onMouseLeave={e => e.currentTarget.style.background = m.role === r ? 'var(--slate-50)' : 'transparent'}>
                        {r.charAt(0).toUpperCase() + r.slice(1)}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Remove button */}
              <button onClick={() => handleRemove(m)} title="Remove member" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, background: 'transparent', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', cursor: 'pointer', color: 'var(--text-subtle)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--red-50)'; e.currentTarget.style.color = 'var(--red-500)'; e.currentTarget.style.borderColor = 'var(--red-200)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-subtle)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}>
                <Icon name="user-minus" size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

/* ── Settings ─────────────────────────────────────────────────── */
function Settings() {
  useLucide();
  const saved = loadSaved();

  const [tab,        setTab]        = React.useState('Agency branding');
  const [team,       setTeam]       = React.useState([]);
  const [agencyName, setAgencyName] = React.useState(saved.agencyName || '');
  const [agencyEmail,setAgencyEmail]= React.useState(saved.agencyEmail || '');
  const [logoUrl,    setLogoUrl]    = React.useState(saved.logoUrl || '');
  const [tagline,      setTagline]      = React.useState(saved.tagline || '');
  const [agencyPhone,  setAgencyPhone]  = React.useState(saved.agencyPhone || '');
  const [agencyWebsite,setAgencyWebsite]= React.useState(saved.agencyWebsite || '');
  const [agencyAddress,setAgencyAddress]= React.useState(saved.agencyAddress || '');
  const [paymentAccount, setPaymentAccount] = React.useState(saved.paymentAccount || '');
  const [paymentSwift,   setPaymentSwift]   = React.useState(saved.paymentSwift || '');
  const [paymentPayoneer,setPaymentPayoneer]= React.useState(saved.paymentPayoneer || '');
  const [signatureName,  setSignatureName]  = React.useState(saved.signatureName || '');
  const [signatureTitle, setSignatureTitle] = React.useState(saved.signatureTitle || '');
  const [signatureImageUrl, setSignatureImageUrl] = React.useState(saved.signatureImageUrl || '');
  const [servicesLine, setServicesLine] = React.useState(saved.servicesLine || '');
  const [saved2,     setSaved2]     = React.useState(false);
  const [toast,      setToast]      = React.useState('');
  const logoInputRef = React.useRef(null);
  const signatureInputRef = React.useRef(null);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }

  const defaultNotif = { approvals: true, deadlines: true, ai_alerts: true, weekly: false };
  const [notif, setNotif] = React.useState({ ...defaultNotif, ...(saved.notifications || {}) });

  const [integCreds, setIntegCreds] = React.useState(saved.integCreds || {});
  const [integExpanded, setIntegExpanded] = React.useState(null);
  const [integDraft, setIntegDraft] = React.useState({});

  const [apiKey] = React.useState(saved.apiKey || ('tf_live_' + Math.random().toString(36).slice(2, 18)));

  React.useEffect(() => {
    if (!window.API) return;
    (async () => {
      try {
        const { data } = await window.API.getTeam();
        if (data) setTeam(data);
      } catch {}
    })();
    const sk = loadSaved();
    if (!sk.apiKey) saveSettings({ ...sk, apiKey });
  }, []);

  // Auto-save branding fields shortly after each edit — otherwise navigating
  // to another screen before pressing "Save changes" remounts Settings and
  // silently drops everything typed since the last explicit save.
  React.useEffect(() => {
    const t = setTimeout(() => {
      const sk = loadSaved();
      saveSettings({
        ...sk, agencyName, agencyEmail, logoUrl, tagline, agencyPhone, agencyWebsite, agencyAddress,
        paymentAccount, paymentSwift, paymentPayoneer, signatureName, signatureTitle, signatureImageUrl, servicesLine,
      });
    }, 500);
    return () => clearTimeout(t);
  }, [agencyName, agencyEmail, logoUrl, tagline, agencyPhone, agencyWebsite, agencyAddress,
      paymentAccount, paymentSwift, paymentPayoneer, signatureName, signatureTitle, signatureImageUrl, servicesLine]);

  function handleSaveBranding() {
    const sk = loadSaved();
    saveSettings({
      ...sk, agencyName, agencyEmail, logoUrl, tagline, agencyPhone, agencyWebsite, agencyAddress,
      paymentAccount, paymentSwift, paymentPayoneer, signatureName, signatureTitle, signatureImageUrl, servicesLine,
    });
    setSaved2(true);
    showToast('Branding saved!');
    setTimeout(() => setSaved2(false), 2500);
  }

  function handleLogoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { showToast('Image must be under 2MB'); return; }
    const reader = new FileReader();
    reader.onload = ev => {
      setLogoUrl(ev.target.result);
      showToast('Logo ready — click Save changes to apply');
    };
    reader.readAsDataURL(file);
  }

  function handleSignatureUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 1 * 1024 * 1024) { showToast('Image must be under 1MB'); return; }
    const reader = new FileReader();
    reader.onload = ev => {
      setSignatureImageUrl(ev.target.result);
      showToast('Signature ready — click Save changes to apply');
    };
    reader.readAsDataURL(file);
  }

  function openInteg(it) {
    setIntegDraft({ ...(integCreds[it.key] || {}) });
    setIntegExpanded(it.key);
  }

  function saveInteg(key) {
    const cleaned = Object.fromEntries(Object.entries(integDraft).filter(([, v]) => v.trim()));
    const next = { ...integCreds, [key]: Object.keys(cleaned).length > 0 ? cleaned : undefined };
    if (!Object.keys(cleaned).length) delete next[key];
    setIntegCreds(next);
    const sk = loadSaved();
    saveSettings({ ...sk, integCreds: next });
    setIntegExpanded(null);
    showToast(Object.keys(cleaned).length > 0 ? 'Integration saved!' : 'Integration disconnected');
  }

  function disconnectInteg(key) {
    const next = { ...integCreds };
    delete next[key];
    setIntegCreds(next);
    const sk = loadSaved();
    saveSettings({ ...sk, integCreds: next });
    setIntegExpanded(null);
    showToast('Integration disconnected');
  }

  const inputStyle = {
    width: '100%', height: 36, padding: '0 10px', border: '1px solid var(--border-default)',
    borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)',
    color: 'var(--text-strong)', background: 'var(--slate-0)', boxSizing: 'border-box', outline: 'none',
  };

  const INTEG_LIST = [
    { key: 'meta',   name: 'Meta Business',  icon: 'megaphone',         color: 'var(--blue-600)',   fields: [{ id: 'accessToken', label: 'Access Token', placeholder: 'EAAxxxxxxx...', type: 'password' }, { id: 'accountId', label: 'Ad Account ID', placeholder: 'act_123456789' }] },
    { key: 'google', name: 'Google Ads',     icon: 'badge-dollar-sign', color: 'var(--green-600)',  fields: [{ id: 'customerId', label: 'Customer ID', placeholder: '123-456-7890' }, { id: 'developerToken', label: 'Developer Token', placeholder: 'ABcDef...', type: 'password' }] },
    { key: 'slack',  name: 'Slack',          icon: 'message-square',   color: 'var(--violet-500)', fields: [{ id: 'webhookUrl', label: 'Webhook URL', placeholder: 'https://hooks.slack.com/services/...' }] },
    { key: 'stripe', name: 'Stripe',         icon: 'credit-card',       color: 'var(--blue-500)',   fields: [{ id: 'publishableKey', label: 'Publishable Key', placeholder: 'pk_live_...' }, { id: 'secretKey', label: 'Secret Key', placeholder: 'sk_live_...', type: 'password' }] },
  ];

  const ROLE_COLORS = { admin: 'var(--violet-600)', manager: 'var(--blue-600)', member: 'var(--green-700)', viewer: 'var(--slate-500)' };

  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: '0 auto' }}>
      <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--fw-extrabold)', letterSpacing: '-0.02em', marginBottom: 18 }}>Settings</h1>

      {/* Toast notification */}
      {toast && (
        <div style={{ position: 'fixed', top: 20, right: 24, zIndex: 9999, background: 'var(--green-600)', color: '#fff', padding: '10px 18px', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', boxShadow: 'var(--shadow-xl)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon name="check" size={16} /> {toast}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 20, alignItems: 'start' }}>

        {/* Sidebar nav */}
        <Card padding="sm" style={{ position: 'sticky', top: 84 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {NAV_ITEMS.map(([ic, label]) => {
              const act = tab === label;
              return (
                <div key={label} onClick={() => setTab(label)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 'var(--radius-md)', background: act ? 'var(--blue-50)' : 'transparent', color: act ? 'var(--blue-700)' : 'var(--text-body)', fontSize: 'var(--text-sm)', fontWeight: act ? 'var(--fw-semibold)' : 'var(--fw-medium)', cursor: 'pointer', transition: 'background 0.12s' }}>
                  <Icon name={ic} size={17} style={{ color: act ? 'var(--blue-600)' : 'var(--text-muted)' }} />{label}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Content panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* ── Agency branding ── */}
          {tab === 'Agency branding' && (
            <Card padding="lg">
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--fw-bold)', marginBottom: 4 }}>Agency branding</h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginBottom: 20 }}>Appears across the client portal and reports.</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                <span style={{ width: 56, height: 56, borderRadius: 'var(--radius-xl)', background: logoUrl ? 'var(--slate-100)' : 'var(--grad-brand)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-brand)', overflow: 'hidden' }}>
                  {logoUrl
                    ? <img src={logoUrl} alt="Logo" style={{ width: 56, height: 56, objectFit: 'cover' }} />
                    : <img src="../../assets/techyfuel-mark.png" alt="" style={{ height: 32, filter: 'brightness(0) invert(1)' }} />}
                </span>
                <input ref={logoInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleLogoUpload} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <button onClick={() => logoInputRef.current && logoInputRef.current.click()} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, height: 34, padding: '0 13px', background: 'var(--slate-0)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-body)', cursor: 'pointer' }}>
                    <Icon name="upload" size={15} /> Upload logo
                  </button>
                  {logoUrl && <button onClick={() => { setLogoUrl(''); showToast('Logo removed'); }} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, height: 26, padding: '0 10px', background: 'transparent', border: 'none', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-semibold)', color: 'var(--red-500)', cursor: 'pointer' }}>
                    <Icon name="x" size={12} /> Remove
                  </button>}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 'var(--tracking-caps)' }}>Agency name</label>
                  <input style={inputStyle} value={agencyName} onChange={e => setAgencyName(e.target.value)} placeholder="Your agency name" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 'var(--tracking-caps)' }}>Tagline</label>
                  <input style={inputStyle} value={tagline} onChange={e => setTagline(e.target.value)} placeholder="Digital Solutions & Growth Partner" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 'var(--tracking-caps)' }}>Support email</label>
                  <input style={inputStyle} value={agencyEmail} onChange={e => setAgencyEmail(e.target.value)} placeholder="support@agency.com" type="email" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 'var(--tracking-caps)' }}>Phone</label>
                  <input style={inputStyle} value={agencyPhone} onChange={e => setAgencyPhone(e.target.value)} placeholder="+92 300 1234567" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 'var(--tracking-caps)' }}>Website</label>
                  <input style={inputStyle} value={agencyWebsite} onChange={e => setAgencyWebsite(e.target.value)} placeholder="www.techyfuel.com" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 'var(--tracking-caps)' }}>Address</label>
                  <input style={inputStyle} value={agencyAddress} onChange={e => setAgencyAddress(e.target.value)} placeholder="Office address" />
                </div>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 'var(--tracking-caps)' }}>Services line (shown under the invoice header)</label>
                <input style={inputStyle} value={servicesLine} onChange={e => setServicesLine(e.target.value)} placeholder="Digital Marketing • Web Development • UI/UX Design • Branding • SEO" />
              </div>

              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--fw-bold)', marginBottom: 4, marginTop: 8 }}>Invoice details</h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginBottom: 16 }}>Shown on every exported invoice PDF — payment method and the signature block.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 'var(--tracking-caps)' }}>Account #</label>
                  <input style={inputStyle} value={paymentAccount} onChange={e => setPaymentAccount(e.target.value)} placeholder="PK00 XXXX 0000 1111 2222" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 'var(--tracking-caps)' }}>Swift code</label>
                  <input style={inputStyle} value={paymentSwift} onChange={e => setPaymentSwift(e.target.value)} placeholder="ABCDPKKA" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 'var(--tracking-caps)' }}>Payoneer</label>
                  <input style={inputStyle} value={paymentPayoneer} onChange={e => setPaymentPayoneer(e.target.value)} placeholder="payoneer@agency.com" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 'var(--tracking-caps)' }}>Signature name</label>
                  <input style={inputStyle} value={signatureName} onChange={e => setSignatureName(e.target.value)} placeholder="Zain Ahmed" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 'var(--tracking-caps)' }}>Signature title</label>
                  <input style={inputStyle} value={signatureTitle} onChange={e => setSignatureTitle(e.target.value)} placeholder="CEO" />
                </div>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 'var(--tracking-caps)' }}>Signature image (optional)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {signatureImageUrl && <img src={signatureImageUrl} alt="Signature" style={{ height: 40, objectFit: 'contain' }} />}
                  <input ref={signatureInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleSignatureUpload} />
                  <button onClick={() => signatureInputRef.current && signatureInputRef.current.click()} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, height: 34, padding: '0 13px', background: 'var(--slate-0)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-body)', cursor: 'pointer' }}>
                    <Icon name="upload" size={15} /> Upload signature
                  </button>
                  {signatureImageUrl && <button onClick={() => { setSignatureImageUrl(''); showToast('Signature removed'); }} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, height: 26, padding: '0 10px', background: 'transparent', border: 'none', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-semibold)', color: 'var(--red-500)', cursor: 'pointer' }}>
                    <Icon name="x" size={12} /> Remove
                  </button>}
                </div>
              </div>
              <button onClick={handleSaveBranding} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, height: 36, padding: '0 18px', background: saved2 ? 'var(--green-600)' : 'var(--blue-600)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', cursor: 'pointer', transition: 'background 0.2s' }}>
                <Icon name={saved2 ? 'check' : 'save'} size={16} /> {saved2 ? 'Saved!' : 'Save changes'}
              </button>
            </Card>
          )}

          {/* ── Team permissions ── */}
          {tab === 'Team permissions' && (
            <TeamPermissionsTab
              team={team} setTeam={setTeam}
              inputStyle={inputStyle} showToast={showToast}
              ROLE_COLORS={ROLE_COLORS}
            />
          )}

          {/* ── Notifications ── */}
          {tab === 'Email notifications' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Card padding="lg">
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--fw-bold)', marginBottom: 4 }}>In-App Notifications</h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginBottom: 8 }}>Bell icon notifications inside TechyFuel OS.</p>
                <NotifRow title="Task assigned to you"       desc="When someone assigns a task to you"                          field="inapp_assigned"     notif={notif} setNotif={setNotif} />
                <NotifRow title="Task due tomorrow"          desc="Reminder when your task deadline is approaching"             field="inapp_due"          notif={notif} setNotif={setNotif} />
                <NotifRow title="Task marked complete"       desc="When a task you created or follow is marked done"           field="inapp_done"         notif={notif} setNotif={setNotif} />
                <NotifRow title="@mention in chat"           desc="When someone @mentions you in Team Chat"                    field="inapp_mention"      notif={notif} setNotif={setNotif} />
                <NotifRow title="New project created"        desc="When a new project is created in the workspace"            field="inapp_project"      notif={notif} setNotif={setNotif} />
                <NotifRow title="Client approves / rejects"  desc="When a client takes action on a deliverable"               field="inapp_client"       notif={notif} setNotif={setNotif} />
              </Card>
              <Card padding="lg">
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--fw-bold)', marginBottom: 4 }}>Email Notifications</h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginBottom: 8 }}>Emails sent to your registered address. Changes save automatically.</p>
                <NotifRow title="Task assigned to you"       desc="Immediate email when a task is assigned to you"            field="email_assigned"     notif={notif} setNotif={setNotif} />
                <NotifRow title="Task due tomorrow"          desc="Email reminder the day before a deadline"                  field="email_due"          notif={notif} setNotif={setNotif} />
                <NotifRow title="Comment on your task"       desc="When someone comments on a task you own"                  field="email_comment"      notif={notif} setNotif={setNotif} />
                <NotifRow title="Client approves / rejects"  desc="When a client takes action — sent to project manager"     field="email_client"       notif={notif} setNotif={setNotif} />
                <NotifRow title="Overdue task digest"        desc="Daily email listing all overdue tasks (assignee + manager)" field="email_overdue"     notif={notif} setNotif={setNotif} />
                <NotifRow title="New client approvals"       desc="When a client approves or requests a revision"            field="approvals"          notif={notif} setNotif={setNotif} />
                <NotifRow title="AI risk alerts"             desc="When the assistant detects a deadline or budget risk"      field="ai_alerts"          notif={notif} setNotif={setNotif} />
                <NotifRow title="Weekly summary"             desc="Monday recap of revenue, tasks and pipeline"              field="weekly"             notif={notif} setNotif={setNotif} />
              </Card>
            </div>
          )}

          {/* ── Integrations ── */}
          {tab === 'Integrations' && (
            <Card padding="lg">
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--fw-bold)', marginBottom: 4 }}>Integrations</h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginBottom: 18 }}>Connect your tools by entering API credentials. Keys are stored locally in your browser.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {INTEG_LIST.map(it => {
                  const creds = integCreds[it.key];
                  const connected = creds && Object.values(creds).some(v => v);
                  const expanded = integExpanded === it.key;
                  return (
                    <div key={it.key} style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: connected ? 'var(--green-50)' : 'var(--slate-0)' }}>
                      {/* Header row */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px' }}>
                        <span style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--slate-0)', border: '1px solid var(--border-subtle)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: it.color, flexShrink: 0 }}>
                          <Icon name={it.icon} size={18} />
                        </span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)' }}>{it.name}</div>
                          <div style={{ fontSize: 'var(--text-xs)', color: connected ? 'var(--green-600)' : 'var(--text-muted)', marginTop: 2 }}>
                            {connected ? '● Connected' : 'Not configured'}
                          </div>
                        </div>
                        <button onClick={() => { if (expanded) { setIntegExpanded(null); } else { openInteg(it); } }} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, height: 30, padding: '0 12px', background: connected ? 'transparent' : 'var(--blue-600)', color: connected ? 'var(--text-body)' : '#fff', border: connected ? '1px solid var(--border-default)' : 'none', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-semibold)', cursor: 'pointer' }}>
                          <Icon name={expanded ? 'chevron-up' : (connected ? 'settings' : 'plug')} size={13} />
                          {expanded ? 'Cancel' : (connected ? 'Edit' : 'Configure')}
                        </button>
                      </div>
                      {/* Expanded credential form */}
                      {expanded && (
                        <div style={{ padding: '0 16px 16px', borderTop: '1px solid var(--border-subtle)', background: 'var(--slate-50)' }}>
                          <div style={{ paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {it.fields.map(f => (
                              <div key={f.id}>
                                <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-muted)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: 'var(--tracking-caps)' }}>{f.label}</label>
                                <input
                                  type={f.type || 'text'}
                                  placeholder={f.placeholder}
                                  value={integDraft[f.id] || ''}
                                  onChange={e => setIntegDraft(d => ({ ...d, [f.id]: e.target.value }))}
                                  style={{ ...inputStyle, fontFamily: f.type === 'password' ? 'monospace' : 'var(--font-sans)' }}
                                />
                              </div>
                            ))}
                            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                              <button onClick={() => saveInteg(it.key)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 34, padding: '0 16px', background: 'var(--blue-600)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', cursor: 'pointer' }}>
                                <Icon name="save" size={14} /> Save credentials
                              </button>
                              {connected && (
                                <button onClick={() => disconnectInteg(it.key)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 34, padding: '0 14px', background: 'transparent', color: 'var(--red-600)', border: '1px solid var(--red-200)', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', cursor: 'pointer' }}>
                                  <Icon name="unplug" size={14} /> Disconnect
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* ── API access ── */}
          {tab === 'API access' && (
            <Card padding="lg">
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--fw-bold)', marginBottom: 4 }}>API access</h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginBottom: 20 }}>Use this key to access TechyFuel OS data from external tools.</p>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 'var(--tracking-caps)' }}>API Key</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  <input readOnly value={apiKey} style={{ ...inputStyle, flex: 1, fontFamily: 'monospace', letterSpacing: '0.03em', color: 'var(--text-muted)', background: 'var(--slate-50)' }} />
                  <button onClick={() => { try { navigator.clipboard.writeText(apiKey); } catch {} }} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 36, padding: '0 14px', background: 'var(--slate-0)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-body)', cursor: 'pointer' }}>
                    <Icon name="copy" size={15} /> Copy
                  </button>
                </div>
              </div>
              <div style={{ padding: 14, background: 'var(--amber-50)', border: '1px solid var(--amber-200)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)', color: 'var(--amber-800)', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <Icon name="alert-triangle" size={15} style={{ flexShrink: 0, marginTop: 1 }} />
                Keep this key secret. Do not share it publicly or commit it to code.
              </div>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Settings });
})();
