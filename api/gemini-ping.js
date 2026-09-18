/**
 * api/gemini-ping.js
 *
 * Vercel Serverless Function — GET /api/gemini-ping
 *
 * Connectivity test endpoint. Sends a minimal fixed prompt to Gemini and
 * returns the result. Used to verify the API key and SDK are working
 * without changing any UI.
 *
 * Test in browser:    https://your-app.vercel.app/api/gemini-ping
 * Test locally:       http://localhost:3000/api/gemini-ping  (with `vercel dev`)
 * Test with curl:     curl http://localhost:3000/api/gemini-ping
 *
 * Success response:
 *   { ok: true, model: "gemini-2.0-flash", response: "..." }
 *
 * Failure response:
 *   { ok: false, error: "..." }
 */

import { GoogleGenAI } from '@google/genai';

const MODEL_NAME = 'gemini-2.5-flash';
const PING_PROMPT = 'Reply with exactly the word: OK';

export default async function handler(req, res) {
  // Allow GET and HEAD only
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: false, error: 'Method not allowed. Use GET.' }));
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      ok: false,
      error: 'GEMINI_API_KEY is not set. Add it to .env.local (local) or Vercel environment variables (production).'
    }));
    return;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const result = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: PING_PROMPT,
    });

    const responseText = result.text ?? '(no text returned)';

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      ok: true,
      model: MODEL_NAME,
      prompt: PING_PROMPT,
      response: responseText.trim(),
      timestamp: new Date().toISOString(),
    }));
  } catch (err) {
    const message = err?.message || 'Unknown Gemini error';
    res.writeHead(502, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: false, error: message }));
  }
}
