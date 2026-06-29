// Supabase client — available globally as window.db
(() => {
  try {
  if (!window.supabase || !window.__SUPABASE_URL) {
    console.warn('[TechyFuel OS] Supabase not configured — running in demo mode');
    window.db = null; window.API = {};
    return;
  }
  const { createClient } = window.supabase;
  const client = createClient(window.__SUPABASE_URL, window.__SUPABASE_KEY);
  window.db = client;

  // Convenience: expose typed query helpers on window.API
  window.API = {
    // ── DASHBOARD ────────────────────────────────────────
    getDashboardStats: async () => {
      const [clients, projects, tasks, invoices] = await Promise.all([
        client.from('clients').select('*', { count: 'exact', head: true }).eq('status', 'active'),
        client.from('projects').select('*', { count: 'exact', head: true }).eq('status', 'active'),
        client.from('tasks').select('*', { count: 'exact', head: true }).neq('status', 'done'),
        client.from('invoices').select('amount').eq('status', 'paid'),
      ]);
      const revenue = invoices.data?.reduce((s, r) => s + Number(r.amount), 0) ?? 0;
      return {
        activeClients:  clients.count  ?? 0,
        activeProjects: projects.count ?? 0,
        openTasks:      tasks.count    ?? 0,
        revenue,
      };
    },

    // ── TEAM ─────────────────────────────────────────────
    getTeam: () => client.from('team_members').select('*').eq('status', 'active').order('name'),
    addTeamMember: (d) => client.from('team_members').insert(d).select().single(),
    updateTeamMember: (id, d) => client.from('team_members').update(d).eq('id', id).select().single(),

    // ── CLIENTS ──────────────────────────────────────────
    getClients: () => client.from('clients').select('*').order('name'),
    getClient: (id) => client.from('clients').select('*').eq('id', id).single(),
    createClient: (d) => client.from('clients').insert(d).select().single(),
    updateClient: (id, d) => client.from('clients').update(d).eq('id', id).select().single(),
    deleteClient: (id) => client.from('clients').delete().eq('id', id),

    // ── PROJECTS ─────────────────────────────────────────
    getProjects: () =>
      client.from('projects')
        .select('*, clients(name)')
        .order('created_at', { ascending: false }),
    createProject: async (d) => {
      const result = await client.from('projects').insert(d).select().single();
      if (result.data) {
        try {
          await client.from('channels').insert({ name: result.data.name.toLowerCase().replace(/\s+/g, '-'), type: 'project', project_id: result.data.id, description: `Channel for project: ${result.data.name}` });
        } catch {}
      }
      return result;
    },
    updateProject: (id, d) => client.from('projects').update(d).eq('id', id).select().single(),

    // ── TASKS ────────────────────────────────────────────
    getTasks: (filters = {}) => {
      let q = client.from('tasks')
        .select('*, projects(name), clients(name), team_members!assigned_to(name, avatar_url)');
      if (filters.projectId)  q = q.eq('project_id', filters.projectId);
      if (filters.assignedTo) q = q.eq('assigned_to', filters.assignedTo);
      if (filters.status)     q = q.eq('status', filters.status);
      return q.order('due_date', { ascending: true });
    },
    createTask: (d) => client.from('tasks').insert(d).select().single(),
    updateTask: (id, d) => client.from('tasks').update(d).eq('id', id).select().single(),
    deleteTask: (id) => client.from('tasks').delete().eq('id', id),

    // ── PIPELINE ─────────────────────────────────────────
    getPipeline: () =>
      client.from('pipeline_deals')
        .select('*, clients(name), team_members!assigned_to(name)')
        .order('created_at', { ascending: false }),
    createDeal: (d) => client.from('pipeline_deals').insert(d).select().single(),
    updateDeal: (id, d) => client.from('pipeline_deals').update(d).eq('id', id).select().single(),

    // ── CONTENT ──────────────────────────────────────────
    getContent: (filters = {}) => {
      let q = client.from('content_posts')
        .select('*, clients(name), team_members!assigned_to(name)');
      if (filters.clientId) q = q.eq('client_id', filters.clientId);
      if (filters.status)   q = q.eq('status', filters.status);
      return q.order('scheduled_at', { ascending: true });
    },
    createPost: (d) => client.from('content_posts').insert(d).select().single(),
    updatePost: (id, d) => client.from('content_posts').update(d).eq('id', id).select().single(),

    // ── ADS ──────────────────────────────────────────────
    getAdCampaigns: (clientId) => {
      let q = client.from('ad_campaigns').select('*, clients(name)');
      if (clientId) q = q.eq('client_id', clientId);
      return q.order('created_at', { ascending: false });
    },
    createCampaign: (d) => client.from('ad_campaigns').insert(d).select().single(),
    updateCampaign: (id, d) => client.from('ad_campaigns').update(d).eq('id', id).select().single(),

    // ── FINANCE ──────────────────────────────────────────
    getInvoices: () =>
      client.from('invoices').select('*, clients(name), projects(name)').order('created_at', { ascending: false }),
    createInvoice: (d) => client.from('invoices').insert(d).select().single(),
    updateInvoice: (id, d) => client.from('invoices').update(d).eq('id', id).select().single(),
    getExpenses: () =>
      client.from('expenses').select('*, projects(name), clients(name)').order('date', { ascending: false }),
    createExpense: (d) => client.from('expenses').insert(d).select().single(),

    // ── FILES ────────────────────────────────────────────
    getFiles: (filters = {}) => {
      let q = client.from('files')
        .select('*, projects(name), clients(name), team_members!uploaded_by(name)');
      if (filters.projectId) q = q.eq('project_id', filters.projectId);
      if (filters.clientId)  q = q.eq('client_id', filters.clientId);
      if (filters.folderId !== undefined) {
        if (filters.folderId === null) q = q.is('folder_id', null);
        else q = q.eq('folder_id', filters.folderId);
      }
      return q.order('created_at', { ascending: false });
    },
    uploadFile: async (bucket, path, file) => {
      const { data, error } = await client.storage.from(bucket).upload(path, file, { upsert: true });
      if (error) throw error;
      return client.storage.from(bucket).getPublicUrl(data.path).data.publicUrl;
    },
    createFile: (d) => client.from('files').insert(d).select().single(),

    // ── FOLDERS ──────────────────────────────────────────
    getFolders: (projectId) => client.from('folders').select('*').eq('project_id', projectId).order('name'),
    createFolder: (d) => client.from('folders').insert(d).select().single(),
    deleteFolder: (id) => client.from('folders').delete().eq('id', id),

    // ── DOCUMENTS ────────────────────────────────────────
    getDocs: (projectId) => client.from('documents').select('*').eq('project_id', projectId).order('updated_at', { ascending: false }),
    createDoc: (d) => client.from('documents').insert(d).select().single(),
    updateDoc: (id, d) => client.from('documents').update(d).eq('id', id).select().single(),
    deleteDoc: (id) => client.from('documents').delete().eq('id', id),
    getDocVersions: (docId) => client.from('document_versions').select('*').eq('document_id', docId).order('created_at', { ascending: false }),
    createDocVersion: (d) => client.from('document_versions').insert(d).select().single(),

    // ── CHAT ─────────────────────────────────────────────
    getChannels: () =>
      client.from('channels').select('*').order('created_at', { ascending: true }),
    createChannel: (d) => client.from('channels').insert(d).select().single(),
    updateChannel: (id, d) => client.from('channels').update(d).eq('id', id).select().single(),
    deleteChannel: (id) => client.from('channels').delete().eq('id', id),

    getChannelMembers: (channelId) =>
      client.from('channel_members')
        .select('*, team_members(id, name, avatar_url, role)')
        .eq('channel_id', channelId),
    addChannelMember: (d) => client.from('channel_members').insert(d).select().single(),
    removeChannelMember: (channelId, memberId) =>
      client.from('channel_members').delete().eq('channel_id', channelId).eq('member_id', memberId),

    getMessages: (channelId, { parentId = null } = {}) => {
      let q = client.from('messages')
        .select('*, team_members!sender_id(id, name, avatar_url)')
        .eq('channel_id', channelId);
      if (parentId) q = q.eq('thread_parent_id', parentId);
      else q = q.is('thread_parent_id', null);
      return q.order('created_at', { ascending: true });
    },
    sendMessage: (d) => client.from('messages').insert(d).select('*, team_members!sender_id(id, name, avatar_url)').single(),
    updateMessage: (id, d) => client.from('messages').update(d).eq('id', id).select().single(),
    deleteMessage: (id) => client.from('messages').delete().eq('id', id),
    pinMessage: (id, pinned) => client.from('messages').update({ pinned }).eq('id', id).select().single(),
    getPinnedMessages: (channelId) =>
      client.from('messages')
        .select('*, team_members!sender_id(id, name, avatar_url)')
        .eq('channel_id', channelId).eq('pinned', true)
        .order('created_at', { ascending: false }),
    searchMessages: (query) =>
      client.from('messages')
        .select('*, team_members!sender_id(id, name, avatar_url), channels(name)')
        .ilike('content', `%${query}%`)
        .order('created_at', { ascending: false })
        .limit(30),

    getReactions: (messageId) =>
      client.from('message_reactions')
        .select('*, team_members(id, name)')
        .eq('message_id', messageId),
    addReaction: (d) => client.from('message_reactions').insert(d).select().single(),
    removeReaction: (messageId, memberId, emoji) =>
      client.from('message_reactions').delete()
        .eq('message_id', messageId).eq('member_id', memberId).eq('emoji', emoji),

    subscribeToMessages: (channelId, onNew) =>
      client.channel(`chat:${channelId}`)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `channel_id=eq.${channelId}` }, payload => onNew(payload.new))
        .subscribe(),

    // ── AUTOMATIONS ──────────────────────────────────────
    getRules: () => client.from('automation_rules').select('*, team_members!created_by(name)').order('created_at', { ascending: false }),
    createRule: (d) => client.from('automation_rules').insert(d).select().single(),
    updateRule: (id, d) => client.from('automation_rules').update(d).eq('id', id).select().single(),
    deleteRule: (id) => client.from('automation_rules').delete().eq('id', id),

    getTemplates: () => client.from('task_templates').select('*').order('created_at', { ascending: false }),
    createTemplate: (d) => client.from('task_templates').insert(d).select().single(),
    updateTemplate: (id, d) => client.from('task_templates').update(d).eq('id', id).select().single(),
    deleteTemplate: (id) => client.from('task_templates').delete().eq('id', id),
    applyTemplate: async (templateId, projectId, assignMap = {}) => {
      const { data: tmpl } = await client.from('task_templates').select('*').eq('id', templateId).single();
      if (!tmpl || !tmpl.tasks) return { data: [] };
      const tasks = tmpl.tasks;
      const created = [];
      for (const t of tasks) {
        const due = t.due_offset_days != null ? new Date(Date.now() + t.due_offset_days * 86400000).toISOString().slice(0, 10) : null;
        const assigned_to = assignMap[t.assigned_role] || null;
        const payload = { title: t.title, status: t.status || 'todo', priority: t.priority || 'medium' };
        if (projectId) payload.project_id = projectId;
        if (due) payload.due_date = due;
        if (assigned_to) payload.assigned_to = assigned_to;
        const { data } = await client.from('tasks').insert(payload).select().single();
        if (data) created.push(data);
      }
      return { data: created };
    },

    getWebhooks: () => client.from('webhooks').select('*').order('created_at', { ascending: false }),
    createWebhook: (d) => client.from('webhooks').insert(d).select().single(),
    updateWebhook: (id, d) => client.from('webhooks').update(d).eq('id', id).select().single(),
    deleteWebhook: (id) => client.from('webhooks').delete().eq('id', id),
    fireWebhook: async (webhook, payload) => {
      try {
        const res = await fetch(webhook.url, { method: 'POST', headers: { 'Content-Type': 'application/json', ...(webhook.secret ? { 'X-TF-Secret': webhook.secret } : {}) }, body: JSON.stringify(payload) });
        await client.from('webhooks').update({ last_triggered_at: new Date().toISOString(), last_status: res.status }).eq('id', webhook.id);
        return res.ok;
      } catch { return false; }
    },

    getApprovals: (status) => {
      let q = client.from('approval_requests').select('*, tasks(title, status), team_members!requested_by(name), team_members!approver_id(name)');
      if (status) q = q.eq('status', status);
      return q.order('created_at', { ascending: false });
    },
    createApproval: (d) => client.from('approval_requests').insert(d).select().single(),
    resolveApproval: async (id, status, comment, taskId, newTaskStatus) => {
      const now = new Date().toISOString();
      await client.from('approval_requests').update({ status, comment, resolved_at: now }).eq('id', id);
      if (taskId) {
        const updates = { approval_status: status };
        if (status === 'approved' && newTaskStatus) updates.status = newTaskStatus;
        await client.from('tasks').update(updates).eq('id', taskId);
      }
    },
  };

  console.log('[TechyFuel OS] Supabase connected:', window.__SUPABASE_URL);
  } catch(err) {
    console.error('[TechyFuel OS] Supabase init error:', err);
    window.db = null; window.API = {};
  }
})();
