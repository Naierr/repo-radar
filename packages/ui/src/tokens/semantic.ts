import { amber, green, nebula, neutral, radar, red, signal } from './palette';

export interface ISemanticColors {
  canvas: {
    /** Page background, behind the night sky. */
    default: string;
    /** Hovered rows, table headers, quiet fills. */
    subtle: string;
    /** Inputs and wells sunk below the surface. */
    inset: string;
    /** Panels, menus and anything floating above the page. */
    overlay: string;
    /** Hover fill for neutral controls. */
    hover: string;
  };
  fg: {
    default: string;
    muted: string;
    subtle: string;
    /** Text on an emphasis fill (e.g. a primary button). */
    onEmphasis: string;
  };
  border: {
    default: string;
    muted: string;
  };
  accent: {
    fg: string;
    emphasis: string;
    muted: string;
    subtle: string;
  };
  success: { fg: string; subtle: string };
  attention: { fg: string; subtle: string };
  danger: { fg: string; subtle: string };
  /** Brand gradient for a headline's key phrase — readable on the canvas. */
  gradient: { from: string; via: string; to: string };
  tooltip: { bg: string; fg: string };
  starfield: {
    star: string;
    glowPrimary: string;
    glowSecondary: string;
    sweep: string;
  };
}

export const lightColors: ISemanticColors = {
  canvas: {
    default: neutral[25],
    subtle: neutral[50],
    inset: neutral[0],
    overlay: neutral[0],
    hover: neutral[100],
  },
  fg: {
    default: neutral[900],
    muted: neutral[600],
    subtle: neutral[500],
    onEmphasis: neutral[0],
  },
  border: {
    default: neutral[200],
    muted: neutral[100],
  },
  accent: {
    fg: radar[600],
    emphasis: radar[600],
    muted: 'rgba(61, 120, 242, 0.32)',
    subtle: radar[50],
  },
  success: { fg: green[600], subtle: '#e4f5ec' },
  attention: { fg: amber[600], subtle: '#fdf3dc' },
  danger: { fg: red[600], subtle: '#fdeceb' },
  // Deeper stops than the dark scheme's: the bright ones sit at 1.7–2.8:1 on
  // a light canvas, which fails even the large-text bar.
  gradient: { from: radar[600], via: nebula[600], to: radar[700] },
  tooltip: { bg: neutral[800], fg: neutral[0] },
  starfield: {
    star: 'rgba(45, 98, 216, 0.28)',
    glowPrimary: 'rgba(91, 145, 255, 0.16)',
    glowSecondary: 'rgba(128, 103, 240, 0.1)',
    sweep: 'rgba(32, 182, 226, 0.12)',
  },
};

export const darkColors: ISemanticColors = {
  canvas: {
    default: neutral[950],
    subtle: '#111827',
    inset: neutral[1000],
    overlay: neutral[925],
    hover: '#182133',
  },
  fg: {
    default: '#e6ecf5',
    muted: '#98a4b8',
    subtle: '#7a879c',
    onEmphasis: neutral[0],
  },
  border: {
    default: '#1f2939',
    muted: '#161e2c',
  },
  accent: {
    fg: radar[300],
    emphasis: radar[600],
    muted: 'rgba(91, 145, 255, 0.42)',
    subtle: 'rgba(61, 120, 242, 0.16)',
  },
  success: { fg: green[400], subtle: 'rgba(70, 209, 143, 0.14)' },
  attention: { fg: amber[400], subtle: 'rgba(244, 187, 69, 0.14)' },
  danger: { fg: red[400], subtle: 'rgba(255, 122, 120, 0.14)' },
  gradient: { from: radar[400], via: nebula[400], to: signal[400] },
  tooltip: { bg: '#2a3547', fg: '#f3f6fb' },
  starfield: {
    star: 'rgba(214, 228, 255, 0.9)',
    glowPrimary: 'rgba(61, 120, 242, 0.3)',
    glowSecondary: 'rgba(128, 103, 240, 0.22)',
    sweep: 'rgba(79, 208, 247, 0.14)',
  },
};

/** Colours for data series, in the order a chart should use them. */
export const seriesColors = [
  radar[500],
  nebula[500],
  signal[500],
  green[500],
  amber[500],
] as const;
