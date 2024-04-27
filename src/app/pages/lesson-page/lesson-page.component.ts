import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { LayoutComponent } from 'src/app/components/layout/layout.component';
import { TOPICS } from 'src/app/data/topics';
import { DeviceLayoutStore } from 'src/app/stores/device-layout.store';
import { KeyboardLayoutStore } from 'src/app/stores/keyboard-layout.store';
import {
  convertKeyboardLayoutToCharacterKeyCodeMap,
  getCharacterActionCodeFromCharacterKeyCode,
  getCharacterDevicePositionCodesFromActionCode,
  getCharacterKeyCodeFromCharacter,
} from 'src/app/utils/layout.utils';

@Component({
  selector: 'app-lesson-page',
  standalone: true,
  imports: [CommonModule, LayoutComponent],
  templateUrl: './lesson-page.component.html',
  styleUrl: './lesson-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
        return getCharacterDevicePositionCodesFromActionCode(
          actionCode,
          deviceLayout,
        );
      })
      .filter(Boolean);
  });
}
