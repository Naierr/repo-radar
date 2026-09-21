import { screen, waitFor, within } from '@testing-library/react';
import { beforeAll, describe, expect, it } from 'vitest';

import { ROUTES } from '@/constants/routes';
import { createTrackedReposState } from '@/store/trackedRepos';
import type { IRateLimit } from '@/api/rateLimit';
import type { ITrackedRepo } from '@/types/repo';

import {
  buildAxiosError,
  buildSnapshot,
  buildTrackedRepo,
  createFakeGitHubApi,
} from '../_support/builders';
import { preloadLazyRoutes, renderApp } from '../_support/renderApp';

// Refreshed just now, so opening the dashboard doesn't refresh them by itself.
const freshRepo = (id: number, name: string): ITrackedRepo =>
  buildTrackedRepo({ id, name, refreshedAt: new Date().toISOString() });

const rowOf = (fullName: string): HTMLElement => {
  const row = screen
    .getByRole('button', { name: `Refresh ${fullName}` })
    .closest('li');
  if (!row) throw new Error(`No row for ${fullName}`);
  return row;
};

const renderDashboard = (
  repos: ITrackedRepo[],
  rateLimit?: { core: IRateLimit | null; search: IRateLimit | null },
) => {
  const githubApi = createFakeGitHubApi();
  const rendered = renderApp({
    route: ROUTES.TRACKED,
    githubApi,
    preloadedState: {
      trackedRepos: createTrackedReposState(repos),
      ...(rateLimit ? { rateLimit } : {}),
    },
  });
  return { ...rendered, githubApi };
};

describe('tracked dashboard', () => {
  beforeAll(preloadLazyRoutes);

  it('refreshes every repo on its own — a failure stays on its row', async () => {
    const alpha = freshRepo(1, 'alpha');
    const beta = freshRepo(2, 'beta');
    const { user, githubApi } = renderDashboard([alpha, beta]);
    githubApi.fetchRepoSnapshot.mockImplementation((fullName) =>
      fullName === alpha.fullName
        ? Promise.reject(buildAxiosError(502))
        : Promise.resolve(buildSnapshot(beta, { stars: 4321 })),
    );

    await user.click(
      await screen.findByRole('button', { name: /refresh all/i }),
    );

    await waitFor(() => {
      expect(
        within(rowOf(alpha.fullName)).getByRole('alert'),
      ).toBeInTheDocument();
    });
    expect(
      within(rowOf(alpha.fullName)).getByRole('button', { name: /try again/i }),
    ).toBeInTheDocument();
    expect(
      within(rowOf(beta.fullName)).queryByRole('alert'),
    ).not.toBeInTheDocument();
    expect(within(rowOf(beta.fullName)).getByText('4.3k')).toBeInTheDocument();
  });

  it('asks before untracking, and still lets the user undo it', async () => {
    const alpha = freshRepo(1, 'alpha');
    const { user } = renderDashboard([alpha, freshRepo(2, 'beta')]);

    await user.click(
      await screen.findByRole('button', {
        name: `Stop tracking ${alpha.fullName}`,
      }),
    );

    // Asking is not doing: the row is still there until it is confirmed.
    // `hidden` because the open dialog takes the page out of the a11y tree.
    expect(
      screen.getByRole('button', {
        name: `Refresh ${alpha.fullName}`,
        hidden: true,
      }),
    ).toBeInTheDocument();

    await user.click(
      within(
        screen.getByRole('dialog', {
          name: `Stop tracking ${alpha.fullName}?`,
        }),
      ).getByRole('button', { name: 'Stop tracking' }),
    );

    expect(
      screen.queryByRole('button', { name: `Refresh ${alpha.fullName}` }),
    ).not.toBeInTheDocument();

    // The dialog's closing transition still owns the a11y tree for a tick.
    await user.click(await screen.findByRole('button', { name: /undo/i }));

    expect(
      await screen.findByRole('button', { name: `Refresh ${alpha.fullName}` }),
    ).toBeInTheDocument();
  });

  it('refuses a refresh it cannot afford, and says what it would cost', async () => {
    // Two repos cost four requests; three are left in an open window.
    const { githubApi } = renderDashboard(
      [freshRepo(1, 'alpha'), freshRepo(2, 'beta')],
      {
        core: {
          resource: 'core',
          limit: 60,
          remaining: 3,
          resetAt: new Date(Date.now() + 600_000).toISOString(),
        },
        search: null,
      },
    );

    const refreshAll = await screen.findByRole('button', {
      name: /refresh all/i,
    });

    expect(refreshAll).toBeDisabled();
    expect(screen.getByText(/needs 4 requests; 3 left/i)).toBeInTheDocument();
    // And it never quietly spent what was left on opening the page.
    expect(githubApi.fetchRepoSnapshot).not.toHaveBeenCalled();
  });

  it('shows how far the stars have moved since watching began', async () => {
    const climber = buildTrackedRepo({
      id: 9,
      name: 'climber',
      refreshedAt: new Date().toISOString(),
      stats: { stars: 266_826, openIssues: 12, lastCommitAt: null },
      history: [
        { at: '2026-09-01T00:00:00.000Z', stars: 266_819, openIssues: 12 },
      ],
    });
    renderDashboard([climber]);

    // "266.8k" reads the same before and after, so the delta is the only
    // thing that makes seven new stars visible.
    const row = await screen.findByRole('button', {
      name: `Refresh ${climber.fullName}`,
    });
    const container = row.closest('li');
    expect(container).not.toBeNull();
    expect(within(container!).getByText('266.8k')).toBeInTheDocument();
    expect(within(container!).getByText('7')).toBeInTheDocument();
  });

  it('reorders the list without touching the chart ranking', async () => {
    const small = buildTrackedRepo({
      id: 1,
      name: 'small',
      refreshedAt: new Date().toISOString(),
      stats: { stars: 10, openIssues: 1, lastCommitAt: null },
    });
    const big = buildTrackedRepo({
      id: 2,
      name: 'big',
      refreshedAt: new Date().toISOString(),
      stats: { stars: 9000, openIssues: 1, lastCommitAt: null },
    });
    // Tracked most-recently-first, so `small` leads until sorted by stars.
    const { user } = renderDashboard([small, big]);

    const namesInOrder = () =>
      screen
        .getAllByRole('button', { name: /^Refresh octo\// })
        .map((button) => button.getAttribute('aria-label'));

    await screen.findByRole('button', { name: `Refresh ${big.fullName}` });
    expect(namesInOrder()[0]).toBe(`Refresh ${small.fullName}`);

    await user.click(screen.getByRole('button', { name: 'Most stars' }));

    expect(namesInOrder()[0]).toBe(`Refresh ${big.fullName}`);
    expect(screen.getByRole('button', { name: 'Most stars' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('untracks a whole selection at once, and undoes it at once', async () => {
    const alpha = freshRepo(1, 'alpha');
    const beta = freshRepo(2, 'beta');
    const { user } = renderDashboard([alpha, beta]);

    // Nothing about selecting shows until a row is ticked; "Select all" then
    // appears in the header rather than sitting there permanently.
    await user.click(
      await screen.findByRole('checkbox', { name: `Select ${alpha.fullName}` }),
    );
    await user.click(screen.getByRole('button', { name: 'Select all' }));
    expect(screen.getByText('2 selected')).toBeInTheDocument();
    // No separate bulk button: a selected row's own trash speaks for the
    // whole selection, and asks once rather than once per repository.
    await user.click(
      screen.getByRole('button', {
        name: `Stop tracking ${alpha.fullName} and 1 other selected repository`,
      }),
    );

    const dialog = await screen.findByRole('dialog', {
      name: /stop tracking 2 repositories/i,
    });
    await user.click(
      within(dialog).getByRole('button', { name: 'Stop tracking' }),
    );

    expect(await screen.findByText('Your radar is empty')).toBeInTheDocument();

    await user.click(await screen.findByRole('button', { name: /undo/i }));

    expect(
      await screen.findByRole('button', { name: `Refresh ${alpha.fullName}` }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: `Refresh ${beta.fullName}` }),
    ).toBeInTheDocument();
  });

  it('leaves an unselected row acting only for itself', async () => {
    const alpha = freshRepo(1, 'alpha');
    const beta = freshRepo(2, 'beta');
    const { user } = renderDashboard([alpha, beta]);

    await user.click(
      await screen.findByRole('checkbox', { name: `Select ${alpha.fullName}` }),
    );

    // Beta is not in the selection, so its button is still about beta.
    await user.click(
      screen.getByRole('button', { name: `Stop tracking ${beta.fullName}` }),
    );
    await user.click(
      within(
        await screen.findByRole('dialog', {
          name: `Stop tracking ${beta.fullName}?`,
        }),
      ).getByRole('button', { name: 'Stop tracking' }),
    );

    expect(
      screen.queryByRole('button', { name: `Refresh ${beta.fullName}` }),
    ).not.toBeInTheDocument();
    expect(
      await screen.findByRole('button', { name: `Refresh ${alpha.fullName}` }),
    ).toBeInTheDocument();
  });

  it('sends an empty dashboard to search', async () => {
    const { user } = renderDashboard([]);

    await user.click(
      await screen.findByRole('link', { name: /find repositories/i }),
    );

    expect(
      screen.getByRole('searchbox', { name: 'Search GitHub repositories' }),
    ).toBeInTheDocument();
  });
});
