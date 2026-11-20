import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressBar } from '@angular/material/progress-bar';
import { By } from '@angular/platform-browser';
import { HotkeysService } from '@ngneat/hotkeys';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { provideTranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable, Subject, firstValueFrom } from 'rxjs';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';
import { HotkeyDialogComponent } from './components/hotkey-dialog/hotkey-dialog.component';
import { HOTKEY_DIALOG_ID } from './components/hotkey-dialog/hotkey-dialog.const';
import { NavComponent } from './components/nav/nav.component';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let shortcuts: Subject<unknown>;
  let addShortcut: jasmine.Spy;
  let loading: BehaviorSubject<number>;
  let matDialog: MatDialog;

  beforeEach(() => {
    TestBed.resetTestingModule();
    localStorage.clear();
    shortcuts = new Subject();
    addShortcut = jasmine
      .createSpy('addShortcut')
      .and.callFake(({ keys }: { keys: string }) =>
        keys === 'shift.?' ? shortcuts : new Subject(),
      );
    loading = new BehaviorSubject(0);
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideTranslateService(),
        {
          provide: HotkeysService,
          useValue: { addShortcut, removeShortcuts: () => undefined },
        },
        { provide: LoadingBarService, useValue: { value$: loading } },
      ],
    });
    matDialog = TestBed.inject(MatDialog);
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    matDialog.closeAll();
    localStorage.clear();
  });

  /** the dialog is loaded lazily, so give the import time to finish */
  const press = async () => {
    shortcuts.next(undefined);
    await new Promise((r) => setTimeout(r));
  };

  it('shows the navigation', () => {
    expect(
      fixture.debugElement.query(By.directive(NavComponent)),
    ).not.toBeNull();
  });

  describe('loading bar', () => {
    const bar = () => fixture.debugElement.query(By.directive(MatProgressBar));

    it('is hidden while nothing is loading', () => {
      expect(bar()).toBeNull();
    });

    it('shows the progress while loading, fixed on top and half see-through', () => {
      loading.next(40);
      fixture.detectChanges();
      const progress = bar().componentInstance as MatProgressBar;
      expect(progress.value).toBe(40);
      expect(progress.mode).toBe('determinate');
      const classes = (bar().nativeElement as HTMLElement).classList;
      expect(classes).toContain('!fixed');
      expect(classes).toContain('top-0');
      expect(classes).toContain('opacity-50');
    });

    it('is hidden again when the loading is done', () => {
      loading.next(70);
      fixture.detectChanges();
      loading.next(0);
      fixture.detectChanges();
      expect(bar()).toBeNull();
    });
  });

  describe('keyboard shortcut dialog', () => {
    const isOpen = () => !!matDialog.getDialogById(HOTKEY_DIALOG_ID);
    const closed = (ref: { afterClosed(): Observable<unknown> }) =>
      firstValueFrom(ref.afterClosed());
    const overlay = () =>
      document.querySelector('.cdk-overlay-container') as HTMLElement;

    it('listens for shift+? once', () => {
      const own = addShortcut.calls
        .allArgs()
        .filter(([options]) => options.keys === 'shift.?');
      expect(own).toEqual([[{ keys: 'shift.?' }]]);
    });

    it('does not open the dialog before the shortcut is pressed', () => {
      expect(isOpen()).toBeFalse();
    });

    it('opens the hotkey dialog when the shortcut is pressed', async () => {
      await press();
      expect(isOpen()).toBeTrue();
      expect(matDialog.openDialogs.length).toBe(1);
      expect(
        matDialog.getDialogById(HOTKEY_DIALOG_ID)!.componentInstance,
      ).toBeInstanceOf(HotkeyDialogComponent);
    });

    it('closes it when the shortcut is pressed again', async () => {
      await press();
      const ref = matDialog.getDialogById(HOTKEY_DIALOG_ID)!;
      const done = closed(ref);
      await press();
      await done;
      expect(isOpen()).toBeFalse();
      expect(matDialog.openDialogs.length).toBe(0);
    });

    it('opens it again when the shortcut is pressed after closing', async () => {
      await press();
      const done = closed({ afterClosed: () => matDialog.afterAllClosed });
      await press();
      await done;
      await press();
      expect(isOpen()).toBeTrue();
      expect(matDialog.openDialogs.length).toBe(1);
    });

    describe('after the dialog was closed by other means', () => {
      beforeEach(async () => {
        await press();
      });

      it('opens it with the next press after Esc', async () => {
        const ref = matDialog.getDialogById(HOTKEY_DIALOG_ID)!;
        document.body.dispatchEvent(
          new KeyboardEvent('keydown', {
            key: 'Escape',
            code: 'Escape',
            keyCode: 27,
            bubbles: true,
          } as KeyboardEventInit),
        );
        await closed(ref);
        expect(isOpen()).toBeFalse();
        await press();
        expect(isOpen()).toBeTrue();
      });

      it('opens it with the next press after a click on the backdrop', async () => {
        const ref = matDialog.getDialogById(HOTKEY_DIALOG_ID)!;
        (
          overlay().querySelector('.cdk-overlay-backdrop') as HTMLElement
        ).click();
        await closed(ref);
        expect(isOpen()).toBeFalse();
        await press();
        expect(isOpen()).toBeTrue();
      });

      it('opens it with the next press after the close button of the dialog', async () => {
        const ref = matDialog.getDialogById(HOTKEY_DIALOG_ID)!;
        (
          overlay().querySelector('mat-dialog-actions button') as HTMLElement
        ).click();
        await closed(ref);
        expect(isOpen()).toBeFalse();
        await press();
        expect(isOpen()).toBeTrue();
      });
    });

    it('closes a dialog that was opened somewhere else, such as the nav button', async () => {
      matDialog.open(HotkeyDialogComponent, { id: HOTKEY_DIALOG_ID });
      const ref = matDialog.getDialogById(HOTKEY_DIALOG_ID)!;
      const done = closed(ref);
      await press();
      await done;
      expect(matDialog.openDialogs.length).toBe(0);
    });

    it('does not try to open a second dialog when the shortcut is pressed twice while loading', async () => {
      // opening a second dialog with the same id throws, so it must not even be tried
      const open = spyOn(matDialog, 'open').and.callThrough();
      shortcuts.next(undefined);
      shortcuts.next(undefined);
      await new Promise((resolve) => setTimeout(resolve, 50));
      expect(open).toHaveBeenCalledTimes(1);
      expect(matDialog.openDialogs.length).toBe(1);
    });
  });
});
