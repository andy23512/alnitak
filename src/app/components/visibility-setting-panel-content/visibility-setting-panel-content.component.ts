import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { VisibilitySetting } from 'src/app/models/visibility-setting.models';
import { VisibilitySettingStore } from 'src/app/stores/visibility-setting.store';

const VISIBILITY_SETTING_ITEMS: {
  name: string;
  key: keyof VisibilitySetting;
}[] = [
  { name: 'Layout', key: 'layout' },
  { name: 'Layout Text Guide', key: 'layoutTextGuide' },
  { name: 'Combo Counter', key: 'comboCounter' },
  { name: 'Speedometer', key: 'speedometer' },
];

@Component({
  selector: 'app-visibility-setting-panel-content',
  standalone: true,
  imports: [CommonModule, MatCheckboxModule],
  templateUrl: './visibility-setting-panel-content.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VisibilitySettingPanelContentComponent {
  visibilitySettingStore = inject(VisibilitySettingStore);
  visibilitySettingItems = computed(() => {
    return VISIBILITY_SETTING_ITEMS.map((item) => ({
      ...item,
      value: this.visibilitySettingStore[item.key](),
    }));
  });

  setVisible(key: keyof VisibilitySetting, visible: boolean) {
    this.visibilitySettingStore.set(key, visible);
  }
}
