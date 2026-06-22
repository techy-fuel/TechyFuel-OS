// Client Portal screen — the client-facing view (previewed inside the agency app).
(() => {
  const {
    Card,
    Badge,
    Avatar,
    AvatarGroup,
    ProgressBar
  } = window.TechyFuelOSDesignSystem_be0222;
  const TF_MILESTONES = [{
    label: 'Discovery & strategy',
    state: 'done'
  }, {
    label: 'Brand & creative',
    state: 'done'
  }, {
    label: 'Campaign production',
    state: 'active'
  }, {
    label: 'Launch & optimization',
    state: 'todo'
  }, {
    label: 'Reporting & handover',
    state: 'todo'
  }];
  const TF_APPROVALS = [{
    name: 'Homepage hero — v3',
    type: 'Design',
    who: 'Ali Raza',
    time: '2h ago',
    status: 'pending'
  }, {
    name: 'Launch reel — 30s cut',
    type: 'Video',
    who: 'Hina Malik',
    time: 'Yesterday',
    status: 'pending'
  }, {
    name: 'Instagram carousel set',
    type: 'Social',
    who: 'Zara Ahmed',
    time: 'Jun 18',
    status: 'approved'
  }];
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
  function fmtAmt(n) {
    if (!n && n !== 0) return '$0';
    return '$' + Number(n).toLocaleString();
  }
  function fmtDate(ds) {
    if (!ds) return '—';
    return new Date(ds).toLocaleDateString('en', {
      month: 'short',
      day: 'numeric'
    });
  }
  const FALLBACK_FILES = [{
    id: 'f1',
    name: 'Brand guidelines.pdf',
    mime_type: 'pdf',
    file_size: 4300000
  }, {
    id: 'f2',
    name: 'Launch hero.png',
    mime_type: 'image',
    file_size: 1887436
  }, {
    id: 'f3',
    name: 'Campaign reel.mp4',
    mime_type: 'video',
    file_size: 39845888
  }, {
    id: 'f4',
    name: 'Service agreement.pdf',
    mime_type: 'pdf',
    file_size: 327680
  }];
  function ClientPortal() {
    const [client, setClient] = React.useState({
      name: 'Nova Tech',
      company: 'Nova Technology Ltd'
    });
    const [project, setProject] = React.useState({
      name: 'Nova Launch Campaign',
      progress: 65,
      due_date: '2025-07-15'
    });
    const [invoice, setInvoice] = React.useState({
      invoice_no: 'INV-2025-001',
      amount: 4500,
      due_date: '2025-06-01',
      status: 'paid'
    });
    const [files, setFiles] = React.useState(FALLBACK_FILES);
    React.useEffect(() => {
      if (!window.API) return;
      window.API.getClients().then(r => {
        if (r.data && r.data.length > 0) {
          const first = r.data.find(c => c.status === 'active') || r.data[0];
          setClient(first);
          return first.id;
        }
      }).then(clientId => {
        if (!clientId) return;
        Promise.all([window.API.getProjects(), window.API.getInvoices(), window.API.getFiles({
          clientId
        })]).then(([pRes, iRes, fRes]) => {
          if (pRes.data) {
            const p = pRes.data.find(p => p.client_id === clientId) || pRes.data[0];
            if (p) setProject(p);
          }
          if (iRes.data) {
            const inv = iRes.data.find(i => i.client_id === clientId) || iRes.data[0];
            if (inv) setInvoice(inv);
          }
          if (fRes.data && fRes.data.length > 0) setFiles(fRes.data);
        }).catch(() => {});
      }).catch(() => {});
    }, []);
    const pendingApprovals = TF_APPROVALS.filter(a => a.status === 'pending').length;
    const displayName = client.company || client.name;
    const completedMilestones = TF_MILESTONES.filter(m => m.state === 'done').length;
    const progressPct = project.progress || Math.round(completedMilestones / TF_MILESTONES.length * 100);
    const nextMilestone = project.due_date ? fmtDate(project.due_date) : 'On track';
    const manager = 'Sara K.';
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
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 46,
        height: 46,
        borderRadius: 'var(--radius-xl)',
        background: 'rgba(255,255,255,0.16)',
        backdropFilter: 'blur(8px)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid rgba(255,255,255,0.25)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "panel-left-open",
      size: 22,
      style: {
        color: '#fff'
      }
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-2xs)',
        fontWeight: 'var(--fw-bold)',
        letterSpacing: 'var(--tracking-caps)',
        textTransform: 'uppercase',
        opacity: 0.85
      }
    }, "Client portal · preview"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-2xl)',
        fontWeight: 'var(--fw-extrabold)',
        letterSpacing: '-0.02em'
      }
    }, displayName, " workspace"))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 22
      }
    }, [['Project health', 'On track'], ['Next milestone', nextMilestone], ['Your manager', manager]].map(([k, v]) => /*#__PURE__*/React.createElement("div", {
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
    }, v)))))), /*#__PURE__*/React.createElement("div", {
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
    }, "Project progress · ", project.name), /*#__PURE__*/React.createElement(Badge, {
      tone: progressPct >= 80 ? 'success' : 'brand',
      dot: true
    }, progressPct, "% complete")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 8
      }
    }, TF_MILESTONES.map((m, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 9,
        position: 'relative'
      }
    }, i < TF_MILESTONES.length - 1 && /*#__PURE__*/React.createElement("div", {
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
    }, m.label))))), /*#__PURE__*/React.createElement(Card, {
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
    }, "Awaiting your approval"), /*#__PURE__*/React.createElement(Badge, {
      tone: "warning"
    }, pendingApprovals, " pending")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }
    }, TF_APPROVALS.map((a, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
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
      name: a.type === 'Video' ? 'video' : a.type === 'Social' ? 'instagram' : 'image',
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
        color: 'var(--text-strong)'
      }
    }, a.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-xs)',
        color: 'var(--text-muted)'
      }
    }, a.who, " · ", a.time)), a.status === 'approved' ? /*#__PURE__*/React.createElement(Badge, {
      tone: "success",
      dot: true
    }, "Approved") : /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("button", {
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
    }))))))), /*#__PURE__*/React.createElement("div", {
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
    }, "Shared files"), window.TFLinkBtn ? React.createElement(window.TFLinkBtn, null, 'All files') : null), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 4
      }
    }, files.slice(0, 4).map((f, i) => {
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
        }
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
      }, fmtSize(f.file_size)), /*#__PURE__*/React.createElement(Icon, {
        name: "download",
        size: 16,
        style: {
          color: 'var(--text-muted)',
          cursor: 'pointer'
        }
      }));
    }))), /*#__PURE__*/React.createElement(Card, {
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
        color: 'var(--slate-400)'
      }
    }, "Latest invoice"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-2xl)',
        fontWeight: 'var(--fw-extrabold)',
        color: '#fff',
        marginTop: 4,
        fontVariantNumeric: 'tabular-nums'
      }
    }, fmtAmt(invoice.amount)), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-xs)',
        color: 'var(--slate-400)',
        marginTop: 2
      }
    }, invoice.invoice_no, " · due ", fmtDate(invoice.due_date))), /*#__PURE__*/React.createElement("button", {
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
    }), " Download"))))));
  }
  Object.assign(window, {
    ClientPortal
  });
})();