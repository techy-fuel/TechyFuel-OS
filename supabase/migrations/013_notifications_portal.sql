-- Notifications
create table if not exists public.notifications (
  id           uuid primary key default gen_random_uuid(),
  recipient_id uuid references public.team_members(id) on delete cascade,
  type         text not null,  -- task_assigned | task_overdue | task_done | mention | approval | project_created | client_action
  title        text not null,
  body         text,
  link_screen  text,           -- tasks | projects | pipeline | etc.
  link_id      uuid,
  read         boolean default false,
  created_at   timestamptz default now()
);

-- Client portal private notes (team-only)
create table if not exists public.client_notes (
  id          uuid primary key default gen_random_uuid(),
  client_id   uuid references public.clients(id) on delete cascade not null,
  project_id  uuid references public.projects(id) on delete cascade,
  content     text not null,
  created_by  uuid references public.team_members(id) on delete set null,
  created_at  timestamptz default now()
);

-- Client invites / portal access tokens
create table if not exists public.client_invites (
  id          uuid primary key default gen_random_uuid(),
  client_id   uuid references public.clients(id) on delete cascade not null,
  token       text unique not null default encode(gen_random_bytes(24), 'hex'),
  expires_at  timestamptz,
  created_at  timestamptz default now()
);

create index if not exists notifications_recipient_idx on public.notifications(recipient_id);
create index if not exists notifications_read_idx on public.notifications(read) where not read;
create index if not exists client_notes_client_idx on public.client_notes(client_id);
create index if not exists client_invites_token_idx on public.client_invites(token);
