export type ChordKey = {
  type: 'character' | 'icon';
  value: string;
};

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
