import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  ViewChild,
  inject,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatOption, MatSelect } from '@angular/material/select';
import { patchState } from '@ngrx/signals';
import { addEntity } from '@ngrx/signals/entities';
import { IconGuardPipe } from 'src/app/pipes/icon-guard.pipe';
import { DeviceLayoutStore } from 'src/app/stores/device-layout.store';

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
  ],
  templateUrl: './device-layout-setting-panel-content.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceLayoutSettingPanelContentComponent {
  private deviceLayoutStore = inject(DeviceLayoutStore);
  public selectedDeviceLayoutId = this.deviceLayoutStore.selectedId;
  public deviceLayouts = this.deviceLayoutStore.entities;

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
            item.type === 'layout' && ['One', 'TWO'].includes(item.device),
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
