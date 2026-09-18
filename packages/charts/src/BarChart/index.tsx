import { BarChart as MuiBarChart } from '@mui/x-charts/BarChart';
import {
  VisuallyHidden,
  formatCompactNumber,
  formatNumber,
  seriesColors,
} from '@repo-radar/ui';

import { ChartRoot } from './styles';
import type { IBarChartProps } from './types';

const BAR_HEIGHT = 36;
const AXIS_SPACE = 48;
const MIN_HEIGHT = 180;
const BAR_RADIUS = 4;
const MAX_TICK_LABEL_LENGTH = 22;
const VALUE_TICK_COUNT = 6;

const truncate = (text: string, maxLength: number): string =>
  text.length > maxLength ? `${text.slice(0, maxLength - 1)}…` : text;

/** A horizontal bar chart that grows with its data and reads well in both themes. */
const BarChart: React.FC<IBarChartProps> = ({
  data,
  title,
  valueLabel,
  valueFormatter = formatNumber,
  tickFormatter = formatCompactNumber,
  loading = false,
  emptyMessage = 'Nothing to plot yet',
}) => {
  const dataset = data.map(({ label, value }) => ({ label, value }));
  const height = Math.max(MIN_HEIGHT, data.length * BAR_HEIGHT + AXIS_SPACE);

  return (
    <ChartRoot aria-label={title}>
      <MuiBarChart
        title={title}
        dataset={dataset}
        layout="horizontal"
        height={height}
        borderRadius={BAR_RADIUS}
        grid={{ vertical: true }}
        hideLegend
        loading={loading}
        localeText={{ noData: emptyMessage }}
        yAxis={[
          {
            scaleType: 'band',
            dataKey: 'label',
            width: 'auto',
            valueFormatter: (label: string, context) =>
              context.location === 'tick'
                ? truncate(label, MAX_TICK_LABEL_LENGTH)
                : label,
          },
        ]}
        xAxis={[
          {
            tickNumber: VALUE_TICK_COUNT,
            valueFormatter: (value: number) => tickFormatter(value),
          },
        ]}
        series={[
          {
            dataKey: 'value',
            label: valueLabel,
            color: seriesColors[0],
            valueFormatter: (value) =>
              value === null ? '' : valueFormatter(value),
          },
        ]}
      />
      <VisuallyHidden as="table">
        <caption>{title}</caption>
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">{valueLabel}</th>
          </tr>
        </thead>
        <tbody>
          {data.map(({ id, label, value }) => (
            <tr key={id}>
              <th scope="row">{label}</th>
              <td>{valueFormatter(value)}</td>
            </tr>
          ))}
        </tbody>
      </VisuallyHidden>
    </ChartRoot>
  );
};

export default BarChart;
