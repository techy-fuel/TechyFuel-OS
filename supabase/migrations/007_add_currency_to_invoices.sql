-- Add currency column to invoices table
alter table public.invoices
  add column if not exists currency text not null default 'USD';
