import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogContent } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-chords-confirm-dialog',
  standalone: true,
  imports: [MatDialogContent, MatDialogActions, MatDialogClose, MatButton],
  templateUrl: './delete-chords-confirm-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteChordsConfirmDialogComponent {}
