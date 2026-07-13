<?php

namespace App\Models;

use App\Models\Concerns\BelongsToWorkspace;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class ClientInvite extends Model
{
    use HasUuids, BelongsToWorkspace;

    public $timestamps = false;

    protected $fillable = ['client_id', 'token', 'expires_at', 'workspace_id'];

    protected static function booted(): void
    {
        static::creating(function (ClientInvite $invite) {
            $invite->token ??= Str::random(48);
        });
    }
}
