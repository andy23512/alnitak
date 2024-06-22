import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import {
  HighlightKeyCombination,
  KeyLabel,
} from 'src/app/models/device-layout.models';

@Component({
  selector: '[appKeyLabel]',
  standalone: true,
  templateUrl: './key-label.component.html',
  styleUrl: './key-label.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KeyLabelComponent {
  readonly x = input.required<number>();
  readonly y = input.required<number>();
  readonly highlightKeyCombination = input<HighlightKeyCombination | null>(
    null,
  );
  readonly labels = input.required<KeyLabel[]>();
}
