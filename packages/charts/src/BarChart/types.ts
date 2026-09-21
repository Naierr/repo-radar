export interface IBarDatum {
  id: string;
  label: string;
  value: number;
  /** Movement since the series began. Zero or absent means nothing to report. */
  delta?: number;
}

export interface IBarChartProps {
  /** Plotted top to bottom in the order given. */
  data: IBarDatum[];
  /** Names the chart for assistive tech, e.g. "Stars per tracked repository". */
  title: string;
  /** Names the measured quantity in tooltips and the data table, e.g. "Stars". */
  valueLabel: string;
  /** Formats values in tooltips and the data table. Defaults to "12,345". */
  valueFormatter?: (value: number) => string;
  /** Names what a delta is measured against, e.g. "since you started". */
  deltaLabel?: string;
  /** Formats the value axis ticks. Defaults to "12.3k". */
  tickFormatter?: (value: number) => string;
  loading?: boolean;
  emptyMessage?: string;
}
