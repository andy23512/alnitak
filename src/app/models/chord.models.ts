import { Icon } from '../types/icon.types';

export type ChordKey =
  | {
      type: 'character';
      value: string;
    }
  | { type: 'icon'; value: Icon };

export interface Chord {
  id: string;
  input: number[];
  output: number[];
}

export interface ChordWithChordKeys extends Chord {
  inputKeys: ChordKey[];
  outputKeys: ChordKey[];
  outputText: string;
}
