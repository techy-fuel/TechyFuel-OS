// Content calendar screen — weekly social planner.
(() => {
  const {
    Card,
    Badge,
    Avatar
  } = window.TechyFuelOSDesignSystem_be0222;
  const PLAT = {
    instagram: ['instagram', 'var(--violet-500)'],
    facebook: ['facebook', 'var(--blue-600)'],
    linkedin: ['linkedin', 'var(--sky-600)'],
    twitter: ['twitter', 'var(--sky-400)'],
    youtube: ['youtube', 'var(--red-500)'],
    tiktok: ['music', 'var(--slate-900)']
  };
  const SS = {
    scheduled: ['success', 'Scheduled'],
    draft: ['neutral', 'Draft'],
    approval: ['warning', 'Approval'],
    published: ['info', 'Published'],
    rejected: ['danger', 'Rejected']
  };
  function getWeekDays() {
    const today = new Date();
    const dow = today.getDay(); // 0=Sun
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1));
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      days.push({
        label: d.toLocaleDateString('en', {
          weekday: 'short',
          day: 'numeric'
        }),
        dateStr: d.toISOString().split('T')[0],
        dayIndex: i
      });
    }
    return days;
  }
  const EMPTY_WEEK = {
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: []
  };
  function PostCard({
    post,
    onStatusChange
  }) {
    const [pi, pc] = PLAT[post.platform] || ['image', 'var(--slate-500)'];
    const [st, sl] = SS[post.status] || ['neutral', post.status];
    const [open, setOpen] = React.useState(false);
    const nextStatuses = ['draft', 'approval', 'scheduled', 'published', 'rejected'].filter(s => s !== post.status);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        background: 'var(--slate-0)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: 9,
        boxShadow: 'var(--shadow-xs)',
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        marginBottom: 6
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 22,
        height: 22,
        borderRadius: 'var(--radius-sm)',
        background: 'var(--slate-50)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: pc
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: pi,
      size: 13
    })), /*#__PURE__*/React.createElement("button", {
      onClick: () => setOpen(o => !o),
      style: {
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: st,
      size: "sm"
    }, sl, " ▾"))), open && /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 32,
        left: 8,
        zIndex: 20,
        background: 'var(--slate-0)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-lg)',
        padding: 4,
        minWidth: 120
      }
    }, nextStatuses.map(s => {
      const [tone, label] = SS[s] || ['neutral', s];
      return /*#__PURE__*/React.createElement("button", {
        key: s,
        onClick: () => {
          onStatusChange(post.id, s);
          setOpen(false);
        },
        style: {
          display: 'block',
          width: '100%',
          textAlign: 'left',
          padding: '6px 10px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--text-xs)',
          color: 'var(--text-body)',
          borderRadius: 'var(--radius-sm)'
        }
      }, label);
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--fw-semibold)',
        color: 'var(--text-strong)',
        lineHeight: 1.35
      }
    }, post.title), post.assigned_to_name && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-2xs)',
        color: 'var(--text-muted)',
        marginTop: 5
      }
    }, post.assigned_to_name));
  }
  function ContentCalendar() {
    const [postMap, setPostMap] = React.useState(EMPTY_WEEK);
    const [totalPosts, setTotalPosts] = React.useState(0);
    const days = React.useMemo(() => getWeekDays(), []);
    const [weekLabel, setWeekLabel] = React.useState('This week');
    const [clients, setClients] = React.useState([]);
    const [team, setTeam] = React.useState([]);
    const [modalOpen, setModalOpen] = React.useState(false);
    const [saving, setSaving] = React.useState(false);
    const [form, setForm] = React.useState({
      title: '',
      platform: 'instagram',
      status: 'draft',
      scheduled_at: '',
      client_id: '',
      assigned_to: ''
    });
    function set(k, v) {
      setForm(f => ({
        ...f,
        [k]: v
      }));
    }
    React.useEffect(() => {
      if (!window.API) return;
      (async () => {
        try {
          const r = await window.API.getContent();
          if (r.data && r.data.length > 0) {
            const startOfWeek = new Date(days[0].dateStr);
            startOfWeek.setHours(0, 0, 0, 0);
            const map = {
              0: [],
              1: [],
              2: [],
              3: [],
              4: [],
              5: [],
              6: []
            };
            r.data.forEach(post => {
              const p = {
                id: post.id,
                platform: post.platform,
                title: post.title,
                status: post.status,
                assigned_to_name: post.team_members ? post.team_members.name : null
              };
              if (!post.scheduled_at) {
                map[0].push(p);
                return;
              }
              const dayDiff = Math.round((new Date(post.scheduled_at) - startOfWeek) / 86400000);
              if (dayDiff >= 0 && dayDiff < 7) map[dayDiff].push(p);
            });
            setPostMap(map);
            setTotalPosts(r.data.length);
          }
        } catch {}
        try {
          const r = await window.API.getClients();
          if (r.data) setClients(r.data);
        } catch {}
        try {
          const r = await window.API.getTeam();
          if (r.data) setTeam(r.data);
        } catch {}
      })();
    }, []);
    async function handleStatusChange(postId, newStatus) {
      if (!window.API) return;
      try {
        await window.API.updatePost(postId, {
          status: newStatus
        });
        setPostMap(prev => {
          const next = {};
          for (const [day, posts] of Object.entries(prev)) {
            next[day] = posts.map(p => p.id === postId ? {
              ...p,
              status: newStatus
            } : p);
          }
          return next;
        });
      } catch {}
    }
    async function handleAddPost() {
      if (!form.title.trim()) return;
      setSaving(true);
      try {
        const payload = {
          title: form.title,
          platform: form.platform,
          status: form.status
        };
        if (form.scheduled_at) payload.scheduled_at = form.scheduled_at + ':00';
        if (form.client_id) payload.client_id = form.client_id;
        if (form.assigned_to) payload.assigned_to = form.assigned_to;
        if (window.API) {
          const {
            data,
            error
          } = await window.API.createPost(payload);
          if (!error && data) {
            const assigneeName = team.find(m => m.id === form.assigned_to)?.name || null;
            const newPost = {
              id: data.id,
              platform: data.platform,
              title: data.title,
              status: data.status,
              assigned_to_name: assigneeName
            };
            setPostMap(prev => ({
              ...prev,
              0: [...(prev[0] || []), newPost]
            }));
            setTotalPosts(prev => prev + 1);
          }
        }
        setModalOpen(false);
        setForm({
          title: '',
          platform: 'instagram',
          status: 'draft',
          scheduled_at: '',
          client_id: '',
          assigned_to: ''
        });
      } finally {
        setSaving(false);
      }
    }
    const platforms = new Set(Object.values(postMap).flat().map(p => p.platform).filter(Boolean));
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 24
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginBottom: 18,
        flexWrap: 'wrap',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
      style: {
        fontSize: 'var(--text-3xl)',
        fontWeight: 'var(--fw-extrabold)',
        letterSpacing: '-0.02em'
      }
    }, "Content calendar"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 'var(--text-sm)',
        color: 'var(--text-muted)',
        marginTop: 2
      }
    }, weekLabel, " · ", totalPosts, " posts across ", platforms.size, " platforms")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        height: 36,
        padding: '0 10px',
        background: 'var(--slate-0)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-md)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "chevron-left",
      size: 16,
      style: {
        color: 'var(--text-muted)',
        cursor: 'pointer'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-semibold)',
        color: 'var(--text-body)'
      }
    }, weekLabel), /*#__PURE__*/React.createElement(Icon, {
      name: "chevron-right",
      size: 16,
      style: {
        color: 'var(--text-muted)',
        cursor: 'pointer'
      }
    })), /*#__PURE__*/React.createElement("button", {
      onClick: () => setModalOpen(true),
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
      name: "plus",
      size: 16
    }), " Plan post"))), /*#__PURE__*/React.createElement(Card, {
      padding: "none",
      style: {
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)'
      }
    }, days.map((day, i) => {
      const isToday = day.dateStr === new Date().toISOString().split('T')[0];
      return /*#__PURE__*/React.createElement("div", {
        key: i,
        style: {
          borderRight: i < 6 ? '1px solid var(--border-subtle)' : 'none',
          minHeight: 360
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          padding: '11px 12px',
          borderBottom: '1px solid var(--border-subtle)',
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--fw-bold)',
          color: isToday ? 'var(--blue-700)' : 'var(--text-strong)',
          background: isToday ? 'var(--blue-50)' : 'transparent'
        }
      }, day.label), /*#__PURE__*/React.createElement("div", {
        style: {
          padding: 8,
          display: 'flex',
          flexDirection: 'column',
          gap: 8
        }
      }, (postMap[i] || []).map((p, j) => /*#__PURE__*/React.createElement(PostCard, {
        key: p.id || j,
        post: p,
        onStatusChange: handleStatusChange
      }))));
    }))), /*#__PURE__*/React.createElement(Modal, {
      open: modalOpen,
      onClose: () => setModalOpen(false),
      title: "Plan post",
      onSubmit: handleAddPost,
      loading: saving,
      submitLabel: "Add post"
    }, /*#__PURE__*/React.createElement(FormRow, {
      label: "Post title",
      required: true
    }, /*#__PURE__*/React.createElement("input", {
      style: FF.input,
      placeholder: "Post caption or title…",
      value: form.title,
      onChange: e => set('title', e.target.value)
    })), /*#__PURE__*/React.createElement("div", {
      style: FF.row2
    }, /*#__PURE__*/React.createElement(FormRow, {
      label: "Platform"
    }, /*#__PURE__*/React.createElement("select", {
      style: FF.select,
      value: form.platform,
      onChange: e => set('platform', e.target.value)
    }, /*#__PURE__*/React.createElement("option", {
      value: "instagram"
    }, "Instagram"), /*#__PURE__*/React.createElement("option", {
      value: "facebook"
    }, "Facebook"), /*#__PURE__*/React.createElement("option", {
      value: "linkedin"
    }, "LinkedIn"), /*#__PURE__*/React.createElement("option", {
      value: "twitter"
    }, "Twitter"), /*#__PURE__*/React.createElement("option", {
      value: "youtube"
    }, "YouTube"), /*#__PURE__*/React.createElement("option", {
      value: "tiktok"
    }, "TikTok"))), /*#__PURE__*/React.createElement(FormRow, {
      label: "Status"
    }, /*#__PURE__*/React.createElement("select", {
      style: FF.select,
      value: form.status,
      onChange: e => set('status', e.target.value)
    }, /*#__PURE__*/React.createElement("option", {
      value: "draft"
    }, "Draft"), /*#__PURE__*/React.createElement("option", {
      value: "approval"
    }, "Needs approval"), /*#__PURE__*/React.createElement("option", {
      value: "scheduled"
    }, "Scheduled")))), /*#__PURE__*/React.createElement("div", {
      style: FF.row2
    }, /*#__PURE__*/React.createElement(FormRow, {
      label: "Scheduled at"
    }, /*#__PURE__*/React.createElement("input", {
      style: FF.input,
      type: "datetime-local",
      value: form.scheduled_at,
      onChange: e => set('scheduled_at', e.target.value)
    })), /*#__PURE__*/React.createElement(FormRow, {
      label: "Assign to"
    }, /*#__PURE__*/React.createElement("select", {
      style: FF.select,
      value: form.assigned_to,
      onChange: e => set('assigned_to', e.target.value)
    }, /*#__PURE__*/React.createElement("option", {
      value: ""
    }, "Unassigned"), team.map(m => /*#__PURE__*/React.createElement("option", {
      key: m.id,
      value: m.id
    }, m.name))))), /*#__PURE__*/React.createElement(FormRow, {
      label: "Client"
    }, /*#__PURE__*/React.createElement("select", {
      style: FF.select,
      value: form.client_id,
      onChange: e => set('client_id', e.target.value)
    }, /*#__PURE__*/React.createElement("option", {
      value: ""
    }, "No client"), clients.map(c => /*#__PURE__*/React.createElement("option", {
      key: c.id,
      value: c.id
    }, c.company || c.name))))));
  }
  Object.assign(window, {
    ContentCalendar
  });
})();