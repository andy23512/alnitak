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
  KeyboardLayout,
  convertKeyboardLayoutToCharacterKeyCodeMap
} from 'tangent-cc-lib';
import { KEYBOARD_LAYOUTS } from '../data/keyboard-layouts';

export const LayoutViewerKeyboardLayoutStore = signalStore(
  { providedIn: 'root', protectedState: false },
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
  withComputed(() => ({
    entities: computed(() => KEYBOARD_LAYOUTS),
  })),
  withComputed((state) => ({
    selectedEntity: computed(() => {
      const selectedId = state.selectedId();
      return state
        .entities()
        .find((layout) => layout.id === selectedId) as KeyboardLayout;
    }),
  })),
  withComputed((state) => ({
    characterKeyCodeMap: computed(() => {
      const keyboardLayout = state.selectedEntity();
      return convertKeyboardLayoutToCharacterKeyCodeMap(keyboardLayout);
    }),
    hasDeadKey: computed(() => {
      const keyboardLayout = state.selectedEntity();
      return Object.values(keyboardLayout.layout).some(
        (key) =>
          key &&
          Object.values(key).some((output) => output.type === 'dead-key'),
      );
    }),
  })),
);
