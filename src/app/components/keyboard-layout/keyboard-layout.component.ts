import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { KCode, WSKCode } from 'src/app/models/key-code.models';
import {
  KeyBoardLayout,
  KeyboardLayoutKey,
} from 'src/app/models/keyboard-layout.models';
import { KeyboardLayoutStore } from 'src/app/stores/keyboard-layout.store';

function generateKeyboard(keyboardLayout: KeyBoardLayout) {
  const keySize = 10;
  const gap = 1;
  const step = keySize / 2;
  const keyboardWidth = 14 * keySize + (14 - 1) * gap + step;
  const keyboardHeight = 5 * keySize + (5 - 1) * gap;
  const keyMatrix: KCode[][] = [
    [
      'Backquote',
      'Digit1',
      'Digit2',
      'Digit3',
      'Digit4',
      'Digit5',
      'Digit6',
      'Digit7',
      'Digit8',
      'Digit9',
      'Digit0',
      'Minus',
      'Equal',
      'Backspace',
    ],
    [
      'Tab',
      'KeyQ',
      'KeyW',
      'KeyE',
      'KeyR',
      'KeyT',
      'KeyY',
      'KeyU',
      'KeyI',
      'KeyO',
      'KeyP',
      'BracketLeft',
      'BracketRight',
      'Backslash',
    ],
    [
      'CapsLock',
      'KeyA',
      'KeyS',
      'KeyD',
      'KeyF',
      'KeyG',
      'KeyH',
      'KeyJ',
      'KeyL',
      'Semicolon',
      'Quote',
      'Backslash',
      'Enter',
    ],
    [
      'ShiftLeft',
      'KeyZ',
      'KeyX',
      'KeyC',
      'KeyV',
      'KeyB',
      'KeyN',
      'KeyM',
      'Comma',
      'Period',
      'Slash',
      'ShiftRight',
    ],
    [
      'ControlLeft',
      'MetaLeft',
      'AltLeft',
      'Space',
      'AltRight',
      'MetaRight',
      'ContextMenu',
      'ControlRight',
    ],
  ];
  const backspaceAndTabWidth = keySize + step;
  const capsLockAndEnterWidth = (keyboardWidth - 11 * keySize - 12 * gap) / 2;
  const shiftWidth = (keyboardWidth - 10 * keySize - 11 * gap) / 2;
  const spaceWidth = 5 * keySize + (5 - 1) * gap;
  const rowFiveOtherKeyWidth = (keyboardWidth - spaceWidth - 7 * gap) / 7;
  const keyWidthMap: Partial<Record<KCode, number>> = {
    Backspace: backspaceAndTabWidth,
    Tab: backspaceAndTabWidth,
    CapsLock: capsLockAndEnterWidth,
    Enter: capsLockAndEnterWidth,
    ShiftLeft: shiftWidth,
    ShiftRight: shiftWidth,
    Space: spaceWidth,
    ControlLeft: rowFiveOtherKeyWidth,
    MetaLeft: rowFiveOtherKeyWidth,
    AltLeft: rowFiveOtherKeyWidth,
    AltRight: rowFiveOtherKeyWidth,
    MetaRight: rowFiveOtherKeyWidth,
    ContextMenu: rowFiveOtherKeyWidth,
    ControlRight: rowFiveOtherKeyWidth,
  };
  let y = 0;
  const keys: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
    key: Partial<KeyboardLayoutKey> | null;
  }> = [];
  keyMatrix.forEach((row) => {
    let x = 0;
    row.forEach((keyCode) => {
      const width = keyWidthMap[keyCode] ?? keySize;
      const key = keyboardLayout.layout[keyCode as any as WSKCode] ?? null;
      keys.push({ key, x, y, width, height: keySize });
      x += width + gap;
    });
    y += keySize + gap;
  });
  return {
    width: keyboardWidth,
    height: keyboardHeight,
    keys,
  };
}

@Component({
  selector: 'app-keyboard-layout',
  standalone: true,
  templateUrl: './keyboard-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KeyboardLayoutComponent {
  readonly keyboardLayout = inject(KeyboardLayoutStore).selectedEntity;
  readonly withShift = input(false);
  readonly withAltGraph = input(false);
  keyboard = computed(() => {
    const keyboardLayout = this.keyboardLayout();
    if (!keyboardLayout) {
      return null;
    }
    return generateKeyboard(keyboardLayout);
  });
}
