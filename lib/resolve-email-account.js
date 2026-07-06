import { resolveCallerMemberId, serviceClient } from './auth.js';
import { decryptPassword } from './email-crypto.js';

// Resolves which mailbox credentials a request should use: either the one
// shared TechyFuel inbox (env vars, no accountId given -- works with no
// setup) or a specific team member's own connected account (accountId
// given -- ownership is checked against their session, not trusted from
// the request). Returns null if nothing usable is configured/authorized.
export async function resolveEmailCredentials(req, accountId) {
  if (!accountId) {
    const { EMAIL_IMAP_HOST, EMAIL_IMAP_PORT, EMAIL_SMTP_HOST, EMAIL_SMTP_PORT, EMAIL_USER, EMAIL_PASSWORD, EMAIL_FROM_NAME } = process.env;
    if (!EMAIL_IMAP_HOST || !EMAIL_USER || !EMAIL_PASSWORD) return null;
    return {
      imapHost: EMAIL_IMAP_HOST, imapPort: Number(EMAIL_IMAP_PORT) || 993,
      smtpHost: EMAIL_SMTP_HOST || EMAIL_IMAP_HOST, smtpPort: Number(EMAIL_SMTP_PORT) || 465,
      user: EMAIL_USER, pass: EMAIL_PASSWORD, fromName: EMAIL_FROM_NAME || null,
    };
  }

  const memberId = await resolveCallerMemberId(req);
  if (!memberId) return null;
  const db = serviceClient();
  const { data: acct } = await db.from('email_accounts').select('*').eq('id', accountId).eq('member_id', memberId).single();
  if (!acct) return null;
  return {
    imapHost: acct.imap_host, imapPort: acct.imap_port,
    smtpHost: acct.smtp_host, smtpPort: acct.smtp_port,
    user: acct.email, pass: decryptPassword(acct.encrypted_password, acct.password_iv, acct.password_tag),
    fromName: acct.from_name,
  };
}
