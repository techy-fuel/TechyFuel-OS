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
