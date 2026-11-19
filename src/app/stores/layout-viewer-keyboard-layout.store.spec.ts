import { TestBed } from '@angular/core/testing';
import { KEYBOARD_LAYOUTS } from '../data/keyboard-layouts';
import { LayoutViewerKeyboardLayoutStore } from './layout-viewer-keyboard-layout.store';

describe('LayoutViewerKeyboardLayoutStore', () => {
  const KEY = 'layoutViewerKeyboardLayout';
  const hasDeadKey = (layout: (typeof KEYBOARD_LAYOUTS)[number]) =>
    Object.values(layout.layout).some(
      (key) =>
        key && Object.values(key).some((output) => output.type === 'dead-key'),
    );

  function create() {
    TestBed.resetTestingModule();
    return TestBed.inject(LayoutViewerKeyboardLayoutStore);
  }

  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('starts with the US layout selected', () => {
    const store = create();
    expect(store.selectedId()).toBe('us');
    expect(store.selectedEntity().id).toBe('us');
  });

  it('offers every known keyboard layout', () => {
    expect(create().entities()).toBe(KEYBOARD_LAYOUTS);
  });

  it('setSelectedId changes the selected layout', () => {
    const store = create();
    const other = KEYBOARD_LAYOUTS.find((l) => l.id !== 'us')!;
    store.setSelectedId(other.id);
    expect(store.selectedId()).toBe(other.id);
    expect(store.selectedEntity()).toBe(other);
  });

  it('builds the character key code map of the selected layout', () => {
    const store = create();
    const map = store.characterKeyCodeMap();
    expect(map instanceof Map).toBeTrue();
    expect(map.get('a')?.length).toBeGreaterThan(0);
  });

  it('updates the character key code map when the layout changes', () => {
    const store = create();
    const before = store.characterKeyCodeMap();
    store.setSelectedId(KEYBOARD_LAYOUTS.find((l) => l.id !== 'us')!.id);
    expect(store.characterKeyCodeMap()).not.toBe(before);
  });

  it('reports no dead key for the US layout', () => {
    expect(create().hasDeadKey()).toBeFalse();
  });

  it('reports a dead key for a layout that has one', () => {
    const store = create();
    const withDeadKey = KEYBOARD_LAYOUTS.find(hasDeadKey);
    expect(withDeadKey).toBeDefined();
    store.setSelectedId(withDeadKey!.id);
    expect(store.hasDeadKey()).toBeTrue();
  });

  it('reports no dead key for a layout that has none (other than US)', () => {
    const store = create();
    const without = KEYBOARD_LAYOUTS.find(
      (l) => l.id !== 'us' && !hasDeadKey(l),
    );
    expect(without).toBeDefined();
    store.setSelectedId(without!.id);
    expect(store.hasDeadKey()).toBeFalse();
  });

  it('throws when the saved layout id no longer exists (current behavior)', () => {
    const store = create();
    store.setSelectedId('no-such-layout');
    expect(store.selectedEntity()).toBeUndefined();
    expect(() => store.hasDeadKey()).toThrow();
  });

  it('saves the selection under "layoutViewerKeyboardLayout" and restores it', () => {
    const store = create();
    const other = KEYBOARD_LAYOUTS.find((l) => l.id !== 'us')!;
    store.setSelectedId(other.id);
    TestBed.tick();
    expect(JSON.parse(localStorage.getItem(KEY)!)).toEqual({
      selectedId: other.id,
    });
    expect(create().selectedId()).toBe(other.id);
  });
});
