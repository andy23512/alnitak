import { WritingSystemKeyCode } from './writing-system-key-code.models';

export interface Action {
  codeId: number;
  type: string;
  representation: string;
  description: string;
  notes: string;
  writingSystemKeyCode?: WritingSystemKeyCode;
}
