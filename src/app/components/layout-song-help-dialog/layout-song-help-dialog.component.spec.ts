import { OverlayContainer } from '@angular/cdk/overlay';
import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { provideTranslateService } from '@ngx-translate/core';
import { LayoutSongHelpDialogComponent } from './layout-song-help-dialog.component';

describe('LayoutSongHelpDialogComponent', () => {
  let overlay: HTMLElement;
  let ref: MatDialogRef<LayoutSongHelpDialogComponent>;
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
    await TestBed.configureTestingModule({
      imports: [LayoutSongHelpDialogComponent],
      providers: [provideTranslateService()],
    }).compileComponents();
    overlay = TestBed.inject(OverlayContainer).getContainerElement();
    ref = TestBed.inject(MatDialog).open(LayoutSongHelpDialogComponent);
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
  });

  it('shows the title', () => {
    expect(
      overlay.querySelector('h2[mat-dialog-title]')?.textContent?.toLowerCase(),
    ).toContain('layout-song-help-dialog.title');
  });

  it('shows the summary, tool and license paragraphs in order', () => {
    const text = content();
    const order = ['summary', 'tool-explanation', 'license-explanation'].map(
      (k) => text.indexOf('layout-song-help-dialog.' + k),
    );
    expect(order.every((i) => i >= 0)).toBeTrue();
    expect(order).toEqual([...order].sort((a, b) => a - b));
  });

  it('links to the song and the lyrics as downloads', () => {
    const links = Array.from(
      overlay.querySelectorAll('mat-dialog-content a'),
    ) as HTMLAnchorElement[];
    expect(links.map((a) => a.getAttribute('href'))).toEqual([
      './assets/layout.mp3',
      './assets/layout-song-lyrics.txt',
    ]);
    expect(links[0].getAttribute('download')).toBe('layout-song.mp3');
    expect(links[1].hasAttribute('download')).toBeTrue();
  });

  it('puts the link texts inside the download sentence', () => {
    const links = Array.from(overlay.querySelectorAll('mat-dialog-content a'));
    expect(links.map((a) => a.textContent?.trim())).toEqual([
      'layout-song-help-dialog.download-explanation.1',
      'layout-song-help-dialog.download-explanation.3',
    ]);
    expect(content()).toContain(
      'layout-song-help-dialog.download-explanation.0',
    );
    expect(content()).toContain(
      'layout-song-help-dialog.download-explanation.4',
    );
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
