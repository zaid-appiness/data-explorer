# 0002: The URL is the single source of truth for explorer state

- **Status:** Accepted
- **Date:** 2026-10-12

## Context

R4 requires refresh, back/forward and shared links to restore the exact view: search, filters, sort and position. R8 requires a deep-linkable detail view that closes without losing list state. Keeping state in the URL _and_ in React state creates two sources of truth that drift: the classic "back button shows the URL changing but the list doesn't".

## Decision

- Explorer state is **derived** from `location.search` on every render via `parseSearch()` (zod, with defaults) and written only via `navigate()` with a canonical `serializeSearch()`. No `useState` or global store mirrors it.
- The search input keeps local state for responsiveness while typing. It commits to the URL after a 300 ms debounce, and when the URL changes externally (back/forward) the local value is reset from the URL.
- History policy: keystrokes and scroll-anchor (`row`) updates use `replace`; filter, sort and detail-open use `push`.
- The detail drawer is a child route (`/orders/:orderId`) rendered through the list's `<Outlet/>`, so the list stays mounted and keeps its scroll position.
- Position is stored as `row` (top visible row index) rather than a page number, because the list is a virtualized scroll (ADR 0003, upcoming).

## Alternatives considered

| Option                                   | Why not                                                                             |
| ---------------------------------------- | ----------------------------------------------------------------------------------- |
| React state synced to the URL by effects | Two sources of truth; effect ordering bugs on back/forward; double renders.         |
| Global store (Zustand/Redux) + URL sync  | Same drift problem with more code, and no state here needs to live outside the URL. |
| Detail as a modal that isn't routed      | Not deep-linkable, and back doesn't close it.                                       |

## Consequences

- Any view is shareable by copying the URL. Back/forward work for free.
- Query keys are derived from the parsed URL, so a URL change _is_ a query change (and that's what makes the stale-response guarantees in R3 structural).
- Malformed or hostile URLs must be handled: unknown values are dropped and the URL is rewritten with `replace`.
