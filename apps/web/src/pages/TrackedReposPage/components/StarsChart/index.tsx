import { BarChart } from '@repo-radar/charts';
import { Panel } from '@repo-radar/ui';

import { useAppSelector } from '@/hooks/useReduxHooks';
import { selectStarsChartData } from '@/store/trackedRepos';

const StarsChart: React.FC = () => {
  const data = useAppSelector(selectStarsChartData);

  return (
    <Panel
      title="Stars per repository"
      description="Every tracked repository, most-starred first."
    >
      <BarChart
        data={data}
        title="Stars per tracked repository"
        valueLabel="Stars"
        deltaLabel="since you started watching"
      />
    </Panel>
  );
};

export default StarsChart;
