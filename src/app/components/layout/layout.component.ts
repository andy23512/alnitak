import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { POSITION_CODE_LAYOUT } from 'src/app/data/layouts';
import { VisibleDirective } from 'src/app/directives/visible.directive';
import {
  HighlightKeyCombination,
  KeyLabel,
} from 'src/app/models/device-layout.models';
import { FingerMap, HandMap } from 'src/app/models/layout.models';
import { MiscSettingStore } from 'src/app/stores/misc-setting.store';
import {
  convertPositionCodeToKeyNotation,
  convertPositionCodeToText,
} from 'src/app/utils/layout.utils';
import { SwitchComponent } from '../switch/switch.component';
const cellSize = 350;
const gap = 35;
const gridColumns = 10;

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [SwitchComponent, VisibleDirective],
  templateUrl: './layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {
  public showThumb3Switch = input<boolean>(true);
  public alwaysShowLayout = input<boolean>(false);
  public alwaysHideLayoutGuides = input<boolean>(false);
  public gridRows = computed(() => {
    const showThumb3Switch = this.showThumb3Switch();
    return showThumb3Switch ? 5 : 4;
  });
  public viewBoxWidth = cellSize * gridColumns + gap * (gridColumns - 1);
  public viewBoxHeight = computed(() => {
    const gridRows = this.gridRows();
    return cellSize * gridRows + gap * (gridRows - 1);
  });
  readonly keyLabelMap = input<Record<number, KeyLabel[]>>({});
  readonly highlightKeyCombination = input<HighlightKeyCombination | null>(
    null,
  );
  readonly secondaryHighlightPositions = input<number[]>([]);
  readonly translateService = inject(TranslateService);

  readonly highlightKeyCombinationInText = computed(() => {
    const highlightKeyCombination = this.highlightKeyCombination();
    if (!highlightKeyCombination) {
      return '';
    }
    return [...highlightKeyCombination.positionCodes]
      .reverse()
      .map((positionCode) =>
        convertPositionCodeToText(positionCode, this.translateService),
      )
      .join(' + ');
  });

  readonly highlightKeyCombinationInKeyNotation = computed(() => {
    const highlightKeyCombination = this.highlightKeyCombination();
    if (!highlightKeyCombination) {
      return '';
    }
    return [...highlightKeyCombination.positionCodes]
      .reverse()
      .map(convertPositionCodeToKeyNotation)
      .join(' ');
  });

  readonly positionCodeLayout = POSITION_CODE_LAYOUT;
  readonly switches = computed(() => {
    const showThumb3Switch = this.showThumb3Switch();
    if (showThumb3Switch) {
      return [
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
    }
    return [
      'thumbMid',
      'thumbTip',
      'index',
      'middle',
      'middleMid',
      'ring',
      'ringMid',
      'little',
    ] as const;
  });
  sides = ['left', 'right'] as const;
  miscSettingStore = inject(MiscSettingStore);

  thumbRotationAngle = computed(() =>
    this.miscSettingStore.thumbRotationAngle(),
  );
  nonThumbRotationAngle = computed(() =>
    this.miscSettingStore.nonThumbRotationAngle(),
  );

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
      position.x = this.viewBoxWidth - position.x;
    }
    return position;
  }
}
