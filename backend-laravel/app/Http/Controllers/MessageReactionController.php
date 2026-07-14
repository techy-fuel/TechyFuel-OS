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

    public function index(Message $message)
    {
        $this->authorize('staff');
        return response()->json(['data' => $message->reactions()->with('member:id,name')->get()]);
    }

    /**
     * Deletes by (message, caller's own member, emoji) — not by the
     * reaction row's own id — matching removeReaction(messageId,
     * memberId, emoji) from supabase-api.js, which the emoji picker
     * calls with the emoji value, not a reaction id.
     */
    public function destroy(Request $request, Message $message, string $emoji)
    {
        $this->authorize('staff');
        $memberId = app(WorkspaceContext::class)->memberId();

        $message->reactions()->where('member_id', $memberId)->where('emoji', $emoji)->delete();

        return response()->json(['message' => 'Deleted']);
    }
}
