import { keyframes, styled } from '@mui/material/styles';

const twinkle = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
`;

const rotate = keyframes`
  to { transform: rotate(1turn); }
`;

export const StarfieldRoot = styled('div')({
  position: 'fixed',
  inset: 0,
  zIndex: -1,
  overflow: 'hidden',
  pointerEvents: 'none',
});

export const Nebula = styled('div')(({ theme }) => ({
  position: 'absolute',
  inset: 0,
  background: [
    `radial-gradient(ellipse 55% 45% at 12% -8%, ${theme.vars.palette.starfield.glowPrimary}, transparent 70%)`,
    `radial-gradient(ellipse 45% 40% at 92% 2%, ${theme.vars.palette.starfield.glowSecondary}, transparent 70%)`,
  ].join(', '),
}));

// A radar scope in the top corner: faint range rings and a sweep whose
// bright leading edge fades into a trail as it turns.
export const Sweep = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: '-34vmax',
  right: '-24vmax',
  width: '76vmax',
  height: '76vmax',
  borderRadius: '50%',
  background: [
    `conic-gradient(from 0deg, transparent 0deg 290deg, ${theme.vars.palette.starfield.sweep} 360deg)`,
    `repeating-radial-gradient(circle, transparent 0 calc(9.5vmax - 1px), ${theme.vars.palette.starfield.sweep} calc(9.5vmax - 1px) 9.5vmax)`,
  ].join(', '),
  maskImage: 'radial-gradient(circle, #000 25%, transparent 70%)',
  animation: `${rotate} 22s linear infinite`,
  willChange: 'transform',
}));

export interface IStarLayerStyle {
  size: number;
  shadows: string;
  duration: string;
  delay: string;
}

export const StarLayer = styled('div', {
  shouldForwardProp: (prop) => prop !== 'layer',
})<{ layer: IStarLayerStyle }>(({ theme, layer }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: layer.size,
  height: layer.size,
  borderRadius: '50%',
  color: theme.vars.palette.starfield.star,
  boxShadow: layer.shadows,
  animation: `${twinkle} ${layer.duration} ease-in-out ${layer.delay} infinite`,
  willChange: 'opacity',
}));
