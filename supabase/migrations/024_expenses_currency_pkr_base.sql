-- The agency's home/reporting currency is PKR, not USD — clients pay in
-- USD, PKR, SAR, OMR etc, but Finance/Dashboard totals should be shown in
-- PKR with other currencies converted into it. Expenses never had a
-- currency column at all (always assumed USD in the UI), so add one.
alter table public.expenses add column if not exists currency text not null default 'PKR';

-- New invoices/expenses default to PKR unless the user picks something else.
alter table public.invoices alter column currency set default 'PKR';
