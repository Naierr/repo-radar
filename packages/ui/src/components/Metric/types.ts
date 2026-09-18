import type { ReactNode } from 'react';

export interface IMetricProps {
  icon: ReactNode;
  /** Names the value for screen readers and prefixes the tooltip, e.g. "Stars". */
  label: string;
  /** The value as it should read at a glance, e.g. "12.3k". */
  children: ReactNode;
  /** The exact value, shown on hover, e.g. "12,345". */
  tooltip?: ReactNode;
  loading?: boolean;
}
