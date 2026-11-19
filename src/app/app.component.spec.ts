import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressBar } from '@angular/material/progress-bar';
import { By } from '@angular/platform-browser';
import { HotkeysService } from '@ngneat/hotkeys';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { provideTranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';
import { HotkeyDialogComponent } from './components/hotkey-dialog/hotkey-dialog.component';
import { NavComponent } from './components/nav/nav.component';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let shortcuts: Subject<unknown>;
  let addShortcut: jasmine.Spy;
  let loading: BehaviorSubject<number>;
  let dialogRef: { close: jasmine.Spy };
  let open: jasmine.Spy;

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
    dialogRef = { close: jasmine.createSpy('close') };
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
    open = spyOn(TestBed.inject(MatDialog), 'open').and.returnValue(
      dialogRef as never,
    );
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => localStorage.clear());

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
    it('listens for shift+? once', () => {
      const own = addShortcut.calls
        .allArgs()
        .filter(([options]) => options.keys === 'shift.?');
      expect(own).toEqual([[{ keys: 'shift.?' }]]);
    });

    it('does not open the dialog before the shortcut is pressed', () => {
      expect(open).not.toHaveBeenCalled();
    });

    it('opens the dialog when the shortcut is pressed', async () => {
      await press();
      expect(open).toHaveBeenCalledOnceWith(HotkeyDialogComponent);
      expect(dialogRef.close).not.toHaveBeenCalled();
    });

    it('closes it when the shortcut is pressed again', async () => {
      await press();
      await press();
      expect(open).toHaveBeenCalledTimes(1);
      expect(dialogRef.close).toHaveBeenCalledTimes(1);
    });

    it('opens a new dialog when the shortcut is pressed after closing', async () => {
      await press();
      await press();
      await press();
      expect(open).toHaveBeenCalledTimes(2);
      expect(dialogRef.close).toHaveBeenCalledTimes(1);
      await press();
      expect(dialogRef.close).toHaveBeenCalledTimes(2);
    });

    it('records that closing the dialog by other means (Esc, backdrop) is not noticed, so the next press closes it again', async () => {
      await press();
      // the dialog was closed elsewhere; the component still holds the old reference
      await press();
      expect(open).toHaveBeenCalledTimes(1);
      expect(dialogRef.close).toHaveBeenCalledTimes(1);
      expect(component).toBeTruthy();
    });
  });
});
