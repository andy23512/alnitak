import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-lesson-not-found-page',
  templateUrl: 'lesson-not-found-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [TranslatePipe],
})
export class LessonNotFoundPageComponent {
  @HostBinding('class') classes = 'block p-5';
}
