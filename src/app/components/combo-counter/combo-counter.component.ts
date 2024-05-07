import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  input,
} from '@angular/core';
import { temperatureToColor } from 'src/app/utils/color.utils';
import { SevenSegmentComponent } from '../seven-segment/seven-segment.component';

@Component({
  selector: 'app-combo-counter',
  standalone: true,
  imports: [CommonModule, SevenSegmentComponent],
  templateUrl: './combo-counter.component.html',
  styleUrl: './combo-counter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComboCounterComponent {
  readonly combo = input.required<number>();

  @HostBinding('class') hostClasses = 'text-left';
  @HostBinding('style.color') get color() {
    const c = this.combo();
    return temperatureToColor(c * 100);
  }
}
