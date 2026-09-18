import type { AxiosResponse } from 'axios';
import { describe, expect, it, vi } from 'vitest';

import { buildAxiosError } from '@/__tests__/_support/builders';

import { fetchRepoSnapshot, searchRepositories } from './githubApi';
import { githubClient } from './githubClient';
import type { FullRepositoryDto, RepoSearchItemDto } from './types';

const respond = (data: unknown) => ({ data }) as AxiosResponse;

// Only the fields the mappers read; GitHub's real payloads are far larger.
const buildRepoDto = (overrides: Record<string, unknown> = {}) =>
  ({
    id: 7,
    name: 'radar',
    full_name: 'octo/radar',
    owner: {
      login: 'octo',
      avatar_url: 'https://avatars.example.com/octo.png',
    },
    description: 'Scans the sky',
    html_url: 'https://github.com/octo/radar',
    language: 'Rust',
    stargazers_count: 1234,
    open_issues_count: 12,
    default_branch: 'main',
    ...overrides,
  }) as unknown as RepoSearchItemDto & FullRepositoryDto;

const commitsOn = (date: string) => [
  { commit: { committer: { date }, author: { date: '2000-01-01T00:00:00Z' } } },
];

describe('searchRepositories', () => {
  it('asks GitHub for one page and maps each hit to a summary', async () => {
    const get = vi.spyOn(githubClient, 'get').mockResolvedValueOnce(
      respond({
        total_count: 1,
        incomplete_results: false,
        items: [buildRepoDto()],
      }),
    );

    const page = await searchRepositories({
      query: 'radar',
      page: 2,
      perPage: 20,
    });

    expect(get).toHaveBeenCalledExactlyOnceWith(
      '/search/repositories',
      expect.objectContaining({
        params: { q: 'radar', page: 2, per_page: 20 },
      }),
    );
    expect(page).toEqual({
      totalCount: 1,
      items: [
        {
          id: 7,
          name: 'radar',
          fullName: 'octo/radar',
          owner: {
            login: 'octo',
            avatarUrl: 'https://avatars.example.com/octo.png',
          },
          description: 'Scans the sky',
          htmlUrl: 'https://github.com/octo/radar',
          language: 'Rust',
          stars: 1234,
          openIssues: 12,
        },
      ],
    });
  });
});

describe('fetchRepoSnapshot', () => {
  it('reads the latest commit of the default branch, under the current name', async () => {
    const get = vi
      .spyOn(githubClient, 'get')
      .mockResolvedValueOnce(
        respond(
          buildRepoDto({ full_name: 'octo/renamed', default_branch: 'trunk' }),
        ),
      )
      .mockResolvedValueOnce(respond(commitsOn('2026-09-17T10:00:00Z')));

    const snapshot = await fetchRepoSnapshot('octo/old-name');

    expect(get).toHaveBeenNthCalledWith(
      1,
      '/repos/octo/old-name',
      expect.anything(),
    );
    expect(get).toHaveBeenNthCalledWith(
      2,
      '/repos/octo/renamed/commits',
      expect.objectContaining({ params: { sha: 'trunk', per_page: 1 } }),
    );
    expect(snapshot.stats).toEqual({
      stars: 1234,
      openIssues: 12,
      lastCommitAt: '2026-09-17T10:00:00Z',
    });
    expect(snapshot.identity.fullName).toBe('octo/renamed');
  });

  it('reports no last commit for an empty repository', async () => {
    vi.spyOn(githubClient, 'get')
      .mockResolvedValueOnce(respond(buildRepoDto()))
      .mockRejectedValueOnce(buildAxiosError(409));

    const snapshot = await fetchRepoSnapshot('octo/radar');

    expect(snapshot.stats.lastCommitAt).toBeNull();
  });

  it('lets any other failure through', async () => {
    const serverError = buildAxiosError(502);
    vi.spyOn(githubClient, 'get')
      .mockResolvedValueOnce(respond(buildRepoDto()))
      .mockRejectedValueOnce(serverError);

    await expect(fetchRepoSnapshot('octo/radar')).rejects.toBe(serverError);
  });

  it('hands the abort signal to every request it makes', async () => {
    const get = vi
      .spyOn(githubClient, 'get')
      .mockResolvedValueOnce(respond(buildRepoDto()))
      .mockResolvedValueOnce(respond([]));
    const { signal } = new AbortController();

    await fetchRepoSnapshot('octo/radar', { signal });

    get.mock.calls.forEach(([, config]) => {
      expect(config?.signal).toBe(signal);
    });
  });
});
