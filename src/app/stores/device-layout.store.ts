import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { patchState, signalStore, withHooks, withMethods } from '@ngrx/signals';
import { setAllEntities, withEntities } from '@ngrx/signals/entities';
import { CHARA_CHORDER_ONE_DEFAULT_LAYOUT } from '../data/device-layouts';
import { DeviceLayout } from '../models/device-layout.models';
import { withSelectedEntity } from './selected-entity.feature';

export const DeviceLayoutStore = signalStore(
  { providedIn: 'root' },
  withDevtools('deviceLayout'),
  withEntities<DeviceLayout>(),
  withSelectedEntity(),
  withMethods((store) => ({
    load() {
      patchState(store, setAllEntities([CHARA_CHORDER_ONE_DEFAULT_LAYOUT]));
      store.setSelectedId(CHARA_CHORDER_ONE_DEFAULT_LAYOUT.id);
    },
  })),
  withHooks({ onInit: (store) => store.load() }),
);
