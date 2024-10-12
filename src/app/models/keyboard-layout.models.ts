import { Action } from './action.models';
import { WSKCode } from './key-code.models';

/**
 * Output character information of a key on a keyboard layout.
 */
export interface KeyboardLayoutKey {
  unmodified: string;
  withShift: string;
  withAltGraph: string;
  withShiftAltGraph: string;
}

/**
 * Data of a keyboard layout (OS layout), which map key codes to keyboard layout keys
 */
export interface KeyBoardLayout {
  id: string;
  name: string;
  reference: string;
  layout: Partial<Record<WSKCode, Partial<KeyboardLayoutKey>>>;
}

/**
 * Map from character to key code (with shift key or alt graph information)
 */
export type CharacterKeyCodeMap = Map<string, CharacterKeyCode>;

/**
 * Data for a key combination that can type out a character
 */
export interface CharacterKeyCode {
  keyCode: WSKCode;
  shiftKey: boolean;
  altGraphKey: boolean;
}

/**
 * Data for an action combination that can type out a character
 */
export interface CharacterActionCode {
  actionCode: Action['codeId'];
  shiftKey: boolean;
  altGraphKey: boolean;
}
