// AI Assistant — glass slide-over panel, available across all screens.
(() => {
const { Avatar, Badge } = window.TechyFuelOSDesignSystem_be0222;

const TF_AI_SUGGEST = ['Summarize this week', 'Draft 6 captions', 'Detect deadline risks', 'Generate proposal'];
const TF_AI_THREAD = [
  { role: 'user', text: "What's at risk this week?" },
  { role: 'ai', text: "I scanned 24 open tasks across 3 projects. Two need attention:", cards: [
    { icon: 'alert-triangle', tone: 'warning', title: 'Nova — launch campaign', body: 'Due today, 82% complete. 1 task still in review.' },
    { icon: 'clock', tone: 'danger', title: 'Meta ad creatives v3', body: 'Urgent · due today · assigned to Sara, no update in 2 days.' },
  ]},
  { role: 'ai', text: 'Want me to nudge the owners and draft a status note for the clients?' },
];

function AIPanel({ open, onClose }) {
  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(16,24,40,0.28)', backdropFilter: 'blur(2px)', opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none', transition: 'opacity var(--dur-base) var(--ease-out)', zIndex: 40 }} />
      <aside style={{
        position: 'fixed', top: 0, right: 0, height: '100%', width: 384, maxWidth: '92vw', zIndex: 50,
        background: 'var(--glass-bg-strong)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
        borderLeft: '1px solid var(--glass-border)', boxShadow: 'var(--shadow-2xl)',
        display: 'flex', flexDirection: 'column',
        transform: open ? 'translateX(0)' : 'translateX(100%)', transition: 'transform var(--dur-slow) var(--ease-out)',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '16px 18px', borderBottom: '1px solid var(--border-subtle)' }}>
          <span style={{ width: 34, height: 34, borderRadius: 'var(--radius-lg)', background: 'var(--grad-brand)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-brand)' }}><Icon name="sparkles" size={18} style={{ color: '#fff' }} /></span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 'var(--text-md)', fontWeight: 'var(--fw-bold)', color: 'var(--text-strong)' }}>AI Assistant</div>
            <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 5 }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green-500)' }} /> Online · sees your workspace</div>
          </div>
          <button onClick={onClose} style={{ width: 30, height: 30, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', color: 'var(--text-muted)' }}><Icon name="x" size={18} /></button>
        </div>
        {/* Thread */}
        <div className="tf-scroll" style={{ flex: 1, overflowY: 'auto', padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {TF_AI_THREAD.map((m, i) => m.role === 'user' ? (
            <div key={i} style={{ alignSelf: 'flex-end', maxWidth: '85%', background: 'var(--blue-600)', color: '#fff', padding: '9px 13px', borderRadius: '14px 14px 4px 14px', fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-medium)', boxShadow: 'var(--shadow-brand)' }}>{m.text}</div>
          ) : (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 9, maxWidth: '92%' }}>
              <div style={{ background: 'var(--slate-0)', border: '1px solid var(--border-subtle)', padding: '10px 13px', borderRadius: '14px 14px 14px 4px', fontSize: 'var(--text-sm)', color: 'var(--text-body)', lineHeight: 1.5, boxShadow: 'var(--shadow-xs)' }}>{m.text}</div>
              {m.cards && m.cards.map((c, j) => {
                const tones = { warning: ['var(--amber-50)', 'var(--amber-600)'], danger: ['var(--red-50)', 'var(--red-600)'] };
                const [bg, fg] = tones[c.tone];
                return (
                  <div key={j} style={{ display: 'flex', gap: 10, background: 'var(--slate-0)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: 11, boxShadow: 'var(--shadow-xs)' }}>
                    <span style={{ width: 28, height: 28, flex: 'none', borderRadius: 'var(--radius-md)', background: bg, color: fg, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={c.icon} size={15} /></span>
                    <div><div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)' }}>{c.title}</div><div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 1, lineHeight: 1.4 }}>{c.body}</div></div>
                  </div>
                );
              })}
            </div>
          ))}
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, height: 34, background: 'var(--blue-600)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-semibold)', cursor: 'pointer', boxShadow: 'var(--shadow-brand)' }}><Icon name="check" size={14} /> Nudge owners</button>
            <button style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, height: 34, background: 'var(--slate-0)', color: 'var(--text-body)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-semibold)', cursor: 'pointer' }}><Icon name="file-text" size={14} /> Draft note</button>
          </div>
        </div>
        {/* Suggestions + input */}
        <div style={{ padding: 14, borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
            {TF_AI_SUGGEST.map(s => <span key={s} style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-semibold)', color: 'var(--blue-700)', background: 'var(--blue-50)', borderRadius: 'var(--radius-full)', padding: '4px 10px', cursor: 'pointer' }}>{s}</span>)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--slate-0)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', padding: '7px 8px 7px 13px', boxShadow: 'var(--shadow-inset)' }}>
            <span style={{ flex: 1, fontSize: 'var(--text-sm)', color: 'var(--text-subtle)' }}>Ask anything about your agency…</span>
            <button style={{ width: 32, height: 32, flex: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'var(--blue-600)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}><Icon name="arrow-up" size={17} /></button>
          </div>
        </div>
      </aside>
    </>
  );
}

Object.assign(window, { AIPanel });
})();
