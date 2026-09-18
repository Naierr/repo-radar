import Typography from '@mui/material/Typography';
import { useId } from 'react';

import { PanelActions, PanelBody, PanelHeader, PanelRoot } from './styles';
import type { IPanelProps } from './types';

/** A bordered surface with an optional header — the building block of every page. */
const Panel: React.FC<IPanelProps> = ({
  title,
  description,
  actions,
  disablePadding = false,
  children,
  className,
}) => {
  const titleId = useId();
  const hasHeader = Boolean(title ?? actions);

  return (
    <PanelRoot
      className={className}
      aria-labelledby={title ? titleId : undefined}
    >
      {hasHeader && (
        <PanelHeader>
          <div>
            {title && (
              <Typography id={titleId} variant="h6" component="h2">
                {title}
              </Typography>
            )}
            {description && (
              <Typography variant="body2" color="text.secondary">
                {description}
              </Typography>
            )}
          </div>
          {actions && <PanelActions>{actions}</PanelActions>}
        </PanelHeader>
      )}
      <PanelBody disablePadding={disablePadding}>{children}</PanelBody>
    </PanelRoot>
  );
};

export default Panel;
