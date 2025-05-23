import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import {
  HighlightKeyCombination,
  KeyLabel,
  KeyLabelType,
} from 'src/app/models/device-layout.models';

@Component({
  selector: '[appKeyLabel]',
  standalone: true,
  templateUrl: './key-label.component.html',
  styleUrl: './key-label.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatTooltip, NgClass],
})
export class KeyLabelComponent {
  readonly x = input.required<number>();
  readonly y = input.required<number>();
  readonly fontSize = input<number>(80);
  readonly highlightKeyCombination = input<HighlightKeyCombination | null>(
    null,
  );
  readonly labels = input.required<KeyLabel[]>();
  KeyLabelType = KeyLabelType;

  public isLabelActive(label: KeyLabel) {
    const highlightKeyCombination = this.highlightKeyCombination();
    return (
      highlightKeyCombination &&
      ((label.layer === highlightKeyCombination.layer &&
        label.shiftKey === highlightKeyCombination.shiftKey &&
        label.altGraphKey === highlightKeyCombination.altGraphKey) ||
        label.layer === null)
    );
  }

  public getFontSize({ type, c }: KeyLabel) {
    const fontSize = this.fontSize();
    switch (type) {
      case KeyLabelType.String:
        if (c.length > 2) {
          return fontSize * 0.6;
        }
        if (c.length > 1) {
          return fontSize * 0.8;
        }
        return fontSize;
      case KeyLabelType.ActionCode:
        return fontSize * 0.6;
      case KeyLabelType.Icon:
      case KeyLabelType.Logo:
        return fontSize * 0.8;
      default:
        const _: never = type;
        throw new Error(`Unhandled key label type case: ${type}`);
    }
  }
}
