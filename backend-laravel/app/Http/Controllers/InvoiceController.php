<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InvoiceController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('finance');

        return response()->json(['data' => Invoice::with('client', 'project', 'items')->orderBy('created_at', 'desc')->get()]);
    }

    public function store(Request $request)
    {
        $this->authorize('finance');

        $data = $request->validate([
            'client_id' => ['nullable', 'uuid', 'exists:clients,id'],
            'project_id' => ['nullable', 'uuid', 'exists:projects,id'],
            'invoice_no' => ['required', 'string', 'max:255', 'unique:invoices,invoice_no'],
            'status' => ['nullable', 'string', 'in:draft,sent,paid,overdue,cancelled'],
            'amount' => ['required', 'numeric'],
            'tax' => ['nullable', 'numeric'],
            'due_date' => ['nullable', 'date'],
            'notes' => ['nullable', 'string'],
            'currency' => ['nullable', 'string', 'max:10'],
            'items' => ['nullable', 'array'],
            'items.*.description' => ['required_with:items', 'string'],
            'items.*.qty' => ['nullable', 'numeric'],
            'items.*.unit_price' => ['nullable', 'numeric'],
        ]);

        $items = $data['items'] ?? null;
        unset($data['items']);

        $invoice = DB::transaction(function () use ($data, $items) {
            $invoice = Invoice::create($data);

            foreach ($items ?? [] as $i => $item) {
                $invoice->items()->create([
                    'description' => $item['description'],
                    'qty' => $item['qty'] ?? 1,
                    'unit_price' => $item['unit_price'] ?? 0,
                    'sort_order' => $i,
                ]);
            }

            return $invoice;
        });

        return response()->json(['data' => $invoice->load('items')], 201);
    }

    public function show(Invoice $invoice)
    {
        $this->authorize('finance');

        return response()->json(['data' => $invoice->load('client', 'project', 'items')]);
    }

    public function update(Request $request, Invoice $invoice)
    {
        $this->authorize('finance');

        $data = $request->validate([
            'client_id' => ['nullable', 'uuid', 'exists:clients,id'],
            'project_id' => ['nullable', 'uuid', 'exists:projects,id'],
            'status' => ['nullable', 'string', 'in:draft,sent,paid,overdue,cancelled'],
            'amount' => ['nullable', 'numeric'],
            'tax' => ['nullable', 'numeric'],
            'due_date' => ['nullable', 'date'],
            'paid_at' => ['nullable', 'date'],
            'notes' => ['nullable', 'string'],
            'currency' => ['nullable', 'string', 'max:10'],
        ]);

        $invoice->update($data);

        return response()->json(['data' => $invoice->fresh(['items'])]);
    }

    public function destroy(Invoice $invoice)
    {
        $this->authorize('finance');

        $invoice->delete();

        return response()->json(['message' => 'Deleted']);
    }
}
