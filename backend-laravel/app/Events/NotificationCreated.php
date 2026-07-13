<?php

namespace App\Events;

use App\Models\Notification;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Fired for every notifications row (see TeamMember-aware dispatch in
 * NotificationObserver) so the bell icon updates live — replaces the
 * Supabase Realtime subscription the frontend had on the notifications
 * table. Broadcasts only to the recipient's own private user channel —
 * NOT the workspace channel — since a notification's body can contain a
 * reviewer's private comment that only the recipient (or, when they poll
 * GET /notifications, an owner/admin) should ever see.
 */
class NotificationCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public Notification $notification, public string $recipientUserId)
    {
    }

    public function broadcastOn(): array
    {
        return [new PrivateChannel('App.Models.User.'.$this->recipientUserId)];
    }

    public function broadcastAs(): string
    {
        return 'notification.created';
    }

    public function broadcastWith(): array
    {
        return ['notification' => $this->notification->toArray()];
    }
}
