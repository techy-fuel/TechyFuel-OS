<?php

namespace App\Models;

use App\Models\Concerns\BelongsToWorkspace;
use Illuminate\Database\Eloquent\Model;

class ProjectMember extends Model
{
    use BelongsToWorkspace;

    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = 'project_id';
    protected $keyType = 'string';

    protected $fillable = ['project_id', 'member_id', 'role', 'workspace_id'];
}
