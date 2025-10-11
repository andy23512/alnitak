import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TrigramLessonWithPreviousAndNextLessonUrl } from 'src/app/models/topic.models';

@Component({
  selector: 'accel-shooter-trigram-lesson',
  standalone: true,
  templateUrl: 'trigram-lesson.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrigramLessonComponent {
  lesson = input.required<TrigramLessonWithPreviousAndNextLessonUrl>();
}
