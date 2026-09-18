import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { SearchLg, XClose } from '@untitledui/icons';
import { useRef } from 'react';

import { useShortcutKey } from '../../hooks/useShortcutKey';
import { SearchInput, ShortcutHint } from './styles';
import type { ISearchFieldProps } from './types';

const ICON_SIZE = 16;
const SPINNER_SIZE = 16;

/** A search box with a clear button, a busy state and an optional "/" shortcut. */
const SearchField: React.FC<ISearchFieldProps> = ({
  value,
  onChange,
  label,
  placeholder,
  loading = false,
  shortcutKey,
  size = 'md',
  className,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  useShortcutKey(shortcutKey, () => inputRef.current?.focus());

  const clear = () => {
    onChange('');
    inputRef.current?.focus();
  };

  const renderEndAdornment = () => {
    if (loading) {
      return <CircularProgress size={SPINNER_SIZE} aria-label="Searching" />;
    }
    if (value) {
      return (
        <IconButton size="small" aria-label="Clear search" onClick={clear}>
          <XClose size={ICON_SIZE} aria-hidden />
        </IconButton>
      );
    }
    if (shortcutKey) {
      return (
        <ShortcutHint aria-label={`Press ${shortcutKey} to search`}>
          {shortcutKey}
        </ShortcutHint>
      );
    }
    return null;
  };

  return (
    <SearchInput
      fullWidth
      fieldSize={size}
      className={className}
      value={value}
      placeholder={placeholder}
      inputRef={inputRef}
      onChange={(event) => {
        onChange(event.target.value);
      }}
      slotProps={{
        htmlInput: {
          type: 'search',
          'aria-label': label,
          autoComplete: 'off',
          spellCheck: false,
          enterKeyHint: 'search',
        },
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchLg size={ICON_SIZE} aria-hidden />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              {renderEndAdornment()}
            </InputAdornment>
          ),
        },
      }}
    />
  );
};

export default SearchField;
