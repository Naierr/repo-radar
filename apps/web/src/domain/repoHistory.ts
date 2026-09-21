import { MAX_HISTORY_POINTS } from '@/constants/trackedRepos';
import type { IRepoHistoryPoint, IRepoStats, ITrackedRepo } from '@/types/repo';

/** What a repository's numbers have done since watching began. */
export interface IRepoTrend {
  /** Change in stars since the anchor. Negative when they were lost. */
  starsDelta: number;
  /** When the watching that this trend measures started. */
  since: string;
  /** Recorded observations, oldest first — enough to draw. */
  points: IRepoHistoryPoint[];
}

export const toHistoryPoint = (
  at: string,
  stats: Pick<IRepoStats, 'stars' | 'openIssues'>,
): IRepoHistoryPoint => ({
  at,
  stars: stats.stars,
  openIssues: stats.openIssues,
});

const isSameReading = (a: IRepoHistoryPoint, b: IRepoHistoryPoint): boolean =>
  a.stars === b.stars && a.openIssues === b.openIssues;

/**
 * Adds an observation.
 *
 * A reading identical to the last one is dropped: repeated refreshes of a
 * quiet repository would otherwise fill the record with the same number and
 * push the anchor out. When the cap is reached the *second* point goes, never
 * the first — the anchor is what every trend is measured against, so losing it
 * would silently rewrite history.
 */
export const recordHistory = (
  history: IRepoHistoryPoint[],
  point: IRepoHistoryPoint,
): IRepoHistoryPoint[] => {
  const last = history.at(-1);
  if (last && isSameReading(last, point)) return history;

  const next = [...history, point];
  if (next.length <= MAX_HISTORY_POINTS) return next;
  // Keep the anchor, drop what came straight after it.
  return [...next.slice(0, 1), ...next.slice(2)];
};

/** Null until there are two readings to compare. */
export const readTrend = (repo: ITrackedRepo): IRepoTrend | null => {
  const anchor = repo.history[0];
  if (!anchor || repo.history.length < 2) return null;

  return {
    starsDelta: repo.stats.stars - anchor.stars,
    since: anchor.at,
    points: repo.history,
  };
};
