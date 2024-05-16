import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  input,
} from '@angular/core';
import { MatOption, MatSelect } from '@angular/material/select';
import { PreferSides } from '../../models/highlight-setting.models';

@Component({
  selector: 'app-sides-dropdown',
  standalone: true,
  imports: [MatSelect, MatOption],
  templateUrl: './sides-dropdown.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidesDropdownComponent {
  value = input.required<PreferSides>();

  @Output() select = new EventEmitter<PreferSides>();
}
