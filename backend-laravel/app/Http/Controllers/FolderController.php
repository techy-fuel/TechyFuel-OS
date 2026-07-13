<?php

namespace App\Http\Controllers;

use App\Models\Folder;
use Illuminate\Http\Request;

class FolderController extends Controller
{
    public function index()
    {
        $this->authorize('staff');
        return response()->json(['data' => Folder::orderBy('created_at', 'desc')->get()]);
    }

    public function store(Request $request)
    {
        $this->authorize('staff');
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'project_id' => ['nullable', 'uuid', 'exists:projects,id'],
            'parent_id' => ['nullable', 'uuid', 'exists:folders,id'],
        ]);
        $data['created_by'] = app(\App\Services\WorkspaceContext::class)->memberId();
        return response()->json(['data' => Folder::create($data)], 201);
    }

    public function update(Request $request, Folder $folder)
    {
        $this->authorize('staff');
        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'parent_id' => ['nullable', 'uuid', 'exists:folders,id'],
        ]);
        $folder->update($data);
        return response()->json(['data' => $folder]);
    }

    public function destroy(Folder $folder)
    {
        $this->authorize('staff');
        $folder->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
