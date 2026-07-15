<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use Illuminate\Http\Request;

class ExpenseController extends Controller
{
    public function index()
    {
        $this->authorize('finance');
        return response()->json(['data' => Expense::with('project', 'client')->orderBy('created_at', 'desc')->get()]);
    }

    public function store(Request $request)
    {
        $this->authorize('finance');
        $data = $request->validate([
            'project_id' => ['nullable', 'uuid', 'exists:projects,id'],
            'client_id' => ['nullable', 'uuid', 'exists:clients,id'],
            'category' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'amount' => ['required', 'numeric'],
            'date' => ['nullable', 'date'],
            'receipt_url' => ['nullable', 'string'],
            'currency' => ['nullable', 'string', 'max:10'],
        ]);
        $data['created_by'] = app(\App\Services\WorkspaceContext::class)->memberId();
        $data['date'] ??= now()->toDateString();
        return response()->json(['data' => Expense::create($data)], 201);
    }

    public function show(Expense $expense)
    {
        $this->authorize('finance');
        return response()->json(['data' => $expense]);
    }

    public function update(Request $request, Expense $expense)
    {
        $this->authorize('finance');
        $data = $request->validate([
            'project_id' => ['nullable', 'uuid', 'exists:projects,id'],
            'client_id' => ['nullable', 'uuid', 'exists:clients,id'],
            'category' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'string'],
            'amount' => ['nullable', 'numeric'],
            'date' => ['nullable', 'date'],
            'receipt_url' => ['nullable', 'string'],
            'currency' => ['nullable', 'string', 'max:10'],
        ]);
        $expense->update($data);
        return response()->json(['data' => $expense]);
    }

    public function destroy(Expense $expense)
    {
        $this->authorize('finance');
        $expense->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
