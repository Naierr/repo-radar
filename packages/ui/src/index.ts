// ── Theme & colour modes ──
export { theme } from './theme/theme';
export {
  COLOR_MODE,
  COLOR_MODE_STORAGE_KEY,
  COLOR_SCHEME_ATTRIBUTE,
} from './theme/colorScheme';
export type { ColorMode, ResolvedColorMode } from './theme/colorScheme';
export { seriesColors } from './tokens/semantic';
export { useColorMode } from './hooks/useColorMode';
export type { IUseColorModeResult } from './hooks/useColorMode';
export { useNow } from './hooks/useNow';

// ── Components ──
export { default as BrandMark } from './components/BrandMark';
export type { IBrandMarkProps } from './components/BrandMark/types';
export { default as ColorModeMenu } from './components/ColorModeMenu';
export { default as ConfirmDialog } from './components/ConfirmDialog';
export type { IConfirmDialogProps } from './components/ConfirmDialog/types';
export { default as CounterLabel } from './components/CounterLabel';
export type { ICounterLabelProps } from './components/CounterLabel/types';
export { default as EmptyState } from './components/EmptyState';
export type { IEmptyStateProps } from './components/EmptyState/types';
export { default as ErrorNotice } from './components/ErrorNotice';
export type { IErrorNoticeProps } from './components/ErrorNotice/types';
export { default as GradientText } from './components/GradientText';
export { default as LanguageDot } from './components/LanguageDot';
export { default as Metric } from './components/Metric';
export type { IMetricProps } from './components/Metric/types';
export { default as Panel } from './components/Panel';
export type { IPanelProps } from './components/Panel/types';
export { default as RelativeTime } from './components/RelativeTime';
export { default as SearchField } from './components/SearchField';
export type { ISearchFieldProps } from './components/SearchField/types';
export { default as Starfield } from './components/Starfield';
export { default as ThemeProvider } from './components/ThemeProvider';
export { default as VisuallyHidden } from './components/VisuallyHidden';

// ── Formatting ──
export {
  formatCompactNumber,
  formatNumber,
  formatRelativeTime,
} from './utils/format';

// ── MUI primitives ──
// Re-exported rather than wrapped: the theme already decides how they look,
// and this package stays the only door from the app to MUI. Add one here
// when the app first needs it.
export { default as Avatar } from '@mui/material/Avatar';
export { default as Button } from '@mui/material/Button';
export { default as Checkbox } from '@mui/material/Checkbox';
export { default as FormControlLabel } from '@mui/material/FormControlLabel';
export { default as IconButton } from '@mui/material/IconButton';
export { default as LinearProgress } from '@mui/material/LinearProgress';
export { default as Link } from '@mui/material/Link';
export { default as Pagination } from '@mui/material/Pagination';
export { default as Skeleton } from '@mui/material/Skeleton';
export { default as Snackbar } from '@mui/material/Snackbar';
export { default as Tooltip } from '@mui/material/Tooltip';
export { styled } from '@mui/material/styles';
