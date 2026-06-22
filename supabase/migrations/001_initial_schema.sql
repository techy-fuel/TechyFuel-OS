-- TechyFuel OS — Initial Schema
-- Covers: Team, Clients/CRM, Projects, Tasks, Pipeline, Content, Finance, Files, Meta Ads

-- ─────────────────────────────────────────
-- EXTENSIONS
-- ─────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────
-- TEAM MEMBERS
-- ─────────────────────────────────────────
create table public.team_members (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references auth.users(id) on delete set null,
  name        text not null,
  email       text unique not null,
  role        text not null default 'member',  -- owner | admin | member
  avatar_url  text,
  department  text,
  status      text not null default 'active',  -- active | invited | inactive
  joined_at   timestamptz default now(),
  created_at  timestamptz default now()
);

-- ─────────────────────────────────────────
-- CLIENTS (CRM)
-- ─────────────────────────────────────────
create table public.clients (
  id            uuid primary key default uuid_generate_v4(),
  name          text not null,
  company       text,
  email         text,
  phone         text,
  website       text,
  status        text not null default 'active',  -- active | inactive | lead
  avatar_url    text,
  industry      text,
  monthly_value numeric(10,2) default 0,
  notes         text,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- ─────────────────────────────────────────
-- PROJECTS
-- ─────────────────────────────────────────
create table public.projects (
  id           uuid primary key default uuid_generate_v4(),
  client_id    uuid references public.clients(id) on delete set null,
  name         text not null,
  description  text,
  status       text not null default 'active',  -- active | paused | completed | archived
  priority     text not null default 'medium',  -- low | medium | high
  start_date   date,
  due_date     date,
  budget       numeric(10,2),
  spent        numeric(10,2) default 0,
  progress     int default 0 check (progress >= 0 and progress <= 100),
  created_by   uuid references public.team_members(id) on delete set null,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- Project <-> Team members (many-to-many)
create table public.project_members (
  project_id  uuid references public.projects(id) on delete cascade,
  member_id   uuid references public.team_members(id) on delete cascade,
  role        text default 'member',
  primary key (project_id, member_id)
);

-- ─────────────────────────────────────────
-- TASKS
-- ─────────────────────────────────────────
create table public.tasks (
  id           uuid primary key default uuid_generate_v4(),
  project_id   uuid references public.projects(id) on delete cascade,
  client_id    uuid references public.clients(id) on delete set null,
  title        text not null,
  description  text,
  status       text not null default 'todo',  -- todo | in_progress | review | done
  priority     text not null default 'medium', -- low | medium | high | urgent
  assigned_to  uuid references public.team_members(id) on delete set null,
  due_date     date,
  tags         text[],
  created_by   uuid references public.team_members(id) on delete set null,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- ─────────────────────────────────────────
-- SALES PIPELINE
-- ─────────────────────────────────────────
create table public.pipeline_deals (
  id            uuid primary key default uuid_generate_v4(),
  client_id     uuid references public.clients(id) on delete set null,
  title         text not null,
  value         numeric(10,2) default 0,
  stage         text not null default 'lead',  -- lead | qualified | proposal | negotiation | won | lost
  probability   int default 0 check (probability >= 0 and probability <= 100),
  expected_close date,
  assigned_to   uuid references public.team_members(id) on delete set null,
  notes         text,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- ─────────────────────────────────────────
-- CONTENT CALENDAR
-- ─────────────────────────────────────────
create table public.content_posts (
  id            uuid primary key default uuid_generate_v4(),
  client_id     uuid references public.clients(id) on delete cascade,
  title         text not null,
  caption       text,
  platform      text not null,  -- instagram | facebook | twitter | linkedin | tiktok
  status        text not null default 'draft',  -- draft | scheduled | published | rejected
  scheduled_at  timestamptz,
  published_at  timestamptz,
  media_urls    text[],
  tags          text[],
  assigned_to   uuid references public.team_members(id) on delete set null,
  created_by    uuid references public.team_members(id) on delete set null,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- ─────────────────────────────────────────
-- META ADS
-- ─────────────────────────────────────────
create table public.ad_campaigns (
  id            uuid primary key default uuid_generate_v4(),
  client_id     uuid references public.clients(id) on delete cascade,
  name          text not null,
  platform      text not null default 'meta',  -- meta | google | tiktok
  status        text not null default 'active',  -- active | paused | ended | draft
  budget_daily  numeric(10,2),
  budget_total  numeric(10,2),
  spent         numeric(10,2) default 0,
  impressions   bigint default 0,
  clicks        bigint default 0,
  conversions   bigint default 0,
  start_date    date,
  end_date      date,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- ─────────────────────────────────────────
-- FINANCE
-- ─────────────────────────────────────────
create table public.invoices (
  id           uuid primary key default uuid_generate_v4(),
  client_id    uuid references public.clients(id) on delete set null,
  project_id   uuid references public.projects(id) on delete set null,
  invoice_no   text unique not null,
  status       text not null default 'draft',  -- draft | sent | paid | overdue | cancelled
  amount       numeric(10,2) not null,
  tax          numeric(10,2) default 0,
  due_date     date,
  paid_at      timestamptz,
  notes        text,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

create table public.expenses (
  id           uuid primary key default uuid_generate_v4(),
  project_id   uuid references public.projects(id) on delete set null,
  client_id    uuid references public.clients(id) on delete set null,
  category     text not null,  -- tools | ads | freelance | office | other
  description  text not null,
  amount       numeric(10,2) not null,
  date         date not null default current_date,
  receipt_url  text,
  created_by   uuid references public.team_members(id) on delete set null,
  created_at   timestamptz default now()
);

-- ─────────────────────────────────────────
-- FILES
-- ─────────────────────────────────────────
create table public.files (
  id           uuid primary key default uuid_generate_v4(),
  project_id   uuid references public.projects(id) on delete set null,
  client_id    uuid references public.clients(id) on delete set null,
  name         text not null,
  file_path    text not null,  -- Supabase Storage path
  file_size    bigint,
  mime_type    text,
  uploaded_by  uuid references public.team_members(id) on delete set null,
  created_at   timestamptz default now()
);

-- ─────────────────────────────────────────
-- UPDATED_AT TRIGGERS
-- ─────────────────────────────────────────
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at before update on public.clients        for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.projects       for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.tasks          for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.pipeline_deals for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.content_posts  for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.ad_campaigns   for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.invoices       for each row execute function public.handle_updated_at();

-- ─────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────────
alter table public.team_members   enable row level security;
alter table public.clients        enable row level security;
alter table public.projects       enable row level security;
alter table public.project_members enable row level security;
alter table public.tasks          enable row level security;
alter table public.pipeline_deals enable row level security;
alter table public.content_posts  enable row level security;
alter table public.ad_campaigns   enable row level security;
alter table public.invoices       enable row level security;
alter table public.expenses       enable row level security;
alter table public.files          enable row level security;

-- For now: authenticated users can read/write all (multi-tenant RLS can be added later)
create policy "Authenticated full access" on public.team_members   for all to authenticated using (true) with check (true);
create policy "Authenticated full access" on public.clients        for all to authenticated using (true) with check (true);
create policy "Authenticated full access" on public.projects       for all to authenticated using (true) with check (true);
create policy "Authenticated full access" on public.project_members for all to authenticated using (true) with check (true);
create policy "Authenticated full access" on public.tasks          for all to authenticated using (true) with check (true);
create policy "Authenticated full access" on public.pipeline_deals for all to authenticated using (true) with check (true);
create policy "Authenticated full access" on public.content_posts  for all to authenticated using (true) with check (true);
create policy "Authenticated full access" on public.ad_campaigns   for all to authenticated using (true) with check (true);
create policy "Authenticated full access" on public.invoices       for all to authenticated using (true) with check (true);
create policy "Authenticated full access" on public.expenses       for all to authenticated using (true) with check (true);
create policy "Authenticated full access" on public.files          for all to authenticated using (true) with check (true);
