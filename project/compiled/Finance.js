// Finance screen — revenue, profit, invoices.
(() => {
  const {
    Card,
    StatCard
  } = window.TechyFuelOSDesignSystem_be0222;
  const IS = {
    paid: {
      tone: 'success',
      label: 'Paid'
    },
    sent: {
      tone: 'info',
      label: 'Sent'
    },
    overdue: {
      tone: 'danger',
      label: 'Overdue'
    },
    draft: {
      tone: 'neutral',
      label: 'Draft'
    },
    cancelled: {
      tone: 'neutral',
      label: 'Cancelled'
    }
  };
  function fmtAmt(n) {
    if (!n && n !== 0) return '$0';
    return '$' + Number(n).toLocaleString();
  }
  function fmtDate(ds) {
    if (!ds) return '—';
    return new Date(ds).toLocaleDateString('en', {
      month: 'short',
      day: 'numeric',
      year: '2-digit'
    });
  }
  function buildMonthlyBars(invoices) {
    const months = Array.from({
      length: 12
    }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - (11 - i));
      return {
        key: d.toISOString().slice(0, 7),
        val: 0
      };
    });
    for (const inv of invoices) {
      if (inv.status !== 'paid') continue;
      const key = (inv.due_date || inv.created_at || '').slice(0, 7);
      const m = months.find(x => x.key === key);
      if (m) m.val += Number(inv.amount || 0);
    }
    return months.map(m => m.val);
  }
  function Finance() {
    const [invoices, setInvoices] = React.useState([]);
    const [clients, setClients] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [search, setSearch] = React.useState('');
    const [modalOpen, setModalOpen] = React.useState(false);
    const [editInv, setEditInv] = React.useState(null);
    const [saving, setSaving] = React.useState(false);
    const [form, setForm] = React.useState({
      invoice_no: '',
      client_id: '',
      amount: '',
      due_date: '',
      status: 'draft'
    });
    function set(k, v) {
      setForm(f => ({
        ...f,
        [k]: v
      }));
    }
    React.useEffect(() => {
      if (!window.API) {
        setLoading(false);
        return;
      }
      (async () => {
        try {
          const [invRes, cliRes] = await Promise.all([window.API.getInvoices(), window.API.getClients()]);
          if (invRes.data) setInvoices(invRes.data);
          if (cliRes.data) setClients(cliRes.data);
        } catch {} finally {
          setLoading(false);
        }
      })();
    }, []);
    function openNew() {
      setEditInv(null);
      setForm({
        invoice_no: '',
        client_id: '',
        amount: '',
        due_date: '',
        status: 'draft'
      });
      setModalOpen(true);
    }
    function openEdit(inv) {
      setEditInv(inv);
      setForm({
        invoice_no: inv.invoice_no || '',
        client_id: inv.client_id || '',
        amount: inv.amount ? String(inv.amount) : '',
        due_date: inv.due_date ? inv.due_date.slice(0, 10) : '',
        status: inv.status || 'draft'
      });
      setModalOpen(true);
    }
    async function handleSave() {
      if (!form.invoice_no.trim()) return;
      setSaving(true);
      try {
        const payload = {
          invoice_no: form.invoice_no,
          status: form.status
        };
        if (form.client_id) payload.client_id = form.client_id;
        if (form.amount) payload.amount = Number(form.amount);
        if (form.due_date) payload.due_date = form.due_date;
        const clientObj = clients.find(c => c.id === form.client_id);
        const clientsData = clientObj ? {
          name: clientObj.company || clientObj.name
        } : null;
        if (editInv && window.API) {
          const {
            data
          } = await window.API.updateInvoice(editInv.id, payload);
          if (data) setInvoices(prev => prev.map(i => i.id === editInv.id ? {
            ...data,
            clients: clientsData || i.clients
          } : i));
        } else if (window.API) {
          const {
            data
          } = await window.API.createInvoice(payload);
          if (data) setInvoices(prev => [{
            ...data,
            clients: clientsData
          }, ...prev]);
        }
        setModalOpen(false);
      } catch {} finally {
        setSaving(false);
      }
    }
    async function handleStatusChange(inv, newStatus) {
      if (!window.API) return;
      try {
        await window.API.updateInvoice(inv.id, {
          status: newStatus
        });
        setInvoices(prev => prev.map(i => i.id === inv.id ? {
          ...i,
          status: newStatus
        } : i));
      } catch {}
    }
    function handleExport() {
      const rows = [['Invoice #', 'Client', 'Amount', 'Status', 'Due Date'], ...filtered.map(inv => [inv.invoice_no, inv.clients?.name || '', inv.amount || 0, inv.status, inv.due_date || ''])];
      const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
      const blob = new Blob([csv], {
        type: 'text/csv'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'invoices.csv';
      a.click();
      URL.revokeObjectURL(url);
    }
    const filtered = invoices.filter(inv => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (inv.invoice_no || '').toLowerCase().includes(q) || (inv.clients?.name || '').toLowerCase().includes(q);
    });
    const paidRevenue = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + Number(i.amount || 0), 0);
    const outstanding = invoices.filter(i => ['sent', 'overdue'].includes(i.status)).reduce((s, i) => s + Number(i.amount || 0), 0);
    const totalAmount = invoices.reduce((s, i) => s + Number(i.amount || 0), 0);
    const monthBars = buildMonthlyBars(invoices);
    const monthName = new Date().toLocaleDateString('en', {
      month: 'long',
      year: 'numeric'
    });
    const selectStyle = {
      height: 26,
      padding: '0 6px',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-sm)',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-xs)',
      fontWeight: 'var(--fw-semibold)',
      color: 'var(--text-body)',
      background: 'var(--slate-0)',
      cursor: 'pointer'
    };
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
    }, "Finance"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 'var(--text-sm)',
        color: 'var(--text-muted)',
        marginTop: 2
      }
    }, monthName, " · ", invoices.length, " invoice", invoices.length !== 1 ? 's' : '')), /*#__PURE__*/React.createElement("button", {
      onClick: openNew,
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
    }), " New invoice")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 16,
        marginBottom: 16
      }
    }, /*#__PURE__*/React.createElement(StatCard, {
      label: "Revenue (paid)",
      value: fmtAmt(paidRevenue),
      delta: "—",
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "trending-up"
      }),
      tone: "success"
    }), /*#__PURE__*/React.createElement(StatCard, {
      label: "Total invoiced",
      value: fmtAmt(totalAmount),
      delta: "—",
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "receipt"
      }),
      tone: "brand"
    }), /*#__PURE__*/React.createElement(StatCard, {
      label: "Outstanding",
      value: fmtAmt(outstanding),
      delta: "—",
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "clock"
      }),
      tone: "warning"
    }), /*#__PURE__*/React.createElement(StatCard, {
      label: "Invoices",
      value: String(invoices.length),
      delta: "—",
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "file-text"
      }),
      tone: "violet"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 2fr',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement(Card, {
      padding: "lg"
    }, /*#__PURE__*/React.createElement("h3", {
      style: {
        fontSize: 'var(--text-lg)',
        fontWeight: 'var(--fw-bold)',
        marginBottom: 4
      }
    }, "Paid revenue"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'baseline',
        gap: 8,
        marginBottom: 12
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-2xl)',
        fontWeight: 'var(--fw-extrabold)',
        letterSpacing: '-0.02em',
        fontVariantNumeric: 'tabular-nums'
      }
    }, fmtAmt(paidRevenue))), /*#__PURE__*/React.createElement(Bars, {
      data: monthBars.some(v => v > 0) ? monthBars : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      color: "var(--green-400)",
      highlight: "var(--green-600)",
      height: 140
    })), /*#__PURE__*/React.createElement(Card, {
      padding: "none"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '14px 18px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("h3", {
      style: {
        fontSize: 'var(--text-lg)',
        fontWeight: 'var(--fw-bold)',
        flex: 1
      }
    }, "Invoices"), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "search",
      size: 14,
      style: {
        position: 'absolute',
        left: 8,
        top: '50%',
        transform: 'translateY(-50%)',
        color: 'var(--text-muted)',
        pointerEvents: 'none'
      }
    }), /*#__PURE__*/React.createElement("input", {
      value: search,
      onChange: e => setSearch(e.target.value),
      placeholder: "Search invoices…",
      style: {
        height: 32,
        padding: '0 10px 0 28px',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-md)',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-xs)',
        color: 'var(--text-body)',
        background: 'var(--slate-50)',
        outline: 'none',
        width: 170
      }
    })), /*#__PURE__*/React.createElement("button", {
      onClick: handleExport,
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        height: 32,
        padding: '0 12px',
        background: 'var(--slate-0)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-md)',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--fw-semibold)',
        color: 'var(--text-body)',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "download",
      size: 13
    }), " Export CSV")), loading && /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 32,
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: 'var(--text-sm)'
      }
    }, "Loading…"), !loading && filtered.length === 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '40px 24px',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: 'var(--text-sm)'
      }
    }, search ? 'No invoices match your search.' : 'No invoices yet. Create your first one.'), !loading && filtered.length > 0 && /*#__PURE__*/React.createElement("table", {
      style: {
        width: '100%',
        borderCollapse: 'collapse'
      }
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, ['Invoice', 'Client', 'Amount', 'Status', 'Due', ''].map((h, i) => /*#__PURE__*/React.createElement("th", {
      key: i,
      style: {
        textAlign: i === 2 ? 'right' : 'left',
        padding: '10px 18px',
        fontSize: 'var(--text-2xs)',
        fontWeight: 'var(--fw-bold)',
        letterSpacing: 'var(--tracking-wide)',
        textTransform: 'uppercase',
        color: 'var(--text-subtle)'
      }
    }, h)))), /*#__PURE__*/React.createElement("tbody", null, filtered.map((inv, i) => {
      const clientName = inv.clients?.name || '—';
      const isOverdue = inv.status !== 'paid' && inv.due_date && new Date(inv.due_date) < new Date();
      return /*#__PURE__*/React.createElement("tr", {
        key: inv.id || i,
        style: {
          borderTop: '1px solid var(--border-subtle)'
        }
      }, /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '11px 18px',
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-xs)',
          color: 'var(--text-body)'
        }
      }, inv.invoice_no), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '11px 18px',
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--fw-semibold)',
          color: 'var(--text-strong)'
        }
      }, clientName), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '11px 18px',
          textAlign: 'right',
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--fw-bold)',
          color: 'var(--text-strong)',
          fontVariantNumeric: 'tabular-nums'
        }
      }, fmtAmt(inv.amount)), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '11px 18px'
        }
      }, /*#__PURE__*/React.createElement("select", {
        value: inv.status,
        onChange: e => handleStatusChange(inv, e.target.value),
        style: selectStyle
      }, /*#__PURE__*/React.createElement("option", {
        value: "draft"
      }, "Draft"), /*#__PURE__*/React.createElement("option", {
        value: "sent"
      }, "Sent"), /*#__PURE__*/React.createElement("option", {
        value: "paid"
      }, "Paid"), /*#__PURE__*/React.createElement("option", {
        value: "overdue"
      }, "Overdue"), /*#__PURE__*/React.createElement("option", {
        value: "cancelled"
      }, "Cancelled"))), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '11px 18px',
          fontSize: 'var(--text-sm)',
          color: isOverdue ? 'var(--red-600)' : 'var(--text-muted)',
          fontWeight: isOverdue ? 'var(--fw-semibold)' : undefined
        }
      }, fmtDate(inv.due_date)), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '11px 18px'
        }
      }, /*#__PURE__*/React.createElement("button", {
        onClick: () => openEdit(inv),
        style: {
          display: 'inline-flex',
          alignItems: 'center',
          gap: 5,
          height: 28,
          padding: '0 10px',
          background: 'transparent',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-sm)',
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--text-xs)',
          fontWeight: 'var(--fw-semibold)',
          color: 'var(--text-muted)',
          cursor: 'pointer'
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "pencil",
        size: 12
      }), " Edit")));
    }))))), /*#__PURE__*/React.createElement(Modal, {
      open: modalOpen,
      onClose: () => setModalOpen(false),
      title: editInv ? 'Edit invoice' : 'New invoice',
      onSubmit: handleSave,
      loading: saving,
      submitLabel: editInv ? 'Save changes' : 'Create invoice'
    }, /*#__PURE__*/React.createElement("div", {
      style: FF.row2
    }, /*#__PURE__*/React.createElement(FormRow, {
      label: "Invoice #",
      required: true
    }, /*#__PURE__*/React.createElement("input", {
      style: FF.input,
      placeholder: "INV-2026-001",
      value: form.invoice_no,
      onChange: e => set('invoice_no', e.target.value)
    })), /*#__PURE__*/React.createElement(FormRow, {
      label: "Status"
    }, /*#__PURE__*/React.createElement("select", {
      style: FF.select,
      value: form.status,
      onChange: e => set('status', e.target.value)
    }, /*#__PURE__*/React.createElement("option", {
      value: "draft"
    }, "Draft"), /*#__PURE__*/React.createElement("option", {
      value: "sent"
    }, "Sent"), /*#__PURE__*/React.createElement("option", {
      value: "paid"
    }, "Paid"), /*#__PURE__*/React.createElement("option", {
      value: "overdue"
    }, "Overdue"), /*#__PURE__*/React.createElement("option", {
      value: "cancelled"
    }, "Cancelled")))), /*#__PURE__*/React.createElement(FormRow, {
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
    }, c.company || c.name)))), /*#__PURE__*/React.createElement("div", {
      style: FF.row2
    }, /*#__PURE__*/React.createElement(FormRow, {
      label: "Amount ($)"
    }, /*#__PURE__*/React.createElement("input", {
      style: FF.input,
      type: "number",
      placeholder: "0",
      value: form.amount,
      onChange: e => set('amount', e.target.value)
    })), /*#__PURE__*/React.createElement(FormRow, {
      label: "Due date"
    }, /*#__PURE__*/React.createElement("input", {
      style: FF.input,
      type: "date",
      value: form.due_date,
      onChange: e => set('due_date', e.target.value)
    })))));
  }
  Object.assign(window, {
    Finance
  });
})();