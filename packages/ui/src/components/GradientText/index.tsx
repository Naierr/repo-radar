import { styled } from '@mui/material/styles';

import { nebula, radar, signal } from '../../tokens/palette';

/** Words set in the brand gradient — for a headline's key phrase, used sparingly. */
const GradientText = styled('span')({
  backgroundImage: `linear-gradient(90deg, ${radar[400]}, ${nebula[400]} 55%, ${signal[400]})`,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  color: 'transparent',
});

export default GradientText;
