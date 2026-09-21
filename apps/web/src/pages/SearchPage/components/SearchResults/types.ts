import type { IUseRepoSearchResult } from '../../hooks/useRepoSearch';

// Derived from the hook's result so the two can't drift apart.
export interface ISearchResultsProps extends Pick<
  IUseRepoSearchResult,
  | 'query'
  | 'results'
  | 'totalCount'
  | 'status'
  | 'error'
  | 'page'
  | 'pageCount'
  | 'goToPage'
  | 'retry'
> {
  /** Puts an example from the tips into the search box. */
  onPickExample: (query: string) => void;
}
