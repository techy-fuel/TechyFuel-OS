<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Invoice;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function stats(Request $request)
    {
        $this->authorize('staff');
        $period = $request->query('period', 'month');

        $activeClients = Client::where('status', 'active')->count();
        $activeProjects = Project::where('status', 'active')->count();
        $openTasks = Task::where('status', '<>', 'done')->count();

        [$start, $end] = $this->periodRange($period);

        // Warm the FX cache so FxRatesController::toPkr() has rates to use.
        // The upstream FX API is a free third-party service with no uptime
        // guarantee — a hiccup there must not take down the whole
        // dashboard, so non-PKR invoices are just excluded from revenue
        // (not misreported) until rates are available again.
        try {
            app()->call([app(FxRatesController::class), 'index']);
        } catch (\Throwable $e) {
            //
        }

        $paidInvoices = Invoice::where('status', 'paid')->get(['amount', 'currency', 'paid_at', 'due_date', 'created_at']);
        $revenue = $paidInvoices->filter(function ($inv) use ($start, $end) {
            if (! $start) {
                return true;
            }
            $d = $inv->paid_at ?? $inv->due_date ?? $inv->created_at;
            return $d >= $start && $d <= $end;
        })->sum(fn ($inv) => FxRatesController::toPkr((float) $inv->amount, $inv->currency));

        return response()->json([
            'activeClients' => $activeClients,
            'activeProjects' => $activeProjects,
            'openTasks' => $openTasks,
            'revenue' => $revenue,
        ]);
    }

    protected function periodRange(string $period): array
    {
        $now = now();
        return match ($period) {
            'last_month' => [$now->copy()->subMonthNoOverflow()->startOfMonth(), $now->copy()->subMonthNoOverflow()->endOfMonth()],
            'quarter' => [$now->copy()->startOfQuarter(), $now],
            'year' => [$now->copy()->startOfYear(), $now],
            'all' => [null, $now],
            default => [$now->copy()->startOfMonth(), $now],
        };
    }
}
