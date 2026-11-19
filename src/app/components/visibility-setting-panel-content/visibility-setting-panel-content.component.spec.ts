import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { provideTranslateService } from '@ngx-translate/core';
import { VisibilitySettingStore } from 'src/app/stores/visibility-setting.store';
import { KeyNotationHelpDialogComponent } from '../key-notation-help-dialog/key-notation-help-dialog.component';
import { Thumb3SwitchHelpDialogComponent } from '../thumb-3-switch-help-dialog/thumb-3-switch-help-dialog.component';
import { VisibilitySettingPanelContentComponent } from './visibility-setting-panel-content.component';

const KEYS = [
  'layout',
  'layoutTextGuide',
  'layoutKeyNotationGuide',
  'layoutThumb3Switch',
  'entryErrorTooltip',
  'comboCounter',
  'speedometer',
  'homePageChordingAnimation',
] as const;

describe('VisibilitySettingPanelContentComponent', () => {
  let fixture: ComponentFixture<VisibilitySettingPanelContentComponent>;
  let store: InstanceType<typeof VisibilitySettingStore>;
  let dialog: MatDialog;

  const rows = () =>
    Array.from(
      fixture.nativeElement.querySelectorAll('mat-checkbox'),
    ) as HTMLElement[];
  const box = (i: number) =>
    rows()[i].querySelector('input[type=checkbox]') as HTMLInputElement;
  const helpButtons = () =>
    Array.from(
      fixture.nativeElement.querySelectorAll('button'),
    ) as HTMLButtonElement[];
  async function settle() {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  beforeEach(async () => {
    TestBed.resetTestingModule();
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [VisibilitySettingPanelContentComponent],
      providers: [provideTranslateService()],
    }).compileComponents();
    store = TestBed.inject(VisibilitySettingStore);
    dialog = TestBed.inject(MatDialog);
    spyOn(dialog, 'open');
    fixture = TestBed.createComponent(VisibilitySettingPanelContentComponent);
    await settle();
  });

  afterEach(() => localStorage.clear());

  it('lists the eight settings in order', () => {
    expect(rows().length).toBe(8);
    const names = rows().map((r) => r.textContent?.toLowerCase() ?? '');
    const expected = [
      'visibility-setting.layout',
      'visibility-setting.layout-text-guide',
      'visibility-setting.layout-key-notation-guide',
      'visibility-setting.layout-thumb-3-switch',
      'visibility-setting.entry-error-tooltip',
      'visibility-setting.combo-counter',
      'visibility-setting.speedometer',
      'visibility-setting.home-page-chording-animation',
    ];
    expected.forEach((name, i) => {
      expect(names[i]).toContain(name);
    });
  });

  it('checks each box according to the store', () => {
    // defaults: key notation guide and home page animation are off
    expect(KEYS.map((_, i) => box(i).checked)).toEqual([
      true,
      true,
      false,
      true,
      true,
      true,
      true,
      false,
    ]);
  });

  it('writes each toggle to the store, without touching the others', async () => {
    for (let i = 0; i < KEYS.length; i++) {
      const before = KEYS.map((k) => store[k]());
      box(i).click();
      await settle();
      const after = KEYS.map((k) => store[k]());
      expect(after[i]).toBe(!before[i]);
      expect(after.filter((_, j) => j !== i)).toEqual(
        before.filter((_, j) => j !== i),
      );
    }
  });

  it('follows changes made in the store', async () => {
    store.set('speedometer', false);
    await settle();
    expect(box(6).checked).toBe(false);
  });

  describe('help buttons', () => {
    it('has one in the thumb 3 switch row and one in the key notation row only', () => {
      expect(helpButtons().length).toBe(2);
      expect(rows()[3].querySelector('button')).toBeTruthy();
      expect(rows()[2].querySelector('button')).toBeTruthy();
    });

    it('opens the thumb 3 switch help dialog', () => {
      rows()[3].querySelector('button')!.click();
      expect(dialog.open).toHaveBeenCalledOnceWith(
        Thumb3SwitchHelpDialogComponent,
      );
    });

    it('opens the key notation help dialog', () => {
      rows()[2].querySelector('button')!.click();
      expect(dialog.open).toHaveBeenCalledOnceWith(
        KeyNotationHelpDialogComponent,
      );
    });

    it('does not toggle the setting when its help button is pressed', async () => {
      const before = store.layoutThumb3Switch();
      rows()[3].querySelector('button')!.click();
      await settle();
      expect(store.layoutThumb3Switch()).toBe(before);
    });
  });
});
