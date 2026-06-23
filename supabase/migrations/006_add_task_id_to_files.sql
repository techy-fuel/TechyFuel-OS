-- Link files to tasks
alter table public.files
  add column if not exists task_id uuid references public.tasks(id) on delete set null;

create index if not exists files_task_id_idx on public.files(task_id);
