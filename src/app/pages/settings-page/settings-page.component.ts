import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  computed,
  inject,
} from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { Setting } from 'src/app/models/setting.models';
import { SettingStore } from 'src/app/stores/setting.store';

const VISIBILITY_SETTING_ITEMS: {
  name: string;
  key: keyof Setting['hidden'];
}[] = [
  { name: 'Layout', key: 'layout' },
  { name: 'Layout Text Guide', key: 'layoutTextGuide' },
  { name: 'Combo Counter', key: 'comboCounter' },
  { name: 'Speedometer', key: 'speedometer' },
];

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [CommonModule, MatCheckbox],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPageComponent {
  @HostBinding('class') classes = 'block p-5';

  settingStore = inject(SettingStore);

  visibilitySettingItems = computed(() => {
    const hidden = this.settingStore.hidden();
    return VISIBILITY_SETTING_ITEMS.map((item) => ({
      ...item,
      value: !hidden[item.key],
    }));
  });

  setVisible(key: keyof Setting['hidden'], visible: boolean) {
    this.settingStore.setHidden(key, !visible);
  }
}
