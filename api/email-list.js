import { ImapFlow } from 'imapflow';

// Lists the most recent inbox messages (headers only -- no body, so this
// stays fast even on a mailbox with years of history). Needs the mailbox's
// own IMAP credentials as Vercel env vars: EMAIL_IMAP_HOST, EMAIL_IMAP_PORT
// (defaults 993), EMAIL_USER, EMAIL_PASSWORD. These are real mailbox
// credentials, not an OAuth token, so they must never be exposed to the
// client -- this function only ever returns message metadata, never the
// password, and the browser never talks to the mail server directly.
export default async function handler(req, res) {
  const { EMAIL_IMAP_HOST, EMAIL_IMAP_PORT, EMAIL_USER, EMAIL_PASSWORD } = process.env;
  if (!EMAIL_IMAP_HOST || !EMAIL_USER || !EMAIL_PASSWORD) {
    return res.status(200).json({ ok: false, error: 'Email not configured. Set EMAIL_IMAP_HOST, EMAIL_USER and EMAIL_PASSWORD in Vercel.' });
  }

  const limit = Math.min(Number(req.query.limit) || 30, 100);
  const client = new ImapFlow({
    host: EMAIL_IMAP_HOST,
    port: Number(EMAIL_IMAP_PORT) || 993,
    secure: true,
    auth: { user: EMAIL_USER, pass: EMAIL_PASSWORD },
    logger: false,
  });

  try {
    await client.connect();
    const lock = await client.getMailboxLock('INBOX');
    const messages = [];
    try {
      const total = client.mailbox.exists;
      const from = Math.max(1, total - limit + 1);
      if (total > 0) {
        for await (const msg of client.fetch(`${from}:${total}`, { envelope: true, flags: true, uid: true })) {
          messages.push({
            uid: msg.uid,
            subject: msg.envelope?.subject || '(no subject)',
            from: msg.envelope?.from?.[0] ? { name: msg.envelope.from[0].name || '', address: msg.envelope.from[0].address || '' } : null,
            date: msg.envelope?.date || null,
            seen: msg.flags?.has('\\Seen') || false,
          });
        }
      }
    } finally {
      lock.release();
    }
    await client.logout();
    messages.sort((a, b) => new Date(b.date) - new Date(a.date));
    return res.status(200).json({ ok: true, messages });
  } catch (err) {
    try { await client.logout(); } catch {}
    return res.status(200).json({ ok: false, error: err.message || 'Could not connect to the mailbox.' });
  }
}
