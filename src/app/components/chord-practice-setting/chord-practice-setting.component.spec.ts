import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSelectionListChange } from '@angular/material/list';
import { provideTranslateService } from '@ngx-translate/core';
import { ChordWithChordKeys } from 'src/app/models/chord.models';
import { ChordStore } from 'src/app/stores/chord.store';
import { ChordPracticeSettingComponent } from './chord-practice-setting.component';

const chord = (id: string, text: string): ChordWithChordKeys => ({
  id,
  input: [1],
  output: [2],
  inputKeys: [{ type: 'character', value: text }],
  outputKeys: [{ type: 'character', value: text.toUpperCase() }],
  outputText: text.toUpperCase(),
});

describe('ChordPracticeSettingComponent', () => {
  let fixture: ComponentFixture<ChordPracticeSettingComponent>;
  let component: ChordPracticeSettingComponent;
  let store: InstanceType<typeof ChordStore>;

  const el = () => fixture.nativeElement as HTMLElement;
  const options = () =>
    Array.from(el().querySelectorAll('mat-list-option')) as HTMLElement[];
  const startButton = () =>
    Array.from(el().querySelectorAll('button')).find(
      (b) => b.querySelector('mat-icon')?.textContent === 'play_arrow',
    ) as HTMLButtonElement;
  function render(chords: ChordWithChordKeys[], selected: string[] = []) {
    fixture.componentRef.setInput('chords', chords);
    fixture.componentRef.setInput('selectedChordIds', new Set(selected));
    fixture.detectChanges();
  }
  async function pick(content: string) {
    const input = el().querySelector('input[type=file]') as HTMLInputElement;
    const transfer = new DataTransfer();
    transfer.items.add(
      new File([content], 'chords.json', { type: 'application/json' }),
    );
    input.files = transfer.files;
    component.loadChordFile();
    await new Promise((r) => setTimeout(r, 50));
  }

  beforeEach(async () => {
    TestBed.resetTestingModule();
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [ChordPracticeSettingComponent],
      providers: [provideTranslateService()],
    }).compileComponents();
    store = TestBed.inject(ChordStore);
    fixture = TestBed.createComponent(ChordPracticeSettingComponent);
    component = fixture.componentInstance;
    render([]);
  });

  afterEach(() => localStorage.clear());

  it('is a column with a title bar and three steps', () => {
    expect(el().classList).toContain('flex-col');
    expect(el().querySelector('section')?.textContent?.toLowerCase()).toContain(
      'chord-page.chord-practice-setting.title',
    );
    expect(el().querySelectorAll('ol > li').length).toBe(3);
  });

  describe('choosing chords', () => {
    it('lists each chord with its input keys, an arrow and its output keys', () => {
      render([chord('a', 'x'), chord('b', 'y')]);
      expect(options().length).toBe(2);
      expect(options()[0].textContent?.replace(/\s+/g, ' ').trim()).toBe(
        'x -> X',
      );
      expect(options()[1].textContent?.replace(/\s+/g, ' ').trim()).toBe(
        'y -> Y',
      );
    });

    it('selects the chords whose ids are in the selected set', () => {
      render([chord('a', 'x'), chord('b', 'y')], ['b']);
      expect(options().map((o) => o.getAttribute('aria-selected'))).toEqual([
        'false',
        'true',
      ]);
    });

    it('passes on selection changes', () => {
      const events: MatSelectionListChange[] = [];
      component.selectionChange.subscribe((e) => events.push(e));
      const event = { options: [] } as unknown as MatSelectionListChange;
      component.onChordSelectionChange(event);
      expect(events).toEqual([event]);
    });

    it('emits a selection change when an option is clicked', () => {
      render([chord('a', 'x')]);
      const events: MatSelectionListChange[] = [];
      component.selectionChange.subscribe((e) => events.push(e));
      options()[0].click();
      fixture.detectChanges();
      expect(events.length).toBe(1);
      expect(events[0].options[0].value.id).toBe('a');
    });
  });

  describe('start button', () => {
    it('is disabled while no chord is selected', () => {
      render([chord('a', 'x')], []);
      expect(startButton().disabled).toBeTrue();
    });

    it('is enabled once a chord is selected', () => {
      render([chord('a', 'x')], ['a']);
      expect(startButton().disabled).toBeFalse();
    });

    it('emits startPractice when pressed', () => {
      render([chord('a', 'x')], ['a']);
      let count = 0;
      component.startPractice.subscribe(() => count++);
      startButton().click();
      expect(count).toBe(1);
    });
  });

  describe('importing a chord file', () => {
    it('accepts only json files and opens the chooser from the button', () => {
      const input = el().querySelector('input[type=file]') as HTMLInputElement;
      expect(input.accept).toBe('.json');
      const click = spyOn(input, 'click');
      (
        Array.from(el().querySelectorAll('button')).find(
          (b) => b.querySelector('mat-icon')?.textContent === 'upload',
        ) as HTMLButtonElement
      ).click();
      expect(click).toHaveBeenCalled();
    });

    it('does nothing when no file is chosen', () => {
      component.loadChordFile();
      expect(store.ids().length).toBe(0);
    });

    it('stores the chords of a plain chord file, with ids from the sorted input (the input keeps its order)', async () => {
      await pick(
        JSON.stringify({
          chords: [
            [[30, 10, 20], [97]],
            [
              [5, 4],
              [98, 99],
            ],
          ],
        }),
      );
      expect(store.entities()).toEqual([
        { id: '10_20_30', input: [30, 10, 20], output: [97] },
        { id: '4_5', input: [5, 4], output: [98, 99] },
      ]);
    });

    it('drops empty input slots', async () => {
      await pick(JSON.stringify({ chords: [[[0, 7, 0, 3], [97]]] }));
      expect(store.entities()).toEqual([
        { id: '3_7', input: [7, 3], output: [97] },
      ]);
    });

    it('takes the chords from the first history entry of a history file', async () => {
      await pick(
        JSON.stringify({
          history: [
            [
              { type: 'layout', layout: [] },
              { type: 'chords', chords: [[[2, 1], [65]]] },
            ],
          ],
        }),
      );
      expect(store.entities()).toEqual([
        { id: '1_2', input: [2, 1], output: [65] },
      ]);
    });

    // Current behavior: setEntities adds or replaces by id, so chords of an earlier
    // file stay. Chara's chords page does the same.
    it('keeps chords of an earlier import that the new file does not contain', async () => {
      await pick(JSON.stringify({ chords: [[[1], [65]]] }));
      await pick(JSON.stringify({ chords: [[[2], [66]]] }));
      expect(store.ids()).toEqual(['1', '2']);
    });

    it('replaces a chord with the same id', async () => {
      await pick(JSON.stringify({ chords: [[[1], [65]]] }));
      await pick(JSON.stringify({ chords: [[[1], [66]]] }));
      expect(store.entities()).toEqual([{ id: '1', input: [1], output: [66] }]);
    });

    it('ignores a history file without chords', async () => {
      await pick(JSON.stringify({ history: [[{ type: 'layout' }]] }));
      expect(store.ids().length).toBe(0);
    });

    it('ignores a file that holds null', async () => {
      await pick('null');
      expect(store.ids().length).toBe(0);
    });
  });
});
