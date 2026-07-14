<?php

namespace App\Http\Controllers;

use App\Models\Webhook;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class WebhookController extends Controller
{
    public function index()
    {
        $this->authorize('admin');
        return response()->json(['data' => Webhook::orderBy('created_at', 'desc')->get()]);
    }

    public function store(Request $request)
    {
        $this->authorize('admin');
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'url' => ['required', 'url'],
            'events' => ['nullable', 'array'],
            'enabled' => ['nullable', 'boolean'],
        ]);
        $data['secret'] = bin2hex(random_bytes(16));
        return response()->json(['data' => Webhook::create($data)], 201);
    }

    public function update(Request $request, Webhook $webhook)
    {
        $this->authorize('admin');
        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'url' => ['nullable', 'url'],
            'events' => ['nullable', 'array'],
            'enabled' => ['nullable', 'boolean'],
        ]);
        $webhook->update($data);
        return response()->json(['data' => $webhook]);
    }

    public function destroy(Webhook $webhook)
    {
        $this->authorize('admin');
        $webhook->delete();
        return response()->json(['message' => 'Deleted']);
    }

    /**
     * Server-side webhook delivery (the frontend used to fetch() the
     * target URL directly from the browser, where the browser's own
     * network — not this server's — was the one exposed to a bad URL).
     * Moving it server-side means an admin-supplied URL can now make
     * *this server* issue a request, so it's checked against
     * private/loopback/link-local ranges first.
     *
     * This blocks the common case (someone points a webhook at
     * 127.0.0.1 or an internal 10.x host) but does NOT fully close DNS
     * rebinding (a hostname that resolves to a public IP at validation
     * time and a private one at request time) — doing that properly
     * needs the resolved IP pinned for the actual request (e.g. curl's
     * CURLOPT_RESOLVE), which isn't wired up here yet.
     */
    public function fire(Request $request, Webhook $webhook)
    {
        $this->authorize('admin');
        $payload = $request->validate(['payload' => ['nullable', 'array']])['payload'] ?? [];

        if (! $this->isSafeWebhookUrl($webhook->url)) {
            $webhook->update(['last_triggered_at' => now(), 'last_status' => 0]);
            return response()->json(['ok' => false, 'error' => 'Webhook URL resolves to a private/internal address'], 422);
        }

        $ok = false;
        try {
            $response = Http::timeout(5)
                ->withHeaders($webhook->secret ? ['X-TF-Secret' => $webhook->secret] : [])
                ->post($webhook->url, $payload);
            $ok = $response->successful();
            $webhook->update(['last_triggered_at' => now(), 'last_status' => $response->status()]);
        } catch (\Throwable $e) {
            $webhook->update(['last_triggered_at' => now(), 'last_status' => 0]);
        }

        return response()->json(['ok' => $ok]);
    }

    protected function isSafeWebhookUrl(string $url): bool
    {
        $parts = parse_url($url);
        if (! $parts || ! in_array($parts['scheme'] ?? '', ['http', 'https'], true) || empty($parts['host'])) {
            return false;
        }

        $host = $parts['host'];
        $ips = filter_var($host, FILTER_VALIDATE_IP) ? [$host] : (gethostbynamel($host) ?: []);
        if (! $ips) {
            return false;
        }

        foreach ($ips as $ip) {
            if (! filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
                return false;
            }
        }

        return true;
    }
}
