import { createClient } from '@supabase/supabase-js';

// The anon key is safe to hardcode as a fallback (protected by RLS on every
// table) -- same value already embedded client-side in index.html.
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://nvgzzhqfibhtbauinmwu.supabase.co';
const SUPABASE_ANON_KEY_DEFAULT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52Z3p6aHFmaWJodGJhdWlubXd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxMjMyODYsImV4cCI6MjA5NzY5OTI4Nn0.eBz7eQ7JT8hewdMIqV_I-lfZH84rskIHAsyJusAa5hA';

// Resolves which team_members.id is calling, using their own Supabase JWT
// (sent by the client from window.db.auth.getSession()) -- not the service
// role -- so current_member_id() runs under the caller's own RLS context and
// correctly picks their currently-active workspace even if they belong to
// several. Returns null if the token is missing/invalid/has no membership.
export async function resolveCallerMemberId(req) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace(/^Bearer\s+/i, '');
  if (!token) return null;

  const asUser = createClient(SUPABASE_URL, process.env.SUPABASE_ANON_KEY || SUPABASE_ANON_KEY_DEFAULT, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
  const { data, error } = await asUser.rpc('current_member_id');
  if (error || !data) return null;
  return data;
}

// Service-role client for reading/writing tables (like email_accounts) that
// have no RLS policies for anon/authenticated on purpose.
export function serviceClient() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured');
  return createClient(SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
}
