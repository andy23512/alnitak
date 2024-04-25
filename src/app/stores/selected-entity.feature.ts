import { computed } from '@angular/core';
import {
  patchState,
  signalStoreFeature,
  type,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { EntityId, EntityState } from '@ngrx/signals/entities';

export type SelectedEntityState = { selectedId: EntityId | null };

export function withSelectedEntity<Entity>() {
  return signalStoreFeature(
    { state: type<EntityState<Entity>>() },
    withState<SelectedEntityState>({ selectedId: null }),
    withMethods((store) => ({
      setSelectedId(selectedId: EntityId | null) {
        patchState(store, (state) => ({ ...state, selectedId }));
      },
    })),
    withComputed(({ entityMap, selectedId }) => ({
      selectedEntity: computed(() => {
        const id = selectedId();
        return id ? entityMap()[id] : null;
      }),
    })),
  );
}
