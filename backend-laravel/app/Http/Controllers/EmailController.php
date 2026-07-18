<?php

namespace App\Http\Controllers;

use App\Models\EmailAccount;
use App\Services\WorkspaceContext;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\Mailer\Transport\Dsn;
use Symfony\Component\Mailer\Transport\Smtp\EsmtpTransport;
use Symfony\Component\Mailer\Mailer;
use Symfony\Component\Mime\Email;

/**
 * IMAP inbox reading + SMTP sending for connected mailboxes.
 * Ports the old Vercel email-list/email-message/email-send serverless
 * functions to Laravel. Credentials come from email_accounts (per-member,
 * AES-256-GCM at rest) or from EMAIL_* env vars (shared inbox) when no
 * accountId is given. The browser never sees the password.
 */
class EmailController extends Controller
{
    /** GET /api/email-list?mailbox=inbox&limit=30&accountId=... */
    public function list(Request $request)
    {
        $creds = $this->resolveCreds($request, $request->query('accountId'));
        if (!$creds) {
            return response()->json(['ok' => false, 'error' => 'Email not configured. Connect an account first.']);
        }
        $limit = min((int) ($request->query('limit') ?: 30), 100);
        $wantSent = strtolower($request->query('mailbox', 'inbox')) === 'sent';

        $mbox = $this->imapConnect($creds, $wantSent ? 'Sent' : 'INBOX');
        if (!$mbox) return response()->json(['ok' => false, 'error' => 'Could not connect to the mail server.']);

        try {
            $total = imap_num_msg($mbox);
            $messages = [];
            $start = max(1, $total - $limit + 1);
            for ($i = $total; $i >= $start; $i--) {
                $h = imap_headerinfo($mbox, $i);
                if (!$h) continue;
                $overview = imap_fetch_overview($mbox, (string) $i, 0)[0] ?? null;
                $messages[] = [
                    'id'      => $overview->uid ?? $i,
                    'seq'     => $i,
                    'from'    => $this->decodeMime($h->fromaddress ?? ''),
                    'fromEmail' => isset($h->from[0]) ? ($h->from[0]->mailbox . '@' . $h->from[0]->host) : '',
                    'subject' => $this->decodeMime($h->subject ?? '(no subject)'),
                    'date'    => isset($h->udate) ? date('c', $h->udate) : null,
                    'unseen'  => isset($overview->seen) ? !$overview->seen : false,
                    'preview' => '',
                ];
            }
            imap_close($mbox);
            return response()->json(['ok' => true, 'messages' => $messages]);
        } catch (\Throwable $e) {
            @imap_close($mbox);
            Log::warning('email-list failed: ' . $e->getMessage());
            return response()->json(['ok' => false, 'error' => 'Could not read the mailbox.']);
        }
    }

    /** GET /api/email-message?seq=..&accountId=..&mailbox=inbox */
    public function message(Request $request)
    {
        $creds = $this->resolveCreds($request, $request->query('accountId'));
        if (!$creds) return response()->json(['ok' => false, 'error' => 'Email not configured.']);
        $seq = (int) $request->query('seq');
        if (!$seq) return response()->json(['ok' => false, 'error' => 'seq is required']);
        $wantSent = strtolower($request->query('mailbox', 'inbox')) === 'sent';

        $mbox = $this->imapConnect($creds, $wantSent ? 'Sent' : 'INBOX');
        if (!$mbox) return response()->json(['ok' => false, 'error' => 'Could not connect.']);

        try {
            $h = imap_headerinfo($mbox, $seq);
            $body = $this->extractBody($mbox, $seq);
            imap_setflag_full($mbox, (string) $seq, '\\Seen');
            imap_close($mbox);
            return response()->json([
                'ok' => true,
                'message' => [
                    'from'    => $this->decodeMime($h->fromaddress ?? ''),
                    'to'      => $this->decodeMime($h->toaddress ?? ''),
                    'subject' => $this->decodeMime($h->subject ?? '(no subject)'),
                    'date'    => isset($h->udate) ? date('c', $h->udate) : null,
                    'html'    => $body['html'],
                    'text'    => $body['text'],
                ],
            ]);
        } catch (\Throwable $e) {
            @imap_close($mbox);
            return response()->json(['ok' => false, 'error' => 'Could not open the message.']);
        }
    }

    /** POST /api/email-send  { to, subject, body|html, accountId? } */
    public function send(Request $request)
    {
        $data = $request->validate([
            'to'      => ['required', 'email'],
            'subject' => ['required', 'string'],
            'body'    => ['nullable', 'string'],
            'html'    => ['nullable', 'string'],
            'accountId' => ['nullable', 'string'],
        ]);
        if (empty($data['body']) && empty($data['html'])) {
            return response()->json(['ok' => false, 'error' => 'body or html is required'], 422);
        }
        $creds = $this->resolveCreds($request, $data['accountId'] ?? null);
        if (!$creds) return response()->json(['ok' => false, 'error' => 'Email not configured. Connect an account first.']);

        try {
            $secure = ((int) $creds['smtpPort'] === 465) ? 'ssl' : 'tls';
            $dsn = new Dsn($secure === 'ssl' ? 'smtps' : 'smtp', $creds['smtpHost'], $creds['user'], $creds['pass'], (int) $creds['smtpPort']);
            $transport = new EsmtpTransport($dsn->getHost(), $dsn->getPort(), $secure === 'ssl', null, null);
            $transport->setUsername($creds['user']);
            $transport->setPassword($creds['pass']);
            $mailer = new Mailer($transport);

            $html = $data['html'] ?? nl2br(e($data['body']));
            $email = (new Email())
                ->from($creds['fromName'] ? sprintf('%s <%s>', $creds['fromName'], $creds['user']) : $creds['user'])
                ->to($data['to'])
                ->subject($data['subject'])
                ->text($data['body'] ?? strip_tags($data['html']))
                ->html($html);

            $mailer->send($email);
            return response()->json(['ok' => true, 'message' => 'Email sent.']);
        } catch (\Throwable $e) {
            Log::warning('email-send failed: ' . $e->getMessage());
            return response()->json(['ok' => false, 'error' => 'Send failed: ' . $e->getMessage()], 502);
        }
    }

    // ── helpers ──────────────────────────────────────────────────────────

    protected function resolveCreds(Request $request, ?string $accountId): ?array
    {
        if (!$accountId) {
            $host = env('EMAIL_IMAP_HOST');
            $user = env('EMAIL_USER');
            $pass = env('EMAIL_PASSWORD');
            if (!$host || !$user || !$pass) return null;
            return [
                'imapHost' => $host, 'imapPort' => (int) (env('EMAIL_IMAP_PORT') ?: 993),
                'smtpHost' => env('EMAIL_SMTP_HOST') ?: $host, 'smtpPort' => (int) (env('EMAIL_SMTP_PORT') ?: 465),
                'user' => $user, 'pass' => $pass, 'fromName' => env('EMAIL_FROM_NAME'),
            ];
        }
        $memberId = app(WorkspaceContext::class)->memberId();
        if (!$memberId) return null;
        $acct = EmailAccount::where('id', $accountId)->where('member_id', $memberId)->first();
        if (!$acct) return null;
        return [
            'imapHost' => $acct->imap_host, 'imapPort' => (int) $acct->imap_port,
            'smtpHost' => $acct->smtp_host, 'smtpPort' => (int) $acct->smtp_port,
            'user' => $acct->email,
            'pass' => $this->decryptPassword($acct->encrypted_password, $acct->password_iv, $acct->password_tag),
            'fromName' => $acct->from_name,
        ];
    }

    protected function decryptPassword(string $encHex, string $ivHex, string $tagHex): string
    {
        $key = substr(hash('sha256', config('services.email_encryption_key', config('app.key')), true), 0, 32);
        return openssl_decrypt(hex2bin($encHex), 'aes-256-gcm', $key, OPENSSL_RAW_DATA, hex2bin($ivHex), hex2bin($tagHex)) ?: '';
    }

    protected function imapConnect(array $creds, string $folder)
    {
        if (!function_exists('imap_open')) return null;
        $path = $folder;
        if (strtolower($folder) === 'sent') $path = 'Sent'; // best-effort; many servers accept this
        $mailbox = sprintf('{%s:%d/imap/ssl/novalidate-cert}%s', $creds['imapHost'], $creds['imapPort'], $path);
        $mbox = @imap_open($mailbox, $creds['user'], $creds['pass'], 0, 1);
        return $mbox ?: null;
    }

    protected function decodeMime(string $s): string
    {
        $out = '';
        foreach (imap_mime_header_decode($s) as $part) {
            $out .= $part->text;
        }
        return trim($out) ?: $s;
    }

    protected function extractBody($mbox, int $seq): array
    {
        $structure = imap_fetchstructure($mbox, $seq);
        $html = ''; $text = '';
        if (empty($structure->parts)) {
            $body = imap_body($mbox, $seq, FT_PEEK);
            $body = $this->decodePart($body, $structure->encoding ?? 0);
            if (($structure->subtype ?? '') === 'HTML') $html = $body; else $text = $body;
        } else {
            foreach ($structure->parts as $i => $part) {
                $partNum = (string) ($i + 1);
                $body = imap_fetchbody($mbox, $seq, $partNum, FT_PEEK);
                $body = $this->decodePart($body, $part->encoding ?? 0);
                $sub = strtoupper($part->subtype ?? '');
                if ($sub === 'HTML') $html = $body;
                elseif ($sub === 'PLAIN') $text = $body;
            }
        }
        return ['html' => $html, 'text' => $text];
    }

    protected function decodePart(string $body, int $encoding): string
    {
        return match ($encoding) {
            3 => base64_decode($body),      // BASE64
            4 => quoted_printable_decode($body), // QUOTED-PRINTABLE
            default => $body,
        };
    }
}
