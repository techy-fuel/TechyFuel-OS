<?php

namespace App\Http\Controllers;

use App\Models\TeamMember;
use App\Models\UserActiveWorkspace;
use App\Models\Workspace;
use App\Services\WorkspaceContext;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class WorkspaceController extends Controller
{
    public function index(Request $request)
    {
        // Deliberately bypasses the workspace global scope: this list is
        // meant to span every workspace the user belongs to (for the
        // workspace switcher), not just the currently active one.
        $workspaceIds = TeamMember::withoutGlobalScope('workspace')
            ->where('user_id', $request->user()->id)
            ->where('status', 'active')
            ->pluck('workspace_id');

        $workspaces = Workspace::whereIn('id', $workspaceIds)->get();

        return response()->json(['data' => $workspaces]);
    }

    /**
     * Replaces the create_workspace() RPC from migration 020: creates the
     * workspace, the caller's owner membership in it, and switches them to
     * it, atomically.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        $user = $request->user();

        $workspace = DB::transaction(function () use ($data, $user) {
            $workspace = Workspace::create([
                'name' => $data['name'],
                'description' => $data['description'] ?? null,
            ]);

            $member = TeamMember::create([
                'user_id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => 'owner',
                'status' => 'active',
                'workspace_id' => $workspace->id,
            ]);

            $workspace->update(['owner_id' => $member->id]);

            UserActiveWorkspace::updateOrCreate(
                ['user_id' => $user->id],
                ['workspace_id' => $workspace->id]
            );

            return $workspace;
        });

        return response()->json(['data' => $workspace], 201);
    }

    public function update(Request $request)
    {
        $this->authorize('admin');
        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'logo_url' => ['nullable', 'string'],
            'description' => ['nullable', 'string'],
            'plan' => ['nullable', 'string'],
        ]);

        $workspaceId = app(WorkspaceContext::class)->requireWorkspace();
        $workspace = Workspace::findOrFail($workspaceId);
        $workspace->update($data);

        return response()->json(['data' => $workspace]);
    }

    /**
     * Replaces the switch_workspace() RPC: validates the caller actually
     * belongs to the target workspace before switching their active one.
     */
    public function switch(Request $request)
    {
        $data = $request->validate(['workspace_id' => ['required', 'uuid']]);
        $user = $request->user();

        $isMember = TeamMember::withoutGlobalScope('workspace')
            ->where('user_id', $user->id)
            ->where('workspace_id', $data['workspace_id'])
            ->where('status', 'active')
            ->exists();

        abort_unless($isMember, 403, 'You are not a member of that workspace.');

        UserActiveWorkspace::updateOrCreate(
            ['user_id' => $user->id],
            ['workspace_id' => $data['workspace_id']]
        );

        return response()->json(['message' => 'Switched workspace']);
    }
}
