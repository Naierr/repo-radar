import { buildStarShadows } from './stars';
import { Nebula, StarfieldRoot, StarLayer, Sweep } from './styles';
import type { IStarLayerStyle } from './styles';

// Three depths of stars; each twinkles on its own clock so the sky never pulses in sync.
const STAR_LAYERS: IStarLayerStyle[] = [
  { size: 1, count: 180, seed: 11, duration: '6s', delay: '0s' },
  { size: 2, count: 60, seed: 29, duration: '9s', delay: '-3s' },
  { size: 3, count: 14, seed: 47, duration: '13s', delay: '-7s' },
].map(({ count, seed, ...layer }) => ({
  ...layer,
  shadows: buildStarShadows(count, seed),
}));

/** The night sky behind every page. Purely decorative. */
const Starfield: React.FC = () => (
  <StarfieldRoot aria-hidden>
    <Nebula />
    <Sweep />
    {STAR_LAYERS.map((layer) => (
      <StarLayer key={layer.size} layer={layer} />
    ))}
  </StarfieldRoot>
);

export default Starfield;
