import { ImapFlow } from 'imapflow';
import { simpleParser } from 'mailparser';

// Fetches one message's full body by UID (list view only loads headers) and
// marks it \Seen. Same mailbox credentials as email-list.js.
export default async function handler(req, res) {
  const { EMAIL_IMAP_HOST, EMAIL_IMAP_PORT, EMAIL_USER, EMAIL_PASSWORD } = process.env;
  if (!EMAIL_IMAP_HOST || !EMAIL_USER || !EMAIL_PASSWORD) {
    return res.status(200).json({ ok: false, error: 'Email not configured.' });
  }
  const uid = Number(req.query.uid);
  if (!uid) return res.status(400).json({ ok: false, error: 'uid is required' });
  const wantSent = (req.query.mailbox || 'inbox').toLowerCase() === 'sent';

  const client = new ImapFlow({
    host: EMAIL_IMAP_HOST,
    port: Number(EMAIL_IMAP_PORT) || 993,
    secure: true,
    auth: { user: EMAIL_USER, pass: EMAIL_PASSWORD },
    logger: false,
  });

  try {
    await client.connect();

    let mailboxPath = 'INBOX';
    if (wantSent) {
      const list = await client.list();
      const sentBox = list.find(b => (b.specialUse === '\\Sent') || /^(sent|sent items|sent-mail)$/i.test(b.name));
      mailboxPath = sentBox ? sentBox.path : 'Sent';
    }

    const lock = await client.getMailboxLock(mailboxPath);
    let result = null;
    try {
      const msg = await client.fetchOne(uid, { envelope: true, source: true }, { uid: true });
      if (msg && msg.source) {
        const parsed = await simpleParser(msg.source);
        result = {
          subject: msg.envelope?.subject || '(no subject)',
          from: msg.envelope?.from?.[0] || null,
          to: (msg.envelope?.to || []).map(t => t.address),
          date: msg.envelope?.date || null,
          html: parsed.html || null,
          text: parsed.text || '',
        };
        if (!wantSent) await client.messageFlagsAdd(uid, ['\\Seen'], { uid: true });
      }
    } finally {
      lock.release();
    }
    await client.logout();
    if (!result) return res.status(404).json({ ok: false, error: 'Message not found' });
    return res.status(200).json({ ok: true, message: result });
  } catch (err) {
    try { await client.logout(); } catch {}
    return res.status(200).json({ ok: false, error: err.message || 'Could not load the message.' });
  }
}
