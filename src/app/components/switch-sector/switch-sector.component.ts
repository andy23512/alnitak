import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import {
  CharaChorderOneCharacterKeyWithPositionCodesAndScore,
  CharaChorderOneKeyLabel,
} from 'src/app/models/device-layout.models';
import { cos, sin } from 'src/app/utils/math.utils';

const o = 8;
const r1 = 65;
const r2 = 175;
const alpha1 = (Math.asin(((o / 2) * Math.SQRT2) / r1) / Math.PI) * 180;
const alpha2 = (Math.asin(((o / 2) * Math.SQRT2) / r2) / Math.PI) * 180;

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
  readonly keyLabel = input<CharaChorderOneKeyLabel[]>([]);
  readonly highlightKey =
    input<CharaChorderOneCharacterKeyWithPositionCodesAndScore | null>(null);

  readonly sectorPath = computed(() => {
    const center = this.center();
    const direction = this.direction();
    const d = this.degree();
    const cx = center.x;
    const cy = center.y;
    const dStart = d - 45;
    const dEnd = d + 45;
    const beta1Start = dStart + alpha1;
    const beta1End = dEnd - alpha1;
    const beta2Start = dStart + alpha2;
    const beta2End = dEnd - alpha2;
    if (direction === 'cw') {
      return `
        M ${cx + r1 * cos(beta1Start)} ${cy + r1 * sin(beta1Start)}
        A ${r1} ${r1} 0 0 1 ${cx + r1 * cos(beta1End)} ${cy + r1 * sin(beta1End)}
        L ${cx + r2 * cos(beta2End)} ${cy + r2 * sin(beta2End)}
        A ${r2} ${r2} 0 0 0 ${cx + r2 * cos(beta2Start)} ${cy + r2 * sin(beta2Start)}
      `;
    } else {
      return `
        M ${cx + r1 * cos(beta1End)} ${cy + r1 * sin(beta1End)}
        A ${r1} ${r1} 0 0 0 ${cx + r1 * cos(beta1Start)} ${cy + r1 * sin(beta1Start)}
        L ${cx + r2 * cos(beta2Start)} ${cy + r2 * sin(beta2Start)}
        A ${r2} ${r2} 0 0 1 ${cx + r2 * cos(beta2End)} ${cy + r2 * sin(beta2End)}
      `;
    }
  });

  textRadius = (() => {
    return (r1 + r2) / 2;
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
