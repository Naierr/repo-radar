import type { ReactNode } from 'react';

export interface IErrorNoticeProps {
  message: ReactNode;
  /** Shows a retry action. Leave it out when retrying cannot help. */
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}
