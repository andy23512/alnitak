import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  inject,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
} from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { patchState } from '@ngrx/signals';
import { removeAllEntities } from '@ngrx/signals/entities';
import { AirModeSettingPanelContentComponent } from 'src/app/components/air-mode-setting-panel-content/air-mode-setting-panel-content.component';
import { DeleteChordsConfirmDialogComponent } from 'src/app/components/delete-chords-confirm-dialog/delete-chords-confirm-dialog.component';
import { DeviceLayoutSettingPanelContentComponent } from 'src/app/components/device-layout-setting-panel-content/device-layout-setting-panel-content.component';
import { IconGuardPipe } from 'src/app/pipes/icon-guard.pipe';
import { ChordStore } from 'src/app/stores/chord.store';
import { LayoutHighlightSettingPanelContentComponent } from '../../components/layout-highlight-setting-panel-content/layout-highlight-setting-panel-content.component';
import { VisibilitySettingPanelContentComponent } from '../../components/visibility-setting-panel-content/visibility-setting-panel-content.component';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatButton,
    MatIcon,
    VisibilitySettingPanelContentComponent,
    LayoutHighlightSettingPanelContentComponent,
    DeviceLayoutSettingPanelContentComponent,
    AirModeSettingPanelContentComponent,
    IconGuardPipe,
  ],
  templateUrl: './settings-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPageComponent {
  private matDialog = inject(MatDialog);
  private matSnackBar = inject(MatSnackBar);
  private chordStore = inject(ChordStore);

  @HostBinding('class') classes = 'block p-5';

  openDeleteChordsConfirmDialog() {
    this.matDialog
      .open(DeleteChordsConfirmDialogComponent)
      .afterClosed()
      .subscribe((response) => {
        if (response.confirmed) {
          patchState(this.chordStore, removeAllEntities());
          this.matSnackBar.open(
            'All imported chords has been deleted.',
            undefined,
            { duration: 2000 },
          );
        }
      });
  }
}
