import type { Size } from '../../types/common';

export interface ISearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  /** Accessible name of the field — it has no visible label. */
  label: string;
  placeholder?: string;
  /** Shows a spinner in place of the clear button. */
  loading?: boolean;
  /** A key that focuses the field from anywhere on the page, e.g. "/". */
  shortcutKey?: string;
  size?: Extract<Size, 'md' | 'lg'>;
  className?: string;
}
