import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { IRateLimit } from '@/api/rateLimit';

import { renderApp } from '../_support/renderApp';

const MINUTE_MS = 60_000;

const budget = (overrides: Partial<IRateLimit> = {}): IRateLimit => ({
  resource: 'core',
  limit: 60,
  remaining: 60,
  resetAt: new Date(Date.now() + 10 * MINUTE_MS).toISOString(),
  ...overrides,
});

const renderWithBudgets = (rateLimit: {
  core: IRateLimit | null;
  search: IRateLimit | null;
}) => renderApp({ preloadedState: { rateLimit } });

describe('rate limit notice', () => {
  it('says nothing while there is plenty of budget', () => {
    renderWithBudgets({ core: budget({ remaining: 54 }), search: null });

    expect(screen.queryByText(/left/)).not.toBeInTheDocument();
  });

  it('says nothing once the window has passed, however spent it looked', () => {
    // The budget refilled at `resetAt`, so these counts describe a window that
    // is over — reporting them would name a reset that already happened.
    renderWithBudgets({
      core: budget({
        remaining: 0,
        resetAt: new Date(Date.now() - MINUTE_MS).toISOString(),
      }),
      search: null,
    });

    expect(screen.queryByText(/left/)).not.toBeInTheDocument();
  });

  it('warns in plain language once the budget runs low', () => {
    renderWithBudgets({ core: budget({ remaining: 6 }), search: null });

    expect(screen.getByText('6 GitHub requests left')).toBeInTheDocument();
  });

  it('says when a spent budget comes back', () => {
    renderWithBudgets({ core: budget({ remaining: 0 }), search: null });

    expect(
      screen.getByText(/No GitHub requests left .* resets in 10 minutes/),
    ).toBeInTheDocument();
  });

  it('warns about the tighter of the two budgets, in the singular', () => {
    renderWithBudgets({
      core: budget({ remaining: 30 }),
      search: budget({ resource: 'search', limit: 10, remaining: 1 }),
    });

    expect(screen.getByText('1 search left')).toBeInTheDocument();
  });
});
