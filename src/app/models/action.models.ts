import { NonWSKCode, WSKCode } from './key-code.models';

interface BaseAction {
  codeId: number;
}

export enum ActionType {
  WSK = 'wsk',
  NonWSK = 'non-wsk',
  NonKey = 'non-key',
}

export type NonKeyActionName =
  | 'MouseLeftClick'
  | 'MouseRightClick'
  | 'TertiaryKeymapLeft'
  | 'TertiaryKeymapRight'
  | 'SecondaryKeymapLeft'
  | 'SecondaryKeymapRight'
  | 'AmbidextrousThrowoverLeft'
  | 'AmbidextrousThrowoverRight'
  | 'MouseScrollCoastRight'
  | 'MouseScrollCoastLeft'
  | 'MouseScrollCoastDown'
  | 'MouseScrollCoastUp'
  | 'MouseMoveRight'
  | 'MouseMoveLeft'
  | 'MouseMoveDown'
  | 'MouseMoveUp'
  | 'Dup'
  | 'GTM'
  | 'Impulse';

export interface WSKAction extends BaseAction {
  type: ActionType.WSK;
  keyCode: WSKCode;
  withShift?: boolean;
}

export interface NonWSKAction extends BaseAction {
  type: ActionType.NonWSK;
  keyCode: NonWSKCode;
}

export interface NonKeyAction extends BaseAction {
  type: ActionType.NonKey;
  actionName: NonKeyActionName;
}

/**
 * Action of CharaChorder device. They can be assigned to keys on a CharaChorder device.
 */
export type Action = WSKAction | NonWSKAction | NonKeyAction;
