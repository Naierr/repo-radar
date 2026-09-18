import { useCallback, useEffect, useRef, useState } from 'react';

import {
  FIRST_PAGE,
  MAX_SEARCH_RESULTS,
  MIN_QUERY_LENGTH,
  SEARCH_DEBOUNCE_MS,
  SEARCH_PAGE_SIZE,
} from '@/constants/search';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks';
import { searchCleared, searchRepos, selectSearch } from '@/store/search';
import type { ISearchArgs, ISearchState } from '@/store/search';

export interface IUseRepoSearchResult extends ISearchState {
  /** What is in the box right now — the search follows it after a pause. */
  input: string;
  setInput: (value: string) => void;
  pageCount: number;
  goToPage: (page: number) => void;
  retry: () => void;
}

interface IAbortable {
  abort: () => void;
}

/**
 * Debounced search with cancel-on-change: a new query aborts the request it
 * replaces. Results live in the store, so they survive leaving the page.
 */
export const useRepoSearch = (): IUseRepoSearchResult => {
  const dispatch = useAppDispatch();
  const search = useAppSelector(selectSearch);
  const [input, setInput] = useState(search.query);
  const query = useDebouncedValue(input.trim(), SEARCH_DEBOUNCE_MS);
  const inFlight = useRef<IAbortable | null>(null);

  // Stable so the effect below only re-runs when the query changes.
  const run = useCallback(
    (args: ISearchArgs) => {
      inFlight.current?.abort();
      inFlight.current = dispatch(searchRepos(args));
    },
    [dispatch],
  );

  useEffect(() => {
    if (query === search.query) return;
    if (query.length < MIN_QUERY_LENGTH) {
      inFlight.current?.abort();
      dispatch(searchCleared());
      return;
    }
    run({ query, page: FIRST_PAGE });
  }, [dispatch, query, run, search.query]);

  const pageCount = Math.min(
    Math.ceil(search.totalCount / SEARCH_PAGE_SIZE),
    MAX_SEARCH_RESULTS / SEARCH_PAGE_SIZE,
  );

  return {
    ...search,
    input,
    setInput,
    pageCount,
    goToPage: (page) => {
      run({ query: search.query, page });
    },
    retry: () => {
      run({ query: search.query, page: search.page });
    },
  };
};
