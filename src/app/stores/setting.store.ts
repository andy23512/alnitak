import {
  withDevtools,
  withStorageSync,
} from '@angular-architects/ngrx-toolkit';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Setting } from '../models/setting.models';

const initialSetting: Setting = {
  hidden: {
    layout: false,
    layoutTextGuide: false,
    comboCounter: false,
    speedometer: false,
  },
};

export const SettingStore = signalStore(
  { providedIn: 'root' },
  withDevtools('setting'),
  withStorageSync('setting'),
  withState(initialSetting),
  withMethods((store) => ({
    setHidden(key: keyof Setting['hidden'], value: boolean) {
      patchState(store, (state) => ({
        hidden: { ...state.hidden, [key]: value },
      }));
    },
  })),
);
