import { AxiosError, AxiosHeaders } from 'axios';
import { vi } from 'vitest';

import type { GitHubApi } from '@/api/githubApi';
import type {
  IRepoIdentity,
  IRepoSnapshot,
  IRepoStats,
  IRepoSummary,
  ITrackedRepo,
} from '@/types/repo';

const identityFor = (id: number, name = `repo-${id}`): IRepoIdentity => ({
  id,
  name,
  fullName: `octo/${name}`,
  owner: { login: 'octo', avatarUrl: 'https://avatars.example.com/octo.png' },
  description: 'A repository worth watching',
  htmlUrl: `https://github.com/octo/${name}`,
  language: 'TypeScript',
});

export const buildRepoSummary = (
  overrides: Partial<IRepoSummary> = {},
): IRepoSummary => ({
  ...identityFor(overrides.id ?? 1, overrides.name),
  stars: 100,
  openIssues: 5,
  ...overrides,
});

export const buildTrackedRepo = (
  overrides: Partial<ITrackedRepo> = {},
): ITrackedRepo => ({
  ...identityFor(overrides.id ?? 1, overrides.name),
  trackedAt: '2026-09-01T00:00:00.000Z',
  stats: {
    stars: 100,
    openIssues: 5,
    lastCommitAt: '2026-09-10T00:00:00.000Z',
  },
  refreshedAt: '2026-09-17T00:00:00.000Z',
  history: [],
  ...overrides,
});

export const buildSnapshot = (
  repo: Pick<IRepoIdentity, 'id' | 'name'>,
  stats: Partial<IRepoStats> = {},
): IRepoSnapshot => ({
  identity: identityFor(repo.id, repo.name),
  stats: { stars: 100, openIssues: 5, lastCommitAt: null, ...stats },
});

/** A GitHub API whose every call is a mock the test scripts. */
export const createFakeGitHubApi = () => ({
  searchRepositories: vi.fn<GitHubApi['searchRepositories']>(),
  fetchRepoSnapshot: vi.fn<GitHubApi['fetchRepoSnapshot']>(),
});

export type FakeGitHubApi = ReturnType<typeof createFakeGitHubApi>;

/** The error axios throws for a response with this status and headers. */
export const buildAxiosError = (
  status: number,
  headers: Record<string, string> = {},
): AxiosError =>
  new AxiosError(
    'Request failed',
    AxiosError.ERR_BAD_RESPONSE,
    undefined,
    undefined,
    {
      status,
      statusText: '',
      headers,
      data: {},
      config: { headers: new AxiosHeaders() },
    },
  );

/** An in-memory Storage whose writes can be inspected. */
export const createMemoryStorage = () => {
  const entries = new Map<string, string>();
  const setItem = vi.fn((key: string, value: string) => {
    entries.set(key, value);
  });
  const storage: Storage = {
    get length() {
      return entries.size;
    },
    key: (index) => [...entries.keys()][index] ?? null,
    getItem: (key) => entries.get(key) ?? null,
    setItem,
    removeItem: (key) => {
      entries.delete(key);
    },
    clear: () => {
      entries.clear();
    },
  };
  return { storage, setItem };
};
