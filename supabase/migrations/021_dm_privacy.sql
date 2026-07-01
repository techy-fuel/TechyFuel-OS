-- Real DM privacy: a direct message is only visible to its participants,
-- regardless of role. Until now channels/channel_members/messages all sat
-- under the blanket "any staff member of this workspace" policy from
-- 018/019 — meaning any owner/admin/member could read anyone else's DMs
-- just by knowing the channel id. Group/public channels stay visible to
-- all staff (that's the point of a channel); only type='dm' rows get
-- participant-only scoping.

-- is_channel_participant() must be security definer so it bypasses RLS
-- when it reads channel_members — otherwise a policy on channel_members
-- that calls this (to check DM membership) would trigger the very same
-- policy again while evaluating the subquery, causing "infinite recursion
-- detected in policy for relation channel_members".
create or replace function public.is_channel_participant(target_channel_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.channel_members cm
     where cm.channel_id = target_channel_id and cm.member_id = public.current_member_id()
  );
$$;

drop policy if exists "Staff access" on public.channels;
drop policy if exists "Staff access" on public.channel_members;
drop policy if exists "Staff access" on public.messages;
drop policy if exists "Staff access" on public.message_reactions;

-- ─── Channels — see all non-DM channels in your workspace; DMs only if
--     you're a participant ───────────────────────────────────────────────
create policy "Staff access" on public.channels for all to authenticated
  using (
    current_member_role() is not null and workspace_id = current_workspace_id()
    and (type <> 'dm' or public.is_channel_participant(id))
  )
  with check (current_member_role() is not null and workspace_id = current_workspace_id());

-- ─── Channel members — same participant-only rule for DM rosters ───────────
create policy "Staff access" on public.channel_members for all to authenticated
  using (
    current_member_role() is not null
    and exists (
      select 1 from public.channels c where c.id = channel_members.channel_id and c.workspace_id = current_workspace_id()
        and (c.type <> 'dm' or public.is_channel_participant(c.id))
    )
  )
  with check (
    current_member_role() is not null
    and exists (select 1 from public.channels c where c.id = channel_members.channel_id and c.workspace_id = current_workspace_id())
  );

-- ─── Messages — visible only if you can see the channel they're in ────────
create policy "Staff access" on public.messages for all to authenticated
  using (
    current_member_role() is not null and workspace_id = current_workspace_id()
    and exists (
      select 1 from public.channels c where c.id = messages.channel_id
        and (c.type <> 'dm' or public.is_channel_participant(c.id))
    )
  )
  with check (current_member_role() is not null and workspace_id = current_workspace_id());

-- ─── Reactions — same rule, via the message's channel ──────────────────────
create policy "Staff access" on public.message_reactions for all to authenticated
  using (
    current_member_role() is not null and workspace_id = current_workspace_id()
    and exists (
      select 1 from public.messages m join public.channels c on c.id = m.channel_id
       where m.id = message_reactions.message_id
         and (c.type <> 'dm' or public.is_channel_participant(c.id))
    )
  )
  with check (current_member_role() is not null and workspace_id = current_workspace_id());
