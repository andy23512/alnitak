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
import { Chance } from 'chance';
import { SwitchComponent } from 'src/app/components/switch/switch.component';

const chance = new Chance();

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, MatButton, MatIcon, RouterLink, SwitchComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {
  readonly router = inject(Router);
  firstLessonUrl = '/topic/number/lesson/123';
  highlightPositionCodes: number[] = [[-1, -1, 1, 3], [-1, -1, 2, 4], [-1, -1, 6, 8], [-1, -1, 7, 9]].map(list => chance.pickone(list));

  @HostBinding('class') classes = 'block relative h-full';

  @HostListener('window:keyup.space')
  goToFirstLesson() {
    this.router.navigateByUrl(this.firstLessonUrl);
  }
}
