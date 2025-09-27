import { NonKeyActionName } from '../models/action.models';
import {
  FontLogo,
  KeyLabel,
  KeyLabelType,
  RawKeyLabel,
} from '../models/device-layout.models';
import { NonWSKCode } from '../models/key-code.models';
import { OperatingSystemName } from '../models/operating-system.models';

export const SHIFT_KEY_LABEL: KeyLabel = {
  type: KeyLabelType.Icon,
  c: 'shift',
  layer: null,
  shiftKey: null,
  altGraphKey: null,
  title: 'Shift',
};

export const NUM_SHIFT_KEY_LABEL: KeyLabel = {
  type: KeyLabelType.Icon,
  c: 'counter_2',
  layer: null,
  shiftKey: null,
  altGraphKey: null,
  title: 'Numeric Layer',
};

export const FN_SHIFT_KEY_LABEL: KeyLabel = {
  type: KeyLabelType.Icon,
  c: 'counter_3',
  layer: null,
  shiftKey: null,
  altGraphKey: null,
  title: 'Function Layer',
};

export const ALT_GRAPH_KEY_LABEL: KeyLabel = {
  type: KeyLabelType.String,
  c: 'ALT(GR)',
  layer: null,
  shiftKey: null,
  altGraphKey: null,
  title: 'Alt Graph',
};

export const NON_WSK_CODE_2_RAW_KEY_LABEL_MAP: Record<NonWSKCode, RawKeyLabel> =
  {
    AltLeft: {
      type: KeyLabelType.String,
      c: 'ALT',
      title: 'Alt / Option (left)',
    },
    AltRight: {
      type: KeyLabelType.String,
      c: 'ALT(GR)',
      title: 'Alt / Option (right) / Alt Graph',
    },
    Backspace: { type: KeyLabelType.Icon, c: 'backspace', title: 'Backspace' },
    CapsLock: {
      type: KeyLabelType.Icon,
      c: 'keyboard_capslock',
      title: 'CapsLock',
    },
    ContextMenu: {
      type: KeyLabelType.Icon,
      c: 'menu',
      title: 'Application',
    },
    ControlLeft: { type: KeyLabelType.String, c: 'CTRL', title: 'Ctrl' },
    ControlRight: { type: KeyLabelType.String, c: 'CTRL', title: 'Ctrl' },
    Enter: {
      type: KeyLabelType.Icon,
      c: 'keyboard_return',
      title: 'Enter / Return',
    },
    MetaLeft: {
      type: KeyLabelType.Icon,
      c: 'apps',
      title: 'Windows / Command / Super (left)',
    },
    MetaRight: {
      type: KeyLabelType.Icon,
      c: 'apps',
      title: 'Windows / Command / Super (right)',
    },
    ShiftLeft: { type: KeyLabelType.Icon, c: 'shift', title: 'Shift (left)' },
    ShiftRight: { type: KeyLabelType.Icon, c: 'shift', title: 'Shift (right)' },
    Space: { type: KeyLabelType.Icon, c: 'space_bar', title: 'Space' },
    Tab: { type: KeyLabelType.Icon, c: 'keyboard_tab', title: 'Tab' },
    Escape: { type: KeyLabelType.String, c: 'ESC', title: 'Esc' },
    F1: { type: KeyLabelType.String, c: 'F1', title: 'F1' },
    F2: { type: KeyLabelType.String, c: 'F2', title: 'F2' },
    F3: { type: KeyLabelType.String, c: 'F3', title: 'F3' },
    F4: { type: KeyLabelType.String, c: 'F4', title: 'F4' },
    F5: { type: KeyLabelType.String, c: 'F5', title: 'F5' },
    F6: { type: KeyLabelType.String, c: 'F6', title: 'F6' },
    F7: { type: KeyLabelType.String, c: 'F7', title: 'F7' },
    F8: { type: KeyLabelType.String, c: 'F8', title: 'F8' },
    F9: { type: KeyLabelType.String, c: 'F9', title: 'F9' },
    F10: { type: KeyLabelType.String, c: 'F10', title: 'F10' },
    F11: { type: KeyLabelType.String, c: 'F11', title: 'F11' },
    F12: { type: KeyLabelType.String, c: 'F12', title: 'F12' },
    Delete: { type: KeyLabelType.String, c: 'DEL', title: 'Delete' },
    ArrowDown: {
      type: KeyLabelType.Icon,
      c: 'keyboard_arrow_down',
      title: 'Arrow Down',
    },
    ArrowLeft: {
      type: KeyLabelType.Icon,
      c: 'keyboard_arrow_left',
      title: 'Arrow Left',
    },
    ArrowRight: {
      type: KeyLabelType.Icon,
      c: 'keyboard_arrow_right',
      title: 'Arrow Right',
    },
    ArrowUp: {
      type: KeyLabelType.Icon,
      c: 'keyboard_arrow_up',
      title: 'Arrow Up',
    },
    PageUp: { type: KeyLabelType.Icon, c: 'move_up', title: 'Page Up' },
    PageDown: { type: KeyLabelType.Icon, c: 'move_down', title: 'Page Down' },
    Home: { type: KeyLabelType.Icon, c: 'home', title: 'Home' },
    End: { type: KeyLabelType.String, c: 'END', title: 'End' },
    Insert: { type: KeyLabelType.Icon, c: 'insert_text', title: 'Insert' },
  };

export const NON_KEY_ACTION_NAME_2_RAW_KEY_LABEL_MAP: Record<
  NonKeyActionName,
  RawKeyLabel
> = {
  NoKeyPressed: {
    type: KeyLabelType.Icon,
    c: 'block',
    title: 'No Key Pressed',
  },
  RestartInputDevice: {
    type: KeyLabelType.Icon,
    c: 'restart_alt',
    title: 'Restart Input Device',
  },
  MouseLeftClick: {
    type: KeyLabelType.Icon,
    c: 'left_click',
    title: 'Mouse Left Click',
  },
  MouseRightClick: {
    type: KeyLabelType.Icon,
    c: 'right_click',
    title: 'Mouse Right Click',
  },
  MouseMiddleClick: {
    type: KeyLabelType.Icon,
    c: 'touchpad_mouse',
    title: 'Mouse Middle Click',
  },
  TertiaryKeymapLeft: {
    type: KeyLabelType.Icon,
    c: 'counter_3',
    title: 'Function Layer (left)',
  },
  TertiaryKeymapRight: {
    type: KeyLabelType.Icon,
    c: 'counter_3',
    title: 'Function Layer (right)',
  },
  SecondaryKeymapLeft: {
    type: KeyLabelType.Icon,
    c: 'counter_2',
    title: 'Numeric Layer (left)',
  },
  SecondaryKeymapRight: {
    type: KeyLabelType.Icon,
    c: 'counter_2',
    title: 'Numeric Layer (right)',
  },
  AmbidextrousThrowoverLeft: {
    type: KeyLabelType.Icon,
    c: 'switch_left',
    title: 'Ambidextrous Throwover (left)',
  },
  AmbidextrousThrowoverRight: {
    type: KeyLabelType.Icon,
    c: 'switch_right',
    title: 'Ambidextrous Throwover (right)',
  },
  MouseScrollCoastRight: {
    type: KeyLabelType.Icon,
    c: 'swipe_right',
    title: 'Mouse Scroll Right',
  },
  MouseScrollCoastLeft: {
    type: KeyLabelType.Icon,
    c: 'swipe_left',
    title: 'Mouse Scroll Left',
  },
  MouseScrollCoastDown: {
    type: KeyLabelType.Icon,
    c: 'swipe_down',
    title: 'Mouse Scroll Down',
  },
  MouseScrollCoastUp: {
    type: KeyLabelType.Icon,
    c: 'swipe_up',
    title: 'Mouse Scroll Up',
  },
  MouseMoveRight: {
    type: KeyLabelType.Icon,
    c: 'arrow_circle_right',
    title: 'Mouse Move Right',
  },
  MouseMoveLeft: {
    type: KeyLabelType.Icon,
    c: 'arrow_circle_left',
    title: 'Mouse Move Left',
  },
  MouseMoveDown: {
    type: KeyLabelType.Icon,
    c: 'arrow_circle_down',
    title: 'Mouse Move Down',
  },
  MouseMoveUp: {
    type: KeyLabelType.Icon,
    c: 'arrow_circle_up',
    title: 'Mouse Move Up',
  },
  Dup: { type: KeyLabelType.Icon, c: 'copy_all', title: 'Repeat Last Note' },
  GTM: {
    type: KeyLabelType.Icon,
    c: 'terminal',
    title: 'Toggle Generative Text Menu',
  },
  Impulse: {
    type: KeyLabelType.Icon,
    c: 'heap_snapshot_multiple',
    title: 'Toggle Impulse',
  },
  LeftHandThumb3Center: {
    type: KeyLabelType.Icon,
    c: 'radio_button_checked',
    title: 'Left Hand Thumb 3 3D Click',
  },
  LeftHandThumb2Center: {
    type: KeyLabelType.Icon,
    c: 'radio_button_checked',
    title: 'Left Hand Thumb 2 3D Click',
  },
  LeftHandThumb1Center: {
    type: KeyLabelType.Icon,
    c: 'radio_button_checked',
    title: 'Left Hand Thumb 1 3D Click',
  },
  LeftHandIndexCenter: {
    type: KeyLabelType.Icon,
    c: 'radio_button_checked',
    title: 'Left Hand Index 3D Click',
  },
  LeftHandMiddle1Center: {
    type: KeyLabelType.Icon,
    c: 'radio_button_checked',
    title: 'Left Hand Middle 1 3D Click',
  },
  LeftHandRing1Center: {
    type: KeyLabelType.Icon,
    c: 'radio_button_checked',
    title: 'Left Hand Ring 1 3D Click',
  },
  LeftHandPinkyCenter: {
    type: KeyLabelType.Icon,
    c: 'radio_button_checked',
    title: 'Left Hand Pinky 3D Click',
  },
  LeftHandMiddle2Center: {
    type: KeyLabelType.Icon,
    c: 'radio_button_checked',
    title: 'Left Hand Middle 2 3D Click',
  },
  LeftHandRing2Center: {
    type: KeyLabelType.Icon,
    c: 'radio_button_checked',
    title: 'Left Hand Ring 2 3D Click',
  },
  RightHandThumb3Center: {
    type: KeyLabelType.Icon,
    c: 'radio_button_checked',
    title: 'Right Hand Thumb 3 3D Click',
  },
  RightHandThumb2Center: {
    type: KeyLabelType.Icon,
    c: 'radio_button_checked',
    title: 'Right Hand Thumb 2 3D Click',
  },
  RightHandThumb1Center: {
    type: KeyLabelType.Icon,
    c: 'radio_button_checked',
    title: 'Right Hand Thumb 1 3D Click',
  },
  RightHandIndexCenter: {
    type: KeyLabelType.Icon,
    c: 'radio_button_checked',
    title: 'Right Hand Index 3D Click',
  },
  RightHandMiddle1Center: {
    type: KeyLabelType.Icon,
    c: 'radio_button_checked',
    title: 'Right Hand Middle 1 3D Click',
  },
  RightHandRing1Center: {
    type: KeyLabelType.Icon,
    c: 'radio_button_checked',
    title: 'Right Hand Ring 1 3D Click',
  },
  RightHandPinkyCenter: {
    type: KeyLabelType.Icon,
    c: 'radio_button_checked',
    title: 'Right Hand Pinky 3D Click',
  },
  RightHandMiddle2Center: {
    type: KeyLabelType.Icon,
    c: 'radio_button_checked',
    title: 'Right Hand Middle 2 3D Click',
  },
  RightHandRing2Center: {
    type: KeyLabelType.Icon,
    c: 'radio_button_checked',
    title: 'Right Hand Ring 2 3D Click',
  },
};

export const OS_2_META_KEY_LABEL_MAP: Partial<
  Record<
    OperatingSystemName | '*',
    Record<'MetaLeft' | 'MetaRight', RawKeyLabel>
  >
> = {
  macOS: {
    MetaLeft: {
      type: KeyLabelType.Icon,
      c: 'keyboard_command_key',
      title: 'Command [Windows / Super] (left)',
    },
    MetaRight: {
      type: KeyLabelType.Icon,
      c: 'keyboard_command_key',
      title: 'Command [Windows / Super] (right)',
    },
  },
  iOS: {
    MetaLeft: {
      type: KeyLabelType.Icon,
      c: 'keyboard_command_key',
      title: 'Command [Windows / Super] (left)',
    },
    MetaRight: {
      type: KeyLabelType.Icon,
      c: 'keyboard_command_key',
      title: 'Command [Windows / Super] (right)',
    },
  },
  Windows: {
    MetaLeft: {
      type: KeyLabelType.Icon,
      c: 'window',
      title: 'Windows [Command / Super] (left)',
    },
    MetaRight: {
      type: KeyLabelType.Icon,
      c: 'window',
      title: 'Windows [Command / Super] (right)',
    },
  },
  'Windows Mobile': {
    MetaLeft: {
      type: KeyLabelType.Icon,
      c: 'window',
      title: 'Windows [Command / Super] (left)',
    },
    MetaRight: {
      type: KeyLabelType.Icon,
      c: 'window',
      title: 'Windows [Command / Super] (right)',
    },
  },
  'Windows Phone': {
    MetaLeft: {
      type: KeyLabelType.Icon,
      c: 'window',
      title: 'Windows [Command / Super] (left)',
    },
    MetaRight: {
      type: KeyLabelType.Icon,
      c: 'window',
      title: 'Windows [Command / Super] (right)',
    },
  },
  Ubuntu: {
    MetaLeft: {
      type: KeyLabelType.Logo,
      c: FontLogo.Ubuntu,
      title: 'Super [Windows / Command] (left)',
    },
    MetaRight: {
      type: KeyLabelType.Logo,
      c: FontLogo.Ubuntu,
      title: 'Super [Windows / Command] (right)',
    },
  },
  Arch: {
    MetaLeft: {
      type: KeyLabelType.Logo,
      c: FontLogo.ArchLinux,
      title: 'Super [Windows / Command] (left)',
    },
    MetaRight: {
      type: KeyLabelType.Logo,
      c: FontLogo.ArchLinux,
      title: 'Super [Windows / Command] (right)',
    },
  },
  CentOS: {
    MetaLeft: {
      type: KeyLabelType.Logo,
      c: FontLogo.CentOS,
      title: 'Super [Windows / Command] (left)',
    },
    MetaRight: {
      type: KeyLabelType.Logo,
      c: FontLogo.CentOS,
      title: 'Super [Windows / Command] (right)',
    },
  },
  Debian: {
    MetaLeft: {
      type: KeyLabelType.Logo,
      c: FontLogo.Debian,
      title: 'Super [Windows / Command] (left)',
    },
    MetaRight: {
      type: KeyLabelType.Logo,
      c: FontLogo.Debian,
      title: 'Super [Windows / Command] (right)',
    },
  },
  'elementary OS': {
    MetaLeft: {
      type: KeyLabelType.Logo,
      c: FontLogo.Elementary,
      title: 'Super [Windows / Command] (left)',
    },
    MetaRight: {
      type: KeyLabelType.Logo,
      c: FontLogo.Elementary,
      title: 'Super [Windows / Command] (right)',
    },
  },
  Fedora: {
    MetaLeft: {
      type: KeyLabelType.Logo,
      c: FontLogo.Fedora,
      title: 'Super [Windows / Command] (left)',
    },
    MetaRight: {
      type: KeyLabelType.Logo,
      c: FontLogo.Fedora,
      title: 'Super [Windows / Command] (right)',
    },
  },
  FreeBSD: {
    MetaLeft: {
      type: KeyLabelType.Logo,
      c: FontLogo.FreeBSD,
      title: 'Super [Windows / Command] (left)',
    },
    MetaRight: {
      type: KeyLabelType.Logo,
      c: FontLogo.FreeBSD,
      title: 'Super [Windows / Command] (right)',
    },
  },
  Gentoo: {
    MetaLeft: {
      type: KeyLabelType.Logo,
      c: FontLogo.Gentoo,
      title: 'Super [Windows / Command] (left)',
    },
    MetaRight: {
      type: KeyLabelType.Logo,
      c: FontLogo.Gentoo,
      title: 'Super [Windows / Command] (right)',
    },
  },
  Mageia: {
    MetaLeft: {
      type: KeyLabelType.Logo,
      c: FontLogo.Mageia,
      title: 'Super [Windows / Command] (left)',
    },
    MetaRight: {
      type: KeyLabelType.Logo,
      c: FontLogo.Mageia,
      title: 'Super [Windows / Command] (right)',
    },
  },
  Mandriva: {
    MetaLeft: {
      type: KeyLabelType.Logo,
      c: FontLogo.Mandriva,
      title: 'Super [Windows / Command] (left)',
    },
    MetaRight: {
      type: KeyLabelType.Logo,
      c: FontLogo.Mandriva,
      title: 'Super [Windows / Command] (right)',
    },
  },
  Manjaro: {
    MetaLeft: {
      type: KeyLabelType.Logo,
      c: FontLogo.Manjaro,
      title: 'Super [Windows / Command] (left)',
    },
    MetaRight: {
      type: KeyLabelType.Logo,
      c: FontLogo.Manjaro,
      title: 'Super [Windows / Command] (right)',
    },
  },
  Mint: {
    MetaLeft: {
      type: KeyLabelType.Logo,
      c: FontLogo.LinuxMint,
      title: 'Super [Windows / Command] (left)',
    },
    MetaRight: {
      type: KeyLabelType.Logo,
      c: FontLogo.LinuxMint,
      title: 'Super [Windows / Command] (right)',
    },
  },
  OpenBSD: {
    MetaLeft: {
      type: KeyLabelType.Logo,
      c: FontLogo.OpenBSD,
      title: 'Super [Windows / Command] (left)',
    },
    MetaRight: {
      type: KeyLabelType.Logo,
      c: FontLogo.OpenBSD,
      title: 'Super [Windows / Command] (right)',
    },
  },
  Raspbian: {
    MetaLeft: {
      type: KeyLabelType.Logo,
      c: FontLogo.RaspberryPi,
      title: 'Super [Windows / Command] (left)',
    },
    MetaRight: {
      type: KeyLabelType.Logo,
      c: FontLogo.RaspberryPi,
      title: 'Super [Windows / Command] (right)',
    },
  },
  RedHat: {
    MetaLeft: {
      type: KeyLabelType.Logo,
      c: FontLogo.RedHat,
      title: 'Super [Windows / Command] (left)',
    },
    MetaRight: {
      type: KeyLabelType.Logo,
      c: FontLogo.RedHat,
      title: 'Super [Windows / Command] (right)',
    },
  },
  Sabayon: {
    MetaLeft: {
      type: KeyLabelType.Logo,
      c: FontLogo.Sabayon,
      title: 'Super [Windows / Command] (left)',
    },
    MetaRight: {
      type: KeyLabelType.Logo,
      c: FontLogo.Sabayon,
      title: 'Super [Windows / Command] (right)',
    },
  },
  Linux: {
    MetaLeft: {
      type: KeyLabelType.Logo,
      c: FontLogo.Tux,
      title: 'Super [Windows / Command] (left)',
    },
    MetaRight: {
      type: KeyLabelType.Logo,
      c: FontLogo.Tux,
      title: 'Super [Windows / Command] (right)',
    },
  },
};
