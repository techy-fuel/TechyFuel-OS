// Client CRM screen — table + selectable profile panel.
(() => {
  const {
    Card,
    Badge,
    Avatar,
    Tabs,
    Input
  } = window.TechyFuelOSDesignSystem_be0222;
  const TF_STATUS = {
    active: {
      tone: 'success',
      label: 'Active client'
    },
    inactive: {
      tone: 'neutral',
      label: 'Inactive'
    },
    lead: {
      tone: 'brand',
      label: 'Lead'
    }
  };
  const TF_TIMELINE = [{
    icon: 'phone',
    tone: 'brand',
    text: 'Discovery call completed',
    time: 'Jun 18 · 32 min'
  }, {
    icon: 'file-text',
    tone: 'violet',
    text: 'Proposal sent',
    time: 'Jun 15'
  }, {
    icon: 'mail',
    tone: 'success',
    text: 'Replied to onboarding email',
    time: 'Jun 12'
  }, {
    icon: 'calendar-check',
    tone: 'warning',
    text: 'Kickoff meeting scheduled',
    time: 'Jun 10'
  }];
  const FALLBACK_CLIENTS = [{
    id: 'aaaa0001-0000-0000-0000-000000000001',
    name: 'Nova Tech',
    company: 'Nova Technology Ltd',
    email: 'contact@novatech.io',
    status: 'active',
    industry: 'SaaS',
    monthly_value: 4500,
    website: 'novatech.io'
  }, {
    id: 'aaaa0002-0000-0000-0000-000000000002',
    name: 'Bloom Foods',
    company: 'Bloom Foods Co',
    email: 'hi@bloomfoods.com',
    status: 'active',
    industry: 'F&B',
    monthly_value: 2800,
    website: 'bloomfoods.com'
  }, {
    id: 'aaaa0003-0000-0000-0000-000000000003',
    name: 'Apex Realty',
    company: 'Apex Realty Group',
    email: 'info@apexrealty.com',
    status: 'active',
    industry: 'Real Estate',
    monthly_value: 3200,
    website: 'apexrealty.com'
  }, {
    id: 'aaaa0004-0000-0000-0000-000000000004',
    name: 'Spark Academy',
    company: 'Spark Online Academy',
    email: 'hello@sparkacademy.co',
    status: 'active',
    industry: 'EdTech',
    monthly_value: 1900,
    website: 'sparkacademy.co'
  }, {
    id: 'aaaa0005-0000-0000-0000-000000000005',
    name: 'Swift Logistics',
    company: 'Swift Logistics LLC',
    email: 'ops@swiftlogistics.com',
    status: 'lead',
    industry: 'Logistics',
    monthly_value: 0,
    website: 'swiftlogistics.com'
  }];
  function fmtValue(n) {
    if (!n) return '$0/mo';
    return '$' + Number(n).toLocaleString() + '/mo';
  }
  function Th({
    children,
    w
  }) {
    return /*#__PURE__*/React.createElement("th", {
      style: {
        textAlign: 'left',
        padding: '0 14px 10px',
        fontSize: 'var(--text-2xs)',
        fontWeight: 'var(--fw-bold)',
        letterSpacing: 'var(--tracking-wide)',
        textTransform: 'uppercase',
        color: 'var(--text-subtle)',
        width: w
      }
    }, children);
  }
  function ClientRow({
    c,
    selected,
    onClick
  }) {
    const [hover, setHover] = React.useState(false);
    const s = TF_STATUS[c.status] || TF_STATUS.lead;
    const displayName = c.company || c.name;
    return /*#__PURE__*/React.createElement("tr", {
      onClick: onClick,
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => setHover(false),
      style: {
        cursor: 'pointer',
        background: selected ? 'var(--blue-50)' : hover ? 'var(--slate-50)' : 'transparent',
        transition: 'background var(--dur-fast) var(--ease-out)'
      }
    }, /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '11px 14px',
        borderTop: '1px solid var(--border-subtle)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: displayName,
      size: "sm"
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-semibold)',
        color: 'var(--text-strong)'
      }
    }, displayName), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-xs)',
        color: 'var(--text-muted)'
      }
    }, c.website || c.email)))), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '11px 14px',
        borderTop: '1px solid var(--border-subtle)',
        fontSize: 'var(--text-sm)',
        color: 'var(--text-body)'
      }
    }, c.name), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '11px 14px',
        borderTop: '1px solid var(--border-subtle)'
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: s.tone,
      dot: true
    }, s.label)), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '11px 14px',
        borderTop: '1px solid var(--border-subtle)',
        fontSize: 'var(--text-sm)',
        color: 'var(--text-body)'
      }
    }, c.industry || '—'), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '11px 14px',
        borderTop: '1px solid var(--border-subtle)',
        fontSize: 'var(--text-sm)',
        color: 'var(--text-body)'
      }
    }, c.email), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '11px 14px',
        borderTop: '1px solid var(--border-subtle)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-bold)',
        color: 'var(--text-strong)',
        textAlign: 'right',
        fontVariantNumeric: 'tabular-nums'
      }
    }, fmtValue(c.monthly_value)));
  }
  function ProfileField({
    icon,
    label,
    value
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '9px 0',
        borderBottom: '1px solid var(--border-subtle)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: icon,
      size: 16,
      style: {
        color: 'var(--text-subtle)',
        flex: 'none'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-xs)',
        color: 'var(--text-muted)',
        width: 76,
        flex: 'none'
      }
    }, label), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-sm)',
        color: 'var(--text-strong)',
        fontWeight: 'var(--fw-medium)',
        textAlign: 'right',
        flex: 1
      }
    }, value));
  }
  function CRM() {
    const [clients, setClients] = React.useState(FALLBACK_CLIENTS);
    const [selId, setSelId] = React.useState(FALLBACK_CLIENTS[0].id);
    const [search, setSearch] = React.useState('');
    const [modalOpen, setModalOpen] = React.useState(false);
    const [saving, setSaving] = React.useState(false);
    const [deleting, setDeleting] = React.useState(false);
    const [confirmDelete, setConfirmDelete] = React.useState(false);
    const [form, setForm] = React.useState({
      name: '',
      company: '',
      email: '',
      website: '',
      industry: '',
      monthly_value: '',
      status: 'active'
    });
    function set(k, v) {
      setForm(f => ({
        ...f,
        [k]: v
      }));
    }
    React.useEffect(() => {
      if (!window.API) return;
      window.API.getClients().then(r => {
        if (r.data && r.data.length > 0) {
          setClients(r.data);
          setSelId(r.data[0].id);
        }
      }).catch(() => {});
    }, []);
    async function handleDeleteClient(id) {
      setDeleting(true);
      try {
        if (window.API) await window.API.deleteClient(id).catch(() => {});
        const remaining = clients.filter(c => c.id !== id);
        setClients(remaining);
        setSelId(remaining[0]?.id || null);
        setConfirmDelete(false);
      } finally {
        setDeleting(false);
      }
    }
    async function handleAddClient() {
      if (!form.name.trim()) return;
      setSaving(true);
      try {
        const payload = {
          name: form.name,
          status: form.status
        };
        if (form.company) payload.company = form.company;
        if (form.email) payload.email = form.email;
        if (form.website) payload.website = form.website;
        if (form.industry) payload.industry = form.industry;
        if (form.monthly_value) payload.monthly_value = Number(form.monthly_value);
        if (window.API) {
          const {
            data,
            error
          } = await window.API.createClient(payload);
          if (!error && data) {
            setClients(prev => [...prev, data]);
            setSelId(data.id);
          }
        }
        setModalOpen(false);
        setForm({
          name: '',
          company: '',
          email: '',
          website: '',
          industry: '',
          monthly_value: '',
          status: 'active'
        });
      } finally {
        setSaving(false);
      }
    }
    const filtered = clients.filter(c => {
      const q = search.toLowerCase();
      return !q || (c.company || c.name || '').toLowerCase().includes(q) || (c.name || '').toLowerCase().includes(q);
    });
    const sel = clients.find(c => c.id === selId) || clients[0];
    if (!sel) return null;
    const s = TF_STATUS[sel.status] || TF_STATUS.lead;
    const displayName = sel.company || sel.name;
    const activeCount = clients.filter(c => c.status === 'active').length;
    const totalValue = clients.reduce((s, c) => s + (Number(c.monthly_value) || 0), 0);
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
    }, "Client CRM"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 'var(--text-sm)',
        color: 'var(--text-muted)',
        marginTop: 2
      }
    }, clients.length, " clients · $", Number(totalValue).toLocaleString(), "/mo in retainers")), /*#__PURE__*/React.createElement("button", {
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
    }), " Add client")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'minmax(0,1fr) 320px',
        gap: 16,
        alignItems: 'start'
      }
    }, /*#__PURE__*/React.createElement(Card, {
      padding: "none"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: 14,
        borderBottom: '1px solid var(--border-subtle)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 230
      }
    }, /*#__PURE__*/React.createElement(Input, {
      size: "sm",
      placeholder: "Search clients…",
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "search",
        size: 16
      }),
      value: search,
      onChange: e => setSearch(e.target.value)
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        height: 30,
        padding: '0 11px',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-md)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-semibold)',
        color: 'var(--text-body)',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "filter",
      size: 15,
      style: {
        color: 'var(--text-muted)'
      }
    }), " Status"), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-xs)',
        color: 'var(--text-muted)'
      }
    }, filtered.length, " of ", clients.length)), /*#__PURE__*/React.createElement("table", {
      style: {
        width: '100%',
        borderCollapse: 'collapse'
      }
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement(Th, null, "Company"), /*#__PURE__*/React.createElement(Th, null, "Contact"), /*#__PURE__*/React.createElement(Th, null, "Status"), /*#__PURE__*/React.createElement(Th, null, "Industry"), /*#__PURE__*/React.createElement(Th, null, "Email"), /*#__PURE__*/React.createElement(Th, {
      w: "100"
    }, "Value"))), /*#__PURE__*/React.createElement("tbody", null, filtered.map(c => /*#__PURE__*/React.createElement(ClientRow, {
      key: c.id,
      c: c,
      selected: c.id === selId,
      onClick: () => {
        setSelId(c.id);
        setConfirmDelete(false);
      }
    }))))), /*#__PURE__*/React.createElement(Card, {
      padding: "none",
      style: {
        overflow: 'hidden',
        position: 'sticky',
        top: 84
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        background: 'var(--grad-hero)',
        padding: '20px 18px',
        borderBottom: '1px solid var(--border-subtle)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: displayName,
      size: "lg"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-lg)',
        fontWeight: 'var(--fw-bold)',
        color: 'var(--text-strong)',
        letterSpacing: '-0.01em'
      }
    }, displayName), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 4
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: s.tone,
      dot: true
    }, s.label))), confirmDelete ? /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 5,
        flex: 'none'
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => handleDeleteClient(sel.id),
      disabled: deleting,
      style: {
        height: 28,
        padding: '0 10px',
        background: 'var(--red-600)',
        color: '#fff',
        border: 'none',
        borderRadius: 'var(--radius-md)',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--fw-bold)',
        cursor: 'pointer'
      }
    }, deleting ? '…' : 'Delete'), /*#__PURE__*/React.createElement("button", {
      onClick: () => setConfirmDelete(false),
      style: {
        height: 28,
        padding: '0 10px',
        background: 'var(--slate-0)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-md)',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--fw-semibold)',
        cursor: 'pointer',
        color: 'var(--text-body)'
      }
    }, "Cancel")) : /*#__PURE__*/React.createElement("button", {
      onClick: () => setConfirmDelete(true),
      title: "Delete client",
      style: {
        width: 30,
        height: 30,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--red-50)',
        border: '1px solid var(--red-200)',
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
        color: 'var(--red-600)',
        flex: 'none'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "trash-2",
      size: 15
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        marginTop: 14
      }
    }, [['mail', 'Email'], ['message-circle', 'WhatsApp'], ['calendar-plus', 'Meeting']].map(([ic, l]) => /*#__PURE__*/React.createElement("button", {
      key: l,
      style: {
        flex: 1,
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        padding: '8px 0',
        background: 'var(--slate-0)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-2xs)',
        fontWeight: 'var(--fw-semibold)',
        color: 'var(--text-body)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: ic,
      size: 17,
      style: {
        color: 'var(--blue-600)'
      }
    }), " ", l)))), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '6px 18px 14px'
      }
    }, /*#__PURE__*/React.createElement(ProfileField, {
      icon: "user",
      label: "Contact",
      value: sel.name
    }), /*#__PURE__*/React.createElement(ProfileField, {
      icon: "at-sign",
      label: "Email",
      value: sel.email || '—'
    }), /*#__PURE__*/React.createElement(ProfileField, {
      icon: "globe",
      label: "Website",
      value: sel.website || '—'
    }), /*#__PURE__*/React.createElement(ProfileField, {
      icon: "briefcase",
      label: "Industry",
      value: sel.industry || '—'
    }), /*#__PURE__*/React.createElement(ProfileField, {
      icon: "banknote",
      label: "Value",
      value: fmtValue(sel.monthly_value)
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '0 18px 18px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-2xs)',
        fontWeight: 'var(--fw-bold)',
        letterSpacing: 'var(--tracking-caps)',
        textTransform: 'uppercase',
        color: 'var(--text-subtle)',
        marginBottom: 10
      }
    }, "Communication timeline"), /*#__PURE__*/React.createElement("div", null, TF_TIMELINE.map((t, i) => {
      const tones = {
        brand: 'var(--blue-600)',
        violet: 'var(--violet-500)',
        success: 'var(--green-500)',
        warning: 'var(--amber-500)'
      };
      return /*#__PURE__*/React.createElement("div", {
        key: i,
        style: {
          display: 'flex',
          gap: 10,
          paddingBottom: i < TF_TIMELINE.length - 1 ? 12 : 0
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          width: 26,
          height: 26,
          borderRadius: '50%',
          background: 'var(--slate-50)',
          border: '1px solid var(--border-default)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: tones[t.tone]
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: t.icon,
        size: 13
      })), i < TF_TIMELINE.length - 1 && /*#__PURE__*/React.createElement("span", {
        style: {
          width: 1.5,
          flex: 1,
          background: 'var(--border-default)',
          marginTop: 3
        }
      })), /*#__PURE__*/React.createElement("div", {
        style: {
          paddingBottom: 2
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 'var(--text-sm)',
          color: 'var(--text-body)',
          lineHeight: 1.4
        }
      }, t.text), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 'var(--text-xs)',
          color: 'var(--text-subtle)',
          marginTop: 1
        }
      }, t.time)));
    }))))), /*#__PURE__*/React.createElement(Modal, {
      open: modalOpen,
      onClose: () => setModalOpen(false),
      title: "Add client",
      onSubmit: handleAddClient,
      loading: saving,
      submitLabel: "Add client"
    }, /*#__PURE__*/React.createElement("div", {
      style: FF.row2
    }, /*#__PURE__*/React.createElement(FormRow, {
      label: "Contact name",
      required: true
    }, /*#__PURE__*/React.createElement("input", {
      style: FF.input,
      placeholder: "Full name…",
      value: form.name,
      onChange: e => set('name', e.target.value)
    })), /*#__PURE__*/React.createElement(FormRow, {
      label: "Company"
    }, /*#__PURE__*/React.createElement("input", {
      style: FF.input,
      placeholder: "Company name…",
      value: form.company,
      onChange: e => set('company', e.target.value)
    }))), /*#__PURE__*/React.createElement("div", {
      style: FF.row2
    }, /*#__PURE__*/React.createElement(FormRow, {
      label: "Email"
    }, /*#__PURE__*/React.createElement("input", {
      style: FF.input,
      type: "email",
      placeholder: "email@company.com",
      value: form.email,
      onChange: e => set('email', e.target.value)
    })), /*#__PURE__*/React.createElement(FormRow, {
      label: "Website"
    }, /*#__PURE__*/React.createElement("input", {
      style: FF.input,
      placeholder: "company.com",
      value: form.website,
      onChange: e => set('website', e.target.value)
    }))), /*#__PURE__*/React.createElement("div", {
      style: FF.row2
    }, /*#__PURE__*/React.createElement(FormRow, {
      label: "Industry"
    }, /*#__PURE__*/React.createElement("input", {
      style: FF.input,
      placeholder: "SaaS, F&B…",
      value: form.industry,
      onChange: e => set('industry', e.target.value)
    })), /*#__PURE__*/React.createElement(FormRow, {
      label: "Monthly value ($)"
    }, /*#__PURE__*/React.createElement("input", {
      style: FF.input,
      type: "number",
      placeholder: "0",
      value: form.monthly_value,
      onChange: e => set('monthly_value', e.target.value)
    }))), /*#__PURE__*/React.createElement(FormRow, {
      label: "Status"
    }, /*#__PURE__*/React.createElement("select", {
      style: FF.select,
      value: form.status,
      onChange: e => set('status', e.target.value)
    }, /*#__PURE__*/React.createElement("option", {
      value: "lead"
    }, "Lead"), /*#__PURE__*/React.createElement("option", {
      value: "active"
    }, "Active client"), /*#__PURE__*/React.createElement("option", {
      value: "inactive"
    }, "Inactive")))));
  }
  Object.assign(window, {
    CRM
  });
})();