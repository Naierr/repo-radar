import type { ReactNode } from 'react';

export interface IConfirmDialogProps {
  open: boolean;
  title: ReactNode;
  /** The consequence, in the user's terms. */
  description?: ReactNode;
  /** Supporting facts, e.g. what a costly action would spend. */
  details?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  /** `danger` for a confirmation the user cannot take back. */
  tone?: 'default' | 'danger';
  /** Keeps the dialog open and the confirm button busy while work runs. */
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}
