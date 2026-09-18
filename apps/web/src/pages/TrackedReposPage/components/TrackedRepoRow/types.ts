import type { ITrackedRepo } from '@/types/repo';

export interface ITrackedRepoRowProps {
  repoId: number;
  onUntrack: (repo: ITrackedRepo) => void;
}
