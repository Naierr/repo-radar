import type { IUseRepoSearchResult } from '../../hooks/useRepoSearch';

export type ISearchResultsProps = Pick<
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
>;
