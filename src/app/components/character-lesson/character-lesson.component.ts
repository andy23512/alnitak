import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  HostBinding,
  inject,
  input,
  OnDestroy,
  OnInit,
  signal,
  Signal,
  untracked,
  viewChild,
  ViewChild,
} from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { Router, RouterLinkWithHref } from '@angular/router';
import { LetDirective } from '@ngrx/component';
import { VisibleDirective } from 'src/app/directives/visible.directive';
import { CharacterLessonWithPreviousAndNextLessonUrl } from 'src/app/models/topic.models';
import { IconGuardPipe } from 'src/app/pipes/icon-guard.pipe';
import { LessonStore } from 'src/app/stores/lesson.store';
import { ComboCounterComponent } from '../combo-counter/combo-counter.component';
import { LayoutComponent } from '../layout/layout.component';
import { SpeedometerComponent } from '../speedometer/speedometer.component';
import { HotkeysService } from '@ngneat/hotkeys';
import { untilDestroyed } from '@ngneat/until-destroy';
import { getState } from '@ngrx/signals';
import { liveQuery } from 'dexie';
import { interval } from 'rxjs';
import {
  SHIFT_KEY_LABEL,
  NUM_SHIFT_KEY_LABEL,
  FN_SHIFT_KEY_LABEL,
  ALT_GRAPH_KEY_LABEL,
} from 'src/app/data/key-labels';
import { db } from 'src/app/db';
import {
  KeyLabel,
  KeyLabelType,
  Layer,
  HighlightKeyCombination,
} from 'src/app/models/device-layout.models';
import { AirModeSettingStore } from 'src/app/stores/air-mode-setting.store';
import { DeviceLayoutStore } from 'src/app/stores/device-layout.store';
import { HighlightSettingStore } from 'src/app/stores/highlight-setting.store';
import { KeyboardLayoutStore } from 'src/app/stores/keyboard-layout.store';
import { VisibilitySettingStore } from 'src/app/stores/visibility-setting.store';
import {
  getCharacterKeyCodeFromCharacter,
  getCharacterActionCodesFromCharacterKeyCode,
  getKeyCombinationsFromActionCodes,
  getModifierKeyPositionCodeMap,
  getHighlightKeyCombinationFromKeyCombinations,
} from 'src/app/utils/layout.utils';
import { nonNullable } from 'src/app/utils/non-nullable.utils';

@Component({
  selector: 'accel-shooter-character-lesson',
  standalone: true,
  templateUrl: 'character-lesson.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ComboCounterComponent,
    NgClass,
    LayoutComponent,
    LayoutComponent,
    LetDirective,
    MatButton,
    MatIconButton,
    MatIcon,
    MatTooltip,
    RouterLinkWithHref,
    SpeedometerComponent,
    VisibleDirective,
    IconGuardPipe,
  ],
  providers: [LessonStore],
})
export class CharacterLessonComponent implements OnInit, OnDestroy {
  lesson = input.required<CharacterLessonWithPreviousAndNextLessonUrl>();
  @HostBinding('class') classes = 'flex flex-col gap-2 h-full relative';

  readonly highlightSettingStore = inject(HighlightSettingStore);
  readonly visibilitySettingStore = inject(VisibilitySettingStore);
  readonly airModeSettingStore = inject(AirModeSettingStore);

  readonly isFocus = signal(false);

  readonly errorTooltip = viewChild<MatTooltip>('errorTooltip');

  readonly shortcuts = {
    goToPreviousLesson: 'meta.left',
    goToNextLesson: 'meta.right',
    startLesson: 'space',
    pauseLesson: 'escape',
  };

  @ViewChild('input', { static: true })
  public input!: ElementRef<HTMLInputElement>;

  readonly characterKeyCodeMap =
    inject(KeyboardLayoutStore).characterKeyCodeMap;
  readonly deviceLayout = inject(DeviceLayoutStore).selectedEntity;
  readonly lessonCharactersDevicePositionCodes = computed(() => {
    const lesson = this.lesson();
    const characterKeyCodeMap = this.characterKeyCodeMap();
    const deviceLayout = this.deviceLayout();
    return lesson?.components
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

  readonly lessonStore = inject(LessonStore);
  readonly highlightKeyCombination = computed(() => {
    const currentCharacter = this.lessonStore.queue()[0];
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
          this.lessonStore.setLesson(lesson);
        }
      });
    });
    effect(() => {
      const errorTooltip = this.errorTooltip();
      const error = this.lessonStore.error();
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
        this.input.nativeElement.blur();
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

  onInput({ data }: InputEvent) {
    const airModeEnabled = this.airModeSettingStore.enabled();
    if (airModeEnabled) {
      return;
    }
    if (data?.length === 1) {
      this.lessonStore.type(data);
    }
  }

  startLesson() {
    this.input.nativeElement.focus();
    const airModeEnabled = this.airModeSettingStore.enabled();
    if (airModeEnabled) {
      const characterEntrySpeed =
        this.airModeSettingStore.characterEntrySpeed();
      const characterEntryInterval = (60 * 1000) / characterEntrySpeed;
      interval(characterEntryInterval)
        .pipe(untilDestroyed(this))
        .subscribe(() => {
          this.lessonStore.airType();
        });
    }
  }

  pauseLesson() {
    this.lessonStore.pauseLesson();
  }

  keyRecords$ = liveQuery(() => db.keyRecords.toArray());
}
