// Workspace.jsx — Workspaces, Sub-Teams, Roles, Invites, Guest Access
(() => {
const { Card, Badge, Avatar, Switch } = window.TechyFuelOSDesignSystem_be0222;

const ROLES = [
  { value: 'owner',  label: 'Owner',  desc: 'Full control — billing, delete workspace, all settings', color: '#7c3aed', icon: 'crown' },
  { value: 'admin',  label: 'Admin',  desc: 'Manage members, teams, projects. No billing access',     color: '#2563eb', icon: 'shield' },
  { value: 'member', label: 'Member', desc: 'Create tasks, projects, chat. Cannot manage workspace',  color: '#0891b2', icon: 'user' },
  { value: 'guest',  label: 'Guest',  desc: 'Client-facing view only — limited read access',          color: '#65a30d', icon: 'eye' },
];

const TEAM_COLORS = ['#3b82f6','#8b5cf6','#f59e0b','#10b981','#ef4444','#f97316','#06b6d4','#ec4899'];
const TEAM_ICONS  = ['users','code','pen-tool','megaphone','crown','briefcase','bar-chart','globe'];

const PERM_MATRIX = [
  { feature: 'View projects & tasks',        owner: true,  admin: true,  member: true,  guest: true  },
  { feature: 'Create & edit tasks',          owner: true,  admin: true,  member: true,  guest: false },
  { feature: 'Create projects',              owner: true,  admin: true,  member: true,  guest: false },
  { feature: 'Access Team Chat',             owner: true,  admin: true,  member: true,  guest: false },
  { feature: 'View Finance & Invoices',      owner: true,  admin: true,  member: false, guest: false },
  { feature: 'Manage team members',          owner: true,  admin: true,  member: false, guest: false },
  { feature: 'Manage integrations',          owner: true,  admin: true,  member: false, guest: false },
  { feature: 'View Meta Ads & Reports',      owner: true,  admin: true,  member: true,  guest: false },
  { feature: 'Approve / reject deliverables',owner: true,  admin: true,  member: false, guest: true  },
  { feature: 'Upload feedback files',        owner: true,  admin: true,  member: false, guest: true  },
  { feature: 'Billing & workspace settings', owner: true,  admin: false, member: false, guest: false },
  { feature: 'Delete workspace',             owner: true,  admin: false, member: false, guest: false },
];

function uid() { return Math.random().toString(36).slice(2); }

// ── Role Badge ─────────────────────────────────────────────────────────────────
function RoleBadge({ role }) {
  const r = ROLES.find(x => x.value === role) || ROLES[2];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: r.color + '18', color: r.color }}>
      <Icon name={r.icon} size={10} /> {r.label}
    </span>
  );
}

// ── Invite Modal ───────────────────────────────────────────────────────────────
function InviteModal({ workspaceId, onClose, onInvited }) {
  const [tab, setTab]     = React.useState('email'); // 'email' | 'link'
  const [email, setEmail] = React.useState('');
  const [role, setRole]   = React.useState('member');
  const [link, setLink]   = React.useState('');
  const [copied, setCopied] = React.useState(false);
  const [sending, setSending] = React.useState(false);
  const [sent, setSent]   = React.useState(false);

  async function generateLink() {
    let token = '';
    if (window.API?.createWorkspaceInvite) {
      try {
        const { data } = await window.API.createWorkspaceInvite({ workspace_id: workspaceId, role });
        token = data?.token;
      } catch {}
    }
    if (!token) token = uid() + uid();
    const url = `${window.location.origin}/join?token=${token}&role=${role}`;
    setLink(url);
  }

  async function sendInvite() {
    if (!email.trim()) return;
    setSending(true);
    try {
      if (window.API?.createWorkspaceInvite) {
        await window.API.createWorkspaceInvite({ workspace_id: workspaceId, email: email.trim(), role });
      }
      // Try Resend email
      try {
        await fetch('/api/invite', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: email.trim(), role }) });
      } catch {}
      setSent(true);
      onInvited?.();
    } catch {}
    setSending(false);
  }

  function copyLink() {
    navigator.clipboard.writeText(link).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={onClose}>
      <div style={{ background: 'white', borderRadius: 16, width: 480, overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid var(--slate-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>Invite to workspace</h2>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '3px 0 0' }}>Members get access based on their role</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}><Icon name="x" size={18} /></button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--slate-200)', padding: '0 24px' }}>
          {[['email','mail','Email invite'],['link','link','Invite link']].map(([t, icon, label]) => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: '12px 16px', border: 'none', background: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, fontFamily: 'var(--font-sans)', color: tab === t ? 'var(--blue-600)' : 'var(--text-muted)', borderBottom: tab === t ? '2px solid var(--blue-600)' : '2px solid transparent', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Icon name={icon} size={14} /> {label}
            </button>
          ))}
        </div>

        <div style={{ padding: 24 }}>
          {/* Role selector */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Role</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {ROLES.map(r => (
                <button key={r.value} onClick={() => setRole(r.value)}
                  style={{ padding: '10px 12px', border: `2px solid ${role === r.value ? r.color : 'var(--slate-200)'}`, borderRadius: 10, background: role === r.value ? r.color + '10' : 'white', cursor: 'pointer', textAlign: 'left' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: role === r.value ? r.color : 'var(--text-body)', marginBottom: 2 }}>
                    <Icon name={r.icon} size={13} /> {r.label}
                  </div>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>{r.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {tab === 'email' ? (
            sent ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: 40, marginBottom: 8 }}>✅</div>
                <p style={{ fontSize: 15, fontWeight: 700, margin: '0 0 4px' }}>Invite sent!</p>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>{email} will receive an email invite</p>
                <button onClick={() => { setSent(false); setEmail(''); }} style={{ marginTop: 16, padding: '8px 20px', background: 'var(--blue-600)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 600, fontFamily: 'var(--font-sans)' }}>Invite another</button>
              </div>
            ) : (
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>Email address</label>
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="colleague@company.com" type="email"
                  onKeyDown={e => e.key === 'Enter' && sendInvite()}
                  style={{ width: '100%', height: 40, padding: '0 14px', border: '1px solid var(--slate-200)', borderRadius: 9, fontSize: 14, fontFamily: 'var(--font-sans)', outline: 'none', boxSizing: 'border-box', marginBottom: 14 }} />
                <button onClick={sendInvite} disabled={sending || !email.trim()}
                  style={{ width: '100%', padding: '11px 0', background: email.trim() ? 'var(--blue-600)' : 'var(--slate-200)', color: 'white', border: 'none', borderRadius: 9, cursor: email.trim() ? 'pointer' : 'default', fontSize: 15, fontWeight: 700, fontFamily: 'var(--font-sans)' }}>
                  {sending ? 'Sending...' : 'Send invite'}
                </button>
              </div>
            )
          ) : (
            <div>
              {!link ? (
                <button onClick={generateLink} style={{ width: '100%', padding: '11px 0', background: 'var(--blue-600)', color: 'white', border: 'none', borderRadius: 9, cursor: 'pointer', fontSize: 15, fontWeight: 700, fontFamily: 'var(--font-sans)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <Icon name="link" size={16} /> Generate invite link
                </button>
              ) : (
                <div>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                    <input value={link} readOnly style={{ flex: 1, height: 38, padding: '0 12px', border: '1px solid var(--slate-200)', borderRadius: 8, fontSize: 12, fontFamily: 'monospace', background: 'var(--slate-50)', color: 'var(--text-muted)', outline: 'none' }} />
                    <button onClick={copyLink} style={{ height: 38, padding: '0 16px', background: copied ? 'var(--green-600)' : 'var(--blue-600)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-sans)', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Icon name={copied ? 'check' : 'copy'} size={14} /> {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>Link expires in 7 days · Anyone with this link can join as <strong>{role}</strong></p>
                  <button onClick={generateLink} style={{ marginTop: 10, fontSize: 12, color: 'var(--blue-600)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'var(--font-sans)' }}>Generate new link</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Team Card ──────────────────────────────────────────────────────────────────
function TeamCard({ team, allMembers, onAddMember, onRemoveMember, onDelete }) {
  const members = (team.team_memberships || []).map(m => m.team_members).filter(Boolean);
  const [hover, setHover] = React.useState(false);
  const [showAdd, setShowAdd] = React.useState(false);
  const [addId, setAddId] = React.useState('');
  const available = allMembers.filter(m => !members.some(tm => tm?.id === m.id));

  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ border: '1px solid var(--slate-200)', borderRadius: 14, overflow: 'hidden', background: 'white', transition: 'box-shadow 0.15s', boxShadow: hover ? 'var(--shadow-md)' : 'none' }}>
      <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--slate-100)', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: team.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon name={team.icon || 'users'} size={18} style={{ color: team.color }} />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>{team.name}</p>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '2px 0 0' }}>{members.length} member{members.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => onDelete(team.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4, opacity: hover ? 1 : 0, transition: 'opacity 0.15s' }}>
          <Icon name="trash-2" size={14} />
        </button>
      </div>
      <div style={{ padding: 14 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, minHeight: 40 }}>
          {members.map(m => m && (
            <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--slate-50)', border: '1px solid var(--slate-200)', borderRadius: 20, padding: '4px 10px 4px 6px', fontSize: 12 }}>
              <Avatar name={m.name} size="xs" />
              <span style={{ fontWeight: 500, color: 'var(--text-body)' }}>{m.name?.split(' ')[0]}</span>
              <button onClick={() => onRemoveMember(team.id, m.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0, lineHeight: 1, fontSize: 14, display: 'flex', alignItems: 'center' }}>×</button>
            </div>
          ))}
          {members.length === 0 && <p style={{ fontSize: 13, color: 'var(--text-muted)', fontStyle: 'italic' }}>No members yet</p>}
        </div>
        {showAdd ? (
          <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
            <select value={addId} onChange={e => setAddId(e.target.value)} style={{ flex: 1, height: 32, padding: '0 8px', border: '1px solid var(--slate-200)', borderRadius: 7, fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none' }}>
              <option value="">Pick member...</option>
              {available.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
            <button onClick={() => { if (addId) { onAddMember(team.id, addId); setAddId(''); setShowAdd(false); } }} style={{ height: 32, padding: '0 12px', background: 'var(--blue-600)', color: 'white', border: 'none', borderRadius: 7, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Add</button>
            <button onClick={() => setShowAdd(false)} style={{ height: 32, padding: '0 10px', background: 'none', border: '1px solid var(--slate-200)', borderRadius: 7, cursor: 'pointer', fontSize: 13, color: 'var(--text-muted)' }}>✕</button>
          </div>
        ) : (
          <button onClick={() => setShowAdd(true)} style={{ marginTop: 10, fontSize: 12, color: 'var(--blue-600)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'var(--font-sans)', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
            <Icon name="plus" size={13} /> Add member
          </button>
        )}
      </div>
    </div>
  );
}

// ── Permission Matrix ──────────────────────────────────────────────────────────
function PermissionMatrix() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
        <thead>
          <tr style={{ background: 'var(--slate-900)' }}>
            <th style={{ padding: '12px 16px', textAlign: 'left', color: 'white', fontSize: 12, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase' }}>Feature</th>
            {ROLES.map(r => (
              <th key={r.value} style={{ padding: '12px 16px', textAlign: 'center', color: 'white', fontSize: 12, fontWeight: 700 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 28, height: 28, borderRadius: '50%', background: r.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name={r.icon} size={13} style={{ color: 'white' }} />
                  </span>
                  {r.label}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {PERM_MATRIX.map((row, i) => (
            <tr key={row.feature} style={{ background: i % 2 === 0 ? 'white' : 'var(--slate-50)', borderBottom: '1px solid var(--slate-100)' }}>
              <td style={{ padding: '11px 16px', color: 'var(--text-body)', fontWeight: 500 }}>{row.feature}</td>
              {ROLES.map(r => (
                <td key={r.value} style={{ padding: '11px 16px', textAlign: 'center' }}>
                  {row[r.value]
                    ? <span style={{ display: 'inline-flex', width: 22, height: 22, borderRadius: '50%', background: '#dcfce7', alignItems: 'center', justifyContent: 'center' }}><Icon name="check" size={13} style={{ color: '#16a34a' }} /></span>
                    : <span style={{ display: 'inline-flex', width: 22, height: 22, borderRadius: '50%', background: 'var(--slate-100)', alignItems: 'center', justifyContent: 'center' }}><Icon name="minus" size={13} style={{ color: 'var(--slate-400)' }} /></span>
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Main Workspace Screen ──────────────────────────────────────────────────────
function Workspace() {
  useLucide();
  const [tab, setTab] = React.useState('members'); // 'members' | 'teams' | 'invites' | 'permissions'
  const [workspaces, setWorkspaces] = React.useState([]);
  const [activeWs, setActiveWs] = React.useState(null);
  const [members, setMembers] = React.useState([]);
  const [teams, setTeams] = React.useState([]);
  const [invites, setInvites] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [showInviteModal, setShowInviteModal] = React.useState(false);
  const [showNewTeam, setShowNewTeam] = React.useState(false);
  const [showNewWs, setShowNewWs] = React.useState(false);
  const [newTeam, setNewTeam] = React.useState({ name: '', color: TEAM_COLORS[0], icon: 'users' });
  const [newWs, setNewWs] = React.useState({ name: '', description: '' });
  const [search, setSearch] = React.useState('');
  const [roleFilter, setRoleFilter] = React.useState('all');
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (!window.API) { setLoading(false); return; }
    (async () => {
      try {
        const { data: ws } = await window.API.getWorkspaces();
        const wsArr = ws || [];
        setWorkspaces(wsArr);
        const first = wsArr[0] || null;
        setActiveWs(first);
      } catch {}
      try { const { data } = await window.API.getTeam(); setMembers(data || []); } catch {}
      setLoading(false);
    })();
  }, []);

  React.useEffect(() => {
    if (!activeWs || !window.API) return;
    (async () => {
      try { const { data } = await window.API.getTeams(activeWs.id); setTeams(data || []); } catch {}
      try { const { data } = await window.API.getWorkspaceInvites(activeWs.id); setInvites(data || []); } catch {}
    })();
  }, [activeWs?.id]);

  async function createWorkspace() {
    if (!newWs.name.trim() || !window.API) return;
    setSaving(true);
    try {
      const slug = newWs.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const { data } = await window.API.createWorkspace({ name: newWs.name.trim(), slug, description: newWs.description });
      if (data) { setWorkspaces(prev => [...prev, data]); setActiveWs(data); setNewWs({ name: '', description: '' }); setShowNewWs(false); }
    } catch {}
    setSaving(false);
  }

  async function createTeam() {
    if (!newTeam.name.trim() || !activeWs || !window.API) return;
    setSaving(true);
    try {
      const { data } = await window.API.createTeam({ ...newTeam, workspace_id: activeWs.id });
      if (data) { setTeams(prev => [...prev, { ...data, team_memberships: [] }]); setNewTeam({ name: '', color: TEAM_COLORS[0], icon: 'users' }); setShowNewTeam(false); }
    } catch {}
    setSaving(false);
  }

  async function deleteTeam(id) {
    if (!window.API) return;
    try { await window.API.deleteTeam(id); setTeams(prev => prev.filter(t => t.id !== id)); } catch {}
  }

  async function addTeamMember(teamId, memberId) {
    if (!window.API) return;
    try {
      await window.API.addTeamMembership({ team_id: teamId, member_id: memberId });
      const member = members.find(m => m.id === memberId);
      setTeams(prev => prev.map(t => t.id === teamId ? { ...t, team_memberships: [...(t.team_memberships || []), { member_id: memberId, team_members: member }] } : t));
    } catch {}
  }

  async function removeMember(teamId, memberId) {
    if (!window.API) return;
    try {
      await window.API.removeTeamMembership(teamId, memberId);
      setTeams(prev => prev.map(t => t.id === teamId ? { ...t, team_memberships: (t.team_memberships || []).filter(m => m.member_id !== memberId) } : t));
    } catch {}
  }

  async function updateMemberRole(memberId, newRole) {
    if (!window.API) return;
    try {
      await window.API.updateTeamMember(memberId, { role: newRole });
      setMembers(prev => prev.map(m => m.id === memberId ? { ...m, role: newRole } : m));
    } catch {}
  }

  async function revokeInvite(id) {
    if (!window.API) return;
    try { await window.API.revokeInvite(id); setInvites(prev => prev.filter(i => i.id !== id)); } catch {}
  }

  const filteredMembers = members.filter(m => {
    const matchSearch = !search || m.name?.toLowerCase().includes(search.toLowerCase()) || m.email?.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || m.role === roleFilter || m.access_level === roleFilter;
    return matchSearch && matchRole;
  });

  const TABS = [
    { id: 'members', label: 'Members', icon: 'users', count: members.length },
    { id: 'teams', label: 'Sub-Teams', icon: 'layout-grid', count: teams.length },
    { id: 'invites', label: 'Invites', icon: 'mail', count: invites.filter(i => !i.accepted_at).length },
    { id: 'permissions', label: 'Permissions', icon: 'shield' },
  ];

  if (loading) return <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)' }}>Loading workspace...</div>;

  return (
    <div style={{ padding: '28px 32px', maxWidth: 1100, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, marginBottom: 28 }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', margin: '0 0 4px' }}>Workspace</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>Manage members, teams, and access for your workspace</p>
        </div>
        {/* Workspace switcher */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', border: '1px solid var(--slate-200)', borderRadius: 10, background: 'white', minWidth: 180 }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: 'var(--blue-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon name="briefcase" size={14} style={{ color: 'white' }} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 700, margin: 0 }}>{activeWs?.name || 'No workspace'}</p>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>{activeWs?.plan || 'free'} plan</p>
            </div>
          </div>
          {workspaces.length > 1 && (
            <select value={activeWs?.id || ''} onChange={e => setActiveWs(workspaces.find(w => w.id === e.target.value))}
              style={{ height: 38, padding: '0 10px', border: '1px solid var(--slate-200)', borderRadius: 9, fontSize: 13, fontFamily: 'var(--font-sans)', background: 'white', cursor: 'pointer', outline: 'none' }}>
              {workspaces.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
            </select>
          )}
          <button onClick={() => setShowNewWs(true)} style={{ height: 38, padding: '0 14px', background: 'var(--slate-50)', border: '1px solid var(--slate-200)', borderRadius: 9, cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-sans)', color: 'var(--text-body)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon name="plus" size={14} /> New workspace
          </button>
          <button onClick={() => setShowInviteModal(true)} style={{ height: 38, padding: '0 18px', background: 'var(--blue-600)', color: 'white', border: 'none', borderRadius: 9, cursor: 'pointer', fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-sans)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon name="user-plus" size={15} /> Invite member
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Total members', value: members.length, icon: 'users', color: 'var(--blue-600)' },
          { label: 'Sub-teams', value: teams.length, icon: 'layout-grid', color: 'var(--purple-600)' },
          { label: 'Pending invites', value: invites.filter(i => !i.accepted_at).length, icon: 'mail', color: 'var(--amber-600)' },
          { label: 'Guest accounts', value: members.filter(m => m.role === 'guest' || m.access_level === 'guest').length, icon: 'eye', color: 'var(--green-600)' },
        ].map(s => (
          <div key={s.label} style={{ background: 'white', border: '1px solid var(--slate-200)', borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 9, background: s.color + '12', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name={s.icon} size={17} style={{ color: s.color }} />
            </div>
            <div>
              <p style={{ fontSize: 22, fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>{s.value}</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 2, marginBottom: 20, background: 'var(--slate-100)', borderRadius: 10, padding: 4, width: 'fit-content' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, fontFamily: 'var(--font-sans)', background: tab === t.id ? 'white' : 'transparent', color: tab === t.id ? 'var(--text-body)' : 'var(--text-muted)', boxShadow: tab === t.id ? '0 1px 4px rgba(0,0,0,0.08)' : 'none' }}>
            <Icon name={t.icon} size={14} />
            {t.label}
            {t.count !== undefined && t.count > 0 && <span style={{ fontSize: 11, fontWeight: 700, background: tab === t.id ? 'var(--blue-100)' : 'var(--slate-200)', color: tab === t.id ? 'var(--blue-700)' : 'var(--text-muted)', borderRadius: 20, padding: '1px 7px' }}>{t.count}</span>}
          </button>
        ))}
      </div>

      {/* ── Members tab ── */}
      {tab === 'members' && (
        <div>
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Icon name="search" size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search members..."
                style={{ width: '100%', paddingLeft: 32, height: 38, border: '1px solid var(--slate-200)', borderRadius: 9, fontSize: 14, fontFamily: 'var(--font-sans)', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} style={{ height: 38, padding: '0 12px', border: '1px solid var(--slate-200)', borderRadius: 9, fontSize: 14, fontFamily: 'var(--font-sans)', background: 'white', cursor: 'pointer', outline: 'none' }}>
              <option value="all">All roles</option>
              {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </div>
          <div style={{ background: 'white', border: '1px solid var(--slate-200)', borderRadius: 12, overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 12, padding: '10px 18px', background: 'var(--slate-50)', borderBottom: '1px solid var(--slate-200)', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              <span>Member</span><span>Department</span><span>Role</span><span>Access</span>
            </div>
            {filteredMembers.map((m, i) => (
              <div key={m.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 12, padding: '13px 18px', borderBottom: i < filteredMembers.length - 1 ? '1px solid var(--slate-100)' : 'none', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Avatar name={m.name} size="sm" status={m.status === 'active' ? 'online' : 'offline'} />
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>{m.name}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>{m.email || '—'}</p>
                  </div>
                </div>
                <span style={{ fontSize: 13, color: 'var(--text-body)' }}>{m.department || '—'}</span>
                <RoleBadge role={m.role || m.access_level || 'member'} />
                <select value={m.role || m.access_level || 'member'} onChange={e => updateMemberRole(m.id, e.target.value)}
                  style={{ height: 30, padding: '0 8px', border: '1px solid var(--slate-200)', borderRadius: 7, fontSize: 13, fontFamily: 'var(--font-sans)', background: 'white', cursor: 'pointer', outline: 'none' }}>
                  {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
              </div>
            ))}
            {filteredMembers.length === 0 && (
              <div style={{ padding: '40px 18px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>No members found</div>
            )}
          </div>
        </div>
      )}

      {/* ── Sub-Teams tab ── */}
      {tab === 'teams' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
            <button onClick={() => setShowNewTeam(t => !t)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 18px', background: 'var(--blue-600)', color: 'white', border: 'none', borderRadius: 9, cursor: 'pointer', fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-sans)' }}>
              <Icon name="plus" size={15} /> New team
            </button>
          </div>

          {/* New team form */}
          {showNewTeam && (
            <div style={{ background: 'white', border: '1px solid var(--blue-200)', borderRadius: 12, padding: 20, marginBottom: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 14px' }}>Create sub-team</h3>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <input value={newTeam.name} onChange={e => setNewTeam(t => ({ ...t, name: e.target.value }))} placeholder="Team name (e.g. Design, Dev...)"
                  style={{ flex: 1, minWidth: 200, height: 38, padding: '0 12px', border: '1px solid var(--slate-200)', borderRadius: 8, fontSize: 14, fontFamily: 'var(--font-sans)', outline: 'none' }} />
                <div style={{ display: 'flex', gap: 6 }}>
                  {TEAM_COLORS.map(c => (
                    <button key={c} onClick={() => setNewTeam(t => ({ ...t, color: c }))} style={{ width: 28, height: 28, borderRadius: '50%', background: c, border: newTeam.color === c ? '3px solid var(--slate-800)' : '2px solid transparent', cursor: 'pointer', padding: 0 }} />
                  ))}
                </div>
                <select value={newTeam.icon} onChange={e => setNewTeam(t => ({ ...t, icon: e.target.value }))} style={{ height: 38, padding: '0 10px', border: '1px solid var(--slate-200)', borderRadius: 8, fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none', cursor: 'pointer' }}>
                  {TEAM_ICONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
                </select>
                <button onClick={createTeam} disabled={saving} style={{ height: 38, padding: '0 18px', background: 'var(--blue-600)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-sans)' }}>{saving ? 'Creating...' : 'Create'}</button>
                <button onClick={() => setShowNewTeam(false)} style={{ height: 38, padding: '0 14px', background: 'none', border: '1px solid var(--slate-200)', borderRadius: 8, cursor: 'pointer', fontSize: 14, color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' }}>Cancel</button>
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
            {teams.map(team => (
              <TeamCard key={team.id} team={team} allMembers={members} onAddMember={addTeamMember} onRemoveMember={removeMember} onDelete={deleteTeam} />
            ))}
            {teams.length === 0 && (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
                <Icon name="layout-grid" size={40} style={{ color: 'var(--slate-200)', display: 'block', margin: '0 auto 12px' }} />
                <p style={{ fontSize: 15, fontWeight: 600, margin: '0 0 6px', color: 'var(--text-heading)' }}>No sub-teams yet</p>
                <p style={{ fontSize: 13, margin: 0 }}>Create teams like Design, Dev, Marketing to organize your members</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Invites tab ── */}
      {tab === 'invites' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
            <button onClick={() => setShowInviteModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 18px', background: 'var(--blue-600)', color: 'white', border: 'none', borderRadius: 9, cursor: 'pointer', fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-sans)' }}>
              <Icon name="user-plus" size={15} /> Invite member
            </button>
          </div>
          <div style={{ background: 'white', border: '1px solid var(--slate-200)', borderRadius: 12, overflow: 'hidden' }}>
            {invites.length === 0 ? (
              <div style={{ padding: '48px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
                <Icon name="mail" size={40} style={{ color: 'var(--slate-200)', display: 'block', margin: '0 auto 12px' }} />
                <p style={{ fontSize: 15, fontWeight: 600, margin: '0 0 4px', color: 'var(--text-heading)' }}>No pending invites</p>
                <p style={{ fontSize: 13, margin: 0 }}>Invite your team via email or share an invite link</p>
              </div>
            ) : invites.map((inv, i) => (
              <div key={inv.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', borderBottom: i < invites.length - 1 ? '1px solid var(--slate-100)' : 'none' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--slate-100)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="mail" size={16} style={{ color: 'var(--text-muted)' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>{inv.email || 'Link invite'}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '2px 0 0' }}>
                    Invited by {inv.team_members?.name || 'Unknown'} · {new Date(inv.created_at).toLocaleDateString()}
                    {inv.expires_at && ` · expires ${new Date(inv.expires_at).toLocaleDateString()}`}
                  </p>
                </div>
                <RoleBadge role={inv.role} />
                <span style={{ fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: inv.accepted_at ? '#dcfce7' : '#fef9c3', color: inv.accepted_at ? '#15803d' : '#92400e' }}>
                  {inv.accepted_at ? 'Accepted' : 'Pending'}
                </span>
                {!inv.accepted_at && (
                  <button onClick={() => revokeInvite(inv.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--red-500)', fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-sans)', padding: '4px 8px' }}>Revoke</button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Permissions tab ── */}
      {tab === 'permissions' && (
        <div>
          <div style={{ marginBottom: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 4px' }}>Role Permissions</h2>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0 }}>What each role can do in this workspace. Guest = client-facing limited access.</p>
          </div>
          <div style={{ background: 'white', border: '1px solid var(--slate-200)', borderRadius: 12, overflow: 'hidden' }}>
            <PermissionMatrix />
          </div>
          <div style={{ marginTop: 16, padding: '16px 20px', background: 'var(--green-50)', borderRadius: 10, border: '1px solid var(--green-200)', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <Icon name="eye" size={18} style={{ color: 'var(--green-700)', marginTop: 1, flexShrink: 0 }} />
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--green-800)', margin: '0 0 3px' }}>Guest (Client) Access</p>
              <p style={{ fontSize: 13, color: 'var(--green-700)', margin: 0 }}>
                Clients invited as <strong>Guest</strong> see only the Client Portal — project progress, invoices, and deliverables pending their approval. They cannot access Team Chat, Finance details, or any internal workspace data.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* New Workspace Modal */}
      {showNewWs && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowNewWs(false)}>
          <div style={{ background: 'white', borderRadius: 16, padding: 28, width: 420 }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 18px' }}>New workspace</h2>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>Workspace name</label>
            <input value={newWs.name} onChange={e => setNewWs(w => ({ ...w, name: e.target.value }))} placeholder="e.g. Brand Studio, Client X..."
              style={{ width: '100%', height: 40, padding: '0 14px', border: '1px solid var(--slate-200)', borderRadius: 9, fontSize: 14, fontFamily: 'var(--font-sans)', outline: 'none', boxSizing: 'border-box', marginBottom: 12 }} />
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>Description (optional)</label>
            <input value={newWs.description} onChange={e => setNewWs(w => ({ ...w, description: e.target.value }))} placeholder="What this workspace is for..."
              style={{ width: '100%', height: 38, padding: '0 14px', border: '1px solid var(--slate-200)', borderRadius: 9, fontSize: 14, fontFamily: 'var(--font-sans)', outline: 'none', boxSizing: 'border-box', marginBottom: 20 }} />
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={createWorkspace} disabled={saving || !newWs.name.trim()} style={{ flex: 1, padding: '10px 0', background: 'var(--blue-600)', color: 'white', border: 'none', borderRadius: 9, cursor: 'pointer', fontSize: 15, fontWeight: 700, fontFamily: 'var(--font-sans)' }}>{saving ? 'Creating...' : 'Create workspace'}</button>
              <button onClick={() => setShowNewWs(false)} style={{ padding: '10px 18px', background: 'none', border: '1px solid var(--slate-200)', borderRadius: 9, cursor: 'pointer', fontSize: 14, color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <InviteModal workspaceId={activeWs?.id} onClose={() => setShowInviteModal(false)} onInvited={() => { /* refresh invites */ }} />
      )}
    </div>
  );
}

Object.assign(window, { Workspace });
})();
