import { styled } from '@mui/material/styles';

/**
 * Words set in the brand gradient — for a headline's key phrase, used
 * sparingly. The stops are tokens per colour scheme, so the text stays
 * readable on both canvases (see the contrast test).
 */
const GradientText = styled('span')(({ theme }) => ({
  backgroundImage: `linear-gradient(90deg, ${theme.vars.palette.gradient.from}, ${theme.vars.palette.gradient.via} 55%, ${theme.vars.palette.gradient.to})`,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  color: 'transparent',
}));

export default GradientText;
