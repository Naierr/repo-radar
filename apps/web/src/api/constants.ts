export const GITHUB_API_VERSION = '2022-11-28';
export const REQUEST_TIMEOUT_MS = 15_000;

/**
 * A refresh asks for the repository, then for its default branch's latest
 * commit — so every repository costs two of GitHub's hourly requests, not one.
 */
export const REQUESTS_PER_REPO_REFRESH = 2;

/** A repository has no commits yet — GitHub answers the commits endpoint with 409. */
export const EMPTY_REPOSITORY_STATUS = 409;

const encodeRepoPath = (fullName: string): string =>
  fullName.split('/').map(encodeURIComponent).join('/');

export const GITHUB_ROUTES = {
  searchRepositories: () => '/search/repositories',
  repository: (fullName: string) => `/repos/${encodeRepoPath(fullName)}`,
  commits: (fullName: string) => `/repos/${encodeRepoPath(fullName)}/commits`,
} as const;
