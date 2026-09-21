export interface ITrendDeltaProps {
  /** Change since the trend's anchor. Negative when the count fell. */
  delta: number;
  /** When the trend started, as an ISO timestamp. */
  since: string;
  /** Names the measured quantity, e.g. "stars". */
  unit: string;
}
