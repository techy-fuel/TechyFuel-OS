<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * AI Assistant backend. Uses a FREE, no-cost LLM provider (Groq by default —
 * OpenAI-compatible, generous free tier, no credit card). Falls back to a
 * helpful message if no key is configured. Set AI_PROVIDER + AI_API_KEY in
 * .env:
 *   AI_PROVIDER=groq   AI_API_KEY=gsk_...      (https://console.groq.com — free)
 *   AI_PROVIDER=gemini AI_API_KEY=AIza...      (https://aistudio.google.com — free)
 */
class AiController extends Controller
{
    public function chat(Request $request)
    {
        $data = $request->validate([
            'message' => ['required', 'string'],
            'context' => ['nullable'],
        ]);

        $provider = env('AI_PROVIDER', 'groq');
        $key = env('AI_API_KEY');
        if (!$key) {
            return response()->json([
                'reply' => "AI is not configured yet. Add a free API key (Groq or Gemini) in the server .env as AI_API_KEY to enable the assistant.",
            ]);
        }

        $snapshot = is_string($data['context'] ?? null)
            ? $data['context']
            : json_encode($data['context'] ?? []);
        $snapshot = mb_substr((string) $snapshot, 0, 14000);

        $system = "You are the AI Assistant embedded inside TechyFuel OS, a digital marketing agency operating system.\n"
            . "Answer using ONLY the workspace data snapshot given below — never invent numbers, clients, or tasks that aren't in it.\n"
            . "The agency's home currency is PKR; money figures may include an \"_pkr\" value — use that for totals/comparisons.\n"
            . "Reply in whichever language or mix the user asked in (English, Roman Urdu, or a blend) — match their style.\n"
            . "Keep answers short and direct (2-5 sentences) unless asked to draft/list/write something longer.\n"
            . "If the snapshot lacks what's needed, say so plainly instead of guessing.\n\n"
            . "Workspace data snapshot (JSON):\n" . $snapshot;

        try {
            if ($provider === 'gemini') {
                return $this->gemini($key, $system, $data['message']);
            }
            return $this->groq($key, $system, $data['message']);
        } catch (\Throwable $e) {
            Log::warning('ai-chat failed: ' . $e->getMessage());
            return response()->json(['reply' => 'Sorry, I could not process that just now. Please try again in a moment.']);
        }
    }

    /** Groq — OpenAI-compatible chat completions, free tier. */
    protected function groq(string $key, string $system, string $message)
    {
        $res = Http::withToken($key)->timeout(30)->post('https://api.groq.com/openai/v1/chat/completions', [
            'model' => env('AI_MODEL', 'llama-3.3-70b-versatile'),
            'messages' => [
                ['role' => 'system', 'content' => $system],
                ['role' => 'user', 'content' => $message],
            ],
            'temperature' => 0.4,
            'max_tokens' => 800,
        ]);
        if ($res->failed()) {
            Log::warning('groq error ' . $res->status() . ': ' . $res->body());
            return response()->json(['reply' => 'The AI service is busy right now — please try again in a moment.']);
        }
        $text = $res->json('choices.0.message.content') ?? 'No response.';
        return response()->json(['reply' => trim($text)]);
    }

    /** Google Gemini — free tier. */
    protected function gemini(string $key, string $system, string $message)
    {
        $model = env('AI_MODEL', 'gemini-1.5-flash');
        $url = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$key}";
        $res = Http::timeout(30)->post($url, [
            'system_instruction' => ['parts' => [['text' => $system]]],
            'contents' => [['role' => 'user', 'parts' => [['text' => $message]]]],
            'generationConfig' => ['temperature' => 0.4, 'maxOutputTokens' => 800],
        ]);
        if ($res->failed()) {
            Log::warning('gemini error ' . $res->status() . ': ' . $res->body());
            return response()->json(['reply' => 'The AI service is busy right now — please try again in a moment.']);
        }
        $text = $res->json('candidates.0.content.parts.0.text') ?? 'No response.';
        return response()->json(['reply' => trim($text)]);
    }
}
