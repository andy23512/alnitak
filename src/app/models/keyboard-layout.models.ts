import { Action } from './action.models';
import { WritingSystemKeyCode } from './writing-system-key-code.models';

export interface KeyboardLayoutKey {
  unmodified: string;
  withShift: string;
  withAltGraph: string;
  withShiftAltGraph: string;
}

export interface KeyBoardLayout {
  id: string;
  name: string;
  reference: string;
  layout: Partial<Record<WritingSystemKeyCode, Partial<KeyboardLayoutKey>>>;
}

export type CharacterKeyCodeMap = Map<string, CharacterKeyCode>;

export interface CharacterKeyCode {
  keyCode: WritingSystemKeyCode;
  shiftKey: boolean;
  altGraphKey: boolean;
}

export interface CharacterActionCode {
  actionCode: Action['codeId'];
  shiftKey: boolean;
  altGraphKey: boolean;
}
