<?php

namespace App\Models;

use App\Models\Concerns\BelongsToWorkspace;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Client extends Model
{
    use HasUuids, BelongsToWorkspace;

    protected $fillable = [
        'name', 'company', 'email', 'phone', 'website', 'status', 'avatar_url',
        'industry', 'monthly_value', 'notes', 'user_id', 'workspace_id',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function projects(): HasMany
    {
        return $this->hasMany(Project::class);
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }

    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class);
    }

    // Named clientNotes(), not notes(), to avoid colliding with the
    // client's own free-text `notes` column above.
    public function clientNotes(): HasMany
    {
        return $this->hasMany(ClientNote::class);
    }
}
