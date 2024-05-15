import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  computed,
  inject,
} from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { KeySideDropdownComponent } from 'src/app/components/key-side-dropdown/key-side-dropdown.component';
import { SidesDropdownComponent } from 'src/app/components/sides-dropdown/sides-dropdown.component';
import { HighlightSetting } from 'src/app/models/highlight-setting.models';
import { VisibilitySetting } from 'src/app/models/visibility-setting.models';
import { HighlightSettingStore } from 'src/app/stores/highlight-setting.store';
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
  selector: 'app-settings-page',
  standalone: true,
  imports: [
    CommonModule,
    MatCheckboxModule,
    MatExpansionModule,
    SidesDropdownComponent,
    KeySideDropdownComponent,
  ],
  templateUrl: './settings-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPageComponent {
  @HostBinding('class') classes = 'block p-5';

  visibilitySettingStore = inject(VisibilitySettingStore);
  highlightSettingStore = inject(HighlightSettingStore);

  visibilitySettingItems = computed(() => {
    return VISIBILITY_SETTING_ITEMS.map((item) => ({
      ...item,
      value: this.visibilitySettingStore[item.key](),
    }));
  });

  setVisible(key: keyof VisibilitySetting, visible: boolean) {
    this.visibilitySettingStore.set(key, visible);
  }

  setHighlightSetting<
    L extends keyof HighlightSetting,
    K extends keyof HighlightSetting[L],
  >(layer: L, key: K, value: HighlightSetting[L][K]) {
    this.highlightSettingStore.set(layer, key, value);
  }
}
