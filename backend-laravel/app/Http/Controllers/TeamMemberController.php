<?php

namespace App\Http\Controllers;

use App\Models\TeamMember;
use Illuminate\Http\Request;

class TeamMemberController extends Controller
{
    public function index()
    {
        $this->authorize('staff');
        return response()->json(['data' => TeamMember::orderBy('created_at')->get()]);
    }

    /**
     * "Invite" just pre-creates a team_members row with no user_id yet —
     * it links up automatically the moment someone registers with this
     * email (see AuthController::linkNewUser).
     */
    public function store(Request $request)
    {
        $this->authorize('admin');
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'role' => ['nullable', 'string', 'in:owner,admin,member'],
            'department' => ['nullable', 'string', 'max:255'],
        ]);
        $data['status'] = 'invited';

        return response()->json(['data' => TeamMember::create($data)], 201);
    }

    public function update(Request $request, TeamMember $teamMember)
    {
        $context = app(\App\Services\WorkspaceContext::class);
        $changingRoleOrStatus = $request->has('role') || $request->has('status');

        // Anyone can edit their own profile fields; only owner/admin can
        // change role/status — mirrors protect_team_member_role_status().
        if ($changingRoleOrStatus) {
            $this->authorize('admin');
        } else {
            abort_unless($context->isOwnerOrAdmin() || $teamMember->id === $context->memberId(), 403);
        }

        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'role' => ['nullable', 'string', 'in:owner,admin,member'],
            'status' => ['nullable', 'string', 'in:active,invited,inactive'],
            'department' => ['nullable', 'string', 'max:255'],
            'avatar_url' => ['nullable', 'string'],
        ]);

        $teamMember->update($data);

        return response()->json(['data' => $teamMember]);
    }

    public function destroy(TeamMember $teamMember)
    {
        $this->authorize('admin');
        $teamMember->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
