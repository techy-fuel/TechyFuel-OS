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
     * target URL directly from the browser). This is admin-configured
     * (only owner/admin can create a webhook), but it's still a request
     * to an admin-supplied URL initiated from the server — worth an SSRF
     * hardening pass (blocking private/link-local IP ranges) before this
     * is exposed beyond trusted workspace admins.
     */
    public function fire(Request $request, Webhook $webhook)
    {
        $this->authorize('admin');
        $payload = $request->validate(['payload' => ['nullable', 'array']])['payload'] ?? [];

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
}
