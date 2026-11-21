import { OverlayContainer } from '@angular/cdk/overlay';
import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { provideTranslateService } from '@ngx-translate/core';
import { Thumb3SwitchHelpDialogComponent } from './thumb-3-switch-help-dialog.component';

describe('Thumb3SwitchHelpDialogComponent', () => {
  let overlay: HTMLElement;
  let ref: MatDialogRef<Thumb3SwitchHelpDialogComponent>;
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
      imports: [Thumb3SwitchHelpDialogComponent],
      providers: [provideTranslateService()],
    }).compileComponents();
    overlay = TestBed.inject(OverlayContainer).getContainerElement();
    ref = TestBed.inject(MatDialog).open(Thumb3SwitchHelpDialogComponent);
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
    ).toContain('thumb-3-switch-help-dialog.title');
  });

  it('shows the explanation', () => {
    expect(content()).toBe('thumb-3-switch-help-dialog.content');
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
