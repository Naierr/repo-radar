import type { UnknownAction } from '@reduxjs/toolkit';
import { describe, expect, it } from 'vitest';

import { buildRepoSummary } from '@/__tests__/_support/builders';
import { createAppError } from '@/api/apiError';

import searchSlice, { searchCleared, searchRepos } from './search';
import type { ISearchArgs } from './search';

const ARGS: ISearchArgs = { query: 'radar', page: 1 };
const PAGE = { totalCount: 1, items: [buildRepoSummary()] };

const reduce = (...actions: UnknownAction[]) =>
  actions.reduce(searchSlice.reducer, searchSlice.getInitialState());

const abortError = Object.assign(new Error('Aborted'), { name: 'AbortError' });

describe('search slice', () => {
  it('remembers the query and page while GitHub answers', () => {
    const state = reduce(
      searchRepos.pending('req-1', { query: 'radar', page: 3 }),
    );

    expect(state).toMatchObject({
      query: 'radar',
      page: 3,
      status: 'loading',
      requestId: 'req-1',
    });
  });

  it('stores the answer to the latest request', () => {
    const state = reduce(
      searchRepos.pending('req-1', ARGS),
      searchRepos.fulfilled(PAGE, 'req-1', ARGS),
    );

    expect(state).toMatchObject({
      status: 'succeeded',
      results: PAGE.items,
      totalCount: 1,
    });
  });

  it('drops an answer that arrives after a newer request started', () => {
    const newer = { query: 'radar scope', page: 1 };
    const state = reduce(
      searchRepos.pending('req-1', ARGS),
      searchRepos.pending('req-2', newer),
      searchRepos.fulfilled(PAGE, 'req-1', ARGS),
    );

    expect(state).toMatchObject({
      query: 'radar scope',
      status: 'loading',
      results: [],
    });
  });

  it('records a failure with the error to show', () => {
    const error = createAppError('rate_limited', {
      resetAt: '2026-09-18T12:10:00.000Z',
    });
    const state = reduce(
      searchRepos.pending('req-1', ARGS),
      searchRepos.rejected(null, 'req-1', ARGS, error),
    );

    expect(state).toMatchObject({ status: 'failed', error });
  });

  it('does not treat a cancelled request as a failure', () => {
    const state = reduce(
      searchRepos.pending('req-1', ARGS),
      searchRepos.rejected(abortError, 'req-1', ARGS),
    );

    expect(state.status).toBe('loading');
    expect(state.error).toBeNull();
  });

  it('forgets everything when the search is cleared', () => {
    const state = reduce(
      searchRepos.pending('req-1', ARGS),
      searchRepos.fulfilled(PAGE, 'req-1', ARGS),
      searchCleared(),
    );

    expect(state).toEqual(searchSlice.getInitialState());
  });
});
