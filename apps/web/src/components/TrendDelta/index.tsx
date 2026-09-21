import { Tooltip, VisuallyHidden, formatNumber, useNow } from '@repo-radar/ui';
import { TrendDown01, TrendUp01 } from '@untitledui/icons';

import { formatRelativeTime } from '@repo-radar/ui';

import { DeltaChip } from './styles';
import type { ITrendDeltaProps } from './types';

const ICON_SIZE = 12;
const CLOCK_TICK_MS = 60_000;

/**
 * How far a number has moved since watching began. GitHub serves no history,
 * so this is measured against the first reading we took — which is why the
 * tooltip says when that was rather than implying a fixed window.
 */
const TrendDelta: React.FC<ITrendDeltaProps> = ({ delta, since, unit }) => {
  const now = useNow(CLOCK_TICK_MS);

  // Nothing moved: a "±0" beside every quiet repository is noise, not news.
  if (delta === 0) return null;

  const isUp = delta > 0;
  const size = formatNumber(Math.abs(delta));
  const when = formatRelativeTime(new Date(since), now);

  return (
    <Tooltip
      title={`${isUp ? 'Gained' : 'Lost'} ${size} ${unit} since you started watching, ${when}`}
    >
      <DeltaChip data-direction={isUp ? 'up' : 'down'}>
        {isUp ? (
          <TrendUp01 size={ICON_SIZE} aria-hidden />
        ) : (
          <TrendDown01 size={ICON_SIZE} aria-hidden />
        )}
        <VisuallyHidden>{isUp ? 'up' : 'down'} </VisuallyHidden>
        {size}
      </DeltaChip>
    </Tooltip>
  );
};

export default TrendDelta;
