import { UpperCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  input,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { PARAMETER } from 'src/app/data/parameters';
import { temperatureToColor } from 'src/app/utils/color.utils';
import { SevenSegmentComponent } from '../seven-segment/seven-segment.component';

@Component({
  selector: 'app-combo-counter',
  standalone: true,
  imports: [SevenSegmentComponent, UpperCasePipe, TranslatePipe],
  templateUrl: './combo-counter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComboCounterComponent {
  readonly combo = input.required<number>();

  @HostBinding('class') hostClasses = 'text-left';
  @HostBinding('style.color') get color() {
    const combo = this.combo();
    return temperatureToColor(combo / PARAMETER.ComboHeatCapacity);
  }
}
