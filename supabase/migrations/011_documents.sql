-- Documents, Folders, and enhanced Files

create table if not exists public.folders (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  project_id  uuid references public.projects(id) on delete cascade,
  parent_id   uuid references public.folders(id) on delete cascade,
  created_by  uuid references public.team_members(id) on delete set null,
  created_at  timestamptz default now()
);

create table if not exists public.documents (
  id          uuid primary key default gen_random_uuid(),
  title       text not null default 'Untitled',
  content     jsonb default '[]',
  project_id  uuid references public.projects(id) on delete cascade,
  task_id     uuid references public.tasks(id) on delete set null,
  folder_id   uuid references public.folders(id) on delete set null,
  created_by  uuid references public.team_members(id) on delete set null,
  updated_by  uuid references public.team_members(id) on delete set null,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create table if not exists public.document_versions (
  id          uuid primary key default gen_random_uuid(),
  document_id uuid references public.documents(id) on delete cascade not null,
  title       text,
  content     jsonb default '[]',
  created_by  uuid references public.team_members(id) on delete set null,
  created_at  timestamptz default now()
);

alter table public.files
  add column if not exists folder_id uuid references public.folders(id) on delete set null;

create index if not exists documents_project_idx on public.documents(project_id);
create index if not exists documents_task_idx on public.documents(task_id);
create index if not exists document_versions_doc_idx on public.document_versions(document_id);
create index if not exists folders_project_idx on public.folders(project_id);
create index if not exists folders_parent_idx on public.folders(parent_id);
create index if not exists files_folder_idx on public.files(folder_id);
