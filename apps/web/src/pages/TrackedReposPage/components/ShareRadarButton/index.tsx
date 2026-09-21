import { Button, Snackbar, Tooltip } from '@repo-radar/ui';
import { Link01 } from '@untitledui/icons';
import { useState } from 'react';

import { ROUTES } from '@/constants/routes';
import { SHARED_REPOS_PARAM } from '@/constants/sharedRadar';
import { useAppSelector } from '@/hooks/useReduxHooks';
import { selectAllTrackedRepos } from '@/store/trackedRepos';

const ICON_SIZE = 16;
const COPIED_MESSAGE_MS = 4000;

const ShareRadarButton: React.FC = () => {
  const repos = useAppSelector(selectAllTrackedRepos);
  const [copied, setCopied] = useState<boolean | null>(null);

  const share = async () => {
    const names = repos.map((repo) => repo.fullName).join(',');
    const link = `${window.location.origin}${ROUTES.TRACKED}?${SHARED_REPOS_PARAM}=${encodeURIComponent(names)}`;

    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
    } catch {
      // Clipboard access is refused in some browsers and contexts; saying so
      // beats a button that looks like it worked.
      setCopied(false);
    }
  };

  return (
    <>
      <Tooltip title="Copies a link that offers these repositories to whoever opens it">
        <Button
          variant="outlined"
          color="inherit"
          startIcon={<Link01 size={ICON_SIZE} aria-hidden />}
          onClick={() => {
            void share();
          }}
        >
          Share radar
        </Button>
      </Tooltip>

      <Snackbar
        open={copied !== null}
        autoHideDuration={COPIED_MESSAGE_MS}
        onClose={(_event, reason) => {
          if (reason !== 'clickaway') setCopied(null);
        }}
        message={
          copied === true
            ? 'Link copied — it carries your radar, not your data'
            : 'Could not reach the clipboard. Copy the address bar instead.'
        }
      />
    </>
  );
};

export default ShareRadarButton;
