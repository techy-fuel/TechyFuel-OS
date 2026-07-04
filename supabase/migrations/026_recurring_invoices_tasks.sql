-- Recurring invoices/tasks: instead of re-creating the same monthly retainer
-- invoice or weekly checklist task by hand, mark one as recurring with an
-- interval and a daily job (api/recurring-run.js, run via Vercel Cron) spins
-- off the next occurrence automatically when next_run_date arrives.
alter table public.invoices add column if not exists is_recurring boolean not null default false;
alter table public.invoices add column if not exists recurrence_interval text; -- 'weekly' | 'monthly' | 'quarterly'
alter table public.invoices add column if not exists next_run_date date;

alter table public.tasks add column if not exists is_recurring boolean not null default false;
alter table public.tasks add column if not exists recurrence_interval text; -- 'daily' | 'weekly' | 'monthly'
alter table public.tasks add column if not exists next_run_date date;
