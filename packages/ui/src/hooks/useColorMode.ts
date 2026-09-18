import { useColorScheme } from '@mui/material/styles';

import { COLOR_MODE } from '../theme/colorScheme';
import type { ColorMode, ResolvedColorMode } from '../theme/colorScheme';

export interface IUseColorModeResult {
  /** What the user picked — `system` follows the OS. */
  mode: ColorMode;
  /** What is actually on screen. */
  resolvedMode: ResolvedColorMode;
  setMode: (mode: ColorMode) => void;
}

export const useColorMode = (): IUseColorModeResult => {
  const { mode, systemMode, setMode } = useColorScheme();
  const currentMode = mode ?? COLOR_MODE.SYSTEM;
  const resolvedMode =
    currentMode === COLOR_MODE.SYSTEM
      ? (systemMode ?? COLOR_MODE.LIGHT)
      : currentMode;

  return { mode: currentMode, resolvedMode, setMode };
};
