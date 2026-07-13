<?php

namespace App\Models;

use App\Models\Concerns\BelongsToWorkspace;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class File extends Model
{
    use HasUuids, BelongsToWorkspace;

    public $timestamps = false;

    protected $fillable = [
        'project_id', 'client_id', 'name', 'file_path', 'file_size', 'mime_type',
        'uploaded_by', 'task_id', 'folder_id', 'workspace_id',
    ];
}
