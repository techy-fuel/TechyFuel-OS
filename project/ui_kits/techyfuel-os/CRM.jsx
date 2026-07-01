// Client CRM screen — table + selectable profile panel.
(() => {
const { Card, Badge, Avatar, Tabs, Input } = window.TechyFuelOSDesignSystem_be0222;

const TF_STATUS = {
  active:   { tone: 'success', label: 'Active client' },
  inactive: { tone: 'neutral', label: 'Inactive' },
  lead:     { tone: 'brand',   label: 'Lead' },
};



function fmtValue(n) {
  if (!n) return '$0/mo';
  return '$' + Number(n).toLocaleString() + '/mo';
}

function Th({ children, w }) {
  return <th style={{ textAlign: 'left', padding: '0 14px 10px', fontSize: 'var(--text-2xs)', fontWeight: 'var(--fw-bold)', letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase', color: 'var(--text-subtle)', width: w }}>{children}</th>;
}

function ClientRow({ c, selected, onClick }) {
  const [hover, setHover] = React.useState(false);
  const s = TF_STATUS[c.status] || TF_STATUS.lead;
  const displayName = c.company || c.name;
  return (
    <tr onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ cursor: 'pointer', background: selected ? 'var(--blue-50)' : hover ? 'var(--slate-50)' : 'transparent', transition: 'background var(--dur-fast) var(--ease-out)' }}>
      <td style={{ padding: '11px 14px', borderTop: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar name={displayName} size="sm" />
          <div>
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)' }}>{displayName}</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{c.website || c.email}</div>
          </div>
        </div>
      </td>
      <td style={{ padding: '11px 14px', borderTop: '1px solid var(--border-subtle)', fontSize: 'var(--text-sm)', color: 'var(--text-body)' }}>{c.name}</td>
      <td style={{ padding: '11px 14px', borderTop: '1px solid var(--border-subtle)' }}><Badge tone={s.tone} dot>{s.label}</Badge></td>
      <td style={{ padding: '11px 14px', borderTop: '1px solid var(--border-subtle)', fontSize: 'var(--text-sm)', color: 'var(--text-body)' }}>{c.industry || '—'}</td>
      <td style={{ padding: '11px 14px', borderTop: '1px solid var(--border-subtle)', fontSize: 'var(--text-sm)', color: 'var(--text-body)' }}>{c.email}</td>
      <td style={{ padding: '11px 14px', borderTop: '1px solid var(--border-subtle)', fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-bold)', color: 'var(--text-strong)', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{fmtValue(c.monthly_value)}</td>
    </tr>
  );
}

function ProfileField({ icon, label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: '1px solid var(--border-subtle)' }}>
      <Icon name={icon} size={16} style={{ color: 'var(--text-subtle)', flex: 'none' }} />
      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', width: 76, flex: 'none' }}>{label}</span>
      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-strong)', fontWeight: 'var(--fw-medium)', textAlign: 'right', flex: 1 }}>{value}</span>
    </div>
  );
}

function CRM() {
  useLucide();
  const [clients, setClients] = React.useState([]);
  const [selId,   setSelId]   = React.useState(null);
  const [search,  setSearch]  = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [modalOpen,      setModalOpen]      = React.useState(false);
  const [saving,         setSaving]         = React.useState(false);
  const [deleting,       setDeleting]       = React.useState(false);
  const [confirmDelete,  setConfirmDelete]  = React.useState(false);
  const [form, setForm] = React.useState({ name: '', company: '', email: '', website: '', industry: '', monthly_value: '', status: 'active' });

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  React.useEffect(() => {
    if (!window.API) { setLoading(false); return; }
    (async () => {
      try {
        const { data } = await window.API.getClients();
        if (Array.isArray(data) && data.length > 0) {
          setClients(data);
          setSelId(data[0].id);
        }
      } catch {}
      setLoading(false);
    })();
  }, []);

  async function handleDeleteClient(id) {
    setDeleting(true);
    if (window.API) {
      try { await window.API.deleteClient(id); } catch(_) {}
    }
    const remaining = clients.filter(c => c.id !== id);
    setClients(remaining);
    setSelId(remaining[0]?.id || null);
    setConfirmDelete(false);
    setDeleting(false);
  }

  async function handleAddClient() {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      const payload = { name: form.name, status: form.status };
      if (form.company)       payload.company       = form.company;
      if (form.email)         payload.email         = form.email;
      if (form.website)       payload.website       = form.website;
      if (form.industry)      payload.industry      = form.industry;
      if (form.monthly_value) payload.monthly_value = Number(form.monthly_value);
      if (window.API) {
        const { data, error } = await window.API.createClient(payload);
        if (!error && data) {
          setClients(prev => [...prev, data]);
          setSelId(data.id);
        }
      }
      setModalOpen(false);
      setForm({ name: '', company: '', email: '', website: '', industry: '', monthly_value: '', status: 'active' });
    } finally { setSaving(false); }
  }

  const filtered = clients.filter(c => {
    const q = search.toLowerCase();
    return !q || (c.company || c.name || '').toLowerCase().includes(q) || (c.name || '').toLowerCase().includes(q);
  });

  if (loading) {
    return <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>Loading…</div>;
  }

  const sel = clients.find(c => c.id === selId) || clients[0];
  const s = TF_STATUS[sel.status] || TF_STATUS.lead;
  const displayName = sel.company || sel.name;
  const activeCount = clients.filter(c => c.status === 'active').length;
  const totalValue = clients.reduce((s, c) => s + (Number(c.monthly_value) || 0), 0);

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--fw-extrabold)', letterSpacing: '-0.02em' }}>Client CRM</h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 2 }}>{clients.length} clients · ${Number(totalValue).toLocaleString()}/mo in retainers</p>
        </div>
        <button onClick={() => setModalOpen(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, height: 36, padding: '0 14px', background: 'var(--blue-600)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-brand)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', cursor: 'pointer' }}>
          <Icon name="user-plus" size={16} /> Add client
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 320px', gap: 16, alignItems: 'start' }}>
        <Card padding="none">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 14, borderBottom: '1px solid var(--border-subtle)' }}>
            <div style={{ width: 230 }}>
              <Input size="sm" placeholder="Search clients…" iconLeft={<Icon name="search" size={16} />} value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, height: 30, padding: '0 11px', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-body)', cursor: 'pointer' }}>
              <Icon name="filter" size={15} style={{ color: 'var(--text-muted)' }} /> Status
            </div>
            <div style={{ flex: 1 }} />
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{filtered.length} of {clients.length}</span>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr><Th>Company</Th><Th>Contact</Th><Th>Status</Th><Th>Industry</Th><Th>Email</Th><Th w="100">Value</Th></tr></thead>
            <tbody>{filtered.map(c => <ClientRow key={c.id} c={c} selected={c.id === selId} onClick={() => { setSelId(c.id); setConfirmDelete(false); }} />)}</tbody>
          </table>
        </Card>

        <Card padding="none" style={{ overflow: 'hidden', position: 'sticky', top: 84 }}>
          <div style={{ background: 'var(--grad-hero)', padding: '20px 18px', borderBottom: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Avatar name={displayName} size="lg" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--fw-bold)', color: 'var(--text-strong)', letterSpacing: '-0.01em' }}>{displayName}</div>
                <div style={{ marginTop: 4 }}><Badge tone={s.tone} dot>{s.label}</Badge></div>
              </div>
              {confirmDelete
                ? <div style={{ display: 'flex', gap: 5, flex: 'none' }}>
                    <button onClick={() => handleDeleteClient(sel.id)} disabled={deleting} style={{ height: 28, padding: '0 10px', background: 'var(--red-600)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-bold)', cursor: 'pointer' }}>{deleting ? '…' : 'Delete'}</button>
                    <button onClick={() => setConfirmDelete(false)} style={{ height: 28, padding: '0 10px', background: 'var(--slate-0)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-semibold)', cursor: 'pointer', color: 'var(--text-body)' }}>Cancel</button>
                  </div>
                : <button onClick={() => setConfirmDelete(true)} title="Delete client" style={{ width: 30, height: 30, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'var(--red-50)', border: '1px solid var(--red-200)', borderRadius: 'var(--radius-md)', cursor: 'pointer', color: 'var(--red-600)', flex: 'none' }}>
                    <Icon name="trash-2" size={15} />
                  </button>
              }
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
              {[['mail', 'Email'], ['message-circle', 'WhatsApp'], ['calendar-plus', 'Meeting']].map(([ic, l]) => (
                <button key={l} onClick={() => {
                  if (ic === 'mail' && sel.email) window.open(`mailto:${sel.email}`, '_blank');
                  else if (ic === 'message-circle' && sel.phone) window.open(`https://wa.me/${sel.phone.replace(/\D/g,'')}`, '_blank');
                }} style={{ flex: 1, display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '8px 0', background: 'var(--slate-0)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-2xs)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-body)' }}>
                  <Icon name={ic} size={17} style={{ color: 'var(--blue-600)' }} /> {l}
                </button>
              ))}
            </div>
            {/* Portal link */}
            {sel.email && (
              <button onClick={() => {
                const url = window.location.origin + '/client-portal.html';
                try { navigator.clipboard.writeText(url); } catch {}
                const el = document.activeElement;
                if (el) { const t = el.textContent; el.textContent = 'Copied!'; setTimeout(() => el.textContent = t, 1800); }
              }} style={{ width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7, height: 34, marginTop: 8, background: 'var(--blue-50)', color: 'var(--blue-700)', border: '1px solid var(--blue-200)', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-semibold)', cursor: 'pointer' }}>
                <Icon name="external-link" size={14} /> Copy client portal link
              </button>
            )}
          </div>
          <div style={{ padding: '6px 18px 14px' }}>
            <ProfileField icon="user" label="Contact" value={sel.name} />
            <ProfileField icon="at-sign" label="Email" value={sel.email || '—'} />
            <ProfileField icon="globe" label="Website" value={sel.website || '—'} />
            <ProfileField icon="briefcase" label="Industry" value={sel.industry || '—'} />
            <ProfileField icon="banknote" label="Value" value={fmtValue(sel.monthly_value)} />
          </div>
          <div style={{ padding: '0 18px 18px' }}>
            <div style={{ fontSize: 'var(--text-2xs)', fontWeight: 'var(--fw-bold)', letterSpacing: 'var(--tracking-caps)', textTransform: 'uppercase', color: 'var(--text-subtle)', marginBottom: 10 }}>Portal access</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Client can log in at the portal link using <strong>{sel.email || 'their email'}</strong>. They will receive a magic link to sign in securely.
            </div>
          </div>
        </Card>
      </div>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add client" onSubmit={handleAddClient} loading={saving} submitLabel="Add client">
        <div style={FF.row2}>
          <FormRow label="Contact name" required>
            <input style={FF.input} placeholder="Full name…" value={form.name} onChange={e => set('name', e.target.value)} />
          </FormRow>
          <FormRow label="Company">
            <input style={FF.input} placeholder="Company name…" value={form.company} onChange={e => set('company', e.target.value)} />
          </FormRow>
        </div>
        <div style={FF.row2}>
          <FormRow label="Email">
            <input style={FF.input} type="email" placeholder="email@company.com" value={form.email} onChange={e => set('email', e.target.value)} />
          </FormRow>
          <FormRow label="Website">
            <input style={FF.input} placeholder="company.com" value={form.website} onChange={e => set('website', e.target.value)} />
          </FormRow>
        </div>
        <div style={FF.row2}>
          <FormRow label="Industry">
            <input style={FF.input} placeholder="SaaS, F&B…" value={form.industry} onChange={e => set('industry', e.target.value)} />
          </FormRow>
          <FormRow label="Monthly value ($)">
            <input style={FF.input} type="number" placeholder="0" value={form.monthly_value} onChange={e => set('monthly_value', e.target.value)} />
          </FormRow>
        </div>
        <FormRow label="Status">
          <select style={FF.select} value={form.status} onChange={e => set('status', e.target.value)}>
            <option value="lead">Lead</option>
            <option value="active">Active client</option>
            <option value="inactive">Inactive</option>
          </select>
        </FormRow>
      </Modal>
    </div>
  );
}

Object.assign(window, { CRM });

})();
