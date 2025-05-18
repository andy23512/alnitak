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
import { IconGuardPipe } from 'src/app/pipes/icon-guard.pipe';
import { VisibilitySettingStore } from 'src/app/stores/visibility-setting.store';
import { KeyNotationHelpDialogComponent } from '../key-notation-help-dialog/key-notation-help-dialog.component';
import { Thumb3SwitchHelpDialogComponent } from '../thumb-3-switch-help-dialog/thumb-3-switch-help-dialog.component';

const VISIBILITY_SETTING_ITEMS: {
  name: string;
  key: keyof VisibilitySetting;
}[] = [
  { name: 'Layout', key: 'layout' },
  { name: 'Layout - Text Guide', key: 'layoutTextGuide' },
  { name: 'Layout - Key Notation Guide', key: 'layoutKeyNotationGuide' },
  { name: 'Layout - Thumb 3 Switch', key: 'layoutThumb3Switch' },
  { name: 'Combo Counter', key: 'comboCounter' },
  { name: 'Speedometer', key: 'speedometer' },
  { name: 'Home Page Chording Animation', key: 'homePageChordingAnimation' },
];

@Component({
  selector: 'app-visibility-setting-panel-content',
  standalone: true,
  imports: [MatCheckbox, MatIconButton, MatIcon, IconGuardPipe],
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

  openThumb3SwitchHelpDialog() {
    this.matDialog.open(Thumb3SwitchHelpDialogComponent);
  }

  openKeyNotationHelpDialog() {
    this.matDialog.open(KeyNotationHelpDialogComponent);
  }
}
