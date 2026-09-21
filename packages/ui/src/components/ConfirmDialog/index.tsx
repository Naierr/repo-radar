import Button from '@mui/material/Button';
import { useId } from 'react';

import {
  ConfirmActions,
  ConfirmBody,
  ConfirmDetails,
  ConfirmRoot,
  ConfirmText,
  ConfirmTitle,
} from './styles';
import type { IConfirmDialogProps } from './types';

/**
 * Asks before something expensive or irreversible happens. Cancel comes first
 * in the DOM so the dialog's own focus management lands there — the reflexive
 * Enter keeps the data — and every way out, Escape, the backdrop or the
 * button, means cancel.
 */
const ConfirmDialog: React.FC<IConfirmDialogProps> = ({
  open,
  title,
  description,
  details,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'default',
  busy = false,
  confirmDisabled = false,
  onConfirm,
  onCancel,
}) => {
  const titleId = useId();
  const descriptionId = useId();
  const isDanger = tone === 'danger';

  return (
    <ConfirmRoot
      open={open}
      onClose={onCancel}
      aria-labelledby={titleId}
      aria-describedby={description === undefined ? undefined : descriptionId}
    >
      <ConfirmBody>
        <ConfirmTitle id={titleId}>{title}</ConfirmTitle>
        {description !== undefined && (
          <ConfirmText id={descriptionId}>{description}</ConfirmText>
        )}
        {details !== undefined && <ConfirmDetails>{details}</ConfirmDetails>}
      </ConfirmBody>

      <ConfirmActions>
        <Button
          variant="outlined"
          color="inherit"
          onClick={onCancel}
          // A modal must place initial focus inside itself (ARIA APG), and the
          // safe answer is where it belongs: a reflexive Enter then cancels
          // rather than confirming. The rule this disables is about autofocus
          // on page load, which is a different thing entirely.
          // eslint-disable-next-line jsx-a11y-x/no-autofocus -- see above
          autoFocus
        >
          {cancelLabel}
        </Button>
        <Button
          variant="contained"
          color={isDanger ? 'error' : 'primary'}
          onClick={onConfirm}
          loading={busy}
          disabled={confirmDisabled}
        >
          {confirmLabel}
        </Button>
      </ConfirmActions>
    </ConfirmRoot>
  );
};

export default ConfirmDialog;
