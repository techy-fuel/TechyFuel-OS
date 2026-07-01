-- Slack-style multi-workspace membership: one login, many workspaces,
-- switchable. 019 gave every user exactly one workspace (team_members.user_id
-- was unique) — that's why "Create workspace" in the UI silently failed:
-- there was no INSERT policy for it at all, since the whole model assumed
-- one user = one workspace forever.
--
--   1. A person can now have one team_members row PER workspace they belong
--      to (email is unique per-workspace, not globally; user_id is unique
--      per-workspace, not globally).
--   2. user_active_workspace tracks which of a user's workspaces is
--      "current" for this session — switchable from the UI.
--   3. current_workspace_id() reads the active workspace (falling back to
--      their oldest membership if none set yet); current_member_role() and
--      current_member_id() are now resolved WITHIN that active workspace,
--      since the same person can hold different roles in different
--      workspaces.
--   4. create_workspace() is a proper RPC: creates the workspace, the
--      caller's owner membership in it, and switches them to it, in one
--      atomic call — this is what "Create workspace" in the UI now calls
--      instead of a bare table insert.
--   5. The signup trigger links a new auth user to EVERY pre-existing
--      invite under their email (across however many workspaces invited
--      them), not just one, and picks one as their initial active
--      workspace.

-- ─── 1. Loosen the per-user uniqueness on team_members ──────────────────────
drop index if exists public.team_members_user_id_idx;
alter table public.team_members drop constraint if exists team_members_email_key;
create unique index if not exists team_members_email_workspace_idx on public.team_members(email, workspace_id);
create unique index if not exists team_members_user_workspace_idx on public.team_members(user_id, workspace_id) where user_id is not null;

-- ─── 2. Active-workspace tracker ─────────────────────────────────────────────
create table if not exists public.user_active_workspace (
  user_id      uuid primary key references auth.users(id) on delete cascade,
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  updated_at   timestamptz default now()
);
alter table public.user_active_workspace enable row level security;

-- ─── 3. Workspace-scoping helpers, now membership-aware ─────────────────────
create or replace function public.current_workspace_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select workspace_id from public.user_active_workspace where user_id = auth.uid()),
    (select workspace_id from public.team_members where user_id = auth.uid() and status = 'active' order by created_at limit 1)
  );
$$;

create or replace function public.current_member_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.team_members
   where user_id = auth.uid() and status = 'active' and workspace_id = public.current_workspace_id()
   limit 1;
$$;

create or replace function public.current_member_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id from public.team_members
   where user_id = auth.uid() and status = 'active' and workspace_id = public.current_workspace_id()
   limit 1;
$$;

drop policy if exists "Manage own active workspace" on public.user_active_workspace;
create policy "Manage own active workspace" on public.user_active_workspace for all to authenticated
  using (user_id = auth.uid())
  with check (
    user_id = auth.uid()
    and exists (select 1 from public.team_members tm where tm.user_id = auth.uid() and tm.workspace_id = user_active_workspace.workspace_id and tm.status = 'active')
  );

-- ─── 4. Atomic "create an additional workspace" RPC ─────────────────────────
create or replace function public.create_workspace(ws_name text, ws_description text default null)
returns public.workspaces
language plpgsql
security definer
set search_path = public
as $$
declare
  new_ws public.workspaces;
  my_name text;
  my_email text;
begin
  if auth.uid() is null then
    raise exception 'Must be signed in to create a workspace';
  end if;

  select name, email into my_name, my_email from public.team_members where user_id = auth.uid() limit 1;
  if my_email is null then
    select email into my_email from auth.users where id = auth.uid();
    my_name := split_part(my_email, '@', 1);
  end if;

  insert into public.workspaces (name, description)
  values (ws_name, ws_description)
  returning * into new_ws;

  insert into public.team_members (user_id, name, email, role, status, workspace_id)
  values (auth.uid(), my_name, my_email, 'owner', 'active', new_ws.id)
  on conflict (email, workspace_id) do update set user_id = excluded.user_id;

  update public.workspaces set owner_id = (select id from public.team_members where user_id = auth.uid() and workspace_id = new_ws.id) where id = new_ws.id;

  insert into public.user_active_workspace (user_id, workspace_id) values (auth.uid(), new_ws.id)
  on conflict (user_id) do update set workspace_id = excluded.workspace_id, updated_at = now();

  select * into new_ws from public.workspaces where id = new_ws.id;
  return new_ws;
end;
$$;

-- ─── 5. Switch active workspace RPC (validates membership) ─────────────────
create or replace function public.switch_workspace(target_workspace_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (select 1 from public.team_members where user_id = auth.uid() and workspace_id = target_workspace_id and status = 'active') then
    raise exception 'You are not a member of that workspace';
  end if;
  insert into public.user_active_workspace (user_id, workspace_id) values (auth.uid(), target_workspace_id)
  on conflict (user_id) do update set workspace_id = excluded.workspace_id, updated_at = now();
end;
$$;

-- ─── 6. Signup trigger — link every pre-existing invite for this email,
--        across however many workspaces invited them ────────────────────────
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_workspace_id uuid;
  display_name text := coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1));
  linked_ws uuid;
  any_linked boolean := false;
begin
  -- Link every team_members row across every workspace that pre-invited
  -- this email (not just one) — this is what makes "I was invited to two
  -- different agencies under the same email" work like Slack.
  for linked_ws in
    update public.team_members set user_id = new.id where email = new.email and user_id is null
    returning workspace_id
  loop
    any_linked := true;
  end loop;

  if any_linked then
    -- Make their oldest invited workspace the active one to start.
    select workspace_id into linked_ws from public.team_members
     where user_id = new.id order by created_at limit 1;
    insert into public.user_active_workspace (user_id, workspace_id) values (new.id, linked_ws)
    on conflict (user_id) do update set workspace_id = excluded.workspace_id;
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
  on conflict (email, workspace_id) do update set user_id = excluded.user_id;

  update public.workspaces set owner_id = (select id from public.team_members where user_id = new.id and workspace_id = new_workspace_id) where id = new_workspace_id;

  insert into public.user_active_workspace (user_id, workspace_id) values (new.id, new_workspace_id)
  on conflict (user_id) do update set workspace_id = excluded.workspace_id;

  return new;
end;
$$;

-- Backfill: give every existing signed-in user an explicit active-workspace
-- row matching what current_workspace_id() would already resolve to, so
-- behavior doesn't change for anyone currently using the app.
insert into public.user_active_workspace (user_id, workspace_id)
select tm.user_id, tm.workspace_id from public.team_members tm
where tm.user_id is not null and tm.status = 'active'
on conflict (user_id) do nothing;

-- ─── 7. Workspaces — see every workspace you belong to, not just the
--        active one (needed for the workspace switcher) ────────────────────
drop policy if exists "View own workspace" on public.workspaces;
drop policy if exists "Owner update own workspace" on public.workspaces;
create policy "View my workspaces" on public.workspaces for select to authenticated
  using (exists (select 1 from public.team_members tm where tm.workspace_id = workspaces.id and tm.user_id = auth.uid() and tm.status = 'active'));
create policy "Owner update own workspace" on public.workspaces for update to authenticated
  using (id = current_workspace_id() and current_member_role() = 'owner')
  with check (id = current_workspace_id() and current_member_role() = 'owner');
