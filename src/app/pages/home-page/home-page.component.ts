import { AsyncPipe } from '@angular/common';
import {
  CdkConnectedOverlay,
  CdkOverlayOrigin,
  ConnectedPosition,
} from '@angular/cdk/overlay';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  computed,
  inject,
  signal,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { HotkeysService } from '@ngneat/hotkeys';
import { TranslatePipe } from '@ngx-translate/core';
import { BehaviorSubject, concatMap, exhaustMap, from } from 'rxjs';
import { LayoutComponent } from 'src/app/components/layout/layout.component';
import { SwitchComponent } from 'src/app/components/switch/switch.component';
import { CHORDING_TIMING } from 'src/app/data/chord-timing';
import { IconGuardPipe } from 'src/app/pipes/icon-guard.pipe';
import { RealTitleCasePipe } from 'src/app/pipes/real-title-case.pipe';
import { DeviceLayoutStore } from 'src/app/stores/device-layout.store';
import { MiscSettingStore } from 'src/app/stores/misc-setting.store';
import { VisibilitySettingStore } from 'src/app/stores/visibility-setting.store';
import { chordAnimationEventsToObservable } from 'src/app/utils/chord-animation.utils';
import { pickRandomItem, shuffle } from 'src/app/utils/random.utils';
import { ACTIONS, HighlightKeyCombination, Layer } from 'tangent-cc-lib';

const SPACE_ACTION_CODES = ACTIONS.filter(
  (action) =>
    'keyCode' in action &&
    (action.keyCode === 'SpaceLeft' || action.keyCode === 'SpaceRight'),
).map((action) => action.codeId);

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    MatButton,
    MatIcon,
    CdkOverlayOrigin,
    CdkConnectedOverlay,
    SwitchComponent,
    LayoutComponent,
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
  readonly miscSettingStore = inject(MiscSettingStore);
  firstLessonUrl = '/topic/number/lesson/123';
  highlightPositionCodes: number[] = [
    [0, 1, 2, 3, 4, [1, 2], [1, 4], [3, 2], [3, 4]],
    [5, 6, 7, 8, 9, [6, 7], [6, 9], [8, 7], [8, 9]],
  ]
    .map((list) => pickRandomItem(list))
    .flat();
  readonly spaceHighlightKeyCombination = computed(
    (): HighlightKeyCombination | null => {
      const primaryLayer = this.deviceLayoutStore.selectedEntity()?.layout[0];
      if (!primaryLayer) {
        return null;
      }
      const positionCodes = primaryLayer.flatMap((actionCode, positionCode) =>
        SPACE_ACTION_CODES.includes(actionCode) ? [positionCode] : [],
      );
      if (positionCodes.length === 0) {
        return null;
      }
      return {
        characterKeyPositionCode: positionCodes[0],
        layer: Layer.Primary,
        shiftKey: false,
        altGraphKey: false,
        positionCodes,
        score: 0,
        useLayerLock: false,
      };
    },
  );
  readonly spaceHintOpen = signal(false);
  // 箭頭在氣泡左側 24px 處，所以氣泡向左位移 24px 讓箭頭對準 space 鍵中心
  readonly spaceHintPositions: ConnectedPosition[] = [
    {
      originX: 'center',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'top',
      offsetX: -24,
      offsetY: 12,
    },
  ];
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

  constructor() {
    afterNextRender(() => {
      if (!this.miscSettingStore.homePageSpaceHintSeen()) {
        this.spaceHintOpen.set(true);
        this.miscSettingStore.set('homePageSpaceHintSeen', true);
      }
    });
  }

  ngOnInit() {
    this.hotkeysService.addShortcut({ keys: 'space' }).subscribe(() => {
      this.router.navigateByUrl(this.firstLessonUrl);
    });
  }

  ngOnDestroy(): void {
    this.hotkeysService.removeShortcuts(['space']);
  }

  toggleSpaceHint() {
    this.spaceHintOpen.update((open) => !open);
  }

  onSpaceHintOutsideClick(event: MouseEvent, origin: HTMLElement) {
    if (!origin.contains(event.target as Node)) {
      this.spaceHintOpen.set(false);
    }
  }

  onSpaceHintKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.spaceHintOpen.set(false);
    }
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
