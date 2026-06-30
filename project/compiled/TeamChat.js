// Team Chat — full Slack-style messaging system
(() => {
  const {
    Avatar,
    Badge
  } = window.TechyFuelOSDesignSystem_be0222;
  const EMOJIS = ['👍', '❤️', '😂', '🎉', '🔥', '😮', '👀', '✅', '💯', '🚀', '😢', '👏'];
  function fmtTime(ts) {
    if (!ts) return '';
    const d = new Date(ts);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    const isYesterday = new Date(now - 86400000).toDateString() === d.toDateString();
    const time = d.toLocaleTimeString('en', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    if (isToday) return time;
    if (isYesterday) return 'Yesterday ' + time;
    return d.toLocaleDateString('en', {
      month: 'short',
      day: 'numeric'
    }) + ' ' + time;
  }
  function fmtDate(ts) {
    if (!ts) return '';
    const d = new Date(ts);
    const now = new Date();
    if (d.toDateString() === now.toDateString()) return 'Today';
    if (new Date(now - 86400000).toDateString() === d.toDateString()) return 'Yesterday';
    return d.toLocaleDateString('en', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  }
  function fmtSize(bytes) {
    if (!bytes) return '';
    if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + ' MB';
    return (bytes / 1024).toFixed(0) + ' KB';
  }
  function initials(name) {
    if (!name) return '?';
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  }
  function getChannelDmName(ch, team, myId) {
    if (ch.type !== 'dm') return ch.name;
    const other = team.find(m => m.id !== myId && ch.name.includes(m.id));
    return other ? other.name : ch.name;
  }

  // ── Avatar with initials fallback ────────────────────────────────
  function MemberAvatar({
    name,
    size = 28
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'var(--blue-600)',
        color: '#fff',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size < 24 ? 9 : 11,
        fontWeight: 700,
        flex: 'none'
      }
    }, initials(name));
  }

  // ── Emoji reaction pill ───────────────────────────────────────────
  function ReactionPill({
    emoji,
    count,
    mine,
    onClick
  }) {
    return /*#__PURE__*/React.createElement("button", {
      onClick: onClick,
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 3,
        padding: '2px 7px',
        border: `1px solid ${mine ? 'var(--blue-400)' : 'var(--border-subtle)'}`,
        borderRadius: 12,
        background: mine ? 'var(--blue-50)' : 'var(--slate-50)',
        cursor: 'pointer',
        fontSize: 13,
        fontFamily: 'var(--font-sans)'
      }
    }, emoji, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        fontWeight: 700,
        color: mine ? 'var(--blue-700)' : 'var(--text-muted)'
      }
    }, count));
  }

  // ── Emoji picker popup ────────────────────────────────────────────
  function EmojiPicker({
    onPick,
    onClose
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        zIndex: 50,
        background: 'var(--slate-0)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-xl)',
        padding: 10,
        display: 'flex',
        flexWrap: 'wrap',
        gap: 4,
        width: 220
      },
      onClick: e => e.stopPropagation()
    }, EMOJIS.map(e => /*#__PURE__*/React.createElement("button", {
      key: e,
      onClick: () => {
        onPick(e);
        onClose();
      },
      style: {
        fontSize: 20,
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        borderRadius: 6,
        padding: '2px 4px',
        lineHeight: 1
      }
    }, e)));
  }

  // ── Message bubble ────────────────────────────────────────────────
  function MessageBubble({
    msg,
    myId,
    onReact,
    onThread,
    onPin,
    onDelete,
    showDateDivider,
    isThread
  }) {
    const [hover, setHover] = React.useState(false);
    const [emojiOpen, setEmojiOpen] = React.useState(false);
    useLucide();
    const senderName = msg.team_members?.name || 'Unknown';
    const reactionMap = {};
    (msg.reactions || []).forEach(r => {
      if (!reactionMap[r.emoji]) reactionMap[r.emoji] = {
        count: 0,
        mine: false
      };
      reactionMap[r.emoji].count++;
      if (r.member_id === myId) reactionMap[r.emoji].mine = true;
    });
    const isMe = msg.sender_id === myId;
    const renderedContent = React.useMemo(() => {
      if (!msg.content) return null;
      return msg.content.replace(/@(\w[\w\s]*?)(?=\s|$|[^a-zA-Z])/g, '<mark style="background:var(--blue-100);color:var(--blue-800);border-radius:3px;padding:0 3px;font-weight:600;">@$1</mark>');
    }, [msg.content]);
    return /*#__PURE__*/React.createElement(React.Fragment, null, showDateDivider && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        margin: '20px 0 12px',
        padding: '0 16px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        height: 1,
        background: 'var(--border-subtle)'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-2xs)',
        fontWeight: 'var(--fw-bold)',
        color: 'var(--text-muted)',
        padding: '3px 10px',
        background: 'var(--slate-100)',
        borderRadius: 12
      }
    }, fmtDate(msg.created_at)), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        height: 1,
        background: 'var(--border-subtle)'
      }
    })), /*#__PURE__*/React.createElement("div", {
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => {
        setHover(false);
        setEmojiOpen(false);
      },
      style: {
        position: 'relative',
        display: 'flex',
        gap: 10,
        padding: '4px 16px',
        background: hover ? 'var(--slate-50)' : 'transparent',
        transition: 'background 0.1s'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 32,
        flex: 'none',
        paddingTop: 2
      }
    }, /*#__PURE__*/React.createElement(MemberAvatar, {
      name: senderName,
      size: 32
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'baseline',
        gap: 8,
        marginBottom: 3
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-bold)',
        color: 'var(--text-strong)'
      }
    }, senderName), msg.pinned && /*#__PURE__*/React.createElement(Icon, {
      name: "pin",
      size: 11,
      style: {
        color: 'var(--amber-500)'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-xs)',
        color: 'var(--text-subtle)'
      }
    }, fmtTime(msg.created_at))), msg.content && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-sm)',
        color: 'var(--text-body)',
        lineHeight: 1.55,
        wordBreak: 'break-word'
      },
      dangerouslySetInnerHTML: {
        __html: renderedContent
      }
    }), msg.file_url && /*#__PURE__*/React.createElement("a", {
      href: msg.file_url,
      target: "_blank",
      rel: "noreferrer",
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        marginTop: 6,
        padding: '8px 12px',
        background: 'var(--slate-100)',
        borderRadius: 'var(--radius-md)',
        textDecoration: 'none',
        border: '1px solid var(--border-subtle)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: msg.file_type?.startsWith('image') ? 'image' : 'file',
      size: 16,
      style: {
        color: 'var(--blue-600)'
      }
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--fw-semibold)',
        color: 'var(--text-strong)'
      }
    }, msg.file_name), msg.file_size && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-2xs)',
        color: 'var(--text-muted)'
      }
    }, fmtSize(msg.file_size))), /*#__PURE__*/React.createElement(Icon, {
      name: "download",
      size: 14,
      style: {
        color: 'var(--text-muted)'
      }
    })), msg.file_type?.startsWith('image') && msg.file_url && /*#__PURE__*/React.createElement("img", {
      src: msg.file_url,
      alt: msg.file_name,
      style: {
        display: 'block',
        maxWidth: 320,
        maxHeight: 240,
        borderRadius: 'var(--radius-md)',
        marginTop: 6,
        border: '1px solid var(--border-subtle)',
        objectFit: 'cover'
      }
    }), Object.keys(reactionMap).length > 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: 4,
        marginTop: 6
      }
    }, Object.entries(reactionMap).map(([emoji, {
      count,
      mine
    }]) => /*#__PURE__*/React.createElement(ReactionPill, {
      key: emoji,
      emoji: emoji,
      count: count,
      mine: mine,
      onClick: () => onReact(msg.id, emoji)
    }))), msg.reply_count > 0 && !isThread && /*#__PURE__*/React.createElement("button", {
      onClick: () => onThread(msg),
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        marginTop: 5,
        padding: '3px 8px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: 'var(--blue-600)',
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--fw-semibold)',
        fontFamily: 'var(--font-sans)',
        borderRadius: 'var(--radius-sm)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "message-square",
      size: 12
    }), msg.reply_count, " ", msg.reply_count === 1 ? 'reply' : 'replies')), hover && /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 0,
        right: 16,
        display: 'flex',
        gap: 2,
        background: 'var(--slate-0)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '2px 4px',
        boxShadow: 'var(--shadow-md)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => setEmojiOpen(o => !o),
      title: "React",
      style: {
        width: 28,
        height: 28,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        borderRadius: 'var(--radius-sm)',
        color: 'var(--text-muted)',
        fontSize: 16
      }
    }, "😊"), emojiOpen && /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        bottom: 34,
        right: 0
      }
    }, /*#__PURE__*/React.createElement(EmojiPicker, {
      onPick: e => onReact(msg.id, e),
      onClose: () => setEmojiOpen(false)
    }))), !isThread && /*#__PURE__*/React.createElement("button", {
      onClick: () => onThread(msg),
      title: "Reply in thread",
      style: {
        width: 28,
        height: 28,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        borderRadius: 'var(--radius-sm)',
        color: 'var(--text-muted)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "message-square",
      size: 14
    })), /*#__PURE__*/React.createElement("button", {
      onClick: () => onPin(msg),
      title: msg.pinned ? 'Unpin' : 'Pin message',
      style: {
        width: 28,
        height: 28,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        borderRadius: 'var(--radius-sm)',
        color: msg.pinned ? 'var(--amber-500)' : 'var(--text-muted)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "pin",
      size: 14
    })), isMe && /*#__PURE__*/React.createElement("button", {
      onClick: () => onDelete(msg.id),
      title: "Delete message",
      style: {
        width: 28,
        height: 28,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        borderRadius: 'var(--radius-sm)',
        color: 'var(--text-muted)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "trash-2",
      size: 14
    })))));
  }

  // ── Message input ─────────────────────────────────────────────────
  function MessageInput({
    channelName,
    onSend,
    team,
    myId,
    placeholder
  }) {
    useLucide();
    const [text, setText] = React.useState('');
    const [mentionQ, setMentionQ] = React.useState('');
    const [mentionOpen, setMentionOpen] = React.useState(false);
    const [dragging, setDragging] = React.useState(false);
    const [uploading, setUploading] = React.useState(false);
    const inputRef = React.useRef();
    const fileRef = React.useRef();
    function handleInput(e) {
      const val = e.target.value;
      setText(val);
      const match = val.match(/@([\w\s]*)$/);
      if (match) {
        setMentionQ(match[1]);
        setMentionOpen(true);
      } else setMentionOpen(false);
    }
    function pickMention(member) {
      const newText = text.replace(/@([\w\s]*)$/, `@${member.name} `);
      setText(newText);
      setMentionOpen(false);
      inputRef.current?.focus();
    }
    function handleKeyDown(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        submit();
      }
      if (e.key === 'Escape') setMentionOpen(false);
    }
    function submit() {
      const trimmed = text.trim();
      if (!trimmed) return;
      onSend({
        content: trimmed
      });
      setText('');
      setMentionOpen(false);
    }
    async function handleFiles(files) {
      if (!files.length || !window.API) return;
      setUploading(true);
      for (const file of files) {
        try {
          const path = `chat/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
          const url = await window.API.uploadFile('files', path, file);
          onSend({
            file_url: url,
            file_name: file.name,
            file_size: file.size,
            file_type: file.type
          });
        } catch {}
      }
      setUploading(false);
    }
    const filteredMentions = mentionOpen ? team.filter(m => m.id !== myId && m.name.toLowerCase().includes(mentionQ.toLowerCase())).slice(0, 5) : [];
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '10px 16px 14px',
        position: 'relative'
      },
      onDragOver: e => {
        e.preventDefault();
        setDragging(true);
      },
      onDragLeave: () => setDragging(false),
      onDrop: e => {
        e.preventDefault();
        setDragging(false);
        handleFiles(Array.from(e.dataTransfer.files));
      }
    }, mentionOpen && filteredMentions.length > 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        bottom: '100%',
        left: 16,
        right: 16,
        background: 'var(--slate-0)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-xl)',
        overflow: 'hidden',
        zIndex: 30
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '6px 12px',
        fontSize: 'var(--text-xs)',
        color: 'var(--text-muted)',
        fontWeight: 'var(--fw-semibold)',
        borderBottom: '1px solid var(--border-subtle)'
      }
    }, "Team members"), filteredMentions.map(m => /*#__PURE__*/React.createElement("button", {
      key: m.id,
      onClick: () => pickMention(m),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        width: '100%',
        padding: '9px 12px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-sm)',
        color: 'var(--text-body)',
        textAlign: 'left'
      }
    }, /*#__PURE__*/React.createElement(MemberAvatar, {
      name: m.name,
      size: 24
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 'var(--fw-semibold)'
      }
    }, m.name), /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--text-muted)',
        fontSize: 'var(--text-xs)'
      }
    }, m.role || ''))), /*#__PURE__*/React.createElement("button", {
      onClick: () => pickMention({
        name: 'here'
      }),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        width: '100%',
        padding: '9px 12px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-sm)',
        color: 'var(--text-body)',
        textAlign: 'left',
        borderTop: '1px solid var(--border-subtle)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 24,
        height: 24,
        borderRadius: '50%',
        background: 'var(--green-100)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "users",
      size: 13,
      style: {
        color: 'var(--green-700)'
      }
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 'var(--fw-semibold)'
      }
    }, "@here"), /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--text-muted)',
        fontSize: 'var(--text-xs)'
      }
    }, "Notify all channel members"))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        border: `2px solid ${dragging ? 'var(--blue-400)' : 'var(--border-default)'}`,
        borderRadius: 'var(--radius-lg)',
        background: dragging ? 'var(--blue-50)' : 'var(--slate-0)',
        transition: 'border-color 0.15s',
        overflow: 'hidden'
      }
    }, dragging && /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 20,
        textAlign: 'center',
        color: 'var(--blue-600)',
        fontWeight: 'var(--fw-semibold)',
        fontSize: 'var(--text-sm)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "upload-cloud",
      size: 24
    }), " Drop file to share"), !dragging && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("textarea", {
      ref: inputRef,
      value: text,
      onChange: handleInput,
      onKeyDown: handleKeyDown,
      placeholder: placeholder || `Message #${channelName}`,
      rows: 1,
      style: {
        width: '100%',
        border: 'none',
        outline: 'none',
        padding: '10px 14px 0',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-sm)',
        color: 'var(--text-body)',
        resize: 'none',
        background: 'transparent',
        lineHeight: 1.5,
        boxSizing: 'border-box',
        minHeight: 36
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '6px 10px 8px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 2
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => fileRef.current?.click(),
      title: "Attach file",
      style: {
        width: 30,
        height: 30,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: 'var(--text-muted)',
        borderRadius: 'var(--radius-sm)'
      }
    }, uploading ? /*#__PURE__*/React.createElement(Icon, {
      name: "loader",
      size: 16
    }) : /*#__PURE__*/React.createElement(Icon, {
      name: "paperclip",
      size: 16
    })), /*#__PURE__*/React.createElement("input", {
      ref: fileRef,
      type: "file",
      multiple: true,
      style: {
        display: 'none'
      },
      onChange: e => handleFiles(Array.from(e.target.files || []))
    }), /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        const newText = text + '@';
        setText(newText);
        setMentionOpen(true);
        setMentionQ('');
        inputRef.current?.focus();
      },
      title: "Mention someone",
      style: {
        width: 30,
        height: 30,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: 'var(--text-muted)',
        borderRadius: 'var(--radius-sm)',
        fontSize: 14,
        fontWeight: 700
      }
    }, "@")), /*#__PURE__*/React.createElement("button", {
      onClick: submit,
      disabled: !text.trim(),
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 32,
        height: 32,
        background: text.trim() ? 'var(--blue-600)' : 'var(--slate-200)',
        border: 'none',
        borderRadius: 'var(--radius-md)',
        cursor: text.trim() ? 'pointer' : 'not-allowed',
        color: text.trim() ? '#fff' : 'var(--text-subtle)',
        transition: 'background 0.15s'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "send",
      size: 15
    }))))));
  }

  // ── Sidebar item ──────────────────────────────────────────────────
  function SidebarCh({
    ch,
    active,
    unread,
    onClick
  }) {
    const [h, setH] = React.useState(false);
    return /*#__PURE__*/React.createElement("button", {
      onClick: onClick,
      onMouseEnter: () => setH(true),
      onMouseLeave: () => setH(false),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 7,
        width: '100%',
        padding: '5px 10px',
        border: 'none',
        borderRadius: 'var(--radius-sm)',
        cursor: 'pointer',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-sm)',
        fontWeight: unread ? 700 : active ? 600 : 500,
        background: active ? 'rgba(255,255,255,0.15)' : h ? 'rgba(255,255,255,0.08)' : 'transparent',
        color: active ? '#fff' : unread ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.7)',
        textAlign: 'left',
        transition: 'all 0.12s'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        opacity: 0.7,
        fontSize: 13
      }
    }, ch.type === 'dm' ? '' : ch.type === 'group' ? '⊕' : '#'), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }
    }, ch.displayName || ch.name), unread > 0 && /*#__PURE__*/React.createElement("span", {
      style: {
        background: 'var(--blue-400)',
        color: '#fff',
        fontSize: 10,
        fontWeight: 800,
        borderRadius: 10,
        padding: '1px 6px',
        minWidth: 18,
        textAlign: 'center'
      }
    }, unread));
  }

  // ── New channel / DM modal ────────────────────────────────────────
  function NewChannelModal({
    open,
    onClose,
    team,
    myId,
    onCreate,
    type
  }) {
    useLucide();
    const [name, setName] = React.useState('');
    const [desc, setDesc] = React.useState('');
    const [selectedMembers, setSelectedMembers] = React.useState([]);
    const [saving, setSaving] = React.useState(false);
    if (!open) return null;
    const isDM = type === 'dm';
    const isGroup = type === 'group';
    const otherMembers = team.filter(m => m.id !== myId);
    async function handleCreate() {
      if (isDM && selectedMembers.length === 0) return;
      if ((isGroup || type === 'channel') && !name.trim()) return;
      setSaving(true);
      try {
        let chName = name.trim();
        if (isDM) chName = [myId, selectedMembers[0]].sort().join('_');
        if (isGroup) chName = name.trim();
        await onCreate({
          name: chName,
          type,
          description: desc,
          members: isDM ? [myId, ...selectedMembers] : selectedMembers.length ? [myId, ...selectedMembers] : [myId]
        });
        setName('');
        setDesc('');
        setSelectedMembers([]);
        onClose();
      } finally {
        setSaving(false);
      }
    }
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      },
      onClick: onClose
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        background: 'var(--slate-0)',
        borderRadius: 'var(--radius-xl)',
        padding: 28,
        width: 420,
        boxShadow: 'var(--shadow-2xl)'
      },
      onClick: e => e.stopPropagation()
    }, /*#__PURE__*/React.createElement("h3", {
      style: {
        fontSize: 'var(--text-lg)',
        fontWeight: 'var(--fw-bold)',
        marginBottom: 20
      }
    }, isDM ? 'New direct message' : isGroup ? 'New group chat' : 'New channel'), !isDM && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement("label", {
      style: {
        display: 'block',
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--fw-bold)',
        color: 'var(--text-muted)',
        marginBottom: 6,
        textTransform: 'uppercase',
        letterSpacing: '0.07em'
      }
    }, isGroup ? 'Group name' : 'Channel name'), /*#__PURE__*/React.createElement("input", {
      value: name,
      onChange: e => setName(e.target.value.toLowerCase().replace(/\s+/g, '-')),
      placeholder: isGroup ? 'design-team' : 'channel-name',
      style: {
        width: '100%',
        height: 38,
        padding: '0 12px',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-md)',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-sm)',
        boxSizing: 'border-box',
        outline: 'none'
      }
    })), !isGroup && /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement("label", {
      style: {
        display: 'block',
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--fw-bold)',
        color: 'var(--text-muted)',
        marginBottom: 6,
        textTransform: 'uppercase',
        letterSpacing: '0.07em'
      }
    }, "Description"), /*#__PURE__*/React.createElement("input", {
      value: desc,
      onChange: e => setDesc(e.target.value),
      placeholder: "What's this channel for?",
      style: {
        width: '100%',
        height: 38,
        padding: '0 12px',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-md)',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-sm)',
        boxSizing: 'border-box',
        outline: 'none'
      }
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: 20
      }
    }, /*#__PURE__*/React.createElement("label", {
      style: {
        display: 'block',
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--fw-bold)',
        color: 'var(--text-muted)',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: '0.07em'
      }
    }, isDM ? 'Send to' : 'Add members'), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        maxHeight: 200,
        overflowY: 'auto'
      }
    }, otherMembers.map(m => {
      const checked = selectedMembers.includes(m.id);
      return /*#__PURE__*/React.createElement("button", {
        key: m.id,
        onClick: () => setSelectedMembers(prev => isDM ? [m.id] : checked ? prev.filter(id => id !== m.id) : [...prev, m.id]),
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '8px 10px',
          border: `1px solid ${checked ? 'var(--blue-400)' : 'var(--border-subtle)'}`,
          borderRadius: 'var(--radius-md)',
          background: checked ? 'var(--blue-50)' : 'transparent',
          cursor: 'pointer',
          fontFamily: 'var(--font-sans)'
        }
      }, /*#__PURE__*/React.createElement(MemberAvatar, {
        name: m.name,
        size: 28
      }), /*#__PURE__*/React.createElement("div", {
        style: {
          textAlign: 'left'
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
      }, m.role || '')), checked && /*#__PURE__*/React.createElement(Icon, {
        name: "check",
        size: 16,
        style: {
          marginLeft: 'auto',
          color: 'var(--blue-600)'
        }
      }));
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 10,
        justifyContent: 'flex-end'
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: onClose,
      style: {
        height: 36,
        padding: '0 16px',
        background: 'var(--slate-100)',
        border: 'none',
        borderRadius: 'var(--radius-md)',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-semibold)',
        cursor: 'pointer'
      }
    }, "Cancel"), /*#__PURE__*/React.createElement("button", {
      onClick: handleCreate,
      disabled: saving,
      style: {
        height: 36,
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
    }, saving ? 'Creating…' : isDM ? 'Open DM' : 'Create'))));
  }

  // ── Search panel ──────────────────────────────────────────────────
  function SearchPanel({
    open,
    onClose,
    onJump
  }) {
    useLucide();
    const [q, setQ] = React.useState('');
    const [results, setResults] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    React.useEffect(() => {
      if (!q.trim() || !window.API) {
        setResults([]);
        return;
      }
      const timer = setTimeout(async () => {
        setLoading(true);
        try {
          const r = await window.API.searchMessages(q.trim());
          if (r.data) setResults(r.data);
        } catch {}
        setLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    }, [q]);
    if (!open) return null;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.4)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: 80
      },
      onClick: onClose
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        background: 'var(--slate-0)',
        borderRadius: 'var(--radius-xl)',
        width: 560,
        boxShadow: 'var(--shadow-2xl)',
        overflow: 'hidden'
      },
      onClick: e => e.stopPropagation()
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '14px 18px',
        borderBottom: '1px solid var(--border-subtle)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "search",
      size: 18,
      style: {
        color: 'var(--text-muted)'
      }
    }), /*#__PURE__*/React.createElement("input", {
      autoFocus: true,
      value: q,
      onChange: e => setQ(e.target.value),
      placeholder: "Search messages, files, people…",
      style: {
        flex: 1,
        border: 'none',
        outline: 'none',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-base)',
        color: 'var(--text-body)'
      }
    }), /*#__PURE__*/React.createElement("button", {
      onClick: onClose,
      style: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: 'var(--text-muted)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "x",
      size: 18
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        maxHeight: 400,
        overflowY: 'auto'
      }
    }, loading && /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 24,
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: 'var(--text-sm)'
      }
    }, "Searching…"), !loading && q.trim() && results.length === 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 24,
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: 'var(--text-sm)'
      }
    }, "No results for \"", q, "\""), results.map(msg => /*#__PURE__*/React.createElement("button", {
      key: msg.id,
      onClick: () => {
        onJump(msg);
        onClose();
      },
      style: {
        display: 'flex',
        gap: 12,
        width: '100%',
        padding: '12px 18px',
        border: 'none',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'none',
        cursor: 'pointer',
        textAlign: 'left',
        fontFamily: 'var(--font-sans)'
      }
    }, /*#__PURE__*/React.createElement(MemberAvatar, {
      name: msg.team_members?.name || '?',
      size: 32
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        marginBottom: 2
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--fw-bold)',
        color: 'var(--text-strong)'
      }
    }, msg.team_members?.name), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-xs)',
        color: 'var(--text-muted)'
      }
    }, "in #", msg.channels?.name), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-xs)',
        color: 'var(--text-subtle)',
        marginLeft: 'auto'
      }
    }, fmtTime(msg.created_at))), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-sm)',
        color: 'var(--text-body)',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }
    }, msg.content)))))));
  }

  // ── Main TeamChat component ───────────────────────────────────────
  function TeamChat() {
    useLucide();
    const [channels, setChannels] = React.useState([]);
    const [activeId, setActiveId] = React.useState(null);
    const [messages, setMessages] = React.useState([]);
    const [team, setTeam] = React.useState([]);
    const [myId, setMyId] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [msgLoading, setMsgLoading] = React.useState(false);
    const [thread, setThread] = React.useState(null); // { parent, replies }
    const [threadLoading, setThreadLoading] = React.useState(false);
    const [pinnedOpen, setPinnedOpen] = React.useState(false);
    const [pinned, setPinned] = React.useState([]);
    const [searchOpen, setSearchOpen] = React.useState(false);
    const [newModal, setNewModal] = React.useState(null); // 'channel' | 'dm' | 'group'
    const [unread, setUnread] = React.useState({});
    const [membersOpen, setMembersOpen] = React.useState(false);
    const [channelMembers, setChannelMembers] = React.useState([]);
    const [call, setCall] = React.useState(null); // { channelId, channelName, type: 'audio'|'video' }
    const subRef = React.useRef(null);
    const bottomRef = React.useRef(null);
    const savedMyId = React.useRef(null);
    const activeChannel = channels.find(c => c.id === activeId);

    // Load initial data
    React.useEffect(() => {
      if (!window.API) {
        setLoading(false);
        return;
      }
      (async () => {
        try {
          const [tr, cr] = await Promise.all([window.API.getTeam(), window.API.getChannels()]);
          const members = tr.data || [];
          const chs = cr.data || [];
          setTeam(members);

          // Use stored myId or default to first team member
          const stored = localStorage.getItem('tf_chat_member');
          const me = members.find(m => m.id === stored) || members[0];
          if (me) {
            setMyId(me.id);
            savedMyId.current = me.id;
            localStorage.setItem('tf_chat_member', me.id);
          }

          // Enrich DM channel display names
          const enriched = chs.map(ch => {
            if (ch.type === 'dm') {
              const ids = ch.name.split('_');
              const otherId = ids.find(id => id !== me?.id);
              const other = members.find(m => m.id === otherId);
              return {
                ...ch,
                displayName: other?.name || ch.name
              };
            }
            return ch;
          });
          setChannels(enriched);
          if (enriched.length > 0) setActiveId(enriched[0].id);
        } catch {}
        setLoading(false);
      })();
    }, []);

    // Load messages when channel changes
    React.useEffect(() => {
      if (!activeId || !window.API) return;
      setMsgLoading(true);
      setThread(null);
      setMessages([]);

      // Unsubscribe previous
      if (subRef.current) {
        try {
          subRef.current.unsubscribe();
        } catch {}
      }
      (async () => {
        try {
          const r = await window.API.getMessages(activeId);
          if (r.data) {
            const msgs = await enrichWithReactions(r.data);
            setMessages(msgs);
          }
        } catch {}
        setMsgLoading(false);

        // Realtime subscription
        try {
          subRef.current = window.API.subscribeToMessages(activeId, async newMsg => {
            if (newMsg.thread_parent_id) {
              // Update reply count on parent
              setMessages(prev => prev.map(m => m.id === newMsg.thread_parent_id ? {
                ...m,
                reply_count: (m.reply_count || 0) + 1
              } : m));
              // If thread is open for this parent, add the reply
              setThread(prev => {
                if (prev && prev.parent.id === newMsg.thread_parent_id) {
                  const fullMsg = {
                    ...newMsg
                  };
                  return {
                    ...prev,
                    replies: [...prev.replies, fullMsg]
                  };
                }
                return prev;
              });
            } else {
              const enriched = await enrichWithReactions([newMsg]);
              setMessages(prev => {
                if (prev.find(m => m.id === newMsg.id)) return prev;
                return [...prev, ...enriched];
              });
              // Mark as unread if not our message
              if (newMsg.sender_id !== savedMyId.current) {
                setUnread(prev => ({
                  ...prev,
                  [activeId]: (prev[activeId] || 0) + 1
                }));
              }
            }
          });
        } catch {}
      })();

      // Clear unread for this channel
      setUnread(prev => ({
        ...prev,
        [activeId]: 0
      }));
    }, [activeId]);

    // Auto-scroll to bottom
    React.useEffect(() => {
      if (bottomRef.current) bottomRef.current.scrollIntoView({
        behavior: 'smooth'
      });
    }, [messages.length]);
    async function enrichWithReactions(msgs) {
      return Promise.all(msgs.map(async msg => {
        try {
          const r = await window.API.getReactions(msg.id);
          return {
            ...msg,
            reactions: r.data || []
          };
        } catch {
          return {
            ...msg,
            reactions: []
          };
        }
      }));
    }
    async function handleSend(payload) {
      if (!activeId || !myId || !window.API) return;
      try {
        const {
          data
        } = await window.API.sendMessage({
          channel_id: activeId,
          sender_id: myId,
          ...payload
        });
        if (data) {
          const enriched = {
            ...data,
            reactions: []
          };
          setMessages(prev => prev.find(m => m.id === data.id) ? prev : [...prev, enriched]);
        }
      } catch {}
    }
    async function handleThreadSend(payload) {
      if (!thread || !myId || !window.API) return;
      try {
        const {
          data
        } = await window.API.sendMessage({
          channel_id: activeId,
          sender_id: myId,
          thread_parent_id: thread.parent.id,
          ...payload
        });
        if (data) {
          setThread(prev => ({
            ...prev,
            replies: [...prev.replies, {
              ...data,
              reactions: []
            }]
          }));
          setMessages(prev => prev.map(m => m.id === thread.parent.id ? {
            ...m,
            reply_count: (m.reply_count || 0) + 1
          } : m));
        }
      } catch {}
    }
    async function handleReact(msgId, emoji) {
      if (!myId || !window.API) return;
      const msg = messages.find(m => m.id === msgId);
      const existing = msg?.reactions?.find(r => r.member_id === myId && r.emoji === emoji);
      try {
        if (existing) {
          await window.API.removeReaction(msgId, myId, emoji);
          setMessages(prev => prev.map(m => m.id === msgId ? {
            ...m,
            reactions: m.reactions.filter(r => !(r.member_id === myId && r.emoji === emoji))
          } : m));
        } else {
          await window.API.addReaction({
            message_id: msgId,
            member_id: myId,
            emoji
          });
          setMessages(prev => prev.map(m => m.id === msgId ? {
            ...m,
            reactions: [...(m.reactions || []), {
              message_id: msgId,
              member_id: myId,
              emoji
            }]
          } : m));
        }
      } catch {}
    }
    async function handlePin(msg) {
      if (!window.API) return;
      try {
        await window.API.pinMessage(msg.id, !msg.pinned);
        setMessages(prev => prev.map(m => m.id === msg.id ? {
          ...m,
          pinned: !m.pinned
        } : m));
      } catch {}
    }
    async function handleDelete(msgId) {
      if (!window.API) return;
      try {
        await window.API.deleteMessage(msgId);
        setMessages(prev => prev.filter(m => m.id !== msgId));
      } catch {}
    }
    async function openThread(msg) {
      setThread({
        parent: msg,
        replies: []
      });
      setThreadLoading(true);
      try {
        const r = await window.API.getMessages(activeId, {
          parentId: msg.id
        });
        const replies = await enrichWithReactions(r.data || []);
        setThread({
          parent: msg,
          replies
        });
        // Count replies on parent
        setMessages(prev => prev.map(m => m.id === msg.id ? {
          ...m,
          reply_count: replies.length
        } : m));
      } catch {}
      setThreadLoading(false);
    }
    async function openPinned() {
      setPinnedOpen(true);
      if (!window.API) return;
      try {
        const r = await window.API.getPinnedMessages(activeId);
        if (r.data) setPinned(r.data);
      } catch {}
    }
    async function openMembers() {
      setMembersOpen(true);
      if (!window.API) return;
      try {
        const r = await window.API.getChannelMembers(activeId);
        if (r.data) setChannelMembers(r.data);
      } catch {}
    }
    async function handleCreateChannel({
      name,
      type,
      description,
      members
    }) {
      if (!window.API) return;
      try {
        const {
          data: ch
        } = await window.API.createChannel({
          name,
          type,
          description,
          created_by: myId
        });
        if (ch) {
          // Add members
          for (const memberId of members) {
            try {
              await window.API.addChannelMember({
                channel_id: ch.id,
                member_id: memberId
              });
            } catch {}
          }
          const enriched = type === 'dm' ? {
            ...ch,
            displayName: team.find(m => members.find(id => id !== myId) === m.id)?.name || name
          } : ch;
          setChannels(prev => [...prev, enriched]);
          setActiveId(ch.id);
        }
      } catch {}
    }

    // Group channels for sidebar
    const publicChannels = channels.filter(c => c.type === 'channel');
    const projectChannels = channels.filter(c => c.type === 'project');
    const dms = channels.filter(c => c.type === 'dm');
    const groups = channels.filter(c => c.type === 'group');

    // Date divider logic
    function showDivider(msgs, idx) {
      if (idx === 0) return true;
      const prev = new Date(msgs[idx - 1].created_at).toDateString();
      const curr = new Date(msgs[idx].created_at).toDateString();
      return prev !== curr;
    }
    if (loading) return /*#__PURE__*/React.createElement("div", {
      style: {
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-muted)'
      }
    }, "Loading chat…");
    return /*#__PURE__*/React.createElement("div", {
      style: {
        height: '100%',
        display: 'flex',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 240,
        flex: 'none',
        background: 'linear-gradient(180deg, #1e2d4a 0%, #162039 100%)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        borderRight: '1px solid rgba(255,255,255,0.06)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '14px 14px 10px',
        borderBottom: '1px solid rgba(255,255,255,0.08)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-base)',
        fontWeight: 'var(--fw-bold)',
        color: '#fff'
      }
    }, "Team Chat"), /*#__PURE__*/React.createElement("button", {
      onClick: () => setSearchOpen(true),
      style: {
        width: 28,
        height: 28,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(255,255,255,0.1)',
        border: 'none',
        borderRadius: 'var(--radius-sm)',
        cursor: 'pointer',
        color: 'rgba(255,255,255,0.7)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "search",
      size: 14
    }))), /*#__PURE__*/React.createElement("select", {
      value: myId || '',
      onChange: e => {
        setMyId(e.target.value);
        savedMyId.current = e.target.value;
        localStorage.setItem('tf_chat_member', e.target.value);
      },
      style: {
        width: '100%',
        height: 30,
        padding: '0 8px',
        background: 'rgba(255,255,255,0.1)',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: 'var(--radius-sm)',
        color: '#fff',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-xs)',
        outline: 'none',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement("option", {
      value: "",
      style: {
        color: '#000'
      }
    }, "— You are —"), team.map(m => /*#__PURE__*/React.createElement("option", {
      key: m.id,
      value: m.id,
      style: {
        color: '#000'
      }
    }, m.name)))), /*#__PURE__*/React.createElement("div", {
      className: "tf-scroll",
      style: {
        flex: 1,
        overflowY: 'auto',
        padding: '10px 8px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '4px 6px',
        marginBottom: 2
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--fw-bold)',
        color: 'rgba(255,255,255,0.45)',
        textTransform: 'uppercase',
        letterSpacing: '0.08em'
      }
    }, "Channels"), /*#__PURE__*/React.createElement("button", {
      onClick: () => setNewModal('channel'),
      style: {
        width: 18,
        height: 18,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: 'rgba(255,255,255,0.45)',
        fontSize: 16,
        lineHeight: 1
      }
    }, "+")), publicChannels.map(ch => /*#__PURE__*/React.createElement(SidebarCh, {
      key: ch.id,
      ch: ch,
      active: activeId === ch.id,
      unread: unread[ch.id] || 0,
      onClick: () => setActiveId(ch.id)
    }))), projectChannels.length > 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '4px 6px',
        marginBottom: 2
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--fw-bold)',
        color: 'rgba(255,255,255,0.45)',
        textTransform: 'uppercase',
        letterSpacing: '0.08em'
      }
    }, "Projects")), projectChannels.map(ch => /*#__PURE__*/React.createElement(SidebarCh, {
      key: ch.id,
      ch: ch,
      active: activeId === ch.id,
      unread: unread[ch.id] || 0,
      onClick: () => setActiveId(ch.id)
    }))), groups.length > 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '4px 6px',
        marginBottom: 2
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--fw-bold)',
        color: 'rgba(255,255,255,0.45)',
        textTransform: 'uppercase',
        letterSpacing: '0.08em'
      }
    }, "Groups"), /*#__PURE__*/React.createElement("button", {
      onClick: () => setNewModal('group'),
      style: {
        width: 18,
        height: 18,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: 'rgba(255,255,255,0.45)',
        fontSize: 16,
        lineHeight: 1
      }
    }, "+")), groups.map(ch => /*#__PURE__*/React.createElement(SidebarCh, {
      key: ch.id,
      ch: ch,
      active: activeId === ch.id,
      unread: unread[ch.id] || 0,
      onClick: () => setActiveId(ch.id)
    }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '4px 6px',
        marginBottom: 2
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--fw-bold)',
        color: 'rgba(255,255,255,0.45)',
        textTransform: 'uppercase',
        letterSpacing: '0.08em'
      }
    }, "Direct messages"), /*#__PURE__*/React.createElement("button", {
      onClick: () => setNewModal('dm'),
      style: {
        width: 18,
        height: 18,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: 'rgba(255,255,255,0.45)',
        fontSize: 16,
        lineHeight: 1
      }
    }, "+")), dms.length === 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '4px 10px',
        fontSize: 'var(--text-xs)',
        color: 'rgba(255,255,255,0.3)'
      }
    }, "No DMs yet"), dms.map(ch => /*#__PURE__*/React.createElement(SidebarCh, {
      key: ch.id,
      ch: ch,
      active: activeId === ch.id,
      unread: unread[ch.id] || 0,
      onClick: () => setActiveId(ch.id)
    }))))), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        height: '100%',
        overflow: 'hidden'
      }
    }, activeChannel && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        padding: '12px 18px',
        borderBottom: '1px solid var(--border-subtle)',
        gap: 10,
        background: 'var(--slate-0)',
        flex: 'none'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-lg)',
        color: 'var(--text-muted)'
      }
    }, activeChannel.type === 'dm' ? '' : '#'), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-base)',
        fontWeight: 'var(--fw-bold)',
        color: 'var(--text-strong)'
      }
    }, activeChannel.displayName || activeChannel.name), activeChannel.description && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-xs)',
        color: 'var(--text-muted)'
      }
    }, activeChannel.description)), /*#__PURE__*/React.createElement("button", {
      onClick: () => setCall({
        channelId: activeChannel.id,
        channelName: activeChannel.displayName || activeChannel.name,
        type: 'audio'
      }),
      title: "Voice call",
      style: {
        width: 32,
        height: 32,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'none',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
        color: 'var(--text-muted)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "phone",
      size: 15
    })), /*#__PURE__*/React.createElement("button", {
      onClick: () => setCall({
        channelId: activeChannel.id,
        channelName: activeChannel.displayName || activeChannel.name,
        type: 'video'
      }),
      title: "Video call",
      style: {
        width: 32,
        height: 32,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'none',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
        color: 'var(--text-muted)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "video",
      size: 15
    })), /*#__PURE__*/React.createElement("button", {
      onClick: () => setSearchOpen(true),
      style: {
        width: 32,
        height: 32,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'none',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
        color: 'var(--text-muted)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "search",
      size: 15
    })), /*#__PURE__*/React.createElement("button", {
      onClick: openMembers,
      style: {
        width: 32,
        height: 32,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'none',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
        color: 'var(--text-muted)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "users",
      size: 15
    })), /*#__PURE__*/React.createElement("button", {
      onClick: openPinned,
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        height: 32,
        padding: '0 10px',
        background: 'none',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
        color: 'var(--text-muted)',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--fw-semibold)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "pin",
      size: 13
    }), " Pinned")), /*#__PURE__*/React.createElement("div", {
      className: "tf-scroll",
      style: {
        flex: 1,
        overflowY: 'auto',
        paddingTop: 8
      }
    }, msgLoading && /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 32,
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: 'var(--text-sm)'
      }
    }, "Loading messages…"), !msgLoading && messages.length === 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '60px 24px',
        textAlign: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 48,
        marginBottom: 12
      }
    }, activeChannel?.type === 'dm' ? '👋' : '#️⃣'), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-lg)',
        fontWeight: 'var(--fw-bold)',
        color: 'var(--text-strong)',
        marginBottom: 6
      }
    }, activeChannel?.type === 'dm' ? `Start a conversation with ${activeChannel.displayName}` : `Welcome to #${activeChannel?.name}`), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-sm)',
        color: 'var(--text-muted)'
      }
    }, activeChannel?.description || 'Send the first message!')), messages.map((msg, i) => /*#__PURE__*/React.createElement(MessageBubble, {
      key: msg.id,
      msg: msg,
      myId: myId,
      onReact: handleReact,
      onThread: openThread,
      onPin: handlePin,
      onDelete: handleDelete,
      showDateDivider: showDivider(messages, i)
    })), /*#__PURE__*/React.createElement("div", {
      ref: bottomRef,
      style: {
        height: 1
      }
    })), activeChannel && /*#__PURE__*/React.createElement(MessageInput, {
      channelName: activeChannel.displayName || activeChannel.name,
      onSend: handleSend,
      team: team,
      myId: myId
    })), thread && /*#__PURE__*/React.createElement("div", {
      style: {
        width: 360,
        flex: 'none',
        borderLeft: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: 'var(--slate-0)',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '13px 16px',
        borderBottom: '1px solid var(--border-subtle)',
        flex: 'none'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-base)',
        fontWeight: 'var(--fw-bold)',
        color: 'var(--text-strong)'
      }
    }, "Thread"), /*#__PURE__*/React.createElement("button", {
      onClick: () => setThread(null),
      style: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: 'var(--text-muted)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "x",
      size: 18
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        borderBottom: '2px solid var(--border-subtle)',
        paddingBottom: 8,
        paddingTop: 4
      }
    }, /*#__PURE__*/React.createElement(MessageBubble, {
      msg: thread.parent,
      myId: myId,
      onReact: handleReact,
      onThread: () => {},
      onPin: handlePin,
      onDelete: handleDelete,
      isThread: true,
      showDateDivider: false
    })), /*#__PURE__*/React.createElement("div", {
      className: "tf-scroll",
      style: {
        flex: 1,
        overflowY: 'auto',
        paddingTop: 4
      }
    }, threadLoading && /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 20,
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: 'var(--text-sm)'
      }
    }, "Loading…"), !threadLoading && thread.replies.length === 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '20px 16px',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: 'var(--text-sm)'
      }
    }, "No replies yet"), thread.replies.map((msg, i) => /*#__PURE__*/React.createElement(MessageBubble, {
      key: msg.id,
      msg: msg,
      myId: myId,
      onReact: handleReact,
      onThread: () => {},
      onPin: handlePin,
      onDelete: handleDelete,
      isThread: true,
      showDateDivider: showDivider(thread.replies, i)
    }))), /*#__PURE__*/React.createElement(MessageInput, {
      channelName: activeChannel?.name,
      placeholder: `Reply to thread…`,
      onSend: handleThreadSend,
      team: team,
      myId: myId
    })), pinnedOpen && /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.4)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'flex-end'
      },
      onClick: () => setPinnedOpen(false)
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 400,
        height: '100%',
        background: 'var(--slate-0)',
        boxShadow: 'var(--shadow-2xl)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      },
      onClick: e => e.stopPropagation()
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 18px',
        borderBottom: '1px solid var(--border-subtle)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-base)',
        fontWeight: 'var(--fw-bold)'
      }
    }, "Pinned messages"), /*#__PURE__*/React.createElement("button", {
      onClick: () => setPinnedOpen(false),
      style: {
        background: 'none',
        border: 'none',
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
        overflowY: 'auto'
      }
    }, pinned.length === 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 32,
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: 'var(--text-sm)'
      }
    }, "No pinned messages in this channel"), pinned.map(msg => /*#__PURE__*/React.createElement("div", {
      key: msg.id,
      style: {
        padding: '12px 18px',
        borderBottom: '1px solid var(--border-subtle)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement(MemberAvatar, {
      name: msg.team_members?.name || '?',
      size: 28
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--fw-bold)',
        color: 'var(--text-strong)',
        marginBottom: 2
      }
    }, msg.team_members?.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-sm)',
        color: 'var(--text-body)'
      }
    }, msg.content), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-xs)',
        color: 'var(--text-subtle)',
        marginTop: 4
      }
    }, fmtTime(msg.created_at))))))))), membersOpen && /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.4)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'flex-end'
      },
      onClick: () => setMembersOpen(false)
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 360,
        height: '100%',
        background: 'var(--slate-0)',
        boxShadow: 'var(--shadow-2xl)',
        display: 'flex',
        flexDirection: 'column'
      },
      onClick: e => e.stopPropagation()
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 18px',
        borderBottom: '1px solid var(--border-subtle)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-base)',
        fontWeight: 'var(--fw-bold)'
      }
    }, "Members"), /*#__PURE__*/React.createElement("button", {
      onClick: () => setMembersOpen(false),
      style: {
        background: 'none',
        border: 'none',
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
        padding: '10px 12px'
      }
    }, channelMembers.length === 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 20,
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: 'var(--text-sm)'
      }
    }, "No members found"), channelMembers.map(cm => /*#__PURE__*/React.createElement("div", {
      key: cm.id,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 6px',
        borderRadius: 'var(--radius-md)'
      }
    }, /*#__PURE__*/React.createElement(MemberAvatar, {
      name: cm.team_members?.name || '?',
      size: 32
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-semibold)',
        color: 'var(--text-strong)'
      }
    }, cm.team_members?.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-xs)',
        color: 'var(--text-muted)'
      }
    }, cm.team_members?.role || '')))), channelMembers.length === 0 && team.map(m => /*#__PURE__*/React.createElement("div", {
      key: m.id,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 6px',
        borderRadius: 'var(--radius-md)'
      }
    }, /*#__PURE__*/React.createElement(MemberAvatar, {
      name: m.name,
      size: 32
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
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
    }, m.role || ''))))))), /*#__PURE__*/React.createElement(SearchPanel, {
      open: searchOpen,
      onClose: () => setSearchOpen(false),
      onJump: msg => {
        setActiveId(msg.channel_id);
      }
    }), /*#__PURE__*/React.createElement(NewChannelModal, {
      open: !!newModal,
      type: newModal,
      onClose: () => setNewModal(null),
      team: team,
      myId: myId,
      onCreate: handleCreateChannel
    }), call && /*#__PURE__*/React.createElement(CallModal, {
      call: call,
      onClose: () => setCall(null)
    }));
  }

  // ── Call Modal (Jitsi Meet embed) ─────────────────────────────────────────────
  function CallModal({
    call,
    onClose
  }) {
    useLucide();
    const containerRef = React.useRef(null);
    const apiRef = React.useRef(null);
    const [ready, setReady] = React.useState(false);
    const [duration, setDuration] = React.useState(0);
    const [participants, setParticipants] = React.useState(1);
    const roomName = 'techyfuel-os-' + call.channelId.replace(/-/g, '').slice(0, 12);
    React.useEffect(() => {
      let loaded = false;
      function initJitsi() {
        if (loaded || !containerRef.current || !window.JitsiMeetExternalAPI) return;
        loaded = true;
        try {
          const api = new window.JitsiMeetExternalAPI('meet.jit.si', {
            roomName,
            parentNode: containerRef.current,
            width: '100%',
            height: '100%',
            configOverwrite: {
              startWithAudioMuted: false,
              startWithVideoMuted: call.type === 'audio',
              prejoinPageEnabled: false,
              disableDeepLinking: true,
              enableNoisyMicDetection: true
            },
            interfaceConfigOverwrite: {
              TOOLBAR_BUTTONS: call.type === 'audio' ? ['microphone', 'hangup'] : ['microphone', 'camera', 'desktop', 'recording', 'fullscreen', 'hangup'],
              SHOW_JITSI_WATERMARK: false,
              SHOW_WATERMARK_FOR_GUESTS: false,
              DEFAULT_REMOTE_DISPLAY_NAME: 'Team member',
              APP_NAME: 'TechyFuel OS'
            },
            userInfo: {
              displayName: localStorage.getItem('tf_my_name') || 'Team Member'
            }
          });
          apiRef.current = api;
          api.addEventListener('videoConferenceJoined', () => setReady(true));
          api.addEventListener('participantJoined', () => setParticipants(p => p + 1));
          api.addEventListener('participantLeft', () => setParticipants(p => Math.max(1, p - 1)));
          api.addEventListener('readyToClose', onClose);
        } catch (e) {
          console.error('Jitsi init error', e);
        }
      }
      if (window.JitsiMeetExternalAPI) {
        initJitsi();
      } else {
        const s = document.createElement('script');
        s.src = 'https://meet.jit.si/external_api.js';
        s.onload = initJitsi;
        document.head.appendChild(s);
      }
      return () => {
        if (apiRef.current) {
          try {
            apiRef.current.dispose();
          } catch {}
        }
      };
    }, []);

    // Duration timer
    React.useEffect(() => {
      const t = setInterval(() => setDuration(d => d + 1), 1000);
      return () => clearInterval(t);
    }, []);
    function fmt(s) {
      const m = Math.floor(s / 60);
      return `${String(m).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
    }
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'fixed',
        inset: 0,
        zIndex: 5000,
        background: '#0d1117',
        display: 'flex',
        flexDirection: 'column'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '12px 20px',
        background: '#161b22',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: '#22c55e',
        boxShadow: '0 0 6px #22c55e'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'white',
        fontWeight: 700,
        fontSize: 15
      }
    }, call.type === 'audio' ? '🎙️' : '🎥', " ", call.channelName)), /*#__PURE__*/React.createElement("span", {
      style: {
        color: '#8b949e',
        fontSize: 14
      }
    }, fmt(duration)), /*#__PURE__*/React.createElement("span", {
      style: {
        color: '#8b949e',
        fontSize: 13
      }
    }, "· ", participants, " participant", participants !== 1 ? 's' : ''), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: '#8b949e'
      }
    }, call.type === 'video' ? 'Screen share & recording available in toolbar below' : 'Voice call'), /*#__PURE__*/React.createElement("button", {
      onClick: onClose,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '7px 16px',
        background: '#ef4444',
        color: 'white',
        border: 'none',
        borderRadius: 8,
        cursor: 'pointer',
        fontSize: 14,
        fontWeight: 700,
        fontFamily: 'var(--font-sans)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "phone-off",
      size: 15
    }), " End Call")), /*#__PURE__*/React.createElement("div", {
      ref: containerRef,
      style: {
        flex: 1,
        position: 'relative'
      }
    }, !ready && /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        color: '#8b949e'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 48,
        height: 48,
        border: '3px solid #30363d',
        borderTopColor: '#3b82f6',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }
    }), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 15
      }
    }, "Connecting to call…"))), /*#__PURE__*/React.createElement("style", null, `@keyframes spin { to { transform: rotate(360deg); } }`));
  }
  Object.assign(window, {
    TeamChat
  });
})();