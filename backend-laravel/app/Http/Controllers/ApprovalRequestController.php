<?php

namespace App\Http\Controllers;

use App\Models\ApprovalRequest;
use App\Models\Notification;
use App\Services\WorkspaceContext;
use Illuminate\Http\Request;

class ApprovalRequestController extends Controller
{
    public function index()
    {
        $this->authorize('staff');
        return response()->json(['data' => ApprovalRequest::with('task', 'requester', 'approver')->orderBy('created_at', 'desc')->get()]);
    }

    public function store(Request $request)
    {
        $this->authorize('staff');
        $data = $request->validate([
            'task_id' => ['required', 'uuid', 'exists:tasks,id'],
            'approver_id' => ['nullable', 'uuid', 'exists:team_members,id'],
        ]);
        $data['requested_by'] = app(WorkspaceContext::class)->memberId();
        $data['status'] = 'pending';

        return response()->json(['data' => ApprovalRequest::create($data)], 201);
    }

    public function pendingForTask(string $taskId)
    {
        $this->authorize('staff');
        $pending = ApprovalRequest::where('task_id', $taskId)->where('status', 'pending')
            ->orderBy('created_at', 'desc')->first(['id', 'requested_by']);

        return response()->json(['data' => $pending]);
    }

    public function latestForTask(string $taskId)
    {
        $this->authorize('staff');
        $latest = ApprovalRequest::with('approver:id,name')->where('task_id', $taskId)
            ->orderBy('created_at', 'desc')->first();

        return response()->json(['data' => $latest]);
    }

    /**
     * Mirrors TaskCard's Approve/Send back buttons: approved -> task goes
     * to 'done', rejected -> back to 'in_progress'; the submitter gets a
     * notification either way, with the reviewer's optional comment.
     */
    public function resolve(Request $request, ApprovalRequest $approvalRequest)
    {
        $this->authorize('staff');
        $data = $request->validate([
            'approved' => ['required', 'boolean'],
            'comment' => ['nullable', 'string'],
        ]);

        $status = $data['approved'] ? 'approved' : 'rejected';
        $newTaskStatus = $data['approved'] ? 'done' : 'in_progress';

        $approvalRequest->update([
            'status' => $status,
            'comment' => $data['comment'] ?? null,
            'resolved_at' => now(),
        ]);

        $approvalRequest->task->update(['status' => $newTaskStatus, 'approval_status' => $status]);

        Notification::notify([
            'recipient_id' => $approvalRequest->requested_by,
            'type' => $data['approved'] ? 'task_done' : 'task_assigned',
            'title' => $data['approved'] ? 'Task approved' : 'Task sent back',
            'body' => $data['comment'] ?? null,
            'link_screen' => 'tasks',
            'link_id' => $approvalRequest->task_id,
        ]);

        return response()->json(['data' => $approvalRequest->fresh(['task'])]);
    }
}
