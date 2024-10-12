import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { KeyLabelType, Layer } from 'src/app/models/device-layout.models';
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
  ],
  templateUrl: './key-notation-help-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KeyNotationHelpDialogComponent {
  Layer = Layer;
  KeyLabelType = KeyLabelType;
}
