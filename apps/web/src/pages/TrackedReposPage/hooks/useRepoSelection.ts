import { useState } from 'react';

export interface IUseRepoSelectionResult {
  selected: number[];
  isSelected: (id: number) => boolean;
  toggle: (id: number) => void;
  /** Selects every visible repo, or clears the selection if all are chosen. */
  toggleAll: () => void;
  allSelected: boolean;
  someSelected: boolean;
  clear: () => void;
}

/**
 * Which repositories a bulk action applies to. Selection is per-visit rather
 * than persisted — it describes what the user is doing right now, not what
 * they keep.
 */
export const useRepoSelection = (
  visibleIds: number[],
): IUseRepoSelectionResult => {
  const [chosen, setChosen] = useState<Set<number>>(new Set());

  // A repo can be untracked while selected, so what counts is the overlap.
  const selected = visibleIds.filter((id) => chosen.has(id));
  const allSelected =
    visibleIds.length > 0 && selected.length === visibleIds.length;

  return {
    selected,
    isSelected: (id) => chosen.has(id),
    toggle: (id) => {
      setChosen((current) => {
        const next = new Set(current);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
    },
    toggleAll: () => {
      setChosen(allSelected ? new Set() : new Set(visibleIds));
    },
    allSelected,
    someSelected: selected.length > 0 && !allSelected,
    clear: () => {
      setChosen(new Set());
    },
  };
};
