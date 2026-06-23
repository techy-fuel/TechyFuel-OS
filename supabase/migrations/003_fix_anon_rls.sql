-- TechyFuel OS — Fix RLS: allow anon key (public app) to read and write all tables
-- Run this in Supabase SQL Editor

do $$
declare
  tbl text;
begin
  foreach tbl in array array[
    'team_members','clients','projects','project_members',
    'tasks','pipeline_deals','content_posts','ad_campaigns',
    'invoices','expenses','files'
  ] loop
    execute format('drop policy if exists "Authenticated full access" on public.%I', tbl);
    execute format(
      'create policy "Public access" on public.%I for all to anon, authenticated using (true) with check (true)',
      tbl
    );
  end loop;
end $$;
