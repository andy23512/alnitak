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
import { KeyLabelComponent } from '../key-label/key-label.component';
import { SwitchSectorComponent } from '../switch-sector/switch-sector.component';

@Component({
  selector: '[appSwitch]',
  standalone: true,
  imports: [SwitchSectorComponent, KeyLabelComponent],
  templateUrl: './switch.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SwitchComponent {
  readonly fontSize = input<number>(90);
  readonly center = input.required<{ x: number; y: number }>();
  readonly rotationDirection = input.required<'cw' | 'ccw'>();
  readonly rotation = input<number>(0);
  readonly highlightOpacity = input<number>(0.5);
  readonly strokeWidth = input<number>(1);
  sectors: { direction: 'n' | 'e' | 's' | 'w'; degree: number }[] = [
    { direction: 'n', degree: 270 },
    { direction: 'e', degree: 0 },
    { direction: 's', degree: 90 },
    { direction: 'w', degree: 180 },
  ];
  readonly positionCodeMap = input.required<DirectionMap<number>>();
  readonly keyLabelMap = input<Record<number, KeyLabel[]>>({});
  readonly highlightKeyCombination = input<HighlightKeyCombination | null>(
    null,
  );
  readonly r = computed(() => {
    return (this.rotationDirection() === 'cw' ? 1 : -1) * this.rotation();
  });
}
