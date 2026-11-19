import { BreakpointObserver } from '@angular/cdk/layout';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router, provideRouter } from '@angular/router';
import { HotkeysService } from '@ngneat/hotkeys';
import { provideTranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { NAV_LINKS } from 'src/app/data/nav-links';
import { TOPICS } from 'src/app/data/topics';
import { NavComponent } from './nav.component';

describe('NavComponent', () => {
  let fixture: ComponentFixture<NavComponent>;
  let component: NavComponent;
  let handset: BehaviorSubject<{ matches: boolean }>;
  let shortcut: Subject<unknown>;
  let hotkeys: HotkeysService;
  let dialog: MatDialog;

  const el = () => fixture.nativeElement as HTMLElement;
  const drawer = () =>
    fixture.debugElement.query(By.directive(MatSidenav))
      .componentInstance as MatSidenav;
  const header = () => el().querySelector('header') as HTMLElement;
  const headerLinks = () =>
    Array.from(header().querySelectorAll(':scope > div > a')) as HTMLElement[];
  const lessonLinks = () =>
    Array.from(el().querySelectorAll('mat-nav-list a')) as HTMLAnchorElement[];
  const search = () =>
    el().querySelector('input[type=search]') as HTMLInputElement;
  async function settle() {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }
  async function type(value: string) {
    search().value = value;
    search().dispatchEvent(new Event('input'));
    await settle();
  }
  async function create(isHandset = false) {
    handset = new BehaviorSubject({ matches: isHandset });
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [NavComponent, NoopAnimationsModule],
      providers: [
        provideRouter([]),
        provideTranslateService(),
        { provide: BreakpointObserver, useValue: { observe: () => handset } },
      ],
    }).compileComponents();
    hotkeys = TestBed.inject(HotkeysService);
    shortcut = new Subject();
    spyOn(hotkeys, 'addShortcut').and.returnValue(shortcut as never);
    spyOn(hotkeys, 'removeShortcuts');
    dialog = TestBed.inject(MatDialog);
    spyOn(dialog, 'open');
    fixture = TestBed.createComponent(NavComponent);
    component = fixture.componentInstance;
    await settle();
  }

  describe('on a wide screen', () => {
    beforeEach(() => create(false));

    it('keeps the side menu open beside the page and cannot close it', () => {
      expect(drawer().opened).toBeTrue();
      expect(drawer().mode).toBe('side');
      expect(drawer().disableClose).toBeTrue();
      expect(el().querySelector('mat-sidenav')?.getAttribute('role')).toBe(
        'navigation',
      );
    });

    it('has no open-menu button while the menu is open', () => {
      expect(el().querySelector('mat-sidenav-content button')).toBeNull();
    });

    it('has a router outlet for the page', () => {
      expect(el().querySelector('router-outlet')).toBeTruthy();
    });
  });

  describe('on a phone', () => {
    beforeEach(() => create(true));

    it('keeps the side menu closed and over the page, like a dialog', () => {
      expect(drawer().opened).toBeFalse();
      expect(drawer().mode).toBe('over');
      expect(drawer().disableClose).toBeFalse();
      expect(el().querySelector('mat-sidenav')?.getAttribute('role')).toBe(
        'dialog',
      );
    });

    it('shows a button that opens the menu', async () => {
      const button = el().querySelector(
        'mat-sidenav-content button',
      ) as HTMLButtonElement;
      expect(button.getAttribute('aria-label')).toBe(
        'nav.side-menu-toggle.aria-label',
      );
      button.click();
      await settle();
      expect(drawer().opened).toBeTrue();
      expect(el().querySelector('mat-sidenav-content button')).toBeNull();
    });

    it('closes the menu when a link is chosen', async () => {
      await drawer().open();
      await settle();
      component.onNavLinkClick();
      await settle();
      expect(drawer().opened).toBeFalse();
    });
  });

  describe('page links', () => {
    beforeEach(() => create(false));

    it('has a link for each page, then the hotkey button, then the serial log button when supported', () => {
      const expected = NAV_LINKS.length + 1 + ('serial' in navigator ? 1 : 0);
      expect(headerLinks().length).toBe(expected);
    });

    it('points each link at its page, with its labels', () => {
      NAV_LINKS.forEach((navLink, i) => {
        const a = headerLinks()[i] as HTMLAnchorElement;
        expect(a.getAttribute('aria-label')).toBe(navLink.ariaLabel);
        expect(a.getAttribute('href')).toBe(navLink.routerLink);
        expect(a.querySelector('mat-icon')?.textContent).toBe(navLink.icon);
        expect(a.textContent?.toLowerCase()).toContain(navLink.title);
      });
    });

    it('marks the link of the current page with the primary color', async () => {
      await TestBed.inject(Router).navigateByUrl('/');
      await settle();
      const primary = headerLinks()
        .slice(0, NAV_LINKS.length)
        .map((a) =>
          a.querySelector('button')!.classList.contains('mat-primary'),
        );
      expect(primary).toEqual(NAV_LINKS.map((l) => l.routerLink === '/'));
    });

    it('clears the search when a link is chosen', async () => {
      await type('a');
      headerLinks()[0].click();
      await settle();
      expect(component.searchQuery()).toBe('');
      expect(search().value).toBe('');
    });
  });

  describe('dialogs', () => {
    beforeEach(() => create(false));

    const byIcon = (icon: string) =>
      Array.from(header().querySelectorAll('button')).find(
        (b) => b.querySelector('mat-icon')?.textContent === icon,
      ) as HTMLButtonElement | undefined;

    it('opens the hotkey dialog', async () => {
      byIcon('keyboard')!.click();
      await new Promise((r) => setTimeout(r, 100));
      expect(dialog.open).toHaveBeenCalledTimes(1);
      const { HotkeyDialogComponent } =
        await import('../hotkey-dialog/hotkey-dialog.component');
      expect((dialog.open as jasmine.Spy).calls.mostRecent().args).toEqual([
        HotkeyDialogComponent,
      ]);
    });

    it('opens the serial log dialog, big, when the Web Serial API is supported', async () => {
      expect(component.isWebSerialApiSupported).toBe('serial' in navigator);
      const button = byIcon('article');
      if (!component.isWebSerialApiSupported) {
        expect(button).toBeUndefined();
        return;
      }
      button!.click();
      await new Promise((r) => setTimeout(r, 100));
      const { SerialLogDialogComponent } =
        await import('../serial-log-dialog/serial-log-dialog.component');
      expect((dialog.open as jasmine.Spy).calls.mostRecent().args).toEqual([
        SerialLogDialogComponent,
        { width: '80vw', height: '80vh' },
      ]);
    });
  });

  describe('the lesson list', () => {
    beforeEach(() => create(false));

    it('shows each topic as a heading, with its lessons below', () => {
      const headings = Array.from(el().querySelectorAll('mat-nav-list h4')).map(
        (h) => (h.textContent ?? '').trim(),
      );
      expect(headings.length).toBe(TOPICS.length);
      TOPICS.forEach((t, i) => {
        expect(headings[i]).toContain(t.name);
      });
      const total = TOPICS.reduce((n, t) => n + t.lessons.length, 0);
      expect(lessonLinks().length).toBe(total);
    });

    it('links each lesson to its topic and id', () => {
      const first = TOPICS[0];
      expect(lessonLinks()[0].getAttribute('href')).toBe(
        `/topic/${first.id}/lesson/${first.lessons[0].id}`,
      );
    });

    it('uses the topic icon, or "topic" without one', () => {
      const icons = Array.from(
        el().querySelectorAll('mat-nav-list h4 mat-icon'),
      ).map((i) => i.textContent);
      expect(icons).toEqual(TOPICS.map((t) => t.iconName || 'topic'));
    });
  });

  describe('searching lessons', () => {
    beforeEach(() => create(false));

    it('has no result without a query', () => {
      expect(component.searchResult()).toBeNull();
    });

    it('shows a search icon only while the query is empty', async () => {
      const suffix = () =>
        el().querySelector('mat-form-field button[matSuffix]');
      expect(suffix()).toBeTruthy();
      await type('a');
      expect(suffix()).toBeNull();
    });

    it('finds the lessons that contain a character', async () => {
      await type('q');
      const result = component.searchResult()!;
      expect(result.length).toBeGreaterThan(0);
      expect(
        result.every(
          (l) =>
            l.components.some((c) => c.toLowerCase().includes('q')) ||
            l.componentNames.some((n) => n.toLowerCase().includes('q')),
        ),
      ).toBeTrue();
      expect(lessonLinks().length).toBe(result.length);
    });

    it('lists a lesson once even when several of its characters match', async () => {
      await type('e');
      const ids = component.searchResult()!.map((l) => l.id + '/' + l.topic.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it('ignores case and surrounding spaces', async () => {
      await type('q');
      const plain = component.searchResult()!.map((l) => l.id);
      await type('  Q ');
      expect(component.searchResult()!.map((l) => l.id)).toEqual(plain);
    });

    it('treats a query of only spaces as no match', async () => {
      await type('   ');
      expect(component.searchResult()).toEqual([]);
    });

    it('says so when nothing matches', async () => {
      await type('zzzzzzzz');
      expect(component.searchResult()).toEqual([]);
      expect(lessonLinks().length).toBe(1);
      expect(lessonLinks()[0].textContent).toContain('nav.no-result-message');
    });

    it('links a result to its topic and lesson', async () => {
      await type('q');
      const first = component.searchResult()![0];
      expect(lessonLinks()[0].getAttribute('href')).toBe(
        `/topic/${first.topic.id}/lesson/${first.id}`,
      );
      expect(lessonLinks()[0].textContent).toContain(first.topic.name);
    });

    it('goes back to the full list when the query is cleared', async () => {
      await type('q');
      await type('');
      expect(el().querySelectorAll('mat-nav-list h4').length).toBe(
        TOPICS.length,
      );
    });
  });

  describe('the side menu shortcut', () => {
    beforeEach(() => create(false));

    it('listens to meta+b', () => {
      expect(component.toggleSideMenuShortcut).toBe('meta.b');
      expect(hotkeys.addShortcut).toHaveBeenCalledOnceWith({ keys: 'meta.b' });
    });

    it('toggles the side menu each time it is pressed', async () => {
      shortcut.next(null);
      await settle();
      expect(drawer().opened).toBeFalse();
      shortcut.next(null);
      await settle();
      expect(drawer().opened).toBeTrue();
    });

    it('is removed when the component is destroyed', () => {
      fixture.destroy();
      expect(hotkeys.removeShortcuts).toHaveBeenCalledOnceWith(['meta.b']);
    });
  });
});
