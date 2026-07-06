// Email screen — reads/sends through the agency's own mailbox via IMAP/SMTP
// (api/email-list.js, api/email-message.js, api/email-send.js). No OAuth --
// this is for a plain cPanel/Hostinger-style mailbox, so credentials live
// only as Vercel env vars on the server; the browser never touches them.
(() => {
  const {
    Badge
  } = window.TechyFuelOSDesignSystem_be0222;
  function fmtWhen(ds) {
    if (!ds) return '';
    const d = new Date(ds);
    const now = new Date();
    const sameDay = d.toDateString() === now.toDateString();
    return sameDay ? d.toLocaleTimeString('en', {
      hour: 'numeric',
      minute: '2-digit'
    }) : d.toLocaleDateString('en', {
      month: 'short',
      day: 'numeric'
    });
  }
  function MessageRow({
    msg,
    active,
    onClick,
    mailbox
  }) {
    const [hover, setHover] = React.useState(false);
    const isSent = mailbox === 'sent';
    const who = isSent ? msg.to && msg.to[0] ? msg.to[0].name || msg.to[0].address : 'Unknown recipient' : msg.from?.name || msg.from?.address || 'Unknown sender';
    return /*#__PURE__*/React.createElement("div", {
      onClick: onClick,
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => setHover(false),
      style: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        padding: '12px 14px',
        cursor: 'pointer',
        borderLeft: `3px solid ${active ? 'var(--blue-600)' : 'transparent'}`,
        background: active ? 'var(--blue-50)' : hover ? 'var(--slate-50)' : 'transparent',
        borderBottom: '1px solid var(--border-subtle)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 8,
        height: 8,
        borderRadius: '50%',
        marginTop: 6,
        flexShrink: 0,
        background: msg.seen || isSent ? 'transparent' : 'var(--blue-500)'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-sm)',
        fontWeight: msg.seen ? 'var(--fw-medium)' : 'var(--fw-bold)',
        color: 'var(--text-strong)',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }
    }, isSent ? `To: ${who}` : who), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-2xs)',
        color: 'var(--text-subtle)',
        flexShrink: 0
      }
    }, fmtWhen(msg.date))), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-sm)',
        color: msg.seen ? 'var(--text-muted)' : 'var(--text-body)',
        fontWeight: msg.seen ? 'var(--fw-medium)' : 'var(--fw-semibold)',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        marginTop: 2
      }
    }, msg.subject)));
  }
  function ComposeModal({
    open,
    onClose,
    onSent
  }) {
    const [form, setForm] = React.useState({
      to: '',
      subject: '',
      body: ''
    });
    const [sending, setSending] = React.useState(false);
    const [error, setError] = React.useState('');
    function set(k, v) {
      setForm(f => ({
        ...f,
        [k]: v
      }));
    }
    async function handleSend() {
      if (!form.to.trim() || !form.subject.trim() || !form.body.trim()) {
        setError('To, subject and message are all required.');
        return;
      }
      setSending(true);
      setError('');
      try {
        const res = await fetch('/api/email-send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(form)
        });
        const data = await res.json();
        if (!data.ok) {
          setError(data.error || 'Could not send the email.');
          return;
        }
        setForm({
          to: '',
          subject: '',
          body: ''
        });
        onClose();
        if (onSent) onSent();
      } catch (err) {
        setError(err.message || 'Could not send the email.');
      } finally {
        setSending(false);
      }
    }
    return /*#__PURE__*/React.createElement(Modal, {
      open: open,
      onClose: onClose,
      title: "Compose email",
      onSubmit: handleSend,
      loading: sending,
      submitLabel: "Send"
    }, error && /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: 14,
        padding: '8px 12px',
        borderRadius: 'var(--radius-md)',
        background: '#fff1f2',
        border: '1px solid #fecdd3',
        color: '#be123c',
        fontSize: 'var(--text-sm)'
      }
    }, error), /*#__PURE__*/React.createElement(FormRow, {
      label: "To",
      required: true
    }, /*#__PURE__*/React.createElement("input", {
      style: FF.input,
      type: "email",
      placeholder: "client@example.com",
      value: form.to,
      onChange: e => set('to', e.target.value),
      autoFocus: true
    })), /*#__PURE__*/React.createElement(FormRow, {
      label: "Subject",
      required: true
    }, /*#__PURE__*/React.createElement("input", {
      style: FF.input,
      placeholder: "Subject…",
      value: form.subject,
      onChange: e => set('subject', e.target.value)
    })), /*#__PURE__*/React.createElement(FormRow, {
      label: "Message",
      required: true
    }, /*#__PURE__*/React.createElement("textarea", {
      style: {
        ...FF.input,
        height: 180,
        padding: '10px',
        resize: 'vertical',
        fontFamily: 'var(--font-sans)'
      },
      placeholder: "Write your message…",
      value: form.body,
      onChange: e => set('body', e.target.value)
    })));
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
    const [mailbox, setMailbox] = React.useState('inbox'); // 'inbox' | 'sent'

    async function loadList(box) {
      const which = box || mailbox;
      setLoading(true);
      setError('');
      setSelectedUid(null);
      setSelectedMsg(null);
      try {
        const res = await fetch(`/api/email-list?mailbox=${which}`);
        const data = await res.json();
        if (!data.ok) {
          setError(data.error || 'Could not load your mailbox.');
          setMessages([]);
          return;
        }
        setMessages(data.messages || []);
      } catch (err) {
        setError(err.message || 'Could not load your mailbox.');
      } finally {
        setLoading(false);
      }
    }
    React.useEffect(() => {
      loadList(mailbox);
    }, [mailbox]);
    async function openMessage(uid) {
      setSelectedUid(uid);
      setSelectedMsg(null);
      setMsgLoading(true);
      try {
        const res = await fetch(`/api/email-message?uid=${uid}&mailbox=${mailbox}`);
        const data = await res.json();
        if (data.ok) {
          setSelectedMsg(data.message);
          setMessages(prev => prev.map(m => m.uid === uid ? {
            ...m,
            seen: true
          } : m));
        }
      } catch {} finally {
        setMsgLoading(false);
      }
    }
    return /*#__PURE__*/React.createElement("div", {
      style: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 24px 16px',
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
      style: {
        fontSize: 'var(--text-2xl)',
        fontWeight: 'var(--fw-extrabold)',
        letterSpacing: '-0.02em'
      }
    }, "Email"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 'var(--text-sm)',
        color: 'var(--text-muted)',
        marginTop: 2
      }
    }, messages.length, " messages in ", mailbox === 'sent' ? 'sent' : 'inbox')), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => loadList(),
      disabled: loading,
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        height: 36,
        padding: '0 14px',
        background: 'var(--slate-0)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-md)',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-semibold)',
        color: 'var(--text-body)',
        cursor: loading ? 'wait' : 'pointer'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "refresh-cw",
      size: 15
    }), " Refresh"), /*#__PURE__*/React.createElement("button", {
      onClick: () => setComposeOpen(true),
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        height: 36,
        padding: '0 14px',
        background: 'var(--blue-600)',
        color: '#fff',
        border: 'none',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-brand)',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-semibold)',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "pencil",
      size: 15
    }), " Compose"))), error && /*#__PURE__*/React.createElement("div", {
      style: {
        margin: '0 24px 16px',
        padding: '12px 16px',
        borderRadius: 'var(--radius-md)',
        background: '#fff1f2',
        border: '1px solid #fecdd3',
        color: '#be123c',
        fontSize: 'var(--text-sm)'
      }
    }, error), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minHeight: 0,
        display: 'flex',
        margin: '0 24px 24px',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-xl)',
        background: 'var(--slate-0)',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 340,
        flexShrink: 0,
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 4,
        padding: 10,
        borderBottom: '1px solid var(--border-subtle)',
        flexShrink: 0
      }
    }, [['inbox', 'inbox', 'Inbox'], ['sent', 'send', 'Sent']].map(([id, icon, label]) => /*#__PURE__*/React.createElement("button", {
      key: id,
      onClick: () => setMailbox(id),
      style: {
        flex: 1,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        height: 32,
        borderRadius: 'var(--radius-md)',
        border: 'none',
        cursor: 'pointer',
        background: mailbox === id ? 'var(--blue-50)' : 'transparent',
        color: mailbox === id ? 'var(--blue-700)' : 'var(--text-muted)',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-semibold)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: icon,
      size: 14
    }), " ", label))), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        overflowY: 'auto'
      }
    }, loading ? /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 40,
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: 'var(--text-sm)'
      }
    }, "Loading…") : messages.length === 0 && !error ? /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 40,
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: 'var(--text-sm)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "inbox",
      size: 28,
      style: {
        color: 'var(--slate-300)',
        display: 'block',
        margin: '0 auto 10px'
      }
    }), "No messages yet.") : messages.map(m => /*#__PURE__*/React.createElement(MessageRow, {
      key: m.uid,
      msg: m,
      mailbox: mailbox,
      active: m.uid === selectedUid,
      onClick: () => openMessage(m.uid)
    })))), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0,
        overflowY: 'auto',
        padding: selectedUid ? '24px 28px' : 0
      }
    }, !selectedUid ? /*#__PURE__*/React.createElement("div", {
      style: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-muted)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "mail",
      size: 32,
      style: {
        color: 'var(--slate-300)',
        marginBottom: 10
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-sm)'
      }
    }, "Select a message to read it")) : msgLoading ? /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 40,
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: 'var(--text-sm)'
      }
    }, "Loading…") : selectedMsg ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-xl)',
        fontWeight: 'var(--fw-bold)',
        color: 'var(--text-strong)',
        marginBottom: 10
      }
    }, selectedMsg.subject), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        paddingBottom: 16,
        borderBottom: '1px solid var(--border-subtle)',
        marginBottom: 16
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: "neutral",
      size: "sm"
    }, mailbox === 'sent' ? `To: ${(selectedMsg.to || []).join(', ') || 'Unknown'}` : selectedMsg.from?.name || selectedMsg.from?.address), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-xs)',
        color: 'var(--text-subtle)'
      }
    }, selectedMsg.date ? new Date(selectedMsg.date).toLocaleString() : '')), selectedMsg.html ? /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-sm)',
        color: 'var(--text-body)',
        lineHeight: 1.6
      },
      dangerouslySetInnerHTML: {
        __html: selectedMsg.html
      }
    }) : /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-sm)',
        color: 'var(--text-body)',
        lineHeight: 1.6,
        whiteSpace: 'pre-wrap'
      }
    }, selectedMsg.text)) : /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 40,
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: 'var(--text-sm)'
      }
    }, "Could not load this message."))), /*#__PURE__*/React.createElement(ComposeModal, {
      open: composeOpen,
      onClose: () => setComposeOpen(false),
      onSent: loadList
    }));
  }
  Object.assign(window, {
    Email
  });
})();