<?php

namespace App\Services;

use App\Models\TeamMember;
use App\Models\User;
use App\Models\UserActiveWorkspace;

/**
 * Replaces Supabase's current_workspace_id() / current_member_role() /
 * current_member_id() SQL helpers. One instance is resolved per request
 * (bound as a singleton) by the EnsureWorkspaceContext middleware, which
 * calls resolveFor() once the Sanctum user is known.
 */
class WorkspaceContext
{
    protected ?TeamMember $member = null;
    protected bool $resolved = false;

    public function resolveFor(?User $user): void
    {
        $this->resolved = true;
        $this->member = null;

        if (! $user) {
            return;
        }

        $activeWorkspaceId = UserActiveWorkspace::where('user_id', $user->id)->value('workspace_id');

        $query = TeamMember::where('user_id', $user->id)->where('status', 'active');

        if ($activeWorkspaceId) {
            $member = (clone $query)->where('workspace_id', $activeWorkspaceId)->first();
            if ($member) {
                $this->member = $member;
                return;
            }
        }

        // Fall back to the oldest membership, same as current_workspace_id()'s
        // COALESCE(active row, oldest membership).
        $this->member = $query->orderBy('created_at')->first();
    }

    public function member(): ?TeamMember
    {
        return $this->member;
    }

    public function memberId(): ?string
    {
        return $this->member?->id;
    }

    public function workspaceId(): ?string
    {
        return $this->member?->workspace_id;
    }

    public function role(): ?string
    {
        return $this->member?->role;
    }

    public function isOwnerOrAdmin(): bool
    {
        return in_array($this->role(), ['owner', 'admin'], true);
    }

    public function requireWorkspace(): string
    {
        $id = $this->workspaceId();
        abort_if($id === null, 403, 'You are not an active member of any workspace.');
        return $id;
    }
}
