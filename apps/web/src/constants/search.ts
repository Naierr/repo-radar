export const SEARCH_DEBOUNCE_MS = 400;
/** Shorter queries match almost everything and burn the 10-a-minute search budget. */
export const MIN_QUERY_LENGTH = 2;
export const SEARCH_PAGE_SIZE = 20;
export const FIRST_PAGE = 1;
/** GitHub's search API never returns results past the first 1,000. */
export const MAX_SEARCH_RESULTS = 1000;
