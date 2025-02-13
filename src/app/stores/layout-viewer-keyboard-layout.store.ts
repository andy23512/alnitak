import {
  withDevtools,
  withStorageSync,
} from '@angular-architects/ngrx-toolkit';
import { computed } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
} from '@ngrx/signals';
import { setAllEntities, withEntities } from '@ngrx/signals/entities';
import { KEYBOARD_LAYOUTS_FROM_KBDLAYOUT } from '../data/keyboard-layouts-from-kbdlayout';
import { KeyBoardLayout } from '../models/keyboard-layout.models';
import { convertKeyboardLayoutToCharacterKeyCodeMap } from '../utils/layout.utils';
import { withSelectedEntity } from './selected-entity.feature';

export const LayoutViewerKeyboardLayoutStore = signalStore(
  { providedIn: 'root' },
  withDevtools('layoutViewerKeyboardLayout'),
  withStorageSync('layoutViewerKeyboardLayout'),
  withEntities<KeyBoardLayout>(),
  withSelectedEntity(),
  withMethods((store) => ({
    load() {
      patchState(store, setAllEntities(KEYBOARD_LAYOUTS_FROM_KBDLAYOUT));
      store.setSelectedId('us');
    },
  })),
  withComputed((state) => ({
    characterKeyCodeMap: computed(() => {
      const keyboardLayout = state.selectedEntity();
      return convertKeyboardLayoutToCharacterKeyCodeMap(keyboardLayout);
    }),
  })),
  withHooks({
    onInit: (store) => {
      if (store.selectedId() === null) {
        return store.load();
      }
    },
  }),
);
