<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class TeamMembership extends Model
{
    use HasUuids;

    public $timestamps = false;

    protected $fillable = ['team_id', 'member_id', 'role', 'joined_at'];
}
