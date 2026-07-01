-- App-wide activity log
create table if not exists public.activity_log (
  id          uuid primary key default gen_random_uuid(),
  actor_id    uuid references public.team_members(id) on delete set null,
  actor_name  text,
  action      text not null,        -- 'created' | 'updated' | 'deleted' | 'uploaded' | 'invited' | ...
  entity_type text not null,        -- 'task' | 'project' | 'client' | 'document' | 'file' | 'team_member' | ...
  entity_id   uuid,
  entity_name text,
  meta        jsonb,
  created_at  timestamptz default now()
);

create index if not exists activity_log_created_idx on public.activity_log(created_at desc);
create index if not exists activity_log_entity_idx on public.activity_log(entity_type);

alter table public.activity_log enable row level security;

drop policy if exists "Public access" on public.activity_log;
create policy "Public access" on public.activity_log for all to anon, authenticated using (true) with check (true);
