import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

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
  selector: '[appSwitchSector]',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './switch-sector.component.html',
  styleUrl: './switch-sector.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SwitchSectorComponent {
  readonly center = input.required<{ x: number; y: number }>();
  readonly direction = input.required<'cw' | 'ccw'>();
  readonly degree = input.required<number>();
  readonly positionCode = input.required<number>();
  readonly keyLabel = input<string>('');
  readonly highlight = input<boolean>(false);

  readonly sectorPath = computed(() => {
    const center = this.center();
    const direction = this.direction();
    const d = this.degree();
    const cx = center.x + o * cos(d);
    const cy = center.y + o * sin(d);
    if (direction === 'cw') {
      return [
        `M ${cx + r1 * cos(d - 45)} ${cy + r1 * sin(d - 45)}`,
        `A ${r1} ${r1} 0 0 1 ${cx + r1 * cos(d + 45)} ${cy + r1 * sin(d + 45)}`,
        `L ${cx + r2 * cos(d + 45)} ${cy + r2 * sin(d + 45)}`,
        `A ${r2} ${r2} 0 0 0 ${cx + r2 * cos(d - 45)} ${cy + r2 * sin(d - 45)}`,
      ].join(' ');
    } else {
      return [
        `M ${cx + r1 * cos(d + 45)} ${cy + r1 * sin(d + 45)}`,
        `A ${r1} ${r1} 0 0 0 ${cx + r1 * cos(d - 45)} ${cy + r1 * sin(d - 45)}`,
        `L ${cx + r2 * cos(d - 45)} ${cy + r2 * sin(d - 45)}`,
        `A ${r2} ${r2} 0 0 1 ${cx + r2 * cos(d + 45)} ${cy + r2 * sin(d + 45)}`,
      ].join(' ');
    }
  });

  textRadius = (() => {
    const ratio = 0.55;
    return (1 - ratio) * r1 + ratio * r2;
  })();

  readonly textX = computed(() => {
    const d = this.degree();
    const center = this.center();
    return center.x + this.textRadius * cos(d);
  });
  readonly textY = computed(() => {
    const d = this.degree();
    const center = this.center();
    return center.y + this.textRadius * sin(d);
  });
}
