<?php

namespace App\Models;

use App\Models\Concerns\BelongsToWorkspace;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Document extends Model
{
    use HasUuids, BelongsToWorkspace;

    protected $fillable = [
        'title', 'content', 'project_id', 'task_id', 'folder_id',
        'created_by', 'updated_by', 'workspace_id',
    ];

    protected $casts = ['content' => 'array'];

    public function versions(): HasMany
    {
        return $this->hasMany(DocumentVersion::class);
    }
}
