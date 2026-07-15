<?php

namespace App\Models;

use App\Models\Concerns\BelongsToWorkspace;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class DocumentVersion extends Model
{
    use HasUuids, BelongsToWorkspace;

    public $timestamps = false;

    protected $fillable = ['document_id', 'title', 'content', 'created_by', 'workspace_id'];

    protected $casts = ['content' => 'array'];
    protected $attributes = ['content' => '[]'];
}
