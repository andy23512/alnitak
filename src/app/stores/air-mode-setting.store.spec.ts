import { TestBed } from '@angular/core/testing';
import { AirModeSettingStore } from './air-mode-setting.store';

describe('AirModeSettingStore', () => {
  const KEY = 'airModeSetting';
  const INITIAL = { enabled: false, characterEntrySpeed: 30, chordSpeed: 30 };

  function create() {
    TestBed.resetTestingModule();
    return TestBed.inject(AirModeSettingStore);
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
    store.set('characterEntrySpeed' as any, 55 as any);
    expect((store as any)['characterEntrySpeed']()).toEqual(55);
    (Object.keys(INITIAL) as (keyof typeof INITIAL)[])
      .filter((k) => k !== 'characterEntrySpeed')
      .forEach((k) => expect((store as any)[k]()).toEqual(INITIAL[k]));
  });

  it('saves changes to local storage under "airModeSetting"', () => {
    const store = create();
    store.set('characterEntrySpeed' as any, 55 as any);
    TestBed.tick();
    expect(JSON.parse(localStorage.getItem(KEY)!)).toEqual({
      ...INITIAL,
      characterEntrySpeed: 55,
    });
  });

  it('restores saved values on the next start', () => {
    localStorage.setItem(
      KEY,
      JSON.stringify({ ...INITIAL, characterEntrySpeed: 55 }),
    );
    const store = create();
    expect((store as any)['characterEntrySpeed']()).toEqual(55);
  });

  it('fills in defaults for keys missing from older saved data', () => {
    localStorage.setItem(KEY, JSON.stringify({ characterEntrySpeed: 55 }));
    const store = create();
    expect((store as any)['characterEntrySpeed']()).toEqual(55);
    (Object.keys(INITIAL) as (keyof typeof INITIAL)[])
      .filter((k) => k !== 'characterEntrySpeed')
      .forEach((k) => expect((store as any)[k]()).toEqual(INITIAL[k]));
  });
});
