import {
  withDevtools,
  withStorageSync,
} from '@angular-architects/ngrx-toolkit';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { mergeDeepLeft } from 'ramda';
import { HighlightSetting } from '../models/highlight-setting.models';

const INITIAL_HIGHLIGHT_SETTING: HighlightSetting = {
  shiftLayer: {
    preferSides: 'both',
    preferShiftSide: 'left',
  },
  numShiftLayer: {
    preferSides: 'both',
    preferNumShiftSide: 'left',
  },
  shiftAndNumShiftLayer: {
    preferShiftSide: 'left',
    preferCharacterKeySide: 'right',
  },
};

export const HighlightSettingStore = signalStore(
  { providedIn: 'root' },
  withDevtools('highlightSetting'),
  withStorageSync({
    key: 'visibilitySetting',
    parse(stateString: string) {
      return mergeDeepLeft(
        INITIAL_HIGHLIGHT_SETTING,
        JSON.parse(stateString) as HighlightSetting,
      );
    },
  }),
  withState(INITIAL_HIGHLIGHT_SETTING),
  withMethods((store) => ({
    set<L extends keyof HighlightSetting, K extends keyof HighlightSetting[L]>(
      layer: L,
      key: K,
      value: HighlightSetting[L][K],
    ) {
      patchState(store, (state) => ({
        ...state,
        [layer]: {
          ...state[layer],
          [key]: value,
        },
      }));
    },
  })),
);
