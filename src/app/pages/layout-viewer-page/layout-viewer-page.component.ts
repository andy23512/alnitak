import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  HostBinding,
  HostListener,
  inject,
  Signal,
  signal,
  viewChild,
} from '@angular/core';
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
import { TooltipDirective } from '@webed/angular-tooltip';
import * as fuzzy from 'fuzzy';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { NgxPrintModule } from 'ngx-print';
import { range } from 'ramda';
import { LayoutComponent } from 'src/app/components/layout/layout.component';
import { ACTIONS, NO_ACTION_ACTION_CODES } from 'src/app/data/actions';
import { CHARACTER_NAME_MAP } from 'src/app/data/character-name-map';
import {
  NON_KEY_ACTION_NAME_2_RAW_KEY_LABEL_MAP,
  NON_WSK_CODE_2_RAW_KEY_LABEL_MAP,
  OS_2_META_KEY_LABEL_MAP,
} from 'src/app/data/key-labels';
import {
  NON_KEY_ACTION_NAME_2_KEY_NAMES_MAP,
  NON_WSK_CODE_2_KEY_NAMES_MAP,
} from 'src/app/data/key-names';
import { ActionType } from 'src/app/models/action.models';
import {
  DeviceLayout,
  KeyLabel,
  KeyLabelType,
  Layer,
} from 'src/app/models/device-layout.models';
import { IconGuardPipe } from 'src/app/pipes/icon-guard.pipe';
import { OperatingSystemService } from 'src/app/services/operating-system.service';
import { DeviceLayoutStore } from 'src/app/stores/device-layout.store';
import { HighlightSettingStore } from 'src/app/stores/highlight-setting.store';
import { LayoutViewerKeyboardLayoutStore } from 'src/app/stores/layout-viewer-keyboard-layout.store';
import { VisibilitySettingStore } from 'src/app/stores/visibility-setting.store';
import { Icon } from 'src/app/types/icon.types';
import {
  getHoldKeys,
  getModifierKeyPositionCodeMap,
} from 'src/app/utils/layout.utils';

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
  switch (layer) {
    case Layer.Secondary:
      highlightPositionCodes.push(...modifierKeyPositionCodeMap.numShift);
      break;
    case Layer.Tertiary:
      highlightPositionCodes.push(...modifierKeyPositionCodeMap.fnShift);
      break;
  }
  if (shiftKey) {
    highlightPositionCodes.push(...modifierKeyPositionCodeMap.shift);
  }
  if (altGraphKey) {
    highlightPositionCodes.push(...modifierKeyPositionCodeMap.altGraph);
  }
  return highlightPositionCodes;
}

@Component({
  selector: 'app-layout-viewer-page',
  standalone: true,
  imports: [
    CommonModule,
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
  ],
  templateUrl: './layout-viewer-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutViewerPageComponent {
  @HostBinding('class') classes = 'flex flex-col gap-2 h-full';

  readonly pipSupported = 'documentPictureInPicture' in window;
  readonly highlightSettingStore = inject(HighlightSettingStore);
  readonly visibilitySettingStore = inject(VisibilitySettingStore);
  readonly keyboardLayoutStore = inject(LayoutViewerKeyboardLayoutStore);
  readonly operatingSystemService = inject(OperatingSystemService);

  readonly keyboardLayout = this.keyboardLayoutStore.selectedEntity;
  readonly selectedKeyboardLayoutId = this.keyboardLayoutStore.selectedId;
  readonly keyboardLayouts = this.keyboardLayoutStore.entities;
  readonly deviceLayout = inject(DeviceLayoutStore).selectedEntity;

  readonly keyboardLayoutSearchQuery = signal('');
  readonly searchMenuIsOpen = signal(false);
  readonly keySearchQuery = signal('');
  readonly selectedPositions = signal<number[]>([]);
  readonly layout: Signal<ElementRef<HTMLElement>> = viewChild.required('layout', {read: ElementRef});

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
  readonly layers: {
    value: Layer;
    icon: Icon;
    tooltip: string;
    hotkey: string;
  }[] = [
    {
      value: Layer.Primary,
      icon: 'abc',
      tooltip: 'Primary layer',
      hotkey: 'alt.1',
    },
    {
      value: Layer.Secondary,
      icon: '123',
      tooltip: 'Numeric layer',
      hotkey: 'alt.2',
    },
    {
      value: Layer.Tertiary,
      icon: 'function',
      tooltip: 'Function layer',
      hotkey: 'alt.3',
    },
  ];
  currentLayer = signal(Layer.Primary);
  shiftKey = signal(false);
  altGraphKey = signal(false);

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
    if (!deviceLayout || !keyboardLayout) {
      return null;
    }
    for (const positionIndex of range(0, 90)) {
      const keyLabels: KeyLabel[] = [];
      for (const layerIndex of range(0, 3)) {
        let layer = Layer.Primary;
        if (layerIndex === 1) {
          layer = Layer.Secondary;
        } else if (layerIndex === 2) {
          layer = Layer.Tertiary;
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
                  c: keyboardLayoutKey.withShift,
                  title: `Character: ${keyboardLayoutKey.withShift}`,
                  layer,
                  shiftKey: false,
                  altGraphKey: false,
                },
                {
                  type: KeyLabelType.String,
                  c: keyboardLayoutKey.withShift,
                  title: `Character: ${keyboardLayoutKey.withShift}`,
                  layer,
                  shiftKey: true,
                  altGraphKey: false,
                },
              );
            }
            if (keyboardLayoutKey?.withShiftAltGraph) {
              keyLabels.push(
                {
                  type: KeyLabelType.String,
                  c: keyboardLayoutKey.withShiftAltGraph,
                  title: `Character: ${keyboardLayoutKey.withShiftAltGraph}`,
                  layer,
                  shiftKey: false,
                  altGraphKey: true,
                },
                {
                  type: KeyLabelType.String,
                  c: keyboardLayoutKey.withShiftAltGraph,
                  title: `Character: ${keyboardLayoutKey.withShiftAltGraph}`,
                  layer,
                  shiftKey: true,
                  altGraphKey: true,
                },
              );
            }
          } else {
            if (keyboardLayoutKey?.unmodified) {
              keyLabels.push({
                type: KeyLabelType.String,
                c: keyboardLayoutKey.unmodified,
                title: `Character: ${keyboardLayoutKey.unmodified}`,
                layer,
                shiftKey: false,
                altGraphKey: false,
              });
            }
            if (keyboardLayoutKey?.withShift) {
              keyLabels.push({
                type: KeyLabelType.String,
                c: keyboardLayoutKey.withShift,
                title: `Character: ${keyboardLayoutKey.withShift}`,
                layer,
                shiftKey: true,
                altGraphKey: false,
              });
            }
            if (keyboardLayoutKey?.withAltGraph) {
              keyLabels.push({
                type: KeyLabelType.String,
                c: keyboardLayoutKey.withAltGraph,
                title: `Character: ${keyboardLayoutKey.withAltGraph}`,
                layer,
                shiftKey: false,
                altGraphKey: true,
              });
            }
            if (keyboardLayoutKey?.withShiftAltGraph) {
              keyLabels.push({
                type: KeyLabelType.String,
                c: keyboardLayoutKey.withShiftAltGraph,
                title: `Character: ${keyboardLayoutKey.withShiftAltGraph}`,
                layer,
                shiftKey: true,
                altGraphKey: true,
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
        } else {
          keyLabels.push({
            type: KeyLabelType.ActionCode,
            c: actionCodeId,
            title: `Action Code: ${actionCodeId}`,
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
    if (!deviceLayout || !keyboardLayout) {
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
    for (const positionIndex of range(0, 90)) {
      for (const layerIndex of range(0, 3)) {
        let layer = Layer.Primary;
        if (layerIndex === 1) {
          layer = Layer.Secondary;
        } else if (layerIndex === 2) {
          layer = Layer.Tertiary;
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
              keyNames = [char, ...(CHARACTER_NAME_MAP.get(char) ?? [])];
            }
            if (keyboardLayoutKey?.withShiftAltGraph) {
              const char = keyboardLayoutKey.withShiftAltGraph;
              altGraphLayerKeyNames = [
                char,
                ...(CHARACTER_NAME_MAP.get(char) ?? []),
              ];
            }
          } else {
            if (keyboardLayoutKey?.unmodified) {
              const char = keyboardLayoutKey.unmodified;
              keyNames = [char, ...(CHARACTER_NAME_MAP.get(char) ?? [])];
            }
            if (keyboardLayoutKey?.withShift) {
              const char = keyboardLayoutKey.withShift;
              shiftLayerKeyNames = [
                char,
                ...(CHARACTER_NAME_MAP.get(char) ?? []),
              ];
            }
            if (keyboardLayoutKey?.withAltGraph) {
              const char = keyboardLayoutKey.withAltGraph;
              altGraphLayerKeyNames = [
                char,
                ...(CHARACTER_NAME_MAP.get(char) ?? []),
              ];
            }
            if (keyboardLayoutKey?.withShiftAltGraph) {
              const char = keyboardLayoutKey.withShiftAltGraph;
              shiftAltGraphLayerKeyNames = [
                char,
                ...(CHARACTER_NAME_MAP.get(char) ?? []),
              ];
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
    const keySearchQuery = this.keySearchQuery();
    if (!keySearchQuery || !keyListForSearch) {
      return null;
    }
    return fuzzy
      .filter(keySearchQuery, keyListForSearch, {
        extract: (k) => k.keyName,
      })
      .map((r) => r.original);
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
    for (const layer of [Layer.Primary, Layer.Secondary, Layer.Tertiary]) {
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

  public resetSelectedPositions() {
    this.selectedPositions.set([]);
  }

  @HostListener('window:keyup', ['$event'])
  public handleKeyUp({ code, altKey }: KeyboardEvent) {
    if (altKey) {
      switch (code) {
        case 'Digit1':
          this.currentLayer.set(Layer.Primary);
          break;
        case 'Digit2':
          this.currentLayer.set(Layer.Secondary);
          break;
        case 'Digit3':
          this.currentLayer.set(Layer.Tertiary);
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

  public async openPipWindow() {
    const options = {
      width: 400,
      height: 300,
    }
    const pipWindow = await (window as any).documentPictureInPicture.requestWindow(options);
    pipWindow.document.body.append(this.layout().nativeElement);
  }
}
