// Daily job (Vercel Cron) that spins off the next occurrence of any invoice
// or task marked recurring once its next_run_date arrives, then advances
// next_run_date on the original by its interval. Needs SUPABASE_SERVICE_ROLE_KEY
// (Project Settings -> Environment Variables) since it must bypass RLS to act
// across every workspace with no signed-in user -- unlike the anon key used
// elsewhere in this app, the service-role key must never be committed to the repo.
function addInterval(dateStr, interval) {
  const d = new Date(dateStr + 'T00:00:00Z');
  if (interval === 'weekly') d.setUTCDate(d.getUTCDate() + 7);
  else if (interval === 'quarterly') d.setUTCMonth(d.getUTCMonth() + 3);
  else if (interval === 'daily') d.setUTCDate(d.getUTCDate() + 1);
  else d.setUTCMonth(d.getUTCMonth() + 1); // 'monthly' default
  return d.toISOString().slice(0, 10);
}

export default async function handler(req, res) {
  const url = process.env.SUPABASE_URL || 'https://nvgzzhqfibhtbauinmwu.supabase.co';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    return res.status(200).json({ ok: false, error: 'SUPABASE_SERVICE_ROLE_KEY not configured' });
  }
  const headers = { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, 'Content-Type': 'application/json' };
  const today = new Date().toISOString().slice(0, 10);
  const results = { invoices: 0, tasks: 0, errors: [] };

  try {
    const invRes = await fetch(`${url}/rest/v1/invoices?is_recurring=eq.true&next_run_date=lte.${today}&select=*`, { headers });
    const dueInvoices = await invRes.json();
    for (const inv of (Array.isArray(dueInvoices) ? dueInvoices : [])) {
      const nextDue = addInterval(inv.due_date || today, inv.recurrence_interval);
      const copy = {
        invoice_no: `${(inv.invoice_no || 'INV').replace(/-R\d+$/, '')}-R${Date.now().toString().slice(-5)}`,
        client_id: inv.client_id, project_id: inv.project_id, amount: inv.amount, currency: inv.currency,
        status: 'draft', due_date: nextDue,
      };
      const createRes = await fetch(`${url}/rest/v1/invoices`, { method: 'POST', headers: { ...headers, Prefer: 'return=minimal' }, body: JSON.stringify(copy) });
      if (!createRes.ok) { results.errors.push(`invoice ${inv.id}: ${await createRes.text()}`); continue; }
      await fetch(`${url}/rest/v1/invoices?id=eq.${inv.id}`, { method: 'PATCH', headers: { ...headers, Prefer: 'return=minimal' }, body: JSON.stringify({ next_run_date: addInterval(inv.next_run_date, inv.recurrence_interval) }) });
      results.invoices++;
    }
  } catch (err) { results.errors.push('invoices: ' + err.message); }

  try {
    const taskRes = await fetch(`${url}/rest/v1/tasks?is_recurring=eq.true&next_run_date=lte.${today}&select=*`, { headers });
    const dueTasks = await taskRes.json();
    for (const t of (Array.isArray(dueTasks) ? dueTasks : [])) {
      const nextDue = addInterval(t.due_date || today, t.recurrence_interval);
      const copy = {
        title: t.title, description: t.description, project_id: t.project_id, client_id: t.client_id,
        assigned_to: t.assigned_to, priority: t.priority, status: 'todo', due_date: nextDue, created_by: t.created_by,
      };
      const createRes = await fetch(`${url}/rest/v1/tasks`, { method: 'POST', headers: { ...headers, Prefer: 'return=minimal' }, body: JSON.stringify(copy) });
      if (!createRes.ok) { results.errors.push(`task ${t.id}: ${await createRes.text()}`); continue; }
      await fetch(`${url}/rest/v1/tasks?id=eq.${t.id}`, { method: 'PATCH', headers: { ...headers, Prefer: 'return=minimal' }, body: JSON.stringify({ next_run_date: addInterval(t.next_run_date, t.recurrence_interval) }) });
      results.tasks++;
    }
  } catch (err) { results.errors.push('tasks: ' + err.message); }

  return res.status(200).json({ ok: true, ranAt: new Date().toISOString(), ...results });
}
