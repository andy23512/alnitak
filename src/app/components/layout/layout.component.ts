import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { LetDirective } from '@ngrx/component';
import { POSITION_CODE_LAYOUT } from 'src/app/data/layouts';
import { VisibleDirective } from 'src/app/directives/visible.directive';
import {
  CharaChorderOneCharacterKey,
  CharaChorderOneKeyLabel,
} from 'src/app/models/device-layout.models';
import { FingerMap, HandMap } from 'src/app/models/layout.models';
import { humanizePositionCode } from 'src/app/utils/layout.utils';
import { SwitchComponent } from '../switch/switch.component';
const cellSize = 350;
const gap = 35;

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, SwitchComponent, LetDirective, VisibleDirective],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {
  readonly keyLabelMap = input<Record<number, CharaChorderOneKeyLabel[]>>({});
  readonly highlightKey = input<CharaChorderOneCharacterKey | null>(null);

  readonly highlightPositionCodesInText = computed(() => {
    const characterKeyPositionCode =
      this.highlightKey()?.characterKeyPositionCode;
    if (!characterKeyPositionCode) {
      return '';
    }
    return [characterKeyPositionCode]
      .reverse()
      .map(humanizePositionCode)
      .join(' + ');
  });

  readonly positionCodeLayout = POSITION_CODE_LAYOUT;
  switches = [
    'thumbEnd',
    'thumbMid',
    'thumbTip',
    'index',
    'middle',
    'middleMid',
    'ring',
    'ringMid',
    'little',
  ] as const;
  sides = ['left', 'right'] as const;

  gridY(rowIndex: number) {
    return rowIndex * (cellSize + gap) + cellSize / 2;
  }

  gridX(columnIndex: number) {
    return columnIndex * (cellSize + gap) + cellSize / 2;
  }

  switchCenter(sw: keyof FingerMap<any>, side: keyof HandMap<any>) {
    let position: { x: number; y: number };
    switch (sw) {
      case 'little':
        position = { x: this.gridX(0), y: this.gridY(0.5) };
        break;
      case 'ring':
        position = { x: this.gridX(1), y: this.gridY(0) };
        break;
      case 'ringMid':
        position = { x: this.gridX(1), y: this.gridY(1) };
        break;
      case 'middle':
        position = { x: this.gridX(2), y: this.gridY(0) };
        break;
      case 'middleMid':
        position = { x: this.gridX(2), y: this.gridY(1) };
        break;
      case 'index':
        position = { x: this.gridX(3), y: this.gridY(0.5) };
        break;
      case 'thumbTip':
        position = { x: this.gridX(4) - cellSize / 4, y: this.gridY(2) };
        break;
      case 'thumbMid':
        position = { x: this.gridX(4) - cellSize / 2, y: this.gridY(3) };
        break;
      case 'thumbEnd':
        position = { x: this.gridX(4) - (cellSize * 3) / 4, y: this.gridY(4) };
        break;
    }
    if (side === 'right') {
      position.x = 3815 - position.x;
    }
    return position;
  }
}
