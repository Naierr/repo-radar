import Typography from '@mui/material/Typography';

import {
  EmptyStateAction,
  EmptyStateDescription,
  EmptyStateIcon,
  EmptyStateRoot,
} from './styles';
import type { IEmptyStateProps } from './types';

/** What a region shows when there is nothing in it yet — and what to do next. */
const EmptyState: React.FC<IEmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className,
}) => (
  <EmptyStateRoot className={className}>
    {icon && <EmptyStateIcon aria-hidden>{icon}</EmptyStateIcon>}
    <Typography variant="h5" component="h3">
      {title}
    </Typography>
    {description && (
      <EmptyStateDescription>
        <Typography variant="body1">{description}</Typography>
      </EmptyStateDescription>
    )}
    {action && <EmptyStateAction>{action}</EmptyStateAction>}
  </EmptyStateRoot>
);

export default EmptyState;
