// Calendar screen — monthly view with tasks and content posts.
(() => {
  const {
    Card,
    Badge,
    Avatar
  } = window.TechyFuelOSDesignSystem_be0222;
  const PRIORITY_COLOR = {
    urgent: 'var(--red-500)',
    high: 'var(--amber-500)',
    medium: 'var(--blue-500)',
    low: 'var(--slate-400)'
  };
  const STATUS_DOT = {
    todo: 'var(--blue-500)',
    in_progress: 'var(--violet-500)',
    review: 'var(--amber-500)',
    done: 'var(--green-500)'
  };
  const PLAT_COLOR = {
    instagram: 'var(--violet-500)',
    facebook: 'var(--blue-600)',
    linkedin: 'var(--sky-600)',
    twitter: 'var(--sky-400)',
    youtube: 'var(--red-500)',
    tiktok: 'var(--slate-700)'
  };
  function getDaysInMonth(year, month) {
    const days = [];
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    // Leading blanks
    for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) days.push(null);
    for (let d = 1; d <= totalDays; d++) days.push(d);
    // Trailing blanks to fill last row
    while (days.length % 7 !== 0) days.push(null);
    return days;
  }
  function toDateStr(year, month, day) {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }
  function CalendarEvent({
    ev
  }) {
    const color = ev.type === 'post' ? PLAT_COLOR[ev.platform] || 'var(--violet-500)' : PRIORITY_COLOR[ev.priority] || 'var(--blue-500)';
    return /*#__PURE__*/React.createElement("div", {
      title: ev.title,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        padding: '2px 5px',
        borderRadius: 'var(--radius-sm)',
        background: color + '18',
        marginBottom: 2,
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 6,
        height: 6,
        borderRadius: '50%',
        background: color,
        flex: 'none'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        fontWeight: 600,
        color: 'var(--text-strong)',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        lineHeight: 1.3
      }
    }, ev.title));
  }
  function CalendarCell({
    day,
    year,
    month,
    events,
    isToday,
    isOtherMonth
  }) {
    const dayEvents = day ? events[toDateStr(year, month, day)] || [] : [];
    return /*#__PURE__*/React.createElement("div", {
      style: {
        borderRight: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
        minHeight: 100,
        padding: '6px 6px 4px',
        background: isToday ? 'var(--blue-50)' : 'transparent',
        opacity: isOtherMonth ? 0.35 : 1
      }
    }, day && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-xs)',
        fontWeight: isToday ? 'var(--fw-extrabold)' : 'var(--fw-semibold)',
        color: isToday ? '#fff' : 'var(--text-body)',
        width: 22,
        height: 22,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        background: isToday ? 'var(--blue-600)' : 'transparent',
        marginBottom: 4
      }
    }, day), dayEvents.slice(0, 3).map((ev, i) => /*#__PURE__*/React.createElement(CalendarEvent, {
      key: i,
      ev: ev
    })), dayEvents.length > 3 && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: 'var(--text-muted)',
        fontWeight: 600,
        padding: '1px 5px'
      }
    }, "+", dayEvents.length - 3, " more")));
  }
  function Calendar() {
    const today = new Date();
    const [year, setYear] = React.useState(today.getFullYear());
    const [month, setMonth] = React.useState(today.getMonth());
    const [events, setEvents] = React.useState({});
    const [totalEvents, setTotalEvents] = React.useState(0);
    const [modalOpen, setModalOpen] = React.useState(false);
    const [saving, setSaving] = React.useState(false);
    const [team, setTeam] = React.useState([]);
    const [clients, setClients] = React.useState([]);
    const [form, setForm] = React.useState({
      title: '',
      type: 'task',
      due_date: '',
      priority: 'medium',
      status: 'todo',
      platform: 'instagram',
      assigned_to: '',
      client_id: ''
    });
    function set(k, v) {
      setForm(f => ({
        ...f,
        [k]: v
      }));
    }
    React.useEffect(() => {
      if (!window.API) return;
      const addEvent = (dateStr, ev) => {
        setEvents(prev => {
          const updated = {
            ...prev
          };
          if (!updated[dateStr]) updated[dateStr] = [];
          updated[dateStr] = [...updated[dateStr], ev];
          return updated;
        });
      };
      let count = 0;
      window.API.getTasks().then(r => {
        if (!r.data) return;
        r.data.forEach(t => {
          if (!t.due_date || t.status === 'done') return;
          const ds = t.due_date.split('T')[0];
          addEvent(ds, {
            id: t.id,
            title: t.title,
            type: 'task',
            priority: t.priority,
            status: t.status
          });
          count++;
        });
        setTotalEvents(c => c + count);
      }).catch(() => {});
      window.API.getContent().then(r => {
        if (!r.data) return;
        r.data.forEach(p => {
          if (!p.scheduled_at) return;
          const ds = p.scheduled_at.split('T')[0];
          addEvent(ds, {
            id: p.id,
            title: p.title,
            type: 'post',
            platform: p.platform
          });
        });
      }).catch(() => {});
      window.API.getTeam().then(r => {
        if (r.data) setTeam(r.data);
      }).catch(() => {});
      window.API.getClients().then(r => {
        if (r.data) setClients(r.data);
      }).catch(() => {});
    }, []);
    async function handleAdd() {
      if (!form.title.trim()) return;
      setSaving(true);
      try {
        if (form.type === 'task') {
          const payload = {
            title: form.title,
            priority: form.priority,
            status: form.status
          };
          if (form.due_date) payload.due_date = form.due_date;
          if (form.assigned_to) payload.assigned_to = form.assigned_to;
          if (form.client_id) payload.client_id = form.client_id;
          if (window.API) {
            const {
              data
            } = await window.API.createTask(payload);
            if (data && data.due_date) {
              const ds = data.due_date.split('T')[0];
              setEvents(prev => ({
                ...prev,
                [ds]: [...(prev[ds] || []), {
                  id: data.id,
                  title: data.title,
                  type: 'task',
                  priority: data.priority
                }]
              }));
            }
          }
        } else {
          const payload = {
            title: form.title,
            platform: form.platform,
            status: 'scheduled'
          };
          if (form.due_date) payload.scheduled_at = form.due_date + 'T09:00:00';
          if (form.client_id) payload.client_id = form.client_id;
          if (window.API) {
            const {
              data
            } = await window.API.createPost(payload);
            if (data && data.scheduled_at) {
              const ds = data.scheduled_at.split('T')[0];
              setEvents(prev => ({
                ...prev,
                [ds]: [...(prev[ds] || []), {
                  id: data.id,
                  title: data.title,
                  type: 'post',
                  platform: data.platform
                }]
              }));
            }
          }
        }
        setModalOpen(false);
        setForm({
          title: '',
          type: 'task',
          due_date: '',
          priority: 'medium',
          status: 'todo',
          platform: 'instagram',
          assigned_to: '',
          client_id: ''
        });
      } finally {
        setSaving(false);
      }
    }
    function prevMonth() {
      if (month === 0) {
        setYear(y => y - 1);
        setMonth(11);
      } else setMonth(m => m - 1);
    }
    function nextMonth() {
      if (month === 11) {
        setYear(y => y + 1);
        setMonth(0);
      } else setMonth(m => m + 1);
    }
    const days = getDaysInMonth(year, month);
    const monthLabel = new Date(year, month, 1).toLocaleDateString('en', {
      month: 'long',
      year: 'numeric'
    });
    const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate());
    const allEventsThisMonth = Object.entries(events).filter(([ds]) => ds.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`));
    const thisMonthCount = allEventsThisMonth.reduce((s, [, arr]) => s + arr.length, 0);
    const DOW = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        boxSizing: 'border-box'
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
    }, "Calendar"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 'var(--text-sm)',
        color: 'var(--text-muted)',
        marginTop: 2
      }
    }, monthLabel, " · ", thisMonthCount, " events")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0,
        height: 36,
        background: 'var(--slate-0)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: prevMonth,
      style: {
        width: 36,
        height: 36,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: 'var(--text-muted)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "chevron-left",
      size: 16
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-bold)',
        color: 'var(--text-strong)',
        padding: '0 10px',
        borderLeft: '1px solid var(--border-subtle)',
        borderRight: '1px solid var(--border-subtle)'
      }
    }, monthLabel), /*#__PURE__*/React.createElement("button", {
      onClick: nextMonth,
      style: {
        width: 36,
        height: 36,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: 'var(--text-muted)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "chevron-right",
      size: 16
    }))), /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        setYear(today.getFullYear());
        setMonth(today.getMonth());
      },
      style: {
        height: 36,
        padding: '0 14px',
        background: 'var(--slate-0)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-md)',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-semibold)',
        color: 'var(--text-body)',
        cursor: 'pointer'
      }
    }, "Today"), /*#__PURE__*/React.createElement("button", {
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
    }), " Add event"))), /*#__PURE__*/React.createElement(Card, {
      padding: "none",
      style: {
        flex: 1,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        borderBottom: '1px solid var(--border-subtle)'
      }
    }, DOW.map(d => /*#__PURE__*/React.createElement("div", {
      key: d,
      style: {
        padding: '10px 8px',
        textAlign: 'center',
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--fw-bold)',
        letterSpacing: 'var(--tracking-wide)',
        textTransform: 'uppercase',
        color: 'var(--text-subtle)',
        borderRight: '1px solid var(--border-subtle)'
      }
    }, d))), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gridTemplateRows: `repeat(${days.length / 7}, 1fr)`,
        overflow: 'auto'
      }
    }, days.map((day, i) => {
      const ds = day ? toDateStr(year, month, day) : '';
      const isToday = ds === todayStr;
      return /*#__PURE__*/React.createElement(CalendarCell, {
        key: i,
        day: day,
        year: year,
        month: month,
        events: events,
        isToday: isToday,
        isOtherMonth: false
      });
    }))), /*#__PURE__*/React.createElement(Modal, {
      open: modalOpen,
      onClose: () => setModalOpen(false),
      title: "Add event",
      onSubmit: handleAdd,
      loading: saving,
      submitLabel: "Add"
    }, /*#__PURE__*/React.createElement(FormRow, {
      label: "Title",
      required: true
    }, /*#__PURE__*/React.createElement("input", {
      style: FF.input,
      placeholder: "Event title…",
      value: form.title,
      onChange: e => set('title', e.target.value)
    })), /*#__PURE__*/React.createElement("div", {
      style: FF.row2
    }, /*#__PURE__*/React.createElement(FormRow, {
      label: "Type"
    }, /*#__PURE__*/React.createElement("select", {
      style: FF.select,
      value: form.type,
      onChange: e => set('type', e.target.value)
    }, /*#__PURE__*/React.createElement("option", {
      value: "task"
    }, "Task"), /*#__PURE__*/React.createElement("option", {
      value: "post"
    }, "Content post"))), /*#__PURE__*/React.createElement(FormRow, {
      label: "Date"
    }, /*#__PURE__*/React.createElement("input", {
      style: FF.input,
      type: "date",
      value: form.due_date,
      onChange: e => set('due_date', e.target.value)
    }))), form.type === 'task' ? /*#__PURE__*/React.createElement("div", {
      style: FF.row2
    }, /*#__PURE__*/React.createElement(FormRow, {
      label: "Priority"
    }, /*#__PURE__*/React.createElement("select", {
      style: FF.select,
      value: form.priority,
      onChange: e => set('priority', e.target.value)
    }, /*#__PURE__*/React.createElement("option", {
      value: "low"
    }, "Low"), /*#__PURE__*/React.createElement("option", {
      value: "medium"
    }, "Medium"), /*#__PURE__*/React.createElement("option", {
      value: "high"
    }, "High"), /*#__PURE__*/React.createElement("option", {
      value: "urgent"
    }, "Urgent"))), /*#__PURE__*/React.createElement(FormRow, {
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
    }, m.name))))) : /*#__PURE__*/React.createElement(FormRow, {
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
    Calendar
  });
})();