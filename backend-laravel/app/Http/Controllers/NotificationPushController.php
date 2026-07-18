<?php

namespace App\Http\Controllers;

use App\Models\TeamMember;
use App\Models\EmailAccount;
use App\Models\Notification;
use App\Services\WorkspaceContext;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\Mailer\Transport\Smtp\EsmtpTransport;
use Symfony\Component\Mailer\Mailer;
use Symfony\Component\Mime\Email;

/**
 * Push notifications — free channels only:
 *   • In-app  (always, saved to notifications table)
 *   • Email   (SMTP via the workspace's connected mailbox / EMAIL_* env)
 *   • WhatsApp (returns a free wa.me click-to-chat link; no paid API)
 *
 * POST /api/notify  { recipient_id, type, title, body?, link_screen?, link_id?, phone?, channels?[] }
 * Best-effort: email failure never blocks the in-app notification.
 */
class NotificationPushController extends Controller
{
    public function push(Request $request)
    {
        $this->authorize('staff');
        $data = $request->validate([
            'recipient_id' => ['required', 'uuid', 'exists:team_members,id'],
            'type'         => ['required', 'string'],
            'title'        => ['required', 'string'],
            'body'         => ['nullable', 'string'],
            'link_screen'  => ['nullable', 'string'],
            'link_id'      => ['nullable', 'uuid'],
            'phone'        => ['nullable', 'string'],
            'channels'     => ['nullable', 'array'], // e.g. ["inapp","email","whatsapp"]
        ]);

        $channels = $data['channels'] ?? ['inapp', 'email'];

        // 1. In-app (always)
        $notif = Notification::notify([
            'recipient_id' => $data['recipient_id'],
            'type'         => $data['type'],
            'title'        => $data['title'],
            'body'         => $data['body'] ?? null,
            'link_screen'  => $data['link_screen'] ?? null,
            'link_id'      => $data['link_id'] ?? null,
        ]);

        $member  = TeamMember::find($data['recipient_id']);
        $emailed = false;
        $whatsapp = null;

        // 2. Email
        if (in_array('email', $channels) && $member && !empty($member->email)) {
            $emailed = $this->emailNotify($member->email, $data['title'], $data['body'] ?? '');
        }

        // 3. WhatsApp free link
        if (in_array('whatsapp', $channels)) {
            $phone = preg_replace('/[^0-9]/', '', (string) ($data['phone'] ?? ''));
            if ($phone) {
                $text = rawurlencode($data['title'] . "\n" . ($data['body'] ?? ''));
                $whatsapp = "https://wa.me/{$phone}?text={$text}";
            }
        }

        return response()->json([
            'data'     => $notif,
            'emailed'  => $emailed,
            'whatsapp' => $whatsapp,
        ], 201);
    }

    protected function emailNotify(string $to, string $subject, string $body): bool
    {
        $creds = $this->mailer();
        if (!$creds) return false;
        try {
            $secure = ((int) $creds['smtpPort'] === 465);
            $t = new EsmtpTransport($creds['smtpHost'], (int) $creds['smtpPort'], $secure);
            $t->setUsername($creds['user']);
            $t->setPassword($creds['pass']);
            $html = "<div style='font-family:Segoe UI,Arial,sans-serif;color:#1b2b41'>"
                . "<h3 style='color:#1a56db'>" . e($subject) . "</h3>"
                . "<p>" . nl2br(e($body)) . "</p>"
                . "<p style='font-size:12px;color:#64748b'>— TechyFuel OS · <a href='https://os.techyfuel.com/os/'>Open app</a></p></div>";
            $email = (new Email())
                ->from($creds['fromName'] ? sprintf('%s <%s>', $creds['fromName'], $creds['user']) : $creds['user'])
                ->to($to)->subject($subject)->text($body ?: $subject)->html($html);
            (new Mailer($t))->send($email);
            return true;
        } catch (\Throwable $e) {
            Log::warning('notify email failed: ' . $e->getMessage());
            return false;
        }
    }

    protected function mailer(): ?array
    {
        try {
            $wsId = app(WorkspaceContext::class)->workspaceId();
            if ($wsId) {
                $acct = EmailAccount::where('workspace_id', $wsId)->first();
                if ($acct) {
                    $key = substr(hash('sha256', config('services.email_encryption_key', config('app.key')), true), 0, 32);
                    $pass = openssl_decrypt(hex2bin($acct->encrypted_password), 'aes-256-gcm', $key, OPENSSL_RAW_DATA, hex2bin($acct->password_iv), hex2bin($acct->password_tag)) ?: '';
                    if ($pass) return ['smtpHost' => $acct->smtp_host, 'smtpPort' => $acct->smtp_port, 'user' => $acct->email, 'pass' => $pass, 'fromName' => $acct->from_name];
                }
            }
        } catch (\Throwable $e) {}
        if (env('EMAIL_SMTP_HOST') && env('EMAIL_USER') && env('EMAIL_PASSWORD')) {
            return ['smtpHost' => env('EMAIL_SMTP_HOST'), 'smtpPort' => env('EMAIL_SMTP_PORT', 465), 'user' => env('EMAIL_USER'), 'pass' => env('EMAIL_PASSWORD'), 'fromName' => env('EMAIL_FROM_NAME')];
        }
        return null;
    }
}
