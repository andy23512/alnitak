import { TestBed } from '@angular/core/testing';
import { MiscSettingStore } from './misc-setting.store';

describe('MiscSettingStore', () => {
  const KEY = 'miscSetting';
  const INITIAL = {
    thumbRotationAngle: 10,
    nonThumbRotationAngle: 0,
    homePageSpaceHintSeen: false,
  };

  function create() {
    TestBed.resetTestingModule();
    return TestBed.inject(MiscSettingStore);
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
    store.set('thumbRotationAngle' as any, 25 as any);
    expect((store as any)['thumbRotationAngle']()).toEqual(25);
    (Object.keys(INITIAL) as (keyof typeof INITIAL)[])
      .filter((k) => k !== 'thumbRotationAngle')
      .forEach((k) => expect((store as any)[k]()).toEqual(INITIAL[k]));
  });

  it('saves changes to local storage under "miscSetting"', () => {
    const store = create();
    store.set('thumbRotationAngle' as any, 25 as any);
    TestBed.tick();
    expect(JSON.parse(localStorage.getItem(KEY)!)).toEqual({
      ...INITIAL,
      thumbRotationAngle: 25,
    });
  });

  it('restores saved values on the next start', () => {
    localStorage.setItem(
      KEY,
      JSON.stringify({ ...INITIAL, thumbRotationAngle: 25 }),
    );
    const store = create();
    expect((store as any)['thumbRotationAngle']()).toEqual(25);
  });

  it('fills in defaults for keys missing from older saved data', () => {
    localStorage.setItem(KEY, JSON.stringify({ thumbRotationAngle: 25 }));
    const store = create();
    expect((store as any)['thumbRotationAngle']()).toEqual(25);
    (Object.keys(INITIAL) as (keyof typeof INITIAL)[])
      .filter((k) => k !== 'thumbRotationAngle')
      .forEach((k) => expect((store as any)[k]()).toEqual(INITIAL[k]));
  });
});
