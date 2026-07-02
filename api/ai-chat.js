// Real AI Assistant backend — routes through Vercel AI Gateway (works with
// zero setup once "AI Gateway" is turned on for this project in the Vercel
// dashboard: Project Settings -> AI Gateway -> Enable. No API key needed on
// Vercel; it authenticates automatically via the deployment's OIDC token).
import { generateText } from 'ai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, context } = req.body || {};
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'message is required' });
  }

  const systemPrompt = `You are the AI Assistant embedded inside TechyFuel OS, a digital marketing agency operating system.
Answer using ONLY the workspace data snapshot given below — never invent numbers, clients, or tasks that aren't in it.
The agency's home currency is PKR; every money figure in the snapshot already includes an "_pkr" value converted at
today's rate, so use that for totals/comparisons regardless of the original currency.
Reply in whichever language or mix the user asked in (English, Roman Urdu, or a blend) — match their style naturally.
Keep answers short and direct (2-5 sentences) unless the user explicitly asks you to draft, list, or write something longer.
If the snapshot doesn't contain what's needed to answer, say so plainly instead of guessing.

Workspace data snapshot (JSON):
${JSON.stringify(context || {}).slice(0, 14000)}`;

  try {
    const { text } = await generateText({
      model: 'anthropic/claude-haiku-4.5',
      system: systemPrompt,
      prompt: message,
    });
    return res.status(200).json({ reply: text });
  } catch (err) {
    const status = err && err.statusCode;
    if (status === 402) return res.status(200).json({ reply: 'AI budget limit reached for this workspace — please try again later or ask your workspace owner to check AI Gateway usage in Vercel.' });
    if (status === 429) return res.status(200).json({ reply: 'Too many requests right now — please wait a moment and try again.' });
    console.error('[AI chat] error:', err);
    return res.status(200).json({ reply: 'Sorry, I could not process that just now. Please try again in a moment.' });
  }
}
