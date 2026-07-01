// Sales pipeline screen — deal kanban.
(() => {
const { Card, Badge, Avatar } = window.TechyFuelOSDesignSystem_be0222;

const STAGE_CONFIG = [
  { id: 'lead',        label: 'New lead',       dot: 'var(--slate-400)' },
  { id: 'qualified',   label: 'Qualified',      dot: 'var(--blue-500)' },
  { id: 'proposal',    label: 'Proposal sent',  dot: 'var(--violet-500)' },
  { id: 'negotiation', label: 'Negotiation',    dot: 'var(--amber-500)' },
  { id: 'won',         label: 'Won',            dot: 'var(--green-500)' },
  { id: 'lost',        label: 'Lost',           dot: 'var(--red-400)' },
];


function fmtVal(n) {
  if (!n) return '$0';
  if (n >= 1000) return '$' + (n / 1000).toFixed(1) + 'K';
  return '$' + n;
}

function Deal({ d }) {
  const [h, sh] = React.useState(false);
  const clientName = d.clients ? d.clients.name : '—';
  const assignedName = d.team_members ? d.team_members.name : null;
  return (
    <div onMouseEnter={() => sh(true)} onMouseLeave={() => sh(false)} style={{ background: 'var(--slate-0)', border: `1px solid ${h ? 'var(--slate-200)' : 'var(--border-subtle)'}`, borderRadius: 'var(--radius-lg)', padding: 11, boxShadow: h ? 'var(--shadow-md)' : 'var(--shadow-xs)', cursor: 'grab', transition: 'all var(--dur-fast) var(--ease-out)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-bold)', color: 'var(--text-strong)' }}>{clientName}</span>
        {d.probability >= 80 && <Icon name="flame" size={14} style={{ color: 'var(--red-500)' }} />}
      </div>
      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 8, lineHeight: 1.3 }}>{d.title}</div>
      <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--fw-extrabold)', color: 'var(--blue-600)', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums', marginBottom: 9 }}>{fmtVal(d.value)}</div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {d.probability != null && <Badge tone="neutral" size="sm">{d.probability}% prob.</Badge>}
        {assignedName && <Avatar name={assignedName} size="xs" />}
      </div>
    </div>
  );
}

function Pipeline() {
  useLucide();
  const [stageMap, setStageMap] = React.useState(() => {
    const m = {};
    STAGE_CONFIG.forEach(s => { m[s.id] = []; });
    return m;
  });
  const [totals, setTotals] = React.useState({ count: 0, value: 0 });
  const [clients, setClients] = React.useState([]);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState({ title: '', client_id: '', value: '', stage: 'lead', probability: '' });

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  React.useEffect(() => {
    if (!window.API) return;
    (async () => {
      try {
        const r = await window.API.getPipeline();
        if (r.data) {
          const m = {};
          STAGE_CONFIG.forEach(s => { m[s.id] = []; });
          r.data.forEach(d => {
            const key = d.stage || 'lead';
            if (!m[key]) m[key] = [];
            m[key].push(d);
          });
          setStageMap(m);
          const openDeals = r.data.filter(d => d.stage !== 'won' && d.stage !== 'lost');
          setTotals({ count: openDeals.length, value: openDeals.reduce((s, d) => s + (d.value || 0), 0) });
        }
      } catch {}
      try {
        const r = await window.API.getClients();
        if (r.data) setClients(r.data);
      } catch {}
    })();
  }, []);

  async function handleAddDeal() {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      const payload = { title: form.title, stage: form.stage };
      if (form.client_id)   payload.client_id   = form.client_id;
      if (form.value)       payload.value       = Number(form.value);
      if (form.probability) payload.probability = Number(form.probability);
      if (window.API) {
        const { data, error } = await window.API.createDeal(payload);
        if (!error && data) {
          const clientName = clients.find(c => c.id === form.client_id)?.name || null;
          const newDeal = { ...data, clients: clientName ? { name: clientName } : null };
          const stage = data.stage || 'lead';
          setStageMap(prev => ({ ...prev, [stage]: [...(prev[stage] || []), newDeal] }));
          if (stage !== 'won' && stage !== 'lost') {
            setTotals(prev => ({ count: prev.count + 1, value: prev.value + (data.value || 0) }));
          }
        }
      }
      setModalOpen(false);
      setForm({ title: '', client_id: '', value: '', stage: 'lead', probability: '' });
    } finally { setSaving(false); }
  }

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--fw-extrabold)', letterSpacing: '-0.02em' }}>Sales pipeline</h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 2 }}>{totals.count} open deals · {fmtVal(totals.value)} weighted value</p>
        </div>
        <button onClick={() => setModalOpen(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, height: 36, padding: '0 14px', background: 'var(--blue-600)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-brand)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', cursor: 'pointer' }}>
          <Icon name="plus" size={16} /> Add deal
        </button>
      </div>
      <div className="tf-scroll" style={{ flex: 1, display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 8, alignItems: 'flex-start' }}>
        {STAGE_CONFIG.map(s => {
          const deals = stageMap[s.id] || [];
          const stageTotal = deals.reduce((a, d) => a + (d.value || 0), 0);
          return (
            <div key={s.id} style={{ width: 230, flex: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '2px 4px' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: s.dot }} />
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-bold)', color: 'var(--text-strong)' }}>{s.label}</span>
                <span style={{ fontSize: 'var(--text-2xs)', fontWeight: 'var(--fw-bold)', color: 'var(--text-muted)', marginLeft: 'auto', fontVariantNumeric: 'tabular-nums' }}>{fmtVal(stageTotal)}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, background: 'var(--slate-100)', borderRadius: 'var(--radius-xl)', padding: 10, minHeight: 100 }}>
                {deals.map((d, i) => <Deal key={d.id || i} d={d} />)}
              </div>
            </div>
          );
        })}
      </div>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add deal" onSubmit={handleAddDeal} loading={saving} submitLabel="Add deal">
        <FormRow label="Deal title" required>
          <input style={FF.input} placeholder="Deal description…" value={form.title} onChange={e => set('title', e.target.value)} />
        </FormRow>
        <FormRow label="Client">
          <select style={FF.select} value={form.client_id} onChange={e => set('client_id', e.target.value)}>
            <option value="">No client</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.company || c.name}</option>)}
          </select>
        </FormRow>
        <div style={FF.row2}>
          <FormRow label="Value ($)">
            <input style={FF.input} type="number" placeholder="0" value={form.value} onChange={e => set('value', e.target.value)} />
          </FormRow>
          <FormRow label="Probability (%)">
            <input style={FF.input} type="number" placeholder="50" min="0" max="100" value={form.probability} onChange={e => set('probability', e.target.value)} />
          </FormRow>
        </div>
        <FormRow label="Stage">
          <select style={FF.select} value={form.stage} onChange={e => set('stage', e.target.value)}>
            <option value="lead">New lead</option>
            <option value="qualified">Qualified</option>
            <option value="proposal">Proposal sent</option>
            <option value="negotiation">Negotiation</option>
            <option value="won">Won</option>
          </select>
        </FormRow>
      </Modal>
    </div>
  );
}
Object.assign(window, { Pipeline });
})();
