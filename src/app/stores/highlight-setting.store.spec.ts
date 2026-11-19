import { TestBed } from '@angular/core/testing';
import {
  HighlightSettingStore,
  INITIAL_HIGHLIGHT_SETTING,
} from './highlight-setting.store';

describe('HighlightSettingStore', () => {
  const KEY = 'highlightSetting';

  function create() {
    TestBed.resetTestingModule();
    return TestBed.inject(HighlightSettingStore);
  }

  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('starts with the initial setting for every layer', () => {
    const store = create();
    expect(store.shiftLayer()).toEqual(INITIAL_HIGHLIGHT_SETTING.shiftLayer);
    expect(store.numShiftLayer()).toEqual(
      INITIAL_HIGHLIGHT_SETTING.numShiftLayer,
    );
    expect(store.shiftAndNumShiftLayer()).toEqual(
      INITIAL_HIGHLIGHT_SETTING.shiftAndNumShiftLayer,
    );
    expect(store.fnShiftLayer()).toEqual(
      INITIAL_HIGHLIGHT_SETTING.fnShiftLayer,
    );
    expect(store.flagShiftLayer()).toEqual(
      INITIAL_HIGHLIGHT_SETTING.flagShiftLayer,
    );
  });

  it('set changes one key of one layer and keeps the rest of that layer', () => {
    const store = create();
    store.set('shiftLayer', 'preferShiftSide', 'right');
    expect(store.shiftLayer()).toEqual({
      ...INITIAL_HIGHLIGHT_SETTING.shiftLayer,
      preferShiftSide: 'right',
    });
  });

  it('set does not touch the other layers', () => {
    const store = create();
    store.set('shiftLayer', 'preferSides', 'same');
    expect(store.numShiftLayer()).toEqual(
      INITIAL_HIGHLIGHT_SETTING.numShiftLayer,
    );
    expect(store.fnShiftLayer()).toEqual(
      INITIAL_HIGHLIGHT_SETTING.fnShiftLayer,
    );
  });

  it('saves the changed setting to local storage', () => {
    const store = create();
    store.set('fnShiftLayer', 'preferFnShiftSide', 'right');
    TestBed.tick();
    expect(JSON.parse(localStorage.getItem(KEY)!).fnShiftLayer).toEqual({
      ...INITIAL_HIGHLIGHT_SETTING.fnShiftLayer,
      preferFnShiftSide: 'right',
    });
  });

  it('fills in layers that are missing from older saved data', () => {
    localStorage.setItem(
      KEY,
      JSON.stringify({ shiftLayer: { preferSides: 'both' } }),
    );
    const store = create();
    expect(store.flagShiftLayer()).toEqual(
      INITIAL_HIGHLIGHT_SETTING.flagShiftLayer,
    );
    expect(store.shiftLayer().preferShiftSide).toBe('left');
  });

  // Current behavior, probably a bug: parse uses mergeDeepLeft(INITIAL, saved),
  // so the defaults win over saved values and a saved choice is lost on restart.
  it('does not restore a value the user saved (defaults win on load)', () => {
    const store = create();
    store.set('shiftLayer', 'preferShiftSide', 'right');
    TestBed.tick();
    expect(
      JSON.parse(localStorage.getItem(KEY)!).shiftLayer.preferShiftSide,
    ).toBe('right');
    const restored = create();
    expect(restored.shiftLayer().preferShiftSide).toBe('left');
  });
});
