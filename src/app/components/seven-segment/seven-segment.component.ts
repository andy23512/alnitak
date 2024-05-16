import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  computed,
  input,
} from '@angular/core';

@Component({
  selector: 'app-seven-segment',
  standalone: true,
  templateUrl: './seven-segment.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SevenSegmentComponent {
  number = input<number>(0);
  minDigit = input<number>(3);

  displayNumber = computed(() =>
    this.number().toString().padStart(this.minDigit(), ' '),
  );
  backgroundNumber = computed(() =>
    '8'.repeat(Math.max(this.number().toString().length, this.minDigit())),
  );

  @HostBinding('class') hostClass = 'relative block';
}
