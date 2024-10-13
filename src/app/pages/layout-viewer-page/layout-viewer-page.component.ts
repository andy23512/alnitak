import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  HostBinding,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { range } from 'ramda';
import { LayoutComponent } from 'src/app/components/layout/layout.component';
import { ACTIONS, NO_ACTION_ACTION_CODES } from 'src/app/data/actions';
import {
  NON_KEY_ACTION_NAME_2_RAW_KEY_LABEL_MAP,
  NON_WSK_CODE_2_RAW_KEY_LABEL_MAP,
} from 'src/app/data/key-labels';
import { ActionType } from 'src/app/models/action.models';
import {
  KeyLabel,
  KeyLabelType,
  Layer,
} from 'src/app/models/device-layout.models';
import { DeviceLayoutStore } from 'src/app/stores/device-layout.store';
import { HighlightSettingStore } from 'src/app/stores/highlight-setting.store';
import { KeyboardLayoutStore } from 'src/app/stores/keyboard-layout.store';
import { VisibilitySettingStore } from 'src/app/stores/visibility-setting.store';

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
  ],
  templateUrl: './layout-viewer-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutViewerPageComponent {
  @HostBinding('class') classes = 'flex flex-col gap-2 h-screen';

  readonly highlightSettingStore = inject(HighlightSettingStore);
  readonly visibilitySettingStore = inject(VisibilitySettingStore);

  readonly keyboardLayout = inject(KeyboardLayoutStore).selectedEntity;
  readonly deviceLayout = inject(DeviceLayoutStore).selectedEntity;

  readonly Layer = Layer;
  readonly layers = [
    { value: Layer.Primary, icon: 'abc' },
    { value: Layer.Secondary, icon: '123' },
    { value: Layer.Tertiary, icon: 'function' },
  ];
  currentLayer = signal(Layer.Primary);
  shiftKey = signal(false);

  readonly keyLabelMap = computed(() => {
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
                  layer,
                  shiftKey: false,
                  altGraphKey: false,
                },
                {
                  type: KeyLabelType.String,
                  c: keyboardLayoutKey.withShift,
                  layer,
                  shiftKey: true,
                  altGraphKey: false,
                },
              );
            }
          } else {
            if (keyboardLayoutKey?.unmodified) {
              keyLabels.push({
                type: KeyLabelType.String,
                c: keyboardLayoutKey.unmodified,
                layer,
                shiftKey: false,
                altGraphKey: false,
              });
            }
            if (keyboardLayoutKey?.withShift) {
              keyLabels.push({
                type: KeyLabelType.String,
                c: keyboardLayoutKey.withShift,
                layer,
                shiftKey: true,
                altGraphKey: false,
              });
            }
          }
        } else if (action?.type === ActionType.NonWSK && action.keyCode) {
          const rawKeyLabel = NON_WSK_CODE_2_RAW_KEY_LABEL_MAP[action.keyCode];
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
        } else if (NO_ACTION_ACTION_CODES.includes(actionCodeId)) {
          continue;
        }
      }
      keyLabelMap[positionIndex] = keyLabels;
    }
    return keyLabelMap;
  });
}
