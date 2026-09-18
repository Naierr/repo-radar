import { formatCompactNumber } from '../../utils/format';
import { CounterRoot } from './styles';
import type { ICounterLabelProps } from './types';

/** A small pill with a count, e.g. next to a tab name. */
const CounterLabel: React.FC<ICounterLabelProps> = ({
  count,
  tone = 'neutral',
}) => <CounterRoot tone={tone}>{formatCompactNumber(count)}</CounterRoot>;

export default CounterLabel;
