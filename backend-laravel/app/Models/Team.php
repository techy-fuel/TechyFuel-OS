<?php

namespace App\Models;

use App\Models\Concerns\BelongsToWorkspace;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Team extends Model
{
    use HasUuids, BelongsToWorkspace;

    public $timestamps = false;

    protected $fillable = ['workspace_id', 'name', 'color', 'icon', 'description'];

    public function memberships(): HasMany
    {
        return $this->hasMany(TeamMembership::class);
    }
}
