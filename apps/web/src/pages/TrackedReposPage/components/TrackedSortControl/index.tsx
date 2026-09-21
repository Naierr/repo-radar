import { TRACKED_ORDER } from '@/constants/trackedRepos';
import type { TrackedOrder } from '@/constants/trackedRepos';

import { SortGroup, SortOption } from './styles';
import type { ITrackedSortControlProps } from './types';

const OPTIONS: { order: TrackedOrder; label: string }[] = [
  { order: TRACKED_ORDER.ADDED, label: 'Recently added' },
  { order: TRACKED_ORDER.STARS, label: 'Most stars' },
];

const TrackedSortControl: React.FC<ITrackedSortControlProps> = ({
  value,
  onChange,
}) => (
  <SortGroup role="group" aria-label="Order repositories by">
    {OPTIONS.map(({ order, label }) => (
      <SortOption
        key={order}
        type="button"
        aria-pressed={value === order}
        onClick={() => {
          onChange(order);
        }}
      >
        {label}
      </SortOption>
    ))}
  </SortGroup>
);

export default TrackedSortControl;
