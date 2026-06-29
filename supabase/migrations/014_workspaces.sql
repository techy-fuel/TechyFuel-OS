-- Workspaces & Teams (sub-groups)
create table if not exists public.workspaces (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text unique,
  logo_url    text,
  description text,
  plan        text default 'free',  -- free | pro | enterprise
  owner_id    uuid references public.team_members(id) on delete set null,
  created_at  timestamptz default now()
);

-- Each member belongs to one workspace
alter table public.team_members
  add column if not exists workspace_id uuid references public.workspaces(id) on delete cascade,
  add column if not exists access_level text default 'member'; -- owner | admin | member | guest

-- Sub-teams within a workspace (Design, Dev, Marketing, etc.)
create table if not exists public.teams (
  id           uuid primary key default gen_random_uuid(),
  workspace_id uuid references public.workspaces(id) on delete cascade,
  name         text not null,
  color        text default '#3b82f6',
  icon         text default 'users',
  description  text,
  created_at   timestamptz default now()
);

-- Team membership
create table if not exists public.team_memberships (
  id        uuid primary key default gen_random_uuid(),
  team_id   uuid references public.teams(id) on delete cascade not null,
  member_id uuid references public.team_members(id) on delete cascade not null,
  role      text default 'member',  -- lead | member
  joined_at timestamptz default now(),
  unique(team_id, member_id)
);

-- Workspace invites
create table if not exists public.workspace_invites (
  id           uuid primary key default gen_random_uuid(),
  workspace_id uuid references public.workspaces(id) on delete cascade,
  email        text,
  token        text unique not null default encode(gen_random_bytes(20), 'hex'),
  role         text default 'member',
  invited_by   uuid references public.team_members(id) on delete set null,
  accepted_at  timestamptz,
  expires_at   timestamptz default (now() + interval '7 days'),
  created_at   timestamptz default now()
);

create index if not exists teams_workspace_idx on public.teams(workspace_id);
create index if not exists team_memberships_team_idx on public.team_memberships(team_id);
create index if not exists team_memberships_member_idx on public.team_memberships(member_id);
create index if not exists workspace_invites_token_idx on public.workspace_invites(token);

-- Seed a default workspace
insert into public.workspaces (id, name, slug, description, plan)
values ('aaaaaaaa-0000-0000-0000-000000000001', 'My Agency', 'my-agency', 'Default workspace', 'pro')
on conflict do nothing;

-- Seed default sub-teams
insert into public.teams (workspace_id, name, color, icon) values
  ('aaaaaaaa-0000-0000-0000-000000000001', 'Design',      '#8b5cf6', 'pen-tool'),
  ('aaaaaaaa-0000-0000-0000-000000000001', 'Development', '#3b82f6', 'code'),
  ('aaaaaaaa-0000-0000-0000-000000000001', 'Marketing',   '#f59e0b', 'megaphone'),
  ('aaaaaaaa-0000-0000-0000-000000000001', 'Leadership',  '#10b981', 'crown')
on conflict do nothing;
