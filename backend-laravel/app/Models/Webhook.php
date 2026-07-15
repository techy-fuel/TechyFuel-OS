<?php

namespace App\Models;

use App\Models\Concerns\BelongsToWorkspace;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Webhook extends Model
{
    use HasUuids, BelongsToWorkspace;

    public $timestamps = false;

    protected $fillable = [
        'name', 'url', 'events', 'secret', 'enabled', 'last_triggered_at',
        'last_status', 'workspace_id',
    ];

    protected $casts = ['events' => 'array'];
    protected $attributes = ['events' => '[]'];
}
