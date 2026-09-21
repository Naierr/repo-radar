import { useSearchParams } from 'react-router';

import {
  MAX_SHARED_REPOS,
  SHARED_REPOS_PARAM,
  isRepoFullName,
} from '@/constants/sharedRadar';
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks';
import { importSharedRepos, selectAllTrackedRepos } from '@/store/trackedRepos';

export interface IUseSharedRadarResult {
  /** Valid, not-yet-tracked repositories the link is offering. */
  offered: string[];
  accept: () => void;
  dismiss: () => void;
}

/**
 * A shared link proposes repositories; it never adds them. Opening someone
 * else's radar should show you what is in it and let you decide, the same way
 * you would decide in search.
 */
export const useSharedRadar = (): IUseSharedRadarResult => {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const tracked = useAppSelector(selectAllTrackedRepos);

  const trackedNames = new Set(
    tracked.map((repo) => repo.fullName.toLowerCase()),
  );
  const offered = [
    ...new Set(
      (searchParams.get(SHARED_REPOS_PARAM) ?? '')
        .split(',')
        .map((name) => name.trim())
        .filter(isRepoFullName),
    ),
  ]
    .filter((name) => !trackedNames.has(name.toLowerCase()))
    .slice(0, MAX_SHARED_REPOS);

  // The invitation is spent once answered, either way: replace rather than
  // push, so Back does not walk into the same question again.
  const clear = () => {
    setSearchParams(
      (params) => {
        params.delete(SHARED_REPOS_PARAM);
        return params;
      },
      { replace: true },
    );
  };

  return {
    offered,
    accept: () => {
      void dispatch(importSharedRepos(offered));
      clear();
    },
    dismiss: clear,
  };
};
