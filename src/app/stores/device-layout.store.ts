import {
  withDevtools,
  withStorageSync,
} from '@angular-architects/ngrx-toolkit';
import { patchState, signalStore, withHooks, withMethods } from '@ngrx/signals';
import { setAllEntities, withEntities } from '@ngrx/signals/entities';
import { DEFAULT_DEVICE_LAYOUT } from '../data/device-layouts';
import { DeviceLayout } from '../models/device-layout.models';
import { withSelectedEntity } from './selected-entity.feature';

export const DeviceLayoutStore = signalStore(
  { providedIn: 'root' },
  withDevtools('deviceLayout'),
  withStorageSync('deviceLayout'),
  withEntities<DeviceLayout>(),
  withSelectedEntity(),
  withMethods((store) => ({
    load() {
      patchState(store, setAllEntities([DEFAULT_DEVICE_LAYOUT]));
      store.setSelectedId(DEFAULT_DEVICE_LAYOUT.id);
    },
  })),
  withHooks({
    onInit: (store) => {
      if (store.selectedId() === null) {
        store.load();
      }
    },
  }),
);
