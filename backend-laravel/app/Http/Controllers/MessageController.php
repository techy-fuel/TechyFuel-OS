<?php

namespace App\Http\Controllers;

use App\Events\MessagePosted;
use App\Models\Channel;
use App\Models\Message;
use App\Services\WorkspaceContext;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function index(Request $request, Channel $channel)
    {
        $this->authorize('staff');
        $query = $channel->messages()->with('sender', 'reactions');

        if ($request->filled('parent_id')) {
            $query->where('thread_parent_id', $request->query('parent_id'));
        } else {
            $query->whereNull('thread_parent_id');
        }

        return response()->json(['data' => $query->orderBy('created_at')->get()]);
    }

    public function pinned(Channel $channel)
    {
        $this->authorize('staff');
        return response()->json([
            'data' => $channel->messages()->with('sender')->where('pinned', true)
                ->orderBy('created_at', 'desc')->get(),
        ]);
    }

    public function pin(Request $request, Message $message)
    {
        $this->authorize('staff');
        $data = $request->validate(['pinned' => ['required', 'boolean']]);
        $message->update($data);
        return response()->json(['data' => $message]);
    }

    public function search(Request $request)
    {
        $this->authorize('staff');
        $q = $request->query('q', '');

        return response()->json([
            'data' => Message::with('sender', 'channel')
                ->where('content', 'ilike', "%{$q}%")
                ->orderBy('created_at', 'desc')
                ->limit(30)
                ->get(),
        ]);
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
        $message->load('sender');

        event(new MessagePosted($message));

        return response()->json(['data' => $message], 201);
    }

    public function destroy(Message $message)
    {
        $this->authorize('staff');
        $message->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
