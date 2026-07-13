<?php

namespace App\Http\Controllers;

use App\Models\CallSession;
use Illuminate\Http\Request;

class CallSessionController extends Controller
{
    public function store(Request $request)
    {
        $this->authorize('staff');
        $data = $request->validate([
            'channel_id' => ['nullable', 'uuid', 'exists:channels,id'],
            'type' => ['nullable', 'string', 'in:audio,video'],
            'room_name' => ['required', 'string'],
        ]);
        $data['started_by'] = app(\App\Services\WorkspaceContext::class)->memberId();

        return response()->json(['data' => CallSession::create($data)], 201);
    }

    public function end(Request $request, CallSession $callSession)
    {
        $this->authorize('staff');
        $data = $request->validate(['participant_count' => ['nullable', 'integer']]);

        $callSession->update([
            'ended_at' => now(),
            'participant_count' => $data['participant_count'] ?? 1,
        ]);

        return response()->json(['data' => $callSession]);
    }
}
