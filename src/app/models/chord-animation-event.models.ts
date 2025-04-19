export type ChordAnimationEvent =
  | {
      type: '+';
      c: string;
      t: number;
    }
  | { type: '-'; t: number };
