// Team screen — members by department + workload.
(() => {
  const {
    Card,
    Badge,
    Avatar,
    ProgressBar
  } = window.TechyFuelOSDesignSystem_be0222;
  const DEPT_TONE = {
    Design: 'violet',
    Video: 'teal',
    Marketing: 'success',
    Development: 'info',
    Sales: 'warning',
    Admin: 'neutral',
    Content: 'teal',
    Leadership: 'brand'
  };
  const ROLE_LABEL = {
    owner: 'Owner',
    admin: 'Admin',
    member: 'Member'
  };
  const FALLBACK_TEAM = [{
    id: '11111111-1111-1111-1111-111111111111',
    name: 'Sara Khan',
    role: 'owner',
    department: 'Leadership',
    status: 'active'
  }, {
    id: '22222222-2222-2222-2222-222222222222',
    name: 'Ali Raza',
    role: 'admin',
    department: 'Design',
    status: 'active'
  }, {
    id: '33333333-3333-3333-3333-333333333333',
    name: 'Zara Ahmed',
    role: 'member',
    department: 'Marketing',
    status: 'active'
  }, {
    id: '44444444-4444-4444-4444-444444444444',
    name: 'Omar Sheikh',
    role: 'member',
    department: 'Development',
    status: 'active'
  }, {
    id: '55555555-5555-5555-5555-555555555555',
    name: 'Hina Malik',
    role: 'member',
    department: 'Content',
    status: 'active'
  }];
  function Team() {
    useLucide();
    const [team, setTeam] = React.useState(FALLBACK_TEAM);
    const [taskCounts, setTaskCounts] = React.useState({});
    const [modalOpen, setModalOpen] = React.useState(false);
    const [saving, setSaving] = React.useState(false);
    const [form, setForm] = React.useState({
      name: '',
      email: '',
      department: '',
      role: 'member'
    });
    function set(k, v) {
      setForm(f => ({
        ...f,
        [k]: v
      }));
    }
    React.useEffect(() => {
      if (!window.API) return;
      window.API.getTeam().then(r => {
        if (r.data && r.data.length > 0) setTeam(r.data);
      }).catch(() => {});
      window.API.getTasks().then(r => {
        if (!r.data) return;
        const counts = {};
        r.data.filter(t => t.status !== 'done').forEach(t => {
          if (t.assigned_to) counts[t.assigned_to] = (counts[t.assigned_to] || 0) + 1;
        });
        setTaskCounts(counts);
      }).catch(() => {});
    }, []);
    async function handleInviteMember() {
      if (!form.name.trim()) {
        alert('Name is required.');
        return;
      }
      if (!form.email.trim()) {
        alert('Email is required.');
        return;
      }
      setSaving(true);
      try {
        const payload = {
          name: form.name.trim(),
          email: form.email.trim(),
          role: form.role,
          status: 'active'
        };
        if (form.department) payload.department = form.department;
        if (window.API) {
          const {
            data,
            error
          } = await window.API.addTeamMember(payload);
          if (error) {
            const msg = error.message || error.details || JSON.stringify(error);
            alert('Could not add member:\n\n' + msg);
            return;
          }
          if (data) setTeam(prev => [...prev, data]);
        }
        setModalOpen(false);
        setForm({
          name: '',
          email: '',
          department: '',
          role: 'member'
        });
      } catch (err) {
        alert('Error: ' + (err.message || JSON.stringify(err)));
      } finally {
        setSaving(false);
      }
    }
    const departments = [...new Set(team.map(m => m.department).filter(Boolean))];
    const maxTasks = Math.max(...team.map(m => taskCounts[m.id] || 0), 1);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 24,
        maxWidth: 1280,
        margin: '0 auto'
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
    }, "Team"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 'var(--text-sm)',
        color: 'var(--text-muted)',
        marginTop: 2
      }
    }, team.length, " members · ", departments.length, " departments")), /*#__PURE__*/React.createElement("button", {
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
      name: "user-plus",
      size: 16
    }), " Invite member")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        flexWrap: 'wrap',
        marginBottom: 18
      }
    }, departments.map(d => {
      const tone = DEPT_TONE[d] || 'neutral';
      const dotColor = tone === 'neutral' ? 'var(--slate-400)' : tone === 'info' ? 'var(--blue-500)' : `var(--${tone}-500)`;
      return /*#__PURE__*/React.createElement("span", {
        key: d,
        style: {
          display: 'inline-flex',
          alignItems: 'center',
          gap: 7,
          padding: '6px 12px',
          background: 'var(--slate-0)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-full)',
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--fw-semibold)',
          color: 'var(--text-body)'
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: dotColor
        }
      }), d);
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 16
      }
    }, team.map((m, i) => {
      const tasks = taskCounts[m.id] || 0;
      const load = maxTasks > 0 ? Math.round(tasks / maxTasks * 100) : 0;
      const tone = DEPT_TONE[m.department] || 'neutral';
      return /*#__PURE__*/React.createElement(Card, {
        key: m.id || i,
        interactive: true,
        padding: "md"
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 14
        }
      }, /*#__PURE__*/React.createElement(Avatar, {
        name: m.name,
        size: "lg",
        status: "online"
      }), /*#__PURE__*/React.createElement("div", {
        style: {
          flex: 1
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 'var(--text-md)',
          fontWeight: 'var(--fw-bold)',
          color: 'var(--text-strong)'
        }
      }, m.name), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 'var(--text-xs)',
          color: 'var(--text-muted)'
        }
      }, ROLE_LABEL[m.role] || m.role)), /*#__PURE__*/React.createElement(Badge, {
        tone: tone,
        size: "sm"
      }, m.department || 'Team')), /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          marginBottom: 12
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 'var(--text-xs)'
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          color: 'var(--text-muted)',
          fontWeight: 'var(--fw-semibold)'
        }
      }, "Workload"), /*#__PURE__*/React.createElement("span", {
        style: {
          color: load > 85 ? 'var(--red-600)' : 'var(--text-strong)',
          fontWeight: 'var(--fw-bold)'
        }
      }, load, "%")), /*#__PURE__*/React.createElement(ProgressBar, {
        value: load,
        tone: load > 85 ? 'danger' : load > 70 ? 'warning' : 'brand',
        size: "sm"
      })), /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          gap: 16,
          paddingTop: 12,
          borderTop: '1px solid var(--border-subtle)',
          fontSize: 'var(--text-xs)',
          color: 'var(--text-muted)'
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          display: 'inline-flex',
          alignItems: 'center',
          gap: 5
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "circle-check-big",
        size: 14
      }), " ", tasks, " active tasks"), /*#__PURE__*/React.createElement("span", {
        style: {
          display: 'inline-flex',
          alignItems: 'center',
          gap: 5
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "mail",
        size: 14
      }), " ", m.email || '—')));
    })), /*#__PURE__*/React.createElement(Modal, {
      open: modalOpen,
      onClose: () => setModalOpen(false),
      title: "Invite member",
      onSubmit: handleInviteMember,
      loading: saving,
      submitLabel: "Add member"
    }, /*#__PURE__*/React.createElement("div", {
      style: FF.row2
    }, /*#__PURE__*/React.createElement(FormRow, {
      label: "Full name",
      required: true
    }, /*#__PURE__*/React.createElement("input", {
      style: FF.input,
      placeholder: "Name…",
      value: form.name,
      onChange: e => set('name', e.target.value)
    })), /*#__PURE__*/React.createElement(FormRow, {
      label: "Email",
      required: true
    }, /*#__PURE__*/React.createElement("input", {
      style: FF.input,
      type: "email",
      placeholder: "email@agency.com",
      value: form.email,
      onChange: e => set('email', e.target.value)
    }))), /*#__PURE__*/React.createElement("div", {
      style: FF.row2
    }, /*#__PURE__*/React.createElement(FormRow, {
      label: "Department"
    }, /*#__PURE__*/React.createElement("input", {
      style: FF.input,
      placeholder: "Design, Marketing…",
      value: form.department,
      onChange: e => set('department', e.target.value)
    })), /*#__PURE__*/React.createElement(FormRow, {
      label: "Role"
    }, /*#__PURE__*/React.createElement("select", {
      style: FF.select,
      value: form.role,
      onChange: e => set('role', e.target.value)
    }, /*#__PURE__*/React.createElement("option", {
      value: "member"
    }, "Member"), /*#__PURE__*/React.createElement("option", {
      value: "admin"
    }, "Admin"), /*#__PURE__*/React.createElement("option", {
      value: "owner"
    }, "Owner"))))));
  }
  Object.assign(window, {
    Team
  });
})();