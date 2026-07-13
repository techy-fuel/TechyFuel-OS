<?php

use App\Models\Channel as ChatChannel;
use App\Models\TeamMember;
use App\Models\User;
use Illuminate\Support\Facades\Broadcast;

/**
 * Two private channels replace Supabase Realtime's per-table subscriptions:
 *   - workspace.{workspaceId}   any active member of that workspace — used
 *     for the notifications bell and board-wide task/list updates.
 *   - chat.{channelId}          only participants of that chat channel —
 *     same DM-privacy rule as migration 021's is_channel_participant().
 */
Broadcast::channel('workspace.{workspaceId}', function (User $user, string $workspaceId) {
    return TeamMember::withoutGlobalScope('workspace')
        ->where('user_id', $user->id)
        ->where('workspace_id', $workspaceId)
        ->where('status', 'active')
        ->exists();
});

Broadcast::channel('chat.{channelId}', function (User $user, string $channelId) {
    $channel = ChatChannel::withoutGlobalScope('workspace')->find($channelId);
    if (! $channel) {
        return false;
    }

    $memberId = TeamMember::withoutGlobalScope('workspace')
        ->where('user_id', $user->id)
        ->where('workspace_id', $channel->workspace_id)
        ->where('status', 'active')
        ->value('id');

    if (! $memberId) {
        return false;
    }

    if ($channel->type !== 'dm') {
        return true;
    }

    return $channel->members()->where('member_id', $memberId)->exists();
});
