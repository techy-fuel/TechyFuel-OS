<?php

namespace App\Models;

use App\Models\Concerns\BelongsToWorkspace;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Channel extends Model
{
    use HasUuids, BelongsToWorkspace;

    public $timestamps = false;

    protected $fillable = ['name', 'type', 'project_id', 'description', 'is_private', 'created_by', 'workspace_id'];

    public function members(): HasMany
    {
        return $this->hasMany(ChannelMember::class);
    }

    public function messages(): HasMany
    {
        return $this->hasMany(Message::class);
    }
}
