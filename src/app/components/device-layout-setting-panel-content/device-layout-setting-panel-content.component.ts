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
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { patchState } from '@ngrx/signals';
import { removeEntity } from '@ngrx/signals/entities';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { IconGuardPipe } from 'src/app/pipes/icon-guard.pipe';
import { RealTitleCasePipe } from 'src/app/pipes/real-title-case.pipe';
import { SerialHandlerService } from 'src/app/services/serial-handler.service';
import { DeviceLayoutStore } from 'src/app/stores/device-layout.store';
import { LanguageSettingStore } from 'src/app/stores/language-setting.store';
import { dateToString } from 'src/app/utils/date.utils';
import { DeleteDeviceLayoutConfirmDialogComponent } from '../delete-device-layout-confirm-dialog/delete-device-layout-confirm-dialog.component';
import { DeviceLayoutImportDialogComponent } from '../device-layout-import-dialog/device-layout-import-dialog.component';

@Component({
  selector: 'app-device-layout-setting-panel-content',
  standalone: true,
  imports: [
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    IconGuardPipe,
    TranslatePipe,
    RealTitleCasePipe,
    MatTooltipModule,
  ],
  templateUrl: './device-layout-setting-panel-content.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceLayoutSettingPanelContentComponent {
  private readonly deviceLayoutStore = inject(DeviceLayoutStore);
  private readonly translateService = inject(TranslateService);
  private readonly languageSettingStore = inject(LanguageSettingStore);
  private readonly matDialog = inject(MatDialog);
  private readonly matSnackBar = inject(MatSnackBar);
  private readonly serialHandlerService = inject(SerialHandlerService);

  public isWebSerialApiSupported = 'serial' in navigator;
  public selectedDeviceLayoutId = this.deviceLayoutStore.selectedId;
  public deviceLayouts = this.deviceLayoutStore.entities;
  public cc1cc2DefaultLayoutName = toSignal(
    this.translateService.stream('device-layout.cc1-cc2-default'),
  );
  public m4gDefaultLayoutName = toSignal(
    this.translateService.stream('device-layout.m4g-default'),
  );
  public cc1cc2RightHandOnlyLayoutName = toSignal(
    this.translateService.stream('device-layout.cc1-cc2-right-hand-only'),
  );
  public cc1cc2LeftHandOnlyLayoutName = toSignal(
    this.translateService.stream('device-layout.cc1-cc2-left-hand-only'),
  );
  public translatedDeviceLayouts = computed(() => {
    const _ = this.languageSettingStore.uiLanguage();
    const deviceLayouts = this.deviceLayouts();
    const cc1cc2DefaultLayoutName = this.cc1cc2DefaultLayoutName();
    const m4gDefaultLayoutName = this.m4gDefaultLayoutName();
    const cc1cc2RightHandOnlyLayoutName = this.cc1cc2RightHandOnlyLayoutName();
    const cc1cc2LeftHandOnlyLayoutName = this.cc1cc2LeftHandOnlyLayoutName();
    return deviceLayouts.map((deviceLayout) => ({
      ...deviceLayout,
      name:
        'default' === deviceLayout.id
          ? cc1cc2DefaultLayoutName
          : 'm4g-default' === deviceLayout.id
            ? m4gDefaultLayoutName
            : 'cc1-cc2-right-hand-only' === deviceLayout.id
              ? cc1cc2RightHandOnlyLayoutName
              : 'cc1-cc2-left-hand-only' === deviceLayout.id
                ? cc1cc2LeftHandOnlyLayoutName
                : deviceLayout.name,
    }));
  });
  public delayedSelectedDeviceLayoutId = computed(() => {
    const _ = this.translatedDeviceLayouts();
    return this.selectedDeviceLayoutId();
  });
  public selectedDeviceLayoutIsDefault = computed(() => {
    const selectedId = this.selectedDeviceLayoutId();
    return (
      'default' === selectedId ||
      'm4g-default' === selectedId ||
      'cc1-cc2-right-hand-only' === selectedId ||
      'cc1-cc2-left-hand-only' === selectedId
    );
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
            ['One', 'ONE', 'TWO', 'M4G'].includes(item.device),
        );
      } else {
        layoutItem = data;
      }
      if (!layoutItem) {
        return;
      }
      this.matDialog
        .open(DeviceLayoutImportDialogComponent, {
          data: {
            fileName: file.name,
            layout: layoutItem.layout,
          },
          width: '400px',
        })
        .afterClosed()
        .subscribe(() => {
          this.fileInput.nativeElement.value = '';
        });
    };

    reader.readAsText(fileInputElement.files[0]);
  }

  public async loadDeviceLayoutFromDevice() {
    const { id } = await this.serialHandlerService.connect();
    const layout = await this.serialHandlerService.loadLayout();
    await this.serialHandlerService.disconnect();
    const date = new Date();
    this.matDialog.open(DeviceLayoutImportDialogComponent, {
      data: {
        fileName: `${id}_${dateToString(date)}`,
        layout,
      },
      width: '400px',
    });
  }

  setSelectedDeviceLayoutId(deviceLayoutId: string) {
    this.deviceLayoutStore.setSelectedId(deviceLayoutId);
  }

  onDownloadDeviceLayoutButtonClick(event: MouseEvent) {
    event.stopPropagation();
    const selectedDeviceLayout = this.deviceLayoutStore.selectedEntity();
    if (selectedDeviceLayout) {
      const blob = new Blob(
        [
          JSON.stringify({
            charaVersion: 1,
            type: 'layout',
            device: 'TWO',
            layout: selectedDeviceLayout.layout,
          }),
        ],
        {
          type: 'application/json',
        },
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedDeviceLayout.name.replace(/\.json$/, '')}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }

  onDeleteDeviceLayoutButtonClick(event: MouseEvent) {
    event.stopPropagation();
    const selectedDeviceLayout = this.deviceLayoutStore.selectedEntity();
    if (selectedDeviceLayout && !this.selectedDeviceLayoutIsDefault()) {
      this.matDialog
        .open(DeleteDeviceLayoutConfirmDialogComponent, {
          data: { deviceLayoutName: selectedDeviceLayout.name },
        })
        .afterClosed()
        .subscribe((response) => {
          if (response.confirmed) {
            patchState(
              this.deviceLayoutStore,
              removeEntity(selectedDeviceLayout.id),
            );
            this.deviceLayoutStore.setSelectedId('default');
            this.matSnackBar.open(
              this.translateService.instant(
                'settings.device-layout.single-device-layout-deleted-message',
                { deviceLayoutName: selectedDeviceLayout.name },
              ),
              undefined,
              { duration: 2000 },
            );
          }
        });
    }
  }
}
