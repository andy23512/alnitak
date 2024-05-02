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
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { LetDirective } from '@ngrx/component';
import { LayoutComponent } from 'src/app/components/layout/layout.component';
import { TOPICS } from 'src/app/data/topics';
import { Lesson, Topic } from 'src/app/models/topic.models';
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
  imports: [
    CommonModule,
    LayoutComponent,
    MatIcon,
    LayoutComponent,
    LetDirective,
    RouterLink,
    MatIconButton,
    MatTooltip,
  ],
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
    const topicIndex = TOPICS.findIndex((t) => t.id === topicId);
    if (topicIndex === -1) {
      return null;
    }
    const topic = TOPICS[topicIndex];
    const lessonIndex = topic.lessons.findIndex(
      (lesson) => lesson.id === lessonId,
    );
    if (lessonIndex === -1) {
      return null;
    }
    const currentLesson = topic.lessons[lessonIndex];
    let previous: { topic: Topic; lesson: Lesson } | null = null;
    let next: { topic: Topic; lesson: Lesson } | null = null;
    if (lessonIndex === 0) {
      const previousTopic = TOPICS[topicIndex - 1];
      previous = previousTopic
        ? {
            topic: previousTopic,
            lesson: previousTopic.lessons.at(-1) as Lesson,
          }
        : null;
    } else {
      previous = { topic: topic, lesson: topic.lessons[lessonIndex - 1] };
    }
    if (lessonIndex === topic.lessons.length - 1) {
      const nextTopic = TOPICS[topicIndex + 1];
      next = nextTopic
        ? {
            topic: nextTopic,
            lesson: nextTopic.lessons[0],
          }
        : null;
    } else {
      next = { topic: topic, lesson: topic.lessons[lessonIndex + 1] };
    }
    return {
      ...currentLesson,
      previous,
      next,
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
  readonly highlightPositionCodes = computed(() => {
    const currentCharacter = this.lessonStore.queue()[0];
    const lessonCharactersDevicePositionCodes =
      this.lessonCharactersDevicePositionCodes();
    if (!lessonCharactersDevicePositionCodes) {
      return [];
    }
    const positionCodes = lessonCharactersDevicePositionCodes.find(
      (d) => d?.c === currentCharacter,
    )?.positionCodes;
    if (!positionCodes) {
      return [];
    }
    return positionCodes[0];
  });

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

  @HostListener('window:keyup.esc')
  blurInput() {
    this.input.nativeElement.blur();
  }
}
