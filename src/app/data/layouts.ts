import { FullLayout } from '../models/layout.models';

export const POSITION_CODE_LAYOUT: FullLayout<number> = {
  left: {
    thumbEnd: { c: 0, e: 1, n: 2, w: 3, s: 4 },
    thumbMid: { c: 5, e: 6, n: 7, w: 8, s: 9 },
    thumbTip: { c: 10, e: 11, n: 12, w: 13, s: 14 },
    index: { c: 15, e: 16, n: 17, w: 18, s: 19 },
    middle: { c: 20, e: 21, n: 22, w: 23, s: 24 },
    ring: { c: 25, e: 26, n: 27, w: 28, s: 29 },
    little: { c: 30, e: 31, n: 32, w: 33, s: 34 },
    middleMid: { c: 35, e: 36, n: 37, w: 38, s: 39 },
    ringMid: { c: 40, e: 41, n: 42, w: 43, s: 44 },
  },
  right: {
    thumbEnd: { c: 45, w: 46, n: 47, e: 48, s: 49 },
    thumbMid: { c: 50, w: 51, n: 52, e: 53, s: 54 },
    thumbTip: { c: 55, w: 56, n: 57, e: 58, s: 59 },
    index: { c: 60, w: 61, n: 62, e: 63, s: 64 },
    middle: { c: 65, w: 66, n: 67, e: 68, s: 69 },
    ring: { c: 70, w: 71, n: 72, e: 73, s: 74 },
    little: { c: 75, w: 76, n: 77, e: 78, s: 79 },
    middleMid: { c: 80, w: 81, n: 82, e: 83, s: 84 },
    ringMid: { c: 85, w: 86, n: 87, e: 88, s: 89 },
  },
};
