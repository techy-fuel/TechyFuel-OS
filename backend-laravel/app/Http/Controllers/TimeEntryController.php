<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\TimeEntry;
use App\Services\WorkspaceContext;
use Illuminate\Http\Request;

class TimeEntryController extends Controller
{
    public function index(Request $request, Task $task)
    {
        $this->authorize('staff');
        return response()->json(['data' => $task->timeEntries()->orderBy('started_at', 'desc')->get()]);
    }

    /**
     * The one open (ended_at is null) entry for the calling member, if
     * any — mirrors getRunningTimeEntry(memberId) from supabase-api.js,
     * which the timer widget polls to know whether to show "stop" or
     * "start" and which task it's currently running on.
     */
    public function running(Request $request)
    {
        $this->authorize('staff');
        $memberId = app(WorkspaceContext::class)->memberId();

        $entry = TimeEntry::with('task:id,title')
            ->where('member_id', $memberId)
            ->whereNull('ended_at')
            ->first();

        return response()->json(['data' => $entry]);
    }

    /**
     * Every stopped entry across all tasks/members — mirrors
     * getAllTimeEntries(), used by the reporting view to sum time spent
     * per person/task without re-querying per task.
     */
    public function all(Request $request)
    {
        $this->authorize('staff');

        $entries = TimeEntry::with('task:id,title,status', 'member:id,name')
            ->whereNotNull('duration_seconds')
            ->orderBy('started_at', 'desc')
            ->get();

        return response()->json(['data' => $entries]);
    }

    /**
     * Starts a timer for this task under the caller's own membership. The
     * frontend is responsible for stopping any other open timer first —
     * same as the original single-page timer widget (no DB-level
     * exclusivity constraint existed in the Supabase schema either).
     */
    public function start(Request $request, Task $task)
    {
        $this->authorize('staff');
        $entry = TimeEntry::create([
            'task_id' => $task->id,
            'member_id' => app(WorkspaceContext::class)->memberId(),
            'started_at' => now(),
        ]);

        return response()->json(['data' => $entry], 201);
    }

    public function stop(TimeEntry $timeEntry)
    {
        $this->authorize('staff');
        $endedAt = now();
        $timeEntry->update([
            'ended_at' => $endedAt,
            'duration_seconds' => $endedAt->getTimestamp() - $timeEntry->started_at->getTimestamp(),
        ]);

        return response()->json(['data' => $timeEntry]);
    }
}
