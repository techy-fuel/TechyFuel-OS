<?php

namespace App\Console\Commands;

use App\Models\ContentPost;
use App\Models\Notification;
use App\Models\TeamMember;
use App\Models\EmailAccount;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;
use Symfony\Component\Mailer\Transport\Smtp\EsmtpTransport;
use Symfony\Component\Mailer\Mailer;
use Symfony\Component\Mime\Email;

/**
 * Social-media post scheduler (free, no paid API).
 *
 * Every minute, finds content_posts whose scheduled_at has arrived and are
 * still 'scheduled', marks them 'published' (sets published_at), and pings
 * the post's owner/creator so they can push it live on the target platform.
 * Runs across every workspace (no auth context → no workspace scope filter),
 * exactly like RunRecurringItems.
 *
 * True hands-off auto-posting to Instagram/Facebook/LinkedIn requires each
 * platform's OAuth app + review (Meta Graph, LinkedIn API). That can be added
 * per-workspace later without changing this scheduler — this command already
 * owns the "it's time" trigger; a publisher just plugs into the loop below.
 */
class PublishScheduledPosts extends Command
{
    protected $signature = 'techyfuel:publish-scheduled';
    protected $description = 'Publish (or flag) content posts whose scheduled time has arrived';

    public function handle(): int
    {
        $now = Carbon::now();
        $due = ContentPost::query()
            ->whereNotNull('scheduled_at')
            ->where('scheduled_at', '<=', $now)
            ->where('status', 'scheduled')
            ->get();

        $count = 0;
        foreach ($due as $post) {
            try {
                // (Hook point) attempt real auto-publish here per platform when
                // OAuth is configured for the workspace. Free tier: just flag it.
                $post->status = 'published';
                $post->published_at = $now;
                $post->save();
                $count++;

                $this->notifyOwner($post);
            } catch (\Throwable $e) {
                Log::warning('publish-scheduled failed for post ' . $post->id . ': ' . $e->getMessage());
            }
        }

        $this->info("Published/flagged {$count} scheduled post(s).");
        return self::SUCCESS;
    }

    protected function notifyOwner(ContentPost $post): void
    {
        $ownerId = $post->created_by ?: $post->assigned_to;
        if (!$ownerId) return;

        $title = 'Scheduled post is live';
        $body  = ($post->title ?: 'Your post') . ' for ' . ($post->platform ?: 'social') . ' was scheduled for now.';

        // In-app notification
        try {
            Notification::notify([
                'recipient_id' => $ownerId,
                'type'         => 'content',
                'title'        => $title,
                'body'         => $body,
                'link_screen'  => 'content-calendar',
                'link_id'      => $post->id,
            ]);
        } catch (\Throwable $e) {}

        // Email reminder (free SMTP, best-effort)
        try {
            $member = TeamMember::find($ownerId);
            if ($member && !empty($member->email)) {
                $this->emailNotify($post->workspace_id, $member->email, $title, $body);
            }
        } catch (\Throwable $e) {}
    }

    protected function emailNotify(?string $wsId, string $to, string $subject, string $body): void
    {
        $creds = null;
        if ($wsId) {
            $acct = EmailAccount::where('workspace_id', $wsId)->first();
            if ($acct) {
                $key = substr(hash('sha256', config('services.email_encryption_key', config('app.key')), true), 0, 32);
                $pass = openssl_decrypt(hex2bin($acct->encrypted_password), 'aes-256-gcm', $key, OPENSSL_RAW_DATA, hex2bin($acct->password_iv), hex2bin($acct->password_tag)) ?: '';
                if ($pass) $creds = ['smtpHost' => $acct->smtp_host, 'smtpPort' => $acct->smtp_port, 'user' => $acct->email, 'pass' => $pass, 'fromName' => $acct->from_name];
            }
        }
        if (!$creds && env('EMAIL_SMTP_HOST') && env('EMAIL_USER') && env('EMAIL_PASSWORD')) {
            $creds = ['smtpHost' => env('EMAIL_SMTP_HOST'), 'smtpPort' => env('EMAIL_SMTP_PORT', 465), 'user' => env('EMAIL_USER'), 'pass' => env('EMAIL_PASSWORD'), 'fromName' => env('EMAIL_FROM_NAME')];
        }
        if (!$creds) return;
        try {
            $secure = ((int) $creds['smtpPort'] === 465);
            $t = new EsmtpTransport($creds['smtpHost'], (int) $creds['smtpPort'], $secure);
            $t->setUsername($creds['user']); $t->setPassword($creds['pass']);
            $email = (new Email())
                ->from($creds['fromName'] ? sprintf('%s <%s>', $creds['fromName'], $creds['user']) : $creds['user'])
                ->to($to)->subject($subject)->text($body)
                ->html("<p>{$body}</p><p style='font-size:12px;color:#64748b'>— TechyFuel OS · <a href='https://os.techyfuel.com/os/'>Open app</a></p>");
            (new Mailer($t))->send($email);
        } catch (\Throwable $e) {
            Log::warning('scheduled post email failed: ' . $e->getMessage());
        }
    }
}
