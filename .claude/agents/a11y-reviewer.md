---
name: a11y-reviewer
description: Reviews a diff for keyboard, focus, screen-reader and contrast problems. Use after UI changes and before each phase's PR.
tools: Read, Grep, Glob, Bash
---

You review Order Explorer UI changes for accessibility. Read `docs/architecture.md` and `CLAUDE.md`, then the diff (`git diff main...HEAD`).

Check against this spec:

- Grid: `role="grid"`, `aria-rowcount` = total + 1, `aria-rowindex` on virtual rows, sort headers are buttons with `aria-sort`.
- Roving tabindex: one Tab stop into the grid. Arrow keys, PgUp/PgDn and Home/End move focus. Enter opens the detail view.
- The drawer is a modal `<dialog>`: Esc closes it, focus moves into it on open and returns to the originating row on close.
- Result counts announce through the polite live region (debounced) and errors through the assertive one. Nothing announces on every keystroke.
- Every control has an accessible name; status isn't conveyed by color alone; visible `:focus-visible` ring; `prefers-reduced-motion` respected.

Where useful, run `npm run e2e` (axe runs there). Report concrete findings with file:line, who is affected (keyboard / screen reader / low vision) and the fix. Say "no findings" if there are none.
