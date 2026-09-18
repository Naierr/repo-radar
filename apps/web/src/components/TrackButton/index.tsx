import { Tooltip } from '@repo-radar/ui';
import { Check, Eye } from '@untitledui/icons';

import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks';
import {
  repoTracked,
  repoUntracked,
  selectIsRepoTracked,
} from '@/store/trackedRepos';

import { ToggleButton } from './styles';
import type { ITrackButtonProps } from './types';

const ICON_SIZE = 14;

/** A toggle: its name stays "Track"; `aria-pressed` carries the state. */
const TrackButton: React.FC<ITrackButtonProps> = ({ repo }) => {
  const dispatch = useAppDispatch();
  const isTracked = useAppSelector((state) =>
    selectIsRepoTracked(state, repo.id),
  );

  const toggle = () => {
    dispatch(isTracked ? repoUntracked(repo.id) : repoTracked(repo));
  };

  return (
    <Tooltip title={isTracked ? 'On your radar — click to stop tracking' : ''}>
      <ToggleButton
        size="small"
        aria-pressed={isTracked}
        aria-label={`Track ${repo.fullName}`}
        startIcon={
          isTracked ? (
            <Check size={ICON_SIZE} aria-hidden />
          ) : (
            <Eye size={ICON_SIZE} aria-hidden />
          )
        }
        onClick={toggle}
      >
        Track
      </ToggleButton>
    </Tooltip>
  );
};

export default TrackButton;
