import type { IncomingMessage, ServerResponse } from 'node:http';
import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin, type ViteDevServer } from 'vite';

/**
 * Local-dev host for the Vercel functions in /api.
 *
 * Every function exports a Web-standard `GET(request: Request): Promise<Response>`, so the same
 * module runs unchanged on Vercel, in MSW (tests) and here. This plugin only converts Node's
 * req/res to and from Request/Response; it contains no API logic (see docs/adr/0001).
 */
const API_ROUTES: { pattern: RegExp; module: string }[] = [
  { pattern: /^\/api\/ping$/, module: '/api/ping.ts' },
];

type WebHandler = (request: Request) => Response | Promise<Response>;

function toWebRequest(req: IncomingMessage, res: ServerResponse): Request {
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (typeof value === 'string') headers.set(key, value);
    else if (Array.isArray(value)) value.forEach((v) => headers.append(key, v));
  }
  // Abort only when the client disconnects before we respond. `req` emits 'close' as soon as a
  // GET body is consumed, so listening there would abort every request immediately.
  const controller = new AbortController();
  res.once('close', () => {
    if (!res.writableFinished) controller.abort();
  });
  return new Request(new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`), {
    method: req.method ?? 'GET',
    headers,
    signal: controller.signal,
  });
}

async function sendWebResponse(res: ServerResponse, response: Response): Promise<void> {
  res.statusCode = response.status;
  response.headers.forEach((value, key) => res.setHeader(key, value));
  res.end(Buffer.from(await response.arrayBuffer()));
}

function devApi(): Plugin {
  return {
    name: 'dev-api',
    configureServer(server: ViteDevServer) {
      server.middlewares.use((req, res, next) => {
        const pathname = (req.url ?? '').split('?')[0] ?? '';
        const route = API_ROUTES.find((r) => r.pattern.test(pathname));
        if (!route) return next();
        void (async () => {
          try {
            const mod = (await server.ssrLoadModule(route.module)) as { GET?: WebHandler };
            if (!mod.GET) throw new Error(`${route.module} has no GET export`);
            await sendWebResponse(res, await mod.GET(toWebRequest(req, res)));
          } catch (error) {
            server.config.logger.error(String(error));
            if (!res.headersSent) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: { code: 'INTERNAL', message: 'Dev API error' } }));
            }
          }
        })();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), devApi()],
});
