import {
  withDevtools,
  withStorageSync,
} from '@angular-architects/ngrx-toolkit';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { VisibilitySetting } from '../models/visibility-setting.models';

const initialVisibilitySetting: VisibilitySetting = {
  layout: true,
  layoutTextGuide: true,
  comboCounter: true,
  speedometer: true,
};

export const VisibilitySettingStore = signalStore(
  { providedIn: 'root' },
  withDevtools('visibilitySetting'),
  withStorageSync({
    key: 'visibilitySetting',
    parse(stateString: string) {
      return { ...initialVisibilitySetting, ...JSON.parse(stateString) };
    },
  }),
  withState(initialVisibilitySetting),
  withMethods((store) => ({
    set(key: keyof VisibilitySetting, value: boolean) {
      patchState(store, (state) => ({
        ...state,
        [key]: value,
      }));
    },
  })),
);
