import { NonKeyActionName } from '../models/action.models';
import {
  KeyLabel,
  KeyLabelType,
  RawKeyLabel,
} from '../models/device-layout.models';
import { NonWSKCode } from '../models/key-code.models';

export const SHIFT_KEY_LABEL: KeyLabel = {
  type: KeyLabelType.Icon,
  c: 'shift',
  layer: null,
  shiftKey: null,
  altGraphKey: null,
};

export const NUM_SHIFT_KEY_LABEL: KeyLabel = {
  type: KeyLabelType.Icon,
  c: 'counter_2',
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
    F1: { type: KeyLabelType.String, c: 'F1' },
    F2: { type: KeyLabelType.String, c: 'F2' },
    F3: { type: KeyLabelType.String, c: 'F3' },
    F4: { type: KeyLabelType.String, c: 'F4' },
    F5: { type: KeyLabelType.String, c: 'F5' },
    F6: { type: KeyLabelType.String, c: 'F6' },
    F7: { type: KeyLabelType.String, c: 'F7' },
    F8: { type: KeyLabelType.String, c: 'F8' },
    F9: { type: KeyLabelType.String, c: 'F9' },
    F10: { type: KeyLabelType.String, c: 'F10' },
    F11: { type: KeyLabelType.String, c: 'F11' },
    F12: { type: KeyLabelType.String, c: 'F12' },
    Delete: { type: KeyLabelType.String, c: 'DEL' },
    ArrowDown: { type: KeyLabelType.Icon, c: 'keyboard_arrow_down' },
    ArrowLeft: { type: KeyLabelType.Icon, c: 'keyboard_arrow_left' },
    ArrowRight: { type: KeyLabelType.Icon, c: 'keyboard_arrow_right' },
    ArrowUp: { type: KeyLabelType.Icon, c: 'keyboard_arrow_up' },
  };

export const NON_KEY_ACTION_NAME_2_RAW_KEY_LABEL_MAP: Record<
  NonKeyActionName,
  RawKeyLabel
> = {
  MouseLeftClick: { type: KeyLabelType.Icon, c: 'left_click' },
  MouseRightClick: { type: KeyLabelType.Icon, c: 'right_click' },
  TertiaryKeymapLeft: { type: KeyLabelType.Icon, c: 'counter_3' },
  TertiaryKeymapRight: { type: KeyLabelType.Icon, c: 'counter_3' },
  SecondaryKeymapLeft: { type: KeyLabelType.Icon, c: 'counter_2' },
  SecondaryKeymapRight: { type: KeyLabelType.Icon, c: 'counter_2' },
  AmbidextrousThrowoverLeft: { type: KeyLabelType.Icon, c: 'switch_left' },
  AmbidextrousThrowoverRight: { type: KeyLabelType.Icon, c: 'switch_right' },
  MouseScrollCoastRight: { type: KeyLabelType.Icon, c: 'swipe_right' },
  MouseScrollCoastLeft: { type: KeyLabelType.Icon, c: 'swipe_left' },
  MouseScrollCoastDown: { type: KeyLabelType.Icon, c: 'swipe_down' },
  MouseScrollCoastUp: { type: KeyLabelType.Icon, c: 'swipe_up' },
  MouseMoveRight: { type: KeyLabelType.Icon, c: 'arrow_circle_right' },
  MouseMoveLeft: { type: KeyLabelType.Icon, c: 'arrow_circle_left' },
  MouseMoveDown: { type: KeyLabelType.Icon, c: 'arrow_circle_down' },
  MouseMoveUp: { type: KeyLabelType.Icon, c: 'arrow_circle_up' },
  Dup: { type: KeyLabelType.Icon, c: 'copy_all' },
};
