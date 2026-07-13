<?php

namespace App\Http\Controllers;

use App\Models\ApprovalRequest;
use App\Models\Notification;
use App\Models\Task;
use App\Services\WorkspaceContext;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('staff');

        return response()->json(['data' => Task::with('assignee', 'creator')->orderBy('created_at', 'desc')->get()]);
    }

    public function store(Request $request)
    {
        $this->authorize('staff');

        $data = $this->validated($request);
        $data['created_by'] = app(WorkspaceContext::class)->memberId();

        $task = Task::create($data);

        return response()->json(['data' => $task], 201);
    }

    public function show(Task $task)
    {
        $this->authorize('staff');

        return response()->json(['data' => $task->load('assignee', 'creator', 'project', 'client')]);
    }

    public function update(Request $request, Task $task)
    {
        $this->authorize('staff');

        $data = $this->validated($request, true);
        $wasReview = $task->status === 'review';

        $task->update($data);

        if (! $wasReview && $task->status === 'review') {
            $this->submitForReview($task);
        }

        return response()->json(['data' => $task->fresh()]);
    }

    public function destroy(Task $task)
    {
        $this->authorize('staff');

        $task->delete();

        return response()->json(['message' => 'Deleted']);
    }

    protected function validated(Request $request, bool $partial = false): array
    {
        $req = fn (string $rule) => $partial ? str_replace('required', 'sometimes', $rule) : $rule;

        return $request->validate([
            'project_id' => ['nullable', 'uuid', 'exists:projects,id'],
            'client_id' => ['nullable', 'uuid', 'exists:clients,id'],
            'title' => [$req('required'), 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'status' => ['nullable', 'string', 'in:todo,in_progress,review,done'],
            'priority' => ['nullable', 'string', 'in:low,medium,high,urgent'],
            'assigned_to' => ['nullable', 'uuid', 'exists:team_members,id'],
            'due_date' => ['nullable', 'date'],
            'tags' => ['nullable', 'array'],
        ]);
    }

    /**
     * Mirrors TasksBoard.jsx's submitForReview(): moving a task you don't
     * own into Review creates an approval_requests row and notifies the
     * creator. Skipped when you created AND moved your own task — nobody
     * to notify.
     */
    protected function submitForReview(Task $task): void
    {
        $context = app(WorkspaceContext::class);

        if (! $task->created_by || $task->created_by === $context->memberId()) {
            return;
        }

        ApprovalRequest::create([
            'task_id' => $task->id,
            'requested_by' => $context->memberId(),
            'approver_id' => $task->created_by,
            'status' => 'pending',
        ]);

        $task->update(['requires_approval' => true, 'approval_status' => 'pending']);

        Notification::notify([
            'recipient_id' => $task->created_by,
            'type' => 'approval',
            'title' => 'Task submitted for review',
            'body' => $task->title,
            'link_screen' => 'tasks',
            'link_id' => $task->id,
        ]);
    }
}
