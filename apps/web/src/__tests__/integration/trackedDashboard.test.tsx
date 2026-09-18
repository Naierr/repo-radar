import { screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ROUTES } from '@/constants/routes';
import { createTrackedReposState } from '@/store/trackedRepos';
import type { ITrackedRepo } from '@/types/repo';

import {
  buildAxiosError,
  buildSnapshot,
  buildTrackedRepo,
  createFakeGitHubApi,
} from '../_support/builders';
import { renderApp } from '../_support/renderApp';

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

const renderDashboard = (repos: ITrackedRepo[]) => {
  const githubApi = createFakeGitHubApi();
  const rendered = renderApp({
    route: ROUTES.TRACKED,
    githubApi,
    preloadedState: { trackedRepos: createTrackedReposState(repos) },
  });
  return { ...rendered, githubApi };
};

describe('tracked dashboard', () => {
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

  it('lets the user undo untracking a repo', async () => {
    const alpha = freshRepo(1, 'alpha');
    const { user } = renderDashboard([alpha, freshRepo(2, 'beta')]);

    await user.click(
      await screen.findByRole('button', {
        name: `Stop tracking ${alpha.fullName}`,
      }),
    );

    expect(
      screen.queryByRole('button', { name: `Refresh ${alpha.fullName}` }),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /undo/i }));

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
