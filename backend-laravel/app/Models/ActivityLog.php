<?php

namespace App\Models;

use App\Models\Concerns\BelongsToWorkspace;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class ActivityLog extends Model
{
    use HasUuids, BelongsToWorkspace;

    protected $table = 'activity_log';
    public $timestamps = false;

    protected $fillable = [
        'actor_id', 'actor_name', 'action', 'entity_type', 'entity_id',
        'entity_name', 'meta', 'workspace_id',
    ];

    protected $casts = ['meta' => 'array'];
}
