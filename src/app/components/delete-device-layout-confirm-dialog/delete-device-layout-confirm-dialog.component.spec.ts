import { OverlayContainer } from '@angular/cdk/overlay';
import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { provideTranslateService } from '@ngx-translate/core';
import { DeleteDeviceLayoutConfirmDialogComponent } from './delete-device-layout-confirm-dialog.component';

describe('DeleteDeviceLayoutConfirmDialogComponent', () => {
  let overlay: HTMLElement;
  let ref: MatDialogRef<DeleteDeviceLayoutConfirmDialogComponent>;
  let result: unknown;
  let closed: boolean;

  const buttons = () =>
    Array.from(overlay.querySelectorAll('button')) as HTMLButtonElement[];
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
      imports: [DeleteDeviceLayoutConfirmDialogComponent],
      providers: [provideTranslateService()],
    }).compileComponents();
    overlay = TestBed.inject(OverlayContainer).getContainerElement();
    ref = TestBed.inject(MatDialog).open(
      DeleteDeviceLayoutConfirmDialogComponent,
      {
        data: { deviceLayoutName: 'My layout' },
      },
    );
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

  it('shows the description text', () => {
    expect(overlay.querySelector('mat-dialog-content')?.textContent).toContain(
      'delete-device-layout-confirm-dialog.description',
    );
  });

  it('puts the layout name between the two parts of the description', () => {
    expect(overlay.querySelector('mat-dialog-content')?.textContent).toBe(
      'delete-device-layout-confirm-dialog.description.0My layoutdelete-device-layout-confirm-dialog.description.2',
    );
  });

  it('has a cancel and a confirm button, in that order', () => {
    expect(buttons().length).toBe(2);
    expect(buttons()[0].textContent?.toLowerCase()).toContain(
      'general.cancel-action',
    );
    expect(buttons()[1].textContent?.toLowerCase()).toContain(
      'general.delete-single-confirm-button',
    );
  });

  it('closes without confirming on cancel', async () => {
    buttons()[0].click();
    await waitUntilClosed();
    expect(closed).toBeTrue();
    // mat-dialog-close without a value yields '', which callers read via `?.confirmed`.
    expect(result).toBe('');
  });

  it('closes with { confirmed: true } on confirm', async () => {
    buttons()[1].click();
    await waitUntilClosed();
    expect(closed).toBeTrue();
    expect(result).toEqual({ confirmed: true });
  });

  it('does not close before a button is pressed', () => {
    expect(closed).toBeFalse();
  });
});
