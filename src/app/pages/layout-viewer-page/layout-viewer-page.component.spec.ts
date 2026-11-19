import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HotkeysService } from '@ngneat/hotkeys';
import { provideTranslateService } from '@ngx-translate/core';
import { patchState } from '@ngrx/signals';
import { setAllEntities } from '@ngrx/signals/entities';
import { By } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { LayoutComponent } from 'src/app/components/layout/layout.component';
import { VisibilitySettingStore } from 'src/app/stores/visibility-setting.store';
import { KEYBOARD_LAYOUTS } from 'src/app/data/keyboard-layouts';
import { OperatingSystemService } from 'src/app/services/operating-system.service';
import { DeviceLayoutStore } from 'src/app/stores/device-layout.store';
import { LayoutViewerKeyboardLayoutStore } from 'src/app/stores/layout-viewer-keyboard-layout.store';
import {
  ACTIONS,
  ActionType,
  CHARACTER_NAME_MAP,
  Profile,
  CC1_CC2_LEFT_HAND_ONLY_DEVICE_LAYOUT,
  CC1_CC2_RIGHT_HAND_ONLY_DEVICE_LAYOUT,
  DEFAULT_DEVICE_LAYOUT,
  DeviceLayout,
  getLayerShiftPositionCodeMap,
  getModifierKeyPositionCodeMap,
  KeyLabel,
  KeyLabelType,
  Layer,
  M4G_DEFAULT_DEVICE_LAYOUT,
  NON_KEY_ACTION_NAME_2_KEY_NAMES_MAP,
  NON_KEY_ACTION_NAME_2_RAW_KEY_LABEL_MAP,
  NonKeyActionName,
  OS_2_META_KEY_LABEL_MAP,
  WINDOWS_ALT_CODE_ACTIONS,
} from 'tangent-cc-lib';
import { LayoutViewerPageComponent } from './layout-viewer-page.component';

const wsk = (keyCode: string, withShift: boolean) =>
  ACTIONS.find(
    (a) =>
      a.type === ActionType.WSK &&
      a.keyCode === keyCode &&
      !!a.withShift === withShift,
  )!;
const A = wsk('KeyA', false).codeId;
const SHIFT_A = wsk('KeyA', true).codeId;
const B = wsk('KeyB', false).codeId;
const NO_ACTION = 0;
const UNKNOWN_CODE = 5000; // >= 32 and not an action

describe('LayoutViewerPageComponent', () => {
  let fixture: ComponentFixture<LayoutViewerPageComponent>;
  let component: LayoutViewerPageComponent;
  let deviceStore: InstanceType<typeof DeviceLayoutStore>;
  let keyboardStore: InstanceType<typeof LayoutViewerKeyboardLayoutStore>;

  /** a 3 (or 4) layer layout where every position is "no action" except the given ones: [layer][position] */
  function custom(
    cells: Record<string, number>,
    layers = 3,
    extra: Partial<DeviceLayout> = {},
  ): DeviceLayout {
    const layout = Array.from({ length: layers }, () =>
      Array(90).fill(NO_ACTION),
    );
    for (const [key, code] of Object.entries(cells)) {
      const [layer, position] = key.split(':').map(Number);
      layout[layer][position] = code;
    }
    return {
      id: 'custom',
      name: 'Custom',
      layout,
      ...extra,
    } as unknown as DeviceLayout;
  }
  function use(layout: DeviceLayout) {
    patchState(deviceStore, setAllEntities([layout]));
    deviceStore.setSelectedId(layout.id);
  }
  const labels = (position: number) => component.keyLabelMap()![position];

  beforeEach(() => {
    TestBed.resetTestingModule();
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideTranslateService(),
        {
          provide: HotkeysService,
          useValue: {
            addShortcut: () => new Subject(),
            removeShortcuts: () => undefined,
          },
        },
      ],
    });
    deviceStore = TestBed.inject(DeviceLayoutStore);
    keyboardStore = TestBed.inject(LayoutViewerKeyboardLayoutStore);
    fixture = TestBed.createComponent(LayoutViewerPageComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => localStorage.clear());

  describe('start', () => {
    it('shows the default device layout and the US keyboard layout on the first layer', () => {
      expect(component.deviceLayout()!.id).toBe('default');
      expect(component.keyboardLayout().id).toBe('us');
      expect(component.currentLayer()).toBe(Layer.Primary);
      expect(component.shiftKey()).toBeFalse();
      expect(component.altGraphKey()).toBeFalse();
      expect(component.modifiersState()).toEqual([]);
      expect(component.searchMenuIsOpen()).toBeFalse();
      expect(component.selectedPositions()).toEqual([]);
    });

    it('is a full height column', () => {
      fixture.detectChanges();
      expect(fixture.nativeElement.classList).toContain('h-full');
      expect(fixture.nativeElement.classList).toContain('flex-col');
    });
  });

  describe('layers', () => {
    it('offers as many layers as the device layout has', () => {
      expect(component.layers().map((l) => l.value)).toEqual([
        Layer.Primary,
        Layer.Secondary,
        Layer.Tertiary,
      ]);
      use(custom({}, 4));
      expect(component.layers().map((l) => l.value)).toEqual([
        Layer.Primary,
        Layer.Secondary,
        Layer.Tertiary,
        Layer.Quaternary,
      ]);
    });

    it('gives each layer its tooltip key and Alt hotkey', () => {
      use(custom({}, 4));
      expect(component.layers().map((l) => [l.tooltip, l.hotkey])).toEqual([
        ['layout-viewer-page.layer.1', 'alt.1'],
        ['layout-viewer-page.layer.2', 'alt.2'],
        ['layout-viewer-page.layer.3', 'alt.3'],
        ['layout-viewer-page.layer.4', 'alt.4'],
      ]);
    });

    it('offers none when the selected device layout does not exist', () => {
      deviceStore.setSelectedId('missing');
      expect(component.layers()).toEqual([]);
      expect(component.keyLabelMap()).toBeNull();
      expect(component.keyListForSearch()).toBeNull();
    });
  });

  describe('device layout names', () => {
    it('translates the names of the built-in layouts and keeps the others', () => {
      patchState(
        deviceStore,
        setAllEntities([
          DEFAULT_DEVICE_LAYOUT,
          M4G_DEFAULT_DEVICE_LAYOUT,
          { ...CC1_CC2_RIGHT_HAND_ONLY_DEVICE_LAYOUT },
          { ...CC1_CC2_LEFT_HAND_ONLY_DEVICE_LAYOUT },
          custom({}),
        ]),
      );
      expect(component.translatedDeviceLayouts().map((l) => l.name)).toEqual([
        'device-layout.cc1-cc2-default',
        'device-layout.m4g-default',
        'device-layout.cc1-cc2-right-hand-only',
        'device-layout.cc1-cc2-left-hand-only',
        'Custom',
      ]);
    });

    it('keeps everything else of a layout when translating its name', () => {
      const [first] = component.translatedDeviceLayouts();
      expect(first.layout).toBe(component.deviceLayouts()[0].layout);
      expect(first.id).toBe('default');
    });

    it('shows the translated name of the selected built-in layout', () => {
      expect(component.deviceLayoutDisplayName()).toBe(
        'device-layout.cc1-cc2-default',
      );
      deviceStore.setSelectedId('m4g-default');
      expect(component.deviceLayoutDisplayName()).toBe(
        'device-layout.m4g-default',
      );
      patchState(
        deviceStore,
        setAllEntities([
          DEFAULT_DEVICE_LAYOUT,
          M4G_DEFAULT_DEVICE_LAYOUT,
          CC1_CC2_LEFT_HAND_ONLY_DEVICE_LAYOUT,
          { ...DEFAULT_DEVICE_LAYOUT, id: 'cc1-cc2-right-hand-only' },
        ]),
      );
      deviceStore.setSelectedId('cc1-cc2-right-hand-only');
      expect(component.deviceLayoutDisplayName()).toBe(
        'device-layout.cc1-cc2-right-hand-only',
      );
    });

    it('shows the own name of other layouts, and nothing without a layout', () => {
      use(custom({}));
      expect(component.deviceLayoutDisplayName()).toBe('Custom');
      deviceStore.setSelectedId('missing');
      expect(component.deviceLayoutDisplayName()).toBe('');
    });

    it('records that the left-hand-only layout shows its stored name, not a translation, as the print title', () => {
      patchState(
        deviceStore,
        setAllEntities([CC1_CC2_LEFT_HAND_ONLY_DEVICE_LAYOUT]),
      );
      deviceStore.setSelectedId(CC1_CC2_LEFT_HAND_ONLY_DEVICE_LAYOUT.id);
      expect(component.deviceLayoutDisplayName()).toBe(
        CC1_CC2_LEFT_HAND_ONLY_DEVICE_LAYOUT.name,
      );
    });
  });

  describe('keyboard layout search', () => {
    it('lists every layout without a query', () => {
      expect(component.filteredKeyboardLayouts().length).toBe(
        KEYBOARD_LAYOUTS.length,
      );
    });

    it('keeps the layouts whose name contains the query, ignoring case', () => {
      const wanted = KEYBOARD_LAYOUTS[1].name;
      component.keyboardLayoutSearchQuery.set(wanted.toUpperCase());
      const names = component.filteredKeyboardLayouts().map((k) => k.name);
      expect(names.length).toBeGreaterThan(0);
      expect(names.length).toBeLessThan(KEYBOARD_LAYOUTS.length);
      expect(
        names.every((n) => n.toLowerCase().includes(wanted.toLowerCase())),
      ).toBeTrue();
    });

    it('is empty when nothing matches', () => {
      component.keyboardLayoutSearchQuery.set('zzzzzzzz-no-such-layout');
      expect(component.filteredKeyboardLayouts()).toEqual([]);
    });
  });

  describe('key labels', () => {
    it('is a map of all 90 positions', () => {
      expect(Object.keys(component.keyLabelMap()!).length).toBe(90);
    });

    it('labels a plain character with the unmodified and the shifted character of the keyboard layout', () => {
      use(custom({ '0:1': A }));
      const base = {
        type: KeyLabelType.String as const,
        title: 'general.character-tooltip',
        layer: Layer.Primary,
        altGraphKey: false,
        isDeadKey: false,
      };
      expect(labels(1)).toEqual([
        { ...base, c: 'a', shiftKey: false },
        { ...base, c: 'A', shiftKey: true },
      ]);
    });

    it('labels positions without an action with nothing', () => {
      use(custom({ '0:1': A }));
      expect(labels(2)).toEqual([]);
    });

    it('labels the third and fourth layers with their own layer', () => {
      use(custom({ '2:1': A, '3:1': B }, 4));
      expect(labels(1).map((l) => [l.layer, l.c, l.shiftKey])).toEqual([
        [Layer.Tertiary, 'a', false],
        [Layer.Tertiary, 'A', true],
        [Layer.Quaternary, 'b', false],
        [Layer.Quaternary, 'B', true],
      ]);
    });

    it('labels the last position too', () => {
      use(custom({ '0:89': A }));
      expect(labels(89).length).toBe(2);
    });

    it('labels each layer of the same position with its own layer', () => {
      use(custom({ '0:1': A, '1:1': B }));
      expect(labels(1).map((l) => [l.layer, l.c, l.shiftKey])).toEqual([
        [Layer.Primary, 'a', false],
        [Layer.Primary, 'A', true],
        [Layer.Secondary, 'b', false],
        [Layer.Secondary, 'B', true],
      ]);
    });

    it('labels shift actions with the shifted character, for both shift states', () => {
      use(custom({ '0:1': SHIFT_A }));
      expect(labels(1).map((l) => [l.c, l.shiftKey, l.altGraphKey])).toEqual([
        ['A', false, false],
        ['A', true, false],
      ]);
    });

    it('labels unknown action codes with the code', () => {
      use(custom({ '0:1': UNKNOWN_CODE }));
      expect(labels(1)).toEqual([
        {
          type: KeyLabelType.ActionCode,
          c: UNKNOWN_CODE,
          title: 'general.action-code-tooltip',
          layer: Layer.Primary,
          shiftKey: false,
          altGraphKey: false,
        },
      ]);
    });

    it('labels Windows Alt codes and marks them', () => {
      const action = WINDOWS_ALT_CODE_ACTIONS[0];
      use(custom({ '0:1': action.codeId }));
      expect(labels(1)).toEqual([
        {
          type: KeyLabelType.String,
          c: action.character!,
          title: 'general.windows-alt-code-tooltip',
          layer: Layer.Primary,
          shiftKey: false,
          altGraphKey: false,
          isWindowsAltCode: true,
        },
      ]);
    });

    it('labels keys that are not characters with the label of the library', () => {
      const action = ACTIONS.find(
        (a) =>
          a.type === ActionType.NonKey &&
          !!a.actionName &&
          a.actionName in NON_KEY_ACTION_NAME_2_RAW_KEY_LABEL_MAP,
      ) as { codeId: number; actionName: NonKeyActionName };
      use(custom({ '0:1': action.codeId }));
      expect(labels(1)).toEqual([
        {
          ...NON_KEY_ACTION_NAME_2_RAW_KEY_LABEL_MAP[action.actionName],
          layer: Layer.Primary,
          shiftKey: false,
          altGraphKey: false,
        },
      ]);
    });

    it('labels the Meta key by the operating system', () => {
      const [os, map] = Object.entries(OS_2_META_KEY_LABEL_MAP)[0];
      const keyCode = Object.keys(map)[0];
      const action = ACTIONS.find(
        (a) => a.type === ActionType.NonWSK && a.keyCode === keyCode,
      )!;
      use(custom({ '0:1': action.codeId }));
      spyOn(TestBed.inject(OperatingSystemService), 'getOS').and.returnValue(
        undefined,
      );
      const without = JSON.stringify(labels(1));
      // a fresh component, so that the key labels are computed again
      fixture = TestBed.createComponent(LayoutViewerPageComponent);
      component = fixture.componentInstance;
      (
        TestBed.inject(OperatingSystemService).getOS as jasmine.Spy
      ).and.returnValue(os);
      const withOs = labels(1);
      expect(withOs.length).toBe(1);
      expect(withOs[0].c as unknown).toBe(
        (map as Record<string, { c: unknown }>)[keyCode].c,
      );
      expect(JSON.stringify(withOs)).not.toBe(without);
    });

    describe('with a keyboard layout that has AltGr and dead keys', () => {
      // the first layout and key with a dead key on the plain level / an AltGr character
      const find = (
        pick: (k: Record<string, { type: string } | undefined>) => boolean,
      ) => {
        for (const layout of KEYBOARD_LAYOUTS) {
          for (const [code, key] of Object.entries(layout.layout)) {
            if (key && pick(key as never)) {
              return { layout, code };
            }
          }
        }
        throw new Error('no such key');
      };
      const plainOf = (code: string) =>
        ACTIONS.find(
          (a) =>
            a.type === ActionType.WSK && a.keyCode === code && !a.withShift,
        );

      it('marks dead keys and gives them the dead key tooltip', () => {
        const { layout, code } = find(
          (k) => k['unmodified']?.type === 'dead-key',
        );
        const action = plainOf(code);
        if (!action) {
          pending('this key has no plain action');
        }
        keyboardStore.setSelectedId(layout.id);
        use(custom({ '0:1': action!.codeId }));
        const first = labels(1)[0] as KeyLabel & { isDeadKey?: boolean };
        expect(first.isDeadKey).toBeTrue();
        expect(first.title).toBe('general.dead-key-tooltip');
        expect(first.shiftKey).toBeFalse();
      });

      it('adds the AltGr and shift AltGr labels when the keyboard layout has them', () => {
        let found: { id: string; code: string; actionCode: number } | null =
          null;
        for (const layout of KEYBOARD_LAYOUTS) {
          for (const [code, key] of Object.entries(layout.layout)) {
            const action = plainOf(code);
            if (
              action &&
              key?.unmodified &&
              key.withShift &&
              key.withAltGraph &&
              key.withShiftAltGraph
            ) {
              found = { id: layout.id, code, actionCode: action.codeId };
              break;
            }
          }
          if (found) break;
        }
        expect(found).not.toBeNull();
        keyboardStore.setSelectedId(found!.id);
        use(custom({ '0:1': found!.actionCode }));
        expect(labels(1).map((l) => [l.shiftKey, l.altGraphKey])).toEqual([
          [false, false],
          [true, false],
          [false, true],
          [true, true],
        ]);
      });
    });

    it('does not label anything when the keyboard layout is missing', () => {
      keyboardStore.setSelectedId('missing');
      expect(component.keyLabelMap()).toBeNull();
    });
  });

  describe('highlighted keys', () => {
    it('highlights nothing on the first layer without modifiers', () => {
      expect(component.highlightPositionCodes()).toEqual([]);
    });

    it('highlights the layer shift keys for the upper layers', () => {
      const map = getLayerShiftPositionCodeMap(component.deviceLayout()!);
      expect(map.numShift.length).toBeGreaterThan(0);
      component.currentLayer.set(Layer.Secondary);
      expect(component.highlightPositionCodes()).toEqual(map.numShift);
      component.currentLayer.set(Layer.Tertiary);
      expect(component.highlightPositionCodes()).toEqual(map.fnShift);
      expect(map.fnShift.length).toBeGreaterThan(0);
    });

    it('highlights the flag shift keys on the fourth layer', () => {
      patchState(deviceStore, setAllEntities([M4G_DEFAULT_DEVICE_LAYOUT]));
      deviceStore.setSelectedId(M4G_DEFAULT_DEVICE_LAYOUT.id);
      const map = getLayerShiftPositionCodeMap(M4G_DEFAULT_DEVICE_LAYOUT);
      component.currentLayer.set(Layer.Quaternary);
      expect(component.highlightPositionCodes()).toEqual(map.flagShift);
    });

    it('adds the shift key of the layer', () => {
      const modifiers = getModifierKeyPositionCodeMap(
        component.deviceLayout()!,
      );
      component.shiftKey.set(true);
      expect(modifiers.shift[Layer.Primary].length).toBeGreaterThan(0);
      expect(component.highlightPositionCodes()).toEqual(
        modifiers.shift[Layer.Primary],
      );
    });

    it('adds the AltGr key of the layer after the layer shift key', () => {
      const deviceLayout = component.deviceLayout()!;
      const modifiers = getModifierKeyPositionCodeMap(deviceLayout);
      const shifts = getLayerShiftPositionCodeMap(deviceLayout);
      component.currentLayer.set(Layer.Secondary);
      component.altGraphKey.set(true);
      const altGraph = modifiers.altGraph[Layer.Secondary] ?? [];
      expect(component.highlightPositionCodes()).toEqual([
        ...shifts.numShift,
        ...altGraph,
      ]);
    });

    it('highlights nothing when the layout has no key for the modifier', () => {
      use(custom({}));
      component.shiftKey.set(true);
      expect(component.highlightPositionCodes()).toEqual([]);
      component.shiftKey.set(false);
      component.altGraphKey.set(true);
      expect(component.highlightPositionCodes()).toEqual([]);
    });

    it('highlights nothing for a modifier on a layer that has no such key', () => {
      component.currentLayer.set(Layer.Quaternary);
      component.shiftKey.set(true);
      expect(component.highlightPositionCodes()).toEqual([]);
      component.shiftKey.set(false);
      component.altGraphKey.set(true);
      expect(component.highlightPositionCodes()).toEqual([]);
    });

    it('highlights nothing without a device layout', () => {
      deviceStore.setSelectedId('missing');
      expect(component.highlightPositionCodes()).toEqual([]);
    });

    it('can be asked for any layer and modifiers, for printing', () => {
      const modifiers = getModifierKeyPositionCodeMap(
        component.deviceLayout()!,
      );
      expect(
        component.getHighlightPositionCodes(Layer.Primary, true, false),
      ).toEqual(modifiers.shift[Layer.Primary]);
      component.currentLayer.set(Layer.Secondary);
      expect(
        component.getHighlightPositionCodes(Layer.Primary, false, false),
      ).toEqual([]);
    });
  });

  describe('hold keys', () => {
    it('lists the keys to hold for the layer and the modifiers', () => {
      expect(component.holdKeys()).toEqual([]);
      component.currentLayer.set(Layer.Secondary);
      expect(component.holdKeys()).toEqual(['num-shift']);
      component.shiftKey.set(true);
      component.altGraphKey.set(true);
      expect(component.holdKeys()).toEqual(['num-shift', 'shift', 'alt-gr']);
      expect(component.getHoldKeys(Layer.Tertiary, false, true)).toEqual([
        'fn',
        'alt-gr',
      ]);
      expect(component.getHoldKeys(Layer.Quaternary, true, false)).toEqual([
        'flag-shift',
        'shift',
      ]);
    });
  });

  describe('Windows Alt codes', () => {
    it('is false when no key of the layout types a Windows Alt code', () => {
      use(custom({ '0:1': A }));
      expect(component.hasWindowsAltCodeKey()).toBeFalse();
    });

    it('is true when a key of any layer is a Windows Alt code', () => {
      use(custom({ '2:5': WINDOWS_ALT_CODE_ACTIONS[0].codeId }));
      expect(component.hasWindowsAltCodeKey()).toBeTrue();
    });

    it('is false without a device layout', () => {
      deviceStore.setSelectedId('missing');
      expect(component.hasWindowsAltCodeKey()).toBeFalse();
    });
  });

  describe('searching for a key', () => {
    const names = () => component.keyListForSearch()!.map((k) => k.keyName);

    it('lists a character with its name and its names, once for each way to type it', () => {
      use(custom({ '0:1': A, '1:7': A }));
      const aEntries = component
        .keyListForSearch()!
        .filter((k) => !k.withShift);
      expect(aEntries.map((k) => k.keyName)).toEqual([
        'a',
        ...(CHARACTER_NAME_MAP.get('a') ?? []),
      ]);
      expect(aEntries[0].positions).toEqual({
        [Layer.Primary]: [1],
        [Layer.Secondary]: [7],
      });
    });

    it('lists the shifted character as a shift entry', () => {
      use(custom({ '0:1': A }));
      const shifted = component.keyListForSearch()!.filter((k) => k.withShift);
      expect(shifted.map((k) => k.keyName)).toEqual([
        'A',
        ...(CHARACTER_NAME_MAP.get('A') ?? []),
      ]);
      expect(shifted.every((k) => !k.withAltGraph)).toBeTrue();
    });

    it('lists the positions of each layer, up to the last position and the fourth layer', () => {
      use(custom({ '2:3': A, '3:89': A }, 4));
      expect(component.keyListForSearch()![0].positions).toEqual({
        [Layer.Tertiary]: [3],
        [Layer.Quaternary]: [89],
      });
    });

    it('lists the positions of the same action in the same layer together', () => {
      use(custom({ '0:1': A, '0:4': A }));
      expect(component.keyListForSearch()![0].positions).toEqual({
        [Layer.Primary]: [1, 4],
      });
    });

    it('skips positions with no action and unknown action codes', () => {
      use(custom({ '0:1': UNKNOWN_CODE }));
      expect(component.keyListForSearch()).toEqual([]);
    });

    it('lists a key that is not a character by the names of the library', () => {
      const action = ACTIONS.find(
        (a) => a.type === ActionType.NonKey && !!a.actionName,
      ) as { codeId: number; actionName: NonKeyActionName };
      use(custom({ '0:1': action.codeId }));
      expect(names()).toEqual(
        NON_KEY_ACTION_NAME_2_KEY_NAMES_MAP[action.actionName],
      );
    });

    it('lists the plain and shifted level of a key that has no shift action, by its own action', () => {
      use(custom({ '0:1': B }));
      expect(names()[0]).toBe('b');
    });

    it('treats the smallest code that is not an action as an action code, when there is one', () => {
      const unused = [...Array(40).keys()].find(
        (c) => c >= 32 && !ACTIONS.some((a) => a.codeId === c),
      );
      if (unused === undefined) {
        pending('every code from 32 is an action');
      }
      use(custom({ '0:1': unused! }));
      expect(labels(1)[0].type).toBe(KeyLabelType.ActionCode);
    });

    it('shows no label for a code below 32 that is not an action', () => {
      const unused = [...Array(32).keys()].find(
        (c) => !ACTIONS.some((a) => a.codeId === c),
      );
      if (unused === undefined) {
        pending('every code below 32 is an action');
      }
      use(custom({ '0:1': unused! }));
      expect(labels(1)).toEqual([]);
    });

    it('lists a Windows Alt code by its character', () => {
      const action = WINDOWS_ALT_CODE_ACTIONS[0];
      use(custom({ '0:1': action.codeId }));
      expect(names()).toEqual([`${action.character} (Windows Alt Code)`]);
    });

    it('lists the keys of a shifted action as a plain entry', () => {
      use(custom({ '0:1': SHIFT_A }));
      const list = component.keyListForSearch()!;
      expect(list.map((k) => k.keyName)).toEqual([
        'A',
        ...(CHARACTER_NAME_MAP.get('A') ?? []),
      ]);
      expect(list.every((k) => !k.withShift)).toBeTrue();
    });

    it('lists nothing when the keyboard layout is missing', () => {
      keyboardStore.setSelectedId('missing');
      expect(component.keyListForSearch()).toBeNull();
    });

    describe('filtering', () => {
      beforeEach(() => use(custom({ '0:1': A, '0:2': B })));

      it('is null without a query, or with only blanks', () => {
        expect(component.filteredKeyList()).toBeNull();
        component.keySearchQuery.set('   ');
        expect(component.filteredKeyList()).toBeNull();
      });

      it('keeps the entries containing the trimmed query, ignoring case', () => {
        component.keySearchQuery.set('  A  ');
        const result = component.filteredKeyList()!;
        expect(result.length).toBeGreaterThan(0);
        expect(
          result.every((k) => k.keyName.toLowerCase().includes('a')),
        ).toBeTrue();
      });

      it('matches whatever the case of the query', () => {
        component.keySearchQuery.set('LEFT SPACE');
        expect(component.filteredKeyList()).toEqual([]);
        use(
          custom({
            '0:1': wsk('KeyA', false).codeId,
            '0:2': ACTIONS.find(
              (a) =>
                a.type === ActionType.NonKey &&
                NON_KEY_ACTION_NAME_2_KEY_NAMES_MAP[a.actionName!]?.some(
                  (n) => /[a-z]/.test(n) && n !== n.toUpperCase(),
                ),
            )!.codeId,
          }),
        );
        const lowerNames = component
          .keyListForSearch()!
          .map((k) => k.keyName)
          .filter((n) => n !== n.toUpperCase());
        component.keySearchQuery.set(
          lowerNames[lowerNames.length - 1].toUpperCase(),
        );
        expect(component.filteredKeyList()!.length).toBeGreaterThan(0);
      });

      it('is empty when nothing matches', () => {
        component.keySearchQuery.set('zzzz-nothing');
        expect(component.filteredKeyList()).toEqual([]);
      });
    });

    describe('picking a result', () => {
      it('closes the menu, sets the modifiers, the layer and the positions to mark', () => {
        component.searchMenuIsOpen.set(true);
        component.onKeyInSearchResultClick({
          keyName: 'x',
          positions: { [Layer.Secondary]: [3, 4] },
          withShift: true,
        });
        expect(component.searchMenuIsOpen()).toBeFalse();
        expect(component.shiftKey()).toBeTrue();
        expect(component.altGraphKey()).toBeFalse();
        expect(component.currentLayer()).toBe(Layer.Secondary);
        expect(component.selectedPositions()).toEqual([3, 4]);
      });

      it('takes the lowest layer that has the key', () => {
        component.onKeyInSearchResultClick({
          keyName: 'x',
          positions: { [Layer.Tertiary]: [9], [Layer.Secondary]: [8] },
          withAltGraph: true,
        });
        expect(component.currentLayer()).toBe(Layer.Secondary);
        expect(component.selectedPositions()).toEqual([8]);
        expect(component.altGraphKey()).toBeTrue();
        expect(component.shiftKey()).toBeFalse();
      });

      it('only changes the modifiers and closes the menu when there are no positions', () => {
        component.currentLayer.set(Layer.Tertiary);
        component.selectedPositions.set([1]);
        component.shiftKey.set(true);
        component.searchMenuIsOpen.set(true);
        component.onKeyInSearchResultClick({ keyName: 'x', positions: {} });
        expect(component.searchMenuIsOpen()).toBeFalse();
        expect(component.shiftKey()).toBeFalse();
        expect(component.currentLayer()).toBe(Layer.Tertiary);
        expect(component.selectedPositions()).toEqual([1]);
      });
    });
  });

  describe('actions', () => {
    const click = () => {
      const event = new MouseEvent('click');
      spyOn(event, 'stopPropagation');
      return event;
    };

    it('picks a keyboard layout and clears the marked positions', () => {
      component.selectedPositions.set([1]);
      component.setSelectedKeyboardLayoutId(KEYBOARD_LAYOUTS[1].id);
      expect(keyboardStore.selectedId()).toBe(KEYBOARD_LAYOUTS[1].id);
      expect(component.selectedPositions()).toEqual([]);
    });

    it('goes back to the US layout with the reset button, without letting the click through', () => {
      component.setSelectedKeyboardLayoutId(KEYBOARD_LAYOUTS[1].id);
      const event = click();
      component.onResetButtonClick(event);
      expect(event.stopPropagation).toHaveBeenCalled();
      expect(keyboardStore.selectedId()).toBe('us');
    });

    it('opens and closes the search menu', () => {
      component.toggleSearchMenu();
      expect(component.searchMenuIsOpen()).toBeTrue();
      component.toggleSearchMenu();
      expect(component.searchMenuIsOpen()).toBeFalse();
    });

    it('picks a device layout', () => {
      component.setSelectedDeviceLayoutId('m4g-default');
      expect(component.deviceLayout()!.id).toBe('m4g-default');
    });

    it('toggles the third thumb switch, without letting the click through', () => {
      const visibility = TestBed.inject(VisibilitySettingStore);
      const before = visibility.layoutThumb3Switch();
      const event = click();
      component.onThumb3SwitchToggleButtonClick(event);
      expect(event.stopPropagation).toHaveBeenCalled();
      expect(visibility.layoutThumb3Switch()).toBe(!before);
      component.onThumb3SwitchToggleButtonClick(click());
      expect(visibility.layoutThumb3Switch()).toBe(before);
    });

    it('does not let the click on the reference link through', () => {
      const event = click();
      component.onOpenReferenceButtonClick(event);
      expect(event.stopPropagation).toHaveBeenCalled();
    });

    it('sets the modifiers from the toggle group', () => {
      component.onModifierStateChanged(['shift' as never]);
      expect([component.shiftKey(), component.altGraphKey()]).toEqual([
        true,
        false,
      ]);
      expect(component.modifiersState()).toEqual(['shift' as never]);
      component.onModifierStateChanged([
        'alt-graph' as never,
        'shift' as never,
      ]);
      expect([component.shiftKey(), component.altGraphKey()]).toEqual([
        true,
        true,
      ]);
      expect(component.modifiersState()).toEqual([
        'shift',
        'alt-graph',
      ] as never);
      component.onModifierStateChanged(['alt-graph' as never]);
      expect(component.modifiersState()).toEqual(['alt-graph' as never]);
      component.onModifierStateChanged([]);
      expect(component.modifiersState()).toEqual([]);
    });

    it('clears the marked positions', () => {
      component.selectedPositions.set([1, 2]);
      component.resetSelectedPositions();
      expect(component.selectedPositions()).toEqual([]);
    });
  });

  describe('Alt shortcuts', () => {
    const press = (code: string, altKey = true) =>
      window.dispatchEvent(new KeyboardEvent('keyup', { code, altKey }));
    beforeEach(() => fixture.detectChanges());

    it('switches layers with Alt+1 to Alt+3', () => {
      press('Digit2');
      expect(component.currentLayer()).toBe(Layer.Secondary);
      press('Digit3');
      expect(component.currentLayer()).toBe(Layer.Tertiary);
      press('Digit1');
      expect(component.currentLayer()).toBe(Layer.Primary);
    });

    it('ignores Alt+4 when the device has only three layers', () => {
      press('Digit4');
      expect(component.currentLayer()).toBe(Layer.Primary);
    });

    it('switches to the fourth layer when the device has one', () => {
      use(custom({}, 4));
      press('Digit4');
      expect(component.currentLayer()).toBe(Layer.Quaternary);
    });

    it('toggles shift with Alt+S and AltGr with Alt+A', () => {
      press('KeyS');
      expect([component.shiftKey(), component.altGraphKey()]).toEqual([
        true,
        false,
      ]);
      press('KeyA');
      expect([component.shiftKey(), component.altGraphKey()]).toEqual([
        true,
        true,
      ]);
      press('KeyS');
      press('KeyA');
      expect([component.shiftKey(), component.altGraphKey()]).toEqual([
        false,
        false,
      ]);
    });

    it('does nothing without Alt, or for other keys', () => {
      press('Digit2', false);
      press('KeyS', false);
      press('KeyQ');
      expect(component.currentLayer()).toBe(Layer.Primary);
      expect(component.shiftKey()).toBeFalse();
    });
  });

  describe('page', () => {
    const el = () => fixture.nativeElement as HTMLElement;
    const toggleTexts = (group: number) =>
      Array.from(
        el()
          .querySelectorAll('mat-button-toggle-group')
          [group].querySelectorAll('mat-button-toggle'),
      ).map((t) => t.textContent?.replace(/\s+/g, ' ').trim());
    const layouts = () =>
      fixture.debugElement
        .queryAll(By.directive(LayoutComponent))
        .map((d) => d.componentInstance as LayoutComponent);

    beforeEach(() => fixture.detectChanges());

    it('has a toggle for each layer, named after the profile', () => {
      expect(toggleTexts(0)).toEqual(['A1', 'A2', 'A3']);
      use(custom({}, 4, { profile: Profile.B }));
      fixture.detectChanges();
      expect(toggleTexts(0)).toEqual(['B1', 'B2', 'B3', 'B4']);
    });

    it('has Shift and AltGr toggles', () => {
      expect(toggleTexts(1)).toEqual(['Shift', 'AltGr']);
    });

    it('changes the layer, and clears the marked positions, when a layer toggle is clicked', () => {
      component.selectedPositions.set([1]);
      const buttons = el()
        .querySelectorAll('mat-button-toggle-group')[0]
        .querySelectorAll('button');
      (buttons[1] as HTMLButtonElement).click();
      fixture.detectChanges();
      expect(component.currentLayer()).toBe(Layer.Secondary);
      expect(component.selectedPositions()).toEqual([]);
    });

    it('sets the modifiers when the toggles are clicked', () => {
      const buttons = el()
        .querySelectorAll('mat-button-toggle-group')[1]
        .querySelectorAll('button');
      (buttons[0] as HTMLButtonElement).click();
      fixture.detectChanges();
      expect(component.shiftKey()).toBeTrue();
      (buttons[1] as HTMLButtonElement).click();
      fixture.detectChanges();
      expect(component.altGraphKey()).toBeTrue();
    });

    it('shows the layout of the selected device layout, with the labels and highlights', () => {
      const [main] = layouts();
      expect(main.keyLabelMap()).toBe(component.keyLabelMap()!);
      expect(main.alwaysShowLayout()).toBeTrue();
      expect(main.alwaysHideLayoutGuides()).toBeTrue();
      component.currentLayer.set(Layer.Secondary);
      component.shiftKey.set(true);
      component.selectedPositions.set([5]);
      fixture.detectChanges();
      expect(main.highlightKeyCombination()).toEqual({
        positionCodes: component.highlightPositionCodes(),
        score: 0,
        characterKeyPositionCode: 0,
        layer: Layer.Secondary,
        shiftKey: true,
        altGraphKey: false,
        useLayerLock: false,
      });
      expect(main.secondaryHighlightPositions()).toEqual([5]);
    });

    it('shows or hides the third thumb switch by the setting', () => {
      const visibility = TestBed.inject(VisibilitySettingStore);
      visibility.set('layoutThumb3Switch', false);
      fixture.detectChanges();
      expect(layouts().every((l) => !l.showThumb3Switch())).toBeTrue();
      visibility.set('layoutThumb3Switch', true);
      fixture.detectChanges();
      expect(layouts().every((l) => l.showThumb3Switch())).toBeTrue();
    });

    it('prepares one layout for each layer, shift and AltGr state for printing', () => {
      const all = layouts();
      expect(all.length).toBe(1 + 2 * 3 * 2);
      const printed = all.slice(1).map((l) => {
        const h = l.highlightKeyCombination()!;
        return `${h.altGraphKey ? 'G' : '-'}${h.layer}${h.shiftKey ? 'S' : '-'}`;
      });
      expect(printed).toEqual([
        '-1-',
        '-1S',
        '-2-',
        '-2S',
        '-3-',
        '-3S',
        'G1-',
        'G1S',
        'G2-',
        'G2S',
        'G3-',
        'G3S',
      ]);
      expect(el().querySelector('#print-section')!.classList).toContain(
        'hidden',
      );
    });

    it('tells what to hold, for the layer and modifiers', () => {
      expect(
        el().querySelector('section.relative > div')!.textContent,
      ).not.toContain('layout-viewer-page.hold-hint.0');
      component.currentLayer.set(Layer.Secondary);
      component.shiftKey.set(true);
      component.altGraphKey.set(true);
      fixture.detectChanges();
      const hint = el().querySelector('section.relative > div')!;
      const text = hint.textContent!.replace(/\s+/g, ' ');
      expect(text).toContain('layout-viewer-page.hold-hint.0');
      expect(text).toContain('layout-viewer-page.comma');
      expect(text).toContain('layout-viewer-page.and');
      expect(text).toContain('AltGr');
      expect(text).toContain('layout-viewer-page.hold-hint.2');
      const icons = Array.from(hint.querySelectorAll('mat-icon')).map((i) =>
        i.textContent?.trim(),
      );
      expect(icons).toEqual(['counter_2', 'shift']);
    });

    it('explains the colours of dead keys and Windows Alt codes only when they are used', () => {
      const legend = () =>
        el().querySelector('section.relative .absolute.bottom-2')?.textContent;
      expect(legend() ?? '').not.toContain('windows-alt-code-legend');
      use(custom({ '0:1': WINDOWS_ALT_CODE_ACTIONS[0].codeId }));
      fixture.detectChanges();
      expect(legend()).toContain('layout-viewer-page.windows-alt-code-legend');
      expect(legend()).not.toContain('layout-viewer-page.dead-key-legend');
    });

    it('does not show the layout while there is no device layout', () => {
      deviceStore.setSelectedId('missing');
      fixture.detectChanges();
      expect(layouts()).toEqual([]);
      expect(el().querySelector('mat-sidenav-container')).toBeNull();
    });

    it('links to the reference of the keyboard layout, and disables reset for the US layout', () => {
      const link = el().querySelector(
        'a[target="_blank"]',
      ) as HTMLAnchorElement;
      expect(link.getAttribute('href')).toBe(
        component.keyboardLayout().reference,
      );
      expect(link.rel).toBe('noopener noreferrer');
      const reset = () =>
        Array.from(el().querySelectorAll('button')).find(
          (b) => b.querySelector('mat-icon')?.textContent?.trim() === 'replay',
        ) as HTMLButtonElement;
      expect(reset().disabled).toBeTrue();
      component.setSelectedKeyboardLayoutId(KEYBOARD_LAYOUTS[1].id);
      fixture.detectChanges();
      expect(reset().disabled).toBeFalse();
      reset().click();
      fixture.detectChanges();
      expect(keyboardStore.selectedId()).toBe('us');
    });

    it('shows the third thumb switch toggle as checked by the setting', () => {
      const visibility = TestBed.inject(VisibilitySettingStore);
      const toggle = () =>
        el().querySelector('mat-form-field mat-button-toggle') as HTMLElement;
      visibility.set('layoutThumb3Switch', true);
      fixture.detectChanges();
      expect(toggle().classList).toContain('mat-button-toggle-checked');
      visibility.set('layoutThumb3Switch', false);
      fixture.detectChanges();
      expect(toggle().classList).not.toContain('mat-button-toggle-checked');
    });

    it('colors the search button while the menu is open', () => {
      const search = () =>
        Array.from(el().querySelectorAll('button')).find(
          (b) =>
            b.querySelector('mat-icon')?.textContent?.trim() === 'search' &&
            b.classList.contains('mat-mdc-icon-button') &&
            !b.closest('mat-sidenav'),
        ) as HTMLButtonElement;
      expect(search().classList).not.toContain('mat-primary');
      component.searchMenuIsOpen.set(true);
      fixture.detectChanges();
      expect(search().classList).toContain('mat-primary');
    });

    it('shows the search icon button only while the search box is empty, and the results only while it is not', () => {
      const sidenav = () => el().querySelector('mat-sidenav') as HTMLElement;
      const iconButton = () => sidenav().querySelector('mat-form-field button');
      expect(iconButton()).not.toBeNull();
      expect(sidenav().querySelectorAll('mat-action-list button').length).toBe(
        0,
      );
      component.keySearchQuery.set('zzzz-nothing');
      fixture.detectChanges();
      expect(iconButton()).toBeNull();
      expect(sidenav().querySelectorAll('mat-action-list button').length).toBe(
        1,
      );
    });

    it('opens the key search with its button and lists the matches to pick from', async () => {
      const search = Array.from(el().querySelectorAll('button')).find(
        (b) => b.querySelector('mat-icon')?.textContent?.trim() === 'search',
      ) as HTMLButtonElement;
      search.click();
      fixture.detectChanges();
      expect(component.searchMenuIsOpen()).toBeTrue();
      const input = el().querySelector(
        'input[type="search"]',
      ) as HTMLInputElement;
      input.value = 'zzzz-nothing';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      expect(component.keySearchQuery()).toBe('zzzz-nothing');
      const items = () =>
        Array.from(el().querySelectorAll('mat-action-list button'));
      expect(items().map((b) => b.textContent?.trim())).toEqual([
        'layout-viewer-page.key-search.search-no-entry',
      ]);
      expect((items()[0] as HTMLButtonElement).disabled).toBeTrue();
      input.value = 'left space';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      expect(items().length).toBeGreaterThan(0);
      (items()[0] as HTMLButtonElement).click();
      fixture.detectChanges();
      expect(component.searchMenuIsOpen()).toBeFalse();
      expect(component.selectedPositions().length).toBeGreaterThan(0);
    });
  });
});
