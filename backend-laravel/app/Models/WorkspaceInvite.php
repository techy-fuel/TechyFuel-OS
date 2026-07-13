<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class WorkspaceInvite extends Model
{
    use HasUuids;

    public $timestamps = false;

    protected $fillable = ['workspace_id', 'email', 'token', 'role', 'invited_by', 'accepted_at', 'expires_at'];

    protected static function booted(): void
    {
        static::creating(function (WorkspaceInvite $invite) {
            $invite->token ??= Str::random(40);
            $invite->expires_at ??= now()->addDays(7);
        });
    }
}
