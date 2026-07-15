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

    // Was a DB-level jsonb DEFAULT '[]' in Postgres — that syntax isn't
    // portable to MySQL/MariaDB, so the default lives here instead.
    protected $attributes = ['content' => '[]'];

    public function versions(): HasMany
    {
        return $this->hasMany(DocumentVersion::class);
    }
}
