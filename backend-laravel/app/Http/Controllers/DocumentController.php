<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DocumentController extends Controller
{
    public function index()
    {
        $this->authorize('staff');
        return response()->json(['data' => Document::orderBy('updated_at', 'desc')->get()]);
    }

    public function store(Request $request)
    {
        $this->authorize('staff');
        $data = $request->validate([
            'title' => ['nullable', 'string', 'max:255'],
            'content' => ['nullable', 'array'],
            'project_id' => ['nullable', 'uuid', 'exists:projects,id'],
            'task_id' => ['nullable', 'uuid', 'exists:tasks,id'],
            'folder_id' => ['nullable', 'uuid', 'exists:folders,id'],
        ]);
        $memberId = app(\App\Services\WorkspaceContext::class)->memberId();
        $data['created_by'] = $memberId;
        $data['updated_by'] = $memberId;
        return response()->json(['data' => Document::create($data)], 201);
    }

    public function show(Document $document)
    {
        $this->authorize('staff');
        return response()->json(['data' => $document->load('versions')]);
    }

    /**
     * Every update snapshots the previous content into document_versions
     * before overwriting — same history behaviour as the original schema.
     */
    public function update(Request $request, Document $document)
    {
        $this->authorize('staff');
        $data = $request->validate([
            'title' => ['nullable', 'string', 'max:255'],
            'content' => ['nullable', 'array'],
            'folder_id' => ['nullable', 'uuid', 'exists:folders,id'],
        ]);

        DB::transaction(function () use ($document, $data) {
            $document->versions()->create([
                'title' => $document->title,
                'content' => $document->content,
                'created_by' => $document->updated_by,
            ]);

            $data['updated_by'] = app(\App\Services\WorkspaceContext::class)->memberId();
            $document->update($data);
        });

        return response()->json(['data' => $document->fresh()]);
    }

    public function destroy(Document $document)
    {
        $this->authorize('staff');
        $document->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
