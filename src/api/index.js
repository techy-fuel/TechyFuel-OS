// TechyFuel OS — Supabase API layer
// All data access goes through these functions.

import { supabase } from '../lib/supabase.js';

// ── TEAM ────────────────────────────────────────────────
export const getTeamMembers = () =>
  supabase.from('team_members').select('*').eq('status', 'active').order('name');

export const inviteTeamMember = (data) =>
  supabase.from('team_members').insert(data).select().single();

export const updateTeamMember = (id, data) =>
  supabase.from('team_members').update(data).eq('id', id).select().single();

// ── CLIENTS / CRM ────────────────────────────────────────
export const getClients = () =>
  supabase.from('clients').select('*').order('name');

export const getClient = (id) =>
  supabase.from('clients').select('*').eq('id', id).single();

export const createClient = (data) =>
  supabase.from('clients').insert(data).select().single();

export const updateClient = (id, data) =>
  supabase.from('clients').update(data).eq('id', id).select().single();

// ── PROJECTS ────────────────────────────────────────────
export const getProjects = () =>
  supabase.from('projects').select('*, clients(name), project_members(member_id, team_members(name, avatar_url))').order('created_at', { ascending: false });

export const getProject = (id) =>
  supabase.from('projects').select('*, clients(*), project_members(*, team_members(*))').eq('id', id).single();

export const createProject = (data) =>
  supabase.from('projects').insert(data).select().single();

export const updateProject = (id, data) =>
  supabase.from('projects').update(data).eq('id', id).select().single();

// ── TASKS ────────────────────────────────────────────────
export const getTasks = ({ projectId, assignedTo, status } = {}) => {
  let q = supabase.from('tasks').select('*, projects(name), clients(name), team_members!assigned_to(name, avatar_url)');
  if (projectId)  q = q.eq('project_id', projectId);
  if (assignedTo) q = q.eq('assigned_to', assignedTo);
  if (status)     q = q.eq('status', status);
  return q.order('due_date', { ascending: true });
};

export const createTask = (data) =>
  supabase.from('tasks').insert(data).select().single();

export const updateTask = (id, data) =>
  supabase.from('tasks').update(data).eq('id', id).select().single();

export const deleteTask = (id) =>
  supabase.from('tasks').delete().eq('id', id);

// ── PIPELINE ─────────────────────────────────────────────
export const getPipelineDeals = () =>
  supabase.from('pipeline_deals').select('*, clients(name), team_members!assigned_to(name)').order('created_at', { ascending: false });

export const createDeal = (data) =>
  supabase.from('pipeline_deals').insert(data).select().single();

export const updateDeal = (id, data) =>
  supabase.from('pipeline_deals').update(data).eq('id', id).select().single();

// ── CONTENT CALENDAR ─────────────────────────────────────
export const getContentPosts = ({ clientId, status } = {}) => {
  let q = supabase.from('content_posts').select('*, clients(name), team_members!assigned_to(name)');
  if (clientId) q = q.eq('client_id', clientId);
  if (status)   q = q.eq('status', status);
  return q.order('scheduled_at', { ascending: true });
};

export const createPost = (data) =>
  supabase.from('content_posts').insert(data).select().single();

export const updatePost = (id, data) =>
  supabase.from('content_posts').update(data).eq('id', id).select().single();

// ── ADS ──────────────────────────────────────────────────
export const getAdCampaigns = (clientId) => {
  let q = supabase.from('ad_campaigns').select('*, clients(name)');
  if (clientId) q = q.eq('client_id', clientId);
  return q.order('created_at', { ascending: false });
};

export const updateCampaign = (id, data) =>
  supabase.from('ad_campaigns').update(data).eq('id', id).select().single();

// ── FINANCE ──────────────────────────────────────────────
export const getInvoices = () =>
  supabase.from('invoices').select('*, clients(name), projects(name)').order('created_at', { ascending: false });

export const createInvoice = (data) =>
  supabase.from('invoices').insert(data).select().single();

export const updateInvoice = (id, data) =>
  supabase.from('invoices').update(data).eq('id', id).select().single();

export const getExpenses = () =>
  supabase.from('expenses').select('*, projects(name), clients(name)').order('date', { ascending: false });

export const createExpense = (data) =>
  supabase.from('expenses').insert(data).select().single();

// ── FILES ─────────────────────────────────────────────────
export const getFiles = ({ projectId, clientId } = {}) => {
  let q = supabase.from('files').select('*, projects(name), clients(name), team_members!uploaded_by(name)');
  if (projectId) q = q.eq('project_id', projectId);
  if (clientId)  q = q.eq('client_id', clientId);
  return q.order('created_at', { ascending: false });
};

export const uploadFile = async (bucket, path, file) => {
  const { data, error } = await supabase.storage.from(bucket).upload(path, file);
  if (error) throw error;
  return supabase.storage.from(bucket).getPublicUrl(data.path).data.publicUrl;
};

// ── DASHBOARD STATS ───────────────────────────────────────
export const getDashboardStats = async () => {
  const [clients, projects, tasks, invoices] = await Promise.all([
    supabase.from('clients').select('id', { count: 'exact' }).eq('status', 'active'),
    supabase.from('projects').select('id', { count: 'exact' }).eq('status', 'active'),
    supabase.from('tasks').select('id', { count: 'exact' }).neq('status', 'done'),
    supabase.from('invoices').select('amount').eq('status', 'paid'),
  ]);
  const revenue = invoices.data?.reduce((sum, inv) => sum + Number(inv.amount), 0) ?? 0;
  return {
    activeClients:  clients.count  ?? 0,
    activeProjects: projects.count ?? 0,
    openTasks:      tasks.count    ?? 0,
    revenue,
  };
};
