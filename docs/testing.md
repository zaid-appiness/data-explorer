# Testing strategy and quality gates

We prefer a few tests aimed at the behaviour most likely to break (races, errors, URL state) over broad shallow coverage.

## Test matrix

| Test                                                                            | Level                  | Proves | Status  |
| ------------------------------------------------------------------------------- | ---------------------- | ------ | ------- |
| Out-of-order responses: slow `ab` resolves after fast `abc`; only `abc` renders | Vitest + MSW deferreds | R3     | planned |
| Typing a new term aborts the in-flight request                                  | Vitest + MSW           | R3     | planned |
| 5 fast keystrokes → 1 request                                                   | Vitest                 | R3     | planned |
| New query fails after old succeeded → old rows gone, error + Retry              | Vitest + MSW           | R6     | planned |
| One page fails while others loaded → inline retry row, retry fills it           | Vitest + MSW           | R6     | planned |
| URL parse/serialize round-trip, normalization, canonical ordering               | Vitest                 | R4     | planned |
| Server query: AND filters, case-insensitive search, stable sort, no dup/skip    | Vitest                 | R1     | planned |
| Chaos: latency range and ≈10% failure rate (seeded)                             | Vitest                 | R2     | planned |
| Filters → open row → close → back/forward/refresh restore view + scroll         | Playwright             | R4, R8 | planned |
| Deep link to `/orders/:id?…` opens drawer; close lands on filtered list         | Playwright             | R8     | planned |
| Keyboard-only flow + axe on list/empty/error/drawer                             | Playwright + axe       | R7     | planned |
| App shell renders with zero axe violations; dev server hosts `/api`             | Playwright + axe       | infra  | ✅      |
| `/api/ping` Web-signature handler                                               | Vitest                 | infra  | ✅      |

## Determinism

Production chaos is random. Tests make it deterministic in two ways:

- **Unit/integration:** MSW handlers call the server core with injected `random`/`sleep`, plus per-test deferred responses to force a specific arrival order.
- **e2e:** requests send `x-chaos: off` (honored only when `ALLOW_CHAOS_OVERRIDE` is set). Dedicated specs send `fail`/`slow`.

## Quality gates (CI fails the build)

| Gate         | Command                | Threshold                                          |
| ------------ | ---------------------- | -------------------------------------------------- |
| Types        | `npm run typecheck`    | 0 errors (strict, `noUncheckedIndexedAccess`)      |
| Lint/format  | `npm run lint`         | 0 errors (incl. jsx-a11y strict, layer boundaries) |
| Unit/integ.  | `npm test`             | all pass; ≥90% coverage on core modules once added |
| E2E + a11y   | `npm run e2e`          | all pass; 0 axe violations                         |
| Bundle       | `npm run size`         | initial JS ≤ 110 kB gzip                           |
| Dependencies | `npm audit --omit=dev` | no high/critical                                   |
