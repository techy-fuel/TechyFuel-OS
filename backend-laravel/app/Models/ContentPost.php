<?php

namespace App\Models;

use App\Models\Concerns\BelongsToWorkspace;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ContentPost extends Model
{
    use HasUuids, BelongsToWorkspace;

    protected $fillable = [
        'client_id', 'title', 'caption', 'platform', 'status', 'scheduled_at',
        'published_at', 'media_urls', 'tags', 'assigned_to', 'created_by', 'workspace_id',
    ];

    protected $casts = ['media_urls' => 'array', 'tags' => 'array'];

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }
}
