-- Itemized invoice line items (Website Design, Graphic Design, etc — qty +
-- unit price per row) so the PDF export can match a real itemized invoice
-- template instead of a single lump-sum amount. invoices.amount stays as
-- the source of truth for totals/reports; the app keeps it in sync as the
-- sum of items whenever items are used for an invoice.
create table public.invoice_items (
  id           uuid primary key default uuid_generate_v4(),
  invoice_id   uuid references public.invoices(id) on delete cascade not null,
  description  text not null,
  qty          numeric(10,2) not null default 1,
  unit_price   numeric(10,2) not null default 0,
  sort_order   int not null default 0,
  created_at   timestamptz default now()
);

create index if not exists invoice_items_invoice_idx on public.invoice_items(invoice_id);

alter table public.invoice_items enable row level security;

-- Same access rule as the parent invoice (019's "Staff finance access" on
-- invoices: owner/admin, own workspace only) reached via the invoice's own
-- workspace_id since invoice_items has no workspace_id column of its own.
create policy "Staff finance access" on public.invoice_items for all to authenticated
  using (exists (
    select 1 from public.invoices i
    where i.id = invoice_items.invoice_id
      and i.workspace_id = current_workspace_id()
  ) and current_member_role() in ('owner', 'admin'))
  with check (exists (
    select 1 from public.invoices i
    where i.id = invoice_items.invoice_id
      and i.workspace_id = current_workspace_id()
  ) and current_member_role() in ('owner', 'admin'));

create policy "Client view own invoice items" on public.invoice_items for select to authenticated
  using (exists (
    select 1 from public.invoices i
    where i.id = invoice_items.invoice_id
      and i.client_id = current_client_id()
  ));
