import { describe, expect, it } from 'vitest';

import { MAX_HISTORY_POINTS } from '@/constants/trackedRepos';
import { buildTrackedRepo } from '@/__tests__/_support/builders';

import { readTrend, recordHistory, toHistoryPoint } from './repoHistory';

const point = (at: string, stars: number, openIssues = 5) =>
  toHistoryPoint(at, { stars, openIssues });

describe('recordHistory', () => {
  it('keeps a reading that differs from the last one', () => {
    const history = recordHistory([point('a', 10)], point('b', 12));

    expect(history.map((entry) => entry.stars)).toEqual([10, 12]);
  });

  it('drops a reading identical to the last, so quiet repos stay quiet', () => {
    const existing = [point('a', 10)];

    // Refreshing an unchanged repo must not fill the record with one number.
    expect(recordHistory(existing, point('b', 10))).toBe(existing);
  });

  it('notices a change in issues even when the stars hold still', () => {
    const history = recordHistory([point('a', 10, 5)], point('b', 10, 6));

    expect(history).toHaveLength(2);
  });

  it('sacrifices the second point at the cap, never the anchor', () => {
    const full = Array.from({ length: MAX_HISTORY_POINTS }, (_, index) =>
      point(`t${String(index)}`, index),
    );

    const history = recordHistory(full, point('newest', 999));

    expect(history).toHaveLength(MAX_HISTORY_POINTS);
    // The anchor survives — every trend is measured from it.
    expect(history[0]).toEqual(full[0]);
    expect(history[1]).toEqual(full[2]);
    expect(history.at(-1)?.stars).toBe(999);
  });
});

describe('readTrend', () => {
  it('has nothing to say before anything has been recorded', () => {
    expect(readTrend(buildTrackedRepo({ history: [] }))).toBeNull();
  });

  it('measures from the anchor even with a single stored reading', () => {
    const repo = buildTrackedRepo({
      stats: { stars: 17, openIssues: 5, lastCommitAt: null },
      history: [point('anchor', 10)],
    });

    expect(readTrend(repo)?.starsDelta).toBe(7);
  });

  it('reports no movement rather than null when nothing has moved', () => {
    const repo = buildTrackedRepo({
      stats: { stars: 10, openIssues: 5, lastCommitAt: null },
      history: [point('anchor', 10)],
    });

    expect(readTrend(repo)?.starsDelta).toBe(0);
  });

  it('measures against the anchor, not the previous reading', () => {
    const repo = buildTrackedRepo({
      stats: { stars: 130, openIssues: 5, lastCommitAt: null },
      history: [point('anchor', 100), point('b', 120), point('c', 125)],
    });

    // 130 vs the anchor's 100 — "since you started", not "since last time".
    expect(readTrend(repo)).toMatchObject({ starsDelta: 30, since: 'anchor' });
  });

  it('reports a fall as a negative change', () => {
    const repo = buildTrackedRepo({
      stats: { stars: 90, openIssues: 5, lastCommitAt: null },
      history: [point('anchor', 100), point('b', 95)],
    });

    expect(readTrend(repo)?.starsDelta).toBe(-10);
  });
});
