# 0005 — GitHub sign-in is designed, not built

- **Status:** Accepted (deliberately deferred)
- **Date:** 2026-09-21
- **Scope:** `apps/web/src/api`, `apps/web/src/store`

## Context

Anonymous callers get **60 GitHub requests an hour**, shared by everyone behind
the same IP. A refresh costs two requests per repository — the repository, then
its latest commit — so a radar of seventeen spends thirty-four of them in one
click. That ceiling is the single biggest constraint on the product.

A signed-in caller gets **5,000 an hour**: roughly eighty times the headroom.
Sign-in would also unlock things the app cannot otherwise do — importing the
repositories you already starred, and starring or unstarring from here, so the
radar and your GitHub account agree instead of drifting apart.

So the value is real. It was still not built, on purpose.

## Decision

Ship the app anonymous, persisting the radar in `localStorage`, and treat
sign-in as a documented design rather than a feature.

### Why not build it

1. **The brief asks for `localStorage` persistence.** Accounts would move the
   user's data somewhere else. That is not exceeding the requirement, it is
   sidestepping it.
2. **A browser-only SPA cannot hold an OAuth secret.** The code-for-token
   exchange needs a client secret, and everything in the bundle is public.
   GitHub's token endpoint also refuses browser origins, so even the device
   flow needs a server. Done properly, sign-in stops being a frontend feature.
3. **The cheap version is the insecure one.** Asking the user to paste a
   personal access token works with no backend, but it parks a credential in
   `localStorage`, where any injected script can read it. Shipping that quietly
   would be worse than not shipping it.

The honest summary: the part that is safe needs a backend, and the part that
needs no backend is not safe. Neither belongs in a frontend take-home.

### How it would be built

**With a backend — the version worth shipping.** One serverless function on the
platform already hosting the app:

```
browser  → GET  /api/auth/start          → redirect to GitHub's authorize page
GitHub   → GET  /api/auth/callback?code  → function swaps code + secret for a token
function → sets an HttpOnly, Secure, SameSite cookie; token never enters the page
browser  → GET  /api/github/*            → function attaches the token, proxies on
```

The secret and the token live only on the server. The page holds a session
cookie it cannot read, which is the point: an injected script cannot steal what
JavaScript cannot see. The app's API client changes by one line — its base URL —
because the data layer already talks to an injected `githubApi`.

**Without a backend — the version to describe, not deploy.** A "connect a
token" field: the user pastes a fine-grained token with no scopes, it is kept
in `localStorage`, and the API client sends it as `Authorization: Bearer …`.
Sixty requests an hour become five thousand. It is honest about what it is,
easy to revoke, and still XSS-exposed — which is exactly why the first version
exists.

### What sign-in would then unlock

- `GET /user/starred` — offer to import what you already starred.
- `PUT` / `DELETE /user/starred/{owner}/{repo}` — star from the radar, so
  tracking and starring stop being two separate ideas.
- `GET /rate_limit` — show real headroom instead of inferring it from headers.

## Consequences

- The rate limit stays the product's binding constraint, so the app is built
  around frugality: refreshes are de-duplicated, only stale repositories are
  refreshed on open, and a refresh that cannot be afforded is refused with its
  cost shown rather than attempted (ADR 0002, `useRefreshBudget`).
- The data layer is already shaped for the change. `githubApi` is injected as
  the thunk `extraArgument`, so adding credentials means changing one adapter,
  not the store.
- Nothing in the app assumes an anonymous user. Identity would be additive.
- If this ever ships, it ships with the backend. The token-in-`localStorage`
  variant is documented here so the trade-off is on the record, not so it gets
  built.
