import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  OnInit,
  input,
  signal,
} from '@angular/core';
import { interval } from 'rxjs';
import { temperatureToColor } from 'src/app/utils/color.utils';
import { SevenSegmentComponent } from '../seven-segment/seven-segment.component';

const r1 = 80;
const r2 = 95;

function sin(deg: number) {
  return Math.sin((deg / 180) * Math.PI);
}

function cos(deg: number) {
  return Math.cos((deg / 180) * Math.PI);
}

@Component({
  selector: 'app-speedometer',
  standalone: true,
  imports: [CommonModule, SevenSegmentComponent],
  templateUrl: './speedometer.component.html',
  styleUrl: './speedometer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpeedometerComponent implements OnInit {
  public speed = input.required<number>();
  public speedUnit = input.required<string>();
  public displaySpeed = signal<number>(0);
  public maxSpeed = 200;

  public sectorNumber = 45;
  public gapDeg = 1;
  public sectorDeg = (90 - 1 * (this.sectorNumber - 1)) / this.sectorNumber;
  sectors = Array.from({ length: this.sectorNumber }).map((_, i) => ({
    index: i,
    degFrom: i * (this.sectorDeg + this.gapDeg),
    degTo: i * (this.sectorDeg + this.gapDeg) + this.sectorDeg,
  }));

  ngOnInit(): void {
    interval(100).subscribe(() => {
      const speed = this.speed();
      const displaySpeed = this.displaySpeed();
      const diff = speed - displaySpeed;
      this.displaySpeed.set(displaySpeed + Math.max(Math.min(diff, 2), -2));
    });
  }

  d({ degFrom, degTo }: { degFrom: number; degTo: number }) {
    const cx = 100;
    const cy = 100;
    return [
      `M ${cx - r1 * cos(degFrom)} ${cy - r1 * sin(degFrom)}`,
      `A ${r1} ${r1} 0 0 1 ${cx - r1 * cos(degTo)} ${cy - r1 * sin(degTo)}`,
      `L ${cx - r2 * cos(degTo)} ${cy - r2 * sin(degTo)}`,
      `A ${r2} ${r2} 0 0 0 ${cx - r2 * cos(degFrom)} ${cy - r2 * sin(degFrom)}`,
      `Z`,
    ].join(' ');
  }

  fill(index: number) {
    return temperatureToColor((20000 / this.sectorNumber) * index);
  }

  opacity(index: number) {
    const displaySpeed = this.displaySpeed();
    return displaySpeed / this.maxSpeed > (index + 1) / this.sectorNumber
      ? 1
      : 0;
  }

  @HostBinding('style.color') get color() {
    const displaySpeed = this.displaySpeed();
    return temperatureToColor(20000 * (displaySpeed / this.maxSpeed));
  }
}
