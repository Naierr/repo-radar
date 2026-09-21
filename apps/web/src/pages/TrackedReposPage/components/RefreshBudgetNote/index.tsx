import { useRefreshBudget } from '../../hooks/useRefreshBudget';
import { BudgetNote } from './styles';

const plural = (count: number, one: string, many: string): string =>
  `${count} ${count === 1 ? one : many}`;

/** Why "Refresh all" is off — said plainly, and never hidden behind a hover. */
const RefreshBudgetNote: React.FC = () => {
  const { repoCount, cost, requestsLeft, isAffordable, resetsIn } =
    useRefreshBudget();

  if (isAffordable) return null;

  return (
    <BudgetNote>
      Refreshing {plural(repoCount, 'repository', 'repositories')} needs{' '}
      {plural(cost, 'request', 'requests')}; {requestsLeft} left
      {resetsIn === null ? '' : `, resets ${resetsIn}`}. Refresh rows
      individually.
    </BudgetNote>
  );
};

export default RefreshBudgetNote;
