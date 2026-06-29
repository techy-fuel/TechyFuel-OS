-- Allow tasks to be assigned/visible to a specific client
alter table public.tasks
  add column if not exists client_id uuid references public.clients(id) on delete set null;

create index if not exists tasks_client_id_idx on public.tasks(client_id);
