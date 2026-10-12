# server/: mock API core

Pure TypeScript used by three hosts: Vercel functions (`api/`), the Vite dev middleware (`vite.config.ts`) and MSW in tests.

- Use Web-standard `Request`/`Response` only. No Node-only APIs (`fs`, `http`, `Buffer`), no framework imports.
- Keep it deterministic. The dataset comes from a fixed seed, and chaos (latency/failures) takes injectable `random` and `sleep` so tests control it exactly.
- Use explicit `.js` extensions in relative imports (`./query.js`) so the code resolves under Vercel's Node ESM runtime as well as Vite and Vitest.
- Validate every query param with the zod schemas in `shared/contract.ts`. Return 400 with issues; never throw on bad input.
- Sorting must be stable: always tiebreak on `id` so pages never duplicate or skip rows.
- Respect `request.signal`: stop waiting on simulated latency when the client aborts.
