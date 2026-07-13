// Laravel REST API client — drop-in replacement for supabase-api.js.
//
// NOT wired into index.html yet. This file exists so the Laravel backend
// (backend-laravel/, laravel-migration branch) can be tried and tested
// against the real frontend screens before cutting over — swapping the
// <script src="supabase-api.js"> tag for this one in index.html is a
// separate, deliberate step, since it flips the entire app's data layer.
//
// Every window.API method below mirrors the same name/signature/return
// shape as supabase-api.js's window.API, so screens don't need to change.
// Where Supabase's PostgREST embedded-relation naming (e.g. `clients(name)`
// embeds as response.clients) differs from this API's Eloquent relation
// names (e.g. `client`), the mapXxx() helpers below rename keys back to
// match what the screens already read (`.clients?.name`, etc.) — see
// each mapper for exactly which keys it adds.
(() => {
  const API_BASE = window.__LARAVEL_API_URL || '/api';
  const TOKEN_KEY = 'tf_auth_token';
  const USER_KEY = 'tf_auth_user';

  function getToken() { return localStorage.getItem(TOKEN_KEY); }
  function setSession(token, user) {
    if (token) localStorage.setItem(TOKEN_KEY, token); else localStorage.removeItem(TOKEN_KEY);
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user)); else localStorage.removeItem(USER_KEY);
  }
  function getStoredUser() {
    try { return JSON.parse(localStorage.getItem(USER_KEY) || 'null'); } catch { return null; }
  }

  const authListeners = [];
  function emitAuthChange(event, session) {
    authListeners.forEach(cb => { try { cb(event, session); } catch {} });
  }

  // ── Low-level request helper ────────────────────────────────────────
  // Returns { ok, status, json } — callers shape their own {data, error}
  // return value since different endpoints wrap payloads differently
  // (most are {data: ...}, but /me, /dashboard/stats, /notifications/
  // unread-count etc. return their own top-level shape).
  async function req(path, { method = 'GET', body, isForm = false } = {}) {
    const headers = { Accept: 'application/json' };
    if (!isForm) headers['Content-Type'] = 'application/json';
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const res = await fetch(`${API_BASE}${path}`, {
        method,
        headers,
        body: body === undefined ? undefined : (isForm ? body : JSON.stringify(body)),
      });
      let json = null;
      try { json = await res.json(); } catch {}
      return { ok: res.ok, status: res.status, json };
    } catch (err) {
      return { ok: false, status: 0, json: { message: err.message || 'Network error' } };
    }
  }

  function errorFrom(json, status) {
    const firstFieldError = json && json.errors && Object.values(json.errors)[0];
    const message = (firstFieldError && firstFieldError[0]) || (json && json.message) || `Request failed (${status})`;
    return { message };
  }

  // Standard case: endpoint returns {data: ...} on success.
  async function call(path, opts) {
    const { ok, status, json } = await req(path, opts);
    if (!ok) return { data: null, error: errorFrom(json, status) };
    return { data: json && 'data' in json ? json.data : json, error: null };
  }

  // ── Embedded-relation remappers ──────────────────────────────────────
  // Supabase's PostgREST embeds a related row under the *table* name
  // (clients(name) -> row.clients), plural, regardless of FK column name.
  // Our Eloquent relations are named for what they mean (client, creator,
  // assignee...) — remap those back to the plural table-name keys the
  // screens already destructure.
  function pick(obj, keys) {
    if (!obj) return obj;
    const out = {};
    keys.forEach(k => { out[k] = obj[k]; });
    return out;
  }
  function mapTask(t) {
    if (!t) return t;
    return {
      ...t,
      projects: t.project ? pick(t.project, ['name']) : null,
      clients: t.client ? pick(t.client, ['name']) : null,
      team_members: t.assignee ? pick(t.assignee, ['name', 'avatar_url']) : null,
    };
  }
  function mapProject(p) {
    if (!p) return p;
    return { ...p, clients: p.client ? pick(p.client, ['name']) : null };
  }
  function mapDeal(d) {
    if (!d) return d;
    return {
      ...d,
      clients: d.client ? pick(d.client, ['name']) : null,
      team_members: d.assignee ? pick(d.assignee, ['name']) : null,
    };
  }
  function mapPost(p) {
    if (!p) return p;
    return {
      ...p,
      clients: p.client ? pick(p.client, ['name']) : null,
      team_members: p.assignee ? pick(p.assignee, ['name']) : null,
    };
  }
  function mapCampaign(c) {
    if (!c) return c;
    return { ...c, clients: c.client ? pick(c.client, ['name']) : null };
  }
  function mapInvoice(inv) {
    if (!inv) return inv;
    return {
      ...inv,
      clients: inv.client ? pick(inv.client, ['name']) : null,
      projects: inv.project ? pick(inv.project, ['name']) : null,
      invoice_items: inv.items || inv.invoice_items || [],
    };
  }
  function mapExpense(e) {
    if (!e) return e;
    return {
      ...e,
      projects: e.project ? pick(e.project, ['name']) : null,
      clients: e.client ? pick(e.client, ['name']) : null,
    };
  }
  function mapFile(f) {
    if (!f) return f;
    return {
      ...f,
      projects: f.project ? pick(f.project, ['name']) : null,
      clients: f.client ? pick(f.client, ['name']) : null,
      team_members: f.uploader ? pick(f.uploader, ['name']) : null,
      file_type: f.mime_type || f.file_type || '',
    };
  }
  function mapMessage(m) {
    if (!m) return m;
    return { ...m, team_members: m.sender ? pick(m.sender, ['id', 'name', 'avatar_url']) : null };
  }
  function mapChannelMember(cm) {
    if (!cm) return cm;
    return { ...cm, team_members: cm.member ? pick(cm.member, ['id', 'name', 'avatar_url', 'role']) : null };
  }
  function mapRule(r) {
    if (!r) return r;
    return { ...r, team_members: r.creator ? pick(r.creator, ['name']) : null };
  }
  function mapApproval(a) {
    if (!a) return a;
    return {
      ...a,
      tasks: a.task ? pick(a.task, ['title', 'status']) : null,
    };
  }
  function mapClientNote(n) {
    if (!n) return n;
    return { ...n, team_members: n.creator ? pick(n.creator, ['name', 'avatar_url']) : null };
  }
  function mapActivity(a) {
    if (!a) return a;
    return { ...a, team_members: a.actor ? pick(a.actor, ['name', 'avatar_url']) : null };
  }
  function mapWorkspaceInvite(i) {
    if (!i) return i;
    return { ...i, team_members: i.inviter ? pick(i.inviter, ['name']) : null };
  }
  function mapTeam(t) {
    if (!t) return t;
    return {
      ...t,
      team_memberships: (t.memberships || []).map(m => ({
        member_id: m.member_id, role: m.role,
        team_members: m.member ? pick(m.member, ['name', 'avatar_url', 'role']) : null,
      })),
    };
  }

  window.API = {
    // ── DASHBOARD ────────────────────────────────────────
    getDashboardStats: async (period = 'month') => {
      const { ok, json } = await req(`/dashboard/stats?period=${encodeURIComponent(period)}`);
      if (!ok) return { activeClients: 0, activeProjects: 0, openTasks: 0, revenue: 0 };
      return json;
    },

    // ── TEAM ─────────────────────────────────────────────
    getTeam: () => call('/team-members'),
    getAllTeamMembers: () => call('/team-members'),
    getTeamMemberByEmail: async (_email) => {
      const { data, error } = await call('/me');
      if (error || !data) return { data: null, error };
      return { data: data.active_member, error: null };
    },
    addTeamMember: (d) => call('/team-members', { method: 'POST', body: d }),
    updateTeamMember: (id, d) => call(`/team-members/${id}`, { method: 'PATCH', body: d }),
    setTeamMemberStatus: (id, status) => call(`/team-members/${id}`, { method: 'PATCH', body: { status } }),

    // ── CLIENTS ──────────────────────────────────────────
    getClients: () => call('/clients'),
    getClient: (id) => call(`/clients/${id}`),
    createClient: (d) => call('/clients', { method: 'POST', body: d }),
    updateClient: (id, d) => call(`/clients/${id}`, { method: 'PATCH', body: d }),
    deleteClient: (id) => call(`/clients/${id}`, { method: 'DELETE' }),

    // ── PROJECTS ─────────────────────────────────────────
    getProjects: async () => {
      const { data, error } = await call('/projects');
      return { data: data ? data.map(mapProject) : data, error };
    },
    createProject: (d) => call('/projects', { method: 'POST', body: d }),
    updateProject: (id, d) => call(`/projects/${id}`, { method: 'PATCH', body: d }),
    deleteProject: (id) => call(`/projects/${id}`, { method: 'DELETE' }),

    // ── TASKS ────────────────────────────────────────────
    getTasks: async (filters = {}) => {
      const params = new URLSearchParams();
      if (filters.projectId) params.set('project_id', filters.projectId);
      if (filters.assignedTo) params.set('assigned_to', filters.assignedTo);
      if (filters.status) params.set('status', filters.status);
      const qs = params.toString();
      const { data, error } = await call(`/tasks${qs ? '?' + qs : ''}`);
      return { data: data ? data.map(mapTask) : data, error };
    },
    createTask: (d) => call('/tasks', { method: 'POST', body: d }),
    updateTask: (id, d) => call(`/tasks/${id}`, { method: 'PATCH', body: d }),
    deleteTask: (id) => call(`/tasks/${id}`, { method: 'DELETE' }),

    // ── TIME TRACKING ────────────────────────────────────
    getRunningTimeEntry: async (_memberId) => {
      // No direct "my running entry" endpoint yet — approximate by
      // scanning a task's entries is not workable here; left as a
      // known gap (returns null) until a dedicated endpoint is added.
      return { data: null, error: null };
    },
    getTimeEntriesForTask: (taskId) => call(`/tasks/${taskId}/time-entries`),
    getAllTimeEntries: async () => ({ data: [], error: null }), // known gap: no cross-task endpoint yet
    startTimeEntry: (taskId, _memberId) => call(`/tasks/${taskId}/time-entries/start`, { method: 'POST' }),
    stopTimeEntry: (id) => call(`/time-entries/${id}/stop`, { method: 'POST' }),

    // ── PIPELINE ─────────────────────────────────────────
    getPipeline: async () => {
      const { data, error } = await call('/pipeline-deals');
      return { data: data ? data.map(mapDeal) : data, error };
    },
    createDeal: (d) => call('/pipeline-deals', { method: 'POST', body: d }),
    updateDeal: (id, d) => call(`/pipeline-deals/${id}`, { method: 'PATCH', body: d }),

    // ── CONTENT ──────────────────────────────────────────
    getContent: async (filters = {}) => {
      const params = new URLSearchParams();
      if (filters.clientId) params.set('client_id', filters.clientId);
      if (filters.status) params.set('status', filters.status);
      const qs = params.toString();
      const { data, error } = await call(`/content-posts${qs ? '?' + qs : ''}`);
      return { data: data ? data.map(mapPost) : data, error };
    },
    createPost: (d) => call('/content-posts', { method: 'POST', body: d }),
    updatePost: (id, d) => call(`/content-posts/${id}`, { method: 'PATCH', body: d }),

    // ── ADS ──────────────────────────────────────────────
    getAdCampaigns: async (clientId) => {
      const qs = clientId ? `?client_id=${clientId}` : '';
      const { data, error } = await call(`/ad-campaigns${qs}`);
      return { data: data ? data.map(mapCampaign) : data, error };
    },
    createCampaign: (d) => call('/ad-campaigns', { method: 'POST', body: d }),
    updateCampaign: (id, d) => call(`/ad-campaigns/${id}`, { method: 'PATCH', body: d }),

    // ── FINANCE ──────────────────────────────────────────
    getInvoices: async () => {
      const { data, error } = await call('/invoices');
      return { data: data ? data.map(mapInvoice) : data, error };
    },
    createInvoice: (d) => call('/invoices', { method: 'POST', body: d }),
    updateInvoice: (id, d) => call(`/invoices/${id}`, { method: 'PATCH', body: d }),
    getInvoiceItems: async (invoiceId) => {
      const { data, error } = await call(`/invoices/${invoiceId}`);
      return { data: data ? (data.items || []) : data, error };
    },
    saveInvoiceItems: (invoiceId, items) =>
      call(`/invoices/${invoiceId}`, { method: 'PATCH', body: { items } }),
    getExpenses: async () => {
      const { data, error } = await call('/expenses');
      return { data: data ? data.map(mapExpense) : data, error };
    },
    createExpense: (d) => call('/expenses', { method: 'POST', body: d }),
    updateExpense: (id, d) => call(`/expenses/${id}`, { method: 'PATCH', body: d }),
    deleteExpense: (id) => call(`/expenses/${id}`, { method: 'DELETE' }),

    // ── FILES ────────────────────────────────────────────
    getFiles: async (filters = {}) => {
      const { data, error } = await call('/files');
      if (error) return { data, error };
      let rows = data.map(mapFile);
      if (filters.projectId) rows = rows.filter(f => f.project_id === filters.projectId);
      if (filters.clientId) rows = rows.filter(f => f.client_id === filters.clientId);
      if (filters.folderId !== undefined) {
        rows = rows.filter(f => (filters.folderId === null ? !f.folder_id : f.folder_id === filters.folderId));
      }
      return { data: rows, error: null };
    },
    // Signature kept for compatibility (bucket unused server-side — files
    // land on the configured default disk); actually uploads via /files.
    uploadFile: async (_bucket, _path, file) => {
      const form = new FormData();
      form.append('file', file);
      const { ok, json } = await req('/files', { method: 'POST', body: form, isForm: true });
      if (!ok) throw new Error((json && json.message) || 'Upload failed');
      return json.data.url || json.data.file_path;
    },
    createFile: (d) => call('/files', { method: 'POST', body: d }),
    updateFile: (_id, _d) => ({ data: null, error: { message: 'Files are immutable metadata after upload; delete and re-upload instead.' } }),

    // ── FOLDERS ──────────────────────────────────────────
    getFolders: async (projectId) => {
      const { data, error } = await call('/folders');
      return { data: data ? data.filter(f => f.project_id === projectId) : data, error };
    },
    createFolder: (d) => call('/folders', { method: 'POST', body: d }),
    deleteFolder: (id) => call(`/folders/${id}`, { method: 'DELETE' }),

    // ── DOCUMENTS ────────────────────────────────────────
    getDocs: async (projectId) => {
      const { data, error } = await call('/documents');
      return { data: data ? data.filter(d => d.project_id === projectId) : data, error };
    },
    createDoc: (d) => call('/documents', { method: 'POST', body: d }),
    updateDoc: (id, d) => call(`/documents/${id}`, { method: 'PATCH', body: d }),
    deleteDoc: (id) => call(`/documents/${id}`, { method: 'DELETE' }),
    getDocVersions: async (docId) => {
      const { data, error } = await call(`/documents/${docId}`);
      return { data: data ? (data.versions || []) : data, error };
    },
    createDocVersion: () => ({ data: null, error: null }), // versions are auto-snapshotted server-side on every update

    // ── CHAT ─────────────────────────────────────────────
    getChannels: () => call('/channels'),
    createChannel: (d) => call('/channels', { method: 'POST', body: d }),
    updateChannel: () => ({ data: null, error: { message: 'Not supported yet' } }),
    deleteChannel: (id) => call(`/channels/${id}`, { method: 'DELETE' }),

    getChannelMembers: async (channelId) => {
      const { data, error } = await call(`/channels/${channelId}/members`);
      return { data: data ? data.map(mapChannelMember) : data, error };
    },
    addChannelMember: (d) => call(`/channels/${d.channel_id}/members`, { method: 'POST', body: { member_id: d.member_id } }),
    removeChannelMember: (channelId, memberId) => call(`/channels/${channelId}/members/${memberId}`, { method: 'DELETE' }),
    markChannelRead: (channelId, memberId) => call(`/channels/${channelId}/members/${memberId}/mark-read`, { method: 'POST' }),

    getMessages: async (channelId, { parentId = null } = {}) => {
      const qs = parentId ? `?parent_id=${parentId}` : '';
      const { data, error } = await call(`/channels/${channelId}/messages${qs}`);
      return { data: data ? data.map(mapMessage) : data, error };
    },
    sendMessage: async (d) => {
      const { data, error } = await call(`/channels/${d.channel_id}/messages`, { method: 'POST', body: d });
      return { data: mapMessage(data), error };
    },
    updateMessage: () => ({ data: null, error: { message: 'Not supported yet' } }),
    deleteMessage: (id) => call(`/messages/${id}`, { method: 'DELETE' }),
    pinMessage: (id, pinned) => call(`/messages/${id}/pin`, { method: 'PATCH', body: { pinned } }),
    getPinnedMessages: async (channelId) => {
      const { data, error } = await call(`/channels/${channelId}/messages/pinned`);
      return { data: data ? data.map(mapMessage) : data, error };
    },
    searchMessages: async (query) => {
      const { data, error } = await call(`/messages/search?q=${encodeURIComponent(query)}`);
      return { data: data ? data.map(mapMessage) : data, error };
    },

    getReactions: async (messageId) => {
      // Reactions come embedded on the message list; fetch via the
      // channel's messages and pick this one out isn't ideal, so this
      // is a known gap for a standalone lookup — most screens already
      // have reactions from getMessages()/getPinnedMessages().
      return { data: [], error: null };
    },
    addReaction: (d) => call(`/messages/${d.message_id}/reactions`, { method: 'POST', body: { emoji: d.emoji } }),
    removeReaction: (messageId, _memberId, emoji) =>
      call(`/messages/${messageId}/reactions/${encodeURIComponent(emoji)}`, { method: 'DELETE' }),

    // Real-time chat now runs over Laravel Reverb (see app/Events/
    // MessagePosted.php), not Supabase's postgres_changes. A full
    // Echo/Pusher-protocol client isn't wired up in this vanilla-script
    // (no bundler) frontend yet — this is a documented gap, not a crash:
    // returns a channel-like object whose unsubscribe is a no-op.
    subscribeToMessages: (_channelId, _onNew) => ({ unsubscribe() {} }),

    // ── CALLS ────────────────────────────────────────────
    startCallSession: (d) => {
      const { channelName, ...row } = d;
      return call('/call-sessions', { method: 'POST', body: row });
    },
    endCallSession: (id, participantCount) => call(`/call-sessions/${id}/end`, { method: 'POST', body: { participant_count: participantCount || 1 } }),

    // ── AUTOMATIONS ──────────────────────────────────────
    getRules: async () => {
      const { data, error } = await call('/automation-rules');
      return { data: data ? data.map(mapRule) : data, error };
    },
    createRule: (d) => call('/automation-rules', { method: 'POST', body: d }),
    updateRule: (id, d) => call(`/automation-rules/${id}`, { method: 'PATCH', body: d }),
    deleteRule: (id) => call(`/automation-rules/${id}`, { method: 'DELETE' }),

    getTemplates: () => call('/task-templates'),
    createTemplate: (d) => call('/task-templates', { method: 'POST', body: d }),
    updateTemplate: () => ({ data: null, error: { message: 'Not supported yet' } }),
    deleteTemplate: (id) => call(`/task-templates/${id}`, { method: 'DELETE' }),
    applyTemplate: (templateId, projectId, assignMap = {}) =>
      call(`/task-templates/${templateId}/apply`, { method: 'POST', body: { project_id: projectId, assign_map: assignMap } }),

    getWebhooks: () => call('/webhooks'),
    createWebhook: (d) => call('/webhooks', { method: 'POST', body: d }),
    updateWebhook: (id, d) => call(`/webhooks/${id}`, { method: 'PATCH', body: d }),
    deleteWebhook: (id) => call(`/webhooks/${id}`, { method: 'DELETE' }),
    fireWebhook: async (webhook, payload) => {
      const { ok } = await req(`/webhooks/${webhook.id}/fire`, { method: 'POST', body: { payload } });
      return ok;
    },

    getApprovals: async (status) => {
      const qs = status ? `?status=${status}` : '';
      const { data, error } = await call(`/approval-requests${qs}`);
      return { data: data ? data.map(mapApproval) : data, error };
    },
    createApproval: (d) => call('/approval-requests', { method: 'POST', body: d }),
    getPendingApprovalForTask: (taskId) => call(`/tasks/${taskId}/approval-requests/pending`),
    getLatestApprovalForTask: (taskId) => call(`/tasks/${taskId}/approval-requests/latest`),
    resolveApproval: async (id, status, comment, _taskId, _newTaskStatus) => {
      await call(`/approval-requests/${id}/resolve`, { method: 'POST', body: { approved: status === 'approved', comment } });
    },

    // ── WORKSPACES ───────────────────────────────────────
    getWorkspaces: () => call('/workspaces'),
    createWorkspace: (d) => call('/workspaces', { method: 'POST', body: { name: d.name, description: d.description || null } }),
    switchWorkspace: async (workspaceId) => {
      const { error } = await call('/workspaces/switch', { method: 'POST', body: { workspace_id: workspaceId } });
      return { error };
    },
    getActiveWorkspaceId: async () => {
      const { data } = await call('/me');
      return data ? data.active_workspace_id : null;
    },
    updateWorkspace: (_id, d) => call('/workspaces', { method: 'PATCH', body: d }),

    getTeams: async (workspaceId) => {
      const { data, error } = await call('/teams');
      const rows = data ? data.map(mapTeam) : data;
      return { data: rows, error };
    },
    createTeam: (d) => call('/teams', { method: 'POST', body: d }),
    updateTeam: (id, d) => call(`/teams/${id}`, { method: 'PATCH', body: d }),
    deleteTeam: (id) => call(`/teams/${id}`, { method: 'DELETE' }),
    addTeamMembership: (d) => call(`/teams/${d.team_id}/memberships`, { method: 'POST', body: { member_id: d.member_id, role: d.role } }),
    removeTeamMembership: (teamId, memberId) => call(`/teams/${teamId}/memberships/${memberId}`, { method: 'DELETE' }),

    getWorkspaceInvites: async (_workspaceId) => {
      const { data, error } = await call('/workspace-invites');
      return { data: data ? data.map(mapWorkspaceInvite) : data, error };
    },
    createWorkspaceInvite: (d) => call('/workspace-invites', { method: 'POST', body: d }),
    revokeInvite: (id) => call(`/workspace-invites/${id}`, { method: 'DELETE' }),

    // ── NOTIFICATIONS ─────────────────────────────────────
    getNotifications: (_recipientId, _limit = 30) => call('/notifications'),
    createNotification: (d) => call('/notifications', { method: 'POST', body: d }),
    markNotificationRead: (id) => call(`/notifications/${id}`, { method: 'PATCH', body: { read: true } }),
    markAllRead: (_recipientId) => call('/notifications/mark-all-read', { method: 'POST' }),
    getUnreadCount: async (_recipientId) => {
      const { ok, json } = await req('/notifications/unread-count');
      return ok ? (json.count ?? 0) : 0;
    },

    // ── CLIENT PORTAL ─────────────────────────────────────
    getClientNotes: async (clientId, _projectId) => {
      const { data, error } = await call(`/clients/${clientId}/notes`);
      return { data: data ? data.map(mapClientNote) : data, error };
    },
    createClientNote: (d) => call(`/clients/${d.client_id}/notes`, { method: 'POST', body: d }),
    deleteClientNote: () => ({ data: null, error: { message: 'Not supported yet' } }),
    createClientInvite: (d) => call(`/clients/${d.client_id}/invites`, { method: 'POST', body: d }),
    getClientInvite: (clientId) => call(`/clients/${clientId}/invite`),

    // ── ACTIVITY LOG ───────────────────────────────────────
    getActivityLog: async (filters = {}) => {
      const params = new URLSearchParams();
      if (filters.entityType) params.set('entity_type', filters.entityType);
      params.set('limit', filters.limit || 100);
      const { data, error } = await call(`/activity-log?${params.toString()}`);
      return { data: data ? data.map(mapActivity) : data, error };
    },

    // ── FX RATES (multi-currency invoices) ─────────────────
    getFxRates: async () => {
      try {
        const cached = JSON.parse(localStorage.getItem('tf_fx_rates') || 'null');
        if (cached && Date.now() - cached.fetchedAt < 60 * 60 * 1000) return cached;
        const { ok, json } = await req('/fx-rates');
        if (!ok) throw new Error('fx-rates request failed');
        const payload = { base: json.base || 'USD', rates: json.rates || {}, fetchedAt: Date.now() };
        localStorage.setItem('tf_fx_rates', JSON.stringify(payload));
        return payload;
      } catch (err) {
        console.error('[TechyFuel OS] FX rates fetch failed:', err);
        const cached = JSON.parse(localStorage.getItem('tf_fx_rates') || 'null');
        return cached || { base: 'USD', rates: {}, fetchedAt: 0 };
      }
    },
  };

  // ── window.db shim (Auth + no-op realtime channel) ──────────────────
  // Only the subset actually used by the app: Auth.jsx (sign in/up/reset),
  // index.html's session bootstrap, and Email.jsx/Finance.jsx/helpers.jsx
  // (reading the access token to call other API endpoints directly).
  window.db = {
    auth: {
      async getSession() {
        const token = getToken();
        const user = getStoredUser();
        if (!token || !user) return { data: { session: null }, error: null };
        return { data: { session: { access_token: token, user } }, error: null };
      },
      onAuthStateChange(callback) {
        authListeners.push(callback);
        return { data: { subscription: { unsubscribe() {
          const i = authListeners.indexOf(callback);
          if (i >= 0) authListeners.splice(i, 1);
        } } } };
      },
      async signInWithPassword({ email, password }) {
        const { ok, json } = await req('/login', { method: 'POST', body: { email, password } });
        if (!ok) return { data: { user: null, session: null }, error: errorFrom(json, 0) };
        setSession(json.token, json.user);
        emitAuthChange('SIGNED_IN', { access_token: json.token, user: json.user });
        return { data: { user: json.user, session: { access_token: json.token, user: json.user } }, error: null };
      },
      async signUp({ email, password, options }) {
        const name = options?.data?.full_name || email.split('@')[0];
        const { ok, json } = await req('/register', { method: 'POST', body: { name, email, password } });
        if (!ok) return { data: { user: null, session: null }, error: errorFrom(json, 0) };
        setSession(json.token, json.user);
        emitAuthChange('SIGNED_IN', { access_token: json.token, user: json.user });
        return { data: { user: json.user, session: { access_token: json.token, user: json.user } }, error: null };
      },
      async signOut() {
        await req('/logout', { method: 'POST' });
        setSession(null, null);
        emitAuthChange('SIGNED_OUT', null);
        return { error: null };
      },
      async resetPasswordForEmail(email) {
        const { ok, json } = await req('/forgot-password', { method: 'POST', body: { email } });
        return { error: ok ? null : errorFrom(json, 0) };
      },
    },
    // Docs.jsx's live-collaboration presence channel — see file header
    // comment: not implemented over Reverb yet in this vanilla-script
    // frontend. Returns a chainable no-op so Docs.jsx doesn't throw;
    // documents still load/save correctly, just without the live
    // "someone else is editing" indicator.
    channel(_name) {
      const chain = { on() { return chain; }, subscribe() { return chain; }, send() {} };
      return chain;
    },
    removeChannel() {},
  };

  console.log('[TechyFuel OS] Laravel API client loaded:', API_BASE);
})();
