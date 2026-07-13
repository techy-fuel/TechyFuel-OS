<?php

namespace App\Http\Controllers;

use App\Models\TaskTemplate;
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

    public function destroy(TaskTemplate $taskTemplate)
    {
        $this->authorize('staff');
        $taskTemplate->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
