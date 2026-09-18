import type { ReactNode } from 'react';

export interface IPanelProps {
  title?: ReactNode;
  description?: ReactNode;
  /** Controls on the right of the header, e.g. a refresh button. */
  actions?: ReactNode;
  /** Drop the body padding for edge-to-edge content such as lists. */
  disablePadding?: boolean;
  children: ReactNode;
  className?: string;
}
