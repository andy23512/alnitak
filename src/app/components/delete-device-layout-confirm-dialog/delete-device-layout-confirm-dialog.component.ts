import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { RealTitleCasePipe } from 'src/app/pipes/real-title-case.pipe';

@Component({
  selector: 'app-delete-device-layout-confirm-dialog',
  templateUrl: 'delete-device-layout-confirm-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, TranslatePipe, RealTitleCasePipe],
})
export class DeleteDeviceLayoutConfirmDialogComponent {
  data: { deviceLayoutName: string } = inject(MAT_DIALOG_DATA);
}
