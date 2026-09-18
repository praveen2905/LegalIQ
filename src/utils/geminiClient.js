/**
 * src/utils/geminiClient.js
 *
 * Client-side proxy helper for the Gemini API.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * SECURITY CONTRACT:
 *   - This file does NOT import @google/genai
 *   - This file does NOT read any environment variable (no import.meta.env, no process.env)
 *   - This file does NOT contain or reference GEMINI_API_KEY in any form
 *   - All Gemini calls go through the server-side endpoint /api/gemini
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Usage (from any React component or utility):
 *
 *   import { askGemini } from '../utils/geminiClient';
 *
 *   const result = await askGemini({
 *     prompt: 'Summarize this contract clause: ...',
 *     systemInstruction: 'You are a legal assistant. Be concise.',
 *   });
 *   // result.text → the model's response string
 *
 * Throws an Error with a human-readable message on any failure.
 */

const GEMINI_ENDPOINT = '/api/gemini';

/**
 * Send a prompt to Gemini via the server-side API endpoint.
 *
 * @param {object} options
 * @param {string} options.prompt            - The prompt text (required)
 * @param {string} [options.systemInstruction] - Optional system instruction
 * @returns {Promise<{ text: string }>}
 */
export async function askGemini({ prompt, systemInstruction }) {
  if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
    throw new Error('askGemini: prompt is required and must be a non-empty string.');
  }

  const payload = { prompt: prompt.trim() };
  if (systemInstruction) {
    payload.systemInstruction = systemInstruction;
  }

  let res;
  try {
    res = await fetch(GEMINI_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (networkErr) {
    throw new Error(
      `Gemini API is unreachable. Check your network connection and that the server is running. (${networkErr.message})`
    );
  }

  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error(`Gemini API returned an unexpected non-JSON response (HTTP ${res.status}).`);
  }

  if (!res.ok) {
    throw new Error(data?.error || `Gemini API request failed (HTTP ${res.status}).`);
  }

  if (typeof data.text !== 'string') {
    throw new Error('Gemini API response missing expected "text" field.');
  }

  return { text: data.text };
}
