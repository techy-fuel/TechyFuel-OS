<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('staff');

        return response()->json(['data' => Client::orderBy('created_at', 'desc')->get()]);
    }

    public function store(Request $request)
    {
        $this->authorize('staff');

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'company' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'website' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', 'string', 'in:active,inactive,lead'],
            'avatar_url' => ['nullable', 'string'],
            'industry' => ['nullable', 'string', 'max:255'],
            'monthly_value' => ['nullable', 'numeric'],
            'notes' => ['nullable', 'string'],
        ]);

        $client = Client::create($data);

        return response()->json(['data' => $client], 201);
    }

    public function show(Client $client)
    {
        $this->authorize('staff');

        return response()->json(['data' => $client]);
    }

    public function update(Request $request, Client $client)
    {
        $this->authorize('staff');

        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'company' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'website' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', 'string', 'in:active,inactive,lead'],
            'avatar_url' => ['nullable', 'string'],
            'industry' => ['nullable', 'string', 'max:255'],
            'monthly_value' => ['nullable', 'numeric'],
            'notes' => ['nullable', 'string'],
        ]);

        $client->update($data);

        return response()->json(['data' => $client]);
    }

    public function destroy(Client $client)
    {
        $this->authorize('staff');

        $client->delete();

        return response()->json(['message' => 'Deleted']);
    }
}
