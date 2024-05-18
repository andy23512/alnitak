import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { VisibilitySetting } from 'src/app/models/visibility-setting.models';
import { VisibilitySettingStore } from 'src/app/stores/visibility-setting.store';
import { KeyNotationHelpDialogComponent } from '../key-notation-help-dialog/key-notation-help-dialog.component';

const VISIBILITY_SETTING_ITEMS: {
  name: string;
  key: keyof VisibilitySetting;
}[] = [
  { name: 'Layout', key: 'layout' },
  { name: 'Layout Text Guide', key: 'layoutTextGuide' },
  { name: 'Layout Key Notation Guide', key: 'layoutKeyNotationGuide' },
  { name: 'Combo Counter', key: 'comboCounter' },
  { name: 'Speedometer', key: 'speedometer' },
];

@Component({
  selector: 'app-visibility-setting-panel-content',
  standalone: true,
  imports: [MatCheckbox, MatIconButton, MatIcon],
  templateUrl: './visibility-setting-panel-content.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VisibilitySettingPanelContentComponent {
  visibilitySettingStore = inject(VisibilitySettingStore);
  matDialog = inject(MatDialog);

  visibilitySettingItems = computed(() => {
    return VISIBILITY_SETTING_ITEMS.map((item) => ({
      ...item,
      value: this.visibilitySettingStore[item.key](),
    }));
  });

  setVisible(key: keyof VisibilitySetting, visible: boolean) {
    this.visibilitySettingStore.set(key, visible);
  }

  openKeyNotationHelpDialog() {
    this.matDialog.open(KeyNotationHelpDialogComponent);
  }
}
