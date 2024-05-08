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
}
