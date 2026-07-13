<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('staff');

        return response()->json(['data' => Project::with('client')->orderBy('created_at', 'desc')->get()]);
    }

    public function store(Request $request)
    {
        $this->authorize('staff');

        $data = $request->validate([
            'client_id' => ['nullable', 'uuid', 'exists:clients,id'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'status' => ['nullable', 'string', 'in:active,paused,completed,archived'],
            'priority' => ['nullable', 'string', 'in:low,medium,high'],
            'start_date' => ['nullable', 'date'],
            'due_date' => ['nullable', 'date'],
            'budget' => ['nullable', 'numeric'],
            'currency' => ['nullable', 'string', 'max:10'],
        ]);

        $data['created_by'] = app(\App\Services\WorkspaceContext::class)->memberId();

        $project = Project::create($data);

        return response()->json(['data' => $project], 201);
    }

    public function show(Project $project)
    {
        $this->authorize('staff');

        return response()->json(['data' => $project->load('client', 'tasks')]);
    }

    public function update(Request $request, Project $project)
    {
        $this->authorize('staff');

        $data = $request->validate([
            'client_id' => ['nullable', 'uuid', 'exists:clients,id'],
            'name' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'status' => ['nullable', 'string', 'in:active,paused,completed,archived'],
            'priority' => ['nullable', 'string', 'in:low,medium,high'],
            'start_date' => ['nullable', 'date'],
            'due_date' => ['nullable', 'date'],
            'budget' => ['nullable', 'numeric'],
            'spent' => ['nullable', 'numeric'],
            'progress' => ['nullable', 'integer', 'min:0', 'max:100'],
            'currency' => ['nullable', 'string', 'max:10'],
        ]);

        $project->update($data);

        return response()->json(['data' => $project]);
    }

    public function destroy(Project $project)
    {
        $this->authorize('staff');

        $project->delete();

        return response()->json(['message' => 'Deleted']);
    }
}
