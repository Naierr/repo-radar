# 0004 — Tracked repos persist as a versioned, validated snapshot

- **Status:** Accepted
- **Date:** 2026-09-19
- **Scope:** `apps/web/src/domain/trackedReposStorage.ts`, store listeners

## Context

Tracked repos must survive reloads through `localStorage`. What is read back is
untrusted: an older schema, a hand edit, another app on the same origin, or a
browser that blocks storage entirely.

## Decision

- Store `{ version: 1, repos: ITrackedRepo[] }` under `repo-radar:tracked-repos`
  — identity, stats snapshot and timestamps. Request state is never stored.
- Read once at startup into `preloadedState`. A different `version`, corrupt
  JSON or blocked storage gives an empty list; each repo is validated by a type
  guard and a bad entry is dropped on its own.
- Write from listener middleware whenever the repo entities change (request
  state changes don't count), debounced so a "Refresh all" burst writes once.
- Storage access never throws into the app: `readJson`/`writeJson` report
  "nothing stored" or "not saved" instead.

## Consequences

**Good**

- A bad entry costs one repo, not the watchlist.
- The dashboard paints last-known stats immediately and refreshes only what is
  stale.
- Reducers stay pure; storage is one listener.

**Bad, and accepted**

- A schema change needs a migration (or a version bump that starts empty).
- Two open tabs don't sync yet; a `storage` event listener would add that.
