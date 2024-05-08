import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  input,
} from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { PreferKeySide } from 'src/app/models/highlight-setting.models';

@Component({
  selector: 'app-key-side-dropdown',
  standalone: true,
  imports: [CommonModule, MatSelectModule],
  templateUrl: './key-side-dropdown.component.html',
  styleUrl: './key-side-dropdown.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KeySideDropdownComponent {
  value = input.required<PreferKeySide>();

  @Output() select = new EventEmitter<PreferKeySide>();
}
