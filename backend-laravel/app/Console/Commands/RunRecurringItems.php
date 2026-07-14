<?php

namespace App\Console\Commands;

use App\Models\Invoice;
use App\Models\Task;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;

/**
 * Daily job that spins off the next occurrence of any invoice or task
 * marked recurring once its next_run_date arrives, then advances
 * next_run_date on the original by its interval. Replaces the Vercel
 * Cron job at api/recurring-run.js (0 4 * * *), which used the Supabase
 * service-role key to bypass RLS and act across every workspace with no
 * signed-in user — here that's just running as an Artisan command with
 * no authenticated user/workspace context, so BelongsToWorkspace's
 * global scope naturally doesn't filter anything and every workspace's
 * due items are picked up in one pass.
 */
class RunRecurringItems extends Command
{
    protected $signature = 'techyfuel:run-recurring';
    protected $description = 'Create the next occurrence of due recurring invoices and tasks';

    public function handle(): int
    {
        $today = Carbon::today();
        $invoiceCount = 0;
        $taskCount = 0;

        Invoice::where('is_recurring', true)
            ->whereDate('next_run_date', '<=', $today)
            ->each(function (Invoice $invoice) use (&$invoiceCount, $today) {
                $nextDue = $this->addInterval($invoice->due_date ?? $today, $invoice->recurrence_interval);

                Invoice::create([
                    'invoice_no' => preg_replace('/-R\d+$/', '', $invoice->invoice_no).'-R'.substr((string) now()->valueOf(), -5),
                    'client_id' => $invoice->client_id,
                    'project_id' => $invoice->project_id,
                    'amount' => $invoice->amount,
                    'currency' => $invoice->currency,
                    'status' => 'draft',
                    'due_date' => $nextDue,
                    'workspace_id' => $invoice->workspace_id,
                ]);

                $invoice->update(['next_run_date' => $this->addInterval($invoice->next_run_date, $invoice->recurrence_interval)]);
                $invoiceCount++;
            });

        Task::where('is_recurring', true)
            ->whereDate('next_run_date', '<=', $today)
            ->each(function (Task $task) use (&$taskCount, $today) {
                $nextDue = $this->addInterval($task->due_date ?? $today, $task->recurrence_interval);

                Task::create([
                    'title' => $task->title,
                    'description' => $task->description,
                    'project_id' => $task->project_id,
                    'client_id' => $task->client_id,
                    'assigned_to' => $task->assigned_to,
                    'priority' => $task->priority,
                    'status' => 'todo',
                    'due_date' => $nextDue,
                    'created_by' => $task->created_by,
                    'workspace_id' => $task->workspace_id,
                ]);

                $task->update(['next_run_date' => $this->addInterval($task->next_run_date, $task->recurrence_interval)]);
                $taskCount++;
            });

        $this->info("Recurring run complete: {$invoiceCount} invoices, {$taskCount} tasks.");

        return self::SUCCESS;
    }

    protected function addInterval(string|Carbon $date, ?string $interval): string
    {
        $d = $date instanceof Carbon ? $date->copy() : Carbon::parse($date);

        return match ($interval) {
            'weekly' => $d->addWeek()->toDateString(),
            'quarterly' => $d->addMonths(3)->toDateString(),
            'daily' => $d->addDay()->toDateString(),
            default => $d->addMonth()->toDateString(), // 'monthly'
        };
    }
}
