import { resolveCallerMemberId, serviceClient } from '../lib/auth.js';
import { encryptPassword } from '../lib/email-crypto.js';

// Lets each team member connect their own mailbox from the Email screen,
// in addition to the one shared inbox configured via env vars. Never
// returns the password -- only metadata the UI needs for the account
// switcher (label, email, host). Every operation is scoped to the caller's
// own member_id, resolved from their Supabase session token, not something
// the client can pass in and spoof.
export default async function handler(req, res) {
  const memberId = await resolveCallerMemberId(req);
  if (!memberId) return res.status(401).json({ ok: false, error: 'Not signed in.' });

  const db = serviceClient();

  if (req.method === 'GET') {
    const { data, error } = await db.from('email_accounts')
      .select('id, label, email, imap_host, smtp_host, created_at')
      .eq('member_id', memberId)
      .order('created_at', { ascending: true });
    if (error) return res.status(200).json({ ok: false, error: error.message });
    return res.status(200).json({ ok: true, accounts: data });
  }

  if (req.method === 'POST') {
    const { label, email, imapHost, imapPort, smtpHost, smtpPort, fromName, password } = req.body || {};
    if (!label || !email || !imapHost || !smtpHost || !password) {
      return res.status(400).json({ ok: false, error: 'label, email, imapHost, smtpHost and password are all required.' });
    }
    const { data: memberRow } = await db.from('team_members').select('workspace_id').eq('id', memberId).single();
    if (!memberRow) return res.status(400).json({ ok: false, error: 'Could not resolve your workspace.' });

    const { encrypted, iv, tag } = encryptPassword(password);
    const { data, error } = await db.from('email_accounts').insert({
      workspace_id: memberRow.workspace_id,
      member_id: memberId,
      label, email,
      imap_host: imapHost, imap_port: Number(imapPort) || 993,
      smtp_host: smtpHost, smtp_port: Number(smtpPort) || 465,
      from_name: fromName || null,
      encrypted_password: encrypted, password_iv: iv, password_tag: tag,
    }).select('id, label, email, imap_host, smtp_host, created_at').single();
    if (error) return res.status(200).json({ ok: false, error: error.message });
    return res.status(200).json({ ok: true, account: data });
  }

  if (req.method === 'DELETE') {
    const id = req.query.id;
    if (!id) return res.status(400).json({ ok: false, error: 'id is required' });
    const { error } = await db.from('email_accounts').delete().eq('id', id).eq('member_id', memberId);
    if (error) return res.status(200).json({ ok: false, error: error.message });
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ ok: false, error: 'Method not allowed' });
}
