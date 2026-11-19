import { TestBed } from '@angular/core/testing';
import { patchState } from '@ngrx/signals';
import { LayoutSongSettingStore } from './layout-song-setting.store';

describe('LayoutSongSettingStore', () => {
  const KEY = 'layoutSongSetting';

  function create() {
    TestBed.resetTestingModule();
    return TestBed.inject(LayoutSongSettingStore);
  }

  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('starts at full volume, not muted, not looping', () => {
    const store = create();
    expect(store.volume()).toBe(1);
    expect(store.muted()).toBeFalse();
    expect(store.loop()).toBeFalse();
    expect(store.displayVolume()).toBe(1);
    expect(store.displayMuted()).toBeFalse();
  });

  describe('setVolume', () => {
    it('sets the volume and leaves the sound on', () => {
      const store = create();
      store.setVolume(0.4);
      expect(store.volume()).toBe(0.4);
      expect(store.muted()).toBeFalse();
    });

    it('mutes when the volume is set to 0', () => {
      const store = create();
      store.setVolume(0);
      expect(store.volume()).toBe(0);
      expect(store.muted()).toBeTrue();
    });

    it('unmutes when raising the volume while muted', () => {
      const store = create();
      store.setMuted(true);
      store.setVolume(0.7);
      expect(store.muted()).toBeFalse();
      expect(store.volume()).toBe(0.7);
    });
  });

  describe('setMuted', () => {
    it('mutes without changing the stored volume', () => {
      const store = create();
      store.setVolume(0.6);
      store.setMuted(true);
      expect(store.muted()).toBeTrue();
      expect(store.volume()).toBe(0.6);
    });

    it('restores the previous volume on unmute', () => {
      const store = create();
      store.setVolume(0.6);
      store.setMuted(true);
      store.setMuted(false);
      expect(store.volume()).toBe(0.6);
      expect(store.muted()).toBeFalse();
    });

    it('unmuting from volume 0 jumps back to full volume', () => {
      const store = create();
      store.setVolume(0);
      store.setMuted(false);
      expect(store.volume()).toBe(1);
      expect(store.muted()).toBeFalse();
    });

    it('muting at volume 0 keeps the volume at 0', () => {
      const store = create();
      store.setVolume(0);
      store.setMuted(true);
      expect(store.volume()).toBe(0);
    });
  });

  it('setLoop changes only the loop flag', () => {
    const store = create();
    store.setVolume(0.3);
    store.setLoop(true);
    expect(store.loop()).toBeTrue();
    expect(store.volume()).toBe(0.3);
    store.setLoop(false);
    expect(store.loop()).toBeFalse();
  });

  describe('display values', () => {
    it('show volume 0 and muted while muted', () => {
      const store = create();
      store.setVolume(0.5);
      store.setMuted(true);
      expect(store.displayVolume()).toBe(0);
      expect(store.displayMuted()).toBeTrue();
    });

    it('show muted at volume 0 even when the muted flag is off', () => {
      const store = create();
      patchState(store, { volume: 0, muted: false });
      expect(store.displayMuted()).toBeTrue();
      expect(store.displayVolume()).toBe(0);
    });

    it('show the real volume and not muted otherwise', () => {
      const store = create();
      store.setVolume(0.5);
      expect(store.displayVolume()).toBe(0.5);
      expect(store.displayMuted()).toBeFalse();
    });
  });

  it('saves and restores the setting through local storage', () => {
    const store = create();
    store.setVolume(0.25);
    store.setLoop(true);
    TestBed.tick();
    expect(JSON.parse(localStorage.getItem(KEY)!)).toEqual({
      volume: 0.25,
      muted: false,
      loop: true,
    });
    const restored = create();
    expect(restored.volume()).toBe(0.25);
    expect(restored.loop()).toBeTrue();
  });

  it('fills in defaults for keys missing from older saved data', () => {
    localStorage.setItem(KEY, JSON.stringify({ volume: 0.2 }));
    const store = create();
    expect(store.volume()).toBe(0.2);
    expect(store.muted()).toBeFalse();
    expect(store.loop()).toBeFalse();
  });
});
