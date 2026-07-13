<?php

namespace App\Http\Controllers;

use App\Models\File as FileModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

/**
 * File metadata lives in Postgres (this table); the bytes live on the
 * configured filesystem disk (local by default, S3 in production — see
 * config/filesystems.php). Replaces Supabase Storage's "project-files" /
 * "files" / "avatars" buckets.
 */
class FileController extends Controller
{
    public function index()
    {
        $this->authorize('staff');
        return response()->json(['data' => FileModel::orderBy('created_at', 'desc')->get()]);
    }

    public function store(Request $request)
    {
        $this->authorize('staff');
        $request->validate([
            'file' => ['required', 'file', 'max:51200'],
            'project_id' => ['nullable', 'uuid', 'exists:projects,id'],
            'client_id' => ['nullable', 'uuid', 'exists:clients,id'],
            'task_id' => ['nullable', 'uuid', 'exists:tasks,id'],
            'folder_id' => ['nullable', 'uuid', 'exists:folders,id'],
        ]);

        $uploaded = $request->file('file');
        $path = $uploaded->store('workspace-files', 'public');

        $file = FileModel::create([
            'project_id' => $request->input('project_id'),
            'client_id' => $request->input('client_id'),
            'task_id' => $request->input('task_id'),
            'folder_id' => $request->input('folder_id'),
            'name' => $uploaded->getClientOriginalName(),
            'file_path' => $path,
            'file_size' => $uploaded->getSize(),
            'mime_type' => $uploaded->getMimeType(),
            'uploaded_by' => app(\App\Services\WorkspaceContext::class)->memberId(),
        ]);

        return response()->json(['data' => $file], 201);
    }

    public function show(FileModel $file)
    {
        $this->authorize('staff');

        $data = $file->toArray();
        $data['url'] = Storage::disk('public')->url($file->file_path);

        return response()->json(['data' => $data]);
    }

    public function destroy(FileModel $file)
    {
        $this->authorize('staff');
        Storage::disk('public')->delete($file->file_path);
        $file->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
