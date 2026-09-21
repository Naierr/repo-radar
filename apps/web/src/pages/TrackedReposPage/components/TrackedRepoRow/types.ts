export interface ITrackedRepoRowProps {
  repoId: number;
  /** Ids the row's actions apply to — the selection, or just this row. */
  onUntrack: (ids: number[]) => void;
  selected: boolean;
  /** Every selected id, so a selected row's buttons act on all of them. */
  selectedIds: number[];
  onSelectToggle: (id: number) => void;
}
