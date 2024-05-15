import { Component, OnInit, inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HotkeysService } from '@ngneat/hotkeys';
import { HotkeyDialogComponent } from './components/hotkey-dialog/hotkey-dialog.component';
import { NavComponent } from './nav/nav.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [NavComponent],
})
export class AppComponent implements OnInit {
  private readonly matDialog = inject(MatDialog);
  private readonly hotkeysService = inject(HotkeysService);

  private hotkeyDialogRef: MatDialogRef<HotkeyDialogComponent> | null = null;

  ngOnInit(): void {
    this.hotkeysService.addShortcut({ keys: 'shift.?' }).subscribe(() => {
      if (!this.hotkeyDialogRef) {
        this.hotkeyDialogRef = this.matDialog.open(HotkeyDialogComponent);
        return;
      }
      this.hotkeyDialogRef.close();
      this.hotkeyDialogRef = null;
    });
  }
}
