<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
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

    // Named inviter(), not invitedBy() — the latter's snake_case JSON key
    // ("invited_by") would silently overwrite the raw invited_by FK
    // column of the same name when the relation is eager loaded.
    public function inviter(): BelongsTo
    {
        return $this->belongsTo(TeamMember::class, 'invited_by');
    }
}
