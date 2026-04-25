import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { SerialLogItemType, SerialLogState } from '../models/serial-log.model';

const INITIAL_SERIAL_LOG_STATE: SerialLogState = { items: [] };

export const SerialLogStore = signalStore(
  { providedIn: 'root', protectedState: false },
  withDevtools('serialLog'),
  withState(INITIAL_SERIAL_LOG_STATE),
  withMethods((store) => ({
    push(type: SerialLogItemType, data: string) {
      patchState(store, (state) => ({
        items: [...state.items, { type, time: new Date(), data }],
      }));
    },
    clear() {
      patchState(store, () => ({ items: [] }));
    },
  })),
);
