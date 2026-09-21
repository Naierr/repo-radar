import { BarChart } from '@repo-radar/charts';
import { Panel, useNow } from '@repo-radar/ui';

import { useAppSelector } from '@/hooks/useReduxHooks';
import { selectCommitRecency } from '@/store/trackedRepos';

const CLOCK_TICK_MS = 60_000;

const inDays = (value: number): string =>
  value === 0 ? 'today' : `${String(value)} ${value === 1 ? 'day' : 'days'}`;

/** Which tracked repositories have gone quiet, and for how long. */
const CommitRecencyChart: React.FC = () => {
  const now = useNow(CLOCK_TICK_MS);
  const data = useAppSelector((state) =>
    selectCommitRecency(state, now.getTime()),
  );

  return (
    <Panel
      title="Days since the last commit"
      description="Longest silence first — a long bar is a project standing still."
    >
      <BarChart
        data={data}
        title="Days since the last commit, per tracked repository"
        valueLabel="Days since the last commit"
        valueFormatter={inDays}
        tickFormatter={(value) => `${String(value)}d`}
        emptyMessage="Refresh a repository to see when it last moved."
      />
    </Panel>
  );
};

export default CommitRecencyChart;
