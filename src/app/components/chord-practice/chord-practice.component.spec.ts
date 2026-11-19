import {
  ComponentFixture,
  TestBed,
  discardPeriodicTasks,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { HotkeysService } from '@ngneat/hotkeys';
import { patchState } from '@ngrx/signals';
import { provideTranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { ChordWithChordKeys } from 'src/app/models/chord.models';
import { AirModeSettingStore } from 'src/app/stores/air-mode-setting.store';
import { ChordPracticeStore } from 'src/app/stores/chord-practice.store';
import { VisibilitySettingStore } from 'src/app/stores/visibility-setting.store';
import { Layer } from 'tangent-cc-lib';
import { ChordPracticeComponent } from './chord-practice.component';

// In the default device layout the action code of a letter is its char code.
const A = 97;
const B = 98;
const chord = (
  id: string,
  inputCodes: number[],
  text: string,
): ChordWithChordKeys => ({
  id,
  input: inputCodes,
  output: [],
  inputKeys: [],
  outputKeys: [...text].map((c) => ({ type: 'character' as const, value: c })),
  outputText: text,
});

describe('ChordPracticeComponent', () => {
  let fixture: ComponentFixture<ChordPracticeComponent>;
  let component: ChordPracticeComponent;
  let store: InstanceType<typeof ChordPracticeStore>;
  let hotkeys: HotkeysService;
  let shortcuts: Record<string, Subject<unknown>>;
  let removed: unknown[][];

  const el = () => fixture.nativeElement as HTMLElement;
  const input = () => el().querySelector('input') as HTMLInputElement;
  const startButton = () => el().querySelector('button') as HTMLButtonElement;
  async function settle() {
    // the speedometer's timer keeps the zone busy, so whenStable() would never resolve
    fixture.detectChanges();
  }
  function setup() {
    TestBed.resetTestingModule();
    localStorage.clear();
    shortcuts = {};
    removed = [];
    TestBed.configureTestingModule({
      imports: [ChordPracticeComponent],
      providers: [provideTranslateService()],
    });
    hotkeys = TestBed.inject(HotkeysService);
    spyOn(hotkeys, 'addShortcut').and.callFake(((o: { keys: string }) => {
      shortcuts[o.keys] = new Subject();
      return shortcuts[o.keys];
    }) as never);
    spyOn(hotkeys, 'removeShortcuts').and.callFake(((k: unknown[]) => {
      removed.push(k);
    }) as never);
    store = TestBed.inject(ChordPracticeStore);
    fixture = TestBed.createComponent(ChordPracticeComponent);
    component = fixture.componentInstance;
  }
  function begin(chords: ChordWithChordKeys[]) {
    store.setChords(chords);
    patchState(store, { queue: chords });
    fixture.detectChanges();
  }

  beforeEach(() => {
    setup();
    fixture.detectChanges();
  });

  afterEach(() => localStorage.clear());

  describe('layout of the page', () => {
    it('is a full-height column with a title bar', () => {
      expect(el().classList).toContain('flex-col');
      expect(el().classList).toContain('h-full');
      expect(
        el().querySelector('section')?.textContent?.toLowerCase(),
      ).toContain('chord-page.chord-practice.title');
    });

    it('has a start button over the typing area', () => {
      expect(startButton().textContent?.toLowerCase()).toContain(
        'general.start-action',
      );
      expect(startButton().querySelector('mat-icon')?.textContent).toBe(
        'play_arrow',
      );
    });

    it('has a hidden text input that does not bring up a keyboard', () => {
      expect(input().type).toBe('text');
      expect(input().getAttribute('inputmode')).toBe('none');
    });
  });

  describe('words and typing', () => {
    it('shows the queued chords, the history and the typed buffer', () => {
      begin([chord('1', [A], 'ab'), chord('2', [B], 'cd')]);
      store.input({ inputType: 'insertText', data: 'a' } as InputEvent);
      fixture.detectChanges();
      const text = el().textContent!.replace(/\s+/g, '');
      expect(text).toContain('abcd');
      expect(el().querySelector('.text-alnitak-300')?.textContent?.trim()).toBe(
        'a',
      );
    });

    it('forwards the input event of the text box to the store', () => {
      begin([chord('1', [A], 'ab')]);
      input().value = 'z';
      const spy = spyOn(store, 'input');
      input().dispatchEvent(
        new InputEvent('input', { data: 'z', inputType: 'insertText' }),
      );
      expect(spy).toHaveBeenCalledTimes(1);
      expect((spy.calls.mostRecent().args[0] as InputEvent).data).toBe('z');
    });

    it('shows a history of the words that were typed', () => {
      begin([chord('1', [A], 'a'), chord('2', [B], 'b')]);
      for (const c of 'a') {
        store.input({ inputType: 'insertText', data: c } as InputEvent);
      }
      fixture.detectChanges();
      expect(el().querySelector('.history')?.textContent?.trim()).toBe('a');
    });
  });

  describe('focus', () => {
    it('starts unfocused and follows the text box', () => {
      expect(component.isFocus()).toBeFalse();
      input().dispatchEvent(new Event('focus'));
      expect(component.isFocus()).toBeTrue();
      input().dispatchEvent(new Event('blur'));
      expect(component.isFocus()).toBeFalse();
    });

    it('focuses the text box when the practice starts', () => {
      const focus = spyOn(input(), 'focus');
      startButton().click();
      expect(focus).toHaveBeenCalled();
    });

    it('blurs it when the practice ends', () => {
      const blur = spyOn(input(), 'blur');
      component.endPractice();
      expect(blur).toHaveBeenCalled();
    });
  });

  describe('hotkeys', () => {
    it('listens to space to start and escape to pause, escape also inside inputs', () => {
      expect(component.shortcuts).toEqual({
        startPractice: 'space',
        pausePractice: 'escape',
      });
      const calls = (hotkeys.addShortcut as jasmine.Spy).calls
        .allArgs()
        .map((a) => a[0]);
      expect(calls).toEqual([
        { keys: 'space' },
        { keys: 'escape', allowIn: ['INPUT'] },
      ]);
    });

    it('starts the practice on space and pauses it on escape', () => {
      const focus = spyOn(input(), 'focus');
      const blur = spyOn(input(), 'blur');
      shortcuts['space'].next(null);
      expect(focus).toHaveBeenCalledTimes(1);
      shortcuts['escape'].next(null);
      expect(blur).toHaveBeenCalledTimes(1);
    });

    it('removes both shortcuts when destroyed', () => {
      fixture.destroy();
      expect(removed).toEqual([['space', 'escape']]);
    });
  });

  describe('air mode', () => {
    it('does not type by itself when air mode is off', fakeAsync(() => {
      setup();
      fixture.detectChanges();
      begin([chord('1', [A], 'a'), chord('2', [B], 'b')]);
      const spy = spyOn(store, 'airType');
      component.startPractice();
      tick(10_000);
      expect(spy).not.toHaveBeenCalled();
    }));

    it('types one chord per interval of the chord speed when air mode is on', fakeAsync(() => {
      setup();
      TestBed.inject(AirModeSettingStore).set('enabled', true);
      TestBed.inject(AirModeSettingStore).set('chordSpeed', 60); // one chord a second
      fixture.detectChanges();
      begin([chord('1', [A], 'a'), chord('2', [B], 'b')]);
      const spy = spyOn(store, 'airType');
      component.startPractice();
      tick(999);
      expect(spy).not.toHaveBeenCalled();
      tick(1);
      expect(spy).toHaveBeenCalledTimes(1);
      tick(3000);
      expect(spy).toHaveBeenCalledTimes(4);
      fixture.destroy();
      tick(5000);
      expect(spy).toHaveBeenCalledTimes(4);
      discardPeriodicTasks();
    }));
  });

  describe('key labels and highlight', () => {
    it('labels the keys of the characters used by the chords', () => {
      begin([chord('1', [A, B], 'ab')]);
      const labels = Object.values(component.keyLabelMap()).flat();
      expect([...new Set(labels.map((l) => l.c))].sort()).toEqual(['a', 'b']);
      for (const l of labels) {
        expect(l.title).toBe('general.character-tooltip');
      }
    });

    it('labels each character once, even if several chords use it', () => {
      begin([chord('1', [A], 'x'), chord('2', [A, B], 'y')]);
      const labels = Object.values(component.keyLabelMap()).flat();
      expect(labels.filter((l) => l.c === 'a').length).toBe(1);
    });

    it('has no labels before chords are set', () => {
      expect(component.keyLabelMap()).toEqual({});
    });

    it('highlights the position codes of the keys of each chord in the primary layer', () => {
      begin([chord('1', [A, B], 'ab')]);
      const h = component.highlightChordKeyCombinationMap()['1'];
      expect(h.layer).toBe(Layer.Primary);
      expect(h.positionCodes.length).toBe(2);
      expect(h.shiftKey).toBeFalse();
      expect(h.altGraphKey).toBeFalse();
      expect(h.useLayerLock).toBeFalse();
      const labelled = Object.keys(component.keyLabelMap()).map(Number).sort();
      expect([...h.positionCodes].sort()).toEqual(labelled);
    });

    it('skips a chord with an action code that is not on the layout', () => {
      begin([chord('1', [A], 'a'), chord('2', [A, 999999], 'x')]);
      const map = component.highlightChordKeyCombinationMap();
      expect(map['1']).toBeDefined();
      expect(map['2']).toBeUndefined();
    });

    it('highlights the chord at the front of the queue', () => {
      begin([chord('1', [A], 'a'), chord('2', [B], 'b')]);
      expect(component.highlightKeyCombination()).toBe(
        component.highlightChordKeyCombinationMap()['1'],
      );
    });

    it('draws the highlight only while the text box has focus', async () => {
      begin([chord('1', [A], 'a')]);
      const layout = () =>
        fixture.debugElement.children.find((c) => c.name === 'app-layout')!
          .componentInstance;
      expect(layout().highlightKeyCombination()).toBeNull();
      input().dispatchEvent(new Event('focus'));
      await settle();
      expect(layout().highlightKeyCombination()).toBe(
        component.highlightKeyCombination(),
      );
    });
  });

  describe('layout and speedometer', () => {
    const layout = () =>
      fixture.debugElement.children.find((c) => c.name === 'app-layout')!
        .componentInstance;
    const speedometer = () => el().querySelector('app-speedometer');

    it('hides the third thumb switch when the setting says so', async () => {
      expect(layout().showThumb3Switch()).toBeTrue();
      TestBed.inject(VisibilitySettingStore).set('layoutThumb3Switch', false);
      await settle();
      expect(layout().showThumb3Switch()).toBeFalse();
    });

    it('shows the speedometer by default, at 100 chords per minute full scale', () => {
      expect(speedometer()).toBeTruthy();
      const sp = fixture.debugElement.children.find(
        (c) => c.name === 'app-speedometer',
      )!.componentInstance;
      expect(sp.maxSpeed()).toBe(100);
      expect(sp.speedUnit()).toBe('general.chord-speed-unit');
      expect(sp.speed()).toBe(store.chpm());
    });

    it('hides the speedometer when the setting is off', () => {
      setup();
      TestBed.inject(VisibilitySettingStore).set('speedometer', false);
      fixture.detectChanges();
      expect(speedometer()).toBeNull();
    });
  });
});
