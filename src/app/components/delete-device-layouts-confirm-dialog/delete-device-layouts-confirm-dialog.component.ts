import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';

@Component({
  selector: 'app-delete-device-layouts-confirm-dialog',
  templateUrl: 'delete-device-layouts-confirm-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatDialogContent, MatDialogActions, MatDialogClose, MatButton],
})
export class DeleteDeviceLayoutsConfirmDialogComponent {}
