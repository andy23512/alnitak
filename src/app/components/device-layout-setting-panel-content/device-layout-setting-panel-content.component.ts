import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  ViewChild,
  computed,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatOption, MatSelect } from '@angular/material/select';
import { patchState } from '@ngrx/signals';
import { addEntity } from '@ngrx/signals/entities';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { IconGuardPipe } from 'src/app/pipes/icon-guard.pipe';
import { RealTitleCasePipe } from 'src/app/pipes/real-title-case.pipe';
import { DeviceLayoutStore } from 'src/app/stores/device-layout.store';
import { LanguageSettingStore } from 'src/app/stores/language-setting.store';

@Component({
  selector: 'app-device-layout-setting-panel-content',
  standalone: true,
  imports: [
    MatSelect,
    MatOption,
    MatFormField,
    MatButton,
    MatIcon,
    IconGuardPipe,
    TranslatePipe,
    RealTitleCasePipe,
  ],
  templateUrl: './device-layout-setting-panel-content.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceLayoutSettingPanelContentComponent {
  private deviceLayoutStore = inject(DeviceLayoutStore);
  readonly translateService = inject(TranslateService);
  readonly languageSettingStore = inject(LanguageSettingStore);
  public selectedDeviceLayoutId = this.deviceLayoutStore.selectedId;
  public deviceLayouts = this.deviceLayoutStore.entities;
  public cc1cc2DefaultLayoutName = toSignal(
    this.translateService.stream('device-layout.cc1-cc2-default'),
  );
  public m4gDefaultLayoutName = toSignal(
    this.translateService.stream('device-layout.m4g-default'),
  );
  public translatedDeviceLayouts = computed(() => {
    const _ = this.languageSettingStore.uiLanguage();
    const deviceLayouts = this.deviceLayouts();
    const cc1cc2DefaultLayoutName = this.cc1cc2DefaultLayoutName();
    const m4gDefaultLayoutName = this.m4gDefaultLayoutName();
    return deviceLayouts.map((deviceLayout) => ({
      ...deviceLayout,
      name:
        'default' === deviceLayout.id
          ? cc1cc2DefaultLayoutName
          : 'm4g-default' === deviceLayout.id
            ? m4gDefaultLayoutName
            : deviceLayout.name,
    }));
  });
  public delayedSelectedDeviceLayoutId = computed(() => {
    const _ = this.translatedDeviceLayouts();
    return this.selectedDeviceLayoutId();
  });

  @ViewChild('fileInput', { static: true })
  public fileInput!: ElementRef<HTMLInputElement>;
  @HostBinding('class') public hostClass = 'flex flex-col gap-2 items-start';

  loadDeviceLayoutFile() {
    if (typeof FileReader === 'undefined') {
      return;
    }
    const fileInputElement = this.fileInput.nativeElement;
    if (
      fileInputElement.files === null ||
      fileInputElement.files.length === 0
    ) {
      return;
    }
    const file = fileInputElement.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      if (!e.target?.result) {
        return;
      }
      const data = JSON.parse(e.target.result as string);
      if (!data) {
        return;
      }
      let layoutItem = null;
      if (data.history) {
        layoutItem = data.history[0].find(
          (item: any) =>
            item.type === 'layout' &&
            ['One', 'TWO', 'M4G'].includes(item.device),
        );
      } else {
        layoutItem = data;
      }
      if (!layoutItem) {
        return;
      }
      patchState(
        this.deviceLayoutStore,
        addEntity({
          id: file.name,
          name: file.name,
          layout: layoutItem.layout,
        }),
      );
      this.deviceLayoutStore.setSelectedId(file.name);
    };

    reader.readAsText(fileInputElement.files[0]);
  }

  setSelectedDeviceLayoutId(deviceLayoutId: string) {
    this.deviceLayoutStore.setSelectedId(deviceLayoutId);
  }
}
