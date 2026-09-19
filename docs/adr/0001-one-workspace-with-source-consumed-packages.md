# 0001 — One npm workspace, with packages consumed from source

- **Status:** Accepted
- **Date:** 2026-09-19
- **Scope:** Repository layout, `packages/*`, build and tooling

## Context

The brief welcomes a monorepo with a package for UI and a package for plots.
Two ways to wire such packages:

1. **Built libraries** — each package compiles to `dist/` with type
   declarations, and the app consumes the output.
2. **Source packages** — each package's `exports` points at `src/index.ts`, and
   the app's bundler compiles it like its own code.

A built design system at work taught the cost of option 1 when nothing is
published: 49 versions in eight and a half months, bumps made inside feature PRs, and a
design-system change landing apart from the app change that needed it.

## Decision

- **npm workspaces** — `apps/*` for deployables, `packages/*` for libraries.
  npm because it is already the team's tool; no extra package manager or task
  runner until the task graph needs one.
- **Source packages.** `@repo-radar/ui` and `@repo-radar/charts` export
  TypeScript source. Vite, Vitest and `tsc` compile them in the consumer.
- **Peer dependencies** for React, MUI and Emotion in both packages, so exactly
  one copy of each exists — two copies of MUI or Emotion silently break theming.
- **Dependency direction** is one way: `web → charts → ui`. Packages hold no
  product logic.
- **Shared config at the root:** one `tsconfig.base.json`, one ESLint flat
  config, one Prettier config, one Vitest config running every workspace as a
  project.

## Consequences

**Good**

- No build step, no `dist/` to go stale, instant HMR across packages.
- A design-system change and the app change it serves ship in one commit.
- One type-check and one test run cover everything.

**Bad, and accepted**

- The packages can't be published as they are. If that day comes, add a
  library build (e.g. tsup) and point `exports` at its output.
- Packages must use relative imports internally: the app's `@/` alias would
  otherwise capture them.
