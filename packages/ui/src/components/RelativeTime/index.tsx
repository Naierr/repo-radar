import Tooltip from '@mui/material/Tooltip';

import { useNow } from '../../hooks/useNow';
import { formatDateTime, formatRelativeTime } from '../../utils/format';
import type { IRelativeTimeProps } from './types';

const REFRESH_INTERVAL_MS = 60_000;

/** "3 days ago", kept current, with the exact date on hover. */
const RelativeTime: React.FC<IRelativeTimeProps> = ({
  date,
  fallback = '—',
}) => {
  const now = useNow(REFRESH_INTERVAL_MS);
  const value = new Date(date);

  if (Number.isNaN(value.getTime())) return <span>{fallback}</span>;

  return (
    <Tooltip title={formatDateTime(value)}>
      <time dateTime={value.toISOString()}>
        {formatRelativeTime(value, now)}
      </time>
    </Tooltip>
  );
};

export default RelativeTime;
