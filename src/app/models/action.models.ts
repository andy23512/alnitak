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
  | 'NoKeyPressed'
  | 'RestartInputDevice'
  | 'MouseLeftClick'
  | 'MouseRightClick'
  | 'MouseMiddleClick'
  | 'TertiaryKeymapLeft'
  | 'TertiaryKeymapRight'
  | 'SecondaryKeymapLeft'
  | 'SecondaryKeymapRight'
  | 'PrimaryKeymapLeft'
  | 'PrimaryKeymapRight'
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
  | 'Impulse'
  | 'LeftHandThumb3Center'
  | 'LeftHandThumb2Center'
  | 'LeftHandThumb1Center'
  | 'LeftHandIndexCenter'
  | 'LeftHandMiddle1Center'
  | 'LeftHandRing1Center'
  | 'LeftHandPinkyCenter'
  | 'LeftHandMiddle2Center'
  | 'LeftHandRing2Center'
  | 'RightHandThumb3Center'
  | 'RightHandThumb2Center'
  | 'RightHandThumb1Center'
  | 'RightHandIndexCenter'
  | 'RightHandMiddle1Center'
  | 'RightHandRing1Center'
  | 'RightHandPinkyCenter'
  | 'RightHandMiddle2Center'
  | 'RightHandRing2Center';

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
