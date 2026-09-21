import {
  TRACKED_REPOS_SCHEMA_VERSION,
  TRACKED_REPOS_STORAGE_KEY,
} from '@/constants/trackedRepos';
import type { IRepoHistoryPoint, ITrackedRepo } from '@/types/repo';
import { readJson, writeJson } from '@/utils/storage';

import { toHistoryPoint } from './repoHistory';

// What lands in localStorage is untrusted: an older schema, a hand edit or
// another app could have written it. Each repo is checked on the way in and
// a bad entry is dropped on its own, without losing the rest of the list.

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === 'object' && value !== null;

const isString = (value: unknown): value is string => typeof value === 'string';
const isNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);
const isNullableString = (value: unknown): value is string | null =>
  value === null || isString(value);

const isHistoryPoint = (value: unknown): value is IRepoHistoryPoint =>
  isRecord(value) &&
  isString(value.at) &&
  isNumber(value.stars) &&
  isNumber(value.openIssues);

/** Everything a tracked repo has had since version 1. */
const hasRepoCore = (value: unknown): value is UnknownRecord => {
  if (!isRecord(value)) return false;
  const { owner, stats } = value;
  return (
    isNumber(value.id) &&
    isString(value.fullName) &&
    isString(value.name) &&
    isNullableString(value.description) &&
    isString(value.htmlUrl) &&
    isNullableString(value.language) &&
    isString(value.trackedAt) &&
    isNullableString(value.refreshedAt) &&
    isRecord(owner) &&
    isString(owner.login) &&
    isString(owner.avatarUrl) &&
    isRecord(stats) &&
    isNumber(stats.stars) &&
    isNumber(stats.openIssues) &&
    isNullableString(stats.lastCommitAt)
  );
};

const isTrackedRepo = (value: unknown): value is ITrackedRepo =>
  hasRepoCore(value) &&
  Array.isArray(value.history) &&
  value.history.every(isHistoryPoint);

/**
 * Version 1 had no history. Rather than drop those repositories — the user's
 * own list, and the one thing they would notice losing — each is given an
 * anchor from the reading it already carries, so a trend starts from what we
 * know rather than from nothing.
 */
const upgradeFromV1 = (value: unknown): ITrackedRepo | null => {
  if (!hasRepoCore(value)) return null;
  const repo = value as unknown as Omit<ITrackedRepo, 'history'>;
  return {
    ...repo,
    history: [toHistoryPoint(repo.refreshedAt ?? repo.trackedAt, repo.stats)],
  };
};

const isTruthy = <T>(value: T | null): value is T => value !== null;

export const loadTrackedRepos = (storage: Storage): ITrackedRepo[] => {
  const stored = readJson(storage, TRACKED_REPOS_STORAGE_KEY);
  if (!isRecord(stored) || !Array.isArray(stored.repos)) return [];

  if (stored.version === TRACKED_REPOS_SCHEMA_VERSION) {
    return stored.repos.filter(isTrackedRepo);
  }
  if (stored.version === 1) {
    return stored.repos.map(upgradeFromV1).filter(isTruthy);
  }
  return [];
};

export const saveTrackedRepos = (
  storage: Storage,
  repos: ITrackedRepo[],
): boolean =>
  writeJson(storage, TRACKED_REPOS_STORAGE_KEY, {
    version: TRACKED_REPOS_SCHEMA_VERSION,
    repos,
  });
