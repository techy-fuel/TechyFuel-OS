import nodemailer from 'nodemailer';
import { ImapFlow } from 'imapflow';

// Sends via the mailbox's own SMTP (so it actually comes from the real
// professional address, not a third-party sender domain), then best-effort
// appends a copy to the IMAP Sent folder so it shows up there too --
// SMTP alone doesn't do this automatically.
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { EMAIL_SMTP_HOST, EMAIL_SMTP_PORT, EMAIL_USER, EMAIL_PASSWORD, EMAIL_IMAP_HOST, EMAIL_IMAP_PORT, EMAIL_FROM_NAME } = process.env;
  if (!EMAIL_SMTP_HOST || !EMAIL_USER || !EMAIL_PASSWORD) {
    return res.status(200).json({ ok: false, error: 'Email not configured. Set EMAIL_SMTP_HOST, EMAIL_USER and EMAIL_PASSWORD in Vercel.' });
  }

  const { to, subject, body } = req.body || {};
  if (!to || !subject || !body) return res.status(400).json({ ok: false, error: 'to, subject and body are required' });

  const transporter = nodemailer.createTransport({
    host: EMAIL_SMTP_HOST,
    port: Number(EMAIL_SMTP_PORT) || 465,
    secure: (Number(EMAIL_SMTP_PORT) || 465) === 465,
    auth: { user: EMAIL_USER, pass: EMAIL_PASSWORD },
  });

  const fromHeader = EMAIL_FROM_NAME ? `${EMAIL_FROM_NAME} <${EMAIL_USER}>` : EMAIL_USER;
  const mail = { from: fromHeader, to, subject, text: body, html: body.replace(/\n/g, '<br/>') };

  try {
    const info = await transporter.sendMail(mail);

    if (EMAIL_IMAP_HOST) {
      try {
        const client = new ImapFlow({
          host: EMAIL_IMAP_HOST, port: Number(EMAIL_IMAP_PORT) || 993, secure: true,
          auth: { user: EMAIL_USER, pass: EMAIL_PASSWORD }, logger: false,
        });
        await client.connect();
        const raw = `From: ${fromHeader}\r\nTo: ${to}\r\nSubject: ${subject}\r\nDate: ${new Date().toUTCString()}\r\nContent-Type: text/html; charset=utf-8\r\n\r\n${mail.html}`;
        await client.append('Sent', raw, ['\\Seen']).catch(() => {});
        await client.logout();
      } catch {} // Sent-folder copy is a nice-to-have; the send itself already succeeded.
    }

    return res.status(200).json({ ok: true, messageId: info.messageId });
  } catch (err) {
    return res.status(200).json({ ok: false, error: err.message || 'Could not send the email.' });
  }
}
