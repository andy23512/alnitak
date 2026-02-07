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
import { TranslatePipe } from '@ngx-translate/core';
import { VisibilitySetting } from 'src/app/models/visibility-setting.models';
import { IconGuardPipe } from 'src/app/pipes/icon-guard.pipe';
import { RealTitleCasePipe } from 'src/app/pipes/real-title-case.pipe';
import { VisibilitySettingStore } from 'src/app/stores/visibility-setting.store';
import { KeyNotationHelpDialogComponent } from '../key-notation-help-dialog/key-notation-help-dialog.component';
import { Thumb3SwitchHelpDialogComponent } from '../thumb-3-switch-help-dialog/thumb-3-switch-help-dialog.component';

const VISIBILITY_SETTING_ITEMS: {
  name: string;
  key: keyof VisibilitySetting;
}[] = [
  { name: 'visibility-setting.layout', key: 'layout' },
  { name: 'visibility-setting.layout-text-guide', key: 'layoutTextGuide' },
  {
    name: 'visibility-setting.layout-key-notation-guide',
    key: 'layoutKeyNotationGuide',
  },
  {
    name: 'visibility-setting.layout-thumb-3-switch',
    key: 'layoutThumb3Switch',
  },
  {
    name: 'visibility-setting.entry-error-tooltip',
    key: 'entryErrorTooltip',
  },
  { name: 'visibility-setting.combo-counter', key: 'comboCounter' },
  { name: 'visibility-setting.speedometer', key: 'speedometer' },
  {
    name: 'visibility-setting.home-page-chording-animation',
    key: 'homePageChordingAnimation',
  },
];

@Component({
  selector: 'app-visibility-setting-panel-content',
  standalone: true,
  imports: [
    MatCheckbox,
    MatIconButton,
    MatIcon,
    IconGuardPipe,
    TranslatePipe,
    RealTitleCasePipe,
  ],
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
