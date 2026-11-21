import { OverlayContainer } from '@angular/cdk/overlay';
import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { provideTranslateService } from '@ngx-translate/core';
import {
  HOTKEY_GROUPS,
  HotkeyDialogComponent,
} from './hotkey-dialog.component';

describe('HotkeyDialogComponent', () => {
  let overlay: HTMLElement;
  let ref: MatDialogRef<HotkeyDialogComponent>;
  let result: unknown;
  let closed: boolean;

  const sections = () =>
    Array.from(
      overlay.querySelectorAll('mat-dialog-content section'),
    ) as HTMLElement[];
  const closeButton = () =>
    overlay.querySelector('mat-dialog-actions button') as HTMLButtonElement;
  async function settle() {
    await new Promise((r) => setTimeout(r, 0));
  }
  // Closing finishes after the exit animation, so wait for it instead of a fixed delay.
  async function waitUntilClosed() {
    for (let i = 0; i < 300 && !closed; i++) {
      await new Promise((r) => setTimeout(r, 10));
    }
  }

  beforeEach(async () => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [HotkeyDialogComponent],
      providers: [provideTranslateService()],
    }).compileComponents();
    overlay = TestBed.inject(OverlayContainer).getContainerElement();
    ref = TestBed.inject(MatDialog).open(HotkeyDialogComponent);
    closed = false;
    result = 'untouched';
    ref.afterClosed().subscribe((r) => {
      closed = true;
      result = r;
    });
    await settle();
  });

  afterEach(() => TestBed.inject(MatDialog).closeAll());

  it('shows the title', () => {
    expect(
      overlay.querySelector('h2[mat-dialog-title]')?.textContent?.toLowerCase(),
    ).toContain('hotkey-dialog.title');
  });

  describe('the hotkey table', () => {
    it('has one section for each group, in order', () => {
      expect(sections().length).toBe(HOTKEY_GROUPS.length);
      sections().forEach((s, i) => {
        expect(s.querySelector('h3')?.textContent?.toLowerCase().trim()).toBe(
          HOTKEY_GROUPS[i].name,
        );
      });
    });

    it('has one row for each hotkey, with its description', () => {
      sections().forEach((s, i) => {
        const rows = Array.from(s.querySelectorAll('li'));
        expect(rows.length).toBe(HOTKEY_GROUPS[i].hotkeys.length);
        rows.forEach((row, j) => {
          expect(row.querySelector('span')?.textContent?.trim()).toBe(
            HOTKEY_GROUPS[i].hotkeys[j].description,
          );
          expect(row.querySelector('kbd')?.textContent?.trim()).not.toBe('');
        });
      });
    });

    it('lists the global shortcuts first, including the hotkey dialog itself', () => {
      expect(HOTKEY_GROUPS[0].name).toBe('hotkey.global.name');
      expect(HOTKEY_GROUPS[0].hotkeys.map((h) => h.key)).toEqual([
        '?',
        'meta.b',
      ]);
    });

    it('writes keys with the aliases esc and space', () => {
      const text = sections()
        .map((s) => s.textContent?.toLowerCase())
        .join(' ');
      expect(text).toContain('esc');
      expect(text).not.toContain('escape');
    });

    it('writes key combinations with plus signs', () => {
      const kbds = Array.from(overlay.querySelectorAll('kbd')).map(
        (k) => k.textContent ?? '',
      );
      expect(kbds.some((t) => t.includes(' + '))).toBeTrue();
    });
  });

  it('has one close button', () => {
    expect(overlay.querySelectorAll('mat-dialog-actions button').length).toBe(
      1,
    );
    expect(closeButton().textContent?.toLowerCase()).toContain(
      'general.close-action',
    );
  });

  it('stays open until the button is pressed, then closes with true', async () => {
    expect(closed).toBeFalse();
    closeButton().click();
    await waitUntilClosed();
    expect(closed).toBeTrue();
    expect(result).toBeTrue();
  });
});
