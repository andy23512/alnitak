import {
  withDevtools,
  withStorageSync,
} from '@angular-architects/ngrx-toolkit';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { MiscSetting } from '../models/misc-setting.models';

const INITIAL_MISC_SETTING: MiscSetting = {
  thumbRotationAngle: 10,
  nonThumbRotationAngle: 0,
};

export const MiscSettingStore = signalStore(
  { providedIn: 'root' },
  withDevtools('miscSetting'),
  withStorageSync({
    key: 'miscSetting',
    parse(stateString: string) {
      return { ...INITIAL_MISC_SETTING, ...JSON.parse(stateString) };
    },
  }),
  withState(INITIAL_MISC_SETTING),
  withMethods((store) => ({
    set<K extends keyof MiscSetting>(key: K, value: MiscSetting[K]) {
      patchState(store, (state) => ({
        ...state,
        [key]: value,
      }));
    },
  })),
);
