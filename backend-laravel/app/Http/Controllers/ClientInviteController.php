<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\ClientInvite;
use Illuminate\Http\Request;

class ClientInviteController extends Controller
{
    public function store(Request $request, Client $client)
    {
        $this->authorize('admin');
        $data = $request->validate(['expires_at' => ['nullable', 'date']]);
        $data['client_id'] = $client->id;

        return response()->json(['data' => ClientInvite::create($data)], 201);
    }
}
