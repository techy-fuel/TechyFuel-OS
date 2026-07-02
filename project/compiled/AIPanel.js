// AI Assistant — real chat connected to Supabase workspace data.
(() => {
  const SUGGESTIONS = ['Summarize this week', 'Detect deadline risks', 'How\'s our revenue?', 'Draft 6 captions'];

  // Home/reporting currency is PKR — same conversion the Finance screen uses,
  // so the AI reasons in one consistent currency no matter what a client paid in.
  function toPKR(amount, currency, rates) {
    const n = Number(amount);
    if (!n) return 0;
    if (!currency || currency === 'PKR') return n;
    if (!rates) return null;
    const usd = currency === 'USD' ? n : rates[currency] ? n / rates[currency] : null;
    if (usd === null) return null;
    return rates.PKR ? usd * rates.PKR : null;
  }

  /* ── Build a compact, real snapshot of what this signed-in user can see ──
     Every window.API call below is the same RLS-scoped Supabase client the
     rest of the app uses, so a "member" role only ever hands the AI the same
     data they're allowed to see themselves — the AI can't see more than the
     user already can. */
  async function buildWorkspaceSnapshot() {
    const api = window.API;
    if (!api) return null;
    // Supabase's query builder is a "thenable", not a real Promise — it has
    // .then() but not .catch(), so wrap each call in Promise.resolve() first.
    const safe = call => Promise.resolve(call()).catch(() => ({
      data: []
    }));
    const [tr, pr, cr, ir, er, teamR, adR, fx] = await Promise.all([safe(() => api.getTasks()), safe(() => api.getProjects()), safe(() => api.getClients()), safe(() => api.getInvoices()), api.getExpenses ? safe(() => api.getExpenses()) : Promise.resolve({
      data: []
    }), safe(() => api.getTeam()), api.getAdCampaigns ? safe(() => api.getAdCampaigns()) : Promise.resolve({
      data: []
    }), api.getFxRates ? api.getFxRates().catch(() => null) : Promise.resolve(null)]);
    const rates = fx && fx.rates;
    const tasks = tr.data || [],
      projects = pr.data || [],
      clients = cr.data || [],
      invoices = ir.data || [],
      expenses = er.data || [],
      team = teamR.data || [],
      campaigns = adR.data || [];
    return {
      today: new Date().toISOString().slice(0, 10),
      home_currency: 'PKR',
      tasks: tasks.slice(0, 80).map(t => ({
        title: t.title,
        status: t.status,
        priority: t.priority,
        due_date: t.due_date,
        assigned_to: t.team_members ? t.team_members.name : null,
        project: t.projects ? t.projects.name : null
      })),
      projects: projects.slice(0, 60).map(p => ({
        name: p.name,
        status: p.status
      })),
      clients: clients.slice(0, 60).map(c => ({
        name: c.company || c.name,
        status: c.status
      })),
      invoices: invoices.slice(0, 80).map(i => ({
        invoice_no: i.invoice_no,
        client: i.clients ? i.clients.name : null,
        status: i.status,
        due_date: i.due_date,
        amount: i.amount,
        currency: i.currency || 'PKR',
        amount_pkr: toPKR(i.amount, i.currency, rates)
      })),
      expenses: expenses.slice(0, 80).map(e => ({
        description: e.description,
        category: e.category,
        date: e.date,
        amount: e.amount,
        currency: e.currency || 'PKR',
        amount_pkr: toPKR(e.amount, e.currency, rates)
      })),
      team: team.map(m => ({
        name: m.name,
        role: m.role
      })),
      ad_campaigns: campaigns.slice(0, 40).map(c => ({
        name: c.name,
        client: c.clients ? c.clients.name : null,
        platform: c.platform,
        status: c.status,
        spent: c.spent,
        impressions: c.impressions,
        clicks: c.clicks,
        conversions: c.conversions
      }))
    };
  }

  /* ── AI response — calls the real LLM backend (Vercel AI Gateway) ────── */
  async function getResponse(msg) {
    if (!window.API) return {
      text: 'No API connection — running in demo mode.'
    };
    const context = await buildWorkspaceSnapshot();
    const res = await fetch('/api/ai-chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: msg,
        context
      })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'AI request failed');
    }
    const data = await res.json();
    return {
      text: data.reply || 'Sorry, I got an empty response. Please try again.'
    };
  }

  /* ── UI ─────────────────────────────────────────────────────────── */
  function AIPanel({
    open,
    onClose
  }) {
    useLucide();
    const [messages, setMessages] = React.useState([]);
    const [input, setInput] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const bottomRef = React.useRef(null);
    React.useEffect(() => {
      if (bottomRef.current) bottomRef.current.scrollIntoView({
        behavior: 'smooth'
      });
    }, [messages, loading]);
    async function send(text) {
      const msg = (text || input).trim();
      if (!msg || loading) return;
      setInput('');
      setMessages(prev => [...prev, {
        role: 'user',
        text: msg
      }]);
      setLoading(true);
      try {
        const res = await getResponse(msg);
        setMessages(prev => [...prev, {
          role: 'ai',
          ...res
        }]);
      } catch {
        setMessages(prev => [...prev, {
          role: 'ai',
          text: 'Something went wrong. Please try again.'
        }]);
      } finally {
        setLoading(false);
      }
    }
    function onKey(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        send();
      }
    }
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("style", null, `@keyframes tfDot{0%,80%,100%{opacity:.25;transform:scale(.8)}40%{opacity:1;transform:scale(1)}}`), /*#__PURE__*/React.createElement("div", {
      onClick: onClose,
      style: {
        position: 'fixed',
        inset: 0,
        background: 'rgba(16,24,40,0.28)',
        backdropFilter: 'blur(2px)',
        opacity: open ? 1 : 0,
        pointerEvents: open ? 'auto' : 'none',
        transition: 'opacity 0.2s',
        zIndex: 40
      }
    }), /*#__PURE__*/React.createElement("aside", {
      style: {
        position: 'fixed',
        top: 0,
        right: 0,
        height: '100%',
        width: 384,
        maxWidth: '92vw',
        zIndex: 50,
        background: 'var(--glass-bg-strong)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderLeft: '1px solid var(--glass-border)',
        boxShadow: 'var(--shadow-2xl)',
        display: 'flex',
        flexDirection: 'column',
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s cubic-bezier(.32,.72,0,1)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 11,
        padding: '16px 18px',
        borderBottom: '1px solid var(--border-subtle)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 34,
        height: 34,
        borderRadius: 'var(--radius-lg)',
        background: 'var(--grad-brand)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 'var(--shadow-brand)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "sparkles",
      size: 18,
      style: {
        color: '#fff'
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-md)',
        fontWeight: 'var(--fw-bold)',
        color: 'var(--text-strong)'
      }
    }, "AI Assistant"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-2xs)',
        color: 'var(--text-muted)',
        display: 'flex',
        alignItems: 'center',
        gap: 5
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 6,
        height: 6,
        borderRadius: '50%',
        background: 'var(--green-500)'
      }
    }), " Online · sees your workspace")), messages.length > 0 && /*#__PURE__*/React.createElement("button", {
      onClick: () => setMessages([]),
      title: "Clear chat",
      style: {
        width: 28,
        height: 28,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
        border: 'none',
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
        color: 'var(--text-muted)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "trash-2",
      size: 15
    })), /*#__PURE__*/React.createElement("button", {
      onClick: onClose,
      style: {
        width: 30,
        height: 30,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
        border: 'none',
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
        color: 'var(--text-muted)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "x",
      size: 18
    }))), /*#__PURE__*/React.createElement("div", {
      className: "tf-scroll",
      style: {
        flex: 1,
        overflowY: 'auto',
        padding: 18,
        display: 'flex',
        flexDirection: 'column',
        gap: 14
      }
    }, messages.length === 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'center',
        padding: '32px 16px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 48,
        height: 48,
        borderRadius: 'var(--radius-xl)',
        background: 'var(--blue-50)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "sparkles",
      size: 22,
      style: {
        color: 'var(--blue-600)'
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-semibold)',
        color: 'var(--text-strong)',
        marginBottom: 6
      }
    }, "How can I help?"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-xs)',
        color: 'var(--text-muted)',
        lineHeight: 1.6
      }
    }, "Ask about tasks, revenue, clients, deadlines — or tap a suggestion below.")), messages.map((m, i) => m.role === 'user' ? /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        alignSelf: 'flex-end',
        maxWidth: '85%',
        background: 'var(--blue-600)',
        color: '#fff',
        padding: '9px 13px',
        borderRadius: '14px 14px 4px 14px',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-medium)',
        boxShadow: 'var(--shadow-brand)'
      }
    }, m.text) : /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 9,
        maxWidth: '92%'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        background: 'var(--slate-0)',
        border: '1px solid var(--border-subtle)',
        padding: '10px 13px',
        borderRadius: '14px 14px 14px 4px',
        fontSize: 'var(--text-sm)',
        color: 'var(--text-body)',
        lineHeight: 1.6,
        boxShadow: 'var(--shadow-xs)',
        whiteSpace: 'pre-wrap'
      }
    }, m.text))), loading && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 9,
        maxWidth: '92%'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        background: 'var(--slate-0)',
        border: '1px solid var(--border-subtle)',
        padding: '13px 16px',
        borderRadius: '14px 14px 14px 4px',
        boxShadow: 'var(--shadow-xs)',
        display: 'flex',
        gap: 5,
        alignItems: 'center'
      }
    }, [0, 1, 2].map(k => /*#__PURE__*/React.createElement("span", {
      key: k,
      style: {
        width: 7,
        height: 7,
        borderRadius: '50%',
        background: 'var(--blue-400)',
        display: 'inline-block',
        animation: `tfDot 1.2s ease-in-out ${k * 0.2}s infinite`
      }
    })))), /*#__PURE__*/React.createElement("div", {
      ref: bottomRef
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 14,
        borderTop: '1px solid var(--border-subtle)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 6,
        flexWrap: 'wrap',
        marginBottom: 10
      }
    }, SUGGESTIONS.map(s => /*#__PURE__*/React.createElement("span", {
      key: s,
      onClick: () => send(s),
      style: {
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--fw-semibold)',
        color: 'var(--blue-700)',
        background: 'var(--blue-50)',
        borderRadius: 'var(--radius-full)',
        padding: '4px 10px',
        cursor: 'pointer',
        userSelect: 'none'
      }
    }, s))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-end',
        gap: 8,
        background: 'var(--slate-0)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-lg)',
        padding: '7px 8px 7px 13px',
        boxShadow: 'var(--shadow-inset)'
      }
    }, /*#__PURE__*/React.createElement("textarea", {
      value: input,
      onChange: e => setInput(e.target.value),
      onKeyDown: onKey,
      placeholder: "Ask anything about your agency…",
      rows: 1,
      style: {
        flex: 1,
        border: 'none',
        outline: 'none',
        background: 'transparent',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-sm)',
        color: 'var(--text-body)',
        resize: 'none',
        lineHeight: 1.5,
        maxHeight: 90,
        overflowY: 'auto'
      }
    }), /*#__PURE__*/React.createElement("button", {
      onClick: () => send(),
      disabled: !input.trim() || loading,
      style: {
        width: 32,
        height: 32,
        flex: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: input.trim() && !loading ? 'var(--blue-600)' : 'var(--slate-200)',
        color: input.trim() && !loading ? '#fff' : 'var(--text-muted)',
        border: 'none',
        borderRadius: 'var(--radius-md)',
        cursor: input.trim() && !loading ? 'pointer' : 'default',
        transition: 'background 0.15s'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-up",
      size: 17
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-2xs)',
        color: 'var(--text-subtle)',
        marginTop: 6,
        textAlign: 'center'
      }
    }, "Enter to send · Shift+Enter for new line"))));
  }
  Object.assign(window, {
    AIPanel
  });
})();