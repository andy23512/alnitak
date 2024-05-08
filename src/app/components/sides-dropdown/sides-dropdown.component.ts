import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  input,
} from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { PreferSides } from '../../models/highlight-setting.models';

@Component({
  selector: 'app-sides-dropdown',
  standalone: true,
  imports: [CommonModule, MatSelectModule],
  templateUrl: './sides-dropdown.component.html',
  styleUrl: './sides-dropdown.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidesDropdownComponent {
  value = input.required<PreferSides>();

  @Output() select = new EventEmitter<PreferSides>();
}
