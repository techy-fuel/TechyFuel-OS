// Pings Supabase once a day (via the Vercel Cron below) so the free-tier
// project is never treated as inactive and auto-paused. We don't need the
// query to return real data -- Supabase just needs to see a request hit its
// API to count the project as active, regardless of what RLS allows back.
export default async function handler(req, res) {
  const url = 'https://nvgzzhqfibhtbauinmwu.supabase.co';
  const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52Z3p6aHFmaWJodGJhdWlubXd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxMjMyODYsImV4cCI6MjA5NzY5OTI4Nn0.eBz7eQ7JT8hewdMIqV_I-lfZH84rskIHAsyJusAa5hA';

  try {
    const r = await fetch(`${url}/rest/v1/team_members?select=id&limit=1`, {
      headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
    });
    return res.status(200).json({ ok: true, supabaseStatus: r.status, pingedAt: new Date().toISOString() });
  } catch (err) {
    return res.status(200).json({ ok: false, error: err.message, pingedAt: new Date().toISOString() });
  }
}
