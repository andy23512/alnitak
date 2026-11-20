import { AsyncPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressBar } from '@angular/material/progress-bar';
import { HotkeysService } from '@ngneat/hotkeys';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { HOTKEY_DIALOG_ID } from './components/hotkey-dialog/hotkey-dialog.const';
import { NavComponent } from './components/nav/nav.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [NavComponent, MatProgressBar, AsyncPipe],
})
export class AppComponent implements OnInit {
  private readonly matDialog = inject(MatDialog);
  private readonly hotkeysService = inject(HotkeysService);
  public readonly loader = inject(LoadingBarService);

  ngOnInit(): void {
    this.hotkeysService.addShortcut({ keys: 'shift.?' }).subscribe(() => {
      void this.toggleHotkeyDialog();
    });
  }

  /** Asks the dialog service, so it does not matter how the dialog was opened or closed. */
  private async toggleHotkeyDialog() {
    const opened = this.matDialog.getDialogById(HOTKEY_DIALOG_ID);
    if (opened) {
      opened.close();
      return;
    }
    const { HotkeyDialogComponent } =
      await import('./components/hotkey-dialog/hotkey-dialog.component');
    // The shortcut may have been pressed again while the dialog was loading.
    if (this.matDialog.getDialogById(HOTKEY_DIALOG_ID)) {
      return;
    }
    this.matDialog.open(HotkeyDialogComponent, { id: HOTKEY_DIALOG_ID });
  }
}
