<?php

namespace App\Models;

use App\Models\Concerns\BelongsToWorkspace;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class AutomationRule extends Model
{
    use HasUuids, BelongsToWorkspace;

    public $timestamps = false;

    protected $fillable = [
        'name', 'enabled', 'trigger_type', 'trigger_config', 'action_type',
        'action_config', 'run_count', 'last_run_at', 'created_by', 'workspace_id',
    ];

    protected $casts = ['trigger_config' => 'array', 'action_config' => 'array'];
    protected $attributes = ['trigger_config' => '{}', 'action_config' => '{}'];
}
