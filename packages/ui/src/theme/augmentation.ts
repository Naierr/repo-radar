/* eslint-disable @typescript-eslint/naming-convention -- augmenting MUI's own interfaces through declaration merging */
import type { ISemanticColors } from '../tokens/semantic';

interface IRadarPalette {
  canvas: ISemanticColors['canvas'];
  fg: ISemanticColors['fg'];
  border: ISemanticColors['border'];
  accent: ISemanticColors['accent'];
  tone: Pick<ISemanticColors, 'success' | 'attention' | 'danger'>;
  gradient: ISemanticColors['gradient'];
  tooltip: ISemanticColors['tooltip'];
  starfield: ISemanticColors['starfield'];
  shadow: { overlay: string };
}

declare module '@mui/material/styles' {
  interface CssThemeVariables {
    enabled: true;
  }

  interface Palette extends IRadarPalette {}

  interface PaletteOptions extends Partial<IRadarPalette> {}
}

export {};
