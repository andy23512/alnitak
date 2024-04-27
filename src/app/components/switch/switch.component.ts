import { ChangeDetectionStrategy, Component } from '@angular/core';

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
  standalone: true,
})
export class SwitchComponent {
  public sectorPath(d: number) {
    return [
      `M ${o * cos(d) + r1 * cos(d - 45)} ${o * sin(d) + r1 * sin(d - 45)}` +
        `A ${r1} ${r1} 0 0 1 ${o * cos(d) + r1 * cos(d + 45)}
  ${o * sin(d) + r1 * sin(d + 45)}` +
        `L ${o * cos(d) + r2 * cos(d + 45)} ${o * sin(d) + r2 * sin(d + 45)}` +
        `A ${r2} ${r2} 0 0 0 ${o * cos(d) + r2 * cos(d - 45)} ${
          o * sin(d) + r2 * sin(d - 45)
        }`,
      `Z`,
    ].join(' ');
  }

  public textX(d: number) {
    return ((r1 + r2) / 2) * cos(d);
  }
  public textY(d: number) {
    return ((r1 + r2) / 2) * sin(d);
  }
}
