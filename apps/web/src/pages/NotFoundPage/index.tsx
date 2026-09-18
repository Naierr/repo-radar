import { Button, EmptyState, Panel } from '@repo-radar/ui';
import { Telescope } from '@untitledui/icons';
import { Link as RouterLink } from 'react-router';

import { ROUTES } from '@/constants/routes';

const EMPTY_ICON_SIZE = 22;

const NotFoundPage: React.FC = () => (
  <Panel>
    <title>Not found · Repo Radar</title>
    <EmptyState
      icon={<Telescope size={EMPTY_ICON_SIZE} />}
      title="This page drifted off the radar"
      description="The address may be mistyped, or the page no longer exists."
      action={
        <Button variant="contained" component={RouterLink} to={ROUTES.SEARCH}>
          Back to search
        </Button>
      }
    />
  </Panel>
);

export default NotFoundPage;
