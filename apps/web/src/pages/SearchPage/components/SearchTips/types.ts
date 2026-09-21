export interface ISearchTipsProps {
  /** Puts an example into the search box, so a tip can be tried, not just read. */
  onPick: (query: string) => void;
}
