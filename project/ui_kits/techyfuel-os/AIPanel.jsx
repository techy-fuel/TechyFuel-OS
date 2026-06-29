// AI Assistant — real chat connected to Supabase workspace data.
(() => {

const SUGGESTIONS = ['Summarize this week', 'Detect deadline risks', 'How\'s our revenue?', 'Draft 6 captions'];

function fmtDate(ds) {
  if (!ds) return '—';
  return new Date(ds).toLocaleDateString('en', { month: 'short', day: 'numeric' });
}

/* ── AI response engine (reads real Supabase data) ─────────────── */
async function getResponse(msg) {
  const q = msg.toLowerCase();
  const api = window.API;

  /* ── Summarize week ── */
  if (q.includes('summarize') || q.includes('this week') || q.includes('summary') || q.includes('overview') || q.includes('snapshot')) {
    if (!api) return { text: 'No API connection — running in demo mode.' };
    const [tr, pr, cr, ir] = await Promise.all([api.getTasks(), api.getProjects(), api.getClients(), api.getInvoices()]);
    const tasks = tr.data || [], projects = pr.data || [], clients = cr.data || [], invoices = ir.data || [];
    const open = tasks.filter(t => t.status !== 'done').length;
    const done = tasks.filter(t => t.status === 'done').length;
    const active = projects.filter(p => p.status === 'active').length;
    const paid = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + Number(i.amount || 0), 0);
    const weekEnd = new Date(Date.now() + 7 * 86400000);
    const dueSoon = tasks.filter(t => t.due_date && t.status !== 'done' && new Date(t.due_date) <= weekEnd);
    const cards = dueSoon.slice(0, 3).map(t => ({
      icon: new Date(t.due_date) < new Date() ? 'clock' : 'alert-triangle',
      tone: new Date(t.due_date) < new Date() ? 'danger' : 'warning',
      title: t.title || t.name || 'Task',
      body: `${t.status} · due ${fmtDate(t.due_date)}${t.projects?.name ? ' · ' + t.projects.name : ''}`,
    }));
    return {
      text: `Workspace snapshot: ${open} open tasks, ${done} done across ${active} active projects. ${clients.filter(c => c.status === 'active').length} active clients. Paid revenue: $${paid.toLocaleString()}.${dueSoon.length > 0 ? ` ${dueSoon.length} task${dueSoon.length > 1 ? 's' : ''} due this week:` : ' No tasks due this week — great work!'}`,
      cards: dueSoon.length > 0 ? cards : undefined,
    };
  }

  /* ── Deadline risks / overdue ── */
  if (q.includes('risk') || q.includes('overdue') || q.includes('deadline') || q.includes('urgent') || q.includes('late') || q.includes('at risk')) {
    if (!api) return { text: 'No API connection.' };
    const r = await api.getTasks();
    const tasks = r.data || [];
    const now = new Date(), soon = new Date(Date.now() + 48 * 3600000);
    const overdue = tasks.filter(t => t.due_date && t.status !== 'done' && new Date(t.due_date) < now);
    const dueSoon = tasks.filter(t => t.due_date && t.status !== 'done' && new Date(t.due_date) >= now && new Date(t.due_date) <= soon);
    if (overdue.length === 0 && dueSoon.length === 0) return { text: 'All clear — no overdue tasks and nothing due in the next 48 hours. ' };
    const cards = [
      ...overdue.slice(0, 3).map(t => ({ icon: 'clock', tone: 'danger', title: t.title || t.name || 'Task', body: `Overdue since ${fmtDate(t.due_date)}${t.projects?.name ? ' · ' + t.projects.name : ''}` })),
      ...dueSoon.slice(0, 2).map(t => ({ icon: 'alert-triangle', tone: 'warning', title: t.title || t.name || 'Task', body: `Due ${fmtDate(t.due_date)} · ${t.status}${t.projects?.name ? ' · ' + t.projects.name : ''}` })),
    ];
    return { text: `Found ${overdue.length} overdue and ${dueSoon.length} due within 48 hours:`, cards };
  }

  /* ── Revenue / finance ── */
  if (q.includes('revenue') || q.includes('money') || q.includes('invoice') || q.includes('paid') || q.includes('finance') || q.includes('outstanding')) {
    if (!api) return { text: 'No API connection.' };
    const r = await api.getInvoices();
    const invoices = r.data || [];
    const paid = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + Number(i.amount || 0), 0);
    const outstanding = invoices.filter(i => ['sent', 'overdue'].includes(i.status)).reduce((s, i) => s + Number(i.amount || 0), 0);
    const overdue = invoices.filter(i => i.status === 'overdue');
    return { text: `Finance: $${paid.toLocaleString()} collected from ${invoices.filter(i => i.status === 'paid').length} paid invoices. $${outstanding.toLocaleString()} outstanding.${overdue.length > 0 ? ` ⚠️ ${overdue.length} overdue invoice${overdue.length > 1 ? 's' : ''}.` : ' No overdue invoices.'}` };
  }

  /* ── Clients ── */
  if (q.includes('client') || q.includes('customer')) {
    if (!api) return { text: 'No API connection.' };
    const r = await api.getClients();
    const clients = r.data || [];
    const active = clients.filter(c => c.status === 'active').length;
    return { text: `${clients.length} clients total — ${active} active${clients.length > active ? ', ' + (clients.length - active) + ' inactive' : ''}. Check Client CRM for details.` };
  }

  /* ── Tasks ── */
  if (q.includes('task') || q.includes('todo') || q.includes('open task')) {
    if (!api) return { text: 'No API connection.' };
    const r = await api.getTasks();
    const tasks = r.data || [];
    const todo = tasks.filter(t => t.status === 'todo').length;
    const inp = tasks.filter(t => t.status === 'in_progress').length;
    const rev = tasks.filter(t => t.status === 'review').length;
    const done = tasks.filter(t => t.status === 'done').length;
    return { text: `Task breakdown: ${todo} to-do, ${inp} in progress, ${rev} in review, ${done} done. Total: ${tasks.length}.` };
  }

  /* ── Team ── */
  if (q.includes('team') || q.includes('member') || q.includes('staff') || q.includes('who is')) {
    if (!api) return { text: 'No API connection.' };
    const r = await api.getTeam();
    const team = r.data || [];
    return { text: `Team has ${team.length} member${team.length !== 1 ? 's' : ''}: ${team.map(m => m.name).join(', ')}.` };
  }

  /* ── Projects ── */
  if (q.includes('project')) {
    if (!api) return { text: 'No API connection.' };
    const r = await api.getProjects();
    const projects = r.data || [];
    const active = projects.filter(p => p.status === 'active').length;
    return { text: `${projects.length} projects total — ${active} active. Check the Projects screen for task breakdowns.` };
  }

  /* ── Campaigns / ads ── */
  if (q.includes('campaign') || q.includes('ads') || q.includes('meta') || q.includes('spend') || q.includes('cpl') || q.includes('leads')) {
    if (!api) return { text: 'No API connection.' };
    const r = await api.getAdCampaigns();
    const camps = r.data || [];
    const active = camps.filter(c => c.status === 'active').length;
    const spend = camps.reduce((s, c) => s + (c.spent || 0), 0);
    const leads = camps.reduce((s, c) => s + (c.conversions || 0), 0);
    return { text: `${camps.length} ad campaign${camps.length !== 1 ? 's' : ''} — ${active} active. Total spend: $${spend.toLocaleString()}. Total leads: ${leads}${leads > 0 ? '. Avg CPL: $' + (spend / leads).toFixed(2) : ''}.` };
  }

  /* ── Draft captions ── */
  if (q.includes('caption') || q.includes('social media') || q.includes('draft') || q.includes('post idea')) {
    return {
      text: 'Here are 3 ready-to-use social media captions:',
      cards: [
        { icon: 'instagram', tone: 'warning', title: 'Instagram', body: '✨ Behind the scenes of our latest campaign. Results speak louder than promises. DM us to start yours. #AgencyLife #MarketingResults' },
        { icon: 'linkedin', tone: 'info', title: 'LinkedIn', body: 'We helped a client increase leads by 47% in 90 days. The strategy? Clear messaging + consistent CTAs. Happy to share the playbook.' },
        { icon: 'twitter', tone: 'neutral', title: 'Twitter / X', body: 'Hot take: agencies spending 80% on acquisition, 20% on retention are leaving money on the table. Flip it. 🔁' },
      ],
    };
  }

  /* ── Generate proposal ── */
  if (q.includes('proposal') || q.includes('quote') || q.includes('pitch')) {
    return { text: 'Proposal template:\n\n📄 DIGITAL MARKETING PROPOSAL\n\nScope: Social media management + content creation\n\nDeliverables:\n• Content calendar\n• 12 posts/month (IG + LinkedIn)\n• Monthly analytics report\n• Ad campaign management (up to $2K/month)\n\nInvestment: $1,500/month\nTerm: 3-month minimum\nOnboarding: First week free\n\nCustomize client name, scope, and pricing in the Finance screen.' };
  }

  /* ── Hello ── */
  if (q.match(/^(hi|hello|hey|help|what can you do)/)) {
    return { text: 'Hi! I\'m connected to your live workspace data. Ask me:\n• "Summarize this week"\n• "What\'s at risk?"\n• "How\'s our revenue?"\n• "How many clients do we have?"\n• "Draft 6 captions"\n• "Generate proposal"' };
  }

  /* ── Default ── */
  return { text: 'I can help with workspace data. Try: "Summarize this week", "Detect deadline risks", "How\'s our revenue?", "How many clients?", or tap a suggestion below.' };
}

/* ── UI ─────────────────────────────────────────────────────────── */
function AIPanel({ open, onClose }) {
  const [messages, setMessages] = React.useState([]);
  const [input,    setInput]    = React.useState('');
  const [loading,  setLoading]  = React.useState(false);
  const bottomRef = React.useRef(null);

  React.useEffect(() => {
    if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function send(text) {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: msg }]);
    setLoading(true);
    try {
      const res = await getResponse(msg);
      setMessages(prev => [...prev, { role: 'ai', ...res }]);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: 'Something went wrong. Please try again.' }]);
    } finally { setLoading(false); }
  }

  function onKey(e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }

  const toneColors = {
    warning: ['var(--amber-50)', 'var(--amber-600)'],
    danger:  ['var(--red-50)',   'var(--red-600)'],
    success: ['var(--green-50)', 'var(--green-600)'],
    info:    ['var(--blue-50)',  'var(--blue-600)'],
    neutral: ['var(--slate-100)','var(--slate-600)'],
  };

  return (
    <>
      <style>{`@keyframes tfDot{0%,80%,100%{opacity:.25;transform:scale(.8)}40%{opacity:1;transform:scale(1)}}`}</style>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(16,24,40,0.28)', backdropFilter: 'blur(2px)', opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none', transition: 'opacity 0.2s', zIndex: 40 }} />
      <aside style={{ position: 'fixed', top: 0, right: 0, height: '100%', width: 384, maxWidth: '92vw', zIndex: 50, background: 'var(--glass-bg-strong)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', borderLeft: '1px solid var(--glass-border)', boxShadow: 'var(--shadow-2xl)', display: 'flex', flexDirection: 'column', transform: open ? 'translateX(0)' : 'translateX(100%)', transition: 'transform 0.3s cubic-bezier(.32,.72,0,1)' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '16px 18px', borderBottom: '1px solid var(--border-subtle)' }}>
          <span style={{ width: 34, height: 34, borderRadius: 'var(--radius-lg)', background: 'var(--grad-brand)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-brand)' }}>
            <Icon name="sparkles" size={18} style={{ color: '#fff' }} />
          </span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 'var(--text-md)', fontWeight: 'var(--fw-bold)', color: 'var(--text-strong)' }}>AI Assistant</div>
            <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green-500)' }} /> Online · sees your workspace
            </div>
          </div>
          {messages.length > 0 && (
            <button onClick={() => setMessages([])} title="Clear chat" style={{ width: 28, height: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', color: 'var(--text-muted)' }}>
              <Icon name="trash-2" size={15} />
            </button>
          )}
          <button onClick={onClose} style={{ width: 30, height: 30, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <Icon name="x" size={18} />
          </button>
        </div>

        {/* Messages */}
        <div className="tf-scroll" style={{ flex: 1, overflowY: 'auto', padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {messages.length === 0 && (
            <div style={{ textAlign: 'center', padding: '32px 16px' }}>
              <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-xl)', background: 'var(--blue-50)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                <Icon name="sparkles" size={22} style={{ color: 'var(--blue-600)' }} />
              </div>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)', marginBottom: 6 }}>How can I help?</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', lineHeight: 1.6 }}>Ask about tasks, revenue, clients, deadlines — or tap a suggestion below.</div>
            </div>
          )}

          {messages.map((m, i) => m.role === 'user' ? (
            <div key={i} style={{ alignSelf: 'flex-end', maxWidth: '85%', background: 'var(--blue-600)', color: '#fff', padding: '9px 13px', borderRadius: '14px 14px 4px 14px', fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-medium)', boxShadow: 'var(--shadow-brand)' }}>
              {m.text}
            </div>
          ) : (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 9, maxWidth: '92%' }}>
              <div style={{ background: 'var(--slate-0)', border: '1px solid var(--border-subtle)', padding: '10px 13px', borderRadius: '14px 14px 14px 4px', fontSize: 'var(--text-sm)', color: 'var(--text-body)', lineHeight: 1.6, boxShadow: 'var(--shadow-xs)', whiteSpace: 'pre-wrap' }}>
                {m.text}
              </div>
              {m.cards && m.cards.map((c, j) => {
                const [bg, fg] = toneColors[c.tone] || toneColors.neutral;
                return (
                  <div key={j} style={{ display: 'flex', gap: 10, background: 'var(--slate-0)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: 11, boxShadow: 'var(--shadow-xs)' }}>
                    <span style={{ width: 28, height: 28, flex: 'none', borderRadius: 'var(--radius-md)', background: bg, color: fg, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon name={c.icon} size={15} />
                    </span>
                    <div>
                      <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)' }}>{c.title}</div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 1, lineHeight: 1.4 }}>{c.body}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', gap: 9, maxWidth: '92%' }}>
              <div style={{ background: 'var(--slate-0)', border: '1px solid var(--border-subtle)', padding: '13px 16px', borderRadius: '14px 14px 14px 4px', boxShadow: 'var(--shadow-xs)', display: 'flex', gap: 5, alignItems: 'center' }}>
                {[0,1,2].map(k => <span key={k} style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--blue-400)', display: 'inline-block', animation: `tfDot 1.2s ease-in-out ${k * 0.2}s infinite` }} />)}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div style={{ padding: 14, borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
            {SUGGESTIONS.map(s => (
              <span key={s} onClick={() => send(s)} style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-semibold)', color: 'var(--blue-700)', background: 'var(--blue-50)', borderRadius: 'var(--radius-full)', padding: '4px 10px', cursor: 'pointer', userSelect: 'none' }}>
                {s}
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, background: 'var(--slate-0)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', padding: '7px 8px 7px 13px', boxShadow: 'var(--shadow-inset)' }}>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKey}
              placeholder="Ask anything about your agency…"
              rows={1}
              style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', color: 'var(--text-body)', resize: 'none', lineHeight: 1.5, maxHeight: 90, overflowY: 'auto' }}
            />
            <button onClick={() => send()} disabled={!input.trim() || loading} style={{ width: 32, height: 32, flex: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: input.trim() && !loading ? 'var(--blue-600)' : 'var(--slate-200)', color: input.trim() && !loading ? '#fff' : 'var(--text-muted)', border: 'none', borderRadius: 'var(--radius-md)', cursor: input.trim() && !loading ? 'pointer' : 'default', transition: 'background 0.15s' }}>
              <Icon name="arrow-up" size={17} />
            </button>
          </div>
          <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-subtle)', marginTop: 6, textAlign: 'center' }}>Enter to send · Shift+Enter for new line</div>
        </div>
      </aside>
    </>
  );
}

Object.assign(window, { AIPanel });
})();
