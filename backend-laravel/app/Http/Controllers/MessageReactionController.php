<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\MessageReaction;
use App\Services\WorkspaceContext;
use Illuminate\Http\Request;

class MessageReactionController extends Controller
{
    public function store(Request $request, Message $message)
    {
        $this->authorize('staff');
        $data = $request->validate(['emoji' => ['required', 'string', 'max:32']]);
        $memberId = app(WorkspaceContext::class)->memberId();

        $reaction = MessageReaction::firstOrCreate([
            'message_id' => $message->id,
            'member_id' => $memberId,
            'emoji' => $data['emoji'],
        ]);

        return response()->json(['data' => $reaction], 201);
    }

    public function destroy(Message $message, MessageReaction $reaction)
    {
        $this->authorize('staff');
        $reaction->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
