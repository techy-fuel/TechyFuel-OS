<?php

namespace App\Models;

use App\Events\NotificationCreated;
use App\Models\Concerns\BelongsToWorkspace;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasUuids, BelongsToWorkspace;

    public $timestamps = false;

    protected $fillable = [
        'recipient_id', 'type', 'title', 'body', 'link_screen', 'link_id', 'read', 'workspace_id',
    ];

    protected $casts = ['read' => 'boolean'];

    /**
     * Creates the row and broadcasts it live to the recipient, if they
     * have a linked user account (a placeholder team_members row with no
     * user_id yet just gets the row, no live push). Use this instead of
     * Notification::create() everywhere a notification is sent.
     */
    public static function notify(array $attributes): self
    {
        $notification = static::create($attributes);

        $userId = TeamMember::withoutGlobalScope('workspace')
            ->whereKey($attributes['recipient_id'] ?? null)
            ->value('user_id');

        if ($userId) {
            event(new NotificationCreated($notification, $userId));
        }

        return $notification;
    }
}
