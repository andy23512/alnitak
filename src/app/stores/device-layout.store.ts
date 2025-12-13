import {
  withDevtools,
  withStorageSync,
} from '@angular-architects/ngrx-toolkit';
import { patchState, signalStore, withHooks, withMethods } from '@ngrx/signals';
import {
  addEntity,
  setAllEntities,
  updateEntity,
  withEntities,
} from '@ngrx/signals/entities';
import {
  DEFAULT_DEVICE_LAYOUT,
  M4G_DEFAULT_DEVICE_LAYOUT,
} from '../data/device-layouts';
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
      patchState(
        store,
        setAllEntities([DEFAULT_DEVICE_LAYOUT, M4G_DEFAULT_DEVICE_LAYOUT]),
      );
      store.setSelectedId(DEFAULT_DEVICE_LAYOUT.id);
    },
  })),
  withHooks({
    onInit: (store) => {
      if (store.selectedId() === null) {
        return store.load();
      }
      const entities = store.entities();
      const defaultLayout = entities.find((e) => e.id === 'default');
      if (defaultLayout && defaultLayout.name !== 'cc1-cc2-default') {
        patchState(
          store,
          updateEntity({
            id: 'default',
            changes: { name: 'cc1-cc2-default' },
          }),
        );
      }
      const m4gDefaultLayout = entities.find((e) => e.id === 'm4g-default');
      if (!m4gDefaultLayout) {
        patchState(store, addEntity(M4G_DEFAULT_DEVICE_LAYOUT));
      } else if (m4gDefaultLayout.name !== 'm4g-default') {
        patchState(
          store,
          updateEntity({
            id: 'm4g-default',
            changes: { name: 'm4g-default' },
          }),
        );
      }
    },
  }),
);
