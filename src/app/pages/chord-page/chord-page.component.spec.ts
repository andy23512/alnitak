import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { HotkeysService } from '@ngneat/hotkeys';
import { patchState } from '@ngrx/signals';
import { setEntities } from '@ngrx/signals/entities';
import { Subject } from 'rxjs';
import { ChordPracticeComponent } from 'src/app/components/chord-practice/chord-practice.component';
import { ChordPracticeSettingComponent } from 'src/app/components/chord-practice-setting/chord-practice-setting.component';
import { ChordPracticeStore } from 'src/app/stores/chord-practice.store';
import { ChordStore } from 'src/app/stores/chord.store';
import { ChordPageComponent } from './chord-page.component';

// action codes of the plain letters in the default layout (the same ones the chord practice spec uses)
const A = 97;
const B = 98;
const UNKNOWN = 99999; // not an action and not an icon

describe('ChordPageComponent', () => {
  let fixture: ComponentFixture<ChordPageComponent>;
  let component: ChordPageComponent;
  let chordStore: InstanceType<typeof ChordStore>;

  const setting = () =>
    fixture.debugElement.query(
      (d) => d.componentInstance instanceof ChordPracticeSettingComponent,
    )?.componentInstance as ChordPracticeSettingComponent | undefined;
  const practice = () =>
    fixture.debugElement.query(
      (d) => d.componentInstance instanceof ChordPracticeComponent,
    );

  beforeEach(() => {
    TestBed.resetTestingModule();
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideTranslateService(),
        {
          provide: HotkeysService,
          useValue: {
            addShortcut: () => new Subject(),
            removeShortcuts: () => undefined,
          },
        },
      ],
    });
    chordStore = TestBed.inject(ChordStore);
    fixture = TestBed.createComponent(ChordPageComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => localStorage.clear());

  function load(
    ...chords: { id: string; input: number[]; output: number[] }[]
  ) {
    patchState(chordStore, setEntities(chords));
  }

  it('starts at the setting stage, without the practice', () => {
    fixture.detectChanges();
    expect(component.stage()).toBe('setting');
    expect(setting()).toBeDefined();
    expect(practice()).toBeNull();
  });

  describe('chords', () => {
    it('is empty without stored chords', () => {
      expect(component.chords()).toEqual([]);
    });

    it('turns each stored chord into keys and output text', () => {
      load({ id: '1', input: [A, B], output: [B, A] });
      const [chord] = component.chords();
      expect(chord.id).toBe('1');
      expect(chord.inputKeys).toEqual([
        { type: 'character', value: 'a' },
        { type: 'character', value: 'b' },
      ]);
      expect(chord.outputKeys).toEqual([
        { type: 'character', value: 'b' },
        { type: 'character', value: 'a' },
      ]);
      expect(chord.outputText).toBe('ba');
    });

    it('leaves out chords with an input or an output that has no key', () => {
      load(
        { id: 'ok', input: [A], output: [B] },
        { id: 'bad-input', input: [UNKNOWN], output: [B] },
        { id: 'bad-output', input: [A], output: [UNKNOWN] },
      );
      expect(component.chords().map((c) => c.id)).toEqual(['ok']);
    });

    it('leaves out a chord when only some of its keys are known', () => {
      load(
        { id: 'half-input', input: [A, UNKNOWN], output: [B] },
        { id: 'half-output', input: [A], output: [B, UNKNOWN] },
        { id: 'ok', input: [A, B], output: [A, B] },
      );
      expect(component.chords().map((c) => c.id)).toEqual(['ok']);
    });

    it('shows the chords it can use in the setting stage', () => {
      load(
        { id: '1', input: [A], output: [B] },
        { id: '2', input: [B], output: [A] },
      );
      fixture.detectChanges();
      expect(
        setting()!
          .chords()!
          .map((c) => c.id),
      ).toEqual(['1', '2']);
    });
  });

  describe('selection', () => {
    const change = (...changes: [string, boolean][]) =>
      component.onChordSelectionChange({
        options: changes.map(([id, selected]) => ({ selected, value: { id } })),
      } as never);

    it('starts with nothing selected', () => {
      expect(component.selectedChordIds().size).toBe(0);
    });

    it('adds the selected chords and removes the deselected ones', () => {
      change(['1', true], ['2', true]);
      expect([...component.selectedChordIds()]).toEqual(['1', '2']);
      change(['1', false]);
      expect([...component.selectedChordIds()]).toEqual(['2']);
    });

    it('passes the selection on to the setting', () => {
      load({ id: '1', input: [A], output: [B] });
      fixture.detectChanges();
      change(['1', true]);
      fixture.detectChanges();
      expect(setting()!.selectedChordIds().has('1')).toBeTrue();
    });
  });

  describe('starting the practice', () => {
    beforeEach(() => {
      load(
        { id: '1', input: [A], output: [B] },
        { id: '2', input: [B], output: [A] },
        { id: '3', input: [A, B], output: [A, B] },
      );
    });

    it('practices only the selected chords', () => {
      component.selectedChordIds.set(new Set(['1', '3']));
      component.startChordPractice();
      expect(
        TestBed.inject(ChordPracticeStore)
          .chords()!
          .map((c) => c.id),
      ).toEqual(['1', '3']);
    });

    it('moves to the practice stage and shows the practice instead of the setting', () => {
      component.selectedChordIds.set(new Set(['2']));
      fixture.detectChanges();
      component.startChordPractice();
      fixture.detectChanges();
      expect(component.stage()).toBe('practice');
      expect(setting()).toBeUndefined();
      expect(practice()).not.toBeNull();
    });

    it('starts when the start button of the setting is pressed', () => {
      component.selectedChordIds.set(new Set(['1']));
      fixture.detectChanges();
      const button = Array.from(
        fixture.nativeElement.querySelectorAll('button'),
      ).find(
        (b) =>
          (b as HTMLElement).querySelector('mat-icon')?.textContent ===
          'play_arrow',
      ) as HTMLButtonElement;
      button.click();
      fixture.detectChanges();
      expect(component.stage()).toBe('practice');
    });
  });
});
