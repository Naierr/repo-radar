import Skeleton from '@mui/material/Skeleton';
import Tooltip from '@mui/material/Tooltip';

import VisuallyHidden from '../VisuallyHidden';
import { MetricIcon, MetricRoot, MetricValue } from './styles';
import type { IMetricProps } from './types';

const SKELETON_WIDTH = 36;

/** An icon, a glanceable value and a label only screen readers need. */
const Metric: React.FC<IMetricProps> = ({
  icon,
  label,
  children,
  tooltip,
  loading = false,
}) => {
  const metric = (
    <MetricRoot>
      <MetricIcon aria-hidden>{icon}</MetricIcon>
      <VisuallyHidden>{label}: </VisuallyHidden>
      {loading ? (
        <Skeleton width={SKELETON_WIDTH} aria-label="Loading" />
      ) : (
        <MetricValue>{children}</MetricValue>
      )}
    </MetricRoot>
  );

  if (!tooltip || loading) return metric;

  return (
    <Tooltip
      title={
        <>
          {label}: {tooltip}
        </>
      }
    >
      {metric}
    </Tooltip>
  );
};

export default Metric;
