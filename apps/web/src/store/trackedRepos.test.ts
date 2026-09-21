import type { UnknownAction } from '@reduxjs/toolkit';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  buildAxiosError,
  buildRepoSummary,
  buildSnapshot,
  buildTrackedRepo,
  createFakeGitHubApi,
  createMemoryStorage,
} from '@/__tests__/_support/builders';
import { createAppError } from '@/api/apiError';
import type { ITrackedRepo } from '@/types/repo';

import { setupStore } from './index';
import trackedReposSlice, {
  createTrackedReposState,
  refreshAllRepos,
  refreshRepo,
  refreshStaleRepos,
  repoTracked,
  repoUntracked,
  selectLastRefreshedAt,
  selectRefreshingCount,
  selectRepoRequest,
  selectStarsChartData,
  selectTrackedRepoById,
} from './trackedRepos';

const REPO_A = buildTrackedRepo({ id: 1, name: 'alpha' });
const REPO_B = buildTrackedRepo({ id: 2, name: 'beta' });

const reduce = (repos: ITrackedRepo[], ...actions: UnknownAction[]) => ({
  trackedRepos: actions.reduce(
    trackedReposSlice.reducer,
    createTrackedReposState(repos),
  ),
});

const refreshed = (repo: ITrackedRepo, stars: number) => ({
  ...buildSnapshot(repo, { stars, lastCommitAt: '2026-09-18T09:00:00Z' }),
  refreshedAt: '2026-09-18T10:00:00.000Z',
});

describe('trackedRepos reducers', () => {
  it('tracks a search hit with the stats search already knew', () => {
    const hit = buildRepoSummary({ id: 9, stars: 4200, openIssues: 17 });
    const state = reduce([], repoTracked(hit));

    expect(selectTrackedRepoById(state, 9)).toMatchObject({
      fullName: hit.fullName,
      stats: { stars: 4200, openIssues: 17, lastCommitAt: null },
      refreshedAt: null,
    });
  });

  it('forgets an untracked repo together with its request state', () => {
    const state = reduce(
      [REPO_A],
      refreshRepo.pending('req-1', REPO_A.id),
      repoUntracked(REPO_A.id),
    );

    expect(selectTrackedRepoById(state, REPO_A.id)).toBeUndefined();
    expect(selectRepoRequest(state, REPO_A.id)).toBeUndefined();
  });

  it('refreshing one repo leaves the others untouched', () => {
    const state = reduce(
      [REPO_A, REPO_B],
      refreshRepo.pending('req-1', REPO_A.id),
    );

    expect(selectRepoRequest(state, REPO_A.id)?.status).toBe('loading');
    expect(selectRepoRequest(state, REPO_B.id)).toBeUndefined();
    expect(selectRefreshingCount(state)).toBe(1);
  });

  it('replaces the stats with what GitHub returned', () => {
    const state = reduce(
      [REPO_A],
      refreshRepo.pending('req-1', REPO_A.id),
      refreshRepo.fulfilled(refreshed(REPO_A, 999), 'req-1', REPO_A.id),
    );

    expect(selectTrackedRepoById(state, REPO_A.id)).toMatchObject({
      stats: { stars: 999, lastCommitAt: '2026-09-18T09:00:00Z' },
      refreshedAt: '2026-09-18T10:00:00.000Z',
    });
    expect(selectRepoRequest(state, REPO_A.id)?.status).toBe('succeeded');
  });

  it('keeps the last known stats when a refresh fails', () => {
    const error = createAppError('server', { status: 502 });
    const state = reduce(
      [REPO_A],
      refreshRepo.pending('req-1', REPO_A.id),
      refreshRepo.rejected(null, 'req-1', REPO_A.id, error),
    );

    expect(selectTrackedRepoById(state, REPO_A.id)?.stats).toEqual(
      REPO_A.stats,
    );
    expect(selectRepoRequest(state, REPO_A.id)).toEqual({
      status: 'failed',
      error,
    });
  });

  it('ignores an answer for a repo untracked while it was in flight', () => {
    const state = reduce(
      [REPO_A],
      refreshRepo.pending('req-1', REPO_A.id),
      repoUntracked(REPO_A.id),
      refreshRepo.fulfilled(refreshed(REPO_A, 999), 'req-1', REPO_A.id),
    );

    expect(state.trackedRepos.ids).toEqual([]);
    expect(selectRepoRequest(state, REPO_A.id)).toBeUndefined();
  });
});

describe('trackedRepos selectors', () => {
  it('plots stars most-starred first', () => {
    const state = reduce([
      buildTrackedRepo({
        id: 1,
        name: 'small',
        stats: { ...REPO_A.stats, stars: 10 },
      }),
      buildTrackedRepo({
        id: 2,
        name: 'big',
        stats: { ...REPO_A.stats, stars: 5000 },
      }),
    ]);

    expect(selectStarsChartData(state)).toEqual([
      { id: '2', label: 'octo/big', value: 5000, delta: 0 },
      { id: '1', label: 'octo/small', value: 10, delta: 0 },
    ]);
  });

  it("carries each repo's movement to the chart", () => {
    const state = reduce([
      buildTrackedRepo({
        id: 1,
        name: 'climber',
        stats: { ...REPO_A.stats, stars: 120 },
        history: [
          { at: 'anchor', stars: 100, openIssues: 5 },
          { at: 'later', stars: 110, openIssues: 5 },
        ],
      }),
    ]);

    // A compact axis reads "120" and "100" the same at a glance; the delta is
    // what makes the movement visible.
    expect(selectStarsChartData(state)[0]?.delta).toBe(20);
  });

  it('knows when the watchlist was last refreshed', () => {
    const state = reduce([
      { ...REPO_A, refreshedAt: '2026-09-18T08:00:00.000Z' },
      { ...REPO_B, refreshedAt: '2026-09-18T11:00:00.000Z' },
    ]);

    expect(selectLastRefreshedAt(state)).toBe('2026-09-18T11:00:00.000Z');
  });
});

describe('trackedRepos thunks', () => {
  const coreBudget = (remaining: number, resetAt: string) => ({
    core: { resource: 'core', limit: 60, remaining, resetAt },
    search: null,
  });

  const setup = (
    repos: ITrackedRepo[],
    rateLimit?: ReturnType<typeof coreBudget>,
  ) => {
    const githubApi = createFakeGitHubApi();
    const store = setupStore({
      preloadedState: {
        trackedRepos: createTrackedReposState(repos),
        ...(rateLimit ? { rateLimit } : {}),
      },
      extra: { githubApi },
      storage: createMemoryStorage().storage,
    });
    return { store, githubApi };
  };

  afterEach(() => {
    vi.useRealTimers();
  });

  it('refresh all settles every repo on its own — one failure stops nothing', async () => {
    const { store, githubApi } = setup([REPO_A, REPO_B]);
    githubApi.fetchRepoSnapshot.mockImplementation((fullName) =>
      fullName === REPO_A.fullName
        ? Promise.reject(buildAxiosError(502))
        : Promise.resolve(buildSnapshot(REPO_B, { stars: 777 })),
    );

    await store.dispatch(refreshAllRepos());
    const state = store.getState();

    expect(selectRepoRequest(state, REPO_A.id)).toMatchObject({
      status: 'failed',
      error: { kind: 'server' },
    });
    expect(selectRepoRequest(state, REPO_B.id)?.status).toBe('succeeded');
    expect(selectTrackedRepoById(state, REPO_B.id)?.stats.stars).toBe(777);
  });

  it('does not ask twice for a repo that is already refreshing', async () => {
    const { store, githubApi } = setup([REPO_A]);
    githubApi.fetchRepoSnapshot.mockResolvedValue(buildSnapshot(REPO_A));

    await Promise.all([
      store.dispatch(refreshRepo(REPO_A.id)),
      store.dispatch(refreshRepo(REPO_A.id)),
    ]);

    expect(githubApi.fetchRepoSnapshot).toHaveBeenCalledOnce();
  });

  it('refreshes only the repos whose stats have gone stale', async () => {
    vi.useFakeTimers({
      now: Date.parse('2026-09-18T12:00:00Z'),
      toFake: ['Date'],
    });
    const fresh = { ...REPO_A, refreshedAt: '2026-09-18T11:58:00.000Z' };
    const stale = { ...REPO_B, refreshedAt: '2026-09-18T10:00:00.000Z' };
    const never = buildTrackedRepo({ id: 3, name: 'gamma', refreshedAt: null });
    const { store, githubApi } = setup([fresh, stale, never]);
    githubApi.fetchRepoSnapshot.mockImplementation((fullName) =>
      Promise.resolve(
        buildSnapshot({ id: 0, name: fullName.split('/')[1] ?? '' }),
      ),
    );

    await store.dispatch(refreshStaleRepos());

    const asked = githubApi.fetchRepoSnapshot.mock.calls.map(([name]) => name);
    expect(asked.sort()).toEqual([never.fullName, stale.fullName].sort());
  });

  it('skips the opening refresh when GitHub has too little budget left', async () => {
    const stale = { ...REPO_A, refreshedAt: null };
    const alsoStale = { ...REPO_B, refreshedAt: null };
    // Two repos cost four requests; three are left.
    const { store, githubApi } = setup(
      [stale, alsoStale],
      coreBudget(3, new Date(Date.now() + 600_000).toISOString()),
    );

    await store.dispatch(refreshStaleRepos());

    expect(githubApi.fetchRepoSnapshot).not.toHaveBeenCalled();
  });

  it('refreshes once the window has reset, however spent it looked', async () => {
    const stale = { ...REPO_A, refreshedAt: null };
    // Nothing left, but the window closed — those counts no longer apply.
    const { store, githubApi } = setup(
      [stale],
      coreBudget(0, new Date(Date.now() - 60_000).toISOString()),
    );
    githubApi.fetchRepoSnapshot.mockResolvedValue(buildSnapshot(REPO_A));

    await store.dispatch(refreshStaleRepos());

    expect(githubApi.fetchRepoSnapshot).toHaveBeenCalledOnce();
  });
});
