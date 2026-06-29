// Automations — rule builder, templates, webhooks, approvals
(() => {
const { Card, Badge, Switch } = window.TechyFuelOSDesignSystem_be0222;

// ── Config maps ───────────────────────────────────────────────────
const TRIGGER_TYPES = [
  { id: 'task_status_change',   label: 'Task status changes',         icon: 'refresh-cw',      group: 'Tasks' },
  { id: 'due_date_approaching', label: 'Due date is approaching',      icon: 'clock',           group: 'Tasks' },
  { id: 'task_created',        label: 'New task is created',          icon: 'circle-plus',     group: 'Tasks' },
  { id: 'task_assigned',       label: 'Task is assigned to member',   icon: 'user-check',      group: 'Tasks' },
  { id: 'invoice_paid',        label: 'Invoice is marked Paid',       icon: 'check-circle',    group: 'Finance' },
  { id: 'schedule_weekly',     label: 'Every week (day of week)',     icon: 'calendar',        group: 'Schedule' },
  { id: 'schedule_monthly',    label: 'Every month (day of month)',   icon: 'calendar-days',   group: 'Schedule' },
];

const ACTION_TYPES = [
  { id: 'change_status',  label: 'Change task status',        icon: 'arrow-right-circle' },
  { id: 'assign_task',    label: 'Assign task to member',     icon: 'user-plus' },
  { id: 'notify_client',  label: 'Notify client via portal',  icon: 'bell' },
  { id: 'send_reminder',  label: 'Send email reminder',       icon: 'mail' },
  { id: 'create_task',    label: 'Create a new task',         icon: 'circle-plus' },
  { id: 'webhook',        label: 'Call a webhook URL',        icon: 'webhook' },
];

const STATUSES = ['backlog','todo','in_progress','review','done'];
const STATUS_LABELS = { backlog: 'Backlog', todo: 'To do', in_progress: 'In progress', review: 'In review', done: 'Done' };
const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const TONE = { pending: 'warning', approved: 'success', rejected: 'danger', enabled: 'success', disabled: 'neutral' };

function fmtDate(ts) {
  if (!ts) return '—';
  return new Date(ts).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' });
}
function fmtTime(ts) {
  if (!ts) return '—';
  return new Date(ts).toLocaleString('en', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

// ── Rule description builder ──────────────────────────────────────
function describeRule(rule) {
  const tc = rule.trigger_config || {};
  const ac = rule.action_config || {};
  let trigger = '';
  switch (rule.trigger_type) {
    case 'task_status_change':   trigger = `task moves to "${STATUS_LABELS[tc.to_status] || tc.to_status || 'any'}"`;   break;
    case 'due_date_approaching': trigger = `due date is ${tc.days_before || 1} day(s) away`;                             break;
    case 'task_created':         trigger = 'new task is created';                                                         break;
    case 'task_assigned':        trigger = 'task is assigned';                                                            break;
    case 'invoice_paid':         trigger = 'invoice is paid';                                                             break;
    case 'schedule_weekly':      trigger = `every ${tc.day_of_week || 'Monday'}`;                                        break;
    case 'schedule_monthly':     trigger = `every month on the ${tc.day_of_month || 1}${ordinal(tc.day_of_month || 1)}`; break;
    default:                     trigger = rule.trigger_type;
  }
  let action = '';
  switch (rule.action_type) {
    case 'change_status': action = `move task to "${STATUS_LABELS[ac.new_status] || ac.new_status}"`; break;
    case 'assign_task':   action = `assign to member`;                                                  break;
    case 'notify_client': action = 'notify the client via portal';                                       break;
    case 'send_reminder': action = `send email reminder`;                                                break;
    case 'create_task':   action = `create task "${ac.task_title || 'untitled'}"`;                      break;
    case 'webhook':       action = `call webhook`;                                                        break;
    default:              action = rule.action_type;
  }
  return `When ${trigger} → ${action}`;
}

function ordinal(n) {
  const s = ['th','st','nd','rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

// ── Automation engine (client-side) ──────────────────────────────
async function runAutomationEngine(rules, team, onLog) {
  if (!window.API || !rules.length) return;
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const dayOfWeek = DAYS[now.getDay() === 0 ? 6 : now.getDay() - 1];
  const dayOfMonth = now.getDate();
  let ran = 0;

  for (const rule of rules) {
    if (!rule.enabled) continue;
    const tc = rule.trigger_config || {};
    const ac = rule.action_config || {};

    try {
      if (rule.trigger_type === 'schedule_weekly') {
        const lastRun = rule.last_run_at ? rule.last_run_at.slice(0, 10) : '';
        if (tc.day_of_week !== dayOfWeek || lastRun === todayStr) continue;
        await executeAction(rule, ac, team, null);
        await window.API.updateRule(rule.id, { run_count: (rule.run_count || 0) + 1, last_run_at: now.toISOString() });
        onLog?.(`✅ "${rule.name}" ran (${dayOfWeek} schedule)`);
        ran++;
      }

      if (rule.trigger_type === 'schedule_monthly') {
        const lastRun = rule.last_run_at ? rule.last_run_at.slice(0, 10) : '';
        if (Number(tc.day_of_month) !== dayOfMonth || lastRun === todayStr) continue;
        await executeAction(rule, ac, team, null);
        await window.API.updateRule(rule.id, { run_count: (rule.run_count || 0) + 1, last_run_at: now.toISOString() });
        onLog?.(`✅ "${rule.name}" ran (monthly day ${dayOfMonth})`);
        ran++;
      }

      if (rule.trigger_type === 'due_date_approaching') {
        const r = await window.API.getTasks();
        const tasks = r.data || [];
        const targetDays = Number(tc.days_before || 1);
        const matching = tasks.filter(t => {
          if (!t.due_date || t.status === 'done') return false;
          const diff = Math.round((new Date(t.due_date) - now) / 86400000);
          return diff === targetDays;
        });
        for (const task of matching) {
          await executeAction(rule, ac, team, task);
          ran++;
        }
        if (matching.length) {
          await window.API.updateRule(rule.id, { run_count: (rule.run_count || 0) + matching.length, last_run_at: now.toISOString() });
          onLog?.(`✅ "${rule.name}" → ${matching.length} task(s) matched`);
        }
      }
    } catch {}
  }
  return ran;
}

async function executeAction(rule, ac, team, task) {
  if (!window.API) return;
  switch (rule.action_type) {
    case 'change_status':
      if (task && ac.new_status) await window.API.updateTask(task.id, { status: ac.new_status });
      break;
    case 'assign_task':
      if (task && ac.member_id) await window.API.updateTask(task.id, { assigned_to: ac.member_id });
      break;
    case 'create_task':
      if (ac.task_title) {
        const payload = { title: ac.task_title, status: ac.task_status || 'todo', priority: ac.task_priority || 'medium' };
        if (ac.assigned_member_id) payload.assigned_to = ac.assigned_member_id;
        await window.API.createTask(payload);
      }
      break;
    case 'webhook':
      if (ac.webhook_url) {
        try {
          await fetch(ac.webhook_url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ rule: rule.name, trigger: rule.trigger_type, task: task || null, timestamp: new Date().toISOString() }) });
        } catch {}
      }
      break;
    case 'send_reminder':
      // Log for now — full email requires server
      console.log('[TF Automation] Reminder:', rule.name, task?.title);
      break;
  }
}

// ── Rule builder modal ────────────────────────────────────────────
function RuleModal({ open, rule, team, projects, onClose, onSave }) {
  const [form, setForm] = React.useState({ name: '', trigger_type: 'task_status_change', trigger_config: {}, action_type: 'change_status', action_config: {}, enabled: true });
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (open) setForm(rule ? { name: rule.name, trigger_type: rule.trigger_type, trigger_config: rule.trigger_config || {}, action_type: rule.action_type, action_config: rule.action_config || {}, enabled: rule.enabled !== false } : { name: '', trigger_type: 'task_status_change', trigger_config: {}, action_type: 'change_status', action_config: {}, enabled: true });
  }, [open, rule]);

  function setF(k, v) { setForm(f => ({ ...f, [k]: v })); }
  function setTC(k, v) { setForm(f => ({ ...f, trigger_config: { ...f.trigger_config, [k]: v } })); }
  function setAC(k, v) { setForm(f => ({ ...f, action_config: { ...f.action_config, [k]: v } })); }

  async function handleSave() {
    if (!form.name.trim()) return;
    setSaving(true);
    try { await onSave(form, rule?.id); onClose(); } finally { setSaving(false); }
  }

  if (!open) return null;
  const inputS = { width: '100%', height: 36, padding: '0 10px', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', outline: 'none', boxSizing: 'border-box' };
  const selectS = { ...inputS };
  const labelS = { display: 'block', fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-bold)', color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.07em' };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div style={{ background: 'var(--slate-0)', borderRadius: 'var(--radius-xl)', padding: 28, width: 520, maxHeight: '90vh', overflowY: 'auto', boxShadow: 'var(--shadow-2xl)' }} onClick={e => e.stopPropagation()}>
        <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--fw-bold)', marginBottom: 22 }}>{rule ? 'Edit automation' : 'New automation rule'}</h3>

        {/* Name */}
        <div style={{ marginBottom: 18 }}>
          <label style={labelS}>Rule name</label>
          <input style={inputS} value={form.name} onChange={e => setF('name', e.target.value)} placeholder="e.g. Notify client when task is done" />
        </div>

        {/* IF — Trigger */}
        <div style={{ background: 'var(--blue-50)', border: '1px solid var(--blue-200)', borderRadius: 'var(--radius-lg)', padding: 16, marginBottom: 16 }}>
          <div style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-extrabold)', color: 'var(--blue-700)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>IF (Trigger)</div>

          <div style={{ marginBottom: 12 }}>
            <label style={labelS}>When this happens…</label>
            <select style={selectS} value={form.trigger_type} onChange={e => { setF('trigger_type', e.target.value); setF('trigger_config', {}); }}>
              {['Tasks','Finance','Schedule'].map(g => (
                <optgroup key={g} label={g}>
                  {TRIGGER_TYPES.filter(t => t.group === g).map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                </optgroup>
              ))}
            </select>
          </div>

          {/* Trigger config fields */}
          {form.trigger_type === 'task_status_change' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={labelS}>From status</label>
                <select style={selectS} value={form.trigger_config.from_status || ''} onChange={e => setTC('from_status', e.target.value)}>
                  <option value="">Any status</option>
                  {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                </select>
              </div>
              <div>
                <label style={labelS}>To status</label>
                <select style={selectS} value={form.trigger_config.to_status || ''} onChange={e => setTC('to_status', e.target.value)}>
                  <option value="">Any status</option>
                  {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                </select>
              </div>
            </div>
          )}
          {form.trigger_type === 'due_date_approaching' && (
            <div>
              <label style={labelS}>Days before due date</label>
              <input style={inputS} type="number" min="1" max="30" value={form.trigger_config.days_before || 1} onChange={e => setTC('days_before', Number(e.target.value))} />
            </div>
          )}
          {form.trigger_type === 'schedule_weekly' && (
            <div>
              <label style={labelS}>Day of week</label>
              <select style={selectS} value={form.trigger_config.day_of_week || 'Monday'} onChange={e => setTC('day_of_week', e.target.value)}>
                {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          )}
          {form.trigger_type === 'schedule_monthly' && (
            <div>
              <label style={labelS}>Day of month</label>
              <select style={selectS} value={form.trigger_config.day_of_month || 1} onChange={e => setTC('day_of_month', Number(e.target.value))}>
                {Array.from({ length: 28 }, (_, i) => i + 1).map(d => <option key={d} value={d}>{d}{ordinal(d)}</option>)}
              </select>
            </div>
          )}
        </div>

        {/* THEN — Action */}
        <div style={{ background: 'var(--green-50)', border: '1px solid var(--green-200)', borderRadius: 'var(--radius-lg)', padding: 16, marginBottom: 20 }}>
          <div style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-extrabold)', color: 'var(--green-700)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>THEN (Action)</div>

          <div style={{ marginBottom: 12 }}>
            <label style={labelS}>Do this…</label>
            <select style={selectS} value={form.action_type} onChange={e => { setF('action_type', e.target.value); setF('action_config', {}); }}>
              {ACTION_TYPES.map(a => <option key={a.id} value={a.id}>{a.label}</option>)}
            </select>
          </div>

          {/* Action config fields */}
          {form.action_type === 'change_status' && (
            <div>
              <label style={labelS}>Change task status to</label>
              <select style={selectS} value={form.action_config.new_status || 'done'} onChange={e => setAC('new_status', e.target.value)}>
                {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
              </select>
            </div>
          )}
          {form.action_type === 'assign_task' && (
            <div>
              <label style={labelS}>Assign to team member</label>
              <select style={selectS} value={form.action_config.member_id || ''} onChange={e => setAC('member_id', e.target.value)}>
                <option value="">Select member…</option>
                {team.map(m => <option key={m.id} value={m.id}>{m.name} ({m.role || 'member'})</option>)}
              </select>
            </div>
          )}
          {form.action_type === 'create_task' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div>
                <label style={labelS}>Task title</label>
                <input style={inputS} value={form.action_config.task_title || ''} onChange={e => setAC('task_title', e.target.value)} placeholder="Task title…" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={labelS}>Status</label>
                  <select style={selectS} value={form.action_config.task_status || 'todo'} onChange={e => setAC('task_status', e.target.value)}>
                    {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelS}>Assign to</label>
                  <select style={selectS} value={form.action_config.assigned_member_id || ''} onChange={e => setAC('assigned_member_id', e.target.value)}>
                    <option value="">Unassigned</option>
                    {team.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}
          {form.action_type === 'send_reminder' && (
            <div>
              <label style={labelS}>Reminder message</label>
              <input style={inputS} value={form.action_config.message || ''} onChange={e => setAC('message', e.target.value)} placeholder="Reminder message…" />
            </div>
          )}
          {form.action_type === 'webhook' && (
            <div>
              <label style={labelS}>Webhook URL</label>
              <input style={inputS} value={form.action_config.webhook_url || ''} onChange={e => setAC('webhook_url', e.target.value)} placeholder="https://…" />
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button onClick={onClose} style={{ height: 36, padding: '0 16px', background: 'var(--slate-100)', border: 'none', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleSave} disabled={saving || !form.name.trim()} style={{ height: 36, padding: '0 18px', background: 'var(--blue-600)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', cursor: 'pointer', opacity: saving || !form.name.trim() ? 0.6 : 1 }}>
            {saving ? 'Saving…' : rule ? 'Save changes' : 'Create rule'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Template builder modal ────────────────────────────────────────
function TemplateModal({ open, template, team, projects, onClose, onSave }) {
  const emptyTask = { title: '', status: 'todo', priority: 'medium', due_offset_days: '', assigned_role: '' };
  const [form, setForm] = React.useState({ name: '', description: '', tasks: [{ ...emptyTask }] });
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (open) setForm(template ? { name: template.name, description: template.description || '', tasks: template.tasks?.length ? template.tasks : [{ ...emptyTask }] } : { name: '', description: '', tasks: [{ ...emptyTask }] });
  }, [open, template]);

  function setF(k, v) { setForm(f => ({ ...f, [k]: v })); }
  function setTask(i, k, v) { setForm(f => { const tasks = [...f.tasks]; tasks[i] = { ...tasks[i], [k]: v }; return { ...f, tasks }; }); }
  function addTask() { setForm(f => ({ ...f, tasks: [...f.tasks, { ...emptyTask }] })); }
  function removeTask(i) { setForm(f => ({ ...f, tasks: f.tasks.filter((_, j) => j !== i) })); }

  async function handleSave() {
    if (!form.name.trim()) return;
    setSaving(true);
    try { await onSave({ name: form.name, description: form.description, tasks: form.tasks.filter(t => t.title.trim()) }, template?.id); onClose(); } finally { setSaving(false); }
  }

  if (!open) return null;
  const inputS = { width: '100%', height: 33, padding: '0 8px', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', outline: 'none', boxSizing: 'border-box' };
  const labelS = { display: 'block', fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-bold)', color: 'var(--text-muted)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div style={{ background: 'var(--slate-0)', borderRadius: 'var(--radius-xl)', padding: 28, width: 580, maxHeight: '90vh', overflowY: 'auto', boxShadow: 'var(--shadow-2xl)' }} onClick={e => e.stopPropagation()}>
        <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--fw-bold)', marginBottom: 20 }}>{template ? 'Edit template' : 'New task template'}</h3>

        <div style={{ marginBottom: 14 }}>
          <label style={labelS}>Template name</label>
          <input style={{ ...inputS, height: 36, fontSize: 'var(--text-sm)' }} value={form.name} onChange={e => setF('name', e.target.value)} placeholder="e.g. New client onboarding" />
        </div>
        <div style={{ marginBottom: 18 }}>
          <label style={labelS}>Description</label>
          <input style={{ ...inputS, height: 36, fontSize: 'var(--text-sm)' }} value={form.description} onChange={e => setF('description', e.target.value)} placeholder="What is this template for?" />
        </div>

        <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-bold)', color: 'var(--text-strong)' }}>Tasks ({form.tasks.length})</span>
          <button onClick={addTask} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, height: 28, padding: '0 10px', background: 'var(--blue-600)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-semibold)', cursor: 'pointer' }}>
            <Icon name="plus" size={13} /> Add task
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
          {form.tasks.map((task, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 100px 90px 90px 28px', gap: 6, padding: 10, background: 'var(--slate-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', alignItems: 'center' }}>
              <input style={inputS} placeholder={`Task ${i + 1} title…`} value={task.title} onChange={e => setTask(i, 'title', e.target.value)} />
              <select style={inputS} value={task.status} onChange={e => setTask(i, 'status', e.target.value)}>
                {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
              </select>
              <select style={inputS} value={task.priority} onChange={e => setTask(i, 'priority', e.target.value)}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <input style={inputS} type="number" placeholder="Due in days" value={task.due_offset_days} onChange={e => setTask(i, 'due_offset_days', e.target.value)} />
              <button onClick={() => removeTask(i)} style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', borderRadius: 'var(--radius-sm)' }}>
                <Icon name="x" size={14} />
              </button>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button onClick={onClose} style={{ height: 36, padding: '0 16px', background: 'var(--slate-100)', border: 'none', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleSave} disabled={saving} style={{ height: 36, padding: '0 18px', background: 'var(--blue-600)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', cursor: 'pointer' }}>
            {saving ? 'Saving…' : template ? 'Save' : 'Create template'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Webhook modal ─────────────────────────────────────────────────
function WebhookModal({ open, webhook, onClose, onSave }) {
  const ALL_EVENTS = ['task.created','task.completed','task.assigned','invoice.paid','project.created','client.added'];
  const [form, setForm] = React.useState({ name: '', url: '', events: [], secret: '', enabled: true });
  const [saving, setSaving] = React.useState(false);
  const [testing, setTesting] = React.useState(false);
  const [testResult, setTestResult] = React.useState(null);

  React.useEffect(() => {
    if (open) setForm(webhook ? { name: webhook.name, url: webhook.url, events: webhook.events || [], secret: webhook.secret || '', enabled: webhook.enabled !== false } : { name: '', url: '', events: [], secret: '', enabled: true });
  }, [open, webhook]);

  function toggleEvent(e) { setForm(f => ({ ...f, events: f.events.includes(e) ? f.events.filter(x => x !== e) : [...f.events, e] })); }
  async function handleSave() {
    if (!form.url.trim()) return;
    setSaving(true);
    try { await onSave(form, webhook?.id); onClose(); } finally { setSaving(false); }
  }
  async function testWebhook() {
    if (!form.url.trim()) return;
    setTesting(true); setTestResult(null);
    try {
      const res = await fetch(form.url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ event: 'test', source: 'TechyFuel OS', timestamp: new Date().toISOString() }) });
      setTestResult({ ok: res.ok, status: res.status });
    } catch { setTestResult({ ok: false, status: 'Network error' }); }
    setTesting(false);
  }

  if (!open) return null;
  const inputS = { width: '100%', height: 36, padding: '0 10px', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', outline: 'none', boxSizing: 'border-box' };
  const labelS = { display: 'block', fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-bold)', color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.07em' };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div style={{ background: 'var(--slate-0)', borderRadius: 'var(--radius-xl)', padding: 28, width: 480, maxHeight: '90vh', overflowY: 'auto', boxShadow: 'var(--shadow-2xl)' }} onClick={e => e.stopPropagation()}>
        <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--fw-bold)', marginBottom: 20 }}>{webhook ? 'Edit webhook' : 'New webhook'}</h3>

        <div style={{ marginBottom: 14 }}>
          <label style={labelS}>Name</label>
          <input style={inputS} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Slack notifier" />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={labelS}>Endpoint URL</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input style={{ ...inputS, flex: 1 }} value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} placeholder="https://your-server.com/webhook" />
            <button onClick={testWebhook} disabled={testing || !form.url.trim()} style={{ height: 36, padding: '0 12px', background: 'var(--slate-100)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-semibold)', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              {testing ? 'Testing…' : 'Test'}
            </button>
          </div>
          {testResult && <div style={{ marginTop: 6, fontSize: 'var(--text-xs)', color: testResult.ok ? 'var(--green-600)' : 'var(--red-600)', fontWeight: 'var(--fw-semibold)' }}>{testResult.ok ? `✓ Success (HTTP ${testResult.status})` : `✗ Failed: ${testResult.status}`}</div>}
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={labelS}>Secret (optional)</label>
          <input style={inputS} value={form.secret} onChange={e => setForm(f => ({ ...f, secret: e.target.value }))} placeholder="Sent as X-TF-Secret header" type="password" />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={labelS}>Trigger on events</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {ALL_EVENTS.map(ev => (
              <button key={ev} onClick={() => toggleEvent(ev)} style={{ padding: '5px 12px', border: `1px solid ${form.events.includes(ev) ? 'var(--blue-500)' : 'var(--border-default)'}`, borderRadius: 12, background: form.events.includes(ev) ? 'var(--blue-50)' : 'transparent', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', fontWeight: form.events.includes(ev) ? 'var(--fw-bold)' : 'var(--fw-medium)', color: form.events.includes(ev) ? 'var(--blue-700)' : 'var(--text-body)', cursor: 'pointer' }}>
                {ev}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button onClick={onClose} style={{ height: 36, padding: '0 16px', background: 'var(--slate-100)', border: 'none', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleSave} disabled={saving || !form.url.trim()} style={{ height: 36, padding: '0 18px', background: 'var(--blue-600)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', cursor: 'pointer' }}>
            {saving ? 'Saving…' : webhook ? 'Save' : 'Create webhook'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Apply template modal ──────────────────────────────────────────
function ApplyTemplateModal({ open, template, team, projects, onClose, onApply }) {
  const [projectId, setProjectId] = React.useState('');
  const [applying, setApplying] = React.useState(false);
  const [done, setDone] = React.useState(null);

  React.useEffect(() => { if (open) { setProjectId(''); setDone(null); } }, [open]);

  async function handleApply() {
    if (!template) return;
    setApplying(true);
    try {
      const r = await window.API.applyTemplate(template.id, projectId || null);
      setDone(r.data?.length || 0);
    } finally { setApplying(false); }
  }

  if (!open || !template) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div style={{ background: 'var(--slate-0)', borderRadius: 'var(--radius-xl)', padding: 28, width: 420, boxShadow: 'var(--shadow-2xl)' }} onClick={e => e.stopPropagation()}>
        <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--fw-bold)', marginBottom: 6 }}>Apply template</h3>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginBottom: 20 }}>This will create {template.tasks?.length || 0} tasks from "{template.name}".</p>

        {done !== null ? (
          <div style={{ textAlign: 'center', padding: 24 }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>✅</div>
            <div style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--fw-bold)' }}>{done} tasks created!</div>
            <button onClick={onClose} style={{ marginTop: 16, height: 36, padding: '0 20px', background: 'var(--blue-600)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', cursor: 'pointer' }}>Done</button>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-bold)', color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase' }}>Assign to project (optional)</label>
              <select value={projectId} onChange={e => setProjectId(e.target.value)} style={{ width: '100%', height: 36, padding: '0 10px', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', outline: 'none' }}>
                <option value="">No project</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button onClick={onClose} style={{ height: 36, padding: '0 16px', background: 'var(--slate-100)', border: 'none', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleApply} disabled={applying} style={{ height: 36, padding: '0 18px', background: 'var(--blue-600)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', cursor: 'pointer' }}>
                {applying ? 'Creating…' : 'Apply template'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Main Automations component ────────────────────────────────────
function Automations() {
  const [tab, setTab] = React.useState('rules');
  const [rules, setRules] = React.useState([]);
  const [templates, setTemplates] = React.useState([]);
  const [webhooks, setWebhooks] = React.useState([]);
  const [approvals, setApprovals] = React.useState([]);
  const [team, setTeam] = React.useState([]);
  const [projects, setProjects] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [ruleModal, setRuleModal] = React.useState(null); // null | 'new' | rule object
  const [tmplModal, setTmplModal] = React.useState(null);
  const [whModal, setWhModal] = React.useState(null);
  const [applyModal, setApplyModal] = React.useState(null); // template to apply
  const [runLog, setRunLog] = React.useState([]);
  const [running, setRunning] = React.useState(false);
  const [approvalFilter, setApprovalFilter] = React.useState('pending');

  const pendingCount = approvals.filter(a => a.status === 'pending').length;

  React.useEffect(() => {
    if (!window.API) { setLoading(false); return; }
    (async () => {
      try {
        const [rr, tr, pr, wr, ar, tmr] = await Promise.all([
          window.API.getRules(), window.API.getTeam(), window.API.getProjects(),
          window.API.getWebhooks(), window.API.getApprovals(), window.API.getTemplates(),
        ]);
        if (rr.data) setRules(rr.data);
        if (tr.data) setTeam(tr.data);
        if (pr.data) setProjects(pr.data);
        if (wr.data) setWebhooks(wr.data);
        if (ar.data) setApprovals(ar.data);
        if (tmr.data) setTemplates(tmr.data);
      } catch {}
      setLoading(false);
    })();
  }, []);

  async function saveRule(form, id) {
    const payload = { name: form.name, trigger_type: form.trigger_type, trigger_config: form.trigger_config, action_type: form.action_type, action_config: form.action_config, enabled: form.enabled };
    if (id) {
      const { data } = await window.API.updateRule(id, payload);
      if (data) setRules(prev => prev.map(r => r.id === id ? { ...r, ...data } : r));
    } else {
      const { data } = await window.API.createRule(payload);
      if (data) setRules(prev => [data, ...prev]);
    }
  }

  async function saveTemplate(form, id) {
    if (id) {
      const { data } = await window.API.updateTemplate(id, form);
      if (data) setTemplates(prev => prev.map(t => t.id === id ? { ...t, ...data } : t));
    } else {
      const { data } = await window.API.createTemplate(form);
      if (data) setTemplates(prev => [data, ...prev]);
    }
  }

  async function saveWebhook(form, id) {
    if (id) {
      const { data } = await window.API.updateWebhook(id, form);
      if (data) setWebhooks(prev => prev.map(w => w.id === id ? { ...w, ...data } : w));
    } else {
      const { data } = await window.API.createWebhook(form);
      if (data) setWebhooks(prev => [data, ...prev]);
    }
  }

  async function toggleRule(id, enabled) {
    await window.API.updateRule(id, { enabled });
    setRules(prev => prev.map(r => r.id === id ? { ...r, enabled } : r));
  }

  async function deleteRule(id) {
    await window.API.deleteRule(id);
    setRules(prev => prev.filter(r => r.id !== id));
  }

  async function handleRunEngine() {
    setRunning(true);
    setRunLog([]);
    const logs = [];
    await runAutomationEngine(rules, team, msg => { logs.push(msg); setRunLog([...logs]); });
    if (!logs.length) setRunLog(['ℹ️ No rules matched current conditions.']);
    // Refresh rules (run counts)
    const { data } = await window.API.getRules();
    if (data) setRules(data);
    setRunning(false);
  }

  async function resolveApproval(id, status, taskId, comment) {
    const nextStatus = status === 'approved' ? 'in_progress' : 'todo';
    await window.API.resolveApproval(id, status, comment || null, taskId, status === 'approved' ? nextStatus : null);
    setApprovals(prev => prev.map(a => a.id === id ? { ...a, status, comment: comment || null, resolved_at: new Date().toISOString() } : a));
  }

  const TABS = [
    { id: 'rules',     label: 'Automation rules',   icon: 'zap',          count: rules.filter(r => r.enabled).length },
    { id: 'templates', label: 'Task templates',      icon: 'layout-list',  count: templates.length },
    { id: 'webhooks',  label: 'Webhooks',            icon: 'webhook',      count: webhooks.length },
    { id: 'approvals', label: 'Approvals',           icon: 'shield-check', count: pendingCount },
  ];

  const btnS = { display: 'inline-flex', alignItems: 'center', gap: 7, height: 36, padding: '0 14px', background: 'var(--blue-600)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-brand)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', cursor: 'pointer' };
  const outS = { display: 'inline-flex', alignItems: 'center', gap: 7, height: 36, padding: '0 14px', background: 'var(--slate-0)', color: 'var(--text-body)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', cursor: 'pointer' };

  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 22, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ width: 44, height: 44, borderRadius: 'var(--radius-lg)', background: 'var(--grad-brand)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-brand)' }}>
            <Icon name="zap" size={22} style={{ color: '#fff' }} />
          </span>
          <div>
            <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--fw-extrabold)', letterSpacing: '-0.02em' }}>Automations</h1>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 2 }}>{rules.filter(r => r.enabled).length} active rules · {webhooks.filter(w => w.enabled).length} webhooks</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {tab === 'rules' && <>
            <button onClick={handleRunEngine} disabled={running} style={outS}>
              <Icon name={running ? 'loader' : 'play'} size={15} />{running ? 'Running…' : 'Run now'}
            </button>
            <button onClick={() => setRuleModal('new')} style={btnS}><Icon name="plus" size={16} /> New rule</button>
          </>}
          {tab === 'templates' && <button onClick={() => setTmplModal('new')} style={btnS}><Icon name="plus" size={16} /> New template</button>}
          {tab === 'webhooks' && <button onClick={() => setWhModal('new')} style={btnS}><Icon name="plus" size={16} /> New webhook</button>}
        </div>
      </div>

      {/* Tab nav */}
      <div style={{ display: 'flex', gap: 2, borderBottom: '1px solid var(--border-subtle)', marginBottom: 20 }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 16px', border: 'none', borderBottom: tab === t.id ? '2px solid var(--blue-600)' : '2px solid transparent', background: 'none', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: tab === t.id ? 'var(--fw-bold)' : 'var(--fw-medium)', color: tab === t.id ? 'var(--blue-700)' : 'var(--text-muted)', cursor: 'pointer', marginBottom: -1 }}>
            <Icon name={t.icon} size={15} /> {t.label}
            {t.count > 0 && <span style={{ background: t.id === 'approvals' ? 'var(--amber-500)' : 'var(--slate-200)', color: t.id === 'approvals' ? '#fff' : 'var(--text-muted)', fontSize: 11, fontWeight: 700, borderRadius: 10, padding: '1px 7px' }}>{t.count}</span>}
          </button>
        ))}
      </div>

      {loading && <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)' }}>Loading…</div>}

      {/* ── Rules tab ── */}
      {!loading && tab === 'rules' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {runLog.length > 0 && (
            <div style={{ background: 'var(--slate-900)', borderRadius: 'var(--radius-lg)', padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--green-400)', marginBottom: 4 }}>
              {runLog.map((l, i) => <div key={i}>{l}</div>)}
            </div>
          )}

          {rules.length === 0 && (
            <div style={{ padding: '60px 24px', textAlign: 'center' }}>
              <span style={{ fontSize: 48 }}>⚡</span>
              <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--fw-bold)', marginTop: 12, marginBottom: 6 }}>No automation rules yet</div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginBottom: 20, maxWidth: 380, margin: '0 auto 20px' }}>Create rules like "When task is Done → notify client" or "Every Monday → create standup task"</div>
              <button onClick={() => setRuleModal('new')} style={btnS}><Icon name="plus" size={16} /> Create first rule</button>
            </div>
          )}

          {rules.map(rule => {
            const trig = TRIGGER_TYPES.find(t => t.id === rule.trigger_type);
            const act = ACTION_TYPES.find(a => a.id === rule.action_type);
            return (
              <Card key={rule.id} padding="none">
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px' }}>
                  <span style={{ width: 38, height: 38, borderRadius: 'var(--radius-md)', background: rule.enabled ? 'var(--blue-50)' : 'var(--slate-100)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                    <Icon name={trig?.icon || 'zap'} size={18} style={{ color: rule.enabled ? 'var(--blue-600)' : 'var(--text-muted)' }} />
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-bold)', color: rule.enabled ? 'var(--text-strong)' : 'var(--text-muted)' }}>{rule.name}</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 3 }}>{describeRule(rule)}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    {rule.run_count > 0 && <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-subtle)', whiteSpace: 'nowrap' }}>Ran {rule.run_count}×{rule.last_run_at ? ` · ${fmtTime(rule.last_run_at)}` : ''}</span>}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 'var(--text-xs)', color: rule.enabled ? 'var(--green-600)' : 'var(--text-subtle)', fontWeight: 'var(--fw-semibold)' }}>{rule.enabled ? 'On' : 'Off'}</span>
                      <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                        <input type="checkbox" checked={rule.enabled} onChange={e => toggleRule(rule.id, e.target.checked)} style={{ width: 36, height: 20, cursor: 'pointer', accentColor: 'var(--blue-600)' }} />
                      </label>
                    </div>
                    <button onClick={() => setRuleModal(rule)} style={{ width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', color: 'var(--text-muted)' }}><Icon name="pencil" size={13} /></button>
                    <button onClick={() => deleteRule(rule.id)} style={{ width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', color: 'var(--text-muted)' }}><Icon name="trash-2" size={13} /></button>
                  </div>
                </div>
                {/* Visual IF/THEN chips */}
                <div style={{ borderTop: '1px solid var(--border-subtle)', padding: '8px 18px', display: 'flex', alignItems: 'center', gap: 8, background: 'var(--slate-50)' }}>
                  <span style={{ padding: '3px 10px', background: 'var(--blue-100)', color: 'var(--blue-800)', borderRadius: 8, fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-bold)' }}>IF</span>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-body)' }}>{trig?.label || rule.trigger_type}</span>
                  <Icon name="arrow-right" size={13} style={{ color: 'var(--text-subtle)' }} />
                  <span style={{ padding: '3px 10px', background: 'var(--green-100)', color: 'var(--green-800)', borderRadius: 8, fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-bold)' }}>THEN</span>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-body)' }}>{act?.label || rule.action_type}</span>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* ── Templates tab ── */}
      {!loading && tab === 'templates' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {templates.length === 0 && (
            <div style={{ gridColumn: '1/-1', padding: '60px 24px', textAlign: 'center' }}>
              <span style={{ fontSize: 48 }}>📋</span>
              <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--fw-bold)', marginTop: 12, marginBottom: 6 }}>No templates yet</div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginBottom: 20 }}>Create reusable task lists for recurring projects like "Client onboarding" or "Monthly reporting"</div>
              <button onClick={() => setTmplModal('new')} style={btnS}><Icon name="plus" size={16} /> Create template</button>
            </div>
          )}
          {templates.map(tmpl => (
            <Card key={tmpl.id} padding="lg" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
                <div>
                  <div style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--fw-bold)', color: 'var(--text-strong)' }}>{tmpl.name}</div>
                  {tmpl.description && <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 3 }}>{tmpl.description}</div>}
                </div>
                <Badge tone="neutral" size="sm">{tmpl.tasks?.length || 0} tasks</Badge>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {(tmpl.tasks || []).slice(0, 3).map((t, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--text-xs)', color: 'var(--text-body)' }}>
                    <Icon name="circle" size={10} style={{ color: 'var(--text-subtle)' }} />
                    {t.title}
                    {t.due_offset_days && <span style={{ color: 'var(--text-subtle)' }}>· day {t.due_offset_days}</span>}
                  </div>
                ))}
                {(tmpl.tasks?.length || 0) > 3 && <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', paddingLeft: 18 }}>+{tmpl.tasks.length - 3} more…</div>}
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <button onClick={() => setApplyModal(tmpl)} style={{ ...btnS, flex: 1, justifyContent: 'center', boxShadow: 'none', fontSize: 'var(--text-xs)' }}>
                  <Icon name="play" size={13} /> Apply
                </button>
                <button onClick={() => setTmplModal(tmpl)} style={{ ...outS, fontSize: 'var(--text-xs)', height: 32 }}><Icon name="pencil" size={13} /></button>
                <button onClick={async () => { await window.API.deleteTemplate(tmpl.id); setTemplates(prev => prev.filter(t => t.id !== tmpl.id)); }} style={{ ...outS, fontSize: 'var(--text-xs)', height: 32 }}><Icon name="trash-2" size={13} /></button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ── Webhooks tab ── */}
      {!loading && tab === 'webhooks' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ background: 'var(--amber-50)', border: '1px solid var(--amber-200)', borderRadius: 'var(--radius-lg)', padding: '12px 16px', fontSize: 'var(--text-sm)', color: 'var(--amber-800)' }}>
            <Icon name="info" size={15} style={{ verticalAlign: 'middle', marginRight: 6 }} />
            Webhooks fire a POST request to your URL with JSON payload when events occur in TechyFuel OS.
          </div>

          {webhooks.length === 0 && (
            <div style={{ padding: '60px 24px', textAlign: 'center' }}>
              <span style={{ fontSize: 48 }}>🔗</span>
              <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--fw-bold)', marginTop: 12, marginBottom: 6 }}>No webhooks configured</div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginBottom: 20 }}>Connect TechyFuel OS to Slack, Zapier, or your own backend</div>
              <button onClick={() => setWhModal('new')} style={btnS}><Icon name="plus" size={16} /> Add webhook</button>
            </div>
          )}

          {webhooks.map(wh => (
            <Card key={wh.id} padding="none">
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px' }}>
                <span style={{ width: 38, height: 38, borderRadius: 'var(--radius-md)', background: wh.enabled ? 'var(--violet-50)' : 'var(--slate-100)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                  <Icon name="webhook" size={18} style={{ color: wh.enabled ? 'var(--violet-600)' : 'var(--text-muted)' }} />
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-bold)', color: 'var(--text-strong)' }}>{wh.name}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 2, fontFamily: 'var(--font-mono)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{wh.url}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 'none' }}>
                  {wh.last_status && <Badge tone={wh.last_status >= 200 && wh.last_status < 300 ? 'success' : 'danger'} size="sm">{wh.last_status}</Badge>}
                  {wh.last_triggered_at && <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-subtle)', whiteSpace: 'nowrap' }}>{fmtTime(wh.last_triggered_at)}</span>}
                  <button onClick={() => setWhModal(wh)} style={{ width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', color: 'var(--text-muted)' }}><Icon name="pencil" size={13} /></button>
                  <button onClick={async () => { await window.API.deleteWebhook(wh.id); setWebhooks(prev => prev.filter(w => w.id !== wh.id)); }} style={{ width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', color: 'var(--text-muted)' }}><Icon name="trash-2" size={13} /></button>
                </div>
              </div>
              {wh.events?.length > 0 && (
                <div style={{ borderTop: '1px solid var(--border-subtle)', padding: '7px 18px', display: 'flex', flexWrap: 'wrap', gap: 6, background: 'var(--slate-50)' }}>
                  {wh.events.map(e => <Badge key={e} tone="neutral" size="sm">{e}</Badge>)}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* ── Approvals tab ── */}
      {!loading && tab === 'approvals' && (
        <div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            {['pending','approved','rejected'].map(s => (
              <button key={s} onClick={() => setApprovalFilter(s)} style={{ height: 32, padding: '0 14px', border: `1px solid ${approvalFilter === s ? 'var(--blue-400)' : 'var(--border-default)'}`, borderRadius: 'var(--radius-full)', background: approvalFilter === s ? 'var(--blue-50)' : 'var(--slate-0)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: approvalFilter === s ? 'var(--fw-bold)' : 'var(--fw-medium)', color: approvalFilter === s ? 'var(--blue-700)' : 'var(--text-body)', cursor: 'pointer', textTransform: 'capitalize' }}>
                {s} {approvals.filter(a => a.status === s).length > 0 && `(${approvals.filter(a => a.status === s).length})`}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {approvals.filter(a => a.status === approvalFilter).length === 0 && (
              <div style={{ padding: '60px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <Icon name="shield-check" size={36} style={{ opacity: 0.3, marginBottom: 12, display: 'block', margin: '0 auto 12px' }} />
                <div style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--fw-semibold)' }}>No {approvalFilter} approvals</div>
              </div>
            )}
            {approvals.filter(a => a.status === approvalFilter).map(appr => (
              <Card key={appr.id} padding="lg">
                <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <span style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: appr.status === 'pending' ? 'var(--amber-50)' : appr.status === 'approved' ? 'var(--green-50)' : 'var(--red-50)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                    <Icon name="shield-check" size={20} style={{ color: appr.status === 'pending' ? 'var(--amber-600)' : appr.status === 'approved' ? 'var(--green-600)' : 'var(--red-600)' }} />
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-bold)', color: 'var(--text-strong)' }}>
                        {appr.tasks?.title || 'Task approval'}
                      </span>
                      <Badge tone={TONE[appr.status]} size="sm">{appr.status}</Badge>
                    </div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: appr.status === 'pending' ? 12 : 0 }}>
                      Requested by {appr.team_members?.name || '—'} · {fmtDate(appr.created_at)}
                      {appr.resolved_at && ` · Resolved ${fmtDate(appr.resolved_at)}`}
                    </div>
                    {appr.comment && <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-body)', marginTop: 4, fontStyle: 'italic' }}>"{appr.comment}"</div>}
                    {appr.status === 'pending' && (
                      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                        <button onClick={() => resolveApproval(appr.id, 'approved', appr.task_id, null)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 32, padding: '0 14px', background: 'var(--green-600)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-semibold)', cursor: 'pointer' }}>
                          <Icon name="check" size={13} /> Approve
                        </button>
                        <button onClick={() => resolveApproval(appr.id, 'rejected', appr.task_id, null)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 32, padding: '0 14px', background: 'var(--red-600)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-semibold)', cursor: 'pointer' }}>
                          <Icon name="x" size={13} /> Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <RuleModal open={!!ruleModal} rule={ruleModal === 'new' ? null : ruleModal} team={team} projects={projects} onClose={() => setRuleModal(null)} onSave={saveRule} />
      <TemplateModal open={!!tmplModal} template={tmplModal === 'new' ? null : tmplModal} team={team} projects={projects} onClose={() => setTmplModal(null)} onSave={saveTemplate} />
      <WebhookModal open={!!whModal} webhook={whModal === 'new' ? null : whModal} onClose={() => setWhModal(null)} onSave={saveWebhook} />
      <ApplyTemplateModal open={!!applyModal} template={applyModal} team={team} projects={projects} onClose={() => setApplyModal(null)} />
    </div>
  );
}

Object.assign(window, { Automations });
})();
