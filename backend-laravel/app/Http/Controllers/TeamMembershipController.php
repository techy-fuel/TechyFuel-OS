<?php

namespace App\Http\Controllers;

use App\Models\Team;
use App\Models\TeamMembership;
use Illuminate\Http\Request;

class TeamMembershipController extends Controller
{
    public function store(Request $request, Team $team)
    {
        $this->authorize('admin');
        $data = $request->validate([
            'member_id' => ['required', 'uuid', 'exists:team_members,id'],
            'role' => ['nullable', 'string'],
        ]);
        $data['team_id'] = $team->id;

        return response()->json(['data' => TeamMembership::create($data)], 201);
    }

    public function destroy(Team $team, string $memberId)
    {
        $this->authorize('admin');
        TeamMembership::where('team_id', $team->id)->where('member_id', $memberId)->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
