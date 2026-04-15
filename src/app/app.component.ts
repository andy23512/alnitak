import { AsyncPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatProgressBar } from '@angular/material/progress-bar';
import { HotkeysService } from '@ngneat/hotkeys';
import { LoadingBarService } from '@ngx-loading-bar/core';
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

  private hotkeyDialogRef: MatDialogRef<unknown> | null = null;

  ngOnInit(): void {
    this.hotkeysService.addShortcut({ keys: 'shift.?' }).subscribe(() => {
      void this.toggleHotkeyDialog();
    });
  }

  private async toggleHotkeyDialog() {
    if (!this.hotkeyDialogRef) {
      const { HotkeyDialogComponent } = await import(
        './components/hotkey-dialog/hotkey-dialog.component'
      );
      this.hotkeyDialogRef = this.matDialog.open(HotkeyDialogComponent);
      return;
    }
    this.hotkeyDialogRef.close();
    this.hotkeyDialogRef = null;
  }
}
