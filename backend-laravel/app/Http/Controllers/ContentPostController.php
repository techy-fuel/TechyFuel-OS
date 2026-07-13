<?php

namespace App\Http\Controllers;

use App\Models\ContentPost;
use Illuminate\Http\Request;

class ContentPostController extends Controller
{
    public function index()
    {
        $this->authorize('staff');
        return response()->json(['data' => ContentPost::with('client', 'assignee')->orderBy('created_at', 'desc')->get()]);
    }

    public function store(Request $request)
    {
        $this->authorize('staff');
        $data = $request->validate([
            'client_id' => ['nullable', 'uuid', 'exists:clients,id'],
            'title' => ['required', 'string', 'max:255'],
            'caption' => ['nullable', 'string'],
            'platform' => ['required', 'string', 'in:instagram,facebook,twitter,linkedin,tiktok'],
            'status' => ['nullable', 'string', 'in:draft,scheduled,published,rejected'],
            'scheduled_at' => ['nullable', 'date'],
            'media_urls' => ['nullable', 'array'],
            'tags' => ['nullable', 'array'],
            'assigned_to' => ['nullable', 'uuid', 'exists:team_members,id'],
        ]);
        $data['created_by'] = app(\App\Services\WorkspaceContext::class)->memberId();
        return response()->json(['data' => ContentPost::create($data)], 201);
    }

    public function show(ContentPost $contentPost)
    {
        $this->authorize('staff');
        return response()->json(['data' => $contentPost->load('client')]);
    }

    public function update(Request $request, ContentPost $contentPost)
    {
        $this->authorize('staff');
        $data = $request->validate([
            'client_id' => ['nullable', 'uuid', 'exists:clients,id'],
            'title' => ['sometimes', 'string', 'max:255'],
            'caption' => ['nullable', 'string'],
            'platform' => ['nullable', 'string', 'in:instagram,facebook,twitter,linkedin,tiktok'],
            'status' => ['nullable', 'string', 'in:draft,scheduled,published,rejected'],
            'scheduled_at' => ['nullable', 'date'],
            'media_urls' => ['nullable', 'array'],
            'tags' => ['nullable', 'array'],
            'assigned_to' => ['nullable', 'uuid', 'exists:team_members,id'],
        ]);
        $contentPost->update($data);
        return response()->json(['data' => $contentPost]);
    }

    public function destroy(ContentPost $contentPost)
    {
        $this->authorize('staff');
        $contentPost->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
