import { describe, expect, it } from 'vitest';

import {
  buildTrackedRepo,
  createMemoryStorage,
} from '@/__tests__/_support/builders';
import { TRACKED_REPOS_STORAGE_KEY } from '@/constants/trackedRepos';

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

  it('drops a malformed repo but keeps the valid ones', () => {
    const valid = buildTrackedRepo({ id: 1 });
    const stored = JSON.stringify({
      version: 1,
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
