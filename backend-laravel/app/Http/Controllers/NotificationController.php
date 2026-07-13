<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Services\WorkspaceContext;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /**
     * You see your own notifications; owner/admin can see everyone's —
     * same rule as migration 018's "View own notifications" policy.
     */
    public function index(Request $request)
    {
        $this->authorize('staff');
        $context = app(WorkspaceContext::class);

        $query = Notification::query();
        if (! $context->isOwnerOrAdmin()) {
            $query->where('recipient_id', $context->memberId());
        }

        return response()->json(['data' => $query->orderBy('created_at', 'desc')->get()]);
    }

    public function store(Request $request)
    {
        $this->authorize('staff');
        $data = $request->validate([
            'recipient_id' => ['required', 'uuid', 'exists:team_members,id'],
            'type' => ['required', 'string'],
            'title' => ['required', 'string'],
            'body' => ['nullable', 'string'],
            'link_screen' => ['nullable', 'string'],
            'link_id' => ['nullable', 'uuid'],
        ]);

        return response()->json(['data' => Notification::notify($data)], 201);
    }

    public function markAllRead(Request $request)
    {
        $this->authorize('staff');
        $context = app(WorkspaceContext::class);

        $query = Notification::where('read', false);
        if (! $context->isOwnerOrAdmin()) {
            $query->where('recipient_id', $context->memberId());
        }
        $query->update(['read' => true]);

        return response()->json(['message' => 'Marked all read']);
    }

    public function unreadCount(Request $request)
    {
        $this->authorize('staff');
        $context = app(WorkspaceContext::class);

        $query = Notification::where('read', false);
        if (! $context->isOwnerOrAdmin()) {
            $query->where('recipient_id', $context->memberId());
        }

        return response()->json(['count' => $query->count()]);
    }

    public function update(Request $request, Notification $notification)
    {
        $this->authorize('staff');
        $context = app(WorkspaceContext::class);
        abort_unless($notification->recipient_id === $context->memberId() || $context->isOwnerOrAdmin(), 403);

        $data = $request->validate(['read' => ['required', 'boolean']]);
        $notification->update($data);

        return response()->json(['data' => $notification]);
    }

    public function destroy(Notification $notification)
    {
        $this->authorize('staff');
        $context = app(WorkspaceContext::class);
        abort_unless($notification->recipient_id === $context->memberId() || $context->isOwnerOrAdmin(), 403);

        $notification->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
