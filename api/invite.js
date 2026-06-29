import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, role, agencyName, appUrl } = req.body;

  if (!email || !name) {
    return res.status(400).json({ error: 'name and email are required' });
  }

  if (!process.env.RESEND_API_KEY) {
    return res.status(200).json({ ok: true, skipped: true, reason: 'RESEND_API_KEY not configured' });
  }

  const displayAgency = agencyName || 'TechyFuel OS';
  const displayRole   = role ? (role.charAt(0).toUpperCase() + role.slice(1)) : 'Member';
  const loginUrl      = appUrl || 'https://techy-fuel-os-ex2n.vercel.app';

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;box-shadow:0 2px 16px rgba(0,0,0,0.08);overflow:hidden;">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#2563eb,#7c3aed);padding:32px 40px;text-align:center;">
            <div style="font-size:22px;font-weight:800;color:#fff;letter-spacing:-0.5px;">
              TechyFuel <span style="color:#a5b4fc;">OS</span>
            </div>
            <div style="color:#c7d2fe;font-size:13px;margin-top:4px;">Agency Operating System</div>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:36px 40px;">
            <h2 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#0f172a;">You've been invited! 🎉</h2>
            <p style="margin:0 0 24px;font-size:15px;color:#475569;line-height:1.6;">
              <strong style="color:#0f172a;">${displayAgency}</strong> has invited you to join their workspace on TechyFuel OS as a <strong style="color:#2563eb;">${displayRole}</strong>.
            </p>

            <table cellpadding="0" cellspacing="0" style="background:#f1f5f9;border-radius:10px;padding:16px 20px;margin-bottom:28px;width:100%;box-sizing:border-box;">
              <tr>
                <td style="font-size:13px;color:#64748b;">Your name</td>
                <td style="font-size:13px;font-weight:600;color:#0f172a;text-align:right;">${name}</td>
              </tr>
              <tr><td colspan="2" style="padding:6px 0;"><hr style="border:none;border-top:1px solid #e2e8f0;margin:0;"></td></tr>
              <tr>
                <td style="font-size:13px;color:#64748b;">Email</td>
                <td style="font-size:13px;font-weight:600;color:#0f172a;text-align:right;">${email}</td>
              </tr>
              <tr><td colspan="2" style="padding:6px 0;"><hr style="border:none;border-top:1px solid #e2e8f0;margin:0;"></td></tr>
              <tr>
                <td style="font-size:13px;color:#64748b;">Role</td>
                <td style="font-size:13px;font-weight:600;color:#2563eb;text-align:right;">${displayRole}</td>
              </tr>
            </table>

            <div style="text-align:center;margin-bottom:28px;">
              <a href="${loginUrl}" style="display:inline-block;background:linear-gradient(135deg,#2563eb,#7c3aed);color:#fff;text-decoration:none;font-weight:700;font-size:15px;padding:14px 36px;border-radius:10px;letter-spacing:-0.2px;">
                Open TechyFuel OS →
              </a>
            </div>

            <p style="margin:0;font-size:13px;color:#94a3b8;text-align:center;">
              If you have any questions, reply to this email or contact your team admin.
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f8fafc;padding:20px 40px;text-align:center;border-top:1px solid #e2e8f0;">
            <p style="margin:0;font-size:12px;color:#94a3b8;">TechyFuel OS · Agency Operating System</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  try {
    const { error } = await resend.emails.send({
      from: 'TechyFuel OS <onboarding@resend.dev>',
      to: [email],
      subject: `You've been invited to ${displayAgency} on TechyFuel OS`,
      html,
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Invite email failed:', err);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}
