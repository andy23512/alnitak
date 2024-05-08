export type PreferHand = 'both' | 'single' | null;
export type PreferSide = 'left' | 'right' | null;

export interface HighlightSetting {
  shiftLayer: {
    preferHand: PreferHand;
    preferSideOfShift: PreferSide;
  };
  numShiftLayer: {
    preferHand: PreferHand;
    preferSideOfNumShift: PreferSide;
  };
  shiftAndNumShiftLayer: {
    preferSideOfShift: PreferSide;
    preferSideOfCharacterKey: PreferSide;
  };
}
