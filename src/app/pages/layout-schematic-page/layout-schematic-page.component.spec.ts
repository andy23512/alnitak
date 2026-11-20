import {
  ComponentFixture,
  discardPeriodicTasks,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { MatSelect } from '@angular/material/select';
import { By } from '@angular/platform-browser';
import { provideTranslateService } from '@ngx-translate/core';
import { SwitchComponent } from 'src/app/components/switch/switch.component';
import { Layer } from 'tangent-cc-lib';
import { LayoutSchematicPageComponent } from './layout-schematic-page.component';

describe('LayoutSchematicPageComponent', () => {
  let fixture: ComponentFixture<LayoutSchematicPageComponent>;
  let component: LayoutSchematicPageComponent;

  const el = () => fixture.nativeElement as HTMLElement;
  const text = (e: Element | null | undefined) =>
    e?.textContent?.replace(/\s+/g, ' ').trim();
  const selects = () =>
    fixture.debugElement
      .queryAll(By.directive(MatSelect))
      .map((d) => d.componentInstance as MatSelect);
  const rows = () =>
    Array.from(
      el().querySelectorAll(':scope > div.flex.gap-3'),
    ) as HTMLElement[];
  const boxes = (row: HTMLElement) =>
    Array.from(row.querySelectorAll('div.size-8'));
  const lit = (list: Element[]) =>
    list.map((b) => b.classList.contains('bg-alnitak-500'));
  const outputText = (row: HTMLElement) =>
    text(row.querySelector('span.absolute'));
  const arrowsLit = (row: HTMLElement) =>
    Array.from(row.querySelectorAll('.arrow')).map((a) =>
      a.classList.contains('bg-alnitak-200'),
    );
  const switches = () =>
    fixture.debugElement
      .queryAll(By.directive(SwitchComponent))
      .map((d) => d.componentInstance as SwitchComponent);
  /** Runs the timer to its n-th tick (one tick every 750 ms; the first one comes at once). */
  function at(n: number) {
    tick(0);
    tick(750 * n);
    fixture.detectChanges();
  }

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [provideTranslateService()] });
  });

  function create() {
    fixture = TestBed.createComponent(LayoutSchematicPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('starts with QWERTY in English', fakeAsync(() => {
    create();
    at(0);
    expect(component.osLayoutName()).toBe('QWERTY');
    expect(component.currentLanguage()).toBe('en');
    expect(text(rows()[0])).toContain('Keyboard (Scancode)');
    expect(text(rows()[0])).toContain('OS Layout QWERTY');
    expect(text(rows()[0])).toContain('Output');
    discardPeriodicTasks();
  }));

  describe('choices', () => {
    it('offers five OS layouts and two languages', fakeAsync(() => {
      create();
      expect(selects()[0].options.map((o) => o.viewValue.trim())).toEqual([
        'QWERTY',
        'QWERTZ',
        'JCUKEN',
        'Standard Bopomofo',
        '大千注音',
      ]);
      expect(selects()[1].options.map((o) => o.viewValue.trim())).toEqual([
        'English',
        '繁體中文',
      ]);
      expect(selects()[0].value).toBe(0);
      expect(selects()[1].value).toBe('en');
      discardPeriodicTasks();
    }));

    it('has the keys of each OS layout', () => {
      create();
      expect(component.osLayouts.map((l) => [l.name, l.keys.join('')])).toEqual(
        [
          ['QWERTY', '1qaz'],
          ['QWERTZ', '1qay'],
          ['JCUKEN', '1йфя'],
          ['Standard Bopomofo', 'ㄅㄆㄇㄈ'],
          ['大千注音', 'ㄅㄆㄇㄈ'],
        ],
      );
      expect(component.osLayouts.map((l) => !!l.isBopomofo)).toEqual([
        false,
        false,
        false,
        true,
        true,
      ]);
    });

    it('switches the OS layout and shows its keys', fakeAsync(() => {
      create();
      selects()[0].options.get(2)!._selectViaInteraction();
      at(0);
      expect(component.osLayoutIndex()).toBe(2);
      expect(component.osLayoutName()).toBe('JCUKEN');
      expect(
        boxes(rows()[0])
          .map((b) => text(b))
          .slice(4),
      ).toEqual(['1', 'й', 'ф', 'я']);
      expect(text(rows()[0])).toContain('OS Layout JCUKEN');
      discardPeriodicTasks();
    }));

    it('switches the language of the headings, and not the layout names', fakeAsync(() => {
      create();
      selects()[1].options.get(1)!._selectViaInteraction();
      at(0);
      expect(component.currentLanguage()).toBe('zh_Hant');
      expect(text(rows()[0])).toContain('鍵盤 (掃描碼)');
      expect(text(rows()[0])).toContain('作業系統佈局 QWERTY');
      expect(text(rows()[0])).toContain('輸出');
      expect(text(rows()[1])).toContain('CC1 / M4G (裝置佈局)');
      discardPeriodicTasks();
    }));

    it('has an English and a Traditional Chinese set of headings with the same keys', () => {
      create();
      component.onLanguageChange('zh_Hant');
      const zh = component.text();
      component.onLanguageChange('en');
      expect(Object.keys(zh)).toEqual(Object.keys(component.text()));
      expect(zh).not.toEqual(component.text());
    });
  });

  describe('animation', () => {
    it('shows the first step at once, before the first timer tick', fakeAsync(() => {
      create();
      expect(component.timer()).toBe(0);
      expect(component.currentScancode()).toBe('1E');
      expect(component.currentKey()).toBeDefined();
      tick(0);
      expect(component.timer()).toBe(0);
      expect(component.currentScancode()).toBe('1E');
      discardPeriodicTasks();
    }));

    it('gives each key drawing one size class only', fakeAsync(() => {
      create();
      at(0);
      const drawings = Array.from(
        el().querySelectorAll('svg[viewBox="0 0 350 350"]'),
      );
      expect(drawings.length).toBe(2);
      for (const drawing of drawings) {
        expect(drawing.getAttribute('class')).toBe('size-20');
      }
      discardPeriodicTasks();
    }));

    it('starts at the first key, before anything lights up', fakeAsync(() => {
      create();
      at(0);
      expect(component.keyIndex()).toBe(0);
      expect(component.scancodeOn()).toBeFalse();
      expect(component.osOn()).toBeFalse();
      expect(component.outputPrintOn()).toBeFalse();
      expect(lit(boxes(rows()[0]))).toEqual(Array(8).fill(false));
      expect(outputText(rows()[0])).toBe('');
      discardPeriodicTasks();
    }));

    it('lights up the scancode, then the OS key, then prints the output, one step per 750 ms', fakeAsync(() => {
      create();
      at(1);
      expect([
        component.scancodeOn(),
        component.osOn(),
        component.outputPrintOn(),
      ]).toEqual([true, false, false]);
      expect(lit(boxes(rows()[0]))).toEqual([
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
      ]);
      expect(arrowsLit(rows()[0])).toEqual([true, false]);
      expect(text(rows()[0].querySelectorAll('div.w-12 span')[0])).toBe('1E');
      at(1);
      expect([
        component.scancodeOn(),
        component.osOn(),
        component.outputPrintOn(),
      ]).toEqual([true, true, false]);
      expect(lit(boxes(rows()[0]))).toEqual([
        true,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
      ]);
      expect(arrowsLit(rows()[0])).toEqual([true, true]);
      expect(text(rows()[0].querySelectorAll('div.w-12 span')[1])).toBe('1');
      expect(outputText(rows()[0])).toBe('');
      at(1);
      expect(component.outputPrintOn()).toBeTrue();
      expect(outputText(rows()[0])).toBe('1');
      discardPeriodicTasks();
    }));

    it('goes on to the next key after four steps, and wraps around after sixteen', fakeAsync(() => {
      create();
      at(4);
      expect(component.keyIndex()).toBe(1);
      expect(component.currentScancode()).toBe('14');
      expect(component.currentKey()).toBe('q');
      at(4);
      expect(component.keyIndex()).toBe(2);
      at(8);
      expect(component.keyIndex()).toBe(0);
      discardPeriodicTasks();
    }));

    it('names the scancode and the key of each step', fakeAsync(() => {
      create();
      const seen: string[] = [];
      at(0);
      for (let i = 0; i < 4; i++) {
        seen.push(`${component.currentScancode()}/${component.currentKey()}`);
        at(4);
      }
      expect(seen).toEqual(['1E/1', '14/q', '04/a', '1D/z']);
      discardPeriodicTasks();
    }));

    it('types the characters one after another for a normal layout', fakeAsync(() => {
      create();
      const out: string[] = [];
      for (let key = 0; key < 4; key++) {
        for (let phase = 0; phase < 4; phase++) {
          out.push(component.currentOutput());
          at(1);
        }
      }
      expect(out).toEqual([
        '',
        '',
        '',
        '1',
        'q'.slice(0, 0) + '1',
        '1',
        '1',
        '1q',
        '1q',
        '1q',
        '1q',
        '1qa',
        '1qa',
        '1qa',
        '1qa',
        '1qaz',
      ]);
      discardPeriodicTasks();
    }));

    it('shows one bopomofo symbol at a time, with the previous one still shown until the new one is printed', fakeAsync(() => {
      create();
      selects()[0].options.get(3)!._selectViaInteraction();
      at(0);
      const out: string[] = [];
      for (let i = 0; i < 16; i++) {
        out.push(component.currentOutput());
        at(1);
      }
      expect(out).toEqual([
        '',
        '',
        '',
        'ㄅ',
        'ㄅ',
        'ㄅ',
        'ㄅ',
        'ㄆ',
        'ㄆ',
        'ㄆ',
        'ㄆ',
        'ㄇ',
        'ㄇ',
        'ㄇ',
        'ㄇ',
        'ㄈ',
      ]);
      discardPeriodicTasks();
    }));

    it('underlines the output only for bopomofo layouts', fakeAsync(() => {
      create();
      at(3);
      const output = () =>
        rows()[0].querySelector('span.absolute') as HTMLElement;
      expect(output().classList).not.toContain('underline');
      selects()[0].options.get(4)!._selectViaInteraction();
      at(0);
      expect(component.osLayoutName()).toBe('大千注音');
      expect(output().classList).toContain('underline');
      discardPeriodicTasks();
    }));
  });

  describe('arrows and underline', () => {
    const arrowState = (row: HTMLElement) => ({
      arrows: arrowsLit(row),
      labels: Array.from(row.querySelectorAll('div.w-12 span')).map((x) =>
        x.classList.contains('!opacity-100'),
      ),
    });

    it('light up with the steps, in both rows', fakeAsync(() => {
      create();
      const expected = [
        [false, false],
        [true, false],
        [true, true],
        [true, true],
      ];
      at(0);
      for (const step of expected) {
        for (const row of rows()) {
          const state = arrowState(row);
          expect(state.arrows).toEqual(step);
          expect(state.labels).toEqual(step);
        }
        at(1);
      }
      discardPeriodicTasks();
    }));

    it('underline the output of bopomofo layouts, in both rows, and only those', fakeAsync(() => {
      create();
      at(0);
      const underlined = () =>
        rows().map((r) =>
          (r.querySelector('span.absolute') as HTMLElement).classList.contains(
            'underline',
          ),
        );
      expect(underlined()).toEqual([false, false]);
      selects()[0].options.get(3)!._selectViaInteraction();
      at(0);
      expect(underlined()).toEqual([true, true]);
      discardPeriodicTasks();
    }));
  });

  describe('device layout row', () => {
    it('shows two switches: one with the characters and one with the scancodes', fakeAsync(() => {
      create();
      at(0);
      expect(switches().length).toBe(2);
      const first = (s: SwitchComponent) =>
        Object.values(s.keyLabelMap())[0][0] as { c: string };
      expect(switches().map((s) => Object.keys(s.keyLabelMap()))).toEqual([
        ['1', '2', '3', '4'],
        ['1', '2', '3', '4'],
      ]);
      expect(first(switches()[0]).c).toBe('1');
      expect(first(switches()[1]).c).toBe('1E');
      discardPeriodicTasks();
    }));

    it('labels the keys with the characters and with the scancodes', () => {
      create();
      expect(
        Object.values(component.keyLabelMap).map(
          (l) => (l[0] as { c: string }).c,
        ),
      ).toEqual(['1', 'q', 'a', 'z']);
      expect(
        Object.values(component.scancodeLabelMap).map(
          (l) => (l[0] as { c: string }).c,
        ),
      ).toEqual(component.scancodes);
      expect(component.scancodes).toEqual(['1E', '14', '04', '1D']);
    });

    it('highlights the key of the step while the scancode is on, and nothing before', fakeAsync(() => {
      create();
      at(0);
      expect(
        switches().every(
          (s) => s.highlightKeyCombination()!.positionCodes.length === 0,
        ),
      ).toBeTrue();
      at(1);
      for (const s of switches()) {
        expect(s.highlightKeyCombination()!.positionCodes).toEqual([1]);
        expect(s.highlightKeyCombination()!.layer).toBe(Layer.Primary);
      }
      at(4);
      for (const s of switches()) {
        expect(s.highlightKeyCombination()!.positionCodes).toEqual([2]);
      }
      discardPeriodicTasks();
    }));

    it('draws the switches in full opacity with a thicker line and bigger labels', fakeAsync(() => {
      create();
      for (const s of switches()) {
        expect(s.highlightOpacity()).toBe(1);
        expect(s.strokeWidth()).toBe(4.375);
        expect(s.fontSize()).toBe(70);
      }
      discardPeriodicTasks();
    }));

    it('repeats the OS layout and the output next to them', fakeAsync(() => {
      create();
      at(3);
      expect(text(rows()[1])).toContain('CC1 / M4G (Device Layout)');
      expect(text(rows()[1])).toContain('OS Layout QWERTY');
      expect(outputText(rows()[1])).toBe(outputText(rows()[0]));
      expect(
        boxes(rows()[1])
          .map((b) => text(b))
          .slice(-4),
      ).toEqual(['1', 'q', 'a', 'z']);
      discardPeriodicTasks();
    }));
  });
});
