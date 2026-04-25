
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  HostBinding,
  HostListener,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatActionList, MatListItem } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import {
  MatSidenav,
  MatSidenavContainer,
  MatSidenavContent,
} from '@angular/material/sidenav';
import { MatTooltip } from '@angular/material/tooltip';
import { HotkeysShortcutPipe } from '@ngneat/hotkeys';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { TooltipDirective } from '@webed/angular-tooltip';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { NgxPrintModule } from 'ngx-print';
import { LayoutComponent } from 'src/app/components/layout/layout.component';
import { IconGuardPipe } from 'src/app/pipes/icon-guard.pipe';
import { RealTitleCasePipe } from 'src/app/pipes/real-title-case.pipe';
import { OperatingSystemService } from 'src/app/services/operating-system.service';
import { DeviceLayoutStore } from 'src/app/stores/device-layout.store';
import { LanguageSettingStore } from 'src/app/stores/language-setting.store';
import { LayoutViewerKeyboardLayoutStore } from 'src/app/stores/layout-viewer-keyboard-layout.store';
import { VisibilitySettingStore } from 'src/app/stores/visibility-setting.store';
import { getHoldKeys } from 'src/app/utils/layout.utils';
import {
  ACTIONS,
  ActionType,
  CHARACTER_NAME_MAP,
  DeviceLayout,
  getLayerShiftPositionCodeMap,
  getModifierKeyPositionCodeMap,
  KeyLabel,
  KeyLabelType,
  Layer,
  NO_ACTION_ACTION_CODES,
  NON_KEY_ACTION_NAME_2_KEY_NAMES_MAP,
  NON_KEY_ACTION_NAME_2_RAW_KEY_LABEL_MAP,
  NON_WSK_CODE_2_KEY_NAMES_MAP,
  NON_WSK_CODE_2_RAW_KEY_LABEL_MAP,
  OS_2_META_KEY_LABEL_MAP,
} from 'tangent-cc-lib';

enum Modifier {
  Shift = 'shift',
  AltGraph = 'alt-graph',
}

function getHighlightPositionCodes(
  deviceLayout: DeviceLayout | null,
  layer: Layer,
  shiftKey: boolean,
  altGraphKey: boolean,
) {
  if (!deviceLayout) {
    return [];
  }
  let highlightPositionCodes: number[] = [];
  const modifierKeyPositionCodeMap =
    getModifierKeyPositionCodeMap(deviceLayout);
  const layerShiftKeyPositionCodeMap =
    getLayerShiftPositionCodeMap(deviceLayout);
  switch (layer) {
    case Layer.Secondary:
      highlightPositionCodes.push(...layerShiftKeyPositionCodeMap.numShift);
      break;
    case Layer.Tertiary:
      highlightPositionCodes.push(...layerShiftKeyPositionCodeMap.fnShift);
      break;
    case Layer.Quaternary:
      highlightPositionCodes.push(...layerShiftKeyPositionCodeMap.flagShift);
      break;
  }
  if (shiftKey) {
    if (!modifierKeyPositionCodeMap.shift[layer]) {
      return [];
    }
    highlightPositionCodes.push(...modifierKeyPositionCodeMap.shift[layer]);
  }
  if (altGraphKey) {
    if (!modifierKeyPositionCodeMap.altGraph[layer]) {
      return [];
    }
    highlightPositionCodes.push(...modifierKeyPositionCodeMap.altGraph[layer]);
  }
  return highlightPositionCodes;
}

@Component({
  selector: 'app-layout-viewer-page',
  standalone: true,
  imports: [
    LayoutComponent,
    MatButtonToggleModule,
    MatIconModule,
    MatCheckboxModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    NgxMatSelectSearchModule,
    MatButtonModule,
    IconGuardPipe,
    MatSidenav,
    MatSidenavContainer,
    MatSidenavContent,
    MatInput,
    MatActionList,
    MatListItem,
    NgxPrintModule,
    MatTooltip,
    TooltipDirective,
    HotkeysShortcutPipe,
    TranslatePipe,
    RealTitleCasePipe
],
  templateUrl: './layout-viewer-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutViewerPageComponent {
  @HostBinding('class') classes = 'flex flex-col gap-2 h-full';

  readonly visibilitySettingStore = inject(VisibilitySettingStore);
  readonly keyboardLayoutStore = inject(LayoutViewerKeyboardLayoutStore);
  readonly operatingSystemService = inject(OperatingSystemService);
  readonly translateService = inject(TranslateService);
  private readonly deviceLayoutStore = inject(DeviceLayoutStore);
  readonly languageSettingStore = inject(LanguageSettingStore);

  readonly selectedDeviceLayoutId = this.deviceLayoutStore.selectedId;
  readonly keyboardLayout = this.keyboardLayoutStore.selectedEntity;
  readonly selectedKeyboardLayoutId = this.keyboardLayoutStore.selectedId;
  readonly hasDeadKey = this.keyboardLayoutStore.hasDeadKey;
  readonly keyboardLayouts = this.keyboardLayoutStore.entities;
  readonly deviceLayout = this.deviceLayoutStore.selectedEntity;
  public deviceLayouts = this.deviceLayoutStore.entities;
  public cc1cc2DefaultLayoutName = toSignal(
    this.translateService.stream('device-layout.cc1-cc2-default'),
  );
  public m4gDefaultLayoutName = toSignal(
    this.translateService.stream('device-layout.m4g-default'),
  );
  public cc1cc2RightHandOnlyLayoutName = toSignal(
    this.translateService.stream('device-layout.cc1-cc2-right-hand-only'),
  );
  public cc1cc2LeftHandOnlyLayoutName = toSignal(
    this.translateService.stream('device-layout.cc1-cc2-left-hand-only'),
  );
  readonly deviceLayoutLayerNumber =
    inject(DeviceLayoutStore).selectedEntityLayerNumber;

  readonly keyboardLayoutSearchQuery = signal('');
  readonly searchMenuIsOpen = signal(false);
  readonly keySearchQuery = signal('');
  readonly selectedPositions = signal<number[]>([]);
  public translatedDeviceLayouts = computed(() => {
    const _ = this.languageSettingStore.uiLanguage();
    const deviceLayouts = this.deviceLayouts();
    const cc1cc2DefaultLayoutName = this.cc1cc2DefaultLayoutName();
    const m4gDefaultLayoutName = this.m4gDefaultLayoutName();
    return deviceLayouts.map((deviceLayout) => ({
      ...deviceLayout,
      name:
        'default' === deviceLayout.id
          ? cc1cc2DefaultLayoutName
          : 'm4g-default' === deviceLayout.id
            ? m4gDefaultLayoutName
            : 'cc1-cc2-right-hand-only' === deviceLayout.id
              ? this.cc1cc2RightHandOnlyLayoutName()
              : 'cc1-cc2-left-hand-only' === deviceLayout.id
                ? this.cc1cc2LeftHandOnlyLayoutName()
                : deviceLayout.name,
    }));
  });

  deviceLayoutDisplayName = computed(() => {
    const deviceLayout = this.deviceLayout();
    if (!deviceLayout) {
      return '';
    }
    return 'default' === deviceLayout.id
      ? this.translateService.instant('device-layout.cc1-cc2-default')
      : 'm4g-default' === deviceLayout.id
        ? this.translateService.instant('device-layout.m4g-default')
        : 'cc1-cc2-right-hand-only' === deviceLayout.id
          ? this.translateService.instant(
              'device-layout.cc1-cc2-right-hand-only',
            )
          : deviceLayout.name;
  });
  readonly filteredKeyboardLayouts = computed(() => {
    const keyboardLayouts = this.keyboardLayouts();
    const keyboardLayoutSearchQuery =
      this.keyboardLayoutSearchQuery().toLowerCase();
    if (!keyboardLayoutSearchQuery) {
      return keyboardLayouts;
    }
    return keyboardLayouts.filter((k) =>
      k.name.toLowerCase().includes(keyboardLayoutSearchQuery),
    );
  });

  readonly Layer = Layer;
  readonly layers = computed<
    {
      value: Layer;
      name: string;
      tooltip: string;
      hotkey: string;
    }[]
  >(() => {
    const deviceLayoutLayerNumber = this.deviceLayoutLayerNumber();
    if (!deviceLayoutLayerNumber) {
      return [];
    }
    const allLayers = [
      {
        value: Layer.Primary,
        name: 'A1',
        tooltip: 'layout-viewer-page.layer.a1',
        hotkey: 'alt.1',
      },
      {
        value: Layer.Secondary,
        name: 'A2',
        tooltip: 'layout-viewer-page.layer.a2',
        hotkey: 'alt.2',
      },
      {
        value: Layer.Tertiary,
        name: 'A3',
        tooltip: 'layout-viewer-page.layer.a3',
        hotkey: 'alt.3',
      },
      {
        value: Layer.Quaternary,
        name: 'A4',
        tooltip: 'layout-viewer-page.layer.a4',
        hotkey: 'alt.4',
      },
    ];
    return allLayers.slice(0, deviceLayoutLayerNumber);
  });
  currentLayer = signal(Layer.Primary);
  shiftKey = signal(false);
  altGraphKey = signal(false);
  modifiersState = computed<Modifier[]>(() => {
    return [
      this.shiftKey() ? Modifier.Shift : null,
      this.altGraphKey() ? Modifier.AltGraph : null,
    ].filter(Boolean) as Modifier[];
  });
  readonly Modifier = Modifier;

  readonly holdKeys = computed(() => {
    return getHoldKeys(
      this.currentLayer(),
      this.shiftKey(),
      this.altGraphKey(),
    );
  });

  readonly highlightPositionCodes = computed(() => {
    return getHighlightPositionCodes(
      this.deviceLayout(),
      this.currentLayer(),
      this.shiftKey(),
      this.altGraphKey(),
    );
  });

  readonly keyLabelMap = computed(() => {
    const operatingSystem = this.operatingSystemService.getOS();
    const keyLabelMap: Record<number, KeyLabel[]> = {};
    const deviceLayout = this.deviceLayout();
    const keyboardLayout = this.keyboardLayout();
    const deviceLayoutLayerNumber = this.deviceLayoutLayerNumber();
    if (!deviceLayout || !keyboardLayout || !deviceLayoutLayerNumber) {
      return null;
    }
    for (let positionIndex = 0; positionIndex < 90; positionIndex += 1) {
      const keyLabels: KeyLabel[] = [];
      for (
        let layerIndex = 0;
        layerIndex < deviceLayoutLayerNumber;
        layerIndex += 1
      ) {
        let layer = Layer.Primary;
        if (layerIndex === 1) {
          layer = Layer.Secondary;
        } else if (layerIndex === 2) {
          layer = Layer.Tertiary;
        } else if (layerIndex === 3) {
          layer = Layer.Quaternary;
        }
        const actionCodeId = deviceLayout.layout[layerIndex][positionIndex];
        const action = ACTIONS.find((a) => a.codeId === actionCodeId);
        if (action?.type === ActionType.WSK && action.keyCode) {
          const keyboardLayoutKey = keyboardLayout.layout[action?.keyCode];
          if (action?.withShift) {
            if (keyboardLayoutKey?.withShift) {
              keyLabels.push(
                {
                  type: KeyLabelType.String,
                  c: keyboardLayoutKey.withShift.value,
                  title: this.translateService.instant(
                    keyboardLayoutKey.withShift.type === 'dead-key'
                      ? 'general.dead-key-tooltip'
                      : 'general.character-tooltip',
                    {
                      character: keyboardLayoutKey.withShift.value,
                    },
                  ),
                  layer,
                  shiftKey: false,
                  altGraphKey: false,
                  isDeadKey: keyboardLayoutKey.withShift.type === 'dead-key',
                },
                {
                  type: KeyLabelType.String,
                  c: keyboardLayoutKey.withShift.value,
                  title: this.translateService.instant(
                    keyboardLayoutKey.withShift.type === 'dead-key'
                      ? 'general.dead-key-tooltip'
                      : 'general.character-tooltip',
                    {
                      character: keyboardLayoutKey.withShift.value,
                    },
                  ),
                  layer,
                  shiftKey: true,
                  altGraphKey: false,
                  isDeadKey: keyboardLayoutKey.withShift.type === 'dead-key',
                },
              );
            }
            if (keyboardLayoutKey?.withShiftAltGraph) {
              keyLabels.push(
                {
                  type: KeyLabelType.String,
                  c: keyboardLayoutKey.withShiftAltGraph.value,
                  title: this.translateService.instant(
                    keyboardLayoutKey.withShiftAltGraph.type === 'dead-key'
                      ? 'general.dead-key-tooltip'
                      : 'general.character-tooltip',
                    {
                      character: keyboardLayoutKey.withShiftAltGraph.value,
                    },
                  ),
                  layer,
                  shiftKey: false,
                  altGraphKey: true,
                },
                {
                  type: KeyLabelType.String,
                  c: keyboardLayoutKey.withShiftAltGraph.value,
                  title: this.translateService.instant(
                    keyboardLayoutKey.withShiftAltGraph.type === 'dead-key'
                      ? 'general.dead-key-tooltip'
                      : 'general.character-tooltip',
                    {
                      character: keyboardLayoutKey.withShiftAltGraph.value,
                    },
                  ),
                  layer,
                  shiftKey: true,
                  altGraphKey: true,
                  isDeadKey:
                    keyboardLayoutKey.withShiftAltGraph.type === 'dead-key',
                },
              );
            }
          } else {
            if (keyboardLayoutKey?.unmodified) {
              keyLabels.push({
                type: KeyLabelType.String,
                c: keyboardLayoutKey.unmodified.value,
                title: this.translateService.instant(
                  keyboardLayoutKey.unmodified.type === 'dead-key'
                    ? 'general.dead-key-tooltip'
                    : 'general.character-tooltip',
                  {
                    character: keyboardLayoutKey.unmodified.value,
                  },
                ),
                layer,
                shiftKey: false,
                altGraphKey: false,
                isDeadKey: keyboardLayoutKey.unmodified.type === 'dead-key',
              });
            }
            if (keyboardLayoutKey?.withShift) {
              keyLabels.push({
                type: KeyLabelType.String,
                c: keyboardLayoutKey.withShift.value,
                title: this.translateService.instant(
                  keyboardLayoutKey.withShift.type === 'dead-key'
                    ? 'general.dead-key-tooltip'
                    : 'general.character-tooltip',
                  {
                    character: keyboardLayoutKey.withShift.value,
                  },
                ),
                layer,
                shiftKey: true,
                altGraphKey: false,
                isDeadKey: keyboardLayoutKey.withShift.type === 'dead-key',
              });
            }
            if (keyboardLayoutKey?.withAltGraph) {
              keyLabels.push({
                type: KeyLabelType.String,
                c: keyboardLayoutKey.withAltGraph.value,
                title: this.translateService.instant(
                  keyboardLayoutKey.withAltGraph.type === 'dead-key'
                    ? 'general.dead-key-tooltip'
                    : 'general.character-tooltip',
                  {
                    character: keyboardLayoutKey.withAltGraph.value,
                  },
                ),
                layer,
                shiftKey: false,
                altGraphKey: true,
                isDeadKey: keyboardLayoutKey.withAltGraph.type === 'dead-key',
              });
            }
            if (keyboardLayoutKey?.withShiftAltGraph) {
              keyLabels.push({
                type: KeyLabelType.String,
                c: keyboardLayoutKey.withShiftAltGraph.value,
                title: this.translateService.instant(
                  keyboardLayoutKey.withShiftAltGraph.type === 'dead-key'
                    ? 'general.dead-key-tooltip'
                    : 'general.character-tooltip',
                  {
                    character: keyboardLayoutKey.withShiftAltGraph.value,
                  },
                ),
                layer,
                shiftKey: true,
                altGraphKey: true,
                isDeadKey:
                  keyboardLayoutKey.withShiftAltGraph.type === 'dead-key',
              });
            }
          }
        } else if (action?.type === ActionType.NonWSK && action.keyCode) {
          let rawKeyLabelMap = NON_WSK_CODE_2_RAW_KEY_LABEL_MAP;
          if (operatingSystem && OS_2_META_KEY_LABEL_MAP[operatingSystem]) {
            rawKeyLabelMap = {
              ...rawKeyLabelMap,
              ...OS_2_META_KEY_LABEL_MAP[operatingSystem],
            };
          }
          const rawKeyLabel = rawKeyLabelMap[action.keyCode];
          if (rawKeyLabel) {
            keyLabels.push({
              ...rawKeyLabel,
              layer,
              shiftKey: false,
              altGraphKey: false,
            });
          }
        } else if (action?.type === ActionType.NonKey && action.actionName) {
          const rawKeyLabel =
            NON_KEY_ACTION_NAME_2_RAW_KEY_LABEL_MAP[action.actionName];
          if (rawKeyLabel) {
            keyLabels.push({
              ...rawKeyLabel,
              layer,
              shiftKey: false,
              altGraphKey: false,
            });
          }
        } else if (actionCodeId >= 32) {
          keyLabels.push({
            type: KeyLabelType.ActionCode,
            c: actionCodeId,
            title: this.translateService.instant(
              'general.action-code-tooltip',
              {
                actionCode: actionCodeId,
              },
            ),
            layer,
            shiftKey: false,
            altGraphKey: false,
          });
        }
      }
      keyLabelMap[positionIndex] = keyLabels;
    }
    return keyLabelMap;
  });

  readonly keyListForSearch = computed(() => {
    const deviceLayout = this.deviceLayout();
    const keyboardLayout = this.keyboardLayout();
    const deviceLayoutLayerNumber = this.deviceLayoutLayerNumber();
    if (!deviceLayout || !keyboardLayout || !deviceLayoutLayerNumber) {
      return null;
    }
    const actionCodeToPositionsMap: Record<
      number,
      Partial<Record<Layer, number[]>>
    > = {};
    const keyList: {
      keyName: string;
      positions: Partial<Record<Layer, number[]>>;
      withShift?: boolean;
      withAltGraph?: boolean;
    }[] = [];
    for (let positionIndex = 0; positionIndex < 90; positionIndex += 1) {
      for (
        let layerIndex = 0;
        layerIndex < deviceLayoutLayerNumber;
        layerIndex += 1
      ) {
        let layer = Layer.Primary;
        if (layerIndex === 1) {
          layer = Layer.Secondary;
        } else if (layerIndex === 2) {
          layer = Layer.Tertiary;
        } else if (layerIndex === 3) {
          layer = Layer.Quaternary;
        }
        const actionCodeId = deviceLayout.layout[layerIndex][positionIndex];
        if (!actionCodeToPositionsMap[actionCodeId]) {
          actionCodeToPositionsMap[actionCodeId] = { [layer]: [positionIndex] };
        } else if (!actionCodeToPositionsMap[actionCodeId][layer]) {
          actionCodeToPositionsMap[actionCodeId][layer] = [positionIndex];
        } else {
          actionCodeToPositionsMap[actionCodeId][layer]?.push(positionIndex);
        }
      }
    }
    Object.entries(actionCodeToPositionsMap).forEach(
      ([actionCodeId, positions]) => {
        const action = ACTIONS.find((a) => a.codeId === +actionCodeId);
        let keyNames: string[] | null = null;
        let shiftLayerKeyNames: string[] | null = null;
        let altGraphLayerKeyNames: string[] | null = null;
        let shiftAltGraphLayerKeyNames: string[] | null = null;
        if (action?.type === ActionType.WSK && action.keyCode) {
          const keyboardLayoutKey = keyboardLayout.layout[action?.keyCode];
          if (action?.withShift) {
            if (keyboardLayoutKey?.withShift) {
              const char = keyboardLayoutKey.withShift;
              if (char.type === 'text') {
                keyNames = [
                  char.value,
                  ...(CHARACTER_NAME_MAP.get(char.value) ?? []),
                ];
              } else if (char.type === 'dead-key') {
                keyNames = [char.value].map((n) => `${n} (dead key)`);
              }
            }
            if (keyboardLayoutKey?.withShiftAltGraph) {
              const char = keyboardLayoutKey.withShiftAltGraph;
              if (char.type === 'text') {
                altGraphLayerKeyNames = [
                  char.value,
                  ...(CHARACTER_NAME_MAP.get(char.value) ?? []),
                ];
              } else if (char.type === 'dead-key') {
                altGraphLayerKeyNames = [char.value].map(
                  (n) => `${n} (dead key)`,
                );
              }
            }
          } else {
            if (keyboardLayoutKey?.unmodified) {
              const char = keyboardLayoutKey.unmodified;
              if (char.type === 'text') {
                keyNames = [
                  char.value,
                  ...(CHARACTER_NAME_MAP.get(char.value) ?? []),
                ];
              } else if (char.type === 'dead-key') {
                keyNames = [char.value].map((n) => `${n} (dead key)`);
              }
            }
            if (keyboardLayoutKey?.withShift) {
              const char = keyboardLayoutKey.withShift;
              if (char.type === 'text') {
                shiftLayerKeyNames = [
                  char.value,
                  ...(CHARACTER_NAME_MAP.get(char.value) ?? []),
                ];
              } else if (char.type === 'dead-key') {
                shiftLayerKeyNames = [char.value].map((n) => `${n} (dead key)`);
              }
            }
            if (keyboardLayoutKey?.withAltGraph) {
              const char = keyboardLayoutKey.withAltGraph;
              if (char.type === 'text') {
                altGraphLayerKeyNames = [
                  char.value,
                  ...(CHARACTER_NAME_MAP.get(char.value) ?? []),
                ];
              } else if (char.type === 'dead-key') {
                altGraphLayerKeyNames = [char.value].map(
                  (n) => `${n} (dead key)`,
                );
              }
            }
            if (keyboardLayoutKey?.withShiftAltGraph) {
              const char = keyboardLayoutKey.withShiftAltGraph;
              if (char.type === 'text') {
                shiftAltGraphLayerKeyNames = [
                  char.value,
                  ...(CHARACTER_NAME_MAP.get(char.value) ?? []),
                ];
              } else if (char.type === 'dead-key') {
                shiftAltGraphLayerKeyNames = [char.value].map(
                  (n) => `${n} (dead key)`,
                );
              }
            }
          }
        } else if (action?.type === ActionType.NonWSK && action.keyCode) {
          keyNames = NON_WSK_CODE_2_KEY_NAMES_MAP[action.keyCode];
        } else if (action?.type === ActionType.NonKey && action.actionName) {
          keyNames = NON_KEY_ACTION_NAME_2_KEY_NAMES_MAP[action.actionName];
        } else if (NO_ACTION_ACTION_CODES.includes(+actionCodeId)) {
          return;
        }
        if (keyNames) {
          keyNames.forEach((keyName) => {
            keyList.push({ keyName, positions });
          });
        }
        if (shiftLayerKeyNames) {
          shiftLayerKeyNames.forEach((keyName) => {
            keyList.push({ keyName, positions, withShift: true });
          });
        }
        if (altGraphLayerKeyNames) {
          altGraphLayerKeyNames.forEach((keyName) => {
            keyList.push({
              keyName,
              positions,
              withAltGraph: true,
            });
          });
        }
        if (shiftAltGraphLayerKeyNames) {
          shiftAltGraphLayerKeyNames.forEach((keyName) => {
            keyList.push({
              keyName,
              positions,
              withShift: true,
              withAltGraph: true,
            });
          });
        }
      },
    );
    return keyList;
  });

  readonly filteredKeyList = computed(() => {
    const keyListForSearch = this.keyListForSearch();
    const keySearchQuery = this.keySearchQuery().trim().toLowerCase();
    if (!keySearchQuery || !keyListForSearch) {
      return null;
    }
    return keyListForSearch.filter((item) =>
      item.keyName.toLowerCase().includes(keySearchQuery),
    );
  });

  public setSelectedKeyboardLayoutId(keyboardLayoutId: string) {
    this.keyboardLayoutStore.setSelectedId(keyboardLayoutId);
    this.resetSelectedPositions();
  }

  public onResetButtonClick(event: MouseEvent) {
    event.stopPropagation();
    this.setSelectedKeyboardLayoutId('us');
  }

  public toggleSearchMenu() {
    this.searchMenuIsOpen.set(!this.searchMenuIsOpen());
  }

  public onKeyInSearchResultClick({
    withShift,
    withAltGraph,
    positions,
  }: {
    keyName: string;
    positions: Partial<Record<Layer, number[]>>;
    withShift?: boolean;
    withAltGraph?: boolean;
  }) {
    this.searchMenuIsOpen.set(false);
    this.shiftKey.set(Boolean(withShift));
    this.altGraphKey.set(Boolean(withAltGraph));
    for (const layer of [
      Layer.Primary,
      Layer.Secondary,
      Layer.Tertiary,
      Layer.Quaternary,
    ]) {
      if (positions[layer]) {
        this.currentLayer.set(layer);
        this.selectedPositions.set(positions[layer] ?? []);
        return;
      }
    }
  }

  public getHoldKeys(layer: Layer, shiftKey: boolean, altGraphKey: boolean) {
    return getHoldKeys(layer, shiftKey, altGraphKey);
  }

  public getHighlightPositionCodes(
    layer: Layer,
    shiftKey: boolean,
    altGraphKey: boolean,
  ) {
    return getHighlightPositionCodes(
      this.deviceLayout(),
      layer,
      shiftKey,
      altGraphKey,
    );
  }

  public onModifierStateChanged(value: Modifier[]) {
    this.shiftKey.set(value.includes(Modifier.Shift));
    this.altGraphKey.set(value.includes(Modifier.AltGraph));
  }

  public resetSelectedPositions() {
    this.selectedPositions.set([]);
  }

  @HostListener('window:keyup', ['$event'])
  public handleKeyUp({ code, altKey }: KeyboardEvent) {
    if (altKey) {
      switch (code) {
        case 'Digit1':
          this.setCurrentLayer(Layer.Primary);
          break;
        case 'Digit2':
          this.setCurrentLayer(Layer.Secondary);
          break;
        case 'Digit3':
          this.setCurrentLayer(Layer.Tertiary);
          break;
        case 'Digit4':
          this.setCurrentLayer(Layer.Quaternary);
          break;
        case 'KeyS':
          this.shiftKey.set(!this.shiftKey());
          break;
        case 'KeyA':
          this.altGraphKey.set(!this.altGraphKey());
          break;
      }
    }
  }

  public setSelectedDeviceLayoutId(deviceLayoutId: string) {
    this.deviceLayoutStore.setSelectedId(deviceLayoutId);
  }

  public onThumb3SwitchToggleButtonClick(event: MouseEvent) {
    event.stopPropagation();
    this.visibilitySettingStore.set(
      'layoutThumb3Switch',
      !this.visibilitySettingStore.layoutThumb3Switch(),
    );
  }

  public onOpenReferenceButtonClick(event: MouseEvent) {
    event.stopPropagation();
  }

  private setCurrentLayer(layer: Layer) {
    const layers = this.layers();
    const targetLayer = layers.find((l) => l.value === layer);
    if (targetLayer) {
      this.currentLayer.set(targetLayer.value);
    }
  }
}
