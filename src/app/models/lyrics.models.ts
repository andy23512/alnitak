export interface Lyrics {
  segments: LyricSegment[];
}

export interface LyricSegment {
  start: number;
  end: number;
  text: string;
  words: LyricWord[];
  components?: string[];
}

export interface LyricWord {
  word: string;
  start: number;
  end: number;
  components?: string[];
}
