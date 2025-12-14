import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialog } from '@angular/material/dialog';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { patchState } from '@ngrx/signals';
import { removeAllEntities } from '@ngrx/signals/entities';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AirModeSettingPanelContentComponent } from 'src/app/components/air-mode-setting-panel-content/air-mode-setting-panel-content.component';
import { DeleteChordsConfirmDialogComponent } from 'src/app/components/delete-chords-confirm-dialog/delete-chords-confirm-dialog.component';
import { DeleteDeviceLayoutsConfirmDialogComponent } from 'src/app/components/delete-device-layouts-confirm-dialog/delete-device-layouts-confirm-dialog.component';
import { DeviceLayoutSettingPanelContentComponent } from 'src/app/components/device-layout-setting-panel-content/device-layout-setting-panel-content.component';
import { QuickSettingPanelContentComponent } from 'src/app/components/quick-setting-panel-content/quick-setting-panel-content.component';
import { UiLanguage } from 'src/app/models/language-setting.models';
import { IconGuardPipe } from 'src/app/pipes/icon-guard.pipe';
import { RealTitleCasePipe } from 'src/app/pipes/real-title-case.pipe';
import { ChordStore } from 'src/app/stores/chord.store';
import { DeviceLayoutStore } from 'src/app/stores/device-layout.store';
import { LanguageSettingStore } from 'src/app/stores/language-setting.store';
import { LayoutHighlightSettingPanelContentComponent } from '../../components/layout-highlight-setting-panel-content/layout-highlight-setting-panel-content.component';
import { MiscSettingPanelContentComponent } from '../../components/misc-setting-panel-content/misc-setting-panel-content.component';
import { VisibilitySettingPanelContentComponent } from '../../components/visibility-setting-panel-content/visibility-setting-panel-content.component';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [
    MatAccordion,
    MatButton,
    MatIcon,
    VisibilitySettingPanelContentComponent,
    LayoutHighlightSettingPanelContentComponent,
    DeviceLayoutSettingPanelContentComponent,
    AirModeSettingPanelContentComponent,
    IconGuardPipe,
    MiscSettingPanelContentComponent,
    QuickSettingPanelContentComponent,
    MatButtonToggleModule,
    FormsModule,
    TranslatePipe,
    RealTitleCasePipe,
    MatExpansionModule,
  ],
  templateUrl: './settings-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPageComponent {
  private matDialog = inject(MatDialog);
  private matSnackBar = inject(MatSnackBar);
  private chordStore = inject(ChordStore);
  private deviceLayoutStore = inject(DeviceLayoutStore);
  private translateService = inject(TranslateService);

  @HostBinding('class') classes = 'block p-5';

  public openDeleteDeviceLayoutsConfirmDialog() {
    this.matDialog
      .open(DeleteDeviceLayoutsConfirmDialogComponent)
      .afterClosed()
      .subscribe((response) => {
        if (response.confirmed) {
          this.deviceLayoutStore.load();
          this.matSnackBar.open(
            this.translateService.instant(
              'settings-page.message.device-layout-deleted',
            ),
            undefined,
            { duration: 2000 },
          );
        }
      });
  }

  openDeleteChordsConfirmDialog() {
    this.matDialog
      .open(DeleteChordsConfirmDialogComponent)
      .afterClosed()
      .subscribe((response) => {
        if (response.confirmed) {
          patchState(this.chordStore, removeAllEntities());
          this.matSnackBar.open(
            this.translateService.instant(
              'settings-page.message.chords-deleted',
            ),
            undefined,
            { duration: 2000 },
          );
        }
      });
  }

  public languageSettingStore = inject(LanguageSettingStore);

  public supportedLanguages: LanguageInfo[] = [
    { id: UiLanguage.EN, name: 'English' },
    { id: UiLanguage.ZH_TW, name: '繁體中文' },
  ];

  public setLanguage(languageId: LanguageInfo['id']) {
    this.languageSettingStore.set('uiLanguage', languageId);
    this.translateService.use(languageId);
  }
}

interface LanguageInfo {
  id: UiLanguage;
  name: string;
}
