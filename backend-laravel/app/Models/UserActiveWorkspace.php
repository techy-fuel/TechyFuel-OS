<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserActiveWorkspace extends Model
{
    protected $table = 'user_active_workspace';
    protected $primaryKey = 'user_id';
    public $incrementing = false;
    protected $keyType = 'string';

    const CREATED_AT = null;
    const UPDATED_AT = 'updated_at';

    protected $fillable = ['user_id', 'workspace_id'];
}
