import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import { Monitor01, Moon01, Sun } from '@untitledui/icons';
import { useId, useState } from 'react';

import { useColorMode } from '../../hooks/useColorMode';
import { COLOR_MODE } from '../../theme/colorScheme';
import type { ColorMode } from '../../theme/colorScheme';
import { SelectedMark } from './styles';
import type { IColorModeMenuProps } from './types';

const ICON_SIZE = 18;
const OPTION_ICON_SIZE = 16;

const OPTIONS: { mode: ColorMode; label: string; Icon: typeof Sun }[] = [
  { mode: COLOR_MODE.LIGHT, label: 'Light', Icon: Sun },
  { mode: COLOR_MODE.DARK, label: 'Dark', Icon: Moon01 },
  { mode: COLOR_MODE.SYSTEM, label: 'System', Icon: Monitor01 },
];

/** Light, dark or follow the system — the user's choice is remembered. */
const ColorModeMenu: React.FC<IColorModeMenuProps> = ({ className }) => {
  const { mode, resolvedMode, setMode } = useColorMode();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const buttonId = useId();
  const menuId = useId();
  const isOpen = anchor !== null;
  const TriggerIcon = resolvedMode === COLOR_MODE.DARK ? Moon01 : Sun;

  const handleSelect = (nextMode: ColorMode) => {
    setMode(nextMode);
    setAnchor(null);
  };

  return (
    <>
      <Tooltip title="Theme">
        <IconButton
          id={buttonId}
          className={className}
          aria-label="Change theme"
          aria-haspopup="menu"
          aria-controls={isOpen ? menuId : undefined}
          aria-expanded={isOpen}
          onClick={(event) => {
            setAnchor(event.currentTarget);
          }}
        >
          <TriggerIcon size={ICON_SIZE} aria-hidden />
        </IconButton>
      </Tooltip>
      <Menu
        id={menuId}
        anchorEl={anchor}
        open={isOpen}
        onClose={() => {
          setAnchor(null);
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ list: { 'aria-labelledby': buttonId } }}
      >
        {OPTIONS.map(({ mode: option, label, Icon }) => {
          const isSelected = mode === option;
          return (
            <MenuItem
              key={option}
              role="menuitemradio"
              aria-checked={isSelected}
              selected={isSelected}
              onClick={() => {
                handleSelect(option);
              }}
            >
              <Icon size={OPTION_ICON_SIZE} aria-hidden />
              {label}
              {isSelected && (
                <SelectedMark size={OPTION_ICON_SIZE} aria-hidden />
              )}
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};

export default ColorModeMenu;
