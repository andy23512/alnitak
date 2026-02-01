export type PreferSides = 'both' | 'same';
export type PreferKeySide = 'left' | 'right';

export interface HighlightSetting {
  shiftLayer: {
    preferSides: PreferSides;
    preferShiftSide: PreferKeySide;
  };
  numShiftLayer: {
    preferSides: PreferSides;
    preferNumShiftSide: PreferKeySide;
  };
  shiftAndNumShiftLayer: {
    preferShiftSide: PreferKeySide;
    preferCharacterKeySide: PreferKeySide;
  };
  fnShiftLayer: {
    preferSides: PreferSides;
    preferFnShiftSide: PreferKeySide;
  };
  shiftAndFnShiftLayer: {
    preferShiftSide: PreferKeySide;
    preferCharacterKeySide: PreferKeySide;
  };
  flagShiftLayer: {
    preferSides: PreferSides;
    preferFlagShiftSide: PreferKeySide;
  };
  shiftAndFlagShiftLayer: {
    preferShiftSide: PreferKeySide;
    preferCharacterKeySide: PreferKeySide;
  };
}
