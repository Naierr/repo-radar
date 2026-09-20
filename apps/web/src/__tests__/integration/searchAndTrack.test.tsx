import { screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  buildAxiosError,
  buildRepoSummary,
  buildSnapshot,
  createFakeGitHubApi,
} from '../_support/builders';
import { renderApp } from '../_support/renderApp';

const SEARCH_FIELD = { name: 'Search GitHub repositories' };

describe('searching and tracking', () => {
  it('searches once typing pauses, and a tracked hit lands on the dashboard', async () => {
    const githubApi = createFakeGitHubApi();
    const hit = buildRepoSummary({ id: 42, name: 'radar', stars: 4321 });
    githubApi.searchRepositories.mockResolvedValue({
      totalCount: 1,
      items: [hit],
    });
    githubApi.fetchRepoSnapshot.mockResolvedValue(
      buildSnapshot(hit, { stars: 4321, lastCommitAt: '2026-09-17T08:00:00Z' }),
    );
    const { user } = renderApp({ githubApi });

    await user.type(screen.getByRole('searchbox', SEARCH_FIELD), 'radar');
    const track = await screen.findByRole('button', {
      name: 'Track octo/radar',
    });

    expect(githubApi.searchRepositories).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ query: 'radar', page: 1 }),
      expect.anything(),
    );

    await user.click(track);
    expect(track).toHaveAttribute('aria-pressed', 'true');

    await user.click(screen.getByRole('link', { name: /tracked/i }));
    const chart = await screen.findByRole('table', {
      name: 'Stars per tracked repository',
    });

    expect(
      within(chart).getByRole('rowheader', { name: 'octo/radar' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Refresh octo/radar' }),
    ).toBeInTheDocument();
  });

  it('replaces the previous page with skeletons while the next one loads', async () => {
    const githubApi = createFakeGitHubApi();
    const alpha = buildRepoSummary({ id: 1, name: 'alpha' });
    const beta = buildRepoSummary({ id: 2, name: 'beta' });
    // Page two stays pending so the loading state can be observed.
    let releasePageTwo!: () => void;
    githubApi.searchRepositories.mockImplementation(({ page }) =>
      page === 1
        ? Promise.resolve({ totalCount: 40, items: [alpha] })
        : new Promise((resolve) => {
            releasePageTwo = () => {
              resolve({ totalCount: 40, items: [beta] });
            };
          }),
    );
    const { user } = renderApp({ githubApi });

    await user.type(screen.getByRole('searchbox', SEARCH_FIELD), 'radar');
    expect(
      await screen.findByRole('button', { name: 'Track octo/alpha' }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Go to page 2' }));

    // Page one must not sit there looking like the answer to page two.
    expect(
      screen.queryByRole('button', { name: 'Track octo/alpha' }),
    ).not.toBeInTheDocument();
    expect(screen.getByText('Searching…')).toBeInTheDocument();

    releasePageTwo();
    expect(
      await screen.findByRole('button', { name: 'Track octo/beta' }),
    ).toBeInTheDocument();
  });

  it('cancels the search that a newer query replaces', async () => {
    const githubApi = createFakeGitHubApi();
    const signals: AbortSignal[] = [];
    githubApi.searchRepositories.mockImplementation((_params, options) => {
      if (options?.signal) signals.push(options.signal);
      return new Promise(() => undefined);
    });
    const { user } = renderApp({ githubApi });
    const field = screen.getByRole('searchbox', SEARCH_FIELD);

    await user.type(field, 'redux');
    await waitFor(() => {
      expect(signals).toHaveLength(1);
    });
    await user.type(field, ' toolkit');
    await waitFor(() => {
      expect(signals).toHaveLength(2);
    });

    expect(signals[0]?.aborted).toBe(true);
    expect(signals[1]?.aborted).toBe(false);
  });

  it('explains a spent rate limit and offers to try again', async () => {
    const githubApi = createFakeGitHubApi();
    const resetInTenMinutes = Math.floor(Date.now() / 1000) + 600;
    githubApi.searchRepositories.mockRejectedValue(
      buildAxiosError(403, {
        'x-ratelimit-remaining': '0',
        'x-ratelimit-reset': String(resetInTenMinutes),
      }),
    );
    const { user } = renderApp({ githubApi });

    await user.type(screen.getByRole('searchbox', SEARCH_FIELD), 'radar');
    const alert = await screen.findByRole('alert');

    expect(
      within(alert).getByRole('button', { name: /try again/i }),
    ).toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });
});
