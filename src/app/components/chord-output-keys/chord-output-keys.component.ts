import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  input,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { ChordKey } from 'src/app/models/chord.models';

@Component({
  selector: 'app-chord-output-keys',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './chord-output-keys.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChordOutputKeysComponent {
  keys = input.required<ChordKey[]>();

  @HostBinding('class') hostClasses = ['inline-flex', 'align-center'];
}
