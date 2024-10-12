import { FunctionalKeyCode } from './functional-key-code.models';
import { WritingSystemKeyCode } from './writing-system-key-code.models';

interface BaseAction {
  codeId: number;
}

export enum ActionType {
  WritingSystemKey = 'writing-system-key',
  FunctionalKey = 'functional-key',
}

export interface WritingSystemKeyAction extends BaseAction {
  type: ActionType.WritingSystemKey;
  writingSystemKeyCode: WritingSystemKeyCode;
  withShift?: boolean;
}

export interface FunctionalKeyAction extends BaseAction {
  type: ActionType.FunctionalKey;
  functionalKeyCode: FunctionalKeyCode;
}

/**
 * Action of CharaChorder device. They can be assigned to keys on a CharaChorder device.
 */
export type Action = WritingSystemKeyAction | FunctionalKeyAction;
