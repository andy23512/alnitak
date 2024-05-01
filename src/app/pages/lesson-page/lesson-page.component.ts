import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  computed,
  effect,
  inject,
  input,
  untracked,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { LayoutComponent } from 'src/app/components/layout/layout.component';
import { TOPICS } from 'src/app/data/topics';
import { DeviceLayoutStore } from 'src/app/stores/device-layout.store';
import { KeyboardLayoutStore } from 'src/app/stores/keyboard-layout.store';
import { LessonStore } from 'src/app/stores/lesson.store';
import {
  convertKeyboardLayoutToCharacterKeyCodeMap,
  getCharacterActionCodeFromCharacterKeyCode,
  getCharacterDevicePositionCodesFromActionCode,
  getCharacterKeyCodeFromCharacter,
} from 'src/app/utils/layout.utils';

@Component({
  selector: 'app-lesson-page',
  standalone: true,
  imports: [CommonModule, LayoutComponent, MatIcon, LayoutComponent],
  templateUrl: './lesson-page.component.html',
  styleUrl: './lesson-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [LessonStore],
})
export class LessonPageComponent {
  readonly topicId = input.required<string>();
  readonly lessonId = input.required<string>();
  readonly lesson = computed(() => {
    const topicId = this.topicId();
    const lessonId = this.lessonId();
    const topic = TOPICS.find((t) => t.id === topicId);
    if (!topic) {
      return null;
    }
    return topic.lessons.find((lesson) => lesson.id === lessonId);
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
          positionCodes: getCharacterDevicePositionCodesFromActionCode(
            actionCode,
            deviceLayout,
          ),
        };
      })
      .filter(Boolean);
  });
  readonly keyLabelMap = computed(() => {
    const lessonCharactersDevicePositionCodes =
      this.lessonCharactersDevicePositionCodes();
    if (!lessonCharactersDevicePositionCodes) {
      return {};
    }
    return Object.fromEntries(
      lessonCharactersDevicePositionCodes
        .map((v) => v?.positionCodes?.map((pc) => [pc[0], v.c] as const))
        .filter(Boolean)
        .flat() as [number, string][],
    );
  });

  readonly lessonStore = inject(LessonStore);

  constructor() {
    effect(() => {
      const components = this.lesson()?.components;
      untracked(() => {
        if (components) {
          this.lessonStore.setComponents(components);
        }
      });
    });
  }

  onKeyUpInInput(event: KeyboardEvent) {
    this.lessonStore.type(event.key);
  }

  @HostListener('window:keyup.space')
  focusInput() {
    this.input.nativeElement.focus();
  }
}
