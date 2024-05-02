import { WritingSystemKeyCode } from './writing-system-key-code.models';

/**
 * Action of CharaChorder device. They can be assigned to keys on a CharaChorder device.
 */
export interface Action {
  codeId: number;
  type: string;
  representation: string;
  description: string;
  notes: string;
  writingSystemKeyCode?: WritingSystemKeyCode;
}
