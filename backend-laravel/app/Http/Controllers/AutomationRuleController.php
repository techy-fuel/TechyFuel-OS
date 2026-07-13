<?php

namespace App\Http\Controllers;

use App\Models\AutomationRule;
use Illuminate\Http\Request;

class AutomationRuleController extends Controller
{
    public function index()
    {
        $this->authorize('staff');
        return response()->json(['data' => AutomationRule::orderBy('created_at', 'desc')->get()]);
    }

    public function store(Request $request)
    {
        $this->authorize('staff');
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'enabled' => ['nullable', 'boolean'],
            'trigger_type' => ['required', 'string'],
            'trigger_config' => ['nullable', 'array'],
            'action_type' => ['required', 'string'],
            'action_config' => ['nullable', 'array'],
        ]);
        $data['created_by'] = app(\App\Services\WorkspaceContext::class)->memberId();
        return response()->json(['data' => AutomationRule::create($data)], 201);
    }

    public function update(Request $request, AutomationRule $automationRule)
    {
        $this->authorize('staff');
        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'enabled' => ['nullable', 'boolean'],
            'trigger_type' => ['nullable', 'string'],
            'trigger_config' => ['nullable', 'array'],
            'action_type' => ['nullable', 'string'],
            'action_config' => ['nullable', 'array'],
        ]);
        $automationRule->update($data);
        return response()->json(['data' => $automationRule]);
    }

    public function destroy(AutomationRule $automationRule)
    {
        $this->authorize('staff');
        $automationRule->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
