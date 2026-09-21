import { Button, ConfirmDialog, Tooltip } from '@repo-radar/ui';
import { RefreshCw01 } from '@untitledui/icons';
import { useState } from 'react';

import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks';
import { refreshAllRepos, selectRefreshingCount } from '@/store/trackedRepos';

import { useRefreshBudget } from '../../hooks/useRefreshBudget';

const ICON_SIZE = 16;

const plural = (count: number, one: string, many: string): string =>
  `${count} ${count === 1 ? one : many}`;

const RefreshAllButton: React.FC = () => {
  const dispatch = useAppDispatch();
  const refreshingCount = useAppSelector(selectRefreshingCount);
  const { repoCount, cost, requestsLeft, isAffordable, isCostly, resetsIn } =
    useRefreshBudget();
  const [isConfirming, setIsConfirming] = useState(false);
  const isRefreshing = refreshingCount > 0;

  const repos = plural(repoCount, 'repository', 'repositories');
  const requests = plural(cost, 'request', 'requests');

  const start = () => {
    setIsConfirming(false);
    void dispatch(refreshAllRepos());
  };

  return (
    <>
      {/* The price is quoted before it is paid. A disabled button fires no
          pointer events, so the tooltip listens above it. */}
      <Tooltip title={`Refreshes ${repos} · ${requests}`}>
        <span>
          <Button
            variant="contained"
            startIcon={<RefreshCw01 size={ICON_SIZE} aria-hidden />}
            loading={isRefreshing}
            loadingPosition="start"
            disabled={!isAffordable}
            onClick={() => {
              if (isCostly) setIsConfirming(true);
              else start();
            }}
          >
            {isRefreshing ? `Refreshing ${refreshingCount}…` : 'Refresh all'}
          </Button>
        </span>
      </Tooltip>

      <ConfirmDialog
        open={isConfirming}
        title={`Refresh all ${repos}?`}
        description="GitHub limits anonymous visitors, and this would use most of what is left this hour."
        details={`Spends ${requests} of the ${String(requestsLeft)} left${resetsIn === null ? '' : ` · resets ${resetsIn}`}`}
        confirmLabel="Refresh all"
        cancelLabel="Not now"
        onConfirm={start}
        onCancel={() => {
          setIsConfirming(false);
        }}
      />
    </>
  );
};

export default RefreshAllButton;
