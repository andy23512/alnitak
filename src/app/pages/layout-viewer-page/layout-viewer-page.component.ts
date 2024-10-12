import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { range } from 'ramda';
import { LayoutComponent } from 'src/app/components/layout/layout.component';
import { ACTIONS } from 'src/app/data/actions';
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
  imports: [CommonModule, LayoutComponent],
  templateUrl: './layout-viewer-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutViewerPageComponent {
  readonly highlightSettingStore = inject(HighlightSettingStore);
  readonly visibilitySettingStore = inject(VisibilitySettingStore);

  readonly keyboardLayout = inject(KeyboardLayoutStore).selectedEntity;
  readonly deviceLayout = inject(DeviceLayoutStore).selectedEntity;

  readonly Layer = Layer;

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
        if (
          action?.type === ActionType.WritingSystemKey &&
          action.writingSystemKeyCode
        ) {
          const keyboardLayoutKey =
            keyboardLayout.layout[action?.writingSystemKeyCode];
          if (keyboardLayoutKey?.unmodified) {
            keyLabels.push({
              type: KeyLabelType.String,
              c: keyboardLayoutKey.unmodified,
              layer,
              shiftKey: false,
              altGraphKey: false,
            });
          }
        } else {
          console.log(action);
        }
      }
      keyLabelMap[positionIndex] = keyLabels;
    }
    return keyLabelMap;
  });
}
