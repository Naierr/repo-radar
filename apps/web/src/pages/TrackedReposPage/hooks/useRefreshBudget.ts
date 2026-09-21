import { formatRelativeTime, useNow } from '@repo-radar/ui';

import { REQUESTS_PER_REPO_REFRESH } from '@/api/constants';
import { useAppSelector } from '@/hooks/useReduxHooks';
import { selectCoreRateLimit, selectCoreRequestsLeft } from '@/store/rateLimit';
import { selectTrackedRepoIds } from '@/store/trackedRepos';

const CLOCK_TICK_MS = 30_000;
/** Spending more than this share of what is left deserves a question first. */
const COSTLY_SHARE = 0.5;

export interface IUseRefreshBudgetResult {
  repoCount: number;
  /** GitHub requests a full refresh would spend. */
  cost: number;
  /** Requests left in the open window, or null when GitHub has not said. */
  requestsLeft: number | null;
  /** False only when we know the budget cannot cover a full refresh. */
  isAffordable: boolean;
  /** Affordable, but it would take most of what is left. */
  isCostly: boolean;
  /** "in 58 minutes", or null when nothing is known about the window. */
  resetsIn: string | null;
}

/**
 * What refreshing everything would cost, against what GitHub says is left.
 * Anonymous callers get 60 requests an hour and each repository spends two, so
 * a dashboard of twenty is already over budget in one click.
 */
export const useRefreshBudget = (): IUseRefreshBudgetResult => {
  const repoCount = useAppSelector(selectTrackedRepoIds).length;
  const core = useAppSelector(selectCoreRateLimit);
  const now = useNow(CLOCK_TICK_MS);
  const requestsLeft = useAppSelector((state) =>
    selectCoreRequestsLeft(state, now.getTime()),
  );
  const cost = repoCount * REQUESTS_PER_REPO_REFRESH;

  return {
    repoCount,
    cost,
    requestsLeft,
    isAffordable: requestsLeft === null || cost <= requestsLeft,
    isCostly:
      requestsLeft !== null &&
      cost <= requestsLeft &&
      cost > requestsLeft * COSTLY_SHARE,
    resetsIn: core ? formatRelativeTime(new Date(core.resetAt), now) : null,
  };
};
