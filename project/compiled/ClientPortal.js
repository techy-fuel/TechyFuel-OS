// Client Portal screen — the client-facing view (previewed inside the agency app).
(() => {
  const {
    Card,
    Badge,
    Avatar
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
  function fmtWhen(ds) {
    if (!ds) return '';
    const diff = Math.round((Date.now() - new Date(ds)) / 3600000);
    if (diff < 1) return 'Just now';
    if (diff < 24) return diff + 'h ago';
    if (diff < 48) return 'Yesterday';
    return fmtDate(ds);
  }
  function ClientPortal() {
    const [client, setClient] = React.useState(null);
    const [project, setProject] = React.useState(null);
    const [invoice, setInvoice] = React.useState(null);
    const [files, setFiles] = React.useState([]);
    const [approvals, setApprovals] = React.useState([]);
    const [manager, setManager] = React.useState('');
    const [loading, setLoading] = React.useState(true);
    React.useEffect(() => {
      if (!window.API) {
        setLoading(false);
        return;
      }
      (async () => {
        try {
          // Load client
          const {
            data: clients
          } = await window.API.getClients();
          const c = (clients || []).find(x => x.status === 'active') || (clients || [])[0];
          if (!c) {
            setLoading(false);
            return;
          }
          setClient(c);

          // Parallel: project, invoice, files, content posts, team
          const [pRes, iRes, fRes, cRes, tRes] = await Promise.all([window.API.getProjects().catch(() => ({})), window.API.getInvoices().catch(() => ({})), window.API.getFiles({
            clientId: c.id
          }).catch(() => ({})), window.API.getContent({
            clientId: c.id
          }).catch(() => ({})), window.API.getTeam().catch(() => ({}))]);
          if (pRes.data) {
            const p = pRes.data.find(x => x.client_id === c.id) || pRes.data[0];
            if (p) setProject(p);
          }
          if (iRes.data) {
            const inv = iRes.data.find(x => x.client_id === c.id) || iRes.data[0];
            if (inv) setInvoice(inv);
          }
          if (fRes.data && fRes.data.length > 0) setFiles(fRes.data);

          // Approvals = content posts that need attention (not yet published)
          if (cRes.data) {
            const pending = cRes.data.filter(p => ['draft', 'approval', 'scheduled'].includes(p.status));
            setApprovals(pending.slice(0, 5));
          }
          if (tRes.data && tRes.data.length > 0) {
            setManager(tRes.data[0].name.split(' ')[0] + ' ' + (tRes.data[0].name.split(' ')[1]?.[0] || '') + '.');
          }
        } catch (_) {}
        setLoading(false);
      })();
    }, []);
    async function handleApprove(post) {
      if (!window.API) return;
      try {
        await window.API.updatePost(post.id, {
          status: 'published'
        });
      } catch (_) {}
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
      } catch (_) {}
      setApprovals(prev => prev.filter(p => p.id !== post.id));
    }
    const displayName = client ? client.company || client.name : '—';
    const completedMilestones = TF_MILESTONES.filter(m => m.state === 'done').length;
    const progressPct = project?.progress || Math.round(completedMilestones / TF_MILESTONES.length * 100);
    const nextMilestone = project?.due_date ? fmtDate(project.due_date) : 'On track';
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
    }, [['Project health', 'On track'], ['Next milestone', nextMilestone], manager ? ['Your manager', manager] : null].filter(Boolean).map(([k, v]) => /*#__PURE__*/React.createElement("div", {
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
    }, "Project progress", project?.name ? ` · ${project.name}` : ''), /*#__PURE__*/React.createElement(Badge, {
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
      const isPlatIcon = {
        instagram: 'instagram',
        facebook: 'facebook',
        linkedin: 'linkedin',
        youtube: 'youtube',
        twitter: 'twitter'
      };
      const icon = isPlatIcon[a.platform] || 'file-text';
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
        title: "Send back",
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
    }, files.length, " files")), files.length === 0 ? /*#__PURE__*/React.createElement("div", {
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
    }))), invoice && /*#__PURE__*/React.createElement(Card, {
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