<?php

namespace App\Http\Controllers;

use App\Models\PipelineDeal;
use Illuminate\Http\Request;

class PipelineDealController extends Controller
{
    public function index()
    {
        $this->authorize('staff');
        return response()->json(['data' => PipelineDeal::with('client', 'assignee')->orderBy('created_at', 'desc')->get()]);
    }

    public function store(Request $request)
    {
        $this->authorize('staff');
        $data = $request->validate([
            'client_id' => ['nullable', 'uuid', 'exists:clients,id'],
            'title' => ['required', 'string', 'max:255'],
            'value' => ['nullable', 'numeric'],
            'stage' => ['nullable', 'string', 'in:lead,qualified,proposal,negotiation,won,lost'],
            'probability' => ['nullable', 'integer', 'min:0', 'max:100'],
            'expected_close' => ['nullable', 'date'],
            'assigned_to' => ['nullable', 'uuid', 'exists:team_members,id'],
            'notes' => ['nullable', 'string'],
        ]);
        return response()->json(['data' => PipelineDeal::create($data)], 201);
    }

    public function show(PipelineDeal $pipelineDeal)
    {
        $this->authorize('staff');
        return response()->json(['data' => $pipelineDeal->load('client', 'assignee')]);
    }

    public function update(Request $request, PipelineDeal $pipelineDeal)
    {
        $this->authorize('staff');
        $data = $request->validate([
            'client_id' => ['nullable', 'uuid', 'exists:clients,id'],
            'title' => ['sometimes', 'string', 'max:255'],
            'value' => ['nullable', 'numeric'],
            'stage' => ['nullable', 'string', 'in:lead,qualified,proposal,negotiation,won,lost'],
            'probability' => ['nullable', 'integer', 'min:0', 'max:100'],
            'expected_close' => ['nullable', 'date'],
            'assigned_to' => ['nullable', 'uuid', 'exists:team_members,id'],
            'notes' => ['nullable', 'string'],
        ]);
        $pipelineDeal->update($data);
        return response()->json(['data' => $pipelineDeal]);
    }

    public function destroy(PipelineDeal $pipelineDeal)
    {
        $this->authorize('staff');
        $pipelineDeal->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
