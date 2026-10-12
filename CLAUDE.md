# Order Explorer

Searchable, filterable, sortable explorer over 25k mock orders. The mock API adds latency and fails ~10% of requests on purpose.

## Commands

- `npm run dev`: Vite with `/api/*` served by the same handlers that run on Vercel
- `npm run verify`: typecheck + lint + prettier check + unit/integration tests (**must pass before any commit**)
- `npm run e2e`: Playwright (starts the dev server)
- `npm run size`: production build + bundle budget
- Single test: `npx vitest run path/to/file.test.ts`

## Where things are

- Architecture, data flow, URL schema: `docs/architecture.md`
- Decisions and their trade-offs: `docs/adr/` (add one for any non-obvious choice or new dependency)
- Test matrix and quality gates: `docs/testing.md`
- API contract: `shared/contract.ts` is the single source of truth for client and server

## Rules

- The URL is the only source of truth for explorer state (q, filters, sort, row). Never mirror it into `useState` or a store.
- Never copy fetched data into component state; read it from TanStack Query by key.
- Every fetch takes an `AbortSignal`; every response is zod-parsed before use.
- Never present data from a previous query as current: dim it, mark `aria-busy`, and label it as updating.
- `server/` and `api/` never import client code; `src/ui/` never imports from `src/features/` (ESLint enforces this).
- Every file in `api/` becomes a Vercel function. Put only route entry points there; tests go in `test/`.
- New UI must be keyboard-operable, have visible focus, pass axe, and announce async results through the Announcer.
- No new dependency without a line in an ADR saying why.

## Definition of done

1. `npm run verify` passes. Run it and read the output; don't assume.
2. New behaviour has a test that would fail without the change (races, errors and URL state especially).
3. If behaviour or a decision changed, update `docs/architecture.md` or the relevant ADR in the same commit.
