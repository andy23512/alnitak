import { WritingSystemKeyCode } from './writing-system-key-code.models';

interface KeyboardLayoutKey {
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
