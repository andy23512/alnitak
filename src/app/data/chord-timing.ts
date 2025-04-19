import { ChordAnimationEvent } from '../models/chord-animation-event.models';

export const CHORDING_TIMING: Record<string, ChordAnimationEvent[]> = {
  cc1: [
    { type: '+', c: 'c', t: 0 },
    { type: '+', c: 'c', t: 14.1 },
    { type: '+', c: '1', t: 27.3 },
    { type: '-', t: 135.9 },
    { type: '-', t: 147.0 },
    { type: '-', t: 153.9 },
    { type: '+', c: 'C', t: 178.6 },
    { type: '+', c: 'h', t: 193.6 },
    { type: '+', c: 'a', t: 202.7 },
    { type: '+', c: 'r', t: 213.1 },
    { type: '+', c: 'a', t: 235.4 },
    { type: '+', c: 'C', t: 253.0 },
    { type: '+', c: 'h', t: 267.8 },
    { type: '+', c: 'o', t: 276.8 },
    { type: '+', c: 'r', t: 285.9 },
    { type: '+', c: 'd', t: 296.5 },
    { type: '+', c: 'e', t: 305.9 },
    { type: '+', c: 'r', t: 317.0 },
    { type: '+', c: ' ', t: 328.9 },
    { type: '+', c: 'O', t: 351.0 },
    { type: '+', c: 'n', t: 370.9 },
    { type: '+', c: 'e', t: 382.1 },
  ],
  cc2: [
    { type: '+', c: 'c', t: 0 },
    { type: '+', c: 'c', t: 38.5 },
    { type: '+', c: '2', t: 43.9 },
    { type: '-', t: 126.5 },
    { type: '-', t: 138.0 },
    { type: '-', t: 145.2 },
    { type: '+', c: 'C', t: 166.8 },
    { type: '+', c: 'h', t: 179.5 },
    { type: '+', c: 'a', t: 186.8 },
    { type: '+', c: 'r', t: 194.6 },
    { type: '+', c: 'a', t: 218.1 },
    { type: '+', c: 'C', t: 237.9 },
    { type: '+', c: 'h', t: 267.1 },
    { type: '+', c: 'o', t: 276.3 },
    { type: '+', c: 'r', t: 285.2 },
    { type: '+', c: 'd', t: 294.9 },
    { type: '+', c: 'e', t: 305.1 },
    { type: '+', c: 'r', t: 315.5 },
    { type: '+', c: ' ', t: 326.9 },
    { type: '+', c: 'T', t: 344.8 },
    { type: '+', c: 'w', t: 364.2 },
    { type: '+', c: 'o', t: 382.1 },
  ],
  m4g: [
    { type: '+', c: 'm', t: 0 },
    { type: '+', c: '4', t: 14.7 },
    { type: '+', c: 'g', t: 19.6 },
    { type: '-', t: 138.3 },
    { type: '-', t: 153.8 },
    { type: '-', t: 168.5 },
    { type: '+', c: 'M', t: 182.1 },
    { type: '+', c: 'a', t: 192.1 },
    { type: '+', c: 's', t: 201.8 },
    { type: '+', c: 't', t: 214.0 },
    { type: '+', c: 'e', t: 222.4 },
    { type: '+', c: 'r', t: 239.4 },
    { type: '+', c: ' ', t: 249.5 },
    { type: '+', c: 'F', t: 272.6 },
    { type: '+', c: 'o', t: 292.7 },
    { type: '+', c: 'r', t: 305.0 },
    { type: '+', c: 'g', t: 317.1 },
    { type: '+', c: 'e', t: 330.1 },
  ],
};
