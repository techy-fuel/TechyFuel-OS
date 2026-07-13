<?php

namespace App\Models;

use App\Models\Concerns\BelongsToWorkspace;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AdCampaign extends Model
{
    use HasUuids, BelongsToWorkspace;

    protected $fillable = [
        'client_id', 'name', 'platform', 'status', 'budget_daily', 'budget_total',
        'spent', 'impressions', 'clicks', 'conversions', 'start_date', 'end_date', 'workspace_id',
    ];

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }
}
