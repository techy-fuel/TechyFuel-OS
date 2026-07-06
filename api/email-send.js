import nodemailer from 'nodemailer';
import { ImapFlow } from 'imapflow';
import { resolveEmailCredentials } from '../lib/resolve-email-account.js';

// Sends via the mailbox's own SMTP (so it actually comes from the real
// professional address, not a third-party sender domain), then best-effort
// appends a copy to the IMAP Sent folder so it shows up there too --
// SMTP alone doesn't do this automatically.
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { to, subject, body, html, accountId } = req.body || {};
  if (!to || !subject || !(body || html)) return res.status(400).json({ ok: false, error: 'to, subject and body (or html) are required' });

  const creds = await resolveEmailCredentials(req, accountId);
  if (!creds) return res.status(200).json({ ok: false, error: 'Email not configured. Set EMAIL_SMTP_HOST, EMAIL_USER and EMAIL_PASSWORD in Vercel, or connect your own account.' });

  const transporter = nodemailer.createTransport({
    host: creds.smtpHost,
    port: creds.smtpPort,
    secure: creds.smtpPort === 465,
    auth: { user: creds.user, pass: creds.pass },
  });

  const fromHeader = creds.fromName ? `${creds.fromName} <${creds.user}>` : creds.user;
  // Callers with a pre-built branded HTML document (e.g. the invoice PDF
  // template) pass `html` directly; plain-text composes only send `body`.
  const mail = {
    from: fromHeader, to, subject,
    text: body || subject,
    html: html || body.replace(/\n/g, '<br/>'),
  };

  try {
    const info = await transporter.sendMail(mail);

    if (creds.imapHost) {
      try {
        const client = new ImapFlow({
          host: creds.imapHost, port: creds.imapPort, secure: true,
          auth: { user: creds.user, pass: creds.pass }, logger: false,
        });
        await client.connect();
        const list = await client.list();
        const sentBox = list.find(b => (b.specialUse === '\\Sent') || /^(sent|sent items|sent-mail)$/i.test(b.name));
        const raw = `From: ${fromHeader}\r\nTo: ${to}\r\nSubject: ${subject}\r\nDate: ${new Date().toUTCString()}\r\nContent-Type: text/html; charset=utf-8\r\n\r\n${mail.html}`;
        await client.append(sentBox ? sentBox.path : 'Sent', raw, ['\\Seen']).catch(() => {});
        await client.logout();
      } catch {} // Sent-folder copy is a nice-to-have; the send itself already succeeded.
    }

    return res.status(200).json({ ok: true, messageId: info.messageId });
  } catch (err) {
    return res.status(200).json({ ok: false, error: err.message || 'Could not send the email.' });
  }
}
