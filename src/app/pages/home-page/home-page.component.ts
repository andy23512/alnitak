import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  HostListener,
  inject,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, MatButton, MatIcon, RouterLink],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {
  readonly router = inject(Router);
  firstLessonUrl = '/topic/number/lesson/123';

  @HostBinding('class') classes = 'block relative h-full';

  @HostListener('window:keyup.space')
  goToFirstLesson() {
    this.router.navigateByUrl(this.firstLessonUrl);
  }
}
