import { Tooltip, formatRelativeTime, useNow } from '@repo-radar/ui';
import { Signal01 } from '@untitledui/icons';

import { RATE_LIMIT_RESOURCE } from '@/api/rateLimit';
import type { IRateLimit } from '@/api/rateLimit';
import { useAppSelector } from '@/hooks/useReduxHooks';
import { selectCoreRateLimit, selectSearchRateLimit } from '@/store/rateLimit';

import { Indicator } from './styles';

/** Below this share of a budget, the limit is close enough to be worth saying. */
const LOW_BUDGET_RATIO = 0.2;
const ICON_SIZE = 14;
const CLOCK_TICK_MS = 30_000;

/** GitHub's resource names are API vocabulary; these are the user's. */
const unitFor = (resource: string, count: number): string => {
  if (resource === RATE_LIMIT_RESOURCE.SEARCH) {
    return count === 1 ? 'search' : 'searches';
  }
  return count === 1 ? 'GitHub request' : 'GitHub requests';
};

/**
 * Once the window passes, the budget has refilled and the counts we hold are
 * stale — so a spent budget stops speaking rather than reporting a reset that
 * already happened.
 */
const isOpen = (rateLimit: IRateLimit, now: Date): boolean =>
  new Date(rateLimit.resetAt) > now;

const shareLeft = ({ remaining, limit }: IRateLimit): number =>
  limit > 0 ? remaining / limit : 1;

const tighterOf = (
  a: IRateLimit | null,
  b: IRateLimit | null,
): IRateLimit | null => {
  if (!a) return b;
  if (!b) return a;
  return shareLeft(a) <= shareLeft(b) ? a : b;
};

/**
 * Speaks only when GitHub's budget is nearly spent. A permanent counter of a
 * number nobody needs teaches people to ignore the one place that would warn
 * them, so the healthy state is silence.
 */
const RateLimitIndicator: React.FC = () => {
  const core = useAppSelector(selectCoreRateLimit);
  const search = useAppSelector(selectSearchRateLimit);
  const now = useNow(CLOCK_TICK_MS);

  const open = [core, search].map((rateLimit) =>
    rateLimit && isOpen(rateLimit, now) ? rateLimit : null,
  );
  const tightest = open.reduce(tighterOf, null);

  if (!tightest || shareLeft(tightest) > LOW_BUDGET_RATIO) return null;

  const unit = unitFor(tightest.resource, tightest.remaining);
  const resets = formatRelativeTime(new Date(tightest.resetAt), now);
  const isOut = tightest.remaining === 0;

  // Deliberately not a live region: the count moves on every request, and
  // announcing each change would drown out the rest of the page.
  return (
    <Tooltip
      title={`GitHub limits how often anonymous visitors can call its API. This budget resets ${resets}.`}
    >
      <Indicator tone={isOut ? 'out' : 'low'}>
        <Signal01 size={ICON_SIZE} aria-hidden />
        {isOut
          ? `No ${unit} left — resets ${resets}`
          : `${tightest.remaining} ${unit} left`}
      </Indicator>
    </Tooltip>
  );
};

export default RateLimitIndicator;
