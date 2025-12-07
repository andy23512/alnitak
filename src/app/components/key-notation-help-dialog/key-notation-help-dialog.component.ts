import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { KeyLabelType, Layer } from 'src/app/models/device-layout.models';
import { RealTitleCasePipe } from 'src/app/pipes/real-title-case.pipe';
import { LayoutComponent } from '../layout/layout.component';

@Component({
  selector: 'app-key-notation-help-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButton,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    LayoutComponent,
    TranslatePipe,
    RealTitleCasePipe,
  ],
  templateUrl: './key-notation-help-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KeyNotationHelpDialogComponent {
  Layer = Layer;
  KeyLabelType = KeyLabelType;
}
