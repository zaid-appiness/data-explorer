# AI usage

This project was built with **Claude Code** (Claude Opus 5.5) as a pair-programmer. I directed the work, decided the architecture, and reviewed and verified every change. This log records how I used it and, more importantly, where I corrected it.

## Conversation links

- Planning + Phase 0 session: _(add Claude share link)_

## How I worked with it

- **Plan first.** I asked Claude to produce an engineering plan from the assignment PDF before writing any code, and I answered its clarifying questions: mock API host, stack, dataset and scope.
- **One phase at a time.** Each phase ends with real command output (`npm run verify`, `npm run e2e`) rather than a claim that it works.
- **Persistent rules** live in `CLAUDE.md` and `server/CLAUDE.md`, and decisions live in `docs/adr/`.

## Corrections and rejected output

| Phase | What happened                                                                                                                                         | What I did                                                                                                 |
| ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| 0     | Planning: the prompt template asked for auth/RBAC, runbooks and many doc folders.                                                                     | Scoped to what the assignment grades; auth/observability documented as future-state ADR rather than built. |
| 0     | `npm install` failed: `eslint-plugin-jsx-a11y` doesn't support ESLint 10.                                                                             | Pinned ESLint 9 rather than `--force`/`--legacy-peer-deps`.                                                |
| 0     | The dev adapter aborted requests on `req` `'close'`, which fires right after a GET is read and would have cancelled every simulated-latency response. | Changed it to abort on `res` `'close'` when the response hasn't finished.                                  |
| 0     | A test file was placed in `api/`, where Vercel would have deployed it as a function.                                                                  | Moved API tests to `test/` and added the rule to CLAUDE.md.                                                |
