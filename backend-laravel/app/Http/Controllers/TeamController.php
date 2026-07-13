<?php

namespace App\Http\Controllers;

use App\Models\Team;
use Illuminate\Http\Request;

class TeamController extends Controller
{
    public function index()
    {
        $this->authorize('staff');
        return response()->json(['data' => Team::with('memberships.member')->orderBy('name')->get()]);
    }

    public function store(Request $request)
    {
        $this->authorize('admin');
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'color' => ['nullable', 'string', 'max:20'],
            'icon' => ['nullable', 'string', 'max:50'],
            'description' => ['nullable', 'string'],
        ]);
        return response()->json(['data' => Team::create($data)], 201);
    }

    public function update(Request $request, Team $team)
    {
        $this->authorize('admin');
        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'color' => ['nullable', 'string', 'max:20'],
            'icon' => ['nullable', 'string', 'max:50'],
            'description' => ['nullable', 'string'],
        ]);
        $team->update($data);
        return response()->json(['data' => $team]);
    }

    public function destroy(Team $team)
    {
        $this->authorize('admin');
        $team->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
