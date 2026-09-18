import {
  TRACKED_REPOS_SCHEMA_VERSION,
  TRACKED_REPOS_STORAGE_KEY,
} from '@/constants/trackedRepos';
import type { ITrackedRepo } from '@/types/repo';
import { readJson, writeJson } from '@/utils/storage';

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

const isTrackedRepo = (value: unknown): value is ITrackedRepo => {
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

export const loadTrackedRepos = (storage: Storage): ITrackedRepo[] => {
  const stored = readJson(storage, TRACKED_REPOS_STORAGE_KEY);
  if (
    !isRecord(stored) ||
    stored.version !== TRACKED_REPOS_SCHEMA_VERSION ||
    !Array.isArray(stored.repos)
  ) {
    return [];
  }
  return stored.repos.filter(isTrackedRepo);
};

export const saveTrackedRepos = (
  storage: Storage,
  repos: ITrackedRepo[],
): boolean =>
  writeJson(storage, TRACKED_REPOS_STORAGE_KEY, {
    version: TRACKED_REPOS_SCHEMA_VERSION,
    repos,
  });
