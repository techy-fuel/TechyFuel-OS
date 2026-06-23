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
    createProject: (d) => client.from('projects').insert(d).select().single(),
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
      return q.order('created_at', { ascending: false });
    },
    uploadFile: async (bucket, path, file) => {
      const { data, error } = await client.storage.from(bucket).upload(path, file, { upsert: true });
      if (error) throw error;
      return client.storage.from(bucket).getPublicUrl(data.path).data.publicUrl;
    },
    createFile: (d) => client.from('files').insert(d).select().single(),
  };

  console.log('[TechyFuel OS] Supabase connected:', window.__SUPABASE_URL);
  } catch(err) {
    console.error('[TechyFuel OS] Supabase init error:', err);
    window.db = null; window.API = {};
  }
})();
