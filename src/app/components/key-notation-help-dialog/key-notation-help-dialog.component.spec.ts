import { OverlayContainer } from '@angular/cdk/overlay';
import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { VisibilitySettingStore } from 'src/app/stores/visibility-setting.store';
import { provideTranslateService } from '@ngx-translate/core';
import { KeyNotationHelpDialogComponent } from './key-notation-help-dialog.component';

describe('KeyNotationHelpDialogComponent', () => {
  let overlay: HTMLElement;
  let ref: MatDialogRef<KeyNotationHelpDialogComponent>;
  let result: unknown;
  let closed: boolean;

  const content = () =>
    (overlay.querySelector('mat-dialog-content')?.textContent ?? '')
      .replace(/\s+/g, ' ')
      .trim();
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
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [KeyNotationHelpDialogComponent],
      providers: [provideTranslateService()],
    }).compileComponents();
    overlay = TestBed.inject(OverlayContainer).getContainerElement();
    ref = TestBed.inject(MatDialog).open(KeyNotationHelpDialogComponent);
    closed = false;
    result = 'untouched';
    ref.afterClosed().subscribe((r) => {
      closed = true;
      result = r;
    });
    await settle();
  });

  afterEach(() => {
    TestBed.inject(MatDialog).closeAll();
    localStorage.clear();
  });

  it('shows the title', () => {
    expect(
      overlay.querySelector('h2[mat-dialog-title]')?.textContent?.toLowerCase(),
    ).toContain('key-notation-help-dialog.title');
  });

  it('shows the paragraphs in order', () => {
    const text = content();
    const keys = [
      'key-notation-explanation-paragraph',
      'key-notation-example-paragraph',
      'first-and-last-letters-explanation-paragraph',
      'middle-part-explanation-paragraph.0',
      'layout-image-explanation-paragraph',
    ].map((k) => text.indexOf('key-notation-help-dialog.' + k));
    expect(keys.every((i) => i >= 0)).toBeTrue();
    expect(keys).toEqual([...keys].sort((a, b) => a - b));
  });

  it('links to two external pages from the middle part', () => {
    const links = Array.from(
      overlay.querySelectorAll('mat-dialog-content a'),
    ) as HTMLAnchorElement[];
    expect(links.length).toBe(2);
    expect(links.map((a) => a.getAttribute('href'))).toEqual([
      'key-notation-help-dialog.middle-part-explanation-paragraph.1.url',
      'key-notation-help-dialog.middle-part-explanation-paragraph.3.url',
    ]);
    expect(links.map((a) => a.textContent?.trim())).toEqual([
      'key-notation-help-dialog.middle-part-explanation-paragraph.1.text',
      'key-notation-help-dialog.middle-part-explanation-paragraph.3.text',
    ]);
    for (const a of links) {
      expect(a.target).toBe('_blank');
      expect(a.rel).toBe('noopener');
    }
  });

  it('draws the example layout even when the layout is hidden in the settings', async () => {
    TestBed.inject(MatDialog).closeAll();
    // The first dialog leaves after its exit animation; wait so only the new one is counted.
    for (let i = 0; i < 300 && overlay.querySelector('mat-dialog-container'); i++) {
      await new Promise((r) => setTimeout(r, 10));
    }
    TestBed.inject(VisibilitySettingStore).set('layout', false);
    TestBed.inject(MatDialog).open(KeyNotationHelpDialogComponent);
    await settle();
    expect(overlay.querySelectorAll('app-layout g[appswitch]').length).toBe(18);
  });

  describe('the example layout', () => {
    const layout = () => overlay.querySelector('app-layout') as HTMLElement;
    const labels = () =>
      Array.from(layout().querySelectorAll('g[appswitch] text')).map((t) =>
        (t.textContent ?? '').trim(),
      );

    it('is drawn even if the layout is hidden in the settings', () => {
      expect(layout().querySelectorAll('g[appswitch]').length).toBe(18);
    });

    it('shows the key notation of every key of the layout', () => {
      const expected = [
        'L1bb',
        'L1b',
        'L1',
        'L2',
        'L3',
        'L4',
        'L5',
        'L3b',
        'L4b',
        'R1bb',
        'R1b',
        'R1',
        'R2',
        'R3',
        'R4',
        'R5',
        'R3b',
        'R4b',
      ];
      const shown = labels();
      for (const e of expected) {
        expect(shown).withContext(e).toContain(e);
      }
      expect(shown.length).toBe(expected.length);
    });
  });

  it('has one button, which says close', () => {
    expect(overlay.querySelectorAll('mat-dialog-actions button').length).toBe(
      1,
    );
    expect(closeButton().textContent?.toLowerCase()).toContain(
      'general.close-action',
    );
  });

  it('stays open until the button is pressed', () => {
    expect(closed).toBeFalse();
  });

  it('closes with true when the button is pressed', async () => {
    closeButton().click();
    await waitUntilClosed();
    expect(closed).toBeTrue();
    expect(result).toBeTrue();
  });
});
