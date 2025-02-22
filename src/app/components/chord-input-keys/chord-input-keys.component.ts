import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { ChordKey } from 'src/app/models/chord.models';
import { IconGuardPipe } from 'src/app/pipes/icon-guard.pipe';

@Component({
  selector: 'app-chord-input-keys',
  standalone: true,
  imports: [MatIcon, IconGuardPipe],
  templateUrl: './chord-input-keys.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChordInputKeysComponent {
  keys = input.required<ChordKey[]>();
}
