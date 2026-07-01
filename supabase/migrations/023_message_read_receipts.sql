-- Read receipts: track when each channel member last viewed a channel, so
-- the UI can show "Seen" under your last message once the other person's
-- last_read_at catches up to it (same idea as WhatsApp/iMessage).
alter table public.channel_members add column if not exists last_read_at timestamptz default now();
