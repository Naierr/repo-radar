import {
  createEntityAdapter,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import type { EntityState, PayloadAction } from '@reduxjs/toolkit';

import { createAppError, normalizeApiError } from '@/api/apiError';
import { STALE_AFTER_MS } from '@/constants/trackedRepos';
import type { IRepoSnapshot, IRepoSummary, ITrackedRepo } from '@/types/repo';
import { APP_ERROR_KIND, REQUEST_STATUS } from '@/types/request';
import type { IRequestState } from '@/types/request';

import { REQUESTS_PER_REPO_REFRESH } from '@/api/constants';

import { createAppAsyncThunk } from './createAppAsyncThunk';
import { selectCoreRequestsLeft } from './rateLimit';

export const trackedReposAdapter = createEntityAdapter<ITrackedRepo>({
  // Most recently tracked first.
  sortComparer: (a, b) => b.trackedAt.localeCompare(a.trackedAt),
});

export interface ITrackedReposState extends EntityState<ITrackedRepo, number> {
  /** Request state per repo — transient, so it is never persisted. */
  requests: Partial<Record<number, IRequestState>>;
}

export const createTrackedReposState = (
  repos: ITrackedRepo[] = [],
): ITrackedReposState =>
  trackedReposAdapter.setAll(
    { ...trackedReposAdapter.getInitialState(), requests: {} },
    repos,
  );

// ── Selectors ──

interface ITrackedReposRoot {
  trackedRepos: ITrackedReposState;
}

const adapterSelectors = trackedReposAdapter.getSelectors(
  (state: ITrackedReposRoot) => state.trackedRepos,
);

export const selectAllTrackedRepos = adapterSelectors.selectAll;
export const selectTrackedRepoIds = adapterSelectors.selectIds;
export const selectTrackedRepoCount = adapterSelectors.selectTotal;

export const selectTrackedRepoById = (
  state: ITrackedReposRoot,
  id: number,
): ITrackedRepo | undefined => state.trackedRepos.entities[id];

export const selectIsRepoTracked = (state: ITrackedReposRoot, id: number) =>
  selectTrackedRepoById(state, id) !== undefined;

export const selectRepoRequest = (
  state: ITrackedReposRoot,
  id: number,
): IRequestState | undefined => state.trackedRepos.requests[id];

export const selectRefreshingCount = createSelector(
  [(state: ITrackedReposRoot) => state.trackedRepos.requests],
  (requests) =>
    Object.values(requests).filter(
      (request) => request?.status === REQUEST_STATUS.LOADING,
    ).length,
);

/** The most recent refresh across all repos — ISO strings sort chronologically. */
export const selectLastRefreshedAt = createSelector(
  [selectAllTrackedRepos],
  (repos) =>
    repos.reduce<string | null>(
      (latest, { refreshedAt }) =>
        refreshedAt && (!latest || refreshedAt > latest) ? refreshedAt : latest,
      null,
    ),
);

export const selectStarsChartData = createSelector(
  [selectAllTrackedRepos],
  (repos) =>
    [...repos]
      .sort((a, b) => b.stats.stars - a.stats.stars)
      .map((repo) => ({
        id: String(repo.id),
        label: repo.fullName,
        value: repo.stats.stars,
      })),
);

// ── Thunks ──

export interface IRefreshedRepo extends IRepoSnapshot {
  refreshedAt: string;
}

export const refreshRepo = createAppAsyncThunk<IRefreshedRepo, number>(
  'trackedRepos/refreshRepo',
  async (id, { getState, extra, signal, rejectWithValue }) => {
    const repo = selectTrackedRepoById(getState(), id);
    if (!repo) return rejectWithValue(createAppError(APP_ERROR_KIND.NOT_FOUND));

    try {
      const snapshot = await extra.githubApi.fetchRepoSnapshot(repo.fullName, {
        signal,
      });
      return { ...snapshot, refreshedAt: new Date().toISOString() };
    } catch (error) {
      return rejectWithValue(normalizeApiError(error));
    }
  },
  {
    // Untracked repos, and repos already on their way back, are skipped —
    // a double click or an overlapping "refresh all" costs one request.
    condition: (id, { getState }) => {
      const state = getState();
      return (
        selectIsRepoTracked(state, id) &&
        selectRepoRequest(state, id)?.status !== REQUEST_STATUS.LOADING
      );
    },
  },
);

/** Refreshes every repo on its own: one failure never holds up the others. */
export const refreshAllRepos = createAppAsyncThunk(
  'trackedRepos/refreshAllRepos',
  async (_, { dispatch, getState }) => {
    // Each dispatch settles with its own fulfilled/rejected action; none throws.
    await Promise.all(
      selectTrackedRepoIds(getState()).map((id) => dispatch(refreshRepo(id))),
    );
  },
);

const isStale = (repo: ITrackedRepo, now: number): boolean =>
  repo.refreshedAt === null ||
  now - Date.parse(repo.refreshedAt) > STALE_AFTER_MS;

/** Refreshes only what is out of date, so opening the dashboard is cheap. */
export const refreshStaleRepos = createAppAsyncThunk(
  'trackedRepos/refreshStaleRepos',
  async (_, { dispatch, getState }) => {
    const now = Date.now();
    const state = getState();
    const staleIds = selectAllTrackedRepos(state)
      .filter((repo) => isStale(repo, now))
      .map((repo) => repo.id);

    // Merely opening the page must never spend the budget the user needs for
    // the refresh they actually asked for. Stale figures stay on screen with
    // their age beside them, which beats an empty budget and a row of errors.
    const requestsLeft = selectCoreRequestsLeft(state, now);
    const cost = staleIds.length * REQUESTS_PER_REPO_REFRESH;
    if (requestsLeft !== null && cost > requestsLeft) return;

    await Promise.all(staleIds.map((id) => dispatch(refreshRepo(id))));
  },
);

// ── Slice ──

const trackedReposSlice = createSlice({
  name: 'trackedRepos',
  initialState: createTrackedReposState(),
  reducers: {
    repoTracked: {
      reducer: (state, { payload }: PayloadAction<ITrackedRepo>) => {
        trackedReposAdapter.addOne(state, payload);
      },
      // The search hit already knows stars and issues; the refresh that
      // follows (see the listeners) fills in the last commit.
      prepare: ({ stars, openIssues, ...identity }: IRepoSummary) => ({
        payload: {
          ...identity,
          trackedAt: new Date().toISOString(),
          stats: { stars, openIssues, lastCommitAt: null },
          refreshedAt: null,
        },
      }),
    },
    repoUntracked: (state, { payload: id }: PayloadAction<number>) => {
      trackedReposAdapter.removeOne(state, id);
      state.requests[id] = undefined;
    },
    /** Puts back a repo exactly as it was — the undo for an untrack. */
    repoRestored: (state, { payload }: PayloadAction<ITrackedRepo>) => {
      trackedReposAdapter.addOne(state, payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(refreshRepo.pending, (state, { meta }) => {
        state.requests[meta.arg] = {
          status: REQUEST_STATUS.LOADING,
          error: null,
        };
      })
      .addCase(refreshRepo.fulfilled, (state, { meta, payload }) => {
        // The repo may have been untracked while its request was in flight.
        if (!state.entities[meta.arg]) return;
        trackedReposAdapter.updateOne(state, {
          id: meta.arg,
          changes: {
            ...payload.identity,
            stats: payload.stats,
            refreshedAt: payload.refreshedAt,
          },
        });
        state.requests[meta.arg] = {
          status: REQUEST_STATUS.SUCCEEDED,
          error: null,
        };
      })
      .addCase(refreshRepo.rejected, (state, { meta, payload }) => {
        if (!state.entities[meta.arg]) return;
        state.requests[meta.arg] = {
          status: REQUEST_STATUS.FAILED,
          error: payload ?? createAppError(APP_ERROR_KIND.UNKNOWN),
        };
      });
  },
});

export const { repoTracked, repoUntracked, repoRestored } =
  trackedReposSlice.actions;

export default trackedReposSlice;
