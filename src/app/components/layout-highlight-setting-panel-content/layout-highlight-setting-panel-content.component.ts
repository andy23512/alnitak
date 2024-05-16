import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { HighlightSetting } from 'src/app/models/highlight-setting.models';
import { HighlightSettingStore } from 'src/app/stores/highlight-setting.store';
import { KeySideDropdownComponent } from '../key-side-dropdown/key-side-dropdown.component';
import { SidesDropdownComponent } from '../sides-dropdown/sides-dropdown.component';

@Component({
  selector: 'app-layout-highlight-setting-panel-content',
  standalone: true,
  imports: [SidesDropdownComponent, KeySideDropdownComponent],
  templateUrl: './layout-highlight-setting-panel-content.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutHighlightSettingPanelContentComponent {
  highlightSettingStore = inject(HighlightSettingStore);

  setHighlightSetting<
    L extends keyof HighlightSetting,
    K extends keyof HighlightSetting[L],
  >(layer: L, key: K, value: HighlightSetting[L][K]) {
    this.highlightSettingStore.set(layer, key, value);
  }
}
