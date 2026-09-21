import {
  Button,
  ConfirmDialog,
  EmptyState,
  Panel,
  RelativeTime,
  Snackbar,
} from '@repo-radar/ui';
import { Telescope } from '@untitledui/icons';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router';

import { ROUTES } from '@/constants/routes';
import { TRACKED_ORDER } from '@/constants/trackedRepos';
import type { TrackedOrder } from '@/constants/trackedRepos';
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks';
import {
  refreshStaleRepos,
  repoRestored,
  repoUntracked,
  selectLastRefreshedAt,
  selectTrackedRepoIdsBy,
} from '@/store/trackedRepos';
import type { ITrackedRepo } from '@/types/repo';

import CommitRecencyChart from './components/CommitRecencyChart';
import RefreshAllButton from './components/RefreshAllButton';
import RefreshBudgetNote from './components/RefreshBudgetNote';
import SharedRadarPrompt from './components/SharedRadarPrompt';
import TrackedSortControl from './components/TrackedSortControl';
import ShareRadarButton from './components/ShareRadarButton';
import StarsChart from './components/StarsChart';
import TrackedRepoRow from './components/TrackedRepoRow';
import {
  ActionRow,
  PageActions,
  PageHeader,
  PageLead,
  PageStack,
  PageTitle,
  RowList,
} from './styles';

const EMPTY_ICON_SIZE = 22;
const UNDO_WINDOW_MS = 6000;

const TrackedReposPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const [order, setOrder] = useState<TrackedOrder>(TRACKED_ORDER.ADDED);
  const repoIds = useAppSelector((state) =>
    selectTrackedRepoIdsBy(state, order),
  );
  const lastRefreshedAt = useAppSelector(selectLastRefreshedAt);
  const [removedRepo, setRemovedRepo] = useState<ITrackedRepo | null>(null);
  const [isUndoOpen, setIsUndoOpen] = useState(false);
  const [pendingUntrack, setPendingUntrack] = useState<ITrackedRepo | null>(
    null,
  );

  // Opening the dashboard refreshes only what is stale, sparing the rate limit.
  useEffect(() => {
    void dispatch(refreshStaleRepos());
  }, [dispatch]);

  // Asked before, undoable after: the dialog catches the misclick, the
  // snackbar covers the change of mind.
  const confirmUntrack = () => {
    if (!pendingUntrack) return;
    dispatch(repoUntracked(pendingUntrack.id));
    setRemovedRepo(pendingUntrack);
    setPendingUntrack(null);
    setIsUndoOpen(true);
  };

  const handleUndo = () => {
    if (removedRepo) dispatch(repoRestored(removedRepo));
    setIsUndoOpen(false);
  };

  return (
    <PageStack>
      <title>Tracked · Repo Radar</title>
      <PageHeader>
        <div>
          <PageTitle>Tracked repositories</PageTitle>
          <PageLead>
            {repoIds.length > 0 && lastRefreshedAt ? (
              <>
                Watching {repoIds.length} · updated{' '}
                <RelativeTime date={lastRefreshedAt} />
              </>
            ) : (
              'Stars, open issues and latest commits for the repositories you track.'
            )}
          </PageLead>
        </div>
        {repoIds.length > 0 && (
          <PageActions>
            <ActionRow>
              <ShareRadarButton />
              <RefreshAllButton />
            </ActionRow>
            <RefreshBudgetNote />
          </PageActions>
        )}
      </PageHeader>

      {repoIds.length === 0 ? (
        <Panel>
          <EmptyState
            icon={<Telescope size={EMPTY_ICON_SIZE} />}
            title="Your radar is empty"
            description="Search GitHub and track a few repositories — their stars, issues and commits will show up here."
            action={
              <Button
                variant="contained"
                component={RouterLink}
                to={ROUTES.SEARCH}
              >
                Find repositories
              </Button>
            }
          />
        </Panel>
      ) : (
        <>
          <StarsChart />
          <CommitRecencyChart />
          <Panel
            title="Repositories"
            disablePadding
            actions={
              repoIds.length > 1 ? (
                <TrackedSortControl value={order} onChange={setOrder} />
              ) : undefined
            }
          >
            <RowList>
              {repoIds.map((id) => (
                <TrackedRepoRow
                  key={id}
                  repoId={id}
                  onUntrack={setPendingUntrack}
                />
              ))}
            </RowList>
          </Panel>
        </>
      )}

      <SharedRadarPrompt />

      <ConfirmDialog
        open={pendingUntrack !== null}
        tone="danger"
        title={`Stop tracking ${pendingUntrack?.fullName ?? ''}?`}
        description="It leaves your radar and the stars chart straight away."
        confirmLabel="Stop tracking"
        cancelLabel="Keep tracking"
        onConfirm={confirmUntrack}
        onCancel={() => {
          setPendingUntrack(null);
        }}
      />

      <Snackbar
        open={isUndoOpen}
        autoHideDuration={UNDO_WINDOW_MS}
        onClose={(_event, reason) => {
          if (reason !== 'clickaway') setIsUndoOpen(false);
        }}
        message={`Stopped tracking ${removedRepo?.fullName ?? ''}`}
        action={
          <Button
            variant="text"
            size="small"
            color="inherit"
            onClick={handleUndo}
          >
            Undo
          </Button>
        }
      />
    </PageStack>
  );
};

export default TrackedReposPage;
