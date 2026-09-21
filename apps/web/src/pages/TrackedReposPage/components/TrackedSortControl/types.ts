import type { TrackedOrder } from '@/constants/trackedRepos';

export interface ITrackedSortControlProps {
  value: TrackedOrder;
  onChange: (order: TrackedOrder) => void;
}
