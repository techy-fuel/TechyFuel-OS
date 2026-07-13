<?php

namespace App\Http\Controllers;

use App\Models\Channel;
use App\Models\ChannelMember;
use App\Services\WorkspaceContext;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ChannelController extends Controller
{
    /**
     * Non-DM channels are visible to any staff member; a DM channel is
     * only returned if the caller is one of its participants — same rule
     * as migration 021's is_channel_participant() policy.
     */
    public function index(Request $request)
    {
        $this->authorize('staff');
        $memberId = app(WorkspaceContext::class)->memberId();

        $channels = Channel::where(function ($q) use ($memberId) {
            $q->where('type', '<>', 'dm')
              ->orWhereHas('members', fn ($m) => $m->where('member_id', $memberId));
        })->get();

        return response()->json(['data' => $channels]);
    }

    public function store(Request $request)
    {
        $this->authorize('staff');
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'type' => ['nullable', 'string', 'in:channel,dm,group'],
            'project_id' => ['nullable', 'uuid', 'exists:projects,id'],
            'description' => ['nullable', 'string'],
            'is_private' => ['nullable', 'boolean'],
            'member_ids' => ['nullable', 'array'],
            'member_ids.*' => ['uuid', 'exists:team_members,id'],
        ]);

        $memberIds = $data['member_ids'] ?? [];
        unset($data['member_ids']);
        $data['created_by'] = app(WorkspaceContext::class)->memberId();

        $channel = DB::transaction(function () use ($data, $memberIds) {
            $channel = Channel::create($data);

            $ids = array_unique(array_merge($memberIds, [$data['created_by']]));
            foreach ($ids as $memberId) {
                if ($memberId) {
                    ChannelMember::create(['channel_id' => $channel->id, 'member_id' => $memberId]);
                }
            }

            return $channel;
        });

        return response()->json(['data' => $channel->load('members')], 201);
    }

    public function show(Channel $channel)
    {
        $this->authorize('staff');
        return response()->json(['data' => $channel->load('members')]);
    }

    public function destroy(Channel $channel)
    {
        $this->authorize('staff');
        $channel->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
