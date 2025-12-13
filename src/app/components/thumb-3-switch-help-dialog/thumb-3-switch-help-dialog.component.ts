import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { RealTitleCasePipe } from 'src/app/pipes/real-title-case.pipe';

@Component({
  selector: 'app-thumb-3-switch-help-dialog',
  standalone: true,
  templateUrl: './thumb-3-switch-help-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButton,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    TranslatePipe,
    RealTitleCasePipe,
  ],
})
export class Thumb3SwitchHelpDialogComponent {}
