import {
  ErrorNotice,
  IconButton,
  LanguageDot,
  Metric,
  RelativeTime,
  Tooltip,
  formatCompactNumber,
  formatNumber,
  useNow,
} from '@repo-radar/ui';
import {
  AlertCircle,
  GitCommit,
  RefreshCw01,
  Star01,
  Trash01,
} from '@untitledui/icons';

import RepoIdentity from '@/components/RepoIdentity';
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks';
import {
  refreshRepo,
  selectRepoRequest,
  selectTrackedRepoById,
} from '@/store/trackedRepos';
import { REQUEST_STATUS } from '@/types/request';
import { describeError, isRetryable } from '@/utils/describeError';

import {
  RowActions,
  RowFooter,
  RowProgress,
  RowRoot,
  RowStats,
} from './styles';
import type { ITrackedRepoRowProps } from './types';

const ICON_SIZE = 14;
const ACTION_ICON_SIZE = 16;
const CLOCK_TICK_MS = 30_000;

/**
 * One tracked repo. It selects only its own entity and request, so a refresh
 * re-renders this row alone — and its loading and errors stay its own.
 */
const TrackedRepoRow: React.FC<ITrackedRepoRowProps> = ({
  repoId,
  onUntrack,
}) => {
  const dispatch = useAppDispatch();
  const repo = useAppSelector((state) => selectTrackedRepoById(state, repoId));
  const request = useAppSelector((state) => selectRepoRequest(state, repoId));
  const now = useNow(CLOCK_TICK_MS);

  if (!repo) return null;

  const isRefreshing = request?.status === REQUEST_STATUS.LOADING;
  const error =
    request?.status === REQUEST_STATUS.FAILED ? request.error : null;
  const { stars, openIssues, lastCommitAt } = repo.stats;

  const refresh = () => {
    void dispatch(refreshRepo(repo.id));
  };

  const renderLastCommit = () => {
    if (lastCommitAt) return <RelativeTime date={lastCommitAt} />;
    return repo.refreshedAt ? 'No commits yet' : '—';
  };

  const renderStatus = () => {
    if (error) {
      return (
        <ErrorNotice
          message={describeError(error, now)}
          onRetry={isRetryable(error) ? refresh : undefined}
        />
      );
    }
    if (repo.refreshedAt) {
      return (
        <>
          Updated <RelativeTime date={repo.refreshedAt} />
        </>
      );
    }
    return isRefreshing ? 'Fetching the latest stats…' : 'Not refreshed yet';
  };

  return (
    <RowRoot aria-busy={isRefreshing}>
      <div>
        <RepoIdentity repo={repo} />
        <RowStats>
          {repo.language && <LanguageDot language={repo.language} />}
          <Metric
            icon={<Star01 size={ICON_SIZE} />}
            label="Stars"
            tooltip={formatNumber(stars)}
          >
            {formatCompactNumber(stars)}
          </Metric>
          <Metric
            icon={<AlertCircle size={ICON_SIZE} />}
            label="Open issues"
            tooltip={`${formatNumber(openIssues)} (GitHub counts open pull requests too)`}
          >
            {formatCompactNumber(openIssues)}
          </Metric>
          <Metric
            icon={<GitCommit size={ICON_SIZE} />}
            label="Last commit"
            loading={isRefreshing && repo.refreshedAt === null}
          >
            {renderLastCommit()}
          </Metric>
        </RowStats>
      </div>
      <RowActions>
        <Tooltip title="Refresh">
          <IconButton
            aria-label={`Refresh ${repo.fullName}`}
            loading={isRefreshing}
            onClick={refresh}
          >
            <RefreshCw01 size={ACTION_ICON_SIZE} aria-hidden />
          </IconButton>
        </Tooltip>
        <Tooltip title="Stop tracking">
          <IconButton
            aria-label={`Stop tracking ${repo.fullName}`}
            onClick={() => {
              onUntrack(repo);
            }}
          >
            <Trash01 size={ACTION_ICON_SIZE} aria-hidden />
          </IconButton>
        </Tooltip>
      </RowActions>
      <RowFooter>{renderStatus()}</RowFooter>
      {isRefreshing && <RowProgress aria-hidden />}
    </RowRoot>
  );
};

export default TrackedRepoRow;
