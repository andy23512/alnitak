import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LayoutComponent } from 'src/app/components/layout/layout.component';

@Component({
  selector: 'app-lesson-page',
  standalone: true,
  imports: [CommonModule, LayoutComponent],
  templateUrl: './lesson-page.component.html',
  styleUrl: './lesson-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LessonPageComponent {
  readonly lessonId = input.required<string>({ alias: 'id' });
}
