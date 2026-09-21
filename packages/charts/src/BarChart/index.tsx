import { BarChart as MuiBarChart } from '@mui/x-charts/BarChart';
import {
  VisuallyHidden,
  formatCompactNumber,
  formatNumber,
  seriesColors,
} from '@repo-radar/ui';

import { withVisibleFloor } from './scale';
import { ChartRoot, MAX_PLOT_HEIGHT, PlotFrame } from './styles';
import type { IBarChartProps } from './types';

/**
 * Bars thin out as the list grows rather than being grouped away: every
 * repository the user tracks stays its own bar, however many there are.
 */
const BAR_HEIGHT = { roomy: 36, tight: 28, dense: 22 } as const;
const ROOMY_UP_TO = 12;
const TIGHT_UP_TO = 25;
const AXIS_SPACE = 48;
const MIN_HEIGHT = 180;

const BAR_RADIUS = 4;
const MAX_TICK_LABEL_LENGTH = 22;
const VALUE_TICK_COUNT = 6;

const barHeightFor = (count: number): number => {
  if (count <= ROOMY_UP_TO) return BAR_HEIGHT.roomy;
  if (count <= TIGHT_UP_TO) return BAR_HEIGHT.tight;
  return BAR_HEIGHT.dense;
};

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
  deltaLabel = 'since tracking began',
  emptyMessage = 'Nothing to plot yet',
}) => {
  // A compact axis hides small movement — 266,819 and 266,826 both read
  // "266.8k" — so the exact change travels with the exact value.
  const withDelta = (text: string, delta: number | undefined): string =>
    delta
      ? `${text} (${delta > 0 ? '+' : '−'}${valueFormatter(Math.abs(delta))} ${deltaLabel})`
      : text;

  const plotted = withVisibleFloor(data.map(({ value }) => value));
  const dataset = data.map(({ label }, index) => ({
    label,
    value: plotted[index] ?? 0,
  }));
  const height = Math.max(
    MIN_HEIGHT,
    data.length * barHeightFor(data.length) + AXIS_SPACE,
  );
  // Long lists scroll inside a fixed frame, so the chart never runs the page.
  const scrolls = height > MAX_PLOT_HEIGHT;

  return (
    <ChartRoot aria-label={title}>
      <PlotFrame data-scrolls={scrolls}>
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
              // Scrolled lists keep the scale in view by starting at the top.
              position: scrolls ? 'top' : 'bottom',
              valueFormatter: (value: number) => tickFormatter(value),
            },
          ]}
          series={[
            {
              dataKey: 'value',
              label: valueLabel,
              color: seriesColors[0],
              // Formatted from the datum, never from the plotted height: a
              // bar lifted to the floor must still say what it is worth.
              valueFormatter: (_value, context) => {
                const datum = data[context.dataIndex];
                return datum
                  ? withDelta(valueFormatter(datum.value), datum.delta)
                  : '';
              },
            },
          ]}
        />
      </PlotFrame>
      <VisuallyHidden as="table">
        <caption>{title}</caption>
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">{valueLabel}</th>
          </tr>
        </thead>
        <tbody>
          {data.map(({ id, label, value, delta }) => (
            <tr key={id}>
              <th scope="row">{label}</th>
              <td>{withDelta(valueFormatter(value), delta)}</td>
            </tr>
          ))}
        </tbody>
      </VisuallyHidden>
    </ChartRoot>
  );
};

export default BarChart;
