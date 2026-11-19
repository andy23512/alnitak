import { OverlayContainer } from '@angular/cdk/overlay';
import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { provideTranslateService } from '@ngx-translate/core';
import { SerialLogItemType } from 'src/app/models/serial-log.model';
import { SerialLogStore } from 'src/app/stores/serial-log.store';
import { SerialLogDialogComponent } from './serial-log-dialog.component';

describe('SerialLogDialogComponent', () => {
  let overlay: HTMLElement;
  let ref: MatDialogRef<SerialLogDialogComponent>;
  let store: InstanceType<typeof SerialLogStore>;
  let closed: boolean;

  const content = () =>
    overlay.querySelector('mat-dialog-content') as HTMLElement;
  const rows = () =>
    Array.from(content().querySelectorAll('li')) as HTMLElement[];
  async function settle() {
    await new Promise((r) => setTimeout(r, 0));
  }

  beforeEach(async () => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [SerialLogDialogComponent],
      providers: [provideTranslateService()],
    }).compileComponents();
    overlay = TestBed.inject(OverlayContainer).getContainerElement();
    store = TestBed.inject(SerialLogStore);
    closed = false;
  });

  function open() {
    ref = TestBed.inject(MatDialog).open(SerialLogDialogComponent);
    ref.afterClosed().subscribe(() => (closed = true));
    return settle();
  }

  afterEach(() => TestBed.inject(MatDialog).closeAll());

  it('shows the title', async () => {
    await open();
    expect(
      overlay.querySelector('h2[mat-dialog-title]')?.textContent?.toLowerCase(),
    ).toContain('serial-log-dialog.title');
  });

  it('says there is no data when the log is empty', async () => {
    await open();
    expect(rows().length).toBe(0);
    expect(content().textContent).toContain(
      'serial-log-dialog.no-data-message',
    );
  });

  it('lists the logged data in order, without the empty message', async () => {
    store.push(SerialLogItemType.Send, 'VERSION');
    store.push(SerialLogItemType.Receive, 'VERSION CC1 1.2.3');
    await open();
    expect(rows().map((r) => r.querySelector('span')?.textContent)).toEqual([
      'VERSION',
      'VERSION CC1 1.2.3',
    ]);
    expect(content().textContent).not.toContain(
      'serial-log-dialog.no-data-message',
    );
  });

  it('marks sent data with a green up arrow and received data with a red down arrow', async () => {
    store.push(SerialLogItemType.Send, 'a');
    store.push(SerialLogItemType.Receive, 'b');
    await open();
    const [sent, received] = rows().map(
      (r) => r.querySelector('mat-icon') as HTMLElement,
    );
    expect(sent.textContent?.trim()).toBe('arrow_drop_up');
    expect(sent.classList).toContain('text-green-500');
    expect(received.textContent?.trim()).toBe('arrow_drop_down');
    expect(received.classList).toContain('text-red-500');
  });

  it('shows new data that arrives while the dialog is open', async () => {
    await open();
    store.push(SerialLogItemType.Send, 'late');
    await settle();
    expect(rows().length).toBe(1);
    expect(rows()[0].textContent).toContain('late');
  });

  it('shows nothing again after the log is cleared', async () => {
    store.push(SerialLogItemType.Send, 'a');
    await open();
    store.clear();
    await settle();
    expect(rows().length).toBe(0);
    expect(content().textContent).toContain(
      'serial-log-dialog.no-data-message',
    );
  });

  it('has one close button that closes the dialog', async () => {
    await open();
    const buttons = overlay.querySelectorAll('mat-dialog-actions button');
    expect(buttons.length).toBe(1);
    expect(buttons[0].textContent?.toLowerCase()).toContain(
      'general.close-action',
    );
    expect(closed).toBeFalse();
    (buttons[0] as HTMLButtonElement).click();
    await settle();
    expect(closed).toBeTrue();
  });
});
