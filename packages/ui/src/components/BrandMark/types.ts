import type { Size } from '../../types/common';

export interface IBrandMarkProps {
  size?: Size;
  /** Spins the sweep. Off for static contexts such as favicons or print. */
  animated?: boolean;
  /** Accessible name. Leave empty when a visible wordmark sits next to it. */
  title?: string;
  className?: string;
}
