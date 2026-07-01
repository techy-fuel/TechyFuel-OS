-- True multi-tenant isolation.
--
-- 017/018 enforced roles (owner/admin/member) but within a single shared
-- database — every "staff" policy used current_member_role() is not null
-- with no concept of *which* agency. That meant a brand-new signup (with
-- no existing invite) became 'owner' of the one and only shared dataset
-- and could see every other agency's clients, tasks, invoices, chat, etc.
-- This migration makes every agency ("workspace") a fully isolated tenant:
--   1. Every business table gets a workspace_id column, backfilled to the
--      existing seeded workspace so nothing changes for current users.
--   2. The signup trigger now creates a BRAND NEW workspace for a genuinely
--      new signup (no existing invite anywhere) instead of making them
--      owner of the pre-existing one.
--   3. Every policy from 017/018 is redefined to also require
--      workspace_id = current_workspace_id() — a member of Workspace A can
--      no longer see anything belonging to Workspace B, regardless of role.
--
-- workspace_id columns get DEFAULT current_workspace_id(), so existing
-- application code that inserts rows without explicitly setting
-- workspace_id (which is all of it) automatically tags new rows with the
-- inserting user's own workspace — no client-side code changes required
-- for this to work correctly.

-- ─── 1. Workspace-scoping helper ─────────────────────────────────────────────
create or replace function public.current_workspace_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select workspace_id from public.team_members where user_id = auth.uid() and status = 'active' limit 1;
$$;

-- ─── 2. Add workspace_id to every remaining business table, backfilled to
--        the existing seeded workspace so current data doesn't move ──────────
do $$
declare
  tbl text;
  default_ws uuid := 'aaaaaaaa-0000-0000-0000-000000000001';
begin
  foreach tbl in array array[
    'clients', 'projects', 'project_members', 'tasks', 'pipeline_deals',
    'content_posts', 'ad_campaigns', 'invoices', 'expenses', 'files',
    'channels', 'channel_members', 'messages', 'message_reactions',
    'automation_rules', 'task_templates', 'webhooks', 'approval_requests',
    'folders', 'documents', 'document_versions',
    'notifications', 'client_notes', 'client_invites', 'call_sessions',
    'activity_log'
  ] loop
    execute format('alter table public.%I add column if not exists workspace_id uuid references public.workspaces(id) on delete cascade', tbl);
    execute format('update public.%I set workspace_id = %L where workspace_id is null', tbl, default_ws);
    execute format('alter table public.%I alter column workspace_id set default public.current_workspace_id()', tbl);
    execute format('alter table public.%I alter column workspace_id set not null', tbl);
    execute format('create index if not exists %I on public.%I(workspace_id)', tbl || '_workspace_idx', tbl);
  end loop;
end $$;

-- team_members, teams, and workspace_invites already had a workspace_id
-- column from migration 014, but it was never given a default — so every
-- insert that didn't explicitly set it (e.g. Team.jsx's "Invite member",
-- which never has) left it NULL, which then failed the "belongs to my
-- workspace" check on every policy below. This was the actual bug behind
-- an invited teammate ending up with no workspace link at all.
do $$
declare
  tbl text;
  default_ws uuid := 'aaaaaaaa-0000-0000-0000-000000000001';
begin
  foreach tbl in array array['team_members', 'teams', 'workspace_invites'] loop
    execute format('update public.%I set workspace_id = %L where workspace_id is null', tbl, default_ws);
    execute format('alter table public.%I alter column workspace_id set default public.current_workspace_id()', tbl);
    execute format('alter table public.%I alter column workspace_id set not null', tbl);
  end loop;
end $$;

-- ─── 3. Signup trigger — brand-new signups get their OWN new workspace ──────
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_workspace_id uuid;
  display_name text := coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1));
begin
  -- Already pre-invited as a team member? Link it (their workspace_id was
  -- already set, by default, to the inviting admin's own workspace).
  update public.team_members set user_id = new.id where email = new.email and user_id is null;
  if found then
    return new;
  end if;

  -- Or pre-added as a client contact? Link that instead.
  update public.clients set user_id = new.id where email = new.email and user_id is null;
  if found then
    return new;
  end if;

  -- Genuinely new signup, no invite anywhere: give them their own brand
  -- new, fully isolated workspace and make them its owner.
  insert into public.workspaces (name, owner_id)
  values (display_name || '''s Agency', null)
  returning id into new_workspace_id;

  insert into public.team_members (user_id, name, email, role, status, workspace_id)
  values (new.id, display_name, new.email, 'owner', 'active', new_workspace_id)
  on conflict (email) do update set user_id = excluded.user_id;

  update public.workspaces set owner_id = (select id from public.team_members where user_id = new.id) where id = new_workspace_id;

  return new;
end;
$$;

-- ─── 4. Clear every policy on every workspace-scoped table (017 + 018 +
--        workspaces/teams/team_memberships/workspace_invites) and rebuild
--        them all with workspace_id enforcement layered on top of role ─────
do $$
declare
  pol record;
  tbl text;
begin
  foreach tbl in array array[
    'invoices', 'expenses', 'webhooks',
    'workspaces', 'teams', 'team_memberships', 'workspace_invites',
    'activity_log', 'team_members', 'clients', 'projects', 'tasks',
    'files', 'content_posts',
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

-- ─── 5. Workspaces — you only ever see/edit your own ────────────────────────
create policy "View own workspace" on public.workspaces for select to authenticated
  using (id = current_workspace_id());
create policy "Owner update own workspace" on public.workspaces for update to authenticated
  using (id = current_workspace_id() and current_member_role() = 'owner')
  with check (id = current_workspace_id() and current_member_role() = 'owner');

-- ─── 6. Team management (teams, team_memberships, workspace_invites) —
--        owner/admin only, scoped to their own workspace ────────────────────
create policy "Staff admin access" on public.teams for all to authenticated
  using (current_member_role() in ('owner', 'admin') and workspace_id = current_workspace_id())
  with check (current_member_role() in ('owner', 'admin') and workspace_id = current_workspace_id());

create policy "Staff admin access" on public.workspace_invites for all to authenticated
  using (current_member_role() in ('owner', 'admin') and workspace_id = current_workspace_id())
  with check (current_member_role() in ('owner', 'admin') and workspace_id = current_workspace_id());

-- team_memberships has no workspace_id of its own — it's scoped through
-- the team it belongs to.
create policy "Staff admin access" on public.team_memberships for all to authenticated
  using (
    current_member_role() in ('owner', 'admin')
    and exists (select 1 from public.teams t where t.id = team_memberships.team_id and t.workspace_id = current_workspace_id())
  )
  with check (
    current_member_role() in ('owner', 'admin')
    and exists (select 1 from public.teams t where t.id = team_memberships.team_id and t.workspace_id = current_workspace_id())
  );

-- ─── 7. Finance — owner/admin only, own workspace, no client access ─────────
create policy "Staff finance access" on public.invoices for all to authenticated
  using (current_member_role() in ('owner', 'admin') and workspace_id = current_workspace_id())
  with check (current_member_role() in ('owner', 'admin') and workspace_id = current_workspace_id());
create policy "Client view own invoices" on public.invoices for select to authenticated
  using (client_id = current_client_id());

create policy "Staff finance access" on public.expenses for all to authenticated
  using (current_member_role() in ('owner', 'admin') and workspace_id = current_workspace_id())
  with check (current_member_role() in ('owner', 'admin') and workspace_id = current_workspace_id());

-- ─── 8. Integrations (webhooks) — owner/admin only, own workspace ───────────
create policy "Staff admin access" on public.webhooks for all to authenticated
  using (current_member_role() in ('owner', 'admin') and workspace_id = current_workspace_id())
  with check (current_member_role() in ('owner', 'admin') and workspace_id = current_workspace_id());

-- ─── 9. Activity Log — anyone active can log to their own workspace, only
--        owner/admin can view it ────────────────────────────────────────────
create policy "Staff view activity" on public.activity_log for select to authenticated
  using (current_member_role() in ('owner', 'admin') and workspace_id = current_workspace_id());
create policy "Staff log activity" on public.activity_log for insert to authenticated
  with check (current_member_role() is not null and workspace_id = current_workspace_id());

-- ─── 10. Team members — see your own workspace's roster only ───────────────
create policy "Staff view team" on public.team_members for select to authenticated
  using (current_member_role() is not null and workspace_id = current_workspace_id());
create policy "View own row" on public.team_members for select to authenticated
  using (user_id = auth.uid());
create policy "Staff invite members" on public.team_members for insert to authenticated
  with check (current_member_role() in ('owner', 'admin') and workspace_id = current_workspace_id());
create policy "Staff update team" on public.team_members for update to authenticated
  using ((current_member_role() in ('owner', 'admin') and workspace_id = current_workspace_id()) or user_id = auth.uid())
  with check ((current_member_role() in ('owner', 'admin') and workspace_id = current_workspace_id()) or user_id = auth.uid());
create policy "Staff remove members" on public.team_members for delete to authenticated
  using (current_member_role() in ('owner', 'admin') and workspace_id = current_workspace_id());

-- ─── 11. Clients, Projects, Tasks, Files, Content — staff (any role) see
--         everything in their OWN workspace; clients only their own rows ───
create policy "Staff view all clients" on public.clients for select to authenticated
  using (current_member_role() is not null and workspace_id = current_workspace_id());
create policy "Client view own record" on public.clients for select to authenticated
  using (id = current_client_id());
create policy "Staff create clients" on public.clients for insert to authenticated
  with check (current_member_role() is not null and workspace_id = current_workspace_id());
create policy "Staff update clients" on public.clients for update to authenticated
  using (current_member_role() is not null and workspace_id = current_workspace_id())
  with check (current_member_role() is not null and workspace_id = current_workspace_id());
create policy "Staff delete clients" on public.clients for delete to authenticated
  using (current_member_role() is not null and workspace_id = current_workspace_id());

do $$
declare tbl text;
begin
  foreach tbl in array array['projects', 'tasks', 'files'] loop
    execute format('create policy "Staff full access" on public.%I for all to authenticated using (current_member_role() is not null and workspace_id = current_workspace_id()) with check (current_member_role() is not null and workspace_id = current_workspace_id())', tbl);
    execute format('create policy "Client view own" on public.%I for select to authenticated using (client_id = current_client_id())', tbl);
  end loop;
end $$;

create policy "Staff full access" on public.content_posts for all to authenticated
  using (current_member_role() is not null and workspace_id = current_workspace_id())
  with check (current_member_role() is not null and workspace_id = current_workspace_id());
create policy "Client view own content" on public.content_posts for select to authenticated
  using (client_id = current_client_id());
create policy "Client update own content status" on public.content_posts for update to authenticated
  using (client_id = current_client_id())
  with check (client_id = current_client_id());

-- ─── 12. Everything else — staff-only, scoped to their own workspace ────────
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
    execute format('create policy "Staff access" on public.%I for all to authenticated using (current_member_role() is not null and workspace_id = current_workspace_id()) with check (current_member_role() is not null and workspace_id = current_workspace_id())', tbl);
  end loop;
end $$;

create policy "View own notifications" on public.notifications for select to authenticated
  using ((recipient_id = public.current_member_id() or current_member_role() in ('owner', 'admin')) and workspace_id = current_workspace_id());
create policy "Staff create notifications" on public.notifications for insert to authenticated
  with check (current_member_role() is not null and workspace_id = current_workspace_id());
create policy "Update own notifications" on public.notifications for update to authenticated
  using ((recipient_id = public.current_member_id() or current_member_role() in ('owner', 'admin')) and workspace_id = current_workspace_id())
  with check ((recipient_id = public.current_member_id() or current_member_role() in ('owner', 'admin')) and workspace_id = current_workspace_id());
create policy "Delete own notifications" on public.notifications for delete to authenticated
  using ((recipient_id = public.current_member_id() or current_member_role() in ('owner', 'admin')) and workspace_id = current_workspace_id());

create policy "Staff admin access" on public.client_invites for all to authenticated
  using (current_member_role() in ('owner', 'admin') and workspace_id = current_workspace_id())
  with check (current_member_role() in ('owner', 'admin') and workspace_id = current_workspace_id());
