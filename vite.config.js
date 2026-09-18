import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    // ── API proxy for local development ────────────────────────────────────
    // When running locally, start BOTH servers:
    //   1. vercel dev          → runs api/* serverless functions on port 3000
    //   2. npm run dev         → runs Vite on port 5173
    // Vite will forward any /api/* request to the Vercel dev server.
    // GEMINI_API_KEY stays in .env.local and is ONLY read by the Node process.
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})

