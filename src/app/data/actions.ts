import { range } from 'ramda';
import {
  Action,
  ActionType,
  NonKeyAction,
  NonWSKAction,
  WSKAction,
} from '../models/action.models';

export const NUM_SHIFT_ACTION_CODES = [550, 551];
export const FN_SHIFT_ACTION_CODES = [552, 553];
export const SHIFT_ACTION_CODES = [513, 517];
export const ALT_GR_ACTION_CODE = 518;
export const WSK_ACTIONS: Omit<WSKAction, 'type'>[] = [
  { codeId: 39, keyCode: 'Quote' },
  { codeId: 44, keyCode: 'Comma' },
  { codeId: 45, keyCode: 'Minus' },
  { codeId: 46, keyCode: 'Period' },
  { codeId: 47, keyCode: 'Slash' },
  { codeId: 48, keyCode: 'Digit0' },
  { codeId: 49, keyCode: 'Digit1' },
  { codeId: 50, keyCode: 'Digit2' },
  { codeId: 51, keyCode: 'Digit3' },
  { codeId: 52, keyCode: 'Digit4' },
  { codeId: 53, keyCode: 'Digit5' },
  { codeId: 54, keyCode: 'Digit6' },
  { codeId: 55, keyCode: 'Digit7' },
  { codeId: 56, keyCode: 'Digit8' },
  { codeId: 57, keyCode: 'Digit9' },
  { codeId: 59, keyCode: 'Semicolon' },
  { codeId: 61, keyCode: 'Equal' },
  { codeId: 65, keyCode: 'KeyA', withShift: true },
  { codeId: 66, keyCode: 'KeyB', withShift: true },
  { codeId: 67, keyCode: 'KeyC', withShift: true },
  { codeId: 68, keyCode: 'KeyD', withShift: true },
  { codeId: 69, keyCode: 'KeyE', withShift: true },
  { codeId: 70, keyCode: 'KeyF', withShift: true },
  { codeId: 71, keyCode: 'KeyG', withShift: true },
  { codeId: 72, keyCode: 'KeyH', withShift: true },
  { codeId: 73, keyCode: 'KeyI', withShift: true },
  { codeId: 74, keyCode: 'KeyJ', withShift: true },
  { codeId: 75, keyCode: 'KeyK', withShift: true },
  { codeId: 76, keyCode: 'KeyL', withShift: true },
  { codeId: 77, keyCode: 'KeyM', withShift: true },
  { codeId: 78, keyCode: 'KeyN', withShift: true },
  { codeId: 79, keyCode: 'KeyO', withShift: true },
  { codeId: 80, keyCode: 'KeyP', withShift: true },
  { codeId: 81, keyCode: 'KeyQ', withShift: true },
  { codeId: 82, keyCode: 'KeyR', withShift: true },
  { codeId: 83, keyCode: 'KeyS', withShift: true },
  { codeId: 84, keyCode: 'KeyT', withShift: true },
  { codeId: 85, keyCode: 'KeyU', withShift: true },
  { codeId: 86, keyCode: 'KeyV', withShift: true },
  { codeId: 87, keyCode: 'KeyW', withShift: true },
  { codeId: 88, keyCode: 'KeyX', withShift: true },
  { codeId: 89, keyCode: 'KeyY', withShift: true },
  { codeId: 90, keyCode: 'KeyZ', withShift: true },
  { codeId: 91, keyCode: 'BracketLeft' },
  { codeId: 92, keyCode: 'Backslash' },
  { codeId: 93, keyCode: 'BracketRight' },
  { codeId: 96, keyCode: 'Backquote' },
  { codeId: 97, keyCode: 'KeyA' },
  { codeId: 98, keyCode: 'KeyB' },
  { codeId: 99, keyCode: 'KeyC' },
  { codeId: 100, keyCode: 'KeyD' },
  { codeId: 101, keyCode: 'KeyE' },
  { codeId: 102, keyCode: 'KeyF' },
  { codeId: 103, keyCode: 'KeyG' },
  { codeId: 104, keyCode: 'KeyH' },
  { codeId: 105, keyCode: 'KeyI' },
  { codeId: 106, keyCode: 'KeyJ' },
  { codeId: 107, keyCode: 'KeyK' },
  { codeId: 108, keyCode: 'KeyL' },
  { codeId: 109, keyCode: 'KeyM' },
  { codeId: 110, keyCode: 'KeyN' },
  { codeId: 111, keyCode: 'KeyO' },
  { codeId: 112, keyCode: 'KeyP' },
  { codeId: 113, keyCode: 'KeyQ' },
  { codeId: 114, keyCode: 'KeyR' },
  { codeId: 115, keyCode: 'KeyS' },
  { codeId: 116, keyCode: 'KeyT' },
  { codeId: 117, keyCode: 'KeyU' },
  { codeId: 118, keyCode: 'KeyV' },
  { codeId: 119, keyCode: 'KeyW' },
  { codeId: 120, keyCode: 'KeyX' },
  { codeId: 121, keyCode: 'KeyY' },
  { codeId: 122, keyCode: 'KeyZ' },
];
export const NON_WSK_ACTIONS: Omit<NonWSKAction, 'type'>[] = [
  { codeId: 514, keyCode: 'AltLeft' },
  { codeId: 518, keyCode: 'AltRight' },
  { codeId: 298, keyCode: 'Backspace' },
  { codeId: 313, keyCode: 'CapsLock' },
  { codeId: 357, keyCode: 'ContextMenu' },
  { codeId: 512, keyCode: 'ControlLeft' },
  { codeId: 516, keyCode: 'ControlRight' },
  { codeId: 296, keyCode: 'Enter' },
  { codeId: 515, keyCode: 'MetaLeft' },
  { codeId: 519, keyCode: 'MetaRight' },
  { codeId: 515, keyCode: 'ShiftLeft' },
  { codeId: 519, keyCode: 'ShiftRight' },
  { codeId: 32, keyCode: 'Space' },
  { codeId: 299, keyCode: 'Tab' },
  { codeId: 297, keyCode: 'Escape' },
];
export const NON_KEY_ACTIONS: Omit<NonKeyAction, 'type'>[] = [
  { codeId: 562, actionName: 'MouseLeftClick' },
  { codeId: 563, actionName: 'MouseRightClick' },
];
export const NO_ACTION_ACTION_CODES = [0, ...range(600, 617 + 1)];
export const ACTIONS: Action[] = [
  ...WSK_ACTIONS.map((a) => ({
    ...a,
    type: ActionType.WSK as const,
  })),
  ...NON_WSK_ACTIONS.map((a) => ({
    ...a,
    type: ActionType.NonWSK as const,
  })),
  ...NON_KEY_ACTIONS.map((a) => ({
    ...a,
    type: ActionType.NonKey as const,
  })),
];
