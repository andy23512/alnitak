import {
  withDevtools,
  withStorageSync,
} from '@angular-architects/ngrx-toolkit';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { VisibilitySetting } from '../models/visibility-setting.models';

const INITIAL_VISIBILITY_SETTING: VisibilitySetting = {
  layout: true,
  layoutTextGuide: true,
  layoutKeyNotationGuide: false,
  layoutThumb3Switch: true,
  comboCounter: true,
  speedometer: true,
};

export const VisibilitySettingStore = signalStore(
  { providedIn: 'root' },
  withDevtools('visibilitySetting'),
  withStorageSync({
    key: 'visibilitySetting',
    parse(stateString: string) {
      return { ...INITIAL_VISIBILITY_SETTING, ...JSON.parse(stateString) };
    },
  }),
  withState(INITIAL_VISIBILITY_SETTING),
  withMethods((store) => ({
    set(key: keyof VisibilitySetting, value: boolean) {
      patchState(store, (state) => ({
        ...state,
        [key]: value,
      }));
    },
  })),
);
