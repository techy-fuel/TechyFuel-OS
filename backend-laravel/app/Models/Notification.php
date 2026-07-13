<?php

namespace App\Models;

use App\Models\Concerns\BelongsToWorkspace;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasUuids, BelongsToWorkspace;

    public $timestamps = false;

    protected $fillable = [
        'recipient_id', 'type', 'title', 'body', 'link_screen', 'link_id', 'read', 'workspace_id',
    ];

    protected $casts = ['read' => 'boolean'];
}
