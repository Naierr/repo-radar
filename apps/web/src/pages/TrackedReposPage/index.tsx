import {
  Button,
  EmptyState,
  Panel,
  RelativeTime,
  Snackbar,
} from '@repo-radar/ui';
import { Telescope } from '@untitledui/icons';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router';

import { ROUTES } from '@/constants/routes';
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks';
import {
  refreshStaleRepos,
  repoRestored,
  repoUntracked,
  selectLastRefreshedAt,
  selectTrackedRepoIds,
} from '@/store/trackedRepos';
import type { ITrackedRepo } from '@/types/repo';

import RefreshAllButton from './components/RefreshAllButton';
import StarsChart from './components/StarsChart';
import TrackedRepoRow from './components/TrackedRepoRow';
import { PageHeader, PageLead, PageStack, PageTitle, RowList } from './styles';

const EMPTY_ICON_SIZE = 22;
const UNDO_WINDOW_MS = 6000;

const TrackedReposPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const repoIds = useAppSelector(selectTrackedRepoIds);
  const lastRefreshedAt = useAppSelector(selectLastRefreshedAt);
  const [removedRepo, setRemovedRepo] = useState<ITrackedRepo | null>(null);
  const [isUndoOpen, setIsUndoOpen] = useState(false);

  // Opening the dashboard refreshes only what is stale, sparing the rate limit.
  useEffect(() => {
    void dispatch(refreshStaleRepos());
  }, [dispatch]);

  const handleUntrack = (repo: ITrackedRepo) => {
    dispatch(repoUntracked(repo.id));
    setRemovedRepo(repo);
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
        {repoIds.length > 0 && <RefreshAllButton />}
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
          <Panel title="Repositories" disablePadding>
            <RowList>
              {repoIds.map((id) => (
                <TrackedRepoRow
                  key={id}
                  repoId={id}
                  onUntrack={handleUntrack}
                />
              ))}
            </RowList>
          </Panel>
        </>
      )}

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
