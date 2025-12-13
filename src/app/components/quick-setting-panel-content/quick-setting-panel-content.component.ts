import { Component, HostBinding, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';
import { DeviceLayoutStore } from 'src/app/stores/device-layout.store';
import { VisibilitySettingStore } from 'src/app/stores/visibility-setting.store';

interface QuickSetting {
  name: string;
  deviceLayoutId: string;
  layoutThumb3SwitchVisibility: boolean;
}

@Component({
  selector: 'app-quick-setting-panel-content',
  templateUrl: './quick-setting-panel-content.component.html',
  styleUrls: ['./quick-setting-panel-content.component.scss'],
  standalone: true,
  imports: [MatButton, TranslatePipe],
})
export class QuickSettingPanelContentComponent {
  @HostBinding('class') classes = 'flex flex-col gap-3 items-start';

  public visibilitySettingStore = inject(VisibilitySettingStore);
  public deviceLayoutStore = inject(DeviceLayoutStore);
  public quickSettings: QuickSetting[] = [
    {
      name: 'quick-setting.cc1-cc2-default-layout',
      deviceLayoutId: 'default',
      layoutThumb3SwitchVisibility: true,
    },
    {
      name: 'quick-setting.m4g-default-layout',
      deviceLayoutId: 'm4g-default',
      layoutThumb3SwitchVisibility: false,
    },
  ];

  public onQuickSettingButtonClick({
    deviceLayoutId,
    layoutThumb3SwitchVisibility,
  }: QuickSetting) {
    this.deviceLayoutStore.setSelectedId(deviceLayoutId);
    this.visibilitySettingStore.set(
      'layoutThumb3Switch',
      layoutThumb3SwitchVisibility,
    );
  }
}
