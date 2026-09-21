import { Button, Tooltip } from '@repo-radar/ui';
import { RefreshCw01 } from '@untitledui/icons';

import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks';
import { refreshAllRepos, selectRefreshingCount } from '@/store/trackedRepos';

import { useRefreshBudget } from '../../hooks/useRefreshBudget';
import { BudgetNote, RefreshGroup } from './styles';

const ICON_SIZE = 16;

const plural = (count: number, one: string, many: string): string =>
  `${count} ${count === 1 ? one : many}`;

const RefreshAllButton: React.FC = () => {
  const dispatch = useAppDispatch();
  const refreshingCount = useAppSelector(selectRefreshingCount);
  const { repoCount, cost, requestsLeft, isAffordable, resetsIn } =
    useRefreshBudget();
  const isRefreshing = refreshingCount > 0;

  const repos = plural(repoCount, 'repository', 'repositories');

  return (
    <RefreshGroup>
      {/* The price is quoted before it is paid. */}
      <Tooltip
        title={`Refreshes ${repos} · ${plural(cost, 'GitHub request', 'GitHub requests')}`}
      >
        <span>
          <Button
            variant="contained"
            startIcon={<RefreshCw01 size={ICON_SIZE} aria-hidden />}
            loading={isRefreshing}
            loadingPosition="start"
            disabled={!isAffordable}
            onClick={() => {
              void dispatch(refreshAllRepos());
            }}
          >
            {isRefreshing ? `Refreshing ${refreshingCount}…` : 'Refresh all'}
          </Button>
        </span>
      </Tooltip>

      {!isAffordable && (
        <BudgetNote>
          Refreshing {repos} needs {plural(cost, 'request', 'requests')} and{' '}
          {requestsLeft} {requestsLeft === 1 ? 'is' : 'are'} left
          {resetsIn === null ? '' : ` — the limit resets ${resetsIn}`}. Refresh
          the rows you care about instead.
        </BudgetNote>
      )}
    </RefreshGroup>
  );
};

export default RefreshAllButton;
