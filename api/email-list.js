import { ImapFlow } from 'imapflow';
import { resolveEmailCredentials } from '../lib/resolve-email-account.js';

// Lists the most recent inbox messages (headers only -- no body, so this
// stays fast even on a mailbox with years of history). Uses either the one
// shared TechyFuel mailbox (env vars, default) or a specific team member's
// own connected account (?accountId=...). These are real mailbox
// credentials, not an OAuth token, so they must never be exposed to the
// client -- this function only ever returns message metadata, never the
// password, and the browser never talks to the mail server directly.
export default async function handler(req, res) {
  const creds = await resolveEmailCredentials(req, req.query.accountId);
  if (!creds) {
    return res.status(200).json({ ok: false, error: req.query.accountId ? 'That account could not be found.' : 'Email not configured. Set EMAIL_IMAP_HOST, EMAIL_USER and EMAIL_PASSWORD in Vercel, or connect your own account.' });
  }

  const limit = Math.min(Number(req.query.limit) || 30, 100);
  const wantSent = (req.query.mailbox || 'inbox').toLowerCase() === 'sent';
  const client = new ImapFlow({
    host: creds.imapHost,
    port: creds.imapPort,
    secure: true,
    auth: { user: creds.user, pass: creds.pass },
    logger: false,
  });

  try {
    await client.connect();

    let mailboxPath = 'INBOX';
    if (wantSent) {
      // Different mail servers name this differently (Sent, Sent Items,
      // INBOX.Sent, ...) -- ask the server which folder it flags as the
      // special-use Sent mailbox instead of guessing a name.
      const list = await client.list();
      const sentBox = list.find(b => (b.specialUse === '\\Sent') || /^(sent|sent items|sent-mail)$/i.test(b.name));
      mailboxPath = sentBox ? sentBox.path : 'Sent';
    }

    const lock = await client.getMailboxLock(mailboxPath);
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
            to: wantSent ? (msg.envelope?.to || []).map(t => ({ name: t.name || '', address: t.address || '' })) : undefined,
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
