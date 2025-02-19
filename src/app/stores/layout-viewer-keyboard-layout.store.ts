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
import { KEYBOARD_LAYOUTS_FROM_KBDLAYOUT } from '../data/keyboard-layouts-from-kbdlayout';
import { KeyBoardLayout } from '../models/keyboard-layout.models';
import { convertKeyboardLayoutToCharacterKeyCodeMap } from '../utils/layout.utils';

export const LayoutViewerKeyboardLayoutStore = signalStore(
  { providedIn: 'root' },
  withDevtools('layoutViewerKeyboardLayout'),
  withStorageSync('layoutViewerKeyboardLayout'),
  withState({
    selectedId: 'us',
  }),
  withMethods((store) => ({
    setSelectedId(selectedId: string) {
      patchState(store, (state) => ({
        ...state,
        selectedId,
      }));
    },
  })),
  withComputed((state) => ({
    entities: computed(() => KEYBOARD_LAYOUTS_FROM_KBDLAYOUT),
    selectedEntity: computed(() => {
      const selectedId = state.selectedId();
      return KEYBOARD_LAYOUTS_FROM_KBDLAYOUT.find(
        (layout) => layout.id === selectedId,
      ) as KeyBoardLayout;
    }),
  })),
  withComputed((state) => ({
    characterKeyCodeMap: computed(() => {
      const keyboardLayout = state.selectedEntity();
      return convertKeyboardLayoutToCharacterKeyCodeMap(keyboardLayout);
    }),
  })),
);
