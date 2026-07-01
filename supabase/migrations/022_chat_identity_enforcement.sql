-- Team Chat's "who am I" used to be a manually-switchable dropdown backed
-- by localStorage, completely disconnected from the real signed-in user —
-- anyone could pick any teammate's name and send/react as them. The app no
-- longer offers that picker (identity is now always the real auth user),
-- but the database should refuse impersonation even if someone calls the
-- API directly. Messages and reactions must be sent as yourself.

drop policy if exists "Staff access" on public.messages;
create policy "Staff access" on public.messages for all to authenticated
  using (
    current_member_role() is not null and workspace_id = current_workspace_id()
    and exists (
      select 1 from public.channels c where c.id = messages.channel_id
        and (c.type <> 'dm' or public.is_channel_participant(c.id))
    )
  )
  with check (
    current_member_role() is not null and workspace_id = current_workspace_id()
    and sender_id = current_member_id()
  );

drop policy if exists "Staff access" on public.message_reactions;
create policy "Staff access" on public.message_reactions for all to authenticated
  using (
    current_member_role() is not null and workspace_id = current_workspace_id()
    and exists (
      select 1 from public.messages m join public.channels c on c.id = m.channel_id
       where m.id = message_reactions.message_id
         and (c.type <> 'dm' or public.is_channel_participant(c.id))
    )
  )
  with check (
    current_member_role() is not null and workspace_id = current_workspace_id()
    and member_id = current_member_id()
  );
