import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
  Signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { timer } from 'rxjs';
import { SwitchComponent } from 'src/app/components/switch/switch.component';
import {
  KeyLabel,
  KeyLabelType,
  Layer,
} from 'src/app/models/device-layout.models';

// 0: all off
// 1: scan code on, scan code output
// 2: os on, os code output
// 3: output print

interface OsLayout {
  name: string;
  keys: string[];
  isBopomofo?: boolean;
}

const OS_LAYOUTS: OsLayout[] = [
  { name: 'QWERTY', keys: ['1', 'q', 'a', 'z'] },
  { name: 'QWERTZ', keys: ['1', 'q', 'a', 'y'] },
  { name: 'JCUKEN', keys: ['1', 'й', 'ф', 'я'] },
  {
    name: 'Standard Bopomofo',
    keys: ['ㄅ', 'ㄆ', 'ㄇ', 'ㄈ'],
    isBopomofo: true,
  },
  { name: '大千注音', keys: ['ㄅ', 'ㄆ', 'ㄇ', 'ㄈ'], isBopomofo: true },
];

const EN_TEXT = {
  Keyboard: 'Keyboard',
  Scancode: 'Scancode',
  OSLayout: 'OS Layout',
  DeviceLayout: 'Device Layout',
  Output: 'Output',
} as const;

const ZH_HANT_TEXT = {
  Keyboard: '鍵盤',
  Scancode: '掃描碼',
  OSLayout: '作業系統佈局',
  DeviceLayout: '裝置佈局',
  Output: '輸出',
} as const;

@Component({
  selector: 'app-layout-schematic-page',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatSelectModule, SwitchComponent],
  templateUrl: './layout-schematic-page.component.html',
  styleUrl: './layout-schematic-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutSchematicPageComponent {
  readonly Layer = Layer;
  scancodes = ['1E', '14', '04', '1D'];
  keyLabelMap: Record<number, KeyLabel[]> = {
    1: [
      {
        type: KeyLabelType.String,
        c: '1',
        layer: null,
        shiftKey: null,
        altGraphKey: null,
      },
    ],
    2: [
      {
        type: KeyLabelType.String,
        c: 'q',
        layer: null,
        shiftKey: null,
        altGraphKey: null,
      },
    ],
    3: [
      {
        type: KeyLabelType.String,
        c: 'a',
        layer: null,
        shiftKey: null,
        altGraphKey: null,
      },
    ],
    4: [
      {
        type: KeyLabelType.String,
        c: 'z',
        layer: null,
        shiftKey: null,
        altGraphKey: null,
      },
    ],
  };
  scancodeLabelMap: Record<number, KeyLabel[]> = {
    1: [
      {
        type: KeyLabelType.String,
        c: '1E',
        layer: null,
        shiftKey: null,
        altGraphKey: null,
      },
    ],
    2: [
      {
        type: KeyLabelType.String,
        c: '14',
        layer: null,
        shiftKey: null,
        altGraphKey: null,
      },
    ],
    3: [
      {
        type: KeyLabelType.String,
        c: '04',
        layer: null,
        shiftKey: null,
        altGraphKey: null,
      },
    ],
    4: [
      {
        type: KeyLabelType.String,
        c: '1D',
        layer: null,
        shiftKey: null,
        altGraphKey: null,
      },
    ],
  };

  languages = [
    { name: 'English', value: 'en' as const },
    { name: '繁體中文', value: 'zh_Hant' as const },
  ];
  currentLanguage = signal<'en' | 'zh_Hant'>('en');
  text = computed(() => {
    const currentLanguage = this.currentLanguage();
    if (currentLanguage === 'zh_Hant') {
      return ZH_HANT_TEXT;
    }
    return EN_TEXT;
  });

  osLayouts = OS_LAYOUTS;
  osLayoutIndex = signal(0);
  osLayout = computed(() => OS_LAYOUTS[this.osLayoutIndex()]);
  osLayoutName = computed(() => this.osLayout().name);
  osLayoutKeys = computed(() => this.osLayout().keys);

  timer = toSignal(timer(0, 750)) as Signal<number>;
  keyIndex = computed(() => Math.floor(this.timer() / 4) % 4);
  scancodeOn = computed(() => this.timer() % 4 >= 1);
  scancodeOutputOn = computed(() => this.timer() % 4 >= 1);
  osOn = computed(() => this.timer() % 4 >= 2);
  osOutputOn = computed(() => this.timer() % 4 >= 2);
  outputPrintOn = computed(() => this.timer() % 4 >= 3);
  currentScancode = computed(() => this.scancodes[this.keyIndex()]);
  currentKey = computed(() => this.osLayoutKeys()[this.keyIndex()]);
  currentOutput = computed(() => {
    const { keys, isBopomofo } = this.osLayout();
    const outputPrintOn = this.outputPrintOn();
    const keyIndex = this.keyIndex();
    if (isBopomofo) {
      const index = outputPrintOn ? keyIndex : keyIndex - 1;
      if (index < 0) {
        return '';
      }
      return keys[index];
    }
    const endIndex = outputPrintOn ? keyIndex + 1 : keyIndex;
    return keys.slice(0, endIndex).join('');
  });

  public onOsLayoutIndexChange(index: number) {
    this.osLayoutIndex.set(index);
  }

  public onLanguageChange(language: 'en' | 'zh_Hant') {
    this.currentLanguage.set(language);
  }
}
