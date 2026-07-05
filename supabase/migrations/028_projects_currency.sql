-- Projects didn't have a currency field at all -- budget was always shown
-- as a bare "$" regardless of what currency the client actually pays in.
-- Same PKR-home-currency convention as invoices/expenses: store the
-- project's own currency, convert to PKR for totals via live FX rates.
alter table public.projects add column if not exists currency text not null default 'PKR';
