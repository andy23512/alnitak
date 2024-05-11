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
import { HotkeysService, HotkeysShortcutPipe } from '@ngneat/hotkeys';
import { SwitchComponent } from 'src/app/components/switch/switch.component';
import { CharaChorderOneLayer } from 'src/app/models/device-layout.models';
import { pickRandomItem } from 'src/app/utils/random.utils';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule,
    MatButton,
    MatIcon,
    RouterLink,
    SwitchComponent,
    HotkeysShortcutPipe,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {
  readonly router = inject(Router);
  firstLessonUrl = '/topic/number/lesson/123';
  highlightPositionCodes: number[] = [
    [0, 1, 2, 3, 4, [1, 2], [1, 4], [3, 2], [3, 4]],
    [5, 6, 7, 8, 9, [6, 7], [6, 9], [8, 7], [8, 9]],
  ]
    .map((list) => pickRandomItem(list))
    .flat();

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
