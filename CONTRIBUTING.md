# Contributing

Conventions the codebase follows. Lint enforces what it can; review covers
the rest. When in doubt, match the file next to the one you are editing.

## Code

1. **No `any`.** Narrow `unknown` at the edges (API responses, storage).
2. **Interfaces are `I`-prefixed** (`ITrackedRepo`, `IPanelProps`). Type aliases
   are PascalCase. Fixed value sets are `as const` objects with a derived union
   (`REQUEST_STATUS` → `RequestStatus`), not TypeScript enums.
3. **Components** live in `PascalName/` with `index.tsx` (default export),
   `types.ts` for props, `styles.ts` for `styled` parts and a sibling
   `Name.test.tsx`. Props types never live in the `.tsx` file.
4. **`??` over `||`**, `import type` for types, `@/` imports in the app,
   relative imports inside packages.
5. **No magic values.** Numbers and strings with meaning become named constants
   in `constants/` (or at the top of the file when only it uses them).
6. **No `console.*`**, no empty `catch {}` without a comment saying why.
7. **No `useMemo`/`useCallback` by default** — only for a measured reason or a
   stable effect dependency, and say which.
8. **Files stay under ~300 lines.** Split by responsibility before that.
9. **Comments explain why**, never what.

## State and data

10. Server calls go through `src/api/` only: one axios client, named adapter
    functions, GitHub DTOs mapped to domain models there.
11. Thunks are `createAppAsyncThunk` and reject with
    `rejectWithValue(normalizeApiError(error))` — errors in the store are always
    `IAppError`.
12. Per-item async state lives next to the items (`requests[id]`), never in one
    shared flag.
13. Side effects live in thunks and listener middleware — never in reducers or
    render.
14. Local UI state (an input's text, an open menu) stays in `useState`.
15. Selectors are typed on their slice's root (`ITrackedReposRoot`), and derived
    data is a memoised `createSelector`.

## Styling

16. The app imports UI only from `@repo-radar/ui` / `@repo-radar/charts` (lint
    enforced). A new MUI primitive is re-exported from `packages/ui` first.
17. Colours come from theme roles (`theme.vars.palette.*`) — no hex values or raw
    ramps outside `packages/ui/src/tokens`.
18. Style through `styled` in `styles.ts`; state is styled from ARIA or data
    attributes (`&[aria-pressed="true"]`), not extra props.
19. No `!important`, no `.Mui*` selectors outside the theme overrides.

## Tests

20. Test behaviour through roles and accessible names; never class names or copy
    for its own sake.
21. Every test file covers at least one failure or edge case.
22. Test at the lowest tier that catches the regression: reducer, then store,
    then the integration suite in `src/__tests__/integration`.
23. Mock at the boundary: the injected GitHub API or the axios client.

## Git

24. Conventional Commits: `type(scope): outcome in lowercase`, with scopes such
    as `ui`, `charts`, `web`, `store`, `api`, `repo`. Bodies explain why and end
    with what was verified.
25. Branches: `feat/…`, `fix/…`, `refactor/…`, `chore/…`, `docs/…` into `main`.
26. `npm run check` passes before a PR — CI runs the same.
