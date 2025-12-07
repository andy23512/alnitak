import {
  withDevtools,
  withStorageSync,
} from '@angular-architects/ngrx-toolkit';
import { computed } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { LayoutSongSetting } from '../models/layout-song-setting.models';

const INITIAL_LAYOUT_SONG_SETTING: LayoutSongSetting = {
  volume: 1,
  muted: false,
};

export const LayoutSongSettingStore = signalStore(
  { providedIn: 'root' },
  withDevtools('layoutSongSetting'),
  withStorageSync({
    key: 'layoutSongSetting',
    parse(stateString: string) {
      return { ...INITIAL_LAYOUT_SONG_SETTING, ...JSON.parse(stateString) };
    },
  }),
  withState(INITIAL_LAYOUT_SONG_SETTING),
  withComputed((state) => ({
    displayMuted: computed(() => {
      const volume = state.volume();
      const muted = state.muted();
      return muted || volume === 0;
    }),
    displayVolume: computed(() => {
      const volume = state.volume();
      const muted = state.muted();
      return muted ? 0 : volume;
    }),
  })),
  withMethods((store) => ({
    setVolume(volume: number) {
      patchState(store, (state) => ({
        muted: volume === 0,
        volume,
      }));
    },
    setMuted(muted: boolean) {
      patchState(store, (state) => ({
        muted,
        volume: !muted && state.volume === 0 ? 1 : state.volume,
      }));
    },
  })),
);
