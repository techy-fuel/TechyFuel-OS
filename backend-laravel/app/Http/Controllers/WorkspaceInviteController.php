<?php

namespace App\Http\Controllers;

use App\Models\WorkspaceInvite;
use App\Services\WorkspaceContext;
use Illuminate\Http\Request;

class WorkspaceInviteController extends Controller
{
    public function index()
    {
        $this->authorize('admin');
        $workspaceId = app(WorkspaceContext::class)->requireWorkspace();

        return response()->json([
            'data' => WorkspaceInvite::with('inviter')->where('workspace_id', $workspaceId)
                ->orderBy('created_at', 'desc')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $this->authorize('admin');
        $data = $request->validate([
            'email' => ['nullable', 'email'],
            'role' => ['nullable', 'string', 'in:owner,admin,member'],
        ]);
        $data['workspace_id'] = app(WorkspaceContext::class)->requireWorkspace();
        $data['invited_by'] = app(WorkspaceContext::class)->memberId();

        return response()->json(['data' => WorkspaceInvite::create($data)], 201);
    }

    public function destroy(WorkspaceInvite $workspaceInvite)
    {
        $this->authorize('admin');
        $workspaceInvite->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
