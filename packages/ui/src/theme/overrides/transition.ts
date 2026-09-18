import { motion } from '../../tokens/shape';

export const transition = (...properties: string[]): string =>
  properties
    .map((property) => `${property} ${motion.fast} ${motion.easing}`)
    .join(', ');
