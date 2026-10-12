// Phase 0 de-risk: proves the Web-standard function signature runs on Vercel, in Vite dev and in tests.
export function GET(_request: Request): Response {
  return Response.json(
    { ok: true, time: new Date().toISOString() },
    { headers: { 'cache-control': 'no-store' } },
  );
}
