import {
  Checkbox,
  ConfirmDialog,
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
  FlipBackward,
  GitCommit,
  RefreshCw01,
  Star01,
  Trash01,
} from '@untitledui/icons';
import { useState } from 'react';

import RepoIdentity from '@/components/RepoIdentity';
import TrendDelta from '@/components/TrendDelta';
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks';
import {
  refreshRepo,
  selectRepoRequest,
  selectRepoTrend,
  selectTrackedRepoById,
  trendReset,
} from '@/store/trackedRepos';
import { REQUEST_STATUS } from '@/types/request';
import { describeError, isRetryable } from '@/utils/describeError';

import {
  RowActions,
  RowFooter,
  RowProgress,
  RowRoot,
  RowSelect,
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
  selected,
  selectedIds,
  onSelectToggle,
}) => {
  const dispatch = useAppDispatch();
  const repo = useAppSelector((state) => selectTrackedRepoById(state, repoId));
  const request = useAppSelector((state) => selectRepoRequest(state, repoId));
  const trend = useAppSelector((state) => selectRepoTrend(state, repoId));
  const now = useNow(CLOCK_TICK_MS);
  const [isResetting, setIsResetting] = useState(false);

  if (!repo) return null;

  const isRefreshing = request?.status === REQUEST_STATUS.LOADING;
  const error =
    request?.status === REQUEST_STATUS.FAILED ? request.error : null;
  const { stars, openIssues, lastCommitAt } = repo.stats;

  // Acting on a selected row acts on the selection; acting on an unselected
  // one acts on it alone, the way a file list behaves.
  const targets = selected && selectedIds.length > 0 ? selectedIds : [repo.id];
  const isBulk = targets.length > 1;
  const others = targets.length - 1;
  // Named from this row outwards, so two selected rows never carry the same
  // accessible name while both still say what they would do.
  const describeTarget = isBulk
    ? `${repo.fullName} and ${String(others)} other selected ${others === 1 ? 'repository' : 'repositories'}`
    : repo.fullName;
  const forSelection = `${String(targets.length)} selected`;

  const refresh = () => {
    for (const id of targets) void dispatch(refreshRepo(id));
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
    // Named so the browser can match this row to itself after a reorder.
    <RowRoot
      aria-busy={isRefreshing}
      style={{ viewTransitionName: `repo-${String(repo.id)}` }}
    >
      <RowSelect>
        <Checkbox
          size="small"
          checked={selected}
          onChange={() => {
            onSelectToggle(repo.id);
          }}
          slotProps={{ input: { 'aria-label': `Select ${repo.fullName}` } }}
        />
      </RowSelect>
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
          {trend && (
            <TrendDelta
              delta={trend.starsDelta}
              since={trend.since}
              unit="stars"
            />
          )}
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
        {trend && trend.points.length > 1 && (
          <Tooltip title="Reset trend">
            <IconButton
              aria-label={`Reset the trend for ${repo.fullName}`}
              onClick={() => {
                setIsResetting(true);
              }}
            >
              <FlipBackward size={ACTION_ICON_SIZE} aria-hidden />
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title={isBulk ? `Refresh ${forSelection}` : 'Refresh'}>
          <IconButton
            aria-label={`Refresh ${describeTarget}`}
            loading={isRefreshing}
            onClick={refresh}
          >
            <RefreshCw01 size={ACTION_ICON_SIZE} aria-hidden />
          </IconButton>
        </Tooltip>
        <Tooltip
          title={isBulk ? `Stop tracking ${forSelection}` : 'Stop tracking'}
        >
          <IconButton
            aria-label={`Stop tracking ${describeTarget}`}
            onClick={() => {
              onUntrack(targets);
            }}
          >
            <Trash01 size={ACTION_ICON_SIZE} aria-hidden />
          </IconButton>
        </Tooltip>
      </RowActions>
      <ConfirmDialog
        open={isResetting}
        tone="danger"
        title={`Reset the trend for ${repo.fullName}?`}
        description="Its recorded history is discarded and the trend starts again from today's numbers. GitHub cannot give those readings back."
        confirmLabel="Reset trend"
        cancelLabel="Keep the history"
        onConfirm={() => {
          dispatch(trendReset(repo.id));
          setIsResetting(false);
        }}
        onCancel={() => {
          setIsResetting(false);
        }}
      />
      <RowFooter>{renderStatus()}</RowFooter>
      {isRefreshing && <RowProgress aria-hidden />}
    </RowRoot>
  );
};

export default TrackedRepoRow;
