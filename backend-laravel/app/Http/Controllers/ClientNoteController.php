<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\ClientNote;
use Illuminate\Http\Request;

class ClientNoteController extends Controller
{
    public function index(Client $client)
    {
        $this->authorize('staff');
        return response()->json(['data' => $client->clientNotes()->orderBy('created_at', 'desc')->get()]);
    }

    public function store(Request $request, Client $client)
    {
        $this->authorize('staff');
        $data = $request->validate([
            'project_id' => ['nullable', 'uuid', 'exists:projects,id'],
            'content' => ['required', 'string'],
        ]);
        $data['created_by'] = app(\App\Services\WorkspaceContext::class)->memberId();

        return response()->json(['data' => $client->clientNotes()->create($data)], 201);
    }

    public function destroy(ClientNote $clientNote)
    {
        $this->authorize('staff');
        $clientNote->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
