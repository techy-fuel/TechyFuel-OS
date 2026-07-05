-- Time tracking: a start/stop timer per task. One open row (ended_at is
-- null) at a time per member represents "the timer that's currently
-- running" -- stopping it fills in ended_at + duration_seconds so totals
-- can be summed without recomputing timestamps every read.
create table if not exists public.time_entries (
  id               uuid primary key default uuid_generate_v4(),
  task_id          uuid references public.tasks(id) on delete cascade not null,
  member_id        uuid references public.team_members(id) on delete set null,
  workspace_id     uuid references public.workspaces(id) on delete cascade not null default public.current_workspace_id(),
  started_at       timestamptz not null default now(),
  ended_at         timestamptz,
  duration_seconds int,
  created_at       timestamptz default now()
);

create index if not exists time_entries_task_id_idx on public.time_entries(task_id);
create index if not exists time_entries_member_id_idx on public.time_entries(member_id);
create index if not exists time_entries_workspace_id_idx on public.time_entries(workspace_id);

alter table public.time_entries enable row level security;

drop policy if exists "Staff full access" on public.time_entries;
create policy "Staff full access" on public.time_entries for all to authenticated
  using (current_member_role() is not null and workspace_id = current_workspace_id())
  with check (current_member_role() is not null and workspace_id = current_workspace_id());
