import { TestBed } from '@angular/core/testing';
import { VisibilitySettingStore } from './visibility-setting.store';

describe('VisibilitySettingStore', () => {
  const KEY = 'visibilitySetting';
  const INITIAL = {
    layout: true,
    layoutTextGuide: true,
    layoutKeyNotationGuide: false,
    layoutThumb3Switch: true,
    comboCounter: true,
    speedometer: true,
    homePageChordingAnimation: false,
    entryErrorTooltip: true,
  };

  function create() {
    TestBed.resetTestingModule();
    return TestBed.inject(VisibilitySettingStore);
  }

  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('starts with the default setting', () => {
    const store = create();
    expect(JSON.parse(JSON.stringify({ ...INITIAL }))).toEqual(INITIAL);
    (Object.keys(INITIAL) as (keyof typeof INITIAL)[]).forEach((k) =>
      expect((store as any)[k]()).toEqual(INITIAL[k]),
    );
  });

  it('set changes only the given key', () => {
    const store = create();
    store.set('layoutKeyNotationGuide' as any, true as any);
    expect((store as any)['layoutKeyNotationGuide']()).toEqual(true);
    (Object.keys(INITIAL) as (keyof typeof INITIAL)[])
      .filter((k) => k !== 'layoutKeyNotationGuide')
      .forEach((k) => expect((store as any)[k]()).toEqual(INITIAL[k]));
  });

  it('saves changes to local storage under "visibilitySetting"', () => {
    const store = create();
    store.set('layoutKeyNotationGuide' as any, true as any);
    TestBed.tick();
    expect(JSON.parse(localStorage.getItem(KEY)!)).toEqual({
      ...INITIAL,
      layoutKeyNotationGuide: true,
    });
  });

  it('restores saved values on the next start', () => {
    localStorage.setItem(
      KEY,
      JSON.stringify({ ...INITIAL, layoutKeyNotationGuide: true }),
    );
    const store = create();
    expect((store as any)['layoutKeyNotationGuide']()).toEqual(true);
  });

  it('fills in defaults for keys missing from older saved data', () => {
    localStorage.setItem(KEY, JSON.stringify({ layoutKeyNotationGuide: true }));
    const store = create();
    expect((store as any)['layoutKeyNotationGuide']()).toEqual(true);
    (Object.keys(INITIAL) as (keyof typeof INITIAL)[])
      .filter((k) => k !== 'layoutKeyNotationGuide')
      .forEach((k) => expect((store as any)[k]()).toEqual(INITIAL[k]));
  });
});
