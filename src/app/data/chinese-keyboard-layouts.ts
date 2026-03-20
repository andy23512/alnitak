import { KeyBoardLayout } from '../models/keyboard-layout.models';

export const CHINESE_KEYBOARD_LAYOUTS: KeyBoardLayout[] = [
  {
    id: 'cangjie',
    name: '倉頡 (Cangjie)',
    reference:
      'https://en.wikipedia.org/wiki/Cangjie_input_method#Keyboard_layout',
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
        unmodified: { type: 'text', value: '手' },
        withShift: { type: 'text', value: 'Q' },
      },
      KeyW: {
        unmodified: { type: 'text', value: '田' },
        withShift: { type: 'text', value: 'W' },
      },
      KeyE: {
        unmodified: { type: 'text', value: '水' },
        withShift: { type: 'text', value: 'E' },
      },
      KeyR: {
        unmodified: { type: 'text', value: '口' },
        withShift: { type: 'text', value: 'R' },
      },
      KeyT: {
        unmodified: { type: 'text', value: '廿' },
        withShift: { type: 'text', value: 'T' },
      },
      KeyY: {
        unmodified: { type: 'text', value: '卜' },
        withShift: { type: 'text', value: 'Y' },
      },
      KeyU: {
        unmodified: { type: 'text', value: '山' },
        withShift: { type: 'text', value: 'U' },
      },
      KeyI: {
        unmodified: { type: 'text', value: '戈' },
        withShift: { type: 'text', value: 'I' },
      },
      KeyO: {
        unmodified: { type: 'text', value: '人' },
        withShift: { type: 'text', value: 'O' },
      },
      KeyP: {
        unmodified: { type: 'text', value: '心' },
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
        unmodified: { type: 'text', value: '日' },
        withShift: { type: 'text', value: 'A' },
      },
      KeyS: {
        unmodified: { type: 'text', value: '尸' },
        withShift: { type: 'text', value: 'S' },
      },
      KeyD: {
        unmodified: { type: 'text', value: '木' },
        withShift: { type: 'text', value: 'D' },
      },
      KeyF: {
        unmodified: { type: 'text', value: '火' },
        withShift: { type: 'text', value: 'F' },
      },
      KeyG: {
        unmodified: { type: 'text', value: '土' },
        withShift: { type: 'text', value: 'G' },
      },
      KeyH: {
        unmodified: { type: 'text', value: '竹' },
        withShift: { type: 'text', value: 'H' },
      },
      KeyJ: {
        unmodified: { type: 'text', value: '十' },
        withShift: { type: 'text', value: 'J' },
      },
      KeyK: {
        unmodified: { type: 'text', value: '大' },
        withShift: { type: 'text', value: 'K' },
      },
      KeyL: {
        unmodified: { type: 'text', value: '中' },
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
        unmodified: { type: 'text', value: '重' },
        withShift: { type: 'text', value: 'Z' },
      },
      KeyX: {
        unmodified: { type: 'text', value: '難' },
        withShift: { type: 'text', value: 'X' },
      },
      KeyC: {
        unmodified: { type: 'text', value: '金' },
        withShift: { type: 'text', value: 'C' },
      },
      KeyV: {
        unmodified: { type: 'text', value: '女' },
        withShift: { type: 'text', value: 'V' },
      },
      KeyB: {
        unmodified: { type: 'text', value: '月' },
        withShift: { type: 'text', value: 'B' },
      },
      KeyN: {
        unmodified: { type: 'text', value: '弓' },
        withShift: { type: 'text', value: 'N' },
      },
      KeyM: {
        unmodified: { type: 'text', value: '一' },
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
  },
  {
    id: 'standard-bopomofo',
    name: '標準注音 (Standard Bopomofo)',
    reference: 'https://en.wikipedia.org/wiki/Bopomofo#Input_method',
    layout: {
      Backquote: {
        unmodified: { type: 'text', value: '`' },
        withShift: { type: 'text', value: '~' },
      },
      Digit1: {
        unmodified: { type: 'text', value: 'ㄅ' },
        withShift: { type: 'text', value: '!' },
      },
      Digit2: {
        unmodified: { type: 'text', value: 'ㄉ' },
        withShift: { type: 'text', value: '@' },
      },
      Digit3: {
        unmodified: { type: 'text', value: 'ˇ' },
        withShift: { type: 'text', value: '#' },
      },
      Digit4: {
        unmodified: { type: 'text', value: 'ㄓ' },
        withShift: { type: 'text', value: '$' },
      },
      Digit5: {
        unmodified: { type: 'text', value: 'ˋ' },
        withShift: { type: 'text', value: '%' },
      },
      Digit6: {
        unmodified: { type: 'text', value: 'ˊ' },
        withShift: { type: 'text', value: '^' },
      },
      Digit7: {
        unmodified: { type: 'text', value: '˙' },
        withShift: { type: 'text', value: '&' },
      },
      Digit8: {
        unmodified: { type: 'text', value: 'ㄚ' },
        withShift: { type: 'text', value: '*' },
      },
      Digit9: {
        unmodified: { type: 'text', value: 'ㄞ' },
        withShift: { type: 'text', value: '(' },
      },
      Digit0: {
        unmodified: { type: 'text', value: 'ㄢ' },
        withShift: { type: 'text', value: ')' },
      },
      Minus: {
        unmodified: { type: 'text', value: 'ㄦ' },
        withShift: { type: 'text', value: '_' },
      },
      Equal: {
        unmodified: { type: 'text', value: '=' },
        withShift: { type: 'text', value: '+' },
      },
      IntlYen: undefined,

      KeyQ: {
        unmodified: { type: 'text', value: 'ㄆ' },
        withShift: { type: 'text', value: 'Q' },
      },
      KeyW: {
        unmodified: { type: 'text', value: 'ㄊ' },
        withShift: { type: 'text', value: 'W' },
      },
      KeyE: {
        unmodified: { type: 'text', value: 'ㄍ' },
        withShift: { type: 'text', value: 'E' },
      },
      KeyR: {
        unmodified: { type: 'text', value: 'ㄐ' },
        withShift: { type: 'text', value: 'R' },
      },
      KeyT: {
        unmodified: { type: 'text', value: 'ㄔ' },
        withShift: { type: 'text', value: 'T' },
      },
      KeyY: {
        unmodified: { type: 'text', value: 'ㄗ' },
        withShift: { type: 'text', value: 'Y' },
      },
      KeyU: {
        unmodified: { type: 'text', value: 'ㄧ' },
        withShift: { type: 'text', value: 'U' },
      },
      KeyI: {
        unmodified: { type: 'text', value: 'ㄛ' },
        withShift: { type: 'text', value: 'I' },
      },
      KeyO: {
        unmodified: { type: 'text', value: 'ㄟ' },
        withShift: { type: 'text', value: 'O' },
      },
      KeyP: {
        unmodified: { type: 'text', value: 'ㄣ' },
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
        unmodified: { type: 'text', value: 'ㄇ' },
        withShift: { type: 'text', value: 'A' },
      },
      KeyS: {
        unmodified: { type: 'text', value: 'ㄋ' },
        withShift: { type: 'text', value: 'S' },
      },
      KeyD: {
        unmodified: { type: 'text', value: 'ㄎ' },
        withShift: { type: 'text', value: 'D' },
      },
      KeyF: {
        unmodified: { type: 'text', value: 'ㄑ' },
        withShift: { type: 'text', value: 'F' },
      },
      KeyG: {
        unmodified: { type: 'text', value: 'ㄕ' },
        withShift: { type: 'text', value: 'G' },
      },
      KeyH: {
        unmodified: { type: 'text', value: 'ㄘ' },
        withShift: { type: 'text', value: 'H' },
      },
      KeyJ: {
        unmodified: { type: 'text', value: 'ㄨ' },
        withShift: { type: 'text', value: 'J' },
      },
      KeyK: {
        unmodified: { type: 'text', value: 'ㄜ' },
        withShift: { type: 'text', value: 'K' },
      },
      KeyL: {
        unmodified: { type: 'text', value: 'ㄠ' },
        withShift: { type: 'text', value: 'L' },
      },
      Semicolon: {
        unmodified: { type: 'text', value: 'ㄤ' },
        withShift: { type: 'text', value: ':' },
      },
      Quote: {
        unmodified: { type: 'text', value: "'" },
        withShift: { type: 'text', value: '"' },
      },

      IntlBackslash: undefined,
      KeyZ: {
        unmodified: { type: 'text', value: 'ㄈ' },
        withShift: { type: 'text', value: 'Z' },
      },
      KeyX: {
        unmodified: { type: 'text', value: 'ㄌ' },
        withShift: { type: 'text', value: 'X' },
      },
      KeyC: {
        unmodified: { type: 'text', value: 'ㄏ' },
        withShift: { type: 'text', value: 'C' },
      },
      KeyV: {
        unmodified: { type: 'text', value: 'ㄒ' },
        withShift: { type: 'text', value: 'V' },
      },
      KeyB: {
        unmodified: { type: 'text', value: 'ㄖ' },
        withShift: { type: 'text', value: 'B' },
      },
      KeyN: {
        unmodified: { type: 'text', value: 'ㄙ' },
        withShift: { type: 'text', value: 'N' },
      },
      KeyM: {
        unmodified: { type: 'text', value: 'ㄩ' },
        withShift: { type: 'text', value: 'M' },
      },
      Comma: {
        unmodified: { type: 'text', value: 'ㄝ' },
        withShift: { type: 'text', value: '<' },
      },
      Period: {
        unmodified: { type: 'text', value: 'ㄡ' },
        withShift: { type: 'text', value: '>' },
      },
      Slash: {
        unmodified: { type: 'text', value: 'ㄥ' },
        withShift: { type: 'text', value: '?' },
      },
      IntlRo: undefined,
    },
  },
  {
    id: 'tanchord-36-v2',
    name: '天弦 36 鍵 V2 (TanChord 36 V2)',
    reference:
      'https://andy23512.github.io/blog/tangent-s-progress-for-finding-a-bopomofo-solution-on-master-forge/#V2',
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
        unmodified: { type: 'text', value: 'ㄏㄒ' },
        withShift: { type: 'text', value: '_' },
      },
      Equal: {
        unmodified: { type: 'text', value: 'ㄈ' },
        withShift: { type: 'text', value: '+' },
      },
      IntlYen: undefined,

      KeyQ: {
        unmodified: { type: 'text', value: 'ㄟ' },
        withShift: { type: 'text', value: 'Q' },
      },
      KeyW: {
        unmodified: { type: 'text', value: 'ㄅ' },
        withShift: { type: 'text', value: 'W' },
      },
      KeyE: {
        unmodified: { type: 'text', value: 'ㄎㄑ' },
        withShift: { type: 'text', value: 'E' },
      },
      KeyR: {
        unmodified: { type: 'text', value: 'ㄍㄐ' },
        withShift: { type: 'text', value: 'R' },
      },
      KeyT: {
        unmodified: { type: 'text', value: 'ㄨ' },
        withShift: { type: 'text', value: 'T' },
      },
      KeyY: {
        unmodified: { type: 'text', value: 'ㄩ' },
        withShift: { type: 'text', value: 'Y' },
      },
      KeyU: {
        unmodified: { type: 'text', value: 'ㄘ' },
        withShift: { type: 'text', value: 'U' },
      },
      KeyI: {
        unmodified: { type: 'text', value: 'ㄓ' },
        withShift: { type: 'text', value: 'I' },
      },
      KeyO: {
        unmodified: { type: 'text', value: 'ㄔ' },
        withShift: { type: 'text', value: 'O' },
      },
      KeyP: {
        unmodified: { type: 'text', value: 'ㄥㄦ' },
        withShift: { type: 'text', value: 'P' },
      },
      BracketLeft: {
        unmodified: { type: 'text', value: 'ㄖ' },
        withShift: { type: 'text', value: '{' },
      },
      BracketRight: {
        unmodified: { type: 'text', value: 'ˊ' },
        withShift: { type: 'text', value: '}' },
      },
      Backslash: {
        unmodified: { type: 'text', value: 'ㄠ' },
        withShift: { type: 'text', value: '|' },
      },

      KeyA: {
        unmodified: { type: 'text', value: 'ㄧ' },
        withShift: { type: 'text', value: 'A' },
      },
      KeyS: {
        unmodified: { type: 'text', value: 'ˇ' },
        withShift: { type: 'text', value: 'S' },
      },
      KeyD: {
        unmodified: { type: 'text', value: 'ㄣ' },
        withShift: { type: 'text', value: 'D' },
      },
      KeyF: {
        unmodified: { type: 'text', value: 'ㄢ' },
        withShift: { type: 'text', value: 'F' },
      },
      KeyG: {
        unmodified: { type: 'text', value: 'ㄇ' },
        withShift: { type: 'text', value: 'G' },
      },
      KeyH: {
        unmodified: { type: 'text', value: 'ㄤ' },
        withShift: { type: 'text', value: 'H' },
      },
      KeyJ: {
        unmodified: { type: 'text', value: 'ㄛ' },
        withShift: { type: 'text', value: 'J' },
      },
      KeyK: {
        unmodified: { type: 'text', value: 'ㄉ' },
        withShift: { type: 'text', value: 'K' },
      },
      KeyL: {
        unmodified: { type: 'text', value: 'ㄜㄝ' },
        withShift: { type: 'text', value: 'L' },
      },
      Semicolon: {
        unmodified: { type: 'text', value: 'ˋ' },
        withShift: { type: 'text', value: ':' },
      },
      Quote: {
        unmodified: { type: 'text', value: 'ㄗ' },
        withShift: { type: 'text', value: '"' },
      },

      IntlBackslash: undefined,
      KeyZ: {
        unmodified: { type: 'text', value: 'ㄆ' },
        withShift: { type: 'text', value: 'Z' },
      },
      KeyX: {
        unmodified: { type: 'text', value: 'ㄡ' },
        withShift: { type: 'text', value: 'X' },
      },
      KeyC: {
        unmodified: { type: 'text', value: 'ㄊ' },
        withShift: { type: 'text', value: 'C' },
      },
      KeyV: {
        unmodified: { type: 'text', value: 'ㄌ' },
        withShift: { type: 'text', value: 'V' },
      },
      KeyB: {
        unmodified: { type: 'text', value: 'ㄞ' },
        withShift: { type: 'text', value: 'B' },
      },
      KeyN: {
        unmodified: { type: 'text', value: 'ㄚ' },
        withShift: { type: 'text', value: 'N' },
      },
      KeyM: {
        unmodified: { type: 'text', value: 'ㄋ' },
        withShift: { type: 'text', value: 'M' },
      },
      Comma: {
        unmodified: { type: 'text', value: 'ㄙ' },
        withShift: { type: 'text', value: '<' },
      },
      Period: {
        unmodified: { type: 'text', value: 'ㄕ' },
        withShift: { type: 'text', value: '>' },
      },
      Slash: {
        unmodified: { type: 'text', value: '˙' },
        withShift: { type: 'text', value: '?' },
      },
      IntlRo: undefined,
    },
  },
];
