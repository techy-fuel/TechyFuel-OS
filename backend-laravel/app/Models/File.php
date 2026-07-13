<?php

namespace App\Models;

use App\Models\Concerns\BelongsToWorkspace;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class File extends Model
{
    use HasUuids, BelongsToWorkspace;

    public $timestamps = false;

    protected $fillable = [
        'project_id', 'client_id', 'name', 'file_path', 'file_size', 'mime_type',
        'uploaded_by', 'task_id', 'folder_id', 'workspace_id',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    // Named uploader(), not uploadedBy() — the latter's snake_case JSON
    // key ("uploaded_by") would silently overwrite the raw uploaded_by
    // FK column of the same name when the relation is eager loaded.
    public function uploader(): BelongsTo
    {
        return $this->belongsTo(TeamMember::class, 'uploaded_by');
    }
}
