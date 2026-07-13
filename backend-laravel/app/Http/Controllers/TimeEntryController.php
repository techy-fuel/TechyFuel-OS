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
