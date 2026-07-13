<?php

namespace App\Http\Controllers;

use App\Models\EmailAccount;
use App\Services\WorkspaceContext;
use Illuminate\Http\Request;

/**
 * Metadata + at-rest encryption only. The original Node app actually
 * connected to IMAP/SMTP (imapflow/nodemailer) from Vercel serverless
 * functions — that connection logic has NOT been ported here yet (no PHP
 * IMAP client is wired up); this controller only stores/encrypts the
 * credentials so the schema and access rules are in place ahead of it.
 * Uses its own EMAIL_ENCRYPTION_KEY (Laravel .env, this branch's local
 * dev DB) — intentionally separate from the production Node app's key,
 * which must never be touched.
 */
class EmailAccountController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('staff');
        $memberId = app(WorkspaceContext::class)->memberId();

        return response()->json([
            'data' => EmailAccount::where('member_id', $memberId)->get(),
        ]);
    }

    public function store(Request $request)
    {
        $this->authorize('staff');
        $data = $request->validate([
            'label' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email'],
            'imap_host' => ['required', 'string'],
            'imap_port' => ['nullable', 'integer'],
            'smtp_host' => ['required', 'string'],
            'smtp_port' => ['nullable', 'integer'],
            'from_name' => ['nullable', 'string'],
            'password' => ['required', 'string'],
        ]);

        [$encrypted, $iv, $tag] = $this->encryptPassword($data['password']);
        unset($data['password']);

        $data['member_id'] = app(WorkspaceContext::class)->memberId();
        $data['encrypted_password'] = $encrypted;
        $data['password_iv'] = $iv;
        $data['password_tag'] = $tag;

        return response()->json(['data' => EmailAccount::create($data)], 201);
    }

    public function destroy(EmailAccount $emailAccount)
    {
        $this->authorize('staff');
        $context = app(WorkspaceContext::class);
        abort_unless($emailAccount->member_id === $context->memberId(), 403);

        $emailAccount->delete();

        return response()->json(['message' => 'Deleted']);
    }

    protected function encryptPassword(string $plain): array
    {
        $key = substr(hash('sha256', config('services.email_encryption_key', config('app.key')), true), 0, 32);
        $iv = random_bytes(12);
        $tag = '';
        $encrypted = openssl_encrypt($plain, 'aes-256-gcm', $key, OPENSSL_RAW_DATA, $iv, $tag);

        return [bin2hex($encrypted), bin2hex($iv), bin2hex($tag)];
    }
}
