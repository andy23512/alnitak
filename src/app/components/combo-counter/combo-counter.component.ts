import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  input,
} from '@angular/core';
import { rank, temperatureToColor } from 'src/app/utils/color.utils';

@Component({
  selector: 'app-combo-counter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './combo-counter.component.html',
  styleUrl: './combo-counter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComboCounterComponent {
  readonly combo = input.required<number>();

  @HostBinding('class') hostClasses =
    'text-center transition-[font-size] ease-[cubic-bezier(0.34,1.56,0.64,1)]';
  @HostBinding('style.font-size') get fontSize() {
    const combo = this.combo();
    return 1 + rank(combo) * 0.2 + 'em';
  }
  @HostBinding('style.color') get color() {
    const mockC = this.combo();
    return temperatureToColor(mockC * 100);
  }
}
