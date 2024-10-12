import { NonKeyActionName } from '../models/action.models';
import {
  KeyLabel,
  KeyLabelType,
  RawKeyLabel,
} from '../models/device-layout.models';
import { NonWSKCode } from '../models/key-code.models';

export const SHIFT_KEY_LABEL: KeyLabel = {
  type: KeyLabelType.String,
  c: '⇧',
  layer: null,
  shiftKey: null,
  altGraphKey: null,
};

export const NUM_SHIFT_KEY_LABEL: KeyLabel = {
  type: KeyLabelType.String,
  c: '②',
  layer: null,
  shiftKey: null,
  altGraphKey: null,
};

export const NON_WSK_CODE_2_RAW_KEY_LABEL_MAP: Record<NonWSKCode, RawKeyLabel> =
  {
    AltLeft: { type: KeyLabelType.String, c: 'ALT' },
    AltRight: { type: KeyLabelType.String, c: 'ALT' },
    Backspace: { type: KeyLabelType.Icon, c: 'backspace' },
    CapsLock: { type: KeyLabelType.Icon, c: 'keyboard_capslock' },
    ContextMenu: { type: KeyLabelType.Icon, c: 'menu' },
    ControlLeft: { type: KeyLabelType.String, c: 'CTRL' },
    ControlRight: { type: KeyLabelType.String, c: 'CTRL' },
    Enter: { type: KeyLabelType.Icon, c: 'keyboard_return' },
    MetaLeft: { type: KeyLabelType.Icon, c: 'apps' },
    MetaRight: { type: KeyLabelType.Icon, c: 'apps' },
    ShiftLeft: { type: KeyLabelType.Icon, c: 'shift' },
    ShiftRight: { type: KeyLabelType.Icon, c: 'shift' },
    Space: { type: KeyLabelType.Icon, c: 'space_bar' },
    Tab: { type: KeyLabelType.Icon, c: 'keyboard_tab' },
    Escape: { type: KeyLabelType.String, c: 'ESC' },
  };

export const NON_KEY_ACTION_NAME_2_RAW_KEY_LABEL_MAP: Record<
  NonKeyActionName,
  RawKeyLabel
> = {
  MouseLeftClick: { type: KeyLabelType.Icon, c: 'left_click' },
  MouseRightClick: { type: KeyLabelType.Icon, c: 'right_click' },
};
