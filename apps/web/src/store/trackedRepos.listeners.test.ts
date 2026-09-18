import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  buildAxiosError,
  buildRepoSummary,
  buildSnapshot,
  buildTrackedRepo,
  createFakeGitHubApi,
  createMemoryStorage,
} from '@/__tests__/_support/builders';
import {
  PERSIST_DEBOUNCE_MS,
  TRACKED_REPOS_STORAGE_KEY,
} from '@/constants/trackedRepos';

import { setupStore } from './index';
import {
  createTrackedReposState,
  refreshRepo,
  repoTracked,
  selectTrackedRepoById,
} from './trackedRepos';

const setup = () => {
  const githubApi = createFakeGitHubApi();
  const { storage, setItem } = createMemoryStorage();
  const store = setupStore({ extra: { githubApi }, storage });
  return { store, githubApi, storage, setItem };
};

const savedRepoNames = (storage: Storage): string[] => {
  const saved = JSON.parse(
    storage.getItem(TRACKED_REPOS_STORAGE_KEY) ?? '{}',
  ) as {
    repos?: { fullName: string }[];
  };
  return (saved.repos ?? []).map((repo) => repo.fullName);
};

describe('tracked repos listeners', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('fetches the full stats of a repo as soon as it is tracked', async () => {
    const { store, githubApi } = setup();
    const hit = buildRepoSummary({ id: 5, name: 'radar' });
    githubApi.fetchRepoSnapshot.mockResolvedValue(
      buildSnapshot(hit, { lastCommitAt: '2026-09-17T08:00:00Z' }),
    );

    store.dispatch(repoTracked(hit));

    await vi.waitFor(() => {
      expect(
        selectTrackedRepoById(store.getState(), 5)?.stats.lastCommitAt,
      ).toBe('2026-09-17T08:00:00Z');
    });
    expect(githubApi.fetchRepoSnapshot).toHaveBeenCalledWith(
      hit.fullName,
      expect.anything(),
    );
  });

  it('writes a burst of changes to storage once', async () => {
    vi.useFakeTimers();
    const { store, githubApi, storage, setItem } = setup();
    githubApi.fetchRepoSnapshot.mockReturnValue(new Promise(() => undefined));

    store.dispatch(repoTracked(buildRepoSummary({ id: 1, name: 'alpha' })));
    store.dispatch(repoTracked(buildRepoSummary({ id: 2, name: 'beta' })));
    await vi.advanceTimersByTimeAsync(PERSIST_DEBOUNCE_MS);

    expect(setItem).toHaveBeenCalledOnce();
    expect(savedRepoNames(storage).sort()).toEqual(['octo/alpha', 'octo/beta']);
  });

  it('does not rewrite storage when only request state changes', async () => {
    vi.useFakeTimers();
    const githubApi = createFakeGitHubApi();
    const { storage, setItem } = createMemoryStorage();
    const repo = buildTrackedRepo({ id: 1 });
    const store = setupStore({
      preloadedState: { trackedRepos: createTrackedReposState([repo]) },
      extra: { githubApi },
      storage,
    });
    githubApi.fetchRepoSnapshot.mockRejectedValue(buildAxiosError(502));

    await store.dispatch(refreshRepo(repo.id));
    await vi.advanceTimersByTimeAsync(PERSIST_DEBOUNCE_MS);

    expect(setItem).not.toHaveBeenCalled();
  });
});
