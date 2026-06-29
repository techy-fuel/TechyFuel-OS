-- Call sessions tracking
create table if not exists public.call_sessions (
  id            uuid primary key default gen_random_uuid(),
  channel_id    uuid references public.channels(id) on delete cascade,
  type          text default 'video',  -- 'audio' | 'video'
  room_name     text not null,
  started_by    uuid references public.team_members(id) on delete set null,
  started_at    timestamptz default now(),
  ended_at      timestamptz,
  recording_url text,
  participant_count integer default 0
);

create index if not exists call_sessions_channel_idx on public.call_sessions(channel_id);
create index if not exists call_sessions_active_idx on public.call_sessions(ended_at) where ended_at is null;
