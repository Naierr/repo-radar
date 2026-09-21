import { formatRelativeTime, useNow } from '@repo-radar/ui';
import { useState } from 'react';
import { useSearchParams } from 'react-router';

import { REQUESTS_PER_REPO_REFRESH } from '@/api/constants';
import {
  MAX_SHARED_REPOS,
  SHARED_REPOS_PARAM,
  isRepoFullName,
} from '@/constants/sharedRadar';
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks';
import { selectCoreRateLimit, selectCoreRequestsLeft } from '@/store/rateLimit';
import { importSharedRepos, selectAllTrackedRepos } from '@/store/trackedRepos';

const CLOCK_TICK_MS = 30_000;

export interface IUseSharedRadarResult {
  /** Valid, not-yet-tracked repositories the link is offering. */
  offered: string[];
  /** The subset that will be added. */
  selected: string[];
  toggle: (fullName: string) => void;
  isAdding: boolean;
  /** Repositories GitHub would not give us, kept so they can be retried. */
  failed: string[];
  cost: number;
  requestsLeft: number | null;
  isAffordable: boolean;
  resetsIn: string | null;
  add: () => void;
  dismiss: () => void;
}

/**
 * A shared link proposes repositories; it never adds them. The offer survives
 * a failed attempt — a spent rate limit is a reason to try later, not a reason
 * to lose the list someone sent you.
 */
export const useSharedRadar = (): IUseSharedRadarResult => {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const tracked = useAppSelector(selectAllTrackedRepos);
  const core = useAppSelector(selectCoreRateLimit);
  const now = useNow(CLOCK_TICK_MS);
  const requestsLeft = useAppSelector((state) =>
    selectCoreRequestsLeft(state, now.getTime()),
  );

  // Held as exclusions, so a repository the link adds is selected by default
  // and nothing has to be kept in step with the URL.
  const [excluded, setExcluded] = useState<Set<string>>(new Set());
  const [isAdding, setIsAdding] = useState(false);
  const [failed, setFailed] = useState<string[]>([]);

  const trackedNames = new Set(
    tracked.map((repo) => repo.fullName.toLowerCase()),
  );
  const offered = [
    ...new Set(
      (searchParams.get(SHARED_REPOS_PARAM) ?? '')
        .split(',')
        .map((name) => name.trim())
        .filter(isRepoFullName),
    ),
  ]
    .filter((name) => !trackedNames.has(name.toLowerCase()))
    .slice(0, MAX_SHARED_REPOS);

  const selected = offered.filter((name) => !excluded.has(name));
  const cost = selected.length * REQUESTS_PER_REPO_REFRESH;

  const clear = () => {
    setSearchParams(
      (params) => {
        params.delete(SHARED_REPOS_PARAM);
        return params;
      },
      { replace: true },
    );
  };

  const add = async () => {
    setIsAdding(true);
    setFailed([]);
    try {
      const rejected = await dispatch(importSharedRepos(selected)).unwrap();
      setFailed(rejected);
      // Whatever succeeded is tracked now, so the offer shrinks to the rest.
      if (rejected.length === 0) clear();
    } catch {
      setFailed(selected);
    } finally {
      setIsAdding(false);
    }
  };

  return {
    offered,
    selected,
    toggle: (fullName) => {
      setExcluded((current) => {
        const next = new Set(current);
        if (next.has(fullName)) next.delete(fullName);
        else next.add(fullName);
        return next;
      });
    },
    isAdding,
    failed,
    cost,
    requestsLeft,
    isAffordable: requestsLeft === null || cost <= requestsLeft,
    resetsIn: core ? formatRelativeTime(new Date(core.resetAt), now) : null,
    add: () => {
      void add();
    },
    dismiss: clear,
  };
};
