# Order Explorer

A searchable, filterable, sortable explorer over 25,000 orders. It's built to stay fast and **never show the wrong results** under slow networks, failed requests and fast typing.

> **Status:** Phase 0 (foundations). Live URL, demo video and full write-up are added in the release phase.

- **Live app:** _TBD_
- **Demo video:** _TBD_

## Run locally

Prerequisites: Node ≥ 20 (`.nvmrc` pins 22) and npm.

```bash
npm install
npm run dev          # http://localhost:5173 (also serves the /api/* functions)
```

| Command            | What it does                                          |
| ------------------ | ----------------------------------------------------- |
| `npm run verify`   | Typecheck, lint, format check, unit/integration tests |
| `npm run e2e`      | Playwright end-to-end + axe accessibility checks      |
| `npm run size`     | Production build + bundle-size budget                 |
| `npm run coverage` | Tests with coverage report                            |

First e2e run: `npx playwright install chromium`.

## Architecture

See [docs/architecture.md](docs/architecture.md) for diagrams and data flow, and [docs/adr/](docs/adr/) for decisions and trade-offs.

- **Mock API:** Vercel Functions backed by one pure handler that's shared with the Vite dev server and the test suite ([ADR 0001](docs/adr/0001-mock-api-on-vercel-functions.md)).
- **State:** the URL is the single source of truth for search, filters, sort and position ([ADR 0002](docs/adr/0002-url-as-source-of-truth.md)).

## Testing

See [docs/testing.md](docs/testing.md) for the test matrix and CI quality gates.

## Deploy and rollback

The app deploys to Vercel via Git integration: PRs get preview deployments and `main` deploys to production. To roll back, use Vercel **Instant Rollback** to the previous production deployment, or revert the squash-merged PR.

## Sources and references

_Collected as the build progresses._

## AI usage

Built with Claude Code. See [docs/ai-usage.md](docs/ai-usage.md) for the workflow, conversation links, and the corrections I made to AI output.
