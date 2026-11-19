import {
  ComponentFixture,
  discardPeriodicTasks,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { MatTooltip } from '@angular/material/tooltip';
import { By } from '@angular/platform-browser';
import { patchState } from '@ngrx/signals';
import { updateEntity } from '@ngrx/signals/entities';
import { provideRouter, Router } from '@angular/router';
import { HotkeysService } from '@ngneat/hotkeys';
import { provideTranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { ComboCounterComponent } from 'src/app/components/combo-counter/combo-counter.component';
import { LayoutComponent } from 'src/app/components/layout/layout.component';
import { SpeedometerComponent } from 'src/app/components/speedometer/speedometer.component';
import { ResolvedLesson } from 'src/app/models/topic.models';
import { KeyRecordService } from 'src/app/services/key-record.service';
import { AirModeSettingStore } from 'src/app/stores/air-mode-setting.store';
import { DeviceLayoutStore } from 'src/app/stores/device-layout.store';
import { LessonStore } from 'src/app/stores/lesson.store';
import { VisibilitySettingStore } from 'src/app/stores/visibility-setting.store';
import { Profile } from 'tangent-cc-lib';
import { LessonPageComponent } from './lesson-page.component';

const lesson = (over: Partial<ResolvedLesson> = {}): ResolvedLesson => ({
  id: 'lesson-1',
  name: 'lesson.one',
  components: ['a', 'b'],
  componentNames: [],
  topic: { id: 'topic-1', name: 'topic.one', type: 'character', lessons: [] },
  previousLessonUrl: '/topic/topic-1/lesson/prev',
  nextLessonUrl: '/topic/topic-1/lesson/next',
  ...over,
});

describe('LessonPageComponent', () => {
  let fixture: ComponentFixture<LessonPageComponent>;
  let component: LessonPageComponent;
  let navigateByUrl: jasmine.Spy;
  let shortcuts: Record<string, Subject<unknown>>;
  let shortcutOptions: Record<string, { allowIn?: string[] }>;
  let removed: string[][];
  let push: jasmine.Spy;
  let air: InstanceType<typeof AirModeSettingStore>;
  let visibility: InstanceType<typeof VisibilitySettingStore>;

  const el = () => fixture.nativeElement as HTMLElement;
  const text = (e: Element | null | undefined) =>
    e?.textContent?.replace(/\s+/g, ' ').trim().toLowerCase();
  const store = () => fixture.debugElement.injector.get(LessonStore);
  const input = () => el().querySelector('input') as HTMLInputElement;
  const layout = () =>
    fixture.debugElement.query(By.directive(LayoutComponent))
      .componentInstance as LayoutComponent;
  const button = (icon: string) =>
    Array.from(el().querySelectorAll('button')).find(
      (b) => b.querySelector('mat-icon')?.textContent === icon,
    ) as HTMLButtonElement | undefined;
  const focus = () => {
    input().dispatchEvent(new Event('focus'));
    fixture.detectChanges();
  };
  const blur = () => {
    input().dispatchEvent(new Event('blur'));
    fixture.detectChanges();
  };
  const typeChar = (data: string | null) => {
    input().dispatchEvent(new InputEvent('input', { data }));
    fixture.detectChanges();
  };

  beforeEach(() => {
    TestBed.resetTestingModule();
    localStorage.clear();
    shortcuts = {};
    shortcutOptions = {};
    removed = [];
    push = jasmine.createSpy('pushIntoQueue');
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideTranslateService(),
        { provide: KeyRecordService, useValue: { pushIntoQueue: push } },
        {
          provide: HotkeysService,
          useValue: {
            addShortcut: (o: { keys: string; allowIn?: string[] }) => {
              shortcutOptions[o.keys] = o;
              return (shortcuts[o.keys] = new Subject());
            },
            removeShortcuts: (k: string[]) => removed.push(k),
          },
        },
      ],
    });
    navigateByUrl = spyOn(TestBed.inject(Router), 'navigateByUrl');
    air = TestBed.inject(AirModeSettingStore);
    visibility = TestBed.inject(VisibilitySettingStore);
    spyOn(Math, 'random').and.returnValue(0); // every pick is the first component
  });

  afterEach(() => localStorage.clear());

  function create(l: ResolvedLesson = lesson()) {
    fixture = TestBed.createComponent(LessonPageComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('lesson', l);
    fixture.detectChanges();
  }

  it('fills the page', () => {
    create();
    for (const c of ['flex', 'flex-col', 'gap-2', 'h-full', 'relative']) {
      expect(el().classList).toContain(c);
    }
  });

  describe('lesson', () => {
    it('is given to the lesson store, which fills its queue from the characters', () => {
      create();
      expect(store().lessonId()).toBe('lesson-1');
      expect(store().topicId()).toBe('topic-1');
      expect(store().queue().length).toBe(20);
      expect(store().components()).toEqual(['a', 'b']);
    });

    it('starts over when another lesson arrives', () => {
      create();
      focus();
      typeChar('a');
      expect(store().combo()).toBe(1);
      fixture.componentRef.setInput(
        'lesson',
        lesson({ id: 'lesson-2', components: ['x'] }),
      );
      fixture.detectChanges();
      expect(store().lessonId()).toBe('lesson-2');
      expect(store().combo()).toBe(0);
      expect(store().components()).toEqual(['x']);
    });
  });

  describe('before the lesson starts', () => {
    beforeEach(() => create());

    it('shows the topic and the lesson name, and a start button with its key', () => {
      expect(text(el().querySelector('section'))).toBe(
        'topic.onearrow_right lesson.one',
      );
      const start = button('play_arrow')!;
      expect(text(start)).toBe('play_arrow lesson-page.start-action space');
      expect(button('pause')).toBeUndefined();
    });

    it('has a hidden text box that cannot bring up a keyboard', () => {
      expect(input().getAttribute('inputmode')).toBe('none');
      expect(input().getAttribute('title')).toBe('lesson-page.input-box-title');
      expect(input().classList).toContain('opacity-0');
    });

    it('shows the layout without a highlight, with the profile of the device layout', () => {
      expect(layout().highlightKeyCombination()).toBeNull();
      expect(layout().profile()).toBe(
        component.deviceLayout()?.profile ?? Profile.A,
      );
      expect(layout().showLayerGuides()).toBeTrue();
    });
  });

  describe('profile', () => {
    it('follows the profile of the selected device layout', () => {
      const layouts = TestBed.inject(DeviceLayoutStore);
      const selected = layouts.selectedEntity()!;
      patchState(
        layouts,
        updateEntity({ id: selected.id, changes: { profile: Profile.B } }),
      );
      create();
      expect(layout().profile()).toBe(Profile.B);
    });

    it('is A when no device layout is selected', () => {
      TestBed.inject(DeviceLayoutStore).setSelectedId('missing');
      create();
      expect(layout().profile()).toBe(Profile.A);
    });
  });

  describe('previous and next lesson', () => {
    const links = () =>
      Array.from(
        el().querySelectorAll('section ~ div a'),
      ) as HTMLAnchorElement[];

    it('links to both, when there are both', () => {
      create();
      expect(links().map((a) => a.getAttribute('href'))).toEqual([
        '/topic/topic-1/lesson/prev',
        '/topic/topic-1/lesson/next',
      ]);
      expect(links().map((a) => a.querySelector('button')!.disabled)).toEqual([
        false,
        false,
      ]);
      expect(links().map((a) => a.getAttribute('aria-label'))).toEqual([
        'lesson-page.previous-lesson-link.aria-label',
        'lesson-page.next-lesson-link.aria-label',
      ]);
    });

    it('disables the one that does not exist', () => {
      create(lesson({ previousLessonUrl: null }));
      expect(links().map((a) => a.querySelector('button')!.disabled)).toEqual([
        true,
        false,
      ]);
      create(lesson({ nextLessonUrl: null }));
      expect(links().map((a) => a.querySelector('button')!.disabled)).toEqual([
        false,
        true,
      ]);
    });

    it('shows a tooltip only for the links that exist', () => {
      const disabled = () =>
        fixture.debugElement
          .queryAll(By.directive(MatTooltip))
          .filter((d) => d.nativeElement.tagName === 'A')
          .map((d) => (d.injector.get(MatTooltip) as MatTooltip).disabled);
      create();
      expect(disabled()).toEqual([false, false]);
      create(lesson({ previousLessonUrl: null }));
      expect(disabled()).toEqual([true, false]);
      create(lesson({ nextLessonUrl: null }));
      expect(disabled()).toEqual([false, true]);
    });

    it('hides them while the lesson is running', () => {
      create();
      focus();
      expect(links().length).toBe(0);
    });
  });

  describe('while the lesson runs', () => {
    beforeEach(() => {
      create();
      focus();
    });

    it('shows the typed history and the queue to type, and a pause button', () => {
      expect(el().querySelector('section')!.textContent).toContain('...');
      expect(button('pause')).toBeDefined();
      expect(text(button('pause'))).toBe('pause lesson-page.pause-action esc');
      expect(button('play_arrow')).toBeUndefined();
      expect(text(el().querySelector('section'))).not.toContain('lesson.one');
    });

    it('shows what was typed so far', () => {
      typeChar('a');
      expect(el().querySelector('section > span')!.textContent).toBe('  a');
    });

    it('highlights the keys of the character to type', () => {
      const h = layout().highlightKeyCombination()!;
      expect(h).toBeTruthy();
      expect(h).toBe(component.highlightCharacterKeyCombinationMap()['a']);
    });

    it('labels the keys of the lesson characters', () => {
      const labels = Object.values(component.keyLabelMap()).flat();
      const chars = new Set(
        labels.filter((l) => 'c' in l).map((l) => (l as { c: string }).c),
      );
      expect(chars.has('a')).toBeTrue();
      expect(chars.has('b')).toBeTrue();
      expect(chars.has('c')).toBeFalse();
    });

    it('stops the highlight when the text box loses focus, and pauses', () => {
      typeChar('a');
      blur();
      expect(layout().highlightKeyCombination()).toBeNull();
      expect(store().lastCorrectKeyTime()).toBeNull();
      expect(button('play_arrow')).toBeDefined();
    });
  });

  describe('typing', () => {
    beforeEach(() => {
      create();
      focus();
    });

    it('takes a correct character into the history and counts the combo', () => {
      typeChar('a');
      expect(store().history()).toEqual([' ', ' ', 'a']);
      expect(store().combo()).toBe(1);
      expect(store().error()).toBeFalse();
    });

    it('marks a wrong character as an error, and shows what was typed', () => {
      typeChar('b');
      expect(store().error()).toBeTrue();
      expect(store().combo()).toBe(0);
      expect(store().lastErrorComponent()).toBe('b');
      const marker = el().querySelector('section span.relative')!;
      expect(marker.className).toContain('before:!border-t-red-500');
      expect(marker.querySelector('span')!.className).toContain(
        'first:text-red-500',
      );
    });

    it('ignores input that is not exactly one character', () => {
      typeChar(null);
      typeChar('ab');
      typeChar('');
      expect(store().combo()).toBe(0);
      expect(push).not.toHaveBeenCalled();
    });

    it('ignores the two-character tilde that a dead key sends (recorded behavior: normalizeInputData is never reached)', () => {
      fixture.componentRef.setInput('lesson', lesson({ components: ['~'] }));
      fixture.detectChanges();
      typeChar(' \u0303');
      expect(store().combo()).toBe(0);
      expect(store().history()).toEqual([' ', ' ', ' ']);
    });

    it('types a tilde that arrives as one character', () => {
      fixture.componentRef.setInput('lesson', lesson({ components: ['~'] }));
      fixture.detectChanges();
      typeChar('~');
      expect(store().history()[2]).toBe('~');
    });

    it('does not type by hand while air mode is on', () => {
      air.set('enabled', true);
      typeChar('a');
      expect(store().combo()).toBe(0);
    });
  });

  describe('air mode', () => {
    it('types by itself at the set speed after the start', fakeAsync(() => {
      air.set('enabled', true);
      air.set('characterEntrySpeed', 600); // one character every 100 ms
      create();
      component.startLesson();
      tick(100);
      expect(store().combo()).toBe(1);
      tick(300);
      expect(store().combo()).toBe(4);
      discardPeriodicTasks();
      fixture.destroy();
    }));

    it('does not type by itself when it is off', fakeAsync(() => {
      create();
      component.startLesson();
      tick(5000);
      expect(store().combo()).toBe(0);
      fixture.destroy();
    }));

    it('stops typing when the page is destroyed', fakeAsync(() => {
      air.set('enabled', true);
      air.set('characterEntrySpeed', 600);
      create();
      component.startLesson();
      tick(100);
      const lessonStore = store();
      fixture.destroy();
      tick(1000);
      expect(lessonStore.combo()).toBe(1);
    }));
  });

  describe('starting and pausing', () => {
    beforeEach(() => create());

    it('focuses the text box when the start button is clicked', () => {
      const focusSpy = spyOn(input(), 'focus');
      button('play_arrow')!.click();
      expect(focusSpy).toHaveBeenCalledTimes(1);
    });

    it('pauses the lesson from the pause button', () => {
      focus();
      const pause = spyOn(store(), 'pauseLesson');
      button('pause')!.click();
      expect(pause).toHaveBeenCalledTimes(1);
    });
  });

  describe('error tooltip', () => {
    beforeEach(() => {
      create();
      focus();
    });

    it('shows the tooltip while there is an error, and hides it after a correct character', () => {
      const tooltip = component.errorTooltip()!;
      const show = spyOn(tooltip, 'show');
      const hide = spyOn(tooltip, 'hide');
      typeChar('b');
      TestBed.tick();
      expect(show).toHaveBeenCalled();
      typeChar('a');
      TestBed.tick();
      expect(hide).toHaveBeenCalled();
    });

    it('can be turned off with the visibility setting', () => {
      visibility.set('entryErrorTooltip', false);
      fixture.detectChanges();
      expect(component.errorTooltip()!.disabled).toBeTrue();
    });
  });

  describe('hotkeys', () => {
    beforeEach(() => create());

    it('listens to the four shortcuts, and the pause one also inside the text box', () => {
      expect(Object.keys(shortcuts).sort()).toEqual([
        'escape',
        'meta.left',
        'meta.right',
        'space',
      ]);
      expect(shortcutOptions['escape'].allowIn).toEqual(['INPUT']);
      expect(shortcutOptions['space'].allowIn).toBeUndefined();
    });

    it('goes to the previous and the next lesson', () => {
      shortcuts['meta.left'].next({});
      expect(navigateByUrl).toHaveBeenCalledOnceWith(
        '/topic/topic-1/lesson/prev',
      );
      shortcuts['meta.right'].next({});
      expect(navigateByUrl).toHaveBeenCalledWith('/topic/topic-1/lesson/next');
    });

    it('does nothing when there is no such lesson', () => {
      create(lesson({ previousLessonUrl: null, nextLessonUrl: null }));
      shortcuts['meta.left'].next({});
      shortcuts['meta.right'].next({});
      expect(navigateByUrl).not.toHaveBeenCalled();
    });

    it('starts the lesson with space', () => {
      const focusSpy = spyOn(input(), 'focus');
      shortcuts['space'].next({});
      expect(focusSpy).toHaveBeenCalled();
    });

    it('takes the focus away with escape', () => {
      const blurSpy = spyOn(input(), 'blur');
      shortcuts['escape'].next({});
      expect(blurSpy).toHaveBeenCalled();
    });

    it('removes all four when destroyed', () => {
      fixture.destroy();
      expect(removed.length).toBe(1);
      expect([...removed[0]].sort()).toEqual([
        'escape',
        'meta.left',
        'meta.right',
        'space',
      ]);
    });
  });

  describe('fading layout', () => {
    beforeEach(() => {
      create();
      focus();
    });
    const layoutEl = () => el().querySelector('app-layout') as HTMLElement;

    it('stays visible for the first characters, with a fast transition', () => {
      expect(layoutEl().classList).not.toContain('opacity-0');
      expect(layoutEl().style.transitionDuration).toBe('100ms');
    });

    it('fades out slowly once the combo is over 20', () => {
      store().airType; // combo is driven through the store directly
      for (let i = 0; i < 21; i++) {
        store().type('a');
      }
      fixture.detectChanges();
      expect(store().combo()).toBe(21);
      expect(layoutEl().classList).toContain('opacity-0');
      expect(layoutEl().style.transitionDuration).toBe('10000ms');
    });

    it('stays visible in air mode', () => {
      air.set('enabled', true);
      for (let i = 0; i < 21; i++) {
        store().airType();
      }
      fixture.detectChanges();
      expect(layoutEl().classList).not.toContain('opacity-0');
    });

    it('starts the slow transition at exactly 20', () => {
      for (let i = 0; i < 20; i++) {
        store().type('a');
      }
      fixture.detectChanges();
      expect(layoutEl().style.transitionDuration).toBe('10000ms');
      expect(layoutEl().classList).not.toContain('opacity-0');
    });
  });

  describe('counters', () => {
    it('shows the combo counter and the speedometer with the lesson values', () => {
      create();
      focus();
      typeChar('a');
      const combo = fixture.debugElement.query(
        By.directive(ComboCounterComponent),
      );
      const speed = fixture.debugElement.query(
        By.directive(SpeedometerComponent),
      );
      expect(combo.componentInstance.combo()).toBe(1);
      expect(speed.componentInstance.maxSpeed()).toBe(200);
      expect(speed.componentInstance.speed()).toBe(store().cpm());
      expect(speed.componentInstance.speedUnit()).toBe(
        'general.character-entry-speed-unit',
      );
    });

    it('shows the speed of the last correct characters', () => {
      create();
      focus();
      const now = spyOn(Date, 'now');
      now.and.returnValue(1000);
      typeChar('a');
      now.and.returnValue(1200); // 200 ms per character = 300 per minute
      typeChar('a');
      now.and.returnValue(1400);
      typeChar('a');
      expect(store().cpm()).toBe(300);
      const speed = fixture.debugElement.query(
        By.directive(SpeedometerComponent),
      );
      expect(speed.componentInstance.speed()).toBe(300);
    });

    it('dims them while the lesson runs', () => {
      create();
      const combo = () => el().querySelector('app-combo-counter')!;
      expect(combo().classList).not.toContain('opacity-50');
      focus();
      expect(combo().classList).toContain('opacity-50');
    });

    it('can be hidden with the visibility setting', () => {
      visibility.set('comboCounter', false);
      visibility.set('speedometer', false);
      create();
      expect(el().querySelector('app-combo-counter')).toBeNull();
      expect(el().querySelector('app-speedometer')).toBeNull();
    });
  });
});
