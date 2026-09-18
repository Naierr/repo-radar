import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

import type { IErrorNoticeProps } from './types';

/** An error shown where it happened, with a way to try again when that can help. */
const ErrorNotice: React.FC<IErrorNoticeProps> = ({
  message,
  onRetry,
  retryLabel = 'Try again',
  className,
}) => (
  <Alert
    severity="error"
    className={className}
    action={
      onRetry && (
        <Button size="small" variant="text" color="inherit" onClick={onRetry}>
          {retryLabel}
        </Button>
      )
    }
  >
    {message}
  </Alert>
);

export default ErrorNotice;
