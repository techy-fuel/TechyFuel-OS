-- Automations: rules, templates, webhooks, approvals

create table if not exists public.automation_rules (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  enabled      boolean default true,
  trigger_type text not null,   -- task_status_change | due_date_approaching | task_created | schedule_weekly | schedule_monthly
  trigger_config jsonb default '{}',
  action_type  text not null,   -- notify_client | send_reminder | assign_task | change_status | create_task | webhook
  action_config jsonb default '{}',
  run_count    integer default 0,
  last_run_at  timestamptz,
  created_by   uuid references public.team_members(id) on delete set null,
  created_at   timestamptz default now()
);

create table if not exists public.task_templates (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  description text,
  tasks       jsonb default '[]',  -- [{title, status, priority, due_offset_days, assigned_role}]
  created_at  timestamptz default now()
);

create table if not exists public.webhooks (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  url              text not null,
  events           text[] default '{}',  -- task.created, task.completed, invoice.paid, etc.
  secret           text,
  enabled          boolean default true,
  last_triggered_at timestamptz,
  last_status      integer,
  created_at       timestamptz default now()
);

create table if not exists public.approval_requests (
  id           uuid primary key default gen_random_uuid(),
  task_id      uuid references public.tasks(id) on delete cascade not null,
  requested_by uuid references public.team_members(id) on delete set null,
  approver_id  uuid references public.team_members(id) on delete set null,
  status       text default 'pending',  -- pending | approved | rejected
  comment      text,
  created_at   timestamptz default now(),
  resolved_at  timestamptz
);

-- Add approval flag to tasks
alter table public.tasks
  add column if not exists requires_approval boolean default false,
  add column if not exists approval_status   text;    -- null | pending | approved | rejected

create index if not exists automation_rules_enabled_idx on public.automation_rules(enabled);
create index if not exists approval_requests_task_idx on public.approval_requests(task_id);
create index if not exists approval_requests_status_idx on public.approval_requests(status);
