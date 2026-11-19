import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideTranslateService } from '@ngx-translate/core';
import { HighlightSettingStore } from 'src/app/stores/highlight-setting.store';
import { KeySideDropdownComponent } from '../key-side-dropdown/key-side-dropdown.component';
import { SidesDropdownComponent } from '../sides-dropdown/sides-dropdown.component';
import { LayoutHighlightSettingPanelContentComponent } from './layout-highlight-setting-panel-content.component';

type Row = { layer: string; key: string; kind: 'sides' | 'key-side' };

/** The dropdowns in the order they are drawn. */
const ROWS: Row[] = [
  { layer: 'shiftLayer', key: 'preferSides', kind: 'sides' },
  { layer: 'shiftLayer', key: 'preferShiftSide', kind: 'key-side' },
  { layer: 'numShiftLayer', key: 'preferSides', kind: 'sides' },
  { layer: 'numShiftLayer', key: 'preferNumShiftSide', kind: 'key-side' },
  {
    layer: 'shiftAndNumShiftLayer',
    key: 'preferCharacterKeySide',
    kind: 'key-side',
  },
  { layer: 'shiftAndNumShiftLayer', key: 'preferShiftSide', kind: 'key-side' },
  { layer: 'fnShiftLayer', key: 'preferSides', kind: 'sides' },
  { layer: 'fnShiftLayer', key: 'preferFnShiftSide', kind: 'key-side' },
  {
    layer: 'shiftAndFnShiftLayer',
    key: 'preferCharacterKeySide',
    kind: 'key-side',
  },
  { layer: 'shiftAndFnShiftLayer', key: 'preferShiftSide', kind: 'key-side' },
  { layer: 'flagShiftLayer', key: 'preferSides', kind: 'sides' },
  { layer: 'flagShiftLayer', key: 'preferFlagShiftSide', kind: 'key-side' },
  {
    layer: 'shiftAndFlagShiftLayer',
    key: 'preferCharacterKeySide',
    kind: 'key-side',
  },
  {
    layer: 'shiftAndFlagShiftLayer',
    key: 'preferShiftSide',
    kind: 'key-side',
  },
];

describe('LayoutHighlightSettingPanelContentComponent', () => {
  let fixture: ComponentFixture<LayoutHighlightSettingPanelContentComponent>;
  let store: InstanceType<typeof HighlightSettingStore>;

  const dropdowns = () =>
    fixture.debugElement.queryAll(
      (d) =>
        d.componentInstance instanceof SidesDropdownComponent ||
        d.componentInstance instanceof KeySideDropdownComponent,
    );
  const read = (row: Row) => (store as any)[row.layer]()[row.key];
  const other = (row: Row) =>
    row.kind === 'sides'
      ? read(row) === 'both'
        ? 'same'
        : 'both'
      : read(row) === 'left'
        ? 'right'
        : 'left';
  async function settle() {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  beforeEach(async () => {
    TestBed.resetTestingModule();
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [LayoutHighlightSettingPanelContentComponent],
      providers: [provideTranslateService()],
    }).compileComponents();
    store = TestBed.inject(HighlightSettingStore);
    fixture = TestBed.createComponent(
      LayoutHighlightSettingPanelContentComponent,
    );
    await settle();
  });

  afterEach(() => localStorage.clear());

  it('has seven sections with a title each', () => {
    const titles = Array.from(fixture.nativeElement.querySelectorAll('h4')).map(
      (h) => ((h as HTMLElement).textContent ?? '').trim().toLowerCase(),
    );
    expect(titles).toEqual([
      'layout-highlight-setting.shift-layer',
      'layout-highlight-setting.num-shift-layer',
      'layout-highlight-setting.shift-num-shift-layer',
      'layout-highlight-setting.fn-shift-layer',
      'layout-highlight-setting.shift-fn-shift-layer',
      'layout-highlight-setting.flag-shift-layer',
      'layout-highlight-setting.shift-flag-shift-layer',
    ]);
  });

  it('has fourteen dropdowns, of the kind each setting needs', () => {
    expect(dropdowns().length).toBe(ROWS.length);
    ROWS.forEach((row, i) => {
      const instance = dropdowns()[i].componentInstance;
      expect(instance instanceof SidesDropdownComponent ? 'sides' : 'key-side')
        .withContext(`${row.layer}.${row.key}`)
        .toBe(row.kind);
    });
  });

  it('shows the current value in each dropdown', () => {
    ROWS.forEach((row, i) => {
      expect(dropdowns()[i].componentInstance.value())
        .withContext(`${row.layer}.${row.key}`)
        .toBe(read(row));
    });
  });

  ROWS.forEach((row, i) => {
    it(`writes ${row.layer}.${row.key} and nothing else`, async () => {
      const snapshot = JSON.stringify(
        ROWS.map((r) => [r.layer, r.key, read(r)]),
      );
      const value = other(row);
      dropdowns()[i].componentInstance.select.emit(value);
      await settle();
      expect(read(row)).toBe(value);
      const expected = JSON.parse(snapshot).map(
        ([l, k, v]: [string, string, string]) =>
          l === row.layer && k === row.key ? [l, k, value] : [l, k, v],
      );
      expect(ROWS.map((r) => [r.layer, r.key, read(r)])).toEqual(expected);
    });
  });

  it('binds each dropdown to its own setting', async () => {
    for (let i = 0; i < ROWS.length; i++) {
      (store as any).set(ROWS[i].layer, ROWS[i].key, other(ROWS[i]));
      await settle();
      ROWS.forEach((row, j) => {
        expect(dropdowns()[j].componentInstance.value())
          .withContext(
            `after changing ${ROWS[i].layer}.${ROWS[i].key}: ${row.layer}.${row.key}`,
          )
          .toBe(read(row));
      });
    }
  });

  it('shows a changed value in its dropdown', async () => {
    store.set('fnShiftLayer', 'preferSides', 'same');
    await settle();
    expect(dropdowns()[6].componentInstance.value()).toBe('same');
    expect(dropdowns()[0].componentInstance.value()).toBe('both');
  });

  it('puts the dropdowns in the sentence of the setting', () => {
    const first = fixture.debugElement.query(By.css('li')).nativeElement;
    expect(first.textContent).toContain(
      'layout-highlight-setting.key-combination-sides-choice.0',
    );
    expect(first.textContent).toContain(
      'layout-highlight-setting.key-combination-sides-choice.2',
    );
  });
});
