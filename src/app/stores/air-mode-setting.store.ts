import {
  withDevtools,
  withStorageSync,
} from '@angular-architects/ngrx-toolkit';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { AirModeSetting } from '../models/air-mode-setting.models';

const INITIAL_AIR_MODE_SETTING: AirModeSetting = {
  enabled: false,
  characterEntrySpeed: 30,
  chordSpeed: 30,
};

export const AirModeSettingStore = signalStore(
  { providedIn: 'root' },
  withDevtools('airModeSetting'),
  withStorageSync({
    key: 'airModeSetting',
    parse(stateString: string) {
      return { ...INITIAL_AIR_MODE_SETTING, ...JSON.parse(stateString) };
    },
  }),
  withState(INITIAL_AIR_MODE_SETTING),
  withMethods((store) => ({
    set<K extends keyof AirModeSetting>(key: K, value: AirModeSetting[K]) {
      patchState(store, (state) => ({
        ...state,
        [key]: value,
      }));
    },
  })),
);
