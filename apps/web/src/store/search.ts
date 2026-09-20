import { createSlice } from '@reduxjs/toolkit';

import { createAppError, normalizeApiError } from '@/api/apiError';
import { FIRST_PAGE, SEARCH_PAGE_SIZE } from '@/constants/search';
import type { IRepoSummary, ISearchPage } from '@/types/repo';
import { APP_ERROR_KIND, REQUEST_STATUS } from '@/types/request';
import type { IAppError, RequestStatus } from '@/types/request';

import { createAppAsyncThunk } from './createAppAsyncThunk';

export interface ISearchState {
  /** The query the current results (or request) belong to. */
  query: string;
  page: number;
  results: IRepoSummary[];
  totalCount: number;
  status: RequestStatus;
  error: IAppError | null;
  /** The latest request — responses from older ones are dropped. */
  requestId: string | null;
}

export interface ISearchArgs {
  query: string;
  page: number;
}

const initialState: ISearchState = {
  query: '',
  page: FIRST_PAGE,
  results: [],
  totalCount: 0,
  status: REQUEST_STATUS.IDLE,
  error: null,
  requestId: null,
};

export const searchRepos = createAppAsyncThunk<ISearchPage, ISearchArgs>(
  'search/searchRepos',
  async ({ query, page }, { extra, signal, rejectWithValue }) => {
    try {
      return await extra.githubApi.searchRepositories(
        { query, page, perPage: SEARCH_PAGE_SIZE },
        { signal },
      );
    } catch (error) {
      return rejectWithValue(normalizeApiError(error));
    }
  },
);

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    searchCleared: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchRepos.pending, (state, { meta }) => {
        // A new query invalidates what is on screen, so it goes now rather than
        // when the response lands — otherwise the header names the new query
        // while the rows below it still belong to the old one. Paging through
        // the same query keeps its total, which is still that query's answer.
        if (meta.arg.query !== state.query) {
          state.results = [];
          state.totalCount = 0;
        }
        state.query = meta.arg.query;
        state.page = meta.arg.page;
        state.status = REQUEST_STATUS.LOADING;
        state.error = null;
        state.requestId = meta.requestId;
      })
      .addCase(searchRepos.fulfilled, (state, { meta, payload }) => {
        if (meta.requestId !== state.requestId) return;
        state.results = payload.items;
        state.totalCount = payload.totalCount;
        state.status = REQUEST_STATUS.SUCCEEDED;
      })
      .addCase(searchRepos.rejected, (state, { meta, payload }) => {
        // A superseded or cancelled request is not a failure the user needs to see.
        if (meta.requestId !== state.requestId || meta.aborted) return;
        state.status = REQUEST_STATUS.FAILED;
        state.error = payload ?? createAppError(APP_ERROR_KIND.UNKNOWN);
      });
  },
});

export const { searchCleared } = searchSlice.actions;

interface ISearchRoot {
  search: ISearchState;
}

export const selectSearch = (state: ISearchRoot) => state.search;
export const selectSearchQuery = (state: ISearchRoot) => state.search.query;

export default searchSlice;
