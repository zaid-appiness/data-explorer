# 0001: Mock API as Vercel Functions sharing one pure handler

- **Status:** Accepted
- **Date:** 2026-10-12

## Context

R1 and R2 need a mock API we control: server-side search, filter, sort and pagination, plus 200 ms–3 s latency and ~10% failures. The demo video must show slow and failed requests live, ideally with DevTools throttling and offline mode. Tests need the same API to behave deterministically.

## Decision

Implement the API once in `server/`, as pure functions plus a handler, using only Web-standard `Request`/`Response`. Expose it through three thin hosts:

1. **Vercel Functions** in `api/`, using the Web signature `export function GET(request: Request)`.
2. **Vite dev middleware** in `vite.config.ts`, which converts Node req/res to and from Request/Response.
3. **MSW** in tests, where the handler is called with injected `random`/`sleep`.

## Alternatives considered

| Option                  | Why not                                                                                                                                                                                 |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| MSW in the browser only | Responses come from a service worker, so DevTools network throttling and offline mode don't affect them. That undermines the "slow network" demo, and it isn't a real network boundary. |
| json-server             | No latency/failure control without custom middleware, limited filtering, and it needs a separate long-running host.                                                                     |
| Supabase table          | Latency and failure injection would need a proxy anyway; adds an external dependency and free-tier pausing.                                                                             |

## Consequences

- Production, local dev and tests all exercise the same query and chaos code, so there's no drift between hosts.
- Each warm function instance builds the 25k-row dataset once (~tens of ms); cold starts pay that cost.
- Every file under `api/` becomes a function, so tests live in `test/` (see CLAUDE.md).
- **Risk, verified in Phase 0 only locally:** the Web-signature export must work for a non-Next Vite project on Vercel. Fallback: a thin `@vercel/node` adapter around the same handler. This needs a preview deploy of `api/ping.ts` to confirm.
