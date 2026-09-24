/**
 * api/gemini.js
 *
 * Vercel Serverless Function — POST /api/gemini
 *
 * This is the ONLY place in the project that touches GEMINI_API_KEY.
 * The key is read exclusively from the server environment (process.env).
 * It is never sent to the browser, never in source code, never in git.
 *
 * Request body (JSON):
 *   {
 *     prompt: string,              // required — the user / feature message
 *     systemInstruction?: string   // optional — system-level context
 *   }
 *
 * Response (JSON):
 *   Success → { text: string }
 *   Error   → { error: string }, HTTP 4xx/5xx
 */

import { GoogleGenAI } from '@google/genai';

// ── Model configuration ────────────────────────────────────────────────────
const MODEL_NAME = 'gemini-2.5-flash';

// ── CORS headers (allow local Vite dev server + Vercel origin) ─────────────
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// ── Main handler ───────────────────────────────────────────────────────────
export default async function handler(req, res) {
  // Handle preflight OPTIONS
  if (req.method === 'OPTIONS') {
    res.writeHead(204, CORS_HEADERS);
    res.end();
    return;
  }

  // Only accept POST
  if (req.method !== 'POST') {
    res.writeHead(405, { ...CORS_HEADERS, 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method not allowed. Use POST.' }));
    return;
  }

  // Guard: API key must exist in server env
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.writeHead(500, { ...CORS_HEADERS, 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      error: 'GEMINI_API_KEY is not configured on the server. Add it to .env.local for local dev or to Vercel environment variables for production.'
    }));
    return;
  }

  // Parse body (handles pre-parsed Vercel body or unbuffered Node stream)
  let body = req.body;
  if (body === undefined) {
    try {
      const chunks = [];
      for await (const chunk of req) {
        chunks.push(chunk);
      }
      const rawText = Buffer.concat(chunks).toString('utf8');
      body = rawText ? JSON.parse(rawText) : {};
    } catch {
      res.writeHead(400, { ...CORS_HEADERS, 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to parse JSON body from request stream.' }));
      return;
    }
  } else if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      res.writeHead(400, { ...CORS_HEADERS, 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid JSON body string.' }));
      return;
    }
  }

  const { prompt, systemInstruction, responseMimeType } = body || {};

  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    res.writeHead(400, { ...CORS_HEADERS, 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Missing required field: prompt (non-empty string).' }));
    return;
  }

  // Call Gemini
  try {
    const ai = new GoogleGenAI({ apiKey });

    const config = {};
    if (systemInstruction) config.systemInstruction = systemInstruction;
    if (responseMimeType) config.responseMimeType = responseMimeType;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt.trim(),
      config,
    });

    const text = response.text ?? '';

    res.writeHead(200, { ...CORS_HEADERS, 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ text }));
  } catch (err) {
    const message = err?.message || 'Unknown error from Gemini API';
    const status = message.includes('API_KEY') ? 401 : 502;

    res.writeHead(status, { ...CORS_HEADERS, 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: `Gemini API error: ${message}` }));
  }
}
