import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { computed } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
} from '@ngrx/signals';
import { setAllEntities, withEntities } from '@ngrx/signals/entities';
import { US_QWERTY_LAYOUT } from '../data/keyboard-layouts';
import { KeyBoardLayout } from '../models/keyboard-layout.models';
import { convertKeyboardLayoutToCharacterKeyCodeMap } from '../utils/layout.utils';
import { withSelectedEntity } from './selected-entity.feature';

export const KeyboardLayoutStore = signalStore(
  { providedIn: 'root' },
  withDevtools('keyboardLayout'),
  withEntities<KeyBoardLayout>(),
  withSelectedEntity(),
  withMethods((store) => ({
    load() {
      patchState(store, setAllEntities([US_QWERTY_LAYOUT]));
      store.setSelectedId(US_QWERTY_LAYOUT.id);
    },
  })),
  withComputed((state) => ({
    characterKeyCodeMap: computed(() => {
      const keyboardLayout = state.selectedEntity();
      return convertKeyboardLayoutToCharacterKeyCodeMap(keyboardLayout);
    }),
  })),
  withHooks({ onInit: (store) => store.load() }),
);
