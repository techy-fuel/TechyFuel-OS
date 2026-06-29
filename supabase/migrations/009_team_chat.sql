-- Team Chat: channels, messages, reactions
create table if not exists public.channels (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  type        text not null default 'channel', -- 'channel' | 'dm' | 'group'
  project_id  uuid references public.projects(id) on delete cascade,
  description text,
  is_private  boolean default false,
  created_by  uuid references public.team_members(id) on delete set null,
  created_at  timestamptz default now()
);

create table if not exists public.channel_members (
  id          uuid primary key default gen_random_uuid(),
  channel_id  uuid references public.channels(id) on delete cascade not null,
  member_id   uuid references public.team_members(id) on delete cascade not null,
  joined_at   timestamptz default now(),
  unique(channel_id, member_id)
);

create table if not exists public.messages (
  id               uuid primary key default gen_random_uuid(),
  channel_id       uuid references public.channels(id) on delete cascade not null,
  sender_id        uuid references public.team_members(id) on delete set null,
  content          text,
  thread_parent_id uuid references public.messages(id) on delete cascade,
  pinned           boolean default false,
  file_url         text,
  file_name        text,
  file_size        bigint,
  file_type        text,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

create table if not exists public.message_reactions (
  id          uuid primary key default gen_random_uuid(),
  message_id  uuid references public.messages(id) on delete cascade not null,
  member_id   uuid references public.team_members(id) on delete cascade not null,
  emoji       text not null,
  created_at  timestamptz default now(),
  unique(message_id, member_id, emoji)
);

-- Indexes
create index if not exists messages_channel_id_idx on public.messages(channel_id);
create index if not exists messages_thread_parent_idx on public.messages(thread_parent_id);
create index if not exists channel_members_channel_idx on public.channel_members(channel_id);
create index if not exists channel_members_member_idx on public.channel_members(member_id);
create index if not exists message_reactions_msg_idx on public.message_reactions(message_id);

-- Seed default channels
insert into public.channels (name, type, description) values
  ('general',             'channel', 'Company-wide announcements and updates'),
  ('announcements',       'channel', 'Important team announcements'),
  ('design-feedback',     'channel', 'Share and review design work')
on conflict do nothing;
