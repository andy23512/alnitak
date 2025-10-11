import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLinkWithHref } from '@angular/router';
import { LetDirective } from '@ngrx/component';
import { TrigramLessonWithPreviousAndNextLessonUrl } from 'src/app/models/topic.models';
import { IconGuardPipe } from 'src/app/pipes/icon-guard.pipe';

@Component({
  selector: 'accel-shooter-trigram-lesson',
  standalone: true,
  templateUrl: 'trigram-lesson.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IconGuardPipe,
    LetDirective,
    MatButton,
    MatIcon,
    MatIconButton,
    MatTooltipModule,
    RouterLinkWithHref,
  ],
})
export class TrigramLessonComponent {
  lesson = input.required<TrigramLessonWithPreviousAndNextLessonUrl>();

  readonly isFocus = signal(false);

  public input = viewChild.required<ElementRef<HTMLInputElement>>('input');

  onInput(event: InputEvent) {
    console.log(event);
    // TODO - handle input
  }

  startLesson() {
    this.input().nativeElement.focus();
    // TODO - add air type support
  }

  pauseLesson() {
    // TODO - handle pause lesson
  }
}
