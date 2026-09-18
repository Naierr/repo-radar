import {
  combineReducers,
  configureStore,
  createListenerMiddleware,
} from '@reduxjs/toolkit';
import type {
  ThunkDispatch,
  TypedStartListening,
  UnknownAction,
} from '@reduxjs/toolkit';

import { githubApi } from '@/api/githubApi';
import type { GitHubApi } from '@/api/githubApi';

import rateLimitSlice from './rateLimit';
import searchSlice from './search';
import trackedReposSlice from './trackedRepos';
import { addTrackedReposListeners } from './trackedRepos.listeners';

const rootReducer = combineReducers({
  search: searchSlice.reducer,
  trackedRepos: trackedReposSlice.reducer,
  rateLimit: rateLimitSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

/** What thunks and listeners receive besides the store — the seam tests swap. */
export interface IThunkExtra {
  githubApi: GitHubApi;
}

export type AppDispatch = ThunkDispatch<RootState, IThunkExtra, UnknownAction>;
export type AppStartListening = TypedStartListening<
  RootState,
  AppDispatch,
  IThunkExtra
>;

export interface ISetupStoreOptions {
  preloadedState?: Partial<RootState>;
  extra?: IThunkExtra;
  storage?: Storage;
}

export const setupStore = ({
  preloadedState,
  extra = { githubApi },
  storage = window.localStorage,
}: ISetupStoreOptions = {}) => {
  const listenerMiddleware = createListenerMiddleware<
    RootState,
    AppDispatch,
    IThunkExtra
  >({ extra });
  addTrackedReposListeners(listenerMiddleware.startListening, storage);

  return configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ thunk: { extraArgument: extra } }).prepend(
        listenerMiddleware.middleware,
      ),
  });
};

export type AppStore = ReturnType<typeof setupStore>;
