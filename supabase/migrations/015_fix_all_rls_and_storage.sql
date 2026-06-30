-- Fix RLS for all tables added in migrations 009-014, and create storage buckets

-- ─── Enable RLS on new tables ───────────────────────────────────────────────
alter table if exists public.channels            enable row level security;
alter table if exists public.channel_members     enable row level security;
alter table if exists public.messages            enable row level security;
alter table if exists public.message_reactions   enable row level security;
alter table if exists public.automation_rules    enable row level security;
alter table if exists public.task_templates      enable row level security;
alter table if exists public.webhooks            enable row level security;
alter table if exists public.approval_requests   enable row level security;
alter table if exists public.folders             enable row level security;
alter table if exists public.documents           enable row level security;
alter table if exists public.document_versions   enable row level security;
alter table if exists public.notifications       enable row level security;
alter table if exists public.client_notes        enable row level security;
alter table if exists public.client_invites      enable row level security;
alter table if exists public.workspaces          enable row level security;
alter table if exists public.teams               enable row level security;
alter table if exists public.team_memberships    enable row level security;
alter table if exists public.workspace_invites   enable row level security;
alter table if exists public.call_sessions       enable row level security;

-- ─── Grant anon full access to all new tables ────────────────────────────────
do $$
declare
  tbl text;
begin
  foreach tbl in array array[
    'channels','channel_members','messages','message_reactions',
    'automation_rules','task_templates','webhooks','approval_requests',
    'folders','documents','document_versions',
    'notifications','client_notes','client_invites',
    'workspaces','teams','team_memberships','workspace_invites',
    'call_sessions'
  ] loop
    execute format('drop policy if exists "Public access" on public.%I', tbl);
    execute format(
      'create policy "Public access" on public.%I for all to anon, authenticated using (true) with check (true)',
      tbl
    );
  end loop;
end $$;

-- ─── Storage buckets ─────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('project-files', 'project-files', true, 52428800, null),
  ('files',         'files',         true, 52428800, null),
  ('avatars',       'avatars',       true, 5242880,  null)
on conflict (id) do update set
  public          = excluded.public,
  file_size_limit = excluded.file_size_limit;

-- ─── Storage RLS ─────────────────────────────────────────────────────────────
drop policy if exists "tf anon storage all" on storage.objects;
create policy "tf anon storage all" on storage.objects
  for all to anon, authenticated
  using  (bucket_id in ('project-files', 'files', 'avatars'))
  with check (bucket_id in ('project-files', 'files', 'avatars'));
