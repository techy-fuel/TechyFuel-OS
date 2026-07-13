<?php

namespace App\Http\Controllers;

use App\Models\Channel;
use App\Models\ChannelMember;
use Illuminate\Http\Request;

class ChannelMemberController extends Controller
{
    public function index(Channel $channel)
    {
        $this->authorize('staff');
        return response()->json(['data' => $channel->members()->with('member:id,name,avatar_url,role')->get()]);
    }

    public function store(Request $request, Channel $channel)
    {
        $this->authorize('staff');
        $data = $request->validate(['member_id' => ['required', 'uuid', 'exists:team_members,id']]);
        $member = ChannelMember::firstOrCreate(['channel_id' => $channel->id, 'member_id' => $data['member_id']]);
        return response()->json(['data' => $member], 201);
    }

    public function destroy(Channel $channel, string $memberId)
    {
        $this->authorize('staff');
        $channel->members()->where('member_id', $memberId)->delete();
        return response()->json(['message' => 'Deleted']);
    }

    public function markRead(Request $request, Channel $channel, string $memberId)
    {
        $this->authorize('staff');
        $channel->members()->where('member_id', $memberId)->update(['last_read_at' => now()]);
        return response()->json(['message' => 'Marked read']);
    }
}
