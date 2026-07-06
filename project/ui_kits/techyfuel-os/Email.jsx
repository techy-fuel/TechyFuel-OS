// Email screen — reads/sends through the agency's own mailbox via IMAP/SMTP
// (api/email-list.js, api/email-message.js, api/email-send.js). No OAuth --
// this is for a plain cPanel/Hostinger-style mailbox, so credentials live
// only as Vercel env vars on the server; the browser never touches them.
(() => {
const { Badge } = window.TechyFuelOSDesignSystem_be0222;

function fmtWhen(ds) {
  if (!ds) return '';
  const d = new Date(ds);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  return sameDay ? d.toLocaleTimeString('en', { hour: 'numeric', minute: '2-digit' }) : d.toLocaleDateString('en', { month: 'short', day: 'numeric' });
}

function MessageRow({ msg, active, onClick }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 14px', cursor: 'pointer',
        borderLeft: `3px solid ${active ? 'var(--blue-600)' : 'transparent'}`,
        background: active ? 'var(--blue-50)' : hover ? 'var(--slate-50)' : 'transparent',
        borderBottom: '1px solid var(--border-subtle)' }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', marginTop: 6, flexShrink: 0, background: msg.seen ? 'transparent' : 'var(--blue-500)' }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
          <span style={{ fontSize: 'var(--text-sm)', fontWeight: msg.seen ? 'var(--fw-medium)' : 'var(--fw-bold)', color: 'var(--text-strong)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {msg.from?.name || msg.from?.address || 'Unknown sender'}
          </span>
          <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-subtle)', flexShrink: 0 }}>{fmtWhen(msg.date)}</span>
        </div>
        <div style={{ fontSize: 'var(--text-sm)', color: msg.seen ? 'var(--text-muted)' : 'var(--text-body)', fontWeight: msg.seen ? 'var(--fw-medium)' : 'var(--fw-semibold)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 2 }}>
          {msg.subject}
        </div>
      </div>
    </div>
  );
}

function ComposeModal({ open, onClose, onSent }) {
  const [form, setForm] = React.useState({ to: '', subject: '', body: '' });
  const [sending, setSending] = React.useState(false);
  const [error, setError] = React.useState('');
  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  async function handleSend() {
    if (!form.to.trim() || !form.subject.trim() || !form.body.trim()) { setError('To, subject and message are all required.'); return; }
    setSending(true);
    setError('');
    try {
      const res = await fetch('/api/email-send', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!data.ok) { setError(data.error || 'Could not send the email.'); return; }
      setForm({ to: '', subject: '', body: '' });
      onClose();
      if (onSent) onSent();
    } catch (err) {
      setError(err.message || 'Could not send the email.');
    } finally { setSending(false); }
  }

  return (
    <Modal open={open} onClose={onClose} title="Compose email" onSubmit={handleSend} loading={sending} submitLabel="Send">
      {error && (
        <div style={{ marginBottom: 14, padding: '8px 12px', borderRadius: 'var(--radius-md)', background: '#fff1f2', border: '1px solid #fecdd3', color: '#be123c', fontSize: 'var(--text-sm)' }}>
          {error}
        </div>
      )}
      <FormRow label="To" required>
        <input style={FF.input} type="email" placeholder="client@example.com" value={form.to} onChange={e => set('to', e.target.value)} autoFocus />
      </FormRow>
      <FormRow label="Subject" required>
        <input style={FF.input} placeholder="Subject…" value={form.subject} onChange={e => set('subject', e.target.value)} />
      </FormRow>
      <FormRow label="Message" required>
        <textarea style={{ ...FF.input, height: 180, padding: '10px', resize: 'vertical', fontFamily: 'var(--font-sans)' }} placeholder="Write your message…" value={form.body} onChange={e => set('body', e.target.value)} />
      </FormRow>
    </Modal>
  );
}

function Email() {
  useLucide();
  const [messages, setMessages] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [selectedUid, setSelectedUid] = React.useState(null);
  const [selectedMsg, setSelectedMsg] = React.useState(null);
  const [msgLoading, setMsgLoading] = React.useState(false);
  const [composeOpen, setComposeOpen] = React.useState(false);

  async function loadList() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/email-list');
      const data = await res.json();
      if (!data.ok) { setError(data.error || 'Could not load your inbox.'); setMessages([]); return; }
      setMessages(data.messages || []);
    } catch (err) {
      setError(err.message || 'Could not load your inbox.');
    } finally { setLoading(false); }
  }

  React.useEffect(() => { loadList(); }, []);

  async function openMessage(uid) {
    setSelectedUid(uid);
    setSelectedMsg(null);
    setMsgLoading(true);
    try {
      const res = await fetch(`/api/email-message?uid=${uid}`);
      const data = await res.json();
      if (data.ok) {
        setSelectedMsg(data.message);
        setMessages(prev => prev.map(m => m.uid === uid ? { ...m, seen: true } : m));
      }
    } catch {} finally { setMsgLoading(false); }
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px 16px', flexShrink: 0 }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--fw-extrabold)', letterSpacing: '-0.02em' }}>Email</h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 2 }}>{messages.length} messages in inbox</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={loadList} disabled={loading} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, height: 36, padding: '0 14px', background: 'var(--slate-0)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-body)', cursor: loading ? 'wait' : 'pointer' }}>
            <Icon name="refresh-cw" size={15} /> Refresh
          </button>
          <button onClick={() => setComposeOpen(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, height: 36, padding: '0 14px', background: 'var(--blue-600)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-brand)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', cursor: 'pointer' }}>
            <Icon name="pencil" size={15} /> Compose
          </button>
        </div>
      </div>

      {error && (
        <div style={{ margin: '0 24px 16px', padding: '12px 16px', borderRadius: 'var(--radius-md)', background: '#fff1f2', border: '1px solid #fecdd3', color: '#be123c', fontSize: 'var(--text-sm)' }}>
          {error}
        </div>
      )}

      <div style={{ flex: 1, minHeight: 0, display: 'flex', margin: '0 24px 24px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', background: 'var(--slate-0)', overflow: 'hidden' }}>
        <div style={{ width: 340, flexShrink: 0, borderRight: '1px solid var(--border-subtle)', overflowY: 'auto' }}>
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>Loading…</div>
          ) : messages.length === 0 && !error ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
              <Icon name="inbox" size={28} style={{ color: 'var(--slate-300)', display: 'block', margin: '0 auto 10px' }} />
              No messages yet.
            </div>
          ) : (
            messages.map(m => <MessageRow key={m.uid} msg={m} active={m.uid === selectedUid} onClick={() => openMessage(m.uid)} />)
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0, overflowY: 'auto', padding: selectedUid ? '24px 28px' : 0 }}>
          {!selectedUid ? (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              <Icon name="mail" size={32} style={{ color: 'var(--slate-300)', marginBottom: 10 }} />
              <div style={{ fontSize: 'var(--text-sm)' }}>Select a message to read it</div>
            </div>
          ) : msgLoading ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>Loading…</div>
          ) : selectedMsg ? (
            <>
              <div style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--fw-bold)', color: 'var(--text-strong)', marginBottom: 10 }}>{selectedMsg.subject}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingBottom: 16, borderBottom: '1px solid var(--border-subtle)', marginBottom: 16 }}>
                <Badge tone="neutral" size="sm">{selectedMsg.from?.name || selectedMsg.from?.address}</Badge>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-subtle)' }}>{selectedMsg.date ? new Date(selectedMsg.date).toLocaleString() : ''}</span>
              </div>
              {selectedMsg.html ? (
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-body)', lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: selectedMsg.html }} />
              ) : (
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-body)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{selectedMsg.text}</div>
              )}
            </>
          ) : (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>Could not load this message.</div>
          )}
        </div>
      </div>

      <ComposeModal open={composeOpen} onClose={() => setComposeOpen(false)} onSent={loadList} />
    </div>
  );
}

Object.assign(window, { Email });
})();
