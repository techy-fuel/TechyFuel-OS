<?php

namespace App\Models;

use App\Models\Concerns\BelongsToWorkspace;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class EmailAccount extends Model
{
    use HasUuids, BelongsToWorkspace;

    public $timestamps = false;

    protected $fillable = [
        'workspace_id', 'member_id', 'label', 'email', 'imap_host', 'imap_port',
        'smtp_host', 'smtp_port', 'from_name', 'encrypted_password', 'password_iv', 'password_tag',
    ];

    protected $hidden = ['encrypted_password', 'password_iv', 'password_tag'];
}
