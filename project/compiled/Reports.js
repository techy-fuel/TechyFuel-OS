// Reports center screen — all 6 reports generate from real Supabase data.
(() => {
  const {
    Card,
    Badge
  } = window.TechyFuelOSDesignSystem_be0222;
  const REPORTS = [{
    id: 'clients',
    name: 'Client performance report',
    desc: 'Per-client retainer, deliverables & satisfaction',
    icon: 'users',
    tone: ['var(--blue-50)', 'var(--blue-600)'],
    runs: 'Auto · monthly'
  }, {
    id: 'team',
    name: 'Team productivity report',
    desc: 'Tasks completed, hours logged and time by task per member',
    icon: 'gauge',
    tone: ['var(--violet-50)', 'var(--violet-600)'],
    runs: 'Auto · weekly'
  }, {
    id: 'revenue',
    name: 'Revenue & profit report',
    desc: 'MRR, net profit, expenses and forecast',
    icon: 'trending-up',
    tone: ['var(--green-50)', 'var(--green-600)'],
    runs: 'Auto · monthly'
  }, {
    id: 'ads',
    name: 'Ads performance report',
    desc: 'Spend, ROAS, CPL and leads across ad accounts',
    icon: 'megaphone',
    tone: ['var(--amber-50)', 'var(--amber-600)'],
    runs: 'Manual'
  }, {
    id: 'projects',
    name: 'Project status report',
    desc: 'Milestones, budget burn and risk flags',
    icon: 'folder-kanban',
    tone: ['var(--teal-50)', 'var(--teal-600)'],
    runs: 'Auto · weekly'
  }, {
    id: 'content',
    name: 'Content engagement report',
    desc: 'Reach, engagement and best-performing posts',
    icon: 'heart',
    tone: ['var(--red-50)', 'var(--red-600)'],
    runs: 'Manual'
  }];
  function fmtDate(ds) {
    if (!ds) return '—';
    return new Date(ds).toLocaleDateString('en', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
  function fmtAmt(n, currency) {
    const syms = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      PKR: '₨',
      AED: 'AED ',
      SAR: 'SAR ',
      CAD: 'CA$',
      AUD: 'A$'
    };
    return (syms[currency || 'PKR'] || '₨') + Number(n || 0).toLocaleString();
  }
  function getSaved() {
    try {
      return JSON.parse(localStorage.getItem('tf_settings') || '{}');
    } catch {
      return {};
    }
  }

  // Home/reporting currency is PKR — every invoice total in these reports
  // converts through live FX rates before summing, same as the Finance screen.
  function toPKR(amount, currency, rates) {
    const n = Number(amount);
    if (!n) return 0;
    if (!currency || currency === 'PKR') return n;
    if (!rates) return 0;
    const usd = currency === 'USD' ? n : rates[currency] ? n / rates[currency] : null;
    if (usd === null) return 0;
    return rates.PKR ? usd * rates.PKR : 0;
  }

  /* ── PDF print window ──────────────────────────────────────────── */
  function openPDF(title, bodyHtml) {
    const agency = getSaved().agencyName || 'TechyFuel OS';
    const date = new Date().toLocaleDateString('en', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/>
<title>${title}</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#0f172a;background:#fff;padding:40px}
  .rh{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:28px;padding-bottom:18px;border-bottom:2px solid #0f172a}
  .ag{font-size:18px;font-weight:800;color:#1e40af}
  .dt{font-size:11px;color:#94a3b8;margin-top:3px}
  .rt{font-size:20px;font-weight:900;letter-spacing:-0.02em;text-align:right}
  .grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:22px}
  .box{padding:14px;background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0}
  .box label{display:block;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:#94a3b8;margin-bottom:5px}
  .box .v{font-size:20px;font-weight:800;color:#0f172a}
  table{width:100%;border-collapse:collapse}
  th{text-align:left;padding:9px 12px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:#64748b;background:#f8fafc;border-bottom:1px solid #e2e8f0}
  td{padding:10px 12px;font-size:13px;color:#334155;border-bottom:1px solid #f1f5f9}
  .r{text-align:right}
  .b{display:inline-block;padding:2px 8px;border-radius:20px;font-size:11px;font-weight:600}
  .bs{background:#dcfce7;color:#16a34a} .bw{background:#fef9c3;color:#ca8a04}
  .bd{background:#fee2e2;color:#dc2626} .bn{background:#f1f5f9;color:#64748b}
  .ft{margin-top:36px;padding-top:14px;border-top:1px solid #e2e8f0;display:flex;justify-content:space-between;font-size:11px;color:#94a3b8}
  @media print{body{padding:20px}@page{margin:10mm}}
</style></head><body>
<div class="rh">
  <div><div class="ag">${agency}</div><div class="dt">Generated ${date}</div></div>
  <div class="rt">${title}</div>
</div>
${bodyHtml}
<div class="ft"><span>${agency}</span><span>${date}</span></div>
<script>window.onload=function(){window.print()};<\/script>
</body></html>`;
    const w = window.open('', '_blank', 'width=960,height=720');
    if (w) {
      w.document.write(html);
      w.document.close();
    }
  }

  /* ── CSV download ──────────────────────────────────────────────── */
  function downloadCSV(filename, headers, rows) {
    const csv = [headers, ...rows].map(r => r.map(c => `"${String(c ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const a = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(new Blob([csv], {
        type: 'text/csv'
      })),
      download: filename
    });
    a.click();
    URL.revokeObjectURL(a.href);
  }

  /* ── Report data fetchers ──────────────────────────────────────── */
  async function runClients(fmt) {
    const [cr, pr, ir, fx] = await Promise.all([window.API.getClients(), window.API.getProjects(), window.API.getInvoices(), window.API.getFxRates().catch(() => null)]);
    const clients = cr.data || [],
      projects = pr.data || [],
      invoices = ir.data || [];
    const rates = fx && fx.rates;
    const rows = clients.map(c => {
      const paid = invoices.filter(i => i.client_id === c.id && i.status === 'paid').reduce((s, i) => s + toPKR(i.amount, i.currency, rates), 0);
      return {
        name: c.company || c.name,
        status: c.status || 'active',
        proj: projects.filter(p => p.client_id === c.id).length,
        inv: invoices.filter(i => i.client_id === c.id).length,
        paid
      };
    });
    if (fmt === 'csv') return downloadCSV('client-performance.csv', ['Client', 'Status', 'Projects', 'Invoices', 'Paid Revenue (PKR)'], rows.map(r => [r.name, r.status, r.proj, r.inv, r.paid]));
    const sc = {
      active: 'bs',
      inactive: 'bn',
      churned: 'bd'
    };
    const totalInvoicedPKR = invoices.reduce((s, i) => s + toPKR(i.amount, i.currency, rates), 0);
    openPDF('Client Performance Report', `<div class="grid">
      <div class="box"><label>Clients</label><div class="v">${clients.length}</div></div>
      <div class="box"><label>Active</label><div class="v">${clients.filter(c => c.status === 'active').length}</div></div>
      <div class="box"><label>Projects</label><div class="v">${projects.length}</div></div>
      <div class="box"><label>Total invoiced (PKR)</label><div class="v">₨${Math.round(totalInvoicedPKR).toLocaleString()}</div></div>
    </div>
    <table><thead><tr><th>Client</th><th>Status</th><th class="r">Projects</th><th class="r">Invoices</th><th class="r">Paid Revenue (PKR)</th></tr></thead><tbody>
    ${rows.map(r => `<tr><td>${r.name}</td><td><span class="b ${sc[r.status] || 'bn'}">${r.status}</span></td><td class="r">${r.proj}</td><td class="r">${r.inv}</td><td class="r">₨${Math.round(r.paid).toLocaleString()}</td></tr>`).join('')}
    </tbody></table>`);
  }
  function fmtHours(totalSeconds) {
    if (!totalSeconds) return '0h';
    const h = totalSeconds / 3600;
    return h < 1 ? Math.round(totalSeconds / 60) + 'm' : h.toFixed(1) + 'h';
  }
  async function runTeam(fmt) {
    const [tr, tkr, ter] = await Promise.all([window.API.getTeam(), window.API.getTasks(), window.API.getAllTimeEntries ? window.API.getAllTimeEntries() : Promise.resolve({
      data: []
    })]);
    const team = tr.data || [],
      tasks = tkr.data || [],
      entries = ter.data || [];
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const isThisMonth = e => new Date(e.started_at) >= monthStart;
    const rows = team.map(m => {
      const mt = tasks.filter(t => t.assigned_to === m.id);
      const done = mt.filter(t => t.status === 'done').length;
      const rate = mt.length > 0 ? Math.round(done / mt.length * 100) : 0;
      const myEntries = entries.filter(e => e.member_id === m.id);
      const secondsAllTime = myEntries.reduce((s, e) => s + (e.duration_seconds || 0), 0);
      const secondsThisMonth = myEntries.filter(isThisMonth).reduce((s, e) => s + (e.duration_seconds || 0), 0);
      return {
        name: m.name,
        role: m.role || '—',
        total: mt.length,
        done,
        open: mt.length - done,
        rate,
        secondsAllTime,
        secondsThisMonth
      };
    });

    // Per-task time breakdown (this month) -- lets a member's total be
    // traced back to exactly which tasks it came from, not just a lump sum.
    const taskSeconds = {};
    entries.filter(isThisMonth).forEach(e => {
      const key = e.task_id;
      if (!taskSeconds[key]) taskSeconds[key] = {
        title: e.tasks?.title || '(deleted task)',
        status: e.tasks?.status || '—',
        member: e.team_members?.name || '—',
        seconds: 0
      };
      taskSeconds[key].seconds += e.duration_seconds || 0;
    });
    const taskRows = Object.values(taskSeconds).sort((a, b) => a.member.localeCompare(b.member) || b.seconds - a.seconds);
    if (fmt === 'csv') {
      return downloadCSV('team-productivity.csv', ['Name', 'Role', 'Total Tasks', 'Done', 'Open', 'Completion %', 'Hours (this month)', 'Hours (all time)'], rows.map(r => [r.name, r.role, r.total, r.done, r.open, r.rate + '%', (r.secondsThisMonth / 3600).toFixed(2), (r.secondsAllTime / 3600).toFixed(2)]));
    }
    openPDF('Team Productivity Report', `<table><thead><tr><th>Name</th><th>Role</th><th class="r">Total</th><th class="r">Done</th><th class="r">Open</th><th class="r">Completion</th><th class="r">Hours (month)</th><th class="r">Hours (all time)</th></tr></thead><tbody>
    ${rows.map(r => `<tr><td>${r.name}</td><td>${r.role}</td><td class="r">${r.total}</td><td class="r">${r.done}</td><td class="r">${r.open}</td><td class="r">${r.rate}%</td><td class="r">${fmtHours(r.secondsThisMonth)}</td><td class="r">${fmtHours(r.secondsAllTime)}</td></tr>`).join('')}
    </tbody></table>
    <br/><br/>
    <div style="font-size:14px;font-weight:800;margin-bottom:10px;">Time logged by task — this month</div>
    ${taskRows.length === 0 ? '<div style="font-size:13px;color:#94a3b8;">No time logged yet this month.</div>' : `
    <table><thead><tr><th>Task</th><th>Member</th><th>Status</th><th class="r">Time logged</th></tr></thead><tbody>
    ${taskRows.map(t => `<tr><td>${t.title}</td><td>${t.member}</td><td>${t.status}</td><td class="r">${fmtHours(t.seconds)}</td></tr>`).join('')}
    </tbody></table>`}`);
  }
  async function runRevenue(fmt) {
    const [ir, fx] = await Promise.all([window.API.getInvoices(), window.API.getFxRates().catch(() => null)]);
    const invoices = ir.data || [];
    const rates = fx && fx.rates;
    const totalInvoicedPKR = invoices.reduce((s, i) => s + toPKR(i.amount, i.currency, rates), 0);
    const paid = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + toPKR(i.amount, i.currency, rates), 0);
    const outstanding = invoices.filter(i => ['sent', 'overdue'].includes(i.status)).reduce((s, i) => s + toPKR(i.amount, i.currency, rates), 0);
    if (fmt === 'csv') return downloadCSV('revenue-report.csv', ['Invoice #', 'Client', 'Amount', 'Currency', 'Amount (PKR)', 'Status', 'Due Date'], invoices.map(i => [i.invoice_no, i.clients?.name || '—', i.amount || 0, i.currency || 'PKR', Math.round(toPKR(i.amount, i.currency, rates)), i.status, i.due_date || '']));
    const sc = {
      paid: 'bs',
      sent: 'bn',
      overdue: 'bd',
      draft: 'bn',
      cancelled: 'bn'
    };
    openPDF('Revenue & Profit Report', `<div class="grid">
      <div class="box"><label>Total Invoiced (PKR)</label><div class="v">₨${Math.round(totalInvoicedPKR).toLocaleString()}</div></div>
      <div class="box"><label>Paid Revenue (PKR)</label><div class="v">₨${Math.round(paid).toLocaleString()}</div></div>
      <div class="box"><label>Outstanding (PKR)</label><div class="v">₨${Math.round(outstanding).toLocaleString()}</div></div>
      <div class="box"><label>Invoices</label><div class="v">${invoices.length}</div></div>
    </div>
    <table><thead><tr><th>Invoice #</th><th>Client</th><th class="r">Amount</th><th>Status</th><th>Due Date</th></tr></thead><tbody>
    ${invoices.map(i => `<tr><td>${i.invoice_no}</td><td>${i.clients?.name || '—'}</td><td class="r">${fmtAmt(i.amount, i.currency)}</td><td><span class="b ${sc[i.status] || 'bn'}">${i.status}</span></td><td>${fmtDate(i.due_date)}</td></tr>`).join('')}
    </tbody></table>`);
  }
  async function runAds(fmt) {
    const r = await window.API.getAdCampaigns();
    const camps = r.data || [];
    const totalSpend = camps.reduce((s, c) => s + (c.spent || 0), 0);
    const totalLeads = camps.reduce((s, c) => s + (c.conversions || 0), 0);
    if (fmt === 'csv') return downloadCSV('ads-performance.csv', ['Campaign', 'Client', 'Platform', 'Status', 'Spend', 'Impressions', 'Clicks', 'Conversions', 'CPL'], camps.map(c => [c.name, c.clients?.name || '—', c.platform, c.status, c.spent || 0, c.impressions || 0, c.clicks || 0, c.conversions || 0, c.conversions > 0 ? '$' + (c.spent / c.conversions).toFixed(2) : '—']));
    const sc = {
      active: 'bs',
      review: 'bw',
      paused: 'bn',
      ended: 'bn',
      draft: 'bn'
    };
    openPDF('Ads Performance Report', `<div class="grid">
      <div class="box"><label>Total Spend</label><div class="v">$${totalSpend.toLocaleString()}</div></div>
      <div class="box"><label>Campaigns</label><div class="v">${camps.length}</div></div>
      <div class="box"><label>Total Leads</label><div class="v">${totalLeads}</div></div>
      <div class="box"><label>Avg CPL</label><div class="v">${totalLeads > 0 ? '$' + (totalSpend / totalLeads).toFixed(2) : '—'}</div></div>
    </div>
    <table><thead><tr><th>Campaign</th><th>Client</th><th>Platform</th><th>Status</th><th class="r">Spend</th><th class="r">Impressions</th><th class="r">Clicks</th><th class="r">Leads</th><th class="r">CPL</th></tr></thead><tbody>
    ${camps.map(c => `<tr><td>${c.name}</td><td>${c.clients?.name || '—'}</td><td>${c.platform || '—'}</td><td><span class="b ${sc[c.status] || 'bn'}">${c.status}</span></td><td class="r">$${(c.spent || 0).toLocaleString()}</td><td class="r">${(c.impressions || 0).toLocaleString()}</td><td class="r">${(c.clicks || 0).toLocaleString()}</td><td class="r">${c.conversions || 0}</td><td class="r">${c.conversions > 0 ? '$' + (c.spent / c.conversions).toFixed(2) : '—'}</td></tr>`).join('')}
    </tbody></table>`);
  }
  async function runProjects(fmt) {
    const [pr, tr] = await Promise.all([window.API.getProjects(), window.API.getTasks()]);
    const projects = pr.data || [],
      tasks = tr.data || [];
    const rows = projects.map(p => {
      const pt = tasks.filter(t => t.project_id === p.id);
      const done = pt.filter(t => t.status === 'done').length;
      return {
        name: p.name,
        client: p.clients?.name || '—',
        status: p.status,
        total: pt.length,
        done,
        pct: pt.length > 0 ? Math.round(done / pt.length * 100) : 0
      };
    });
    if (fmt === 'csv') return downloadCSV('project-status.csv', ['Project', 'Client', 'Status', 'Tasks', 'Done', 'Progress %'], rows.map(r => [r.name, r.client, r.status, r.total, r.done, r.pct + '%']));
    const sc = {
      active: 'bs',
      completed: 'bs',
      paused: 'bw',
      cancelled: 'bd',
      draft: 'bn'
    };
    openPDF('Project Status Report', `<table><thead><tr><th>Project</th><th>Client</th><th>Status</th><th class="r">Tasks</th><th class="r">Done</th><th class="r">Progress</th></tr></thead><tbody>
    ${rows.map(r => `<tr><td>${r.name}</td><td>${r.client}</td><td><span class="b ${sc[r.status] || 'bn'}">${r.status}</span></td><td class="r">${r.total}</td><td class="r">${r.done}</td><td class="r">${r.pct}%</td></tr>`).join('')}
    </tbody></table>`);
  }
  async function runContent(fmt) {
    const r = await window.API.getContent();
    const posts = r.data || [];
    const rows = posts.map(p => ({
      title: (p.title || p.caption || '').slice(0, 50) || '—',
      client: p.clients?.name || '—',
      platform: p.platform || '—',
      status: p.status || '—',
      scheduled: p.scheduled_at ? fmtDate(p.scheduled_at) : '—'
    }));
    if (fmt === 'csv') return downloadCSV('content-engagement.csv', ['Title', 'Client', 'Platform', 'Status', 'Scheduled'], rows.map(r => [r.title, r.client, r.platform, r.status, r.scheduled]));
    const sc = {
      published: 'bs',
      scheduled: 'bn',
      draft: 'bn',
      approval: 'bw'
    };
    openPDF('Content Engagement Report', `<div class="grid">
      <div class="box"><label>Total Posts</label><div class="v">${posts.length}</div></div>
      <div class="box"><label>Published</label><div class="v">${posts.filter(p => p.status === 'published').length}</div></div>
      <div class="box"><label>Scheduled</label><div class="v">${posts.filter(p => p.status === 'scheduled').length}</div></div>
      <div class="box"><label>Draft</label><div class="v">${posts.filter(p => p.status === 'draft').length}</div></div>
    </div>
    <table><thead><tr><th>Title / Caption</th><th>Client</th><th>Platform</th><th>Status</th><th>Scheduled</th></tr></thead><tbody>
    ${rows.map(r => `<tr><td>${r.title}</td><td>${r.client}</td><td>${r.platform}</td><td><span class="b ${sc[r.status] || 'bn'}">${r.status}</span></td><td>${r.scheduled}</td></tr>`).join('')}
    </tbody></table>`);
  }
  const RUNNERS = {
    clients: runClients,
    team: runTeam,
    revenue: runRevenue,
    ads: runAds,
    projects: runProjects,
    content: runContent
  };

  /* ── Report card ──────────────────────────────────────────────── */
  function ReportCard({
    report
  }) {
    const [loading, setLoading] = React.useState(null);
    async function run(fmt) {
      if (!window.API) return;
      setLoading(fmt);
      try {
        await RUNNERS[report.id](fmt);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(null);
      }
    }
    const btnBase = {
      flex: 1,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      height: 32,
      background: 'var(--slate-0)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-md)',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-xs)',
      fontWeight: 'var(--fw-semibold)',
      color: 'var(--text-body)',
      cursor: 'pointer'
    };
    return /*#__PURE__*/React.createElement(Card, {
      padding: "md",
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 42,
        height: 42,
        borderRadius: 'var(--radius-lg)',
        background: report.tone[0],
        color: report.tone[1],
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: report.icon,
      size: 21
    })), /*#__PURE__*/React.createElement(Badge, {
      tone: report.runs === 'Manual' ? 'neutral' : 'success',
      size: "sm"
    }, report.runs)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-md)',
        fontWeight: 'var(--fw-bold)',
        color: 'var(--text-strong)'
      }
    }, report.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-xs)',
        color: 'var(--text-muted)',
        marginTop: 4,
        lineHeight: 1.45
      }
    }, report.desc)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        paddingTop: 12,
        borderTop: '1px solid var(--border-subtle)'
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => run('pdf'),
      disabled: !!loading,
      style: {
        ...btnBase,
        opacity: loading && loading !== 'pdf' ? 0.5 : 1,
        cursor: loading ? 'wait' : 'pointer'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: loading === 'pdf' ? 'loader' : 'file-text',
      size: 14,
      style: {
        color: 'var(--red-500)'
      }
    }), loading === 'pdf' ? 'Generating…' : 'PDF'), /*#__PURE__*/React.createElement("button", {
      onClick: () => run('csv'),
      disabled: !!loading,
      style: {
        ...btnBase,
        opacity: loading && loading !== 'csv' ? 0.5 : 1,
        cursor: loading ? 'wait' : 'pointer'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: loading === 'csv' ? 'loader' : 'sheet',
      size: 14,
      style: {
        color: 'var(--green-600)'
      }
    }), loading === 'csv' ? 'Generating…' : 'Excel')));
  }

  /* ── Main ─────────────────────────────────────────────────────── */
  function Reports() {
    useLucide();
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
    }, "Reporting center"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 'var(--text-sm)',
        color: 'var(--text-muted)',
        marginTop: 2
      }
    }, "6 live reports — export to PDF or Excel"))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 16
      }
    }, REPORTS.map(r => /*#__PURE__*/React.createElement(ReportCard, {
      key: r.id,
      report: r
    }))));
  }
  Object.assign(window, {
    Reports
  });
})();