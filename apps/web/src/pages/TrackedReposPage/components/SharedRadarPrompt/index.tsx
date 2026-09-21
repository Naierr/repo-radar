import { Checkbox, ConfirmDialog, FormControlLabel } from '@repo-radar/ui';

import { useSharedRadar } from '../../hooks/useSharedRadar';
import { ChoiceLabel, CostLine, FailureLine, RepoChoices } from './styles';

const plural = (count: number, one: string, many: string): string =>
  `${count} ${count === 1 ? one : many}`;

/**
 * What a shared link is offering, and what taking it would cost. Each
 * repository is a choice rather than a package: people share more than you
 * want, and the budget may not stretch to all of it anyway.
 */
const SharedRadarPrompt: React.FC = () => {
  const {
    offered,
    selected,
    toggle,
    isAdding,
    failed,
    cost,
    requestsLeft,
    isAffordable,
    resetsIn,
    add,
    dismiss,
  } = useSharedRadar();

  const repos = plural(selected.length, 'repository', 'repositories');

  return (
    <ConfirmDialog
      open={offered.length > 0}
      title={`Add ${plural(offered.length, 'shared repository', 'shared repositories')}?`}
      description="Someone shared these with you. Pick the ones you want — nothing joins your radar until you say so."
      details={
        <>
          <RepoChoices>
            {offered.map((fullName) => (
              <FormControlLabel
                key={fullName}
                control={
                  <Checkbox
                    size="small"
                    checked={selected.includes(fullName)}
                    onChange={() => {
                      toggle(fullName);
                    }}
                  />
                }
                label={<ChoiceLabel>{fullName}</ChoiceLabel>}
              />
            ))}
          </RepoChoices>

          <CostLine>
            {selected.length === 0
              ? 'Nothing selected.'
              : `Adds ${repos} · ${plural(cost, 'GitHub request', 'GitHub requests')}`}
            {requestsLeft !== null && ` · ${String(requestsLeft)} left`}
          </CostLine>

          {!isAffordable && (
            <FailureLine>
              That is more than GitHub will allow right now
              {resetsIn === null ? '' : `, and the limit resets ${resetsIn}`}.
              Deselect a few, or come back and try again.
            </FailureLine>
          )}

          {failed.length > 0 && (
            <FailureLine>
              GitHub would not return {plural(failed.length, 'one', 'these')}:{' '}
              {failed.join(', ')}. They are still selected, so you can try
              again.
            </FailureLine>
          )}
        </>
      }
      confirmLabel={failed.length > 0 ? 'Try again' : 'Add to radar'}
      cancelLabel="No thanks"
      busy={isAdding}
      confirmDisabled={selected.length === 0 || !isAffordable}
      onConfirm={add}
      onCancel={dismiss}
    />
  );
};

export default SharedRadarPrompt;
