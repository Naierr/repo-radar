import { isAxiosError } from 'axios';

import type { IRepoSnapshot, ISearchPage } from '@/types/repo';

import { EMPTY_REPOSITORY_STATUS, GITHUB_ROUTES } from './constants';
import { githubClient } from './githubClient';
import { toRepoIdentity, toRepoSummary } from './mappers';
import type {
  CommitDto,
  FullRepositoryDto,
  IRequestOptions,
  ISearchParams,
  SearchRepositoriesResponseDto,
} from './types';

export const searchRepositories = async (
  { query, page, perPage }: ISearchParams,
  { signal }: IRequestOptions = {},
): Promise<ISearchPage> => {
  const { data } = await githubClient.get<SearchRepositoriesResponseDto>(
    GITHUB_ROUTES.searchRepositories(),
    { params: { q: query, page, per_page: perPage }, signal },
  );
  return {
    totalCount: data.total_count,
    items: data.items.map(toRepoSummary),
  };
};

export const getRepository = async (
  fullName: string,
  { signal }: IRequestOptions = {},
): Promise<FullRepositoryDto> => {
  const { data } = await githubClient.get<FullRepositoryDto>(
    GITHUB_ROUTES.repository(fullName),
    { signal },
  );
  return data;
};

/** Date of the newest commit on `branch`, or null for an empty repository. */
export const getLatestCommitDate = async (
  fullName: string,
  branch: string,
  { signal }: IRequestOptions = {},
): Promise<string | null> => {
  try {
    const { data } = await githubClient.get<CommitDto[]>(
      GITHUB_ROUTES.commits(fullName),
      { params: { sha: branch, per_page: 1 }, signal },
    );
    const [latest] = data;
    return (
      latest?.commit.committer?.date ?? latest?.commit.author?.date ?? null
    );
  } catch (error) {
    if (
      isAxiosError(error) &&
      error.response?.status === EMPTY_REPOSITORY_STATUS
    ) {
      return null;
    }
    throw error;
  }
};

/** Everything the dashboard shows for one repository, fresh from GitHub. */
export const fetchRepoSnapshot = async (
  fullName: string,
  options: IRequestOptions = {},
): Promise<IRepoSnapshot> => {
  const repository = await getRepository(fullName, options);
  // Asks with the name GitHub answered with, so a renamed repo still resolves.
  const lastCommitAt = await getLatestCommitDate(
    repository.full_name,
    repository.default_branch,
    options,
  );
  return {
    identity: toRepoIdentity(repository),
    stats: {
      stars: repository.stargazers_count,
      openIssues: repository.open_issues_count,
      lastCommitAt,
    },
  };
};

/** What thunks may call — injected through the store so tests can swap it. */
export const githubApi = { searchRepositories, fetchRepoSnapshot };

export type GitHubApi = typeof githubApi;
