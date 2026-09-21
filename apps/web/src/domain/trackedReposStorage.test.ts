import { describe, expect, it } from 'vitest';

import {
  buildTrackedRepo,
  createMemoryStorage,
} from '@/__tests__/_support/builders';
import {
  TRACKED_REPOS_SCHEMA_VERSION,
  TRACKED_REPOS_STORAGE_KEY,
} from '@/constants/trackedRepos';

import { loadTrackedRepos, saveTrackedRepos } from './trackedReposStorage';

const store = (value: string) => {
  const { storage } = createMemoryStorage();
  storage.setItem(TRACKED_REPOS_STORAGE_KEY, value);
  return storage;
};

describe('tracked repos storage', () => {
  it('reads back exactly what it saved', () => {
    const { storage } = createMemoryStorage();
    const repos = [buildTrackedRepo({ id: 1 }), buildTrackedRepo({ id: 2 })];

    saveTrackedRepos(storage, repos);

    expect(loadTrackedRepos(storage)).toEqual(repos);
  });

  it('starts empty when nothing was saved', () => {
    expect(loadTrackedRepos(createMemoryStorage().storage)).toEqual([]);
  });

  it('starts empty instead of crashing on corrupt JSON', () => {
    expect(loadTrackedRepos(store('{not json'))).toEqual([]);
  });

  it('ignores data written by another schema version', () => {
    const stored = JSON.stringify({ version: 99, repos: [buildTrackedRepo()] });

    expect(loadTrackedRepos(store(stored))).toEqual([]);
  });

  it('upgrades version 1 rather than throwing the watchlist away', () => {
    // Version 1 had no history. The repos are the user's own list, so they are
    // carried forward and anchored to the reading they already held.
    const { history, ...v1Repo } = buildTrackedRepo({
      id: 7,
      refreshedAt: '2026-09-17T00:00:00.000Z',
    });
    expect(history).toBeDefined();
    const stored = JSON.stringify({ version: 1, repos: [v1Repo] });

    const [loaded] = loadTrackedRepos(store(stored));

    expect(loaded?.id).toBe(7);
    expect(loaded?.history).toEqual([
      {
        at: '2026-09-17T00:00:00.000Z',
        stars: v1Repo.stats.stars,
        openIssues: v1Repo.stats.openIssues,
      },
    ]);
  });

  it('anchors a never-refreshed version 1 repo to when it was tracked', () => {
    const { history, ...v1Repo } = buildTrackedRepo({ refreshedAt: null });
    expect(history).toBeDefined();
    const stored = JSON.stringify({ version: 1, repos: [v1Repo] });

    expect(loadTrackedRepos(store(stored))[0]?.history[0]?.at).toBe(
      v1Repo.trackedAt,
    );
  });

  it('drops a malformed repo but keeps the valid ones', () => {
    const valid = buildTrackedRepo({ id: 1 });
    const stored = JSON.stringify({
      version: TRACKED_REPOS_SCHEMA_VERSION,
      repos: [
        valid,
        { ...buildTrackedRepo({ id: 2 }), stats: { stars: 'lots' } },
        null,
      ],
    });

    expect(loadTrackedRepos(store(stored))).toEqual([valid]);
  });

  it('copes with storage the browser refuses to open', () => {
    const blocked = {
      getItem: () => {
        throw new Error('SecurityError');
      },
      setItem: () => {
        throw new Error('QuotaExceededError');
      },
    } as unknown as Storage;

    expect(loadTrackedRepos(blocked)).toEqual([]);
    expect(saveTrackedRepos(blocked, [buildTrackedRepo()])).toBe(false);
  });
});
