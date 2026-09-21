import { SparkSvg } from './styles';
import type { ISparklineProps } from './types';

const DEFAULT_WIDTH = 56;
const DEFAULT_HEIGHT = 16;
const TIP_RADIUS = 1.75;
const MIN_POINTS = 2;

/** A flat run still needs a line, so a zero range is drawn down the middle. */
const scale = (value: number, min: number, range: number, height: number) =>
  range === 0 ? height / 2 : height - ((value - min) / range) * height;

const Sparkline: React.FC<ISparklineProps> = ({
  values,
  label,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
}) => {
  if (values.length < MIN_POINTS) return null;

  const min = Math.min(...values);
  const range = Math.max(...values) - min;
  const step = width / (values.length - 1);
  const points = values.map((value, index) => ({
    x: index * step,
    y: scale(value, min, range, height),
  }));
  const path = points
    .map(
      ({ x, y }, index) =>
        `${index === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`,
    )
    .join(' ');
  const tip = points[points.length - 1];

  return (
    <SparkSvg
      role="img"
      aria-label={label}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
    >
      <path className="spark-line" d={path} />
      {tip && (
        <circle className="spark-tip" cx={tip.x} cy={tip.y} r={TIP_RADIUS} />
      )}
    </SparkSvg>
  );
};

export default Sparkline;
