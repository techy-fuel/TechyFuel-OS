<?php

namespace App\Http\Controllers;

use App\Models\AdCampaign;
use Illuminate\Http\Request;

class AdCampaignController extends Controller
{
    public function index()
    {
        $this->authorize('staff');
        return response()->json(['data' => AdCampaign::with('client')->orderBy('created_at', 'desc')->get()]);
    }

    public function store(Request $request)
    {
        $this->authorize('staff');
        $data = $request->validate([
            'client_id' => ['nullable', 'uuid', 'exists:clients,id'],
            'name' => ['required', 'string', 'max:255'],
            'platform' => ['nullable', 'string', 'in:meta,google,tiktok'],
            'status' => ['nullable', 'string', 'in:active,paused,ended,draft'],
            'budget_daily' => ['nullable', 'numeric'],
            'budget_total' => ['nullable', 'numeric'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date'],
        ]);
        return response()->json(['data' => AdCampaign::create($data)], 201);
    }

    public function show(AdCampaign $adCampaign)
    {
        $this->authorize('staff');
        return response()->json(['data' => $adCampaign->load('client')]);
    }

    public function update(Request $request, AdCampaign $adCampaign)
    {
        $this->authorize('staff');
        $data = $request->validate([
            'client_id' => ['nullable', 'uuid', 'exists:clients,id'],
            'name' => ['sometimes', 'string', 'max:255'],
            'platform' => ['nullable', 'string', 'in:meta,google,tiktok'],
            'status' => ['nullable', 'string', 'in:active,paused,ended,draft'],
            'budget_daily' => ['nullable', 'numeric'],
            'budget_total' => ['nullable', 'numeric'],
            'spent' => ['nullable', 'numeric'],
            'impressions' => ['nullable', 'integer'],
            'clicks' => ['nullable', 'integer'],
            'conversions' => ['nullable', 'integer'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date'],
        ]);
        $adCampaign->update($data);
        return response()->json(['data' => $adCampaign]);
    }

    public function destroy(AdCampaign $adCampaign)
    {
        $this->authorize('staff');
        $adCampaign->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
