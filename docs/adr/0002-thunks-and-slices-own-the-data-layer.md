# 0002 — Thunks and slices own the data layer, not RTK Query

- **Status:** Accepted
- **Date:** 2026-09-19
- **Scope:** `apps/web/src/store`, `apps/web/src/api`

## Context

Redux Toolkit offers two ways to fetch: RTK Query (a server-cache with hooks)
and `createAsyncThunk` with hand-shaped slices. The requirements lean on things
a cache doesn't model:

- Tracked repos are the **user's** data. They persist, and each carries its
  last-known stats, so the dashboard paints instantly and a failed refresh
  still has something true to show.
- Every repo needs its **own** loading and error state, readable by the row,
  the "Refresh all" button (how many are in flight) and the chart.
- Refreshing must be **frugal** — anonymous access allows 60 requests an hour —
  so refreshes are de-duplicated and the dashboard only refreshes stale repos.

## Decision

- `trackedRepos` is an entity adapter keyed by GitHub's numeric id (stable
  across renames), plus `requests: Record<id, { status, error }>`, which is
  never persisted.
- `refreshRepo(id)` is a typed thunk. Its `condition` skips repos that are gone
  or already loading; it writes only `requests[id]` and that repo's entity.
- `refreshAllRepos` dispatches one `refreshRepo` per repo and awaits them all;
  each settles with its own action, so failures stay independent.
- `search` keeps the latest query's page and a `requestId`; results from any
  older request are dropped (latest wins), and superseded requests are aborted.
- Errors cross the thunk boundary as a serializable `IAppError` via
  `rejectWithValue(normalizeApiError(error))`.
- The GitHub API reaches thunks as the thunk `extraArgument`, the one seam
  tests swap.
- Side effects — fetching a newly tracked repo, writing storage — live in
  listener middleware.

## Consequences

**Good**

- Every async rule is explicit in code and tested at the reducer or store level.
- The state shape is exactly what the UI reads; each row selects its own entity
  and request, so loading and errors never leak between rows.
- Last-known stats survive reloads and failures.

**Bad, and accepted**

- More code than RTK Query for the same fetch: status fields, `condition`,
  latest-wins guards.
- While a repo refreshes only its row re-renders, but when the refresh lands
  the page's "updated …" line re-renders the list. Rows aren't memoised: the
  list is small and nothing measured says it's needed.
- No automatic cache for search results beyond the current query.
- Reconsider RTK Query once there are many read-only endpoints with the same
  loading/error boilerplate.
