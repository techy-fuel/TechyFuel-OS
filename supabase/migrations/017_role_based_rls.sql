-- Real database-level role enforcement.
--
-- Until now every table's RLS policy was "using (true)" for anon AND
-- authenticated — the UI hid screens for the 'member' role and scoped
-- the client portal by client_id, but anyone with the public anon key
-- could call Supabase directly and read/write everything regardless
-- of role. This migration:
--   1. Links auth.users -> team_members / clients so we know who's
--      signed in and what they're allowed to see.
--   2. Adds current_member_role() / current_client_id() helpers.
--   3. Replaces the open policies on the sensitive tables (Finance,
--      Team management, Integrations, Workspace, Activity Log) with
--      owner/admin-only ones.
--   4. Scopes client-facing tables (clients, projects, tasks, files,
--      content_posts) so a client can only ever see their own rows,
--      while staff (any role) still see everything.
--
-- Tables NOT touched here (messages/channels, documents, automations,
-- pipeline_deals, ad_campaigns, notifications, etc.) keep their
-- existing open policies — this pass covers the specific
-- owner/admin/member/client split that was requested, not a full
-- security audit of every table.

-- ─── 1. Link auth.users to team_members / clients ───────────────────────────
alter table public.clients add column if not exists user_id uuid references auth.users(id) on delete set null;
create index if not exists clients_user_id_idx on public.clients(user_id);
create unique index if not exists team_members_user_id_idx on public.team_members(user_id) where user_id is not null;

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Was this email already pre-added as a team member (invited)? Just link it.
  update public.team_members set user_id = new.id where email = new.email and user_id is null;
  if found then
    return new;
  end if;

  -- Or pre-added as a client contact? Link that instead.
  update public.clients set user_id = new.id where email = new.email and user_id is null;
  if found then
    return new;
  end if;

  -- Brand-new signup with no existing invite anywhere — treat as a new
  -- agency owner so the first person to sign up isn't locked out.
  insert into public.team_members (user_id, name, email, role, status)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)), new.email, 'owner', 'active')
  on conflict (email) do update set user_id = excluded.user_id;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();

-- Backfill anyone who already signed up before this trigger existed.
update public.team_members tm set user_id = au.id
  from auth.users au where tm.email = au.email and tm.user_id is null;
update public.clients c set user_id = au.id
  from auth.users au where c.email = au.email and c.user_id is null;

-- ─── 2. Helper functions (security definer so they bypass RLS on the
--        tables they read — the standard pattern for avoiding recursive
--        policy checks) ─────────────────────────────────────────────────────
create or replace function public.current_member_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.team_members where user_id = auth.uid() and status = 'active' limit 1;
$$;

create or replace function public.current_client_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id from public.clients where user_id = auth.uid() limit 1;
$$;

-- Block role/status self-escalation: only an owner/admin can change
-- someone's role or status, even though the UPDATE policy below allows
-- staff to update their own row (e.g. their own profile fields).
create or replace function public.protect_team_member_role_status()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (new.role is distinct from old.role or new.status is distinct from old.status)
     and coalesce(public.current_member_role(), '') not in ('owner', 'admin') then
    raise exception 'Only owners/admins can change role or status';
  end if;
  return new;
end;
$$;

drop trigger if exists protect_role_status on public.team_members;
create trigger protect_role_status
  before update on public.team_members
  for each row execute function public.protect_team_member_role_status();

-- ─── 3. Clear every existing policy on the tables we're re-securing ─────────
do $$
declare
  pol  record;
  tbl  text;
begin
  foreach tbl in array array[
    'invoices', 'expenses', 'webhooks',
    'workspaces', 'teams', 'team_memberships', 'workspace_invites',
    'activity_log', 'team_members', 'clients', 'projects', 'tasks',
    'files', 'content_posts'
  ] loop
    for pol in select policyname from pg_policies where schemaname = 'public' and tablename = tbl loop
      execute format('drop policy if exists %I on public.%I', pol.policyname, tbl);
    end loop;
  end loop;
end $$;

-- ─── 4. Finance — owner/admin only, no client access ────────────────────────
create policy "Staff finance access" on public.invoices for all to authenticated
  using (current_member_role() in ('owner', 'admin'))
  with check (current_member_role() in ('owner', 'admin'));
create policy "Client view own invoices" on public.invoices for select to authenticated
  using (client_id = current_client_id());

create policy "Staff finance access" on public.expenses for all to authenticated
  using (current_member_role() in ('owner', 'admin'))
  with check (current_member_role() in ('owner', 'admin'));

-- ─── 5. Integrations (webhooks) — owner/admin only ──────────────────────────
create policy "Staff admin access" on public.webhooks for all to authenticated
  using (current_member_role() in ('owner', 'admin'))
  with check (current_member_role() in ('owner', 'admin'));

-- ─── 6. Workspace management — owner/admin only ─────────────────────────────
do $$
declare tbl text;
begin
  foreach tbl in array array['workspaces', 'teams', 'team_memberships', 'workspace_invites'] loop
    execute format('create policy "Staff admin access" on public.%I for all to authenticated using (current_member_role() in (''owner'',''admin'')) with check (current_member_role() in (''owner'',''admin''))', tbl);
  end loop;
end $$;

-- ─── 7. Activity Log — anyone active can log, only owner/admin can view ─────
create policy "Staff view activity" on public.activity_log for select to authenticated
  using (current_member_role() in ('owner', 'admin'));
create policy "Staff log activity" on public.activity_log for insert to authenticated
  with check (current_member_role() is not null);

-- ─── 8. Team members — everyone on staff can see the roster (names/avatars
--        for assignees, chat, etc.), only owner/admin can invite/edit/suspend.
--        Staff can still update their own row (e.g. their profile fields) —
--        the trigger above stops them from touching role/status themselves.
create policy "Staff view team" on public.team_members for select to authenticated
  using (current_member_role() is not null);
-- Always let someone see their own row regardless of status — this is what
-- lets a suspended user's client actually detect "you're suspended" and show
-- that screen, instead of getting silently blocked and looking broken.
create policy "View own row" on public.team_members for select to authenticated
  using (user_id = auth.uid());
create policy "Staff invite members" on public.team_members for insert to authenticated
  with check (current_member_role() in ('owner', 'admin'));
create policy "Staff update team" on public.team_members for update to authenticated
  using (current_member_role() in ('owner', 'admin') or user_id = auth.uid())
  with check (current_member_role() in ('owner', 'admin') or user_id = auth.uid());
create policy "Staff remove members" on public.team_members for delete to authenticated
  using (current_member_role() in ('owner', 'admin'));

-- ─── 9. Clients, Projects, Tasks, Files, Content — staff (any role) see
--        everything, clients only ever see their own rows ──────────────────
create policy "Staff view all clients" on public.clients for select to authenticated
  using (current_member_role() is not null);
create policy "Client view own record" on public.clients for select to authenticated
  using (id = current_client_id());
create policy "Staff create clients" on public.clients for insert to authenticated
  with check (current_member_role() is not null);
create policy "Staff update clients" on public.clients for update to authenticated
  using (current_member_role() is not null)
  with check (current_member_role() is not null);
-- Delete stays open to any staff role (not owner/admin-only) since the CRM
-- delete button isn't currently gated by role in the UI — restricting it
-- at the DB level alone would make a member's delete silently no-op
-- (RLS blocks 0 rows without an error) while their screen still shows it
-- as removed until the next reload.
create policy "Staff delete clients" on public.clients for delete to authenticated
  using (current_member_role() is not null);

do $$
declare tbl text;
begin
  foreach tbl in array array['projects', 'tasks', 'files'] loop
    execute format('create policy "Staff full access" on public.%I for all to authenticated using (current_member_role() is not null) with check (current_member_role() is not null)', tbl);
    execute format('create policy "Client view own" on public.%I for select to authenticated using (client_id = current_client_id())', tbl);
  end loop;
end $$;

-- Content posts: clients can also flip status (approve/reject) on their own posts.
create policy "Staff full access" on public.content_posts for all to authenticated
  using (current_member_role() is not null)
  with check (current_member_role() is not null);
create policy "Client view own content" on public.content_posts for select to authenticated
  using (client_id = current_client_id());
create policy "Client update own content status" on public.content_posts for update to authenticated
  using (client_id = current_client_id())
  with check (client_id = current_client_id());
