import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  input,
} from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { CharacterLessonComponent } from 'src/app/components/character-lesson/character-lesson.component';
import { TrigramLessonComponent } from 'src/app/components/trigram-lesson/trigram-lesson.component';
import { LessonWithPreviousAndNextLessonUrl } from 'src/app/models/topic.models';

@UntilDestroy()
@Component({
  selector: 'app-lesson-page',
  standalone: true,
  imports: [CharacterLessonComponent, TrigramLessonComponent],
  templateUrl: './lesson-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LessonPageComponent {
  readonly lesson = input.required<LessonWithPreviousAndNextLessonUrl>();
  @HostBinding('class') classes = 'block h-full';
}
