import { ImapFlow } from 'imapflow';
import { resolveEmailCredentials } from '../lib/resolve-email-account.js';

// Cheap unread-count check (IMAP STATUS, not a full message fetch) so the
// sidebar badge and notification bell can poll this often without the cost
// of email-list.js's full envelope fetch.
export default async function handler(req, res) {
  const creds = await resolveEmailCredentials(req, req.query.accountId);
  if (!creds) return res.status(200).json({ ok: false, unread: 0 });

  const client = new ImapFlow({
    host: creds.imapHost,
    port: creds.imapPort,
    secure: true,
    auth: { user: creds.user, pass: creds.pass },
    logger: false,
  });

  try {
    await client.connect();
    const status = await client.status('INBOX', { unseen: true });
    await client.logout();
    return res.status(200).json({ ok: true, unread: status.unseen || 0 });
  } catch (err) {
    try { await client.logout(); } catch {}
    return res.status(200).json({ ok: false, unread: 0, error: err.message });
  }
}
