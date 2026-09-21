export interface ISparklineProps {
  /** Readings oldest first. Fewer than two draws nothing. */
  values: number[];
  /** Describes the shape for assistive tech, e.g. "Stars since tracking began". */
  label: string;
  width?: number;
  height?: number;
}
