import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  OnDestroy,
  OnInit,
  Signal,
  ViewChild,
  computed,
  effect,
  inject,
  input,
  signal,
  untracked,
} from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { Router, RouterLinkWithHref } from '@angular/router';
import { HotkeysService, HotkeysShortcutPipe } from '@ngneat/hotkeys';
import { LetDirective } from '@ngrx/component';
import { getState } from '@ngrx/signals';
import { liveQuery } from 'dexie';
import { ComboCounterComponent } from 'src/app/components/combo-counter/combo-counter.component';
import { LayoutComponent } from 'src/app/components/layout/layout.component';
import { SpeedometerComponent } from 'src/app/components/speedometer/speedometer.component';
import {
  ALT_GR_ACTION_CODE,
  FN_SHIFT_ACTION_CODES,
  SHIFT_ACTION_CODES,
} from 'src/app/data/actions';
import { NUM_SHIFT_KEY_LABEL, SHIFT_KEY_LABEL } from 'src/app/data/key-labels';
import { LESSONS } from 'src/app/data/topics';
import { db } from 'src/app/db';
import { VisibleDirective } from 'src/app/directives/visible.directive';
import {
  HighlightKeyCombination,
  KeyLabel,
  Layer,
} from 'src/app/models/device-layout.models';
import { DeviceLayoutStore } from 'src/app/stores/device-layout.store';
import { HighlightSettingStore } from 'src/app/stores/highlight-setting.store';
import { KeyboardLayoutStore } from 'src/app/stores/keyboard-layout.store';
import { LessonStore } from 'src/app/stores/lesson.store';
import { VisibilitySettingStore } from 'src/app/stores/visibility-setting.store';
import {
  convertKeyboardLayoutToCharacterKeyCodeMap,
  getCharacterActionCodeFromCharacterKeyCode,
  getCharacterKeyCodeFromCharacter,
  getHighlightKeyCombinationFromKeyCombinations,
  getKeyCombinationsFromActionCode,
  getNumShiftKeyPositionCodes,
} from 'src/app/utils/layout.utils';
import { nonNullable } from 'src/app/utils/non-nullable.utils';

@Component({
  selector: 'app-lesson-page',
  standalone: true,
  imports: [
    ComboCounterComponent,
    HotkeysShortcutPipe,
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
  ],
  templateUrl: './lesson-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [LessonStore],
})
export class LessonPageComponent implements OnInit, OnDestroy {
  readonly topicId = input.required<string>();
  readonly lessonId = input.required<string>();

  readonly highlightSettingStore = inject(HighlightSettingStore);
  readonly visibilitySettingStore = inject(VisibilitySettingStore);

  readonly isFocus = signal(false);

  @HostBinding('class') classes = 'flex flex-col gap-2 h-screen';

  readonly shortcuts = {
    goToPreviousLesson: 'meta.left',
    goToNextLesson: 'meta.right',
    startLesson: 'space',
    pauseLesson: 'escape',
  };

  readonly lesson = computed(() => {
    const topicId = this.topicId();
    const lessonId = this.lessonId();
    const lessonIndex = LESSONS.findIndex(
      (lesson) => lesson.id === lessonId && lesson.topic.id === topicId,
    );
    if (lessonIndex === -1) {
      return null;
    }
    const lesson = LESSONS[lessonIndex];
    const previous = lessonIndex !== 0 ? LESSONS[lessonIndex - 1] : null;
    const next =
      lessonIndex !== LESSONS.length - 1 ? LESSONS[lessonIndex + 1] : null;
    return {
      ...lesson,
      previousLessonUrl: previous
        ? `/topic/${previous.topic.id}/lesson/${previous.id}`
        : null,
      nextLessonUrl: next ? `/topic/${next.topic.id}/lesson/${next.id}` : null,
    };
  });
  @ViewChild('input', { static: true })
  public input!: ElementRef<HTMLInputElement>;

  readonly keyboardLayout = inject(KeyboardLayoutStore).selectedEntity;
  readonly characterKeyCodeMap = computed(() =>
    convertKeyboardLayoutToCharacterKeyCodeMap(this.keyboardLayout()),
  );
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
        const actionCode =
          getCharacterActionCodeFromCharacterKeyCode(characterKeyCode);
        if (!actionCode) {
          return null;
        }
        return {
          c,
          characterDeviceKeys: getKeyCombinationsFromActionCode(
            actionCode,
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
    return {
      shift: SHIFT_ACTION_CODES.map((actionCode) =>
        getKeyCombinationsFromActionCode(
          { actionCode, shiftKey: false, altGraphKey: false },
          deviceLayout,
        )?.map((k) => k.characterKeyPositionCode),
      )
        .filter(nonNullable)
        .flat(),
      numShift: getNumShiftKeyPositionCodes(deviceLayout),
      fnShift: FN_SHIFT_ACTION_CODES.map((actionCode) =>
        getKeyCombinationsFromActionCode(
          { actionCode, shiftKey: false, altGraphKey: false },
          deviceLayout,
        )?.map((k) => k.characterKeyPositionCode),
      )
        .filter(nonNullable)
        .flat(),
      altGraph: [ALT_GR_ACTION_CODE]
        .map((actionCode) =>
          getKeyCombinationsFromActionCode(
            { actionCode, shiftKey: false, altGraphKey: false },
            deviceLayout,
          )?.map((k) => k.characterKeyPositionCode),
        )
        .filter(nonNullable)
        .flat(),
    };
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
    lessonCharactersDevicePositionCodes.forEach((v) => {
      v?.characterDeviceKeys?.forEach(
        ({ characterKeyPositionCode, layer, shiftKey, altGraphKey }) => {
          const d = { c: v.c, layer, shiftKey, altGraphKey };
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

  readonly hotkeys = inject(HotkeysService);
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
  }

  ngOnInit(): void {
    this.hotkeys
      .addShortcut({ keys: this.shortcuts.goToPreviousLesson })
      .subscribe(() => {
        const previousLessonUrl = this.lesson()?.previousLessonUrl;
        if (previousLessonUrl) {
          this.router.navigateByUrl(previousLessonUrl);
        }
      });
    this.hotkeys
      .addShortcut({ keys: this.shortcuts.goToNextLesson })
      .subscribe(() => {
        const nextLessonUrl = this.lesson()?.nextLessonUrl;
        if (nextLessonUrl) {
          this.router.navigateByUrl(nextLessonUrl);
        }
      });
    this.hotkeys
      .addShortcut({ keys: this.shortcuts.startLesson })
      .subscribe(() => {
        this.startLesson();
      });
    this.hotkeys
      .addShortcut({ keys: this.shortcuts.pauseLesson, allowIn: ['INPUT'] })
      .subscribe(() => {
        this.endLesson();
      });
  }

  ngOnDestroy(): void {
    this.hotkeys.removeShortcuts([
      this.shortcuts.goToPreviousLesson,
      this.shortcuts.goToNextLesson,
      this.shortcuts.startLesson,
      this.shortcuts.pauseLesson,
    ]);
  }

  onKeyUpInInput({ key }: KeyboardEvent) {
    if (key.length === 1 || (key.length > 1 && /[^a-zA-Z0-9]/.test(key))) {
      this.lessonStore.type(key);
    }
  }

  startLesson() {
    this.input.nativeElement.focus();
  }

  endLesson() {
    this.input.nativeElement.blur();
  }

  keyRecords$ = liveQuery(() => db.keyRecords.toArray());
}
