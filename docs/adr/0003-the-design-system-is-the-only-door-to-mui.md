# 0003 — The design system is the only door to MUI

- **Status:** Accepted
- **Date:** 2026-09-19
- **Scope:** `packages/ui`, `apps/web` styling

## Context

MUI is required. Left unmanaged, a codebase grows several styling systems at
once — theme overrides, page-level CSS reaching into `.Mui*` classes,
`!important`, hard-coded colours — and dark mode is the first casualty. The
goal: styling decisions are made once, and both colour schemes stay correct
without per-page effort.

## Decision

- **One token source.** Raw ramps (`palette.ts`, 25 → 900) feed semantic roles
  per scheme (`semantic.ts`: canvas, fg, border, accent, tones, starfield).
  Nothing outside `tokens/` reads a raw ramp for UI colour.
- **CSS-variables theme.** `createTheme({ cssVariables, colorSchemes })` with a
  `data-color-scheme` attribute on `<html>`. Overrides read `theme.vars`, so a
  mode switch flips variables instead of re-rendering the tree.
- **Light / dark / system** through MUI's `useColorScheme`, which persists the
  choice. The theme is not in Redux. `index.html` sets the attribute before
  first paint, and a test keeps it in sync with the package.
- **One door.** The app imports UI only from `@repo-radar/ui`. ESLint rejects
  `@mui/*` and `@emotion/*` imports in `apps/web`.
- **Re-export, don't wrap, primitives.** MUI components the app needs are
  re-exported as they are: the theme already decides their look, and wrapping
  would only add indirection. The package adds components where the product has
  a pattern (Panel, Metric, EmptyState, SearchField, …).
- **Contracts in tests.** Every semantic role exists in both schemes, every text
  role meets WCAG AA on its surfaces, and the package's public surface is pinned.

## Consequences

**Good**

- Dark mode is a property of the tokens, not of each page.
- Swapping or upgrading MUI touches one package.
- A contrast regression fails a test, not a user.

**Bad, and accepted**

- A new MUI component needs a one-line re-export before the app can use it.
- MUI's CSS-in-JS runtime (Emotion) stays in the bundle; split into a
  long-lived vendor chunk.
