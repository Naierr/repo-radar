import {
  Tooltip,
  VisuallyHidden,
  formatRelativeTime,
  useNow,
} from '@repo-radar/ui';
import { Signal01 } from '@untitledui/icons';

import type { IRateLimit } from '@/api/rateLimit';
import { useAppSelector } from '@/hooks/useReduxHooks';
import { selectCoreRateLimit, selectSearchRateLimit } from '@/store/rateLimit';

import { Indicator } from './styles';
import type { RateLimitTone } from './styles';

const LOW_BUDGET_RATIO = 0.2;
const ICON_SIZE = 14;
const CLOCK_TICK_MS = 30_000;

const getTone = ({ remaining, limit }: IRateLimit): RateLimitTone => {
  if (remaining === 0) return 'out';
  return remaining / limit <= LOW_BUDGET_RATIO ? 'low' : 'ok';
};

const describe = (name: string, rateLimit: IRateLimit, now: Date): string =>
  `${name}: ${rateLimit.remaining} of ${rateLimit.limit} left, resets ${formatRelativeTime(new Date(rateLimit.resetAt), now)}`;

/** How much of GitHub's request budget is left — shown once a response says. */
const RateLimitIndicator: React.FC = () => {
  const core = useAppSelector(selectCoreRateLimit);
  const search = useAppSelector(selectSearchRateLimit);
  const now = useNow(CLOCK_TICK_MS);
  const shown = core ?? search;

  if (!shown) return null;

  const details: string[] = [];
  if (core) details.push(describe('Repository data', core, now));
  if (search) details.push(describe('Search', search, now));

  // Deliberately not a live region (role="status"): the count changes on every
  // request, and announcing each change would drown out the rest of the page.
  return (
    <Tooltip
      title={details.map((line) => (
        <div key={line}>{line}</div>
      ))}
    >
      <Indicator tone={getTone(shown)}>
        <Signal01 size={ICON_SIZE} aria-hidden />
        <VisuallyHidden>GitHub API requests left: </VisuallyHidden>
        {shown.remaining}/{shown.limit}
      </Indicator>
    </Tooltip>
  );
};

export default RateLimitIndicator;
