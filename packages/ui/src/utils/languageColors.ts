import { seriesColors } from '../tokens/semantic';

// The colours GitHub (linguist) uses for the most common languages, so a
// language reads the same here as on the repository page.
const LANGUAGE_COLORS: Record<string, string> = {
  Astro: '#ff5a03',
  C: '#555555',
  'C#': '#178600',
  'C++': '#f34b7d',
  CSS: '#563d7c',
  Dart: '#00b4ab',
  Elixir: '#6e4a7e',
  Go: '#00add8',
  HTML: '#e34c26',
  Haskell: '#5e5086',
  Java: '#b07219',
  JavaScript: '#f1e05a',
  'Jupyter Notebook': '#da5b0b',
  Kotlin: '#a97bff',
  Lua: '#000080',
  MDX: '#fcb32c',
  PHP: '#4f5d95',
  Python: '#3572a5',
  Ruby: '#701516',
  Rust: '#dea584',
  Scala: '#c22d40',
  Shell: '#89e051',
  Svelte: '#ff3e00',
  Swift: '#f05138',
  TypeScript: '#3178c6',
  Vue: '#41b883',
  Zig: '#ec915c',
};

const hash = (value: string): number => {
  let sum = 0;
  for (let index = 0; index < value.length; index += 1) {
    sum += value.charCodeAt(index);
  }
  return sum;
};

/** A stable colour for any language, known or not. */
export const getLanguageColor = (language: string): string =>
  LANGUAGE_COLORS[language] ??
  seriesColors[hash(language) % seriesColors.length] ??
  seriesColors[0];
