<?php

namespace App\Models;

use App\Models\Concerns\BelongsToWorkspace;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ApprovalRequest extends Model
{
    use HasUuids, BelongsToWorkspace;

    public $timestamps = false;

    protected $fillable = [
        'task_id', 'requested_by', 'approver_id', 'status', 'comment',
        'resolved_at', 'workspace_id',
    ];

    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(TeamMember::class, 'approver_id');
    }

    public function requester(): BelongsTo
    {
        return $this->belongsTo(TeamMember::class, 'requested_by');
    }
}
