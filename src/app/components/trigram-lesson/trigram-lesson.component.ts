import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  Signal,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterLinkWithHref } from '@angular/router';
import { HotkeysService } from '@ngneat/hotkeys';
import { LetDirective } from '@ngrx/component';
import { getState } from '@ngrx/signals';
import {
  ALT_GRAPH_KEY_LABEL,
  FN_SHIFT_KEY_LABEL,
  NUM_SHIFT_KEY_LABEL,
  SHIFT_KEY_LABEL,
} from 'src/app/data/key-labels';
import { VisibleDirective } from 'src/app/directives/visible.directive';
import {
  HighlightKeyCombination,
  KeyLabel,
  KeyLabelType,
  Layer,
} from 'src/app/models/device-layout.models';
import { TrigramLessonWithPreviousAndNextLessonUrl } from 'src/app/models/topic.models';
import { IconGuardPipe } from 'src/app/pipes/icon-guard.pipe';
import { AirModeSettingStore } from 'src/app/stores/air-mode-setting.store';
import { DeviceLayoutStore } from 'src/app/stores/device-layout.store';
import { HighlightSettingStore } from 'src/app/stores/highlight-setting.store';
import { KeyboardLayoutStore } from 'src/app/stores/keyboard-layout.store';
import { TrigramLessonStore } from 'src/app/stores/trigram-lesson.store';
import { VisibilitySettingStore } from 'src/app/stores/visibility-setting.store';
import {
  getCharacterActionCodesFromCharacterKeyCode,
  getCharacterKeyCodeFromCharacter,
  getHighlightKeyCombinationFromKeyCombinations,
  getKeyCombinationsFromActionCodes,
  getModifierKeyPositionCodeMap,
} from 'src/app/utils/layout.utils';
import { nonNullable } from 'src/app/utils/non-nullable.utils';
import { ComboCounterComponent } from '../combo-counter/combo-counter.component';
import { LayoutComponent } from '../layout/layout.component';
import { SpeedometerComponent } from '../speedometer/speedometer.component';

@Component({
  selector: 'accel-shooter-trigram-lesson',
  standalone: true,
  templateUrl: 'trigram-lesson.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ComboCounterComponent,
    IconGuardPipe,
    LetDirective,
    LayoutComponent,
    MatButton,
    MatIcon,
    MatIconButton,
    MatTooltipModule,
    NgClass,
    RouterLinkWithHref,
    SpeedometerComponent,
    VisibleDirective,
  ],
  providers: [TrigramLessonStore],
})
export class TrigramLessonComponent implements OnInit, OnDestroy {
  lesson = input.required<TrigramLessonWithPreviousAndNextLessonUrl>();

  readonly isFocus = signal(false);

  public input = viewChild.required<ElementRef<HTMLInputElement>>('input');

  readonly highlightSettingStore = inject(HighlightSettingStore);
  readonly visibilitySettingStore = inject(VisibilitySettingStore);
  readonly airModeSettingStore = inject(AirModeSettingStore);

  readonly errorTooltip = viewChild<MatTooltip>('errorTooltip');

  readonly shortcuts = {
    goToPreviousLesson: 'meta.left',
    goToNextLesson: 'meta.right',
    startLesson: 'space',
    pauseLesson: 'escape',
  };

  readonly characterKeyCodeMap =
    inject(KeyboardLayoutStore).characterKeyCodeMap;
  readonly deviceLayout = inject(DeviceLayoutStore).selectedEntity;
  readonly lessonCharactersDevicePositionCodes = computed(() => {
    const lesson = this.lesson();
    const characterKeyCodeMap = this.characterKeyCodeMap();
    const deviceLayout = this.deviceLayout();
    const characters = [...new Set(lesson.components.join('').split(''))];
    return characters
      .map((c) => {
        const characterKeyCode = getCharacterKeyCodeFromCharacter(
          c,
          characterKeyCodeMap,
        );
        if (!characterKeyCode) {
          return null;
        }
        const actionCodes =
          getCharacterActionCodesFromCharacterKeyCode(characterKeyCode);
        if (actionCodes.length === 0) {
          return null;
        }
        return {
          c,
          characterDeviceKeys: getKeyCombinationsFromActionCodes(
            actionCodes,
            deviceLayout,
          ),
        };
      })
      .filter(nonNullable);
  });
  readonly modifierKeyPositionCodeMap = computed(() => {
    const deviceLayout = this.deviceLayout();
    if (!deviceLayout) {
      return null;
    }
    return getModifierKeyPositionCodeMap(deviceLayout);
  });
  readonly keyLabelMap = computed(() => {
    const lessonCharactersDevicePositionCodes =
      this.lessonCharactersDevicePositionCodes();
    if (!lessonCharactersDevicePositionCodes) {
      return {};
    }
    const modifierKeyPositionCodeMap = this.modifierKeyPositionCodeMap();
    if (!modifierKeyPositionCodeMap) {
      return {};
    }
    const keyLabelMap: Record<number, KeyLabel[]> = {};
    let addShiftLabel = false;
    let addNumShiftLabel = false;
    let addFnShiftLabel = false;
    let addAltGraphLabel = false;
    lessonCharactersDevicePositionCodes.forEach((v) => {
      v?.characterDeviceKeys?.forEach(
        ({ characterKeyPositionCode, layer, shiftKey, altGraphKey }) => {
          const d = {
            type: KeyLabelType.String as const,
            c: v.c,
            title: `Character: ${v.c}`,
            layer,
            shiftKey,
            altGraphKey,
          };
          if (!keyLabelMap[characterKeyPositionCode]) {
            keyLabelMap[characterKeyPositionCode] = [d];
          } else {
            keyLabelMap[characterKeyPositionCode].push(d);
          }
          if (shiftKey && !addShiftLabel) {
            addShiftLabel = true;
          }
          if (layer === Layer.Secondary && !addNumShiftLabel) {
            addNumShiftLabel = true;
          }
          if (layer === Layer.Tertiary && !addFnShiftLabel) {
            addFnShiftLabel = true;
          }
          if (altGraphKey && !addAltGraphLabel) {
            addAltGraphLabel = true;
          }
        },
      );
    });
    if (addShiftLabel) {
      modifierKeyPositionCodeMap.shift.forEach((pos) => {
        if (!keyLabelMap[pos]) {
          keyLabelMap[pos] = [SHIFT_KEY_LABEL];
        } else {
          keyLabelMap[pos].push(SHIFT_KEY_LABEL);
        }
      });
    }
    if (addNumShiftLabel) {
      modifierKeyPositionCodeMap.numShift.forEach((pos) => {
        if (!keyLabelMap[pos]) {
          keyLabelMap[pos] = [NUM_SHIFT_KEY_LABEL];
        } else {
          keyLabelMap[pos].push(NUM_SHIFT_KEY_LABEL);
        }
      });
    }
    if (addFnShiftLabel) {
      modifierKeyPositionCodeMap.fnShift.forEach((pos) => {
        if (!keyLabelMap[pos]) {
          keyLabelMap[pos] = [FN_SHIFT_KEY_LABEL];
        } else {
          keyLabelMap[pos].push(FN_SHIFT_KEY_LABEL);
        }
      });
    }
    if (addAltGraphLabel) {
      modifierKeyPositionCodeMap.altGraph.forEach((pos) => {
        if (!keyLabelMap[pos]) {
          keyLabelMap[pos] = [ALT_GRAPH_KEY_LABEL];
        } else {
          keyLabelMap[pos].push(ALT_GRAPH_KEY_LABEL);
        }
      });
    }
    return keyLabelMap;
  });
  readonly highlightCharacterKeyCombinationMap: Signal<
    Record<string, HighlightKeyCombination>
  > = computed(() => {
    const lessonCharactersDevicePositionCodes =
      this.lessonCharactersDevicePositionCodes();
    const highlightSetting = getState(this.highlightSettingStore);
    const deviceLayout = this.deviceLayout();
    if (!lessonCharactersDevicePositionCodes || !deviceLayout) {
      return {};
    }
    const modifierKeyPositionCodeMap = this.modifierKeyPositionCodeMap();
    const highlightCharacterKeyMap: Record<string, HighlightKeyCombination> =
      {};
    lessonCharactersDevicePositionCodes.forEach((k) => {
      if (!k?.characterDeviceKeys || !modifierKeyPositionCodeMap) {
        return;
      }
      highlightCharacterKeyMap[k.c] =
        getHighlightKeyCombinationFromKeyCombinations(
          k.characterDeviceKeys,
          modifierKeyPositionCodeMap,
          highlightSetting,
        );
    });
    return highlightCharacterKeyMap;
  });

  readonly trigramLessonStore = inject(TrigramLessonStore);
  readonly highlightKeyCombination = computed(() => {
    const currentTrigram = this.trigramLessonStore.queue()[0];
    const currentBuffer = this.trigramLessonStore.buffer();
    const currentCharacter = currentTrigram[currentBuffer.length];
    const highlightCharacterKeyCombinationMap =
      this.highlightCharacterKeyCombinationMap();
    return highlightCharacterKeyCombinationMap[currentCharacter];
  });

  readonly hotkeysService = inject(HotkeysService);
  readonly router = inject(Router);

  constructor() {
    effect(() => {
      const lesson = this.lesson();
      untracked(() => {
        if (lesson) {
          this.trigramLessonStore.setLesson(lesson);
        }
      });
    });
    effect(() => {
      const errorTooltip = this.errorTooltip();
      const error = this.trigramLessonStore.error();
      if (!errorTooltip) {
        return;
      }
      if (error) {
        errorTooltip.show();
      } else {
        errorTooltip.hide();
      }
    });
  }

  ngOnInit(): void {
    this.hotkeysService
      .addShortcut({ keys: this.shortcuts.goToPreviousLesson })
      .subscribe(() => {
        const previousLessonUrl = this.lesson()?.previousLessonUrl;
        if (previousLessonUrl) {
          this.router.navigateByUrl(previousLessonUrl);
        }
      });
    this.hotkeysService
      .addShortcut({ keys: this.shortcuts.goToNextLesson })
      .subscribe(() => {
        const nextLessonUrl = this.lesson()?.nextLessonUrl;
        if (nextLessonUrl) {
          this.router.navigateByUrl(nextLessonUrl);
        }
      });
    this.hotkeysService
      .addShortcut({ keys: this.shortcuts.startLesson })
      .subscribe(() => {
        this.startLesson();
      });
    this.hotkeysService
      .addShortcut({ keys: this.shortcuts.pauseLesson, allowIn: ['INPUT'] })
      .subscribe(() => {
        this.input().nativeElement.blur();
      });
  }

  ngOnDestroy(): void {
    this.hotkeysService.removeShortcuts([
      this.shortcuts.goToPreviousLesson,
      this.shortcuts.goToNextLesson,
      this.shortcuts.startLesson,
      this.shortcuts.pauseLesson,
    ]);
  }

  onInput(event: InputEvent) {
    // TODO - handle air mode
    this.trigramLessonStore.input(event);
  }

  startLesson() {
    this.input().nativeElement.focus();
    // TODO - add air type support
  }

  pauseLesson() {
    this.trigramLessonStore.pauseLesson();
  }
}
