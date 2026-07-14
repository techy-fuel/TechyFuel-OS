<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\TaskTemplate;
use App\Services\WorkspaceContext;
use Illuminate\Http\Request;

class TaskTemplateController extends Controller
{
    public function index()
    {
        $this->authorize('staff');
        return response()->json(['data' => TaskTemplate::orderBy('created_at', 'desc')->get()]);
    }

    public function store(Request $request)
    {
        $this->authorize('staff');
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'tasks' => ['nullable', 'array'],
        ]);
        return response()->json(['data' => TaskTemplate::create($data)], 201);
    }

    public function update(Request $request, TaskTemplate $taskTemplate)
    {
        $this->authorize('staff');
        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'tasks' => ['nullable', 'array'],
        ]);
        $taskTemplate->update($data);
        return response()->json(['data' => $taskTemplate]);
    }

    public function destroy(TaskTemplate $taskTemplate)
    {
        $this->authorize('staff');
        $taskTemplate->delete();
        return response()->json(['message' => 'Deleted']);
    }

    public function apply(Request $request, TaskTemplate $taskTemplate)
    {
        $this->authorize('staff');
        $data = $request->validate([
            'project_id' => ['nullable', 'uuid', 'exists:projects,id'],
            'assign_map' => ['nullable', 'array'],
        ]);
        $assignMap = $data['assign_map'] ?? [];
        $memberId = app(WorkspaceContext::class)->memberId();

        $created = collect($taskTemplate->tasks ?? [])->map(function ($t) use ($data, $assignMap, $memberId) {
            $payload = [
                'title' => $t['title'],
                'status' => $t['status'] ?? 'todo',
                'priority' => $t['priority'] ?? 'medium',
                'created_by' => $memberId,
            ];
            if (! empty($data['project_id'])) {
                $payload['project_id'] = $data['project_id'];
            }
            if (isset($t['due_offset_days'])) {
                $payload['due_date'] = now()->addDays((int) $t['due_offset_days'])->toDateString();
            }
            if (! empty($t['assigned_role']) && ! empty($assignMap[$t['assigned_role']])) {
                $payload['assigned_to'] = $assignMap[$t['assigned_role']];
            }

            return Task::create($payload);
        });

        return response()->json(['data' => $created]);
    }
}
