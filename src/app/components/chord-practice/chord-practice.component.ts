import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  HostBinding,
  inject,
  OnInit,
  Signal,
  signal,
  ViewChild,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { HotkeysService } from '@ngneat/hotkeys';
import { VisibleDirective } from 'src/app/directives/visible.directive';
import {
  HighlightKeyCombination,
  KeyCombination,
  KeyLabel,
  Layer,
} from 'src/app/models/device-layout.models';
import { ChordPracticeStore } from 'src/app/stores/chord-practice.store';
import { DeviceLayoutStore } from 'src/app/stores/device-layout.store';
import { KeyboardLayoutStore } from 'src/app/stores/keyboard-layout.store';
import { VisibilitySettingStore } from 'src/app/stores/visibility-setting.store';
import {
  convertKeyboardLayoutToCharacterKeyCodeMap,
  getChordKeyFromActionCode,
  getKeyCombinationsFromActionCode,
} from 'src/app/utils/layout.utils';
import { ChordOutputKeysComponent } from '../chord-output-keys/chord-output-keys.component';
import { LayoutComponent } from '../layout/layout.component';
import { SpeedometerComponent } from '../speedometer/speedometer.component';

@Component({
  selector: 'app-chord-practice',
  standalone: true,
  imports: [
    ChordOutputKeysComponent,
    MatIcon,
    MatButton,
    LayoutComponent,
    SpeedometerComponent,
    VisibleDirective,
  ],
  templateUrl: './chord-practice.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChordPracticeComponent implements OnInit {
  readonly chordPracticeStore = inject(ChordPracticeStore);
  readonly visibilitySettingStore = inject(VisibilitySettingStore);
  readonly hotkeys = inject(HotkeysService);

  readonly isFocus = signal(false);

  readonly shortcuts = {
    startPractice: 'space',
    pausePractice: 'escape',
  };

  @HostBinding('class') classes = 'flex flex-col h-screen';

  @ViewChild('input', { static: true })
  public input!: ElementRef<HTMLInputElement>;

  readonly keyboardLayout = inject(KeyboardLayoutStore).selectedEntity;
  readonly characterKeyCodeMap = computed(() =>
    convertKeyboardLayoutToCharacterKeyCodeMap(this.keyboardLayout()),
  );
  readonly deviceLayout = inject(DeviceLayoutStore).selectedEntity;

  readonly practiceCharactersDevicePositionCodes = computed(() => {
    const chords = this.chordPracticeStore.chords();
    const deviceLayout = this.deviceLayout();
    const keyboardLayout = this.keyboardLayout();
    const actionCodes = [...new Set(chords?.map((c) => c.input).flat())];
    return actionCodes.map((actionCode) => {
      const chordKey = getChordKeyFromActionCode(actionCode, keyboardLayout);
      return chordKey
        ? {
            c: chordKey.value,
            characterDeviceKeys: getKeyCombinationsFromActionCode(
              { actionCode, shiftKey: false, altGraphKey: false },
              deviceLayout,
            ),
          }
        : null;
    }) as {
      c: string;
      characterDeviceKeys: KeyCombination[] | null;
    }[];
  });

  readonly keyLabelMap = computed(() => {
    const practiceCharactersDevicePositionCodes =
      this.practiceCharactersDevicePositionCodes();
    if (!practiceCharactersDevicePositionCodes) {
      return {};
    }
    const keyLabelMap: Record<number, KeyLabel[]> = {};
    practiceCharactersDevicePositionCodes.forEach((v) => {
      v?.characterDeviceKeys?.forEach(
        ({ characterKeyPositionCode, layer, shiftKey, altGraphKey }) => {
          const d = { c: v.c, layer, shiftKey, altGraphKey };
          if (!keyLabelMap[characterKeyPositionCode]) {
            keyLabelMap[characterKeyPositionCode] = [d];
          } else {
            keyLabelMap[characterKeyPositionCode].push(d);
          }
        },
      );
    });
    return keyLabelMap;
  });

  readonly highlightChordKeyCombinationMap: Signal<
    Record<string, HighlightKeyCombination>
  > = computed(() => {
    const chords = this.chordPracticeStore.chords();
    const deviceLayout = this.deviceLayout();
    const practiceCharactersDevicePositionCodes =
      this.practiceCharactersDevicePositionCodes();
    if (!practiceCharactersDevicePositionCodes) {
      return {};
    }
    const highlightChordKeyCombinationMap: Record<
      string,
      HighlightKeyCombination
    > = {};
    chords?.forEach((chord) => {
      highlightChordKeyCombinationMap[chord.id] = {
        characterKeyPositionCode: -1,
        layer: Layer.Primary,
        shiftKey: false,
        altGraphKey: false,
        positionCodes: chord.input
          .map((actionCode) =>
            getKeyCombinationsFromActionCode(
              { actionCode, shiftKey: false, altGraphKey: false },
              deviceLayout,
            )?.map((k) => k.characterKeyPositionCode),
          )
          .flat() as number[],
        score: 0,
      };
    });
    return highlightChordKeyCombinationMap;
  });

  readonly highlightKeyCombination = computed(() => {
    const currentChord = this.chordPracticeStore.queue()[0];
    const highlightChordKeyCombinationMap =
      this.highlightChordKeyCombinationMap();
    return highlightChordKeyCombinationMap[currentChord.id];
  });

  onKeyUp(event: KeyboardEvent) {
    this.chordPracticeStore.keyUp(event);
  }

  startPractice() {
    this.input.nativeElement.focus();
  }

  endPractice() {
    this.input.nativeElement.blur();
  }

  ngOnInit(): void {
    this.hotkeys
      .addShortcut({ keys: this.shortcuts.startPractice })
      .subscribe(() => {
        this.startPractice();
      });
    this.hotkeys
      .addShortcut({ keys: this.shortcuts.pausePractice, allowIn: ['INPUT'] })
      .subscribe(() => {
        this.endPractice();
      });
  }

  ngOnDestroy(): void {
    this.hotkeys.removeShortcuts([
      this.shortcuts.startPractice,
      this.shortcuts.pausePractice,
    ]);
  }
}
