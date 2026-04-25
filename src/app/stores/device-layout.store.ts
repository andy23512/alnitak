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
import {
  addEntity,
  setAllEntities,
  updateEntity,
  withEntities,
} from '@ngrx/signals/entities';
import {
  CC1_CC2_LEFT_HAND_ONLY_DEVICE_LAYOUT,
  CC1_CC2_RIGHT_HAND_ONLY_DEVICE_LAYOUT,
  DEFAULT_DEVICE_LAYOUT,
  DeviceLayout,
  M4G_DEFAULT_DEVICE_LAYOUT,
} from 'tangent-cc-lib';
import { withSelectedEntity } from './selected-entity.feature';

export const DeviceLayoutStore = signalStore(
  { providedIn: 'root', protectedState: false },
  withDevtools('deviceLayout'),
  withStorageSync('deviceLayout'),
  withEntities<DeviceLayout>(),
  withSelectedEntity(),
  withComputed((state) => ({
    selectedEntityLayerNumber: computed((): number | null => {
      const selectedEntity = state.selectedEntity();
      if (!selectedEntity) {
        return null;
      }
      return selectedEntity.layout.length;
    }),
  })),
  withMethods((store) => ({
    load() {
      patchState(
        store,
        setAllEntities([
          DEFAULT_DEVICE_LAYOUT,
          M4G_DEFAULT_DEVICE_LAYOUT,
          CC1_CC2_RIGHT_HAND_ONLY_DEVICE_LAYOUT,
          CC1_CC2_LEFT_HAND_ONLY_DEVICE_LAYOUT,
        ]),
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
      const cc1CC2RightHandOnlyLayout = entities.find(
        (e) => e.id === 'cc1-cc2-right-hand-only',
      );
      if (!cc1CC2RightHandOnlyLayout) {
        patchState(store, addEntity(CC1_CC2_RIGHT_HAND_ONLY_DEVICE_LAYOUT));
      } else {
        patchState(
          store,
          updateEntity({
            id: 'cc1-cc2-right-hand-only',
            changes: CC1_CC2_RIGHT_HAND_ONLY_DEVICE_LAYOUT,
          }),
        );
      }
      const cc1CC2LeftHandOnlyLayout = entities.find(
        (e) => e.id === 'cc1-cc2-left-hand-only',
      );
      if (!cc1CC2LeftHandOnlyLayout) {
        patchState(store, addEntity(CC1_CC2_LEFT_HAND_ONLY_DEVICE_LAYOUT));
      } else {
        patchState(
          store,
          updateEntity({
            id: 'cc1-cc2-left-hand-only',
            changes: CC1_CC2_LEFT_HAND_ONLY_DEVICE_LAYOUT,
          }),
        );
      }
    },
  }),
);
