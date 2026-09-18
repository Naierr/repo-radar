import type { components, operations } from '@octokit/openapi-types';

// GitHub's own OpenAPI types — never hand-copied, so they can't drift.
export type RepoSearchItemDto =
  components['schemas']['repo-search-result-item'];
export type FullRepositoryDto = components['schemas']['full-repository'];
export type CommitDto = components['schemas']['commit'];
export type SearchRepositoriesResponseDto =
  operations['search/repos']['responses'][200]['content']['application/json'];

export interface IRequestOptions {
  signal?: AbortSignal;
}

export interface ISearchParams {
  query: string;
  page: number;
  perPage: number;
}
