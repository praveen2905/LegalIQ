import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Local API dev server plugin (executes serverless functions in Node during npm run dev)
function apiDevPlugin() {
  return {
    name: 'api-dev-server',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ? req.url.split('?')[0] : '';
        if (url === '/api/gemini') {
          try {
            if (process.loadEnvFile) {
              try { process.loadEnvFile('.env.local'); } catch {}
            }
            const { default: handler } = await import('./api/gemini.js');
            await handler(req, res);
          } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: `API dev error: ${err.message}` }));
          }
          return;
        }
        if (url === '/api/gemini-ping') {
          try {
            if (process.loadEnvFile) {
              try { process.loadEnvFile('.env.local'); } catch {}
            }
            const { default: handler } = await import('./api/gemini-ping.js');
            await handler(req, res);
          } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: `API dev error: ${err.message}` }));
          }
          return;
        }
        next();
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    apiDevPlugin()
  ],
  server: {
    port: 5173
  }
})

