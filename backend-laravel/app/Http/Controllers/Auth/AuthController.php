<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\TeamMember;
use App\Models\User;
use App\Models\UserActiveWorkspace;
use App\Models\Workspace;
use App\Services\WorkspaceContext;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

/**
 * Replaces Supabase Auth + the handle_new_auth_user()/create_workspace()
 * triggers from migrations 017/019/020: on register, link to any
 * pre-existing invite (team_members or clients row already seeded with
 * this email), or spin up a brand-new workspace and make the signer its
 * owner.
 */
class AuthController extends Controller
{
    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
        ]);

        $user = DB::transaction(function () use ($data) {
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
            ]);

            $this->linkNewUser($user);

            return $user;
        });

        $token = $user->createToken('api')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    public function login(Request $request)
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $data['email'])->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['These credentials do not match our records.'],
            ]);
        }

        $token = $user->createToken('api')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out']);
    }

    public function me(Request $request)
    {
        $user = $request->user();
        $context = app(WorkspaceContext::class);

        $memberships = TeamMember::withoutGlobalScope('workspace')
            ->where('user_id', $user->id)
            ->where('status', 'active')
            ->with('workspace')
            ->get();

        return response()->json([
            'user' => $user,
            'memberships' => $memberships,
            'active_workspace_id' => $context->workspaceId(),
            'active_member' => $context->member(),
        ]);
    }

    /**
     * Mirrors handle_new_auth_user(): link every pre-existing invite for
     * this email across every workspace, or link a pre-added client
     * contact, or otherwise create a brand-new workspace and make this
     * user its owner.
     */
    protected function linkNewUser(User $user): void
    {
        $invitedMemberships = TeamMember::withoutGlobalScope('workspace')
            ->where('email', $user->email)
            ->whereNull('user_id')
            ->get();

        if ($invitedMemberships->isNotEmpty()) {
            foreach ($invitedMemberships as $membership) {
                $membership->update(['user_id' => $user->id, 'status' => 'active']);
            }

            $oldest = $invitedMemberships->sortBy('created_at')->first();
            UserActiveWorkspace::updateOrCreate(
                ['user_id' => $user->id],
                ['workspace_id' => $oldest->workspace_id]
            );

            return;
        }

        $invitedClient = Client::withoutGlobalScope('workspace')
            ->where('email', $user->email)
            ->whereNull('user_id')
            ->first();

        if ($invitedClient) {
            $invitedClient->update(['user_id' => $user->id]);

            return;
        }

        $workspace = Workspace::create([
            'name' => $user->name."'s Agency",
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
    }
}
