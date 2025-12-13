import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { HighlightSetting } from 'src/app/models/highlight-setting.models';
import { RealTitleCasePipe } from 'src/app/pipes/real-title-case.pipe';
import { HighlightSettingStore } from 'src/app/stores/highlight-setting.store';
import { KeySideDropdownComponent } from '../key-side-dropdown/key-side-dropdown.component';
import { SidesDropdownComponent } from '../sides-dropdown/sides-dropdown.component';

@Component({
  selector: 'app-layout-highlight-setting-panel-content',
  standalone: true,
  imports: [
    SidesDropdownComponent,
    KeySideDropdownComponent,
    TranslatePipe,
    RealTitleCasePipe,
  ],
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
