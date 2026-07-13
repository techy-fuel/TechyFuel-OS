<?php

namespace App\Http\Controllers;

use App\Models\Channel;
use App\Models\Message;
use App\Services\WorkspaceContext;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function index(Request $request, Channel $channel)
    {
        $this->authorize('staff');
        return response()->json(['data' => $channel->messages()->with('sender', 'reactions')->orderBy('created_at')->get()]);
    }

    /**
     * sender_id is always the caller's own team_members id — never
     * client-supplied — mirroring migration 022's identity-enforcement
     * policy that stopped chat impersonation.
     */
    public function store(Request $request, Channel $channel)
    {
        $this->authorize('staff');
        $data = $request->validate([
            'content' => ['nullable', 'string'],
            'thread_parent_id' => ['nullable', 'uuid', 'exists:messages,id'],
            'file_url' => ['nullable', 'string'],
            'file_name' => ['nullable', 'string'],
            'file_size' => ['nullable', 'integer'],
            'file_type' => ['nullable', 'string'],
        ]);

        $data['sender_id'] = app(WorkspaceContext::class)->memberId();

        $message = $channel->messages()->create($data);

        return response()->json(['data' => $message->load('sender')], 201);
    }

    public function destroy(Message $message)
    {
        $this->authorize('staff');
        $message->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
