---
name: verify
description: Run every quality gate (typecheck, lint, tests, e2e, bundle size) and report real results. Use before claiming any phase or change is done.
---

Run these in order, stopping at the first failure:

1. `npm run verify`
2. `npm run e2e`
3. `npm run size`

Report each gate as pass/fail with the relevant lines of real output (test counts, the error, the bundle size).
Never summarize a gate you didn't run as passing. On failure, diagnose the root cause before changing code, and never weaken a test or threshold to make it pass without asking.
