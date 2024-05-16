import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
} from '@angular/material/expansion';
import { DeviceLayoutSettingPanelContentComponent } from 'src/app/components/device-layout-setting-panel-content/device-layout-setting-panel-content.component';
import { LayoutHighlightSettingPanelContentComponent } from '../../components/layout-highlight-setting-panel-content/layout-highlight-setting-panel-content.component';
import { VisibilitySettingPanelContentComponent } from '../../components/visibility-setting-panel-content/visibility-setting-panel-content.component';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    VisibilitySettingPanelContentComponent,
    LayoutHighlightSettingPanelContentComponent,
    DeviceLayoutSettingPanelContentComponent,
  ],
  templateUrl: './settings-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPageComponent {
  @HostBinding('class') classes = 'block p-5';
}
