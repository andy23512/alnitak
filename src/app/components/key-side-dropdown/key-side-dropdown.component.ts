import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  input,
} from '@angular/core';
import { MatOption, MatSelect } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';
import { PreferKeySide } from 'src/app/models/highlight-setting.models';

@Component({
  selector: 'app-key-side-dropdown',
  standalone: true,
  imports: [MatSelect, MatOption, TranslatePipe],
  templateUrl: './key-side-dropdown.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KeySideDropdownComponent {
  value = input.required<PreferKeySide>();

  @Output() select = new EventEmitter<PreferKeySide>();
}
