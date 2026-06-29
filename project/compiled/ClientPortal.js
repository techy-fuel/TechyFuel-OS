// Client Portal screen — the client-facing view (previewed inside the agency app).
(() => {
  const {
    Card,
    Badge,
    Avatar
  } = window.TechyFuelOSDesignSystem_be0222;
  function mimeIcon(mime) {
    if (!mime) return {
      icon: 'file',
      tone: 'var(--slate-400)'
    };
    if (mime.includes('pdf')) return {
      icon: 'file-text',
      tone: 'var(--red-500)'
    };
    if (mime.includes('image')) return {
      icon: 'image',
      tone: 'var(--violet-500)'
    };
    if (mime.includes('video')) return {
      icon: 'video',
      tone: 'var(--blue-500)'
    };
    if (mime.includes('zip')) return {
      icon: 'folder-archive',
      tone: 'var(--amber-500)'
    };
    if (mime.includes('sheet') || mime.includes('excel') || mime.includes('csv')) return {
      icon: 'table',
      tone: 'var(--green-600)'
    };
    if (mime.includes('word') || mime.includes('doc')) return {
      icon: 'file-text',
      tone: 'var(--blue-600)'
    };
    return {
      icon: 'file',
      tone: 'var(--slate-400)'
    };
  }
  function fmtSize(bytes) {
    if (!bytes) return '—';
    if (bytes >= 1073741824) return (bytes / 1073741824).toFixed(1) + ' GB';
    if (bytes >= 1048576) return Math.round(bytes / 1048576) + ' MB';
    if (bytes >= 1024) return Math.round(bytes / 1024) + ' KB';
    return bytes + ' B';
  }
  function fmtDate(ds) {
    if (!ds) return '—';
    return new Date(ds).toLocaleDateString('en', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
  function fmtWhen(ds) {
    if (!ds) return '';
    const diff = Math.round((Date.now() - new Date(ds)) / 3600000);
    if (diff < 1) return 'Just now';
    if (diff < 24) return diff + 'h ago';
    if (diff < 48) return 'Yesterday';
    return fmtDate(ds);
  }
  function fmtAmt(n, currency) {
    if (!n && n !== 0) return '—';
    const symbols = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      AED: 'AED ',
      SAR: 'SAR ',
      PKR: '₨',
      CAD: 'CA$',
      AUD: 'A$'
    };
    return (symbols[currency] || '$') + Number(n).toLocaleString();
  }
  function getProjectHealth(tasks) {
    if (!tasks || tasks.length === 0) return {
      label: 'No tasks',
      color: 'var(--slate-400)'
    };
    const total = tasks.length;
    const done = tasks.filter(t => t.status === 'done' || t.status === 'completed').length;
    const overdue = tasks.filter(t => t.due_date && new Date(t.due_date) < new Date() && t.status !== 'done' && t.status !== 'completed').length;
    if (overdue > 0) return {
      label: 'At risk',
      color: 'var(--red-500)'
    };
    if (done / total >= 0.8) return {
      label: 'On track',
      color: 'var(--green-600)'
    };
    return {
      label: 'In progress',
      color: 'var(--amber-500)'
    };
  }
  function taskToMilestone(task) {
    if (task.status === 'done' || task.status === 'completed') return 'done';
    if (task.status === 'in_progress') return 'active';
    return 'todo';
  }
  function downloadInvoicePDF(inv, agencyName) {
    const currency = inv.currency || 'USD';
    const symbols = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      AED: 'AED ',
      SAR: 'SAR ',
      PKR: '₨',
      CAD: 'CA$',
      AUD: 'A$'
    };
    const sym = symbols[currency] || '$';
    const win = window.open('', '_blank');
    win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Invoice ${inv.invoice_no}</title>
<style>
  body { font-family: -apple-system, sans-serif; margin: 0; padding: 40px; color: #0f172a; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; }
  .logo { font-size: 22px; font-weight: 800; color: #2563eb; letter-spacing: -0.5px; }
  .badge { display: inline-block; padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: 700; text-transform: uppercase;
    background: ${inv.status === 'paid' ? '#dcfce7' : '#fef9c3'}; color: ${inv.status === 'paid' ? '#15803d' : '#92400e'}; }
  table { width: 100%; border-collapse: collapse; margin: 28px 0; }
  th { background: #f8fafc; padding: 10px 14px; text-align: left; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; }
  td { padding: 12px 14px; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
  .total-row td { border-top: 2px solid #0f172a; border-bottom: none; font-weight: 700; font-size: 16px; }
  @media print { body { padding: 20px; } }
</style></head><body>
<div class="header">
  <div>
    <div class="logo">${agencyName || 'TechyFuel OS'}</div>
    <div style="font-size:13px;color:#64748b;margin-top:4px;">Invoice</div>
  </div>
  <div style="text-align:right">
    <div style="font-size:22px;font-weight:800;">${inv.invoice_no}</div>
    <div class="badge">${inv.status || 'pending'}</div>
  </div>
</div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:32px;">
  <div>
    <div style="font-size:11px;font-weight:700;text-transform:uppercase;color:#64748b;margin-bottom:6px;">Billed to</div>
    <div style="font-weight:600;">${inv.client_name || inv.clients?.name || '—'}</div>
  </div>
  <div style="text-align:right">
    <div style="font-size:11px;font-weight:700;text-transform:uppercase;color:#64748b;margin-bottom:4px;">Due date</div>
    <div style="font-weight:600;">${fmtDate(inv.due_date)}</div>
    <div style="font-size:11px;font-weight:700;text-transform:uppercase;color:#64748b;margin-top:10px;margin-bottom:4px;">Issued</div>
    <div style="font-weight:600;">${fmtDate(inv.created_at || inv.issued_date)}</div>
  </div>
</div>
<table>
  <thead><tr><th>Description</th><th style="text-align:right">Amount</th></tr></thead>
  <tbody>
    <tr><td>Agency services — ${inv.description || inv.invoice_no}</td><td style="text-align:right">${sym}${Number(inv.amount).toLocaleString()} ${currency}</td></tr>
    <tr class="total-row"><td>Total due</td><td style="text-align:right">${sym}${Number(inv.amount).toLocaleString()} ${currency}</td></tr>
  </tbody>
</table>
<div style="margin-top:32px;padding:16px;background:#f8fafc;border-radius:8px;font-size:13px;color:#64748b;">
  Thank you for your business. For questions about this invoice, please contact your account manager.
</div>
</body></html>`);
    win.document.close();
    setTimeout(() => win.print(), 600);
  }
  function ClientPortal() {
    const [clients, setClients] = React.useState([]);
    const [clientId, setClientId] = React.useState(null);
    const [client, setClient] = React.useState(null);
    const [project, setProject] = React.useState(null);
    const [tasks, setTasks] = React.useState([]);
    const [invoice, setInvoice] = React.useState(null);
    const [files, setFiles] = React.useState([]);
    const [approvals, setApprovals] = React.useState([]);
    const [manager, setManager] = React.useState('');
    const [loading, setLoading] = React.useState(true);
    const [clientDrop, setClientDrop] = React.useState(false);
    const [notes, setNotes] = React.useState([]);
    const [noteText, setNoteText] = React.useState('');
    const [inviteLink, setInviteLink] = React.useState('');
    const [inviteCopied, setInviteCopied] = React.useState(false);
    const [showNotes, setShowNotes] = React.useState(false);

    // Load clients list
    React.useEffect(() => {
      if (!window.API) return;
      (async () => {
        try {
          const {
            data
          } = await window.API.getClients();
          if (Array.isArray(data) && data.length > 0) {
            setClients(data);
            const first = data.find(c => c.status === 'active') || data[0];
            setClientId(first.id);
          }
        } catch {}
      })();
    }, []);

    // Load data for selected client
    React.useEffect(() => {
      if (!clientId || !window.API) {
        setLoading(false);
        return;
      }
      setLoading(true);
      (async () => {
        try {
          const selected = clients.find(c => c.id === clientId);
          setClient(selected || null);
          const [pRes, iRes, fRes, cRes, tRes] = await Promise.all([window.API.getProjects().catch(() => ({})), window.API.getInvoices().catch(() => ({})), window.API.getFiles({
            clientId
          }).catch(() => ({})), window.API.getContent({
            clientId
          }).catch(() => ({})), window.API.getTeam().catch(() => ({}))]);
          let proj = null;
          if (pRes.data) {
            proj = pRes.data.find(x => x.client_id === clientId) || pRes.data[0] || null;
            setProject(proj);
          }

          // Load tasks for this project
          if (proj) {
            try {
              const {
                data: taskData
              } = await window.API.getTasks({
                projectId: proj.id
              });
              setTasks(taskData || []);
            } catch {
              setTasks([]);
            }
          } else {
            setTasks([]);
          }
          if (iRes.data) {
            const unpaid = iRes.data.find(x => x.client_id === clientId && x.status !== 'paid');
            const latest = iRes.data.find(x => x.client_id === clientId) || iRes.data[0];
            setInvoice(unpaid || latest || null);
          }
          if (fRes.data) setFiles(fRes.data);
          if (cRes.data) {
            const pending = cRes.data.filter(p => ['draft', 'approval', 'scheduled'].includes(p.status));
            setApprovals(pending.slice(0, 6));
          }
          if (tRes.data && tRes.data.length > 0) {
            const m = tRes.data[0];
            setManager(m.name);
          }

          // Load private notes
          if (window.API.getClientNotes) {
            try {
              const {
                data: notesData
              } = await window.API.getClientNotes(clientId);
              setNotes(notesData || []);
            } catch {}
          }

          // Load or generate invite link
          if (window.API.getClientInvite) {
            try {
              const {
                data: inv
              } = await window.API.getClientInvite(clientId);
              if (inv?.token) setInviteLink(`${window.location.origin}/portal?token=${inv.token}`);
            } catch {}
          }
        } catch (_) {}
        setLoading(false);
      })();
    }, [clientId, clients]);
    async function addNote() {
      if (!noteText.trim() || !clientId || !window.API?.createClientNote) return;
      try {
        const myId = localStorage.getItem('tf_chat_member');
        const {
          data
        } = await window.API.createClientNote({
          client_id: clientId,
          project_id: project?.id,
          content: noteText.trim(),
          created_by: myId || undefined
        });
        if (data) setNotes(prev => [data, ...prev]);
        setNoteText('');
      } catch {}
    }
    async function deleteNote(id) {
      if (!window.API?.deleteClientNote) return;
      try {
        await window.API.deleteClientNote(id);
        setNotes(prev => prev.filter(n => n.id !== id));
      } catch {}
    }
    async function generateInvite() {
      if (!clientId || !window.API?.createClientInvite) return;
      try {
        const {
          data
        } = await window.API.createClientInvite({
          client_id: clientId
        });
        if (data?.token) {
          const link = `${window.location.origin}/portal?token=${data.token}`;
          setInviteLink(link);
          navigator.clipboard.writeText(link).catch(() => {});
          setInviteCopied(true);
          setTimeout(() => setInviteCopied(false), 2000);
        }
      } catch {
        // Demo fallback
        const token = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
        const link = `${window.location.origin}/portal?token=${token}`;
        setInviteLink(link);
        navigator.clipboard.writeText(link).catch(() => {});
        setInviteCopied(true);
        setTimeout(() => setInviteCopied(false), 2000);
      }
    }
    async function handleApprove(post) {
      if (!window.API) return;
      try {
        await window.API.updatePost(post.id, {
          status: 'published'
        });
      } catch {}
      setApprovals(prev => prev.map(p => p.id === post.id ? {
        ...p,
        status: 'published'
      } : p));
    }
    async function handleReject(post) {
      if (!window.API) return;
      try {
        await window.API.updatePost(post.id, {
          status: 'draft'
        });
      } catch {}
      setApprovals(prev => prev.filter(p => p.id !== post.id));
    }
    function handleFileDownload(f) {
      if (f.url) {
        const a = document.createElement('a');
        a.href = f.url;
        a.download = f.name || 'file';
        a.target = '_blank';
        a.click();
      }
    }
    const agencyName = (() => {
      try {
        return JSON.parse(localStorage.getItem('tf_settings') || '{}').agencyName || '';
      } catch {
        return '';
      }
    })();
    const displayName = client ? client.company || client.name : '—';
    const health = getProjectHealth(tasks);
    const doneTasks = tasks.filter(t => t.status === 'done' || t.status === 'completed').length;
    const progressPct = tasks.length > 0 ? Math.round(doneTasks / tasks.length * 100) : project?.progress || 0;
    const milestones = tasks.slice(0, 6).map(t => ({
      label: t.title,
      state: taskToMilestone(t),
      due: t.due_date
    }));
    const nextDue = tasks.filter(t => t.due_date && t.status !== 'done' && t.status !== 'completed').sort((a, b) => new Date(a.due_date) - new Date(b.due_date))[0];
    const nextMilestone = nextDue ? fmtDate(nextDue.due_date) : project?.due_date ? fmtDate(project.due_date) : 'On track';
    const pendingCount = approvals.filter(a => a.status !== 'published').length;
    if (loading) {
      return /*#__PURE__*/React.createElement("div", {
        style: {
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-muted)',
          fontSize: 'var(--text-sm)'
        }
      }, "Loading…");
    }
    if (clients.length === 0) {
      return /*#__PURE__*/React.createElement("div", {
        style: {
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 12,
          color: 'var(--text-muted)',
          fontSize: 'var(--text-sm)'
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "users",
        size: 36,
        style: {
          opacity: 0.3
        }
      }), "No clients found. Add a client in CRM first.");
    }
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        background: 'var(--grad-brand)',
        padding: '26px 24px',
        color: '#fff'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 1100,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => setClientDrop(d => !d),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        background: 'rgba(255,255,255,0.16)',
        border: '1px solid rgba(255,255,255,0.25)',
        borderRadius: 'var(--radius-xl)',
        padding: '8px 14px',
        cursor: 'pointer',
        color: '#fff'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 32,
        height: 32,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.2)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontSize: 14
      }
    }, displayName.charAt(0).toUpperCase()), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'left'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-2xs)',
        fontWeight: 'var(--fw-bold)',
        letterSpacing: 'var(--tracking-caps)',
        textTransform: 'uppercase',
        opacity: 0.8
      }
    }, "Client portal · preview"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-xl)',
        fontWeight: 'var(--fw-extrabold)',
        letterSpacing: '-0.02em'
      }
    }, displayName)), /*#__PURE__*/React.createElement(Icon, {
      name: "chevrons-up-down",
      size: 16,
      style: {
        opacity: 0.7,
        marginLeft: 4
      }
    })), clientDrop && /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 'calc(100% + 8px)',
        left: 0,
        zIndex: 200,
        background: 'var(--slate-0)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-xl)',
        minWidth: 220,
        overflow: 'hidden'
      },
      onClick: () => setClientDrop(false)
    }, clients.map(c => /*#__PURE__*/React.createElement("div", {
      key: c.id,
      onClick: () => setClientId(c.id),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 14px',
        cursor: 'pointer',
        background: c.id === clientId ? 'var(--blue-50)' : 'transparent',
        color: c.id === clientId ? 'var(--blue-700)' : 'var(--text-body)',
        fontSize: 'var(--text-sm)',
        fontWeight: c.id === clientId ? 'var(--fw-semibold)' : 'var(--fw-medium)'
      },
      onMouseEnter: e => {
        if (c.id !== clientId) e.currentTarget.style.background = 'var(--slate-50)';
      },
      onMouseLeave: e => {
        if (c.id !== clientId) e.currentTarget.style.background = 'transparent';
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: c.company || c.name,
      size: "xs"
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", null, c.company || c.name), c.email && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-xs)',
        color: 'var(--text-muted)'
      }
    }, c.email))))))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 28
      }
    }, [['Project health', health.label], ['Next deadline', nextMilestone], manager ? ['Account manager', manager.split(' ')[0]] : null].filter(Boolean).map(([k, v]) => /*#__PURE__*/React.createElement("div", {
      key: k
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-2xs)',
        textTransform: 'uppercase',
        letterSpacing: 'var(--tracking-wide)',
        opacity: 0.8
      }
    }, k), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-md)',
        fontWeight: 'var(--fw-bold)'
      }
    }, v)))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => setShowNotes(n => !n),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '7px 14px',
        background: 'rgba(255,255,255,0.15)',
        border: '1px solid rgba(255,255,255,0.3)',
        borderRadius: 8,
        color: 'white',
        cursor: 'pointer',
        fontSize: 13,
        fontWeight: 600,
        fontFamily: 'var(--font-sans)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "lock",
      size: 13
    }), " Private Notes ", notes.length > 0 && `(${notes.length})`), /*#__PURE__*/React.createElement("button", {
      onClick: inviteLink ? () => {
        navigator.clipboard.writeText(inviteLink).catch(() => {});
        setInviteCopied(true);
        setTimeout(() => setInviteCopied(false), 2000);
      } : generateInvite,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '7px 14px',
        background: 'rgba(255,255,255,0.95)',
        border: 'none',
        borderRadius: 8,
        color: '#1d4ed8',
        cursor: 'pointer',
        fontSize: 13,
        fontWeight: 700,
        fontFamily: 'var(--font-sans)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: inviteCopied ? 'check' : 'link',
      size: 13
    }), inviteCopied ? 'Link copied!' : inviteLink ? 'Copy invite link' : 'Invite client'))))), /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 1100,
        margin: '0 auto',
        padding: 24,
        display: 'grid',
        gridTemplateColumns: '1.5fr 1fr',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement(Card, {
      padding: "lg",
      style: {
        gridColumn: '1 / -1'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 18
      }
    }, /*#__PURE__*/React.createElement("h3", {
      style: {
        fontSize: 'var(--text-lg)',
        fontWeight: 'var(--fw-bold)'
      }
    }, "Project progress", project?.name ? ` · ${project.name}` : ''), /*#__PURE__*/React.createElement(Badge, {
      tone: progressPct >= 80 ? 'success' : 'brand',
      dot: true
    }, progressPct, "% complete")), milestones.length === 0 ? /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '24px 0',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: 'var(--text-sm)'
      }
    }, "No tasks assigned to this project yet.") : /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 8
      }
    }, milestones.map((m, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 9,
        position: 'relative'
      }
    }, i < milestones.length - 1 && /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 15,
        left: '50%',
        width: '100%',
        height: 2,
        background: m.state === 'done' ? 'var(--blue-500)' : 'var(--border-default)'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'relative',
        zIndex: 1,
        width: 32,
        height: 32,
        borderRadius: '50%',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: m.state === 'done' ? 'var(--blue-600)' : m.state === 'active' ? 'var(--slate-0)' : 'var(--slate-100)',
        border: m.state === 'active' ? '2px solid var(--blue-600)' : '2px solid transparent',
        color: m.state === 'done' ? '#fff' : m.state === 'active' ? 'var(--blue-600)' : 'var(--text-subtle)'
      }
    }, m.state === 'done' ? /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 16
    }) : m.state === 'active' ? /*#__PURE__*/React.createElement("span", {
      style: {
        width: 9,
        height: 9,
        borderRadius: '50%',
        background: 'var(--blue-600)'
      }
    }) : /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        fontWeight: 700
      }
    }, i + 1)), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-xs)',
        fontWeight: m.state === 'active' ? 'var(--fw-bold)' : 'var(--fw-medium)',
        color: m.state === 'todo' ? 'var(--text-subtle)' : 'var(--text-strong)',
        textAlign: 'center',
        lineHeight: 1.3
      }
    }, m.label), m.due && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10,
        color: 'var(--text-subtle)'
      }
    }, fmtDate(m.due))))), milestones.length > 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 20,
        height: 6,
        background: 'var(--slate-100)',
        borderRadius: 99,
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: '100%',
        width: progressPct + '%',
        background: 'var(--blue-600)',
        borderRadius: 99,
        transition: 'width 0.4s ease'
      }
    }))), /*#__PURE__*/React.createElement(Card, {
      padding: "lg"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement("h3", {
      style: {
        fontSize: 'var(--text-lg)',
        fontWeight: 'var(--fw-bold)'
      }
    }, "Awaiting your approval"), pendingCount > 0 && /*#__PURE__*/React.createElement(Badge, {
      tone: "warning"
    }, pendingCount, " pending")), approvals.length === 0 ? /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '32px 0',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: 'var(--text-sm)'
      }
    }, "No content awaiting approval") : /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }
    }, approvals.map((a, i) => {
      const platIcons = {
        instagram: 'instagram',
        facebook: 'facebook',
        linkedin: 'linkedin',
        youtube: 'youtube',
        twitter: 'twitter'
      };
      const icon = platIcons[a.platform] || 'file-text';
      const isPublished = a.status === 'published';
      const assigneeName = a.team_members?.name || '';
      return /*#__PURE__*/React.createElement("div", {
        key: a.id || i,
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: 12,
          background: 'var(--slate-50)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)'
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          width: 38,
          height: 38,
          flex: 'none',
          borderRadius: 'var(--radius-md)',
          background: 'var(--slate-0)',
          border: '1px solid var(--border-subtle)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-muted)'
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: icon,
        size: 18
      })), /*#__PURE__*/React.createElement("div", {
        style: {
          flex: 1,
          minWidth: 0
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--fw-semibold)',
          color: 'var(--text-strong)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }
      }, a.title), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 'var(--text-xs)',
          color: 'var(--text-muted)'
        }
      }, assigneeName ? assigneeName + ' · ' : '', fmtWhen(a.created_at))), isPublished ? /*#__PURE__*/React.createElement(Badge, {
        tone: "success",
        dot: true
      }, "Approved") : /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          gap: 6
        }
      }, /*#__PURE__*/React.createElement("button", {
        onClick: () => handleApprove(a),
        title: "Approve",
        style: {
          width: 32,
          height: 32,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--green-600)',
          color: '#fff',
          border: 'none',
          borderRadius: 'var(--radius-md)',
          cursor: 'pointer'
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "check",
        size: 16
      })), /*#__PURE__*/React.createElement("button", {
        onClick: () => handleReject(a),
        title: "Send back for revision",
        style: {
          width: 32,
          height: 32,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--slate-0)',
          color: 'var(--text-muted)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-md)',
          cursor: 'pointer'
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "rotate-ccw",
        size: 15
      }))));
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement(Card, {
      padding: "lg"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement("h3", {
      style: {
        fontSize: 'var(--text-lg)',
        fontWeight: 'var(--fw-bold)'
      }
    }, "Shared files"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-xs)',
        color: 'var(--text-muted)'
      }
    }, files.length, " file", files.length !== 1 ? 's' : '')), files.length === 0 ? /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '20px 0',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: 'var(--text-sm)'
      }
    }, "No files shared yet") : /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 4
      }
    }, files.slice(0, 5).map((f, i) => {
      const {
        icon,
        tone
      } = mimeIcon(f.mime_type);
      return /*#__PURE__*/React.createElement("div", {
        key: f.id || i,
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 11,
          padding: '8px 6px',
          borderRadius: 'var(--radius-md)'
        },
        onMouseEnter: e => e.currentTarget.style.background = 'var(--slate-50)',
        onMouseLeave: e => e.currentTarget.style.background = 'transparent'
      }, /*#__PURE__*/React.createElement(Icon, {
        name: icon,
        size: 18,
        style: {
          color: tone,
          flex: 'none'
        }
      }), /*#__PURE__*/React.createElement("span", {
        style: {
          flex: 1,
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--fw-medium)',
          color: 'var(--text-strong)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }
      }, f.name), /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 'var(--text-xs)',
          color: 'var(--text-subtle)'
        }
      }, fmtSize(f.file_size)), /*#__PURE__*/React.createElement("button", {
        onClick: () => handleFileDownload(f),
        title: f.url ? 'Download' : 'No URL available',
        style: {
          background: 'none',
          border: 'none',
          cursor: f.url ? 'pointer' : 'default',
          padding: 4,
          color: f.url ? 'var(--blue-600)' : 'var(--text-subtle)',
          display: 'inline-flex'
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "download",
        size: 16
      })));
    }), files.length > 5 && /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'center',
        paddingTop: 6,
        fontSize: 'var(--text-xs)',
        color: 'var(--text-muted)'
      }
    }, "+", files.length - 5, " more files"))), invoice && /*#__PURE__*/React.createElement(Card, {
      padding: "lg",
      style: {
        background: 'var(--slate-900)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-2xs)',
        fontWeight: 'var(--fw-bold)',
        letterSpacing: 'var(--tracking-caps)',
        textTransform: 'uppercase',
        color: 'var(--slate-400)',
        marginBottom: 4
      }
    }, invoice.status === 'paid' ? 'Latest invoice (paid)' : 'Invoice due'), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-2xl)',
        fontWeight: 'var(--fw-extrabold)',
        color: '#fff',
        fontVariantNumeric: 'tabular-nums'
      }
    }, fmtAmt(invoice.amount, invoice.currency)), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-xs)',
        color: 'var(--slate-400)',
        marginTop: 4
      }
    }, invoice.invoice_no, " · due ", fmtDate(invoice.due_date))), /*#__PURE__*/React.createElement("button", {
      onClick: () => downloadInvoicePDF(invoice, agencyName),
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        height: 38,
        padding: '0 16px',
        background: '#fff',
        color: 'var(--slate-900)',
        border: 'none',
        borderRadius: 'var(--radius-md)',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-bold)',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "download",
      size: 16
    }), " Download PDF"))))), showNotes && /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: 380,
        background: 'white',
        borderLeft: '1px solid var(--slate-200)',
        boxShadow: '-4px 0 24px rgba(0,0,0,0.1)',
        zIndex: 500,
        display: 'flex',
        flexDirection: 'column'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '16px 20px',
        borderBottom: '1px solid var(--slate-200)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#fffbeb'
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 7,
        fontSize: 15,
        fontWeight: 700
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "lock",
      size: 15,
      style: {
        color: '#92400e'
      }
    }), "Private Notes"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 12,
        color: '#92400e',
        margin: '2px 0 0',
        fontWeight: 500
      }
    }, "Hidden from client · visible to team only")), /*#__PURE__*/React.createElement("button", {
      onClick: () => setShowNotes(false),
      style: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: 'var(--text-muted)',
        padding: 4
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "x",
      size: 18
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        overflowY: 'auto',
        padding: 16
      }
    }, notes.length === 0 && /*#__PURE__*/React.createElement("p", {
      style: {
        color: 'var(--text-muted)',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 32
      }
    }, "No private notes yet.", /*#__PURE__*/React.createElement("br", null), "Add internal context, warnings, or strategy notes here."), notes.map(n => /*#__PURE__*/React.createElement("div", {
      key: n.id,
      style: {
        padding: '12px 14px',
        background: '#fffbeb',
        border: '1px solid #fde68a',
        borderRadius: 10,
        marginBottom: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 14,
        margin: 0,
        lineHeight: 1.6,
        color: '#1c1917',
        flex: 1
      }
    }, n.content), /*#__PURE__*/React.createElement("button", {
      onClick: () => deleteNote(n.id),
      style: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: 'var(--text-muted)',
        padding: '0 2px',
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "trash-2",
      size: 13
    }))), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 11,
        color: '#92400e',
        margin: '6px 0 0',
        fontWeight: 500
      }
    }, n.team_members?.name || 'Team', " · ", new Date(n.created_at).toLocaleDateString())))), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '14px 16px',
        borderTop: '1px solid var(--slate-200)'
      }
    }, /*#__PURE__*/React.createElement("textarea", {
      value: noteText,
      onChange: e => setNoteText(e.target.value),
      placeholder: "Write a private note for your team...",
      rows: 3,
      style: {
        width: '100%',
        padding: '10px 12px',
        border: '1px solid var(--slate-200)',
        borderRadius: 9,
        fontSize: 14,
        fontFamily: 'var(--font-sans)',
        outline: 'none',
        resize: 'none',
        boxSizing: 'border-box',
        marginBottom: 8
      },
      onKeyDown: e => {
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) addNote();
      }
    }), /*#__PURE__*/React.createElement("button", {
      onClick: addNote,
      style: {
        width: '100%',
        padding: '9px 0',
        background: '#d97706',
        color: 'white',
        border: 'none',
        borderRadius: 8,
        cursor: 'pointer',
        fontSize: 14,
        fontWeight: 700,
        fontFamily: 'var(--font-sans)'
      }
    }, "Add Note"))));
  }
  Object.assign(window, {
    ClientPortal
  });
})();