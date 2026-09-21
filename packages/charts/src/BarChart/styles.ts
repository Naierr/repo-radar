import { styled } from '@repo-radar/ui';

/** Past this the chart stops stretching the page and scrolls inside instead. */
export const MAX_PLOT_HEIGHT = 520;

export const ChartRoot = styled('figure')({
  margin: 0,
  width: '100%',
});

export const PlotFrame = styled('div')(({ theme }) => ({
  '&[data-scrolls="true"]': {
    maxHeight: MAX_PLOT_HEIGHT,
    overflowY: 'auto',
    overscrollBehavior: 'contain',
    scrollbarWidth: 'thin',
    scrollbarColor: `${theme.vars.palette.border.default} transparent`,
  },
}));
