import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  inject,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { HotkeysService } from '@ngneat/hotkeys';
import { SwitchComponent } from 'src/app/components/switch/switch.component';
import { CharaChorderOneLayer } from 'src/app/models/device-layout.models';
import { pickRandomItem } from 'src/app/utils/random.utils';

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
  highlightPositionCodes: number[] = [
    [-1, -1, 1, 3],
    [-1, -1, 2, 4],
    [-1, -1, 6, 8],
    [-1, -1, 7, 9],
  ].map((list) => pickRandomItem(list));

  @HostBinding('class') classes = 'block relative h-full';

  readonly hotkeysService = inject(HotkeysService);
  readonly CharaChorderOneLayer = CharaChorderOneLayer;

  ngOnInit() {
    this.hotkeysService.addShortcut({ keys: 'space' }).subscribe(() => {
      this.router.navigateByUrl(this.firstLessonUrl);
    });
  }

  ngOnDestroy(): void {
    this.hotkeysService.removeShortcuts(['space']);
  }
}
