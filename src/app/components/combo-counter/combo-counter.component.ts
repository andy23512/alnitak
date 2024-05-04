import { MediaMatcher } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  OnDestroy,
  OnInit,
  inject,
  input,
  signal,
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
export class ComboCounterComponent implements OnInit, OnDestroy {
  readonly combo = input.required<number>();
  readonly noAnimation = signal(false);
  mediaQuery!: MediaQueryList;

  @HostBinding('class') hostClasses =
    'text-center transition-[font-size] ease-[cubic-bezier(0.34,1.56,0.64,1)]';
  @HostBinding('style.font-size') get fontSize() {
    if (this.noAnimation()) {
      return '1em';
    }
    const combo = this.combo();
    return 1 + rank(combo) * 0.2 + 'em';
  }
  @HostBinding('style.color') get color() {
    const mockC = this.combo();
    return temperatureToColor(mockC * 100);
  }

  mediaMatcher = inject(MediaMatcher);

  ngOnInit(): void {
    this.mediaQuery = this.mediaMatcher.matchMedia(
      '(prefers-reduced-motion: reduce)',
    );
    this.detectReducedMotion();
    this.mediaQuery.addEventListener('change', this.detectReducedMotion);
  }

  ngOnDestroy(): void {
    this.mediaQuery.removeEventListener('change', this.detectReducedMotion);
  }

  detectReducedMotion = () => {
    this.noAnimation.set(!!this.mediaQuery.matches);
  };
}
