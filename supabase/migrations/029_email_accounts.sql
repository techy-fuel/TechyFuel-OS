-- Per-member email account connections (IMAP/SMTP), so each team member can
-- connect their own mailbox instead of only the one shared inbox configured
-- via Vercel env vars. Deliberately has NO RLS policies for
-- anon/authenticated -- the encrypted_password column must never be
-- reachable through the client-side Supabase key at all, only through the
-- api/email-*.js serverless functions using the service-role key, which
-- enforce "you can only see/use your own accounts" in application code
-- (not RLS) after verifying the caller's identity from their JWT.
create table if not exists public.email_accounts (
  id                uuid primary key default gen_random_uuid(),
  workspace_id      uuid references public.workspaces(id) on delete cascade not null,
  member_id         uuid references public.team_members(id) on delete cascade not null,
  label             text not null,
  email             text not null,
  imap_host         text not null,
  imap_port         int not null default 993,
  smtp_host         text not null,
  smtp_port         int not null default 465,
  from_name         text,
  encrypted_password text not null,
  password_iv       text not null,
  password_tag      text not null,
  created_at        timestamptz default now()
);

create index if not exists email_accounts_member_idx on public.email_accounts(member_id);

alter table public.email_accounts enable row level security;
-- No policies created on purpose -- default-deny for anon/authenticated.
