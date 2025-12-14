import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  inject,
  signal,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { HotkeysService } from '@ngneat/hotkeys';
import { TranslatePipe } from '@ngx-translate/core';
import { BehaviorSubject, concatMap, exhaustMap, from } from 'rxjs';
import { SwitchComponent } from 'src/app/components/switch/switch.component';
import { CHORDING_TIMING } from 'src/app/data/chord-timing';
import { Layer } from 'src/app/models/device-layout.models';
import { IconGuardPipe } from 'src/app/pipes/icon-guard.pipe';
import { RealTitleCasePipe } from 'src/app/pipes/real-title-case.pipe';
import { DeviceLayoutStore } from 'src/app/stores/device-layout.store';
import { VisibilitySettingStore } from 'src/app/stores/visibility-setting.store';
import { chordAnimationEventsToObservable } from 'src/app/utils/chord-animation.utils';
import { pickRandomItem, shuffle } from 'src/app/utils/random.utils';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    MatButton,
    MatIcon,
    SwitchComponent,
    IconGuardPipe,
    AsyncPipe,
    TranslatePipe,
    RealTitleCasePipe,
  ],
  templateUrl: './home-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {
  readonly router = inject(Router);
  readonly visibilitySettingStore = inject(VisibilitySettingStore);
  readonly deviceLayoutStore = inject(DeviceLayoutStore);
  firstLessonUrl = '/topic/number/lesson/123';
  highlightPositionCodes: number[] = [
    [0, 1, 2, 3, 4, [1, 2], [1, 4], [3, 2], [3, 4]],
    [5, 6, 7, 8, 9, [6, 7], [6, 9], [8, 7], [8, 9]],
  ]
    .map((list) => pickRandomItem(list))
    .flat();
  animationStartSubject = new BehaviorSubject(1);
  typingDeviceName$ = this.animationStartSubject.pipe(
    exhaustMap(() =>
      from(shuffle(['cc1', 'cc2', 'm4g']).concat(['ctd'])).pipe(
        concatMap((device, index) =>
          chordAnimationEventsToObservable(
            CHORDING_TIMING[device],
            index === 3,
          ),
        ),
      ),
    ),
  );
  useAnimation = signal(false);

  @HostBinding('class') classes = 'block relative h-full';

  readonly hotkeysService = inject(HotkeysService);
  readonly Layer = Layer;

  ngOnInit() {
    this.hotkeysService.addShortcut({ keys: 'space' }).subscribe(() => {
      this.router.navigateByUrl(this.firstLessonUrl);
    });
  }

  ngOnDestroy(): void {
    this.hotkeysService.removeShortcuts(['space']);
  }

  useAndReplayAnimation() {
    this.useAnimation.set(true);
    this.animationStartSubject.next(1);
  }

  switchToCC1DefaultLayout() {
    this.deviceLayoutStore.setSelectedId('default');
    this.visibilitySettingStore.set('layoutThumb3Switch', true);
  }

  switchToM4GDefaultLayout() {
    this.deviceLayoutStore.setSelectedId('m4g-default');
    this.visibilitySettingStore.set('layoutThumb3Switch', false);
  }
}
