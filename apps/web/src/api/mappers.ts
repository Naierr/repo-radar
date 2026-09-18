import type { IRepoIdentity, IRepoSummary } from '@/types/repo';

import type { FullRepositoryDto, RepoSearchItemDto } from './types';

// GitHub's snake_case stops here: nothing past the API layer sees a DTO.

export const toRepoIdentity = (
  dto: RepoSearchItemDto | FullRepositoryDto,
): IRepoIdentity => ({
  // The spec types ids as int64 (`number | bigint`); JSON only ever yields numbers.
  id: Number(dto.id),
  fullName: dto.full_name,
  name: dto.name,
  owner: {
    login: dto.owner?.login ?? '',
    avatarUrl: dto.owner?.avatar_url ?? '',
  },
  description: dto.description ?? null,
  htmlUrl: dto.html_url,
  language: dto.language ?? null,
});

export const toRepoSummary = (dto: RepoSearchItemDto): IRepoSummary => ({
  ...toRepoIdentity(dto),
  stars: dto.stargazers_count,
  openIssues: dto.open_issues_count,
});
