import { styled } from '@mui/material/styles';

import { visuallyHidden } from '../../utils/visuallyHidden';

/** Text for screen readers only, e.g. the unit after a number that has an icon. */
const VisuallyHidden = styled('span')(visuallyHidden);

export default VisuallyHidden;
