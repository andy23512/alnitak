import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { patchState, signalStore, withHooks, withMethods } from '@ngrx/signals';
import { setAllEntities, withEntities } from '@ngrx/signals/entities';
import { US_QWERTY_LAYOUT } from '../data/keyboard-layouts';
import { KeyBoardLayout } from '../models/keyboard-layout.models';
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
  withHooks({ onInit: (store) => store.load() }),
);
