import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { patchState } from '@ngrx/signals';
import { setEntities } from '@ngrx/signals/entities';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { config, of } from 'rxjs';
import { DeleteChordsConfirmDialogComponent } from 'src/app/components/delete-chords-confirm-dialog/delete-chords-confirm-dialog.component';
import { DeleteDeviceLayoutsConfirmDialogComponent } from 'src/app/components/delete-device-layouts-confirm-dialog/delete-device-layouts-confirm-dialog.component';
import { UiLanguage } from 'src/app/models/language-setting.models';
import { ChordStore } from 'src/app/stores/chord.store';
import { DeviceLayoutStore } from 'src/app/stores/device-layout.store';
import { LanguageSettingStore } from 'src/app/stores/language-setting.store';
import { SettingsPageComponent } from './settings-page.component';

describe('SettingsPageComponent', () => {
  let fixture: ComponentFixture<SettingsPageComponent>;
  let component: SettingsPageComponent;
  let dialogOpen: jasmine.Spy;
  let snackOpen: jasmine.Spy;
  let chordStore: InstanceType<typeof ChordStore>;
  let deviceLayoutStore: InstanceType<typeof DeviceLayoutStore>;
  let languageStore: InstanceType<typeof LanguageSettingStore>;
  let use: jasmine.Spy;
  let load: jasmine.Spy;

  const el = () => fixture.nativeElement as HTMLElement;
  const headers = () =>
    Array.from(
      el().querySelectorAll('mat-expansion-panel-header'),
    ) as HTMLElement[];
  const headerTexts = () =>
    headers().map((h) => h.textContent?.trim().toLowerCase());
  async function open(title: string) {
    headers()
      .find((h) => h.textContent?.toLowerCase().includes(title))!
      .click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }
  const buttonWith = (key: string) =>
    Array.from(el().querySelectorAll('button')).find((b) =>
      b.textContent?.toLowerCase().includes(key),
    ) as HTMLButtonElement;
  const chords = () => [{ id: '1', input: [1], output: [2] }];

  beforeEach(async () => {
    TestBed.resetTestingModule();
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [SettingsPageComponent],
      providers: [provideTranslateService()],
    }).compileComponents();
    dialogOpen = spyOn(TestBed.inject(MatDialog), 'open');
    snackOpen = spyOn(TestBed.inject(MatSnackBar), 'open');
    chordStore = TestBed.inject(ChordStore);
    deviceLayoutStore = TestBed.inject(DeviceLayoutStore);
    languageStore = TestBed.inject(LanguageSettingStore);
    use = spyOn(TestBed.inject(TranslateService), 'use');
    load = spyOn(deviceLayoutStore, 'load');
    fixture = TestBed.createComponent(SettingsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => localStorage.clear());

  /** RxJS reports an error thrown in a subscriber later (not as a test failure), so catch it here. */
  async function expectNoUnhandledError() {
    const onError = jasmine.createSpy('onUnhandledError');
    config.onUnhandledError = onError;
    try {
      await new Promise((resolve) => setTimeout(resolve));
    } finally {
      config.onUnhandledError = null;
    }
    expect(onError).not.toHaveBeenCalled();
  }

  const answer = (confirmed: boolean) =>
    dialogOpen.and.returnValue({
      afterClosed: () => of({ confirmed }),
    } as never);

  it('is a padded block with a title', () => {
    expect(el().classList).toContain('block');
    expect(el().classList).toContain('p-5');
    expect(el().querySelector('h2')?.textContent?.trim().toLowerCase()).toBe(
      'settings-page.title',
    );
  });

  it('has the setting panels in order', () => {
    expect(headerTexts()).toEqual(
      [
        'quick-setting',
        'visibility',
        'layout-highlight',
        'device-layout',
        'lesson',
        'air-mode',
        'data-deletion',
        'misc',
        'ui-language',
      ].map((n) => `settings-page.panel-header.${n}`),
    );
  });

  it('opens only the quick setting panel at first, and renders the content of open panels only', () => {
    const panels = Array.from(el().querySelectorAll('mat-expansion-panel'));
    expect(panels.map((p) => p.classList.contains('mat-expanded'))).toEqual([
      true,
      ...Array(8).fill(false),
    ]);
    expect(
      el().querySelector('app-quick-setting-panel-content'),
    ).not.toBeNull();
    expect(
      el().querySelector('app-visibility-setting-panel-content'),
    ).toBeNull();
  });

  it('renders the content of a panel when it is opened', async () => {
    await open('visibility');
    expect(
      el().querySelector('app-visibility-setting-panel-content'),
    ).not.toBeNull();
  });

  describe('deleting device layouts', () => {
    beforeEach(() => open('data-deletion'));

    it('asks first and does nothing until the answer is yes', () => {
      answer(false);
      buttonWith('delete-all-imported-device-layouts').click();
      expect(dialogOpen).toHaveBeenCalledOnceWith(
        DeleteDeviceLayoutsConfirmDialogComponent,
      );
      expect(load).not.toHaveBeenCalled();
      expect(snackOpen).not.toHaveBeenCalled();
    });

    it('reloads the layouts and tells the user when confirmed', () => {
      answer(true);
      buttonWith('delete-all-imported-device-layouts').click();
      expect(load).toHaveBeenCalledTimes(1);
      expect(snackOpen).toHaveBeenCalledOnceWith(
        'settings-page.message.device-layout-deleted',
        undefined,
        { duration: 2000 },
      );
    });

    it('does nothing when the dialog is closed without an answer (Esc, backdrop)', async () => {
      dialogOpen.and.returnValue({ afterClosed: () => of(undefined) } as never);
      buttonWith('delete-all-imported-device-layouts').click();
      await expectNoUnhandledError();
      expect(load).not.toHaveBeenCalled();
      expect(snackOpen).not.toHaveBeenCalled();
    });

    it('does not touch the chords', () => {
      patchState(chordStore, setEntities(chords()));
      answer(true);
      buttonWith('delete-all-imported-device-layouts').click();
      expect(chordStore.entities().length).toBe(1);
    });
  });

  describe('deleting chords', () => {
    beforeEach(() => open('data-deletion'));

    it('asks first and keeps the chords until the answer is yes', () => {
      patchState(chordStore, setEntities(chords()));
      answer(false);
      buttonWith('delete-all-imported-chords').click();
      expect(dialogOpen).toHaveBeenCalledOnceWith(
        DeleteChordsConfirmDialogComponent,
      );
      expect(chordStore.entities().length).toBe(1);
      expect(snackOpen).not.toHaveBeenCalled();
    });

    it('keeps the chords when the dialog is closed without an answer (Esc, backdrop)', async () => {
      patchState(chordStore, setEntities(chords()));
      dialogOpen.and.returnValue({ afterClosed: () => of(undefined) } as never);
      buttonWith('delete-all-imported-chords').click();
      await expectNoUnhandledError();
      expect(chordStore.entities().length).toBe(1);
      expect(snackOpen).not.toHaveBeenCalled();
    });

    it('removes every chord and tells the user when confirmed', () => {
      patchState(
        chordStore,
        setEntities([...chords(), { id: '2', input: [3], output: [4] }]),
      );
      answer(true);
      buttonWith('delete-all-imported-chords').click();
      expect(chordStore.entities()).toEqual([]);
      expect(snackOpen).toHaveBeenCalledOnceWith(
        'settings-page.message.chords-deleted',
        undefined,
        { duration: 2000 },
      );
    });

    it('does not reload the device layouts', () => {
      answer(true);
      buttonWith('delete-all-imported-chords').click();
      expect(load).not.toHaveBeenCalled();
    });
  });

  describe('UI language', () => {
    it('offers English, Traditional Chinese and Japanese, each in its own language', () => {
      expect(component.supportedLanguages).toEqual([
        { id: UiLanguage.EN, name: 'English' },
        { id: UiLanguage.ZH_TW, name: '繁體中文' },
        { id: UiLanguage.JP, name: '日本語' },
      ]);
    });

    it('saves the language and switches the translations', () => {
      component.setLanguage(UiLanguage.JP);
      expect(languageStore.uiLanguage()).toBe(UiLanguage.JP);
      expect(use).toHaveBeenCalledWith(UiLanguage.JP);
      expect(use.calls.mostRecent().args).toEqual([UiLanguage.JP]);
    });

    it('shows the current language as selected in the toggle group', async () => {
      languageStore.set('uiLanguage', UiLanguage.ZH_TW);
      await open('ui-language');
      fixture.detectChanges();
      await fixture.whenStable();
      const checked = Array.from(
        el().querySelectorAll('mat-button-toggle.mat-button-toggle-checked'),
      ).map((t) => t.textContent?.trim());
      expect(checked).toEqual(['繁體中文']);
      const labels = Array.from(el().querySelectorAll('mat-button-toggle')).map(
        (t) => t.textContent?.trim(),
      );
      expect(labels).toEqual(['English', '繁體中文', '日本語']);
    });

    it('changes the language when another one is picked', async () => {
      await open('ui-language');
      const buttons = el().querySelectorAll('mat-button-toggle button');
      (buttons[2] as HTMLButtonElement).click();
      fixture.detectChanges();
      expect(languageStore.uiLanguage()).toBe(UiLanguage.JP);
      expect(use).toHaveBeenCalledWith(UiLanguage.JP);
    });
  });
});
