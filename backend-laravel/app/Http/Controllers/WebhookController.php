<?php

namespace App\Http\Controllers;

use App\Models\Webhook;
use Illuminate\Http\Request;

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
}
