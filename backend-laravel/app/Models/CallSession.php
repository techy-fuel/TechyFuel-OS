<?php

namespace App\Models;

use App\Models\Concerns\BelongsToWorkspace;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class CallSession extends Model
{
    use HasUuids, BelongsToWorkspace;

    public $timestamps = false;

    protected $fillable = [
        'channel_id', 'type', 'room_name', 'started_by', 'started_at',
        'ended_at', 'recording_url', 'participant_count', 'workspace_id',
    ];
}
