import { PERSIST_DEBOUNCE_MS } from '@/constants/trackedRepos';
import { saveTrackedRepos } from '@/domain/trackedReposStorage';

import type { AppStartListening } from './index';
import {
  refreshRepo,
  repoTracked,
  selectAllTrackedRepos,
} from './trackedRepos';

// Side effects of the watchlist live here, never in reducers.
export const addTrackedReposListeners = (
  startListening: AppStartListening,
  storage: Storage,
): void => {
  // A newly tracked repo only has what search returned — fetch the rest now.
  startListening({
    actionCreator: repoTracked,
    effect: ({ payload }, { dispatch }) => {
      void dispatch(refreshRepo(payload.id));
    },
  });

  // Persist the watchlist whenever the repos themselves change (request
  // states don't count), once per burst of changes.
  startListening({
    predicate: (_action, currentState, previousState) =>
      currentState.trackedRepos.ids !== previousState.trackedRepos.ids ||
      currentState.trackedRepos.entities !==
        previousState.trackedRepos.entities,
    effect: async (_action, listenerApi) => {
      listenerApi.cancelActiveListeners();
      await listenerApi.delay(PERSIST_DEBOUNCE_MS);
      saveTrackedRepos(storage, selectAllTrackedRepos(listenerApi.getState()));
    },
  });
};
