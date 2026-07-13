<?php

namespace App\Models;

use App\Models\Concerns\BelongsToWorkspace;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PipelineDeal extends Model
{
    use HasUuids, BelongsToWorkspace;

    protected $fillable = [
        'client_id', 'title', 'value', 'stage', 'probability', 'expected_close',
        'assigned_to', 'notes', 'workspace_id',
    ];

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function assignee(): BelongsTo
    {
        return $this->belongsTo(TeamMember::class, 'assigned_to');
    }
}
