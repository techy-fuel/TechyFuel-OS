// Global "Quick Add" — press Ctrl/Cmd+J or the sidebar "+" button from any
// screen to create a Task, Client, Project or Invoice without navigating
// away from whatever you're doing. Kept intentionally minimal (only the
// fields each table actually requires) — full editing still happens on the
// dedicated screens.
(() => {
  const TYPES = [{
    id: 'task',
    label: 'Task',
    icon: 'circle-check-big'
  }, {
    id: 'client',
    label: 'Client',
    icon: 'contact'
  }, {
    id: 'project',
    label: 'Project',
    icon: 'folder-kanban'
  }, {
    id: 'invoice',
    label: 'Invoice',
    icon: 'wallet'
  }];
  const EMPTY = {
    task: {
      title: '',
      client_id: '',
      project_id: '',
      assigned_to: '',
      due_date: '',
      priority: 'medium'
    },
    client: {
      name: '',
      company: '',
      email: '',
      phone: ''
    },
    project: {
      name: '',
      client_id: '',
      due_date: '',
      priority: 'medium'
    },
    invoice: {
      client_id: '',
      amount: '',
      currency: 'PKR',
      due_date: ''
    }
  };
  function QuickAddModal({
    open,
    onClose,
    onNavigate
  }) {
    const [type, setType] = React.useState('task');
    const [form, setForm] = React.useState(EMPTY.task);
    const [clients, setClients] = React.useState([]);
    const [projects, setProjects] = React.useState([]);
    const [team, setTeam] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');
    React.useEffect(() => {
      if (!open || !window.API) return;
      setError('');
      (async () => {
        try {
          const [c, p, t] = await Promise.all([window.API.getClients(), window.API.getProjects(), window.API.getTeam()]);
          setClients(c.data || []);
          setProjects(p.data || []);
          setTeam(t.data || []);
        } catch {}
      })();
    }, [open]);
    React.useEffect(() => {
      setForm(EMPTY[type]);
      setError('');
    }, [type]);
    function set(k, v) {
      setForm(f => ({
        ...f,
        [k]: v
      }));
    }
    async function handleSubmit() {
      if (!window.API) return;
      setError('');
      if (type === 'task' && !form.title.trim()) return setError('Title is required.');
      if (type === 'client' && !form.name.trim()) return setError('Name is required.');
      if (type === 'project' && !form.name.trim()) return setError('Name is required.');
      if (type === 'invoice' && (!form.client_id || !form.amount)) return setError('Client and amount are required.');
      setLoading(true);
      try {
        let result;
        if (type === 'task') {
          result = await window.API.createTask({
            title: form.title.trim(),
            client_id: form.client_id || null,
            project_id: form.project_id || null,
            assigned_to: form.assigned_to || null,
            due_date: form.due_date || null,
            priority: form.priority,
            created_by: window.TFMyMemberId || null
          });
        } else if (type === 'client') {
          result = await window.API.createClient({
            name: form.name.trim(),
            company: form.company || null,
            email: form.email || null,
            phone: form.phone || null
          });
        } else if (type === 'project') {
          result = await window.API.createProject({
            name: form.name.trim(),
            client_id: form.client_id || null,
            due_date: form.due_date || null,
            priority: form.priority,
            created_by: window.TFMyMemberId || null
          });
        } else if (type === 'invoice') {
          // invoice_no is NOT NULL in the DB, and Quick add has no field for it,
          // so auto-generate a unique one (INV-YYYYMMDD-HHMMSS). Users can rename
          // it later from the Finance screen's edit form.
          const now = new Date();
          const pad = n => String(n).padStart(2, '0');
          const autoNo = `INV-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
          result = await window.API.createInvoice({
            invoice_no: autoNo,
            client_id: form.client_id,
            amount: Number(form.amount),
            currency: form.currency,
            due_date: form.due_date || null,
            status: 'draft'
          });
        }
        if (result && result.error) throw new Error(result.error.message || 'Could not create it. Please try again.');
        onClose();
        if (onNavigate) onNavigate(type === 'task' ? 'tasks' : type === 'client' ? 'crm' : type === 'project' ? 'projects' : 'finance');
      } catch (err) {
        setError(err.message || 'Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    return /*#__PURE__*/React.createElement(Modal, {
      open: open,
      onClose: onClose,
      title: "Quick add",
      onSubmit: handleSubmit,
      loading: loading,
      submitLabel: "Create"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 6,
        marginBottom: 18
      }
    }, TYPES.map(t => /*#__PURE__*/React.createElement("button", {
      key: t.id,
      onClick: () => setType(t.id),
      style: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 5,
        padding: '10px 6px',
        border: `1px solid ${type === t.id ? 'var(--blue-500)' : 'var(--border-default)'}`,
        background: type === t.id ? 'var(--blue-50)' : 'var(--slate-0)',
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: t.icon,
      size: 17,
      style: {
        color: type === t.id ? 'var(--blue-600)' : 'var(--text-muted)'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--fw-semibold)',
        color: type === t.id ? 'var(--blue-700)' : 'var(--text-body)'
      }
    }, t.label)))), error && /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: 14,
        padding: '8px 12px',
        borderRadius: 'var(--radius-md)',
        background: '#fff1f2',
        border: '1px solid #fecdd3',
        color: '#be123c',
        fontSize: 'var(--text-sm)'
      }
    }, error), type === 'task' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(FormRow, {
      label: "Title",
      required: true
    }, /*#__PURE__*/React.createElement("input", {
      style: FF.input,
      value: form.title,
      onChange: e => set('title', e.target.value),
      placeholder: "e.g. Follow up with client",
      autoFocus: true
    })), /*#__PURE__*/React.createElement("div", {
      style: FF.row2
    }, /*#__PURE__*/React.createElement(FormRow, {
      label: "Client"
    }, /*#__PURE__*/React.createElement("select", {
      style: FF.select,
      value: form.client_id,
      onChange: e => set('client_id', e.target.value)
    }, /*#__PURE__*/React.createElement("option", {
      value: ""
    }, "None"), clients.map(c => /*#__PURE__*/React.createElement("option", {
      key: c.id,
      value: c.id
    }, c.name)))), /*#__PURE__*/React.createElement(FormRow, {
      label: "Project"
    }, /*#__PURE__*/React.createElement("select", {
      style: FF.select,
      value: form.project_id,
      onChange: e => set('project_id', e.target.value)
    }, /*#__PURE__*/React.createElement("option", {
      value: ""
    }, "None"), projects.map(p => /*#__PURE__*/React.createElement("option", {
      key: p.id,
      value: p.id
    }, p.name))))), /*#__PURE__*/React.createElement("div", {
      style: FF.row2
    }, /*#__PURE__*/React.createElement(FormRow, {
      label: "Assigned to"
    }, /*#__PURE__*/React.createElement("select", {
      style: FF.select,
      value: form.assigned_to,
      onChange: e => set('assigned_to', e.target.value)
    }, /*#__PURE__*/React.createElement("option", {
      value: ""
    }, "Unassigned"), team.map(m => /*#__PURE__*/React.createElement("option", {
      key: m.id,
      value: m.id
    }, m.name)))), /*#__PURE__*/React.createElement(FormRow, {
      label: "Due date"
    }, /*#__PURE__*/React.createElement("input", {
      type: "date",
      style: FF.input,
      value: form.due_date,
      onChange: e => set('due_date', e.target.value)
    }))), /*#__PURE__*/React.createElement(FormRow, {
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
    }, "Urgent")))), type === 'client' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(FormRow, {
      label: "Name",
      required: true
    }, /*#__PURE__*/React.createElement("input", {
      style: FF.input,
      value: form.name,
      onChange: e => set('name', e.target.value),
      placeholder: "Client or company name",
      autoFocus: true
    })), /*#__PURE__*/React.createElement("div", {
      style: FF.row2
    }, /*#__PURE__*/React.createElement(FormRow, {
      label: "Company"
    }, /*#__PURE__*/React.createElement("input", {
      style: FF.input,
      value: form.company,
      onChange: e => set('company', e.target.value)
    })), /*#__PURE__*/React.createElement(FormRow, {
      label: "Phone"
    }, /*#__PURE__*/React.createElement("input", {
      style: FF.input,
      value: form.phone,
      onChange: e => set('phone', e.target.value)
    }))), /*#__PURE__*/React.createElement(FormRow, {
      label: "Email"
    }, /*#__PURE__*/React.createElement("input", {
      type: "email",
      style: FF.input,
      value: form.email,
      onChange: e => set('email', e.target.value)
    }))), type === 'project' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(FormRow, {
      label: "Name",
      required: true
    }, /*#__PURE__*/React.createElement("input", {
      style: FF.input,
      value: form.name,
      onChange: e => set('name', e.target.value),
      placeholder: "Project name",
      autoFocus: true
    })), /*#__PURE__*/React.createElement("div", {
      style: FF.row2
    }, /*#__PURE__*/React.createElement(FormRow, {
      label: "Client"
    }, /*#__PURE__*/React.createElement("select", {
      style: FF.select,
      value: form.client_id,
      onChange: e => set('client_id', e.target.value)
    }, /*#__PURE__*/React.createElement("option", {
      value: ""
    }, "None"), clients.map(c => /*#__PURE__*/React.createElement("option", {
      key: c.id,
      value: c.id
    }, c.name)))), /*#__PURE__*/React.createElement(FormRow, {
      label: "Due date"
    }, /*#__PURE__*/React.createElement("input", {
      type: "date",
      style: FF.input,
      value: form.due_date,
      onChange: e => set('due_date', e.target.value)
    }))), /*#__PURE__*/React.createElement(FormRow, {
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
    }, "High")))), type === 'invoice' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(FormRow, {
      label: "Client",
      required: true
    }, /*#__PURE__*/React.createElement("select", {
      style: FF.select,
      value: form.client_id,
      onChange: e => set('client_id', e.target.value),
      autoFocus: true
    }, /*#__PURE__*/React.createElement("option", {
      value: ""
    }, "Select a client…"), clients.map(c => /*#__PURE__*/React.createElement("option", {
      key: c.id,
      value: c.id
    }, c.name)))), /*#__PURE__*/React.createElement("div", {
      style: FF.row2
    }, /*#__PURE__*/React.createElement(FormRow, {
      label: "Amount",
      required: true
    }, /*#__PURE__*/React.createElement("input", {
      type: "number",
      min: "0",
      step: "0.01",
      style: FF.input,
      value: form.amount,
      onChange: e => set('amount', e.target.value),
      placeholder: "0.00"
    })), /*#__PURE__*/React.createElement(FormRow, {
      label: "Currency"
    }, /*#__PURE__*/React.createElement("select", {
      style: FF.select,
      value: form.currency,
      onChange: e => set('currency', e.target.value)
    }, /*#__PURE__*/React.createElement("option", {
      value: "PKR"
    }, "PKR"), /*#__PURE__*/React.createElement("option", {
      value: "USD"
    }, "USD"), /*#__PURE__*/React.createElement("option", {
      value: "EUR"
    }, "EUR"), /*#__PURE__*/React.createElement("option", {
      value: "GBP"
    }, "GBP")))), /*#__PURE__*/React.createElement(FormRow, {
      label: "Due date"
    }, /*#__PURE__*/React.createElement("input", {
      type: "date",
      style: FF.input,
      value: form.due_date,
      onChange: e => set('due_date', e.target.value)
    }))));
  }
  Object.assign(window, {
    QuickAddModal
  });
})();