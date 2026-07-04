-- DM channel creation was completely broken: the app creates a DM via
-- `.insert(d).select().single()`, which Postgres/PostgREST turns into
-- `INSERT ... RETURNING ...`. RLS re-checks the SELECT policy against that
-- returned row, and the DM policy requires is_channel_participant() — which,
-- for a brand-new DM, can't yet see the participant row being created in
-- that same round-trip (no channel_members row exists until a *separate*,
-- later insert). So the RETURNING check always failed, and Postgres rolled
-- back the whole INSERT — no DM channel (or its first channel_members row)
-- ever actually got created, even though the UI optimistically showed it.
--
-- Fix: let the channel's creator see it immediately (no participant check
-- needed), and let anyone see their own channel_members row directly. Both
-- break the chicken-and-egg dependency on is_channel_participant() during
-- the very insert that would populate it.

drop policy if exists "Staff access" on public.channels;
create policy "Staff access" on public.channels for all to authenticated
  using (
    current_member_role() is not null and workspace_id = current_workspace_id()
    and (type <> 'dm' or public.is_channel_participant(id) or created_by = public.current_member_id())
  )
  with check (current_member_role() is not null and workspace_id = current_workspace_id());

drop policy if exists "Staff access" on public.channel_members;
create policy "Staff access" on public.channel_members for all to authenticated
  using (
    current_member_role() is not null
    and (
      member_id = public.current_member_id()
      or exists (
        select 1 from public.channels c where c.id = channel_members.channel_id and c.workspace_id = current_workspace_id()
          and (c.type <> 'dm' or public.is_channel_participant(c.id) or c.created_by = public.current_member_id())
      )
    )
  )
  with check (
    current_member_role() is not null
    and exists (select 1 from public.channels c where c.id = channel_members.channel_id and c.workspace_id = current_workspace_id())
  );
