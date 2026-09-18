import { Button } from '@repo-radar/ui';
import { RefreshCw01 } from '@untitledui/icons';

import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks';
import { refreshAllRepos, selectRefreshingCount } from '@/store/trackedRepos';

const ICON_SIZE = 16;

const RefreshAllButton: React.FC = () => {
  const dispatch = useAppDispatch();
  const refreshingCount = useAppSelector(selectRefreshingCount);
  const isRefreshing = refreshingCount > 0;

  return (
    <Button
      variant="contained"
      startIcon={<RefreshCw01 size={ICON_SIZE} aria-hidden />}
      loading={isRefreshing}
      loadingPosition="start"
      onClick={() => {
        void dispatch(refreshAllRepos());
      }}
    >
      {isRefreshing ? `Refreshing ${refreshingCount}…` : 'Refresh all'}
    </Button>
  );
};

export default RefreshAllButton;
