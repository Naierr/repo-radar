# @repo-radar/ui

Repo Radar's design system: tokens, a CSS-variables MUI theme with light, dark
and system modes, and the components the app is built from. It is the only
place the app reaches MUI through.

```tsx
import { Panel, ThemeProvider } from '@repo-radar/ui';

<ThemeProvider>
  <Panel title="Stars per repository">…</Panel>
</ThemeProvider>;
```

## What's inside

- **Tokens** (`src/tokens`) — raw ramps (25 → 900) and semantic roles per
  scheme: `canvas`, `fg`, `border`, `accent`, tones, `tooltip`, `starfield`.
- **Theme** (`src/theme`) — `createTheme` with `cssVariables` and
  `colorSchemes`, component overrides grouped by concern in `overrides/`.
- **Colour modes** — `ThemeProvider` (mounts theme, fonts and baseline once),
  `useColorMode()` and `ColorModeMenu` (light / dark / system, remembered).
- **Components** — `Panel`, `EmptyState`, `ErrorNotice`, `Metric`,
  `RelativeTime`, `SearchField` (with a `/` shortcut), `LanguageDot`,
  `CounterLabel`, `BrandMark`, `GradientText`, `Starfield`, `VisuallyHidden`.
- **MUI primitives** — re-exported as they are; the theme styles them.
- **Testing** — `@repo-radar/ui/testing` exposes `renderWithTheme` and the DOM
  stubs jsdom needs for MUI.

## Rules

- Components read colours from `theme.vars.palette.*`, never raw hex.
- Every semantic role must exist in both schemes and pass WCAG AA on its
  surfaces — `src/theme/theme.test.ts` checks it.
- The public surface is pinned in `src/index.test.ts`; changing it is a
  deliberate diff.
