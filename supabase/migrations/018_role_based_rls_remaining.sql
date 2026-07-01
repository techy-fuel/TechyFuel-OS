-- Extends 017's real RLS enforcement to every remaining table that was
-- still on the original wide-open "using (true)" policy for anon +
-- authenticated. None of these are reachable from client-portal.html, so
-- they all become staff-only (any active team_members role) — the point
-- here is just closing off anon access and blocking clients from reading
-- internal-only data (chat, docs, automations, notifications, etc.) via a
-- direct API call, not restricting one staff role from another.

create or replace function public.current_member_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id from public.team_members where user_id = auth.uid() and status = 'active' limit 1;
$$;

-- ─── Clear existing policies on every table this migration touches ─────────
do $$
declare
  pol record;
  tbl text;
begin
  foreach tbl in array array[
    'project_members', 'pipeline_deals', 'ad_campaigns',
    'channels', 'channel_members', 'messages', 'message_reactions',
    'automation_rules', 'task_templates', 'approval_requests',
    'folders', 'documents', 'document_versions',
    'notifications', 'client_notes', 'client_invites', 'call_sessions'
  ] loop
    for pol in select policyname from pg_policies where schemaname = 'public' and tablename = tbl loop
      execute format('drop policy if exists %I on public.%I', pol.policyname, tbl);
    end loop;
  end loop;
end $$;

-- ─── Plain staff-only tables — any active role, no client access ───────────
do $$
declare tbl text;
begin
  foreach tbl in array array[
    'project_members', 'pipeline_deals', 'ad_campaigns',
    'channels', 'channel_members', 'messages', 'message_reactions',
    'automation_rules', 'task_templates', 'approval_requests',
    'folders', 'documents', 'document_versions',
    'client_notes', 'call_sessions'
  ] loop
    execute format('create policy "Staff access" on public.%I for all to authenticated using (current_member_role() is not null) with check (current_member_role() is not null)', tbl);
  end loop;
end $$;

-- ─── Notifications — you see your own, owner/admin can see all ─────────────
create policy "View own notifications" on public.notifications for select to authenticated
  using (recipient_id = current_member_id() or current_member_role() in ('owner', 'admin'));
create policy "Staff create notifications" on public.notifications for insert to authenticated
  with check (current_member_role() is not null);
create policy "Update own notifications" on public.notifications for update to authenticated
  using (recipient_id = current_member_id() or current_member_role() in ('owner', 'admin'))
  with check (recipient_id = current_member_id() or current_member_role() in ('owner', 'admin'));
create policy "Delete own notifications" on public.notifications for delete to authenticated
  using (recipient_id = current_member_id() or current_member_role() in ('owner', 'admin'));

-- ─── Client invites — contain raw magic-link tokens, owner/admin only ──────
create policy "Staff admin access" on public.client_invites for all to authenticated
  using (current_member_role() in ('owner', 'admin'))
  with check (current_member_role() in ('owner', 'admin'));
