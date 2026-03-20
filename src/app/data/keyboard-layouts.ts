import { KeyBoardLayout } from '../models/keyboard-layout.models';

export const US_QWERTY_LAYOUT: KeyBoardLayout = {
  id: 'us-qwerty',
  name: 'United States QWERTY',
  reference: 'https://en.wikipedia.org/wiki/QWERTY#United_States',
  layout: {
    Backquote: {
      unmodified: { type: 'text', value: '`' },
      withShift: { type: 'text', value: '~' },
    },
    Digit1: {
      unmodified: { type: 'text', value: '1' },
      withShift: { type: 'text', value: '!' },
    },
    Digit2: {
      unmodified: { type: 'text', value: '2' },
      withShift: { type: 'text', value: '@' },
    },
    Digit3: {
      unmodified: { type: 'text', value: '3' },
      withShift: { type: 'text', value: '#' },
    },
    Digit4: {
      unmodified: { type: 'text', value: '4' },
      withShift: { type: 'text', value: '$' },
    },
    Digit5: {
      unmodified: { type: 'text', value: '5' },
      withShift: { type: 'text', value: '%' },
    },
    Digit6: {
      unmodified: { type: 'text', value: '6' },
      withShift: { type: 'text', value: '^' },
    },
    Digit7: {
      unmodified: { type: 'text', value: '7' },
      withShift: { type: 'text', value: '&' },
    },
    Digit8: {
      unmodified: { type: 'text', value: '8' },
      withShift: { type: 'text', value: '*' },
    },
    Digit9: {
      unmodified: { type: 'text', value: '9' },
      withShift: { type: 'text', value: '(' },
    },
    Digit0: {
      unmodified: { type: 'text', value: '0' },
      withShift: { type: 'text', value: ')' },
    },
    Minus: {
      unmodified: { type: 'text', value: '-' },
      withShift: { type: 'text', value: '_' },
    },
    Equal: {
      unmodified: { type: 'text', value: '=' },
      withShift: { type: 'text', value: '+' },
    },
    IntlYen: undefined,

    KeyQ: {
      unmodified: { type: 'text', value: 'q' },
      withShift: { type: 'text', value: 'Q' },
    },
    KeyW: {
      unmodified: { type: 'text', value: 'w' },
      withShift: { type: 'text', value: 'W' },
    },
    KeyE: {
      unmodified: { type: 'text', value: 'e' },
      withShift: { type: 'text', value: 'E' },
    },
    KeyR: {
      unmodified: { type: 'text', value: 'r' },
      withShift: { type: 'text', value: 'R' },
    },
    KeyT: {
      unmodified: { type: 'text', value: 't' },
      withShift: { type: 'text', value: 'T' },
    },
    KeyY: {
      unmodified: { type: 'text', value: 'y' },
      withShift: { type: 'text', value: 'Y' },
    },
    KeyU: {
      unmodified: { type: 'text', value: 'u' },
      withShift: { type: 'text', value: 'U' },
    },
    KeyI: {
      unmodified: { type: 'text', value: 'i' },
      withShift: { type: 'text', value: 'I' },
    },
    KeyO: {
      unmodified: { type: 'text', value: 'o' },
      withShift: { type: 'text', value: 'O' },
    },
    KeyP: {
      unmodified: { type: 'text', value: 'p' },
      withShift: { type: 'text', value: 'P' },
    },
    BracketLeft: {
      unmodified: { type: 'text', value: '[' },
      withShift: { type: 'text', value: '{' },
    },
    BracketRight: {
      unmodified: { type: 'text', value: ']' },
      withShift: { type: 'text', value: '}' },
    },
    Backslash: {
      unmodified: { type: 'text', value: '\\' },
      withShift: { type: 'text', value: '|' },
    },

    KeyA: {
      unmodified: { type: 'text', value: 'a' },
      withShift: { type: 'text', value: 'A' },
    },
    KeyS: {
      unmodified: { type: 'text', value: 's' },
      withShift: { type: 'text', value: 'S' },
    },
    KeyD: {
      unmodified: { type: 'text', value: 'd' },
      withShift: { type: 'text', value: 'D' },
    },
    KeyF: {
      unmodified: { type: 'text', value: 'f' },
      withShift: { type: 'text', value: 'F' },
    },
    KeyG: {
      unmodified: { type: 'text', value: 'g' },
      withShift: { type: 'text', value: 'G' },
    },
    KeyH: {
      unmodified: { type: 'text', value: 'h' },
      withShift: { type: 'text', value: 'H' },
    },
    KeyJ: {
      unmodified: { type: 'text', value: 'j' },
      withShift: { type: 'text', value: 'J' },
    },
    KeyK: {
      unmodified: { type: 'text', value: 'k' },
      withShift: { type: 'text', value: 'K' },
    },
    KeyL: {
      unmodified: { type: 'text', value: 'l' },
      withShift: { type: 'text', value: 'L' },
    },
    Semicolon: {
      unmodified: { type: 'text', value: ';' },
      withShift: { type: 'text', value: ':' },
    },
    Quote: {
      unmodified: { type: 'text', value: "'" },
      withShift: { type: 'text', value: '"' },
    },

    IntlBackslash: undefined,
    KeyZ: {
      unmodified: { type: 'text', value: 'z' },
      withShift: { type: 'text', value: 'Z' },
    },
    KeyX: {
      unmodified: { type: 'text', value: 'x' },
      withShift: { type: 'text', value: 'X' },
    },
    KeyC: {
      unmodified: { type: 'text', value: 'c' },
      withShift: { type: 'text', value: 'C' },
    },
    KeyV: {
      unmodified: { type: 'text', value: 'v' },
      withShift: { type: 'text', value: 'V' },
    },
    KeyB: {
      unmodified: { type: 'text', value: 'b' },
      withShift: { type: 'text', value: 'B' },
    },
    KeyN: {
      unmodified: { type: 'text', value: 'n' },
      withShift: { type: 'text', value: 'N' },
    },
    KeyM: {
      unmodified: { type: 'text', value: 'm' },
      withShift: { type: 'text', value: 'M' },
    },
    Comma: {
      unmodified: { type: 'text', value: ',' },
      withShift: { type: 'text', value: '<' },
    },
    Period: {
      unmodified: { type: 'text', value: '.' },
      withShift: { type: 'text', value: '>' },
    },
    Slash: {
      unmodified: { type: 'text', value: '/' },
      withShift: { type: 'text', value: '?' },
    },
    IntlRo: undefined,
  },
};
