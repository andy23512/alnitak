import { OverlayContainer } from '@angular/cdk/overlay';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  discardPeriodicTasks,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { LayoutComponent } from 'src/app/components/layout/layout.component';
import { CHORDING_TIMING } from 'src/app/data/chord-timing';
import { HotkeysService } from '@ngneat/hotkeys';
import { patchState } from '@ngrx/signals';
import { setEntities } from '@ngrx/signals/entities';
import { provideTranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { DeviceLayoutStore } from 'src/app/stores/device-layout.store';
import { MiscSettingStore } from 'src/app/stores/misc-setting.store';
import { VisibilitySettingStore } from 'src/app/stores/visibility-setting.store';
import { ACTIONS, DeviceLayout, Layer } from 'tangent-cc-lib';
import { HomePageComponent } from './home-page.component';

const codeOf = (keyCode: string) =>
  ACTIONS.find((a) => 'keyCode' in a && a.keyCode === keyCode)!.codeId;
const SPACE_LEFT = codeOf('SpaceLeft');
const SPACE_RIGHT = codeOf('SpaceRight');
const SPACE_CODES = ACTIONS.filter(
  (a) =>
    'keyCode' in a && (a.keyCode === 'SpaceLeft' || a.keyCode === 'SpaceRight'),
).map((a) => a.codeId);

describe('HomePageComponent', () => {
  let fixture: ComponentFixture<HomePageComponent>;
  let component: HomePageComponent;
  let navigateByUrl: jasmine.Spy;
  let shortcuts: Record<string, Subject<unknown>>;
  let removed: string[][];
  let overlay: HTMLElement;
  let misc: InstanceType<typeof MiscSettingStore>;
  let visibility: InstanceType<typeof VisibilitySettingStore>;
  let layouts: InstanceType<typeof DeviceLayoutStore>;

  const el = () => fixture.nativeElement as HTMLElement;
  const text = (e: Element | null | undefined) =>
    e?.textContent?.replace(/\s+/g, ' ').trim().toLowerCase();
  const kbd = () => el().querySelector('kbd') as HTMLElement;
  const hint = () =>
    overlay.querySelector('[role=dialog]') as HTMLElement | null;
  const hintLayout = () =>
    fixture.debugElement.query(By.directive(LayoutComponent))
      .componentInstance as LayoutComponent;
  async function settle() {
    fixture.detectChanges();
    await new Promise((r) => setTimeout(r, 0));
    fixture.detectChanges();
  }

  beforeEach(() => {
    TestBed.resetTestingModule();
    localStorage.clear();
    shortcuts = {};
    removed = [];
    TestBed.configureTestingModule({
      providers: [
        provideTranslateService(),
        {
          provide: HotkeysService,
          useValue: {
            addShortcut: ({ keys }: { keys: string }) =>
              (shortcuts[keys] = new Subject()),
            removeShortcuts: (k: string[]) => removed.push(k),
          },
        },
      ],
    });
    navigateByUrl = spyOn(TestBed.inject(Router), 'navigateByUrl');
    overlay = TestBed.inject(OverlayContainer).getContainerElement();
    misc = TestBed.inject(MiscSettingStore);
    visibility = TestBed.inject(VisibilitySettingStore);
    layouts = TestBed.inject(DeviceLayoutStore);
  });

  afterEach(() => localStorage.clear());

  function create() {
    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('fills the page and names the site', () => {
    create();
    expect(el().classList).toContain('block');
    expect(el().classList).toContain('relative');
    expect(el().classList).toContain('h-full');
    expect(text(el().querySelector('h1'))).toBe('home-page.website-name');
    expect(text(el())).toContain('home-page.remark');
  });

  describe('background switches', () => {
    it('draws one switch for each hand', () => {
      create();
      expect(el().querySelectorAll('svg > g').length).toBe(2);
    });

    it('highlights one choice for each hand: a key, or two keys of the switch', () => {
      // choices per hand: 5 single keys, then 4 pairs; the random number picks the index
      const random = spyOn(Math, 'random');
      const pick = (value: number) => {
        random.and.returnValue(value);
        create();
        const codes = component.highlightPositionCodes;
        fixture.destroy();
        return codes;
      };
      expect(pick(0)).toEqual([0, 5]);
      expect(pick(0.5)).toEqual([4, 9]);
      expect(pick(5 / 9 + 0.01)).toEqual([1, 2, 6, 7]);
      expect(pick(0.99)).toEqual([3, 4, 8, 9]);
    });

    it('uses a different highlight from time to time', () => {
      const seen = new Set<string>();
      for (let i = 0; i < 80; i++) {
        create();
        seen.add(component.highlightPositionCodes.join(','));
        fixture.destroy();
      }
      expect(seen.size).toBeGreaterThan(5);
    });
  });

  describe('starting a lesson', () => {
    it('goes to the first lesson', () => {
      create();
      expect(component.firstLessonUrl).toBe('/topic/number/lesson/123');
    });

    it('goes there when space is pressed', () => {
      create();
      shortcuts['space'].next({});
      expect(navigateByUrl).toHaveBeenCalledOnceWith(
        '/topic/number/lesson/123',
      );
    });

    it('stops listening for space when it is destroyed', () => {
      create();
      fixture.destroy();
      expect(removed).toEqual([['space']]);
    });
  });

  describe('space hint', () => {
    it('opens by itself the first time, and is remembered as seen', async () => {
      expect(misc.homePageSpaceHintSeen()).toBeFalse();
      create();
      await settle();
      expect(component.spaceHintOpen()).toBeTrue();
      expect(hint()).not.toBeNull();
      expect(misc.homePageSpaceHintSeen()).toBeTrue();
    });

    it('stays closed once it was seen', async () => {
      misc.set('homePageSpaceHintSeen', true);
      create();
      await settle();
      expect(component.spaceHintOpen()).toBeFalse();
      expect(hint()).toBeNull();
    });

    describe('when closed', () => {
      beforeEach(async () => {
        misc.set('homePageSpaceHintSeen', true);
        create();
        await settle();
      });

      it('opens and closes when the space key label is clicked', async () => {
        kbd().click();
        await settle();
        expect(hint()).not.toBeNull();
        kbd().click();
        await settle();
        expect(hint()).toBeNull();
      });

      it('shows the space key on the layout when the layout has one', async () => {
        kbd().click();
        await settle();
        expect(text(hint())).toContain('home-page.space-hint');
        expect(text(hint())).not.toContain('home-page.space-hint-not-found');
        expect(hint()!.querySelector('app-layout')).not.toBeNull();
      });

      it('closes on Escape', async () => {
        component.spaceHintOpen.set(true);
        component.onSpaceHintKeydown(
          new KeyboardEvent('keydown', { key: 'Escape' }),
        );
        expect(component.spaceHintOpen()).toBeFalse();
      });

      it('stays open on other keys', () => {
        component.spaceHintOpen.set(true);
        component.onSpaceHintKeydown(
          new KeyboardEvent('keydown', { key: 'a' }),
        );
        expect(component.spaceHintOpen()).toBeTrue();
      });

      it('closes on a click outside, but not on the label itself', () => {
        const origin = document.createElement('div');
        const inside = document.createElement('span');
        origin.appendChild(inside);
        component.spaceHintOpen.set(true);
        component.onSpaceHintOutsideClick(
          { target: inside } as unknown as MouseEvent,
          origin,
        );
        expect(component.spaceHintOpen()).toBeTrue();
        component.onSpaceHintOutsideClick(
          { target: document.body } as unknown as MouseEvent,
          origin,
        );
        expect(component.spaceHintOpen()).toBeFalse();
      });

      it('toggles', () => {
        component.toggleSpaceHint();
        expect(component.spaceHintOpen()).toBeTrue();
        component.toggleSpaceHint();
        expect(component.spaceHintOpen()).toBeFalse();
      });
    });

    describe('highlighted space key', () => {
      const layer = (codes: number[]) => [codes];
      const useLayout = (primary: number[]) => {
        patchState(
          layouts,
          setEntities([
            { id: 'custom', name: 'c', layout: layer(primary) },
          ] as unknown as DeviceLayout[]),
        );
        layouts.setSelectedId('custom');
      };

      it('lists the positions of the space keys on the primary layer', () => {
        useLayout([1, SPACE_LEFT, 2, SPACE_RIGHT]);
        create();
        const combination = component.spaceHighlightKeyCombination()!;
        expect(combination.positionCodes).toEqual([1, 3]);
        expect(combination.characterKeyPositionCode).toBe(1);
        expect(combination.layer).toBe(Layer.Primary);
        expect(combination.shiftKey).toBeFalse();
        expect(combination.altGraphKey).toBeFalse();
        expect(combination.useLayerLock).toBeFalse();
      });

      it('finds a layout that has only the left or only the right space key', () => {
        useLayout([1, SPACE_LEFT]);
        create();
        expect(component.spaceHighlightKeyCombination()!.positionCodes).toEqual(
          [1],
        );
        useLayout([SPACE_RIGHT, 5]);
        expect(component.spaceHighlightKeyCombination()!.positionCodes).toEqual(
          [0],
        );
      });

      it('is null when there is no space key', () => {
        useLayout([1, 2, 3]);
        create();
        expect(component.spaceHighlightKeyCombination()).toBeNull();
      });

      it('says so in the hint when there is no space key', async () => {
        useLayout([1, 2, 3]);
        create();
        await settle();
        expect(text(hint())).toContain('home-page.space-hint-not-found');
        expect(hint()!.querySelector('app-layout')).toBeNull();
      });

      it('is null when no layout is selected', () => {
        patchState(layouts, setEntities([] as DeviceLayout[]));
        layouts.setSelectedId('missing');
        create();
        expect(component.spaceHighlightKeyCombination()).toBeNull();
      });
    });
  });

  describe('typing animation', () => {
    it('shows the plain summary when the animation is off', () => {
      create();
      expect(text(el())).toContain('home-page.summary.1');
      expect(el().querySelector('.h-6')).toBeNull();
    });

    it('types device names with a cursor when the animation is on', fakeAsync(() => {
      visibility.set('homePageChordingAnimation', true);
      misc.set('homePageSpaceHintSeen', true);
      create();
      expect(text(el())).not.toContain('home-page.summary.1');
      tick(220);
      fixture.detectChanges();
      const typed = el()
        .querySelector('.h-6')!
        .textContent!.replace('_', '')
        .trim();
      expect(['c', 'm']).toContain(typed);
      expect(el().querySelector('.h-6 span')?.textContent).toBe('_');
      discardPeriodicTasks();
      fixture.destroy();
    }));

    it('shows the layout of the space hint in full, without guides', async () => {
      misc.set('homePageSpaceHintSeen', true);
      create();
      component.toggleSpaceHint();
      await settle();
      const c = hintLayout();
      expect(c.alwaysShowLayout()).toBeTrue();
      expect(c.alwaysHideLayoutGuides()).toBeTrue();
      expect(c.strokeWidth()).toBe(6);
    });

    it('keeps the last device name on the screen, and erases the others', fakeAsync(() => {
      visibility.set('homePageChordingAnimation', true);
      misc.set('homePageSpaceHintSeen', true);
      create();
      const typed = CHORDING_TIMING['ctd'].reduce(
        (text, e) => (e.type === '+' ? text + e.c : text.slice(0, -1)),
        '',
      );
      const shown = () =>
        el().querySelector('.h-6')!.textContent!.replace('_', '').trim();
      tick(120000);
      fixture.detectChanges();
      expect(shown()).toBe(typed);
      expect(typed.length).toBeGreaterThan(0);
      tick(120000);
      fixture.detectChanges();
      expect(shown()).toBe(typed);
      discardPeriodicTasks();
      fixture.destroy();
    }));

    it('starts the animation when the summary is clicked', fakeAsync(() => {
      misc.set('homePageSpaceHintSeen', true);
      create();
      expect(component.useAnimation()).toBeFalse();
      (el().querySelector('.cursor-pointer') as HTMLElement).click();
      fixture.detectChanges();
      expect(component.useAnimation()).toBeTrue();
      expect(el().querySelector('.h-6')).not.toBeNull();
      tick(60000);
      discardPeriodicTasks();
      fixture.destroy();
    }));
  });

  describe('links', () => {
    it('opens the source code, the dev note and alnilam in new tabs', () => {
      create();
      const links = Array.from(
        el().querySelectorAll('div > a'),
      ) as HTMLAnchorElement[];
      expect(links.map((a) => a.getAttribute('href'))).toEqual([
        'https://github.com/andy23512/alnitak',
        'home-page.dev-note-url',
        'https://andy23512.github.io/alnilam',
      ]);
      for (const a of links) {
        expect(a.target).toBe('_blank');
        expect(a.rel).toContain('noopener');
      }
      expect(links.map((a) => text(a))).toEqual([
        'code home-page.source-code',
        'article home-page.dev-note',
        'kid_star home-page.alnilam',
      ]);
    });
  });

  describe('default layout hints', () => {
    const hintButton = () =>
      Array.from(el().querySelectorAll('button')).find((b) =>
        text(b)?.includes('current-device-layout-hint'),
      ) as HTMLButtonElement | undefined;

    beforeEach(() => misc.set('homePageSpaceHintSeen', true));

    it('offers the M4G layout while the CC1/CC2 default is selected', () => {
      layouts.setSelectedId('default');
      create();
      expect(text(el())).toContain('cc1-cc2-default.0');
      expect(text(hintButton())).toBe(
        'home-page.current-device-layout-hint.cc1-cc2-default.1',
      );
      hintButton()!.click();
      expect(layouts.selectedId()).toBe('m4g-default');
      expect(visibility.layoutThumb3Switch()).toBeFalse();
    });

    it('offers the CC1/CC2 layout while the M4G default is selected', () => {
      layouts.setSelectedId('m4g-default');
      visibility.set('layoutThumb3Switch', false);
      create();
      expect(text(el())).toContain('m4g-default.0');
      hintButton()!.click();
      expect(layouts.selectedId()).toBe('default');
      expect(visibility.layoutThumb3Switch()).toBeTrue();
    });

    it('shows no hint for any other layout', () => {
      layouts.setSelectedId('right-hand-only');
      create();
      expect(hintButton()).toBeUndefined();
    });
  });
});
