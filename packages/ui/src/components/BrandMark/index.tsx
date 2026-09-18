import { useId } from 'react';

import { nebula, radar, signal } from '../../tokens/palette';
import type { Size } from '../../types/common';
import { SweepGroup } from './styles';
import type { IBrandMarkProps } from './types';

const SIZE_PX: Record<Size, number> = { sm: 20, md: 28, lg: 40 };

/** The Repo Radar mark: range rings, a turning sweep and one blip. */
const BrandMark: React.FC<IBrandMarkProps> = ({
  size = 'md',
  animated = true,
  title,
  className,
}) => {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const ringId = `${id}-ring`;
  const sweepId = `${id}-sweep`;
  const px = SIZE_PX[size];

  return (
    <svg
      viewBox="0 0 32 32"
      width={px}
      height={px}
      className={className}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <defs>
        <linearGradient id={ringId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={radar[400]} />
          <stop offset="1" stopColor={nebula[500]} />
        </linearGradient>
        <linearGradient id={sweepId} x1="0.5" y1="0" x2="1" y2="0.6">
          <stop offset="0" stopColor={signal[400]} stopOpacity="0" />
          <stop offset="1" stopColor={signal[400]} stopOpacity="0.85" />
        </linearGradient>
      </defs>
      <circle
        cx="16"
        cy="16"
        r="14.5"
        fill="none"
        stroke={`url(#${ringId})`}
        strokeWidth="1.5"
      />
      <circle
        cx="16"
        cy="16"
        r="9.5"
        fill="none"
        stroke={`url(#${ringId})`}
        strokeOpacity="0.55"
        strokeWidth="1.25"
      />
      <circle
        cx="16"
        cy="16"
        r="4.5"
        fill="none"
        stroke={`url(#${ringId})`}
        strokeOpacity="0.35"
        strokeWidth="1"
      />
      <SweepGroup animated={animated}>
        <path
          d="M16 16 L16 1.5 A14.5 14.5 0 0 1 29.3 10.2 Z"
          fill={`url(#${sweepId})`}
        />
      </SweepGroup>
      <circle cx="22.5" cy="9.5" r="1.7" fill={signal[300]} />
      <circle cx="16" cy="16" r="1.6" fill={radar[300]} />
    </svg>
  );
};

export default BrandMark;
