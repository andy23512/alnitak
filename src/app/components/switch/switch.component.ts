import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { DirectionMap } from 'src/app/models/layout.models';
import { SwitchSectorComponent } from '../switch-sector/switch-sector.component';

function sin(deg: number) {
  return Math.sin((deg / 180) * Math.PI);
}

function cos(deg: number) {
  return Math.cos((deg / 180) * Math.PI);
}
const o = 8;
const r1 = 57;
const r2 = 167;

@Component({
  selector: 'app-switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SwitchSectorComponent],
  standalone: true,
})
export class SwitchComponent {
  readonly rotationDirection = input.required<'cw' | 'ccw'>();
  readonly rotation = input<number>(0);
  readonly positionCodeMap = input.required<DirectionMap<number>>();
  sectors: { direction: 'n' | 'e' | 's' | 'w'; degree: number }[] = [
    { direction: 'n', degree: 270 },
    { direction: 'e', degree: 0 },
    { direction: 's', degree: 90 },
    { direction: 'w', degree: 180 },
  ];
  readonly keyLabelMap = input<Record<number, string>>({});
  readonly r = computed(() => {
    return (this.rotationDirection() === 'cw' ? 1 : -1) * this.rotation();
  });
}
