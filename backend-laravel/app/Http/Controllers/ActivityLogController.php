<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use Illuminate\Http\Request;

class ActivityLogController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('admin');
        $query = ActivityLog::with('actor:id,name,avatar_url');
        if ($request->filled('entity_type')) {
            $query->where('entity_type', $request->query('entity_type'));
        }

        return response()->json([
            'data' => $query->orderBy('created_at', 'desc')->limit((int) $request->query('limit', 100))->get(),
        ]);
    }
}
