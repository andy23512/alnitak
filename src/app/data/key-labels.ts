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
  title: 'key-label.shift',
};

export const NUM_SHIFT_KEY_LABEL: KeyLabel = {
  type: KeyLabelType.Icon,
  c: 'counter_2',
  layer: null,
  shiftKey: null,
  altGraphKey: null,
  title: 'key-label.numeric-layer',
};

export const FN_SHIFT_KEY_LABEL: KeyLabel = {
  type: KeyLabelType.Icon,
  c: 'counter_3',
  layer: null,
  shiftKey: null,
  altGraphKey: null,
  title: 'key-label.function-layer',
};

export const ALT_GRAPH_KEY_LABEL: KeyLabel = {
  type: KeyLabelType.String,
  c: 'ALT(GR)',
  layer: null,
  shiftKey: null,
  altGraphKey: null,
  title: 'key-label.alt-graph',
};

export const NON_WSK_CODE_2_RAW_KEY_LABEL_MAP: Record<NonWSKCode, RawKeyLabel> =
  {
    AltLeft: {
      type: KeyLabelType.String,
      c: 'ALT',
      title: 'key-label.alt-left',
    },
    AltRight: {
      type: KeyLabelType.String,
      c: 'ALT(GR)',
      title: 'key-label.alt-right',
    },
    Backspace: {
      type: KeyLabelType.Icon,
      c: 'backspace',
      title: 'key-label.backspace',
    },
    CapsLock: {
      type: KeyLabelType.Icon,
      c: 'keyboard_capslock',
      title: 'key-label.caps-lock',
    },
    ContextMenu: {
      type: KeyLabelType.Icon,
      c: 'menu',
      title: 'key-label.context-menu',
    },
    ControlLeft: {
      type: KeyLabelType.String,
      c: 'CTRL',
      title: 'key-label.control-left',
    },
    ControlRight: {
      type: KeyLabelType.String,
      c: 'CTRL',
      title: 'key-label.control-right',
    },
    Enter: {
      type: KeyLabelType.Icon,
      c: 'keyboard_return',
      title: 'key-label.enter',
    },
    MetaLeft: {
      type: KeyLabelType.Icon,
      c: 'apps',
      title: 'key-label.meta-left',
    },
    MetaRight: {
      type: KeyLabelType.Icon,
      c: 'apps',
      title: 'key-label.meta-right',
    },
    ShiftLeft: {
      type: KeyLabelType.Icon,
      c: 'shift',
      title: 'key-label.shift-left',
    },
    ShiftRight: {
      type: KeyLabelType.Icon,
      c: 'shift',
      title: 'key-label.shift-right',
    },
    Space: {
      type: KeyLabelType.Icon,
      c: 'space_bar',
      title: 'key-label.space',
    },
    Tab: { type: KeyLabelType.Icon, c: 'keyboard_tab', title: 'key-label.tab' },
    Escape: { type: KeyLabelType.String, c: 'ESC', title: 'key-label.esc' },
    F1: { type: KeyLabelType.String, c: 'F1', title: 'key-label.f1' },
    F2: { type: KeyLabelType.String, c: 'F2', title: 'key-label.f2' },
    F3: { type: KeyLabelType.String, c: 'F3', title: 'key-label.f3' },
    F4: { type: KeyLabelType.String, c: 'F4', title: 'key-label.f4' },
    F5: { type: KeyLabelType.String, c: 'F5', title: 'key-label.f5' },
    F6: { type: KeyLabelType.String, c: 'F6', title: 'key-label.f6' },
    F7: { type: KeyLabelType.String, c: 'F7', title: 'key-label.f7' },
    F8: { type: KeyLabelType.String, c: 'F8', title: 'key-label.f8' },
    F9: { type: KeyLabelType.String, c: 'F9', title: 'key-label.f9' },
    F10: { type: KeyLabelType.String, c: 'F10', title: 'key-label.f10' },
    F11: { type: KeyLabelType.String, c: 'F11', title: 'key-label.f11' },
    F12: { type: KeyLabelType.String, c: 'F12', title: 'key-label.f12' },
    PrintScreen: {
      type: KeyLabelType.Icon,
      c: 'screenshot_monitor',
      title: 'key-label.print-screen',
    },
    Delete: { type: KeyLabelType.String, c: 'DEL', title: 'key-label.delete' },
    ArrowDown: {
      type: KeyLabelType.Icon,
      c: 'keyboard_arrow_down',
      title: 'key-label.arrow-down',
    },
    ArrowLeft: {
      type: KeyLabelType.Icon,
      c: 'keyboard_arrow_left',
      title: 'key-label.arrow-left',
    },
    ArrowRight: {
      type: KeyLabelType.Icon,
      c: 'keyboard_arrow_right',
      title: 'key-label.arrow-right',
    },
    ArrowUp: {
      type: KeyLabelType.Icon,
      c: 'keyboard_arrow_up',
      title: 'key-label.arrow-up',
    },
    PageUp: {
      type: KeyLabelType.Icon,
      c: 'move_up',
      title: 'key-label.page-up',
    },
    PageDown: {
      type: KeyLabelType.Icon,
      c: 'move_down',
      title: 'key-label.page-down',
    },
    Home: { type: KeyLabelType.Icon, c: 'home', title: 'key-label.home' },
    End: { type: KeyLabelType.String, c: 'END', title: 'key-label.end' },
    Insert: {
      type: KeyLabelType.Icon,
      c: 'insert_text',
      title: 'key-label.insert',
    },
    NumpadDivide: {
      type: KeyLabelType.String,
      c: '/(KP)',
      title: 'key-label.numpad-divide',
    },
    NumpadMultiply: {
      type: KeyLabelType.String,
      c: '*(KP)',
      title: 'key-label.numpad-multiply',
    },
    NumpadSubtract: {
      type: KeyLabelType.String,
      c: '-(KP)',
      title: 'key-label.numpad-subtract',
    },
    NumpadAdd: {
      type: KeyLabelType.String,
      c: '+(KP)',
      title: 'key-label.numpad-add',
    },
    NumpadEnter: {
      type: KeyLabelType.String,
      c: 'Enter(KP)',
      title: 'key-label.numpad-enter',
    },
  };

export const NON_KEY_ACTION_NAME_2_RAW_KEY_LABEL_MAP: Record<
  NonKeyActionName,
  RawKeyLabel
> = {
  NoKeyPressed: {
    type: KeyLabelType.Icon,
    c: 'block',
    title: 'key-label.no-key-pressed',
  },
  RestartInputDevice: {
    type: KeyLabelType.Icon,
    c: 'restart_alt',
    title: 'key-label.restart-input-device',
  },
  MouseLeftClick: {
    type: KeyLabelType.Icon,
    c: 'left_click',
    title: 'key-label.mouse-left-click',
  },
  MouseRightClick: {
    type: KeyLabelType.Icon,
    c: 'right_click',
    title: 'key-label.mouse-right-click',
  },
  MouseMiddleClick: {
    type: KeyLabelType.Icon,
    c: 'touchpad_mouse',
    title: 'key-label.mouse-middle-click',
  },
  TertiaryKeymapLeft: {
    type: KeyLabelType.Icon,
    c: 'counter_3',
    title: 'key-label.tertiary-keymap-left',
  },
  TertiaryKeymapRight: {
    type: KeyLabelType.Icon,
    c: 'counter_3',
    title: 'key-label.tertiary-keymap-right',
  },
  SecondaryKeymapLeft: {
    type: KeyLabelType.Icon,
    c: 'counter_2',
    title: 'key-label.secondary-keymap-left',
  },
  SecondaryKeymapRight: {
    type: KeyLabelType.Icon,
    c: 'counter_2',
    title: 'key-label.secondary-keymap-left',
  },
  AmbidextrousThrowoverLeft: {
    type: KeyLabelType.Icon,
    c: 'switch_left',
    title: 'key-label.ambidextrous-throwover-left',
  },
  AmbidextrousThrowoverRight: {
    type: KeyLabelType.Icon,
    c: 'switch_right',
    title: 'key-label.ambidextrous-throwover-right',
  },
  MouseScrollCoastRight: {
    type: KeyLabelType.Icon,
    c: 'swipe_right',
    title: 'key-label.mouse-scroll-coast-right',
  },
  MouseScrollCoastLeft: {
    type: KeyLabelType.Icon,
    c: 'swipe_left',
    title: 'key-label.mouse-scroll-coast-left',
  },
  MouseScrollCoastDown: {
    type: KeyLabelType.Icon,
    c: 'swipe_down',
    title: 'key-label.mouse-scroll-coast-down',
  },
  MouseScrollCoastUp: {
    type: KeyLabelType.Icon,
    c: 'swipe_up',
    title: 'key-label.mouse-scroll-coast-up',
  },
  MouseMoveRight: {
    type: KeyLabelType.Icon,
    c: 'arrow_circle_right',
    title: 'key-label.mouse-move-right',
  },
  MouseMoveLeft: {
    type: KeyLabelType.Icon,
    c: 'arrow_circle_left',
    title: 'key-label.mouse-move-left',
  },
  MouseMoveDown: {
    type: KeyLabelType.Icon,
    c: 'arrow_circle_down',
    title: 'key-label.mouse-move-down',
  },
  MouseMoveUp: {
    type: KeyLabelType.Icon,
    c: 'arrow_circle_up',
    title: 'key-label.mouse-move-up',
  },
  Dup: { type: KeyLabelType.Icon, c: 'copy_all', title: 'key-label.dup' },
  GTM: {
    type: KeyLabelType.Icon,
    c: 'terminal',
    title: 'key-label.gtm',
  },
  Impulse: {
    type: KeyLabelType.Icon,
    c: 'heap_snapshot_multiple',
    title: 'key-label.impulse',
  },
  LeftHandThumb3Center: {
    type: KeyLabelType.Icon,
    c: 'radio_button_checked',
    title: 'key-label.left-hand-thumb-3-center',
  },
  LeftHandThumb2Center: {
    type: KeyLabelType.Icon,
    c: 'radio_button_checked',
    title: 'key-label.left-hand-thumb-2-center',
  },
  LeftHandThumb1Center: {
    type: KeyLabelType.Icon,
    c: 'radio_button_checked',
    title: 'key-label.left-hand-thumb-1-center',
  },
  LeftHandIndexCenter: {
    type: KeyLabelType.Icon,
    c: 'radio_button_checked',
    title: 'key-label.left-hand-index-center',
  },
  LeftHandMiddle1Center: {
    type: KeyLabelType.Icon,
    c: 'radio_button_checked',
    title: 'key-label.left-hand-middle-1-center',
  },
  LeftHandRing1Center: {
    type: KeyLabelType.Icon,
    c: 'radio_button_checked',
    title: 'key-label.left-hand-ring-1-center',
  },
  LeftHandPinkyCenter: {
    type: KeyLabelType.Icon,
    c: 'radio_button_checked',
    title: 'key-label.left-hand-pinky-center',
  },
  LeftHandMiddle2Center: {
    type: KeyLabelType.Icon,
    c: 'radio_button_checked',
    title: 'key-label.left-hand-middle-2-center',
  },
  LeftHandRing2Center: {
    type: KeyLabelType.Icon,
    c: 'radio_button_checked',
    title: 'key-label.left-hand-ring-2-center',
  },
  RightHandThumb3Center: {
    type: KeyLabelType.Icon,
    c: 'radio_button_checked',
    title: 'key-label.right-hand-thumb-3-center',
  },
  RightHandThumb2Center: {
    type: KeyLabelType.Icon,
    c: 'radio_button_checked',
    title: 'key-label.right-hand-thumb-2-center',
  },
  RightHandThumb1Center: {
    type: KeyLabelType.Icon,
    c: 'radio_button_checked',
    title: 'key-label.right-hand-thumb-1-center',
  },
  RightHandIndexCenter: {
    type: KeyLabelType.Icon,
    c: 'radio_button_checked',
    title: 'key-label.right-hand-index-center',
  },
  RightHandMiddle1Center: {
    type: KeyLabelType.Icon,
    c: 'radio_button_checked',
    title: 'key-label.right-hand-middle-1-center',
  },
  RightHandRing1Center: {
    type: KeyLabelType.Icon,
    c: 'radio_button_checked',
    title: 'key-label.right-hand-ring-1-center',
  },
  RightHandPinkyCenter: {
    type: KeyLabelType.Icon,
    c: 'radio_button_checked',
    title: 'key-label.right-hand-pinky-center',
  },
  RightHandMiddle2Center: {
    type: KeyLabelType.Icon,
    c: 'radio_button_checked',
    title: 'key-label.right-hand-middle-2-center',
  },
  RightHandRing2Center: {
    type: KeyLabelType.Icon,
    c: 'radio_button_checked',
    title: 'key-label.right-hand-ring-2-center',
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
      title: 'key-label.apple-meta-left',
    },
    MetaRight: {
      type: KeyLabelType.Icon,
      c: 'keyboard_command_key',
      title: 'key-label.apple-meta-right',
    },
  },
  iOS: {
    MetaLeft: {
      type: KeyLabelType.Icon,
      c: 'keyboard_command_key',
      title: 'key-label.apple-meta-left',
    },
    MetaRight: {
      type: KeyLabelType.Icon,
      c: 'keyboard_command_key',
      title: 'key-label.apple-meta-right',
    },
  },
  Windows: {
    MetaLeft: {
      type: KeyLabelType.Icon,
      c: 'window',
      title: 'key-label.windows-meta-left',
    },
    MetaRight: {
      type: KeyLabelType.Icon,
      c: 'window',
      title: 'key-label.windows-meta-right',
    },
  },
  'Windows Mobile': {
    MetaLeft: {
      type: KeyLabelType.Icon,
      c: 'window',
      title: 'key-label.windows-meta-left',
    },
    MetaRight: {
      type: KeyLabelType.Icon,
      c: 'window',
      title: 'key-label.windows-meta-right',
    },
  },
  'Windows Phone': {
    MetaLeft: {
      type: KeyLabelType.Icon,
      c: 'window',
      title: 'key-label.windows-meta-left',
    },
    MetaRight: {
      type: KeyLabelType.Icon,
      c: 'window',
      title: 'key-label.windows-meta-right',
    },
  },
  Ubuntu: {
    MetaLeft: {
      type: KeyLabelType.Logo,
      c: FontLogo.Ubuntu,
      title: 'key-label.unix-meta-left',
    },
    MetaRight: {
      type: KeyLabelType.Logo,
      c: FontLogo.Ubuntu,
      title: 'key-label.unix-meta-right',
    },
  },
  Arch: {
    MetaLeft: {
      type: KeyLabelType.Logo,
      c: FontLogo.ArchLinux,
      title: 'key-label.unix-meta-left',
    },
    MetaRight: {
      type: KeyLabelType.Logo,
      c: FontLogo.ArchLinux,
      title: 'key-label.unix-meta-right',
    },
  },
  CentOS: {
    MetaLeft: {
      type: KeyLabelType.Logo,
      c: FontLogo.CentOS,
      title: 'key-label.unix-meta-left',
    },
    MetaRight: {
      type: KeyLabelType.Logo,
      c: FontLogo.CentOS,
      title: 'key-label.unix-meta-right',
    },
  },
  Debian: {
    MetaLeft: {
      type: KeyLabelType.Logo,
      c: FontLogo.Debian,
      title: 'key-label.unix-meta-left',
    },
    MetaRight: {
      type: KeyLabelType.Logo,
      c: FontLogo.Debian,
      title: 'key-label.unix-meta-right',
    },
  },
  'elementary OS': {
    MetaLeft: {
      type: KeyLabelType.Logo,
      c: FontLogo.Elementary,
      title: 'key-label.unix-meta-left',
    },
    MetaRight: {
      type: KeyLabelType.Logo,
      c: FontLogo.Elementary,
      title: 'key-label.unix-meta-right',
    },
  },
  Fedora: {
    MetaLeft: {
      type: KeyLabelType.Logo,
      c: FontLogo.Fedora,
      title: 'key-label.unix-meta-left',
    },
    MetaRight: {
      type: KeyLabelType.Logo,
      c: FontLogo.Fedora,
      title: 'key-label.unix-meta-right',
    },
  },
  FreeBSD: {
    MetaLeft: {
      type: KeyLabelType.Logo,
      c: FontLogo.FreeBSD,
      title: 'key-label.unix-meta-left',
    },
    MetaRight: {
      type: KeyLabelType.Logo,
      c: FontLogo.FreeBSD,
      title: 'key-label.unix-meta-right',
    },
  },
  Gentoo: {
    MetaLeft: {
      type: KeyLabelType.Logo,
      c: FontLogo.Gentoo,
      title: 'key-label.unix-meta-left',
    },
    MetaRight: {
      type: KeyLabelType.Logo,
      c: FontLogo.Gentoo,
      title: 'key-label.unix-meta-right',
    },
  },
  Mageia: {
    MetaLeft: {
      type: KeyLabelType.Logo,
      c: FontLogo.Mageia,
      title: 'key-label.unix-meta-left',
    },
    MetaRight: {
      type: KeyLabelType.Logo,
      c: FontLogo.Mageia,
      title: 'key-label.unix-meta-right',
    },
  },
  Mandriva: {
    MetaLeft: {
      type: KeyLabelType.Logo,
      c: FontLogo.Mandriva,
      title: 'key-label.unix-meta-left',
    },
    MetaRight: {
      type: KeyLabelType.Logo,
      c: FontLogo.Mandriva,
      title: 'key-label.unix-meta-right',
    },
  },
  Manjaro: {
    MetaLeft: {
      type: KeyLabelType.Logo,
      c: FontLogo.Manjaro,
      title: 'key-label.unix-meta-left',
    },
    MetaRight: {
      type: KeyLabelType.Logo,
      c: FontLogo.Manjaro,
      title: 'key-label.unix-meta-right',
    },
  },
  Mint: {
    MetaLeft: {
      type: KeyLabelType.Logo,
      c: FontLogo.LinuxMint,
      title: 'key-label.unix-meta-left',
    },
    MetaRight: {
      type: KeyLabelType.Logo,
      c: FontLogo.LinuxMint,
      title: 'key-label.unix-meta-right',
    },
  },
  OpenBSD: {
    MetaLeft: {
      type: KeyLabelType.Logo,
      c: FontLogo.OpenBSD,
      title: 'key-label.unix-meta-left',
    },
    MetaRight: {
      type: KeyLabelType.Logo,
      c: FontLogo.OpenBSD,
      title: 'key-label.unix-meta-right',
    },
  },
  Raspbian: {
    MetaLeft: {
      type: KeyLabelType.Logo,
      c: FontLogo.RaspberryPi,
      title: 'key-label.unix-meta-left',
    },
    MetaRight: {
      type: KeyLabelType.Logo,
      c: FontLogo.RaspberryPi,
      title: 'key-label.unix-meta-right',
    },
  },
  RedHat: {
    MetaLeft: {
      type: KeyLabelType.Logo,
      c: FontLogo.RedHat,
      title: 'key-label.unix-meta-left',
    },
    MetaRight: {
      type: KeyLabelType.Logo,
      c: FontLogo.RedHat,
      title: 'key-label.unix-meta-right',
    },
  },
  Sabayon: {
    MetaLeft: {
      type: KeyLabelType.Logo,
      c: FontLogo.Sabayon,
      title: 'key-label.unix-meta-left',
    },
    MetaRight: {
      type: KeyLabelType.Logo,
      c: FontLogo.Sabayon,
      title: 'key-label.unix-meta-right',
    },
  },
  Linux: {
    MetaLeft: {
      type: KeyLabelType.Logo,
      c: FontLogo.Tux,
      title: 'key-label.unix-meta-left',
    },
    MetaRight: {
      type: KeyLabelType.Logo,
      c: FontLogo.Tux,
      title: 'key-label.unix-meta-right',
    },
  },
};
