import { keyframes, styled } from '@mui/material/styles';

const rotate = keyframes`
  to { transform: rotate(1turn); }
`;

export const SweepGroup = styled('g', {
  shouldForwardProp: (prop) => prop !== 'animated',
})<{ animated: boolean }>(({ animated }) => ({
  transformOrigin: '16px 16px',
  animation: animated ? `${rotate} 4s linear infinite` : 'none',
}));
