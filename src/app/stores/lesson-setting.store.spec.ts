import { TestBed } from '@angular/core/testing';
import { patchState } from '@ngrx/signals';
import { KEYBOARD_LAYOUTS } from '../data/keyboard-layouts';
import { findKeyboardLayoutsByLanguageCode } from '../utils/language-tree.utils';
import { LessonSettingStore } from './lesson-setting.store';

describe('LessonSettingStore', () => {
  const KEY = 'lessonSetting';

  function create() {
    TestBed.resetTestingModule();
    return TestBed.inject(LessonSettingStore);
  }

  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('starts with English and the US layout', () => {
    const store = create();
    expect(store.languageCode()).toBe('en');
    expect(store.keyboardLayoutId()).toBe('us');
    expect(store.keyboardLayout().id).toBe('us');
  });

  it('offers the layouts of the selected language, including US for English', () => {
    const store = create();
    expect(store.keyboardLayoutOptions()).toEqual(
      findKeyboardLayoutsByLanguageCode('en'),
    );
    expect(store.keyboardLayoutOptions().map((l) => l.id)).toContain('us');
  });

  it('changes the options when the language changes', () => {
    const store = create();
    const other = KEYBOARD_LAYOUTS.find((l) => l.id !== 'us')!;
    patchState(store, { languageCode: 'zz-unknown' });
    expect(store.keyboardLayoutOptions()).toEqual([]);
    expect(other).toBeDefined();
  });

  it('setKeyboardLayoutId selects the layout and leaves the language alone', () => {
    const store = create();
    const other = KEYBOARD_LAYOUTS.find((l) => l.id !== 'us')!;
    store.setKeyboardLayoutId(other.id);
    expect(store.keyboardLayoutId()).toBe(other.id);
    expect(store.keyboardLayout()).toBe(other);
    expect(store.languageCode()).toBe('en');
  });

  it('builds the character key code map from the selected layout', () => {
    const store = create();
    const before = store.characterKeyCodeMap();
    expect(before.get('a')?.length).toBeGreaterThan(0);
    store.setKeyboardLayoutId(KEYBOARD_LAYOUTS.find((l) => l.id !== 'us')!.id);
    expect(store.characterKeyCodeMap()).not.toBe(before);
  });

  it('gives an empty key code map for a layout id that no longer exists', () => {
    const store = create();
    store.setKeyboardLayoutId('no-such-layout');
    expect(store.keyboardLayout()).toBeUndefined();
    expect(store.characterKeyCodeMap().size).toBe(0);
  });

  it('saves under "lessonSetting" and restores on the next start', () => {
    const store = create();
    const other = KEYBOARD_LAYOUTS.find((l) => l.id !== 'us')!;
    store.setKeyboardLayoutId(other.id);
    TestBed.tick();
    expect(JSON.parse(localStorage.getItem(KEY)!)).toEqual({
      languageCode: 'en',
      keyboardLayoutId: other.id,
    });
    expect(create().keyboardLayoutId()).toBe(other.id);
  });
});
