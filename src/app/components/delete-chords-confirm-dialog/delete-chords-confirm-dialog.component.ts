import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
} from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { RealTitleCasePipe } from 'src/app/pipes/real-title-case.pipe';

@Component({
  selector: 'app-delete-chords-confirm-dialog',
  standalone: true,
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButton,
    TranslatePipe,
    RealTitleCasePipe,
  ],
  templateUrl: './delete-chords-confirm-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteChordsConfirmDialogComponent {}
