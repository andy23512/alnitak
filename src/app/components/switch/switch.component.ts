import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import {
  HighlightKeyCombination,
  KeyLabel,
} from 'src/app/models/device-layout.models';
import { DirectionMap } from 'src/app/models/layout.models';
import { SwitchSectorComponent } from '../switch-sector/switch-sector.component';

@Component({
  selector: '[appSwitch]',
  standalone: true,
  imports: [CommonModule, SwitchSectorComponent],
  templateUrl: './switch.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SwitchComponent {
  readonly center = input.required<{ x: number; y: number }>();
  readonly rotationDirection = input.required<'cw' | 'ccw'>();
  readonly rotation = input<number>(0);
  sectors: { direction: 'n' | 'e' | 's' | 'w'; degree: number }[] = [
    { direction: 'n', degree: 270 },
    { direction: 'e', degree: 0 },
    { direction: 's', degree: 90 },
    { direction: 'w', degree: 180 },
  ];
  readonly positionCodeMap = input.required<DirectionMap<number>>();
  readonly keyLabelMap = input<Record<number, KeyLabel[]>>({});
  readonly highlightKeyCombination =
    input<HighlightKeyCombination | null>(null);
  readonly r = computed(() => {
    return (this.rotationDirection() === 'cw' ? 1 : -1) * this.rotation();
  });
}
