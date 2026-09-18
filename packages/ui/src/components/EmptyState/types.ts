import type { ReactNode } from 'react';

export interface IEmptyStateProps {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /** A single next step, e.g. a button that leads somewhere useful. */
  action?: ReactNode;
  className?: string;
}
