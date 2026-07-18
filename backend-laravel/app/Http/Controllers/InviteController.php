<?php

namespace App\Http\Controllers;

use App\Models\EmailAccount;
use App\Services\WorkspaceContext;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\Mailer\Transport\Smtp\EsmtpTransport;
use Symfony\Component\Mailer\Mailer;
use Symfony\Component\Mime\Email;

/**
 * Sends a "you've been invited" email to a new team member. Best-effort:
 * the member record is already created by the frontend before calling this,
 * so a mail failure here never blocks the invite — it just means no email
 * went out. Uses the workspace's first connected email account, or the
 * EMAIL_* env mailbox, via plain SMTP (no third-party API / no cost).
 */
class InviteController extends Controller
{
    public function send(Request $request)
    {
        $data = $request->validate([
            'name'       => ['required', 'string', 'max:255'],
            'email'      => ['required', 'email'],
            'role'       => ['nullable', 'string'],
            'agencyName' => ['nullable', 'string'],
            'appUrl'     => ['nullable', 'string'],
        ]);

        $creds = $this->resolveMailer();
        if (!$creds) {
            // No mailbox connected — member still added, just no email sent.
            return response()->json(['ok' => false, 'error' => 'No email account connected to send from.']);
        }

        $agency  = $data['agencyName'] ?: 'TechyFuel OS';
        $appUrl  = $data['appUrl'] ?: 'https://os.techyfuel.com/os/';
        $role    = $data['role'] ?: 'member';
        $subject = "You've been invited to {$agency}";
        $html = "
            <div style='font-family:Segoe UI,Arial,sans-serif;max-width:520px;margin:0 auto;color:#1b2b41'>
              <div style='background:linear-gradient(135deg,#0a2540,#1a56db);padding:28px;border-radius:12px 12px 0 0;color:#fff'>
                <h2 style='margin:0'>Welcome to {$agency}</h2>
              </div>
              <div style='padding:24px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px'>
                <p>Hi " . e($data['name']) . ",</p>
                <p>You've been added to <b>{$agency}</b> as a <b>" . e($role) . "</b>.</p>
                <p>You can sign in and set your password here:</p>
                <p style='text-align:center;margin:24px 0'>
                  <a href='{$appUrl}' style='background:#1a56db;color:#fff;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:600'>Open TechyFuel OS</a>
                </p>
                <p style='font-size:12px;color:#64748b'>If the button doesn't work, copy this link: {$appUrl}</p>
              </div>
            </div>";

        try {
            $secure = ((int) $creds['smtpPort'] === 465);
            $transport = new EsmtpTransport($creds['smtpHost'], (int) $creds['smtpPort'], $secure);
            $transport->setUsername($creds['user']);
            $transport->setPassword($creds['pass']);
            $mailer = new Mailer($transport);
            $email = (new Email())
                ->from($creds['fromName'] ? sprintf('%s <%s>', $creds['fromName'], $creds['user']) : $creds['user'])
                ->to($data['email'])
                ->subject($subject)
                ->html($html)
                ->text("You've been invited to {$agency} as a {$role}. Sign in at {$appUrl}");
            $mailer->send($email);
            return response()->json(['ok' => true, 'message' => 'Invite email sent.']);
        } catch (\Throwable $e) {
            Log::warning('invite email failed: ' . $e->getMessage());
            return response()->json(['ok' => false, 'error' => 'Could not send invite email.']);
        }
    }

    protected function resolveMailer(): ?array
    {
        // Prefer a connected workspace email account.
        $wsId = app(WorkspaceContext::class)->workspaceId();
        if ($wsId) {
            $acct = EmailAccount::where('workspace_id', $wsId)->first();
            if ($acct) {
                $key = substr(hash('sha256', config('services.email_encryption_key', config('app.key')), true), 0, 32);
                $pass = openssl_decrypt(hex2bin($acct->encrypted_password), 'aes-256-gcm', $key, OPENSSL_RAW_DATA, hex2bin($acct->password_iv), hex2bin($acct->password_tag)) ?: '';
                if ($pass) {
                    return [
                        'smtpHost' => $acct->smtp_host, 'smtpPort' => $acct->smtp_port,
                        'user' => $acct->email, 'pass' => $pass, 'fromName' => $acct->from_name,
                    ];
                }
            }
        }
        // Fall back to env mailbox.
        if (env('EMAIL_SMTP_HOST') && env('EMAIL_USER') && env('EMAIL_PASSWORD')) {
            return [
                'smtpHost' => env('EMAIL_SMTP_HOST'), 'smtpPort' => env('EMAIL_SMTP_PORT', 465),
                'user' => env('EMAIL_USER'), 'pass' => env('EMAIL_PASSWORD'), 'fromName' => env('EMAIL_FROM_NAME'),
            ];
        }
        return null;
    }
}
