import {
  withDevtools,
  withStorageSync,
} from '@angular-architects/ngrx-toolkit';
import { computed } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import {
  convertKeyboardLayoutToCharacterKeyCodeMap,
  KeyboardLayout,
} from 'tangent-cc-lib';
import { KEYBOARD_LAYOUTS } from '../data/keyboard-layouts';
import { findKeyboardLayoutsByLanguageCode } from '../utils/language-tree.utils';

export const LessonSettingStore = signalStore(
  { providedIn: 'root', protectedState: false },
  withDevtools('lessonSetting'),
  withStorageSync('lessonSetting'),
  withState({
    languageCode: 'en',
    keyboardLayoutId: 'us',
  }),
  withMethods((store) => ({
    setKeyboardLayoutId(keyboardLayoutId: string) {
      patchState(store, (state) => ({
        ...state,
        keyboardLayoutId,
      }));
    },
  })),
  withComputed((state) => ({
    keyboardLayoutOptions: computed(() => {
      return findKeyboardLayoutsByLanguageCode(state.languageCode());
    }),
    keyboardLayout: computed(() => {
      const keyboardLayoutId = state.keyboardLayoutId();
      return KEYBOARD_LAYOUTS.find(
        (layout) => layout.id === keyboardLayoutId,
      ) as KeyboardLayout;
    }),
  })),
  withComputed((state) => ({
    characterKeyCodeMap: computed(() =>
      convertKeyboardLayoutToCharacterKeyCodeMap(state.keyboardLayout()),
    ),
  })),
);
