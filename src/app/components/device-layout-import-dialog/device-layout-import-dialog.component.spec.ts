import { OverlayContainer } from '@angular/cdk/overlay';
import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { provideTranslateService } from '@ngx-translate/core';
import { DeviceLayoutStore } from 'src/app/stores/device-layout.store';
import { dateToString } from 'src/app/utils/date.utils';
import { DeviceLayoutImportDialogComponent } from './device-layout-import-dialog.component';

describe('DeviceLayoutImportDialogComponent', () => {
  const date = new Date(2024, 4, 6, 7, 8, 9);
  const stamp = dateToString(date); // 20240506_070809
  let overlay: HTMLElement;
  let ref: MatDialogRef<DeviceLayoutImportDialogComponent>;
  let store: InstanceType<typeof DeviceLayoutStore>;
  let closed: boolean;

  const inputs = () =>
    Array.from(overlay.querySelectorAll('input')) as HTMLInputElement[];
  const buttons = () =>
    Array.from(
      overlay.querySelectorAll('mat-dialog-actions button'),
    ) as HTMLButtonElement[];
  async function settle() {
    await new Promise((r) => setTimeout(r, 0));
  }
  async function open(
    layoutMap: Record<string, unknown>,
    device = 'My device',
  ) {
    ref = TestBed.inject(MatDialog).open(DeviceLayoutImportDialogComponent, {
      data: { device, date, layoutMap },
    });
    closed = false;
    ref.afterClosed().subscribe(() => (closed = true));
    await settle();
  }
  async function type(input: HTMLInputElement, value: string) {
    input.value = value;
    input.dispatchEvent(new Event('input'));
    await settle();
  }

  beforeEach(async () => {
    TestBed.resetTestingModule();
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [DeviceLayoutImportDialogComponent],
      providers: [provideTranslateService()],
    }).compileComponents();
    overlay = TestBed.inject(OverlayContainer).getContainerElement();
    store = TestBed.inject(DeviceLayoutStore);
    spyOn(Date, 'now').and.returnValue(1_700_000_000_000);
  });

  afterEach(() => {
    TestBed.inject(MatDialog).closeAll();
    localStorage.clear();
  });

  it('shows the title', async () => {
    await open({ A: [[1]] });
    expect(
      overlay.querySelector('h2[mat-dialog-title]')?.textContent?.toLowerCase(),
    ).toContain('device-layout-import-dialog.title');
  });

  describe('the name fields', () => {
    it('has one field for each profile of the layout map, in order', async () => {
      await open({ A: [[1]], B: [[2]] });
      expect(inputs().length).toBe(2);
    });

    it('suggests device, profile and date as the name', async () => {
      await open({ A: [[1]], B: [[2]] });
      expect(inputs().map((i) => i.value)).toEqual([
        `My device_A_${stamp}`,
        `My device_B_${stamp}`,
      ]);
    });

    it('labels each field with its profile', async () => {
      await open({ A: [[1]], B: [[2]] });
      const labels = Array.from(overlay.querySelectorAll('mat-label')).map(
        (l) => l.textContent?.toLowerCase().trim(),
      );
      expect(labels).toEqual([
        'device-layout-import-dialog.name-label',
        'device-layout-import-dialog.name-label',
      ]);
    });

    it('requires a name', async () => {
      await open({ A: [[1]] });
      expect(inputs()[0].required).toBeTrue();
    });
  });

  describe('buttons', () => {
    it('has cancel and submit, in that order', async () => {
      await open({ A: [[1]] });
      expect(buttons().length).toBe(2);
      expect(buttons()[0].textContent?.toLowerCase()).toContain(
        'general.cancel-action',
      );
      expect(buttons()[1].textContent?.toLowerCase()).toContain(
        'general.submit-action',
      );
      expect(buttons()[1].type).toBe('submit');
    });

    it('closes with false and adds nothing on cancel', async () => {
      await open({ A: [[1]] });
      let result: unknown = 'untouched';
      ref.afterClosed().subscribe((r) => (result = r));
      const before = store.ids().length;
      buttons()[0].click();
      await settle();
      expect(closed).toBeTrue();
      expect(result).toBe(false);
      expect(store.ids().length).toBe(before);
    });

    it('disables submit when a name is empty, and enables it again', async () => {
      await open({ A: [[1]] });
      await type(inputs()[0], '');
      expect(buttons()[1].disabled).toBeTrue();
      await type(inputs()[0], 'ok');
      expect(buttons()[1].disabled).toBeFalse();
    });
  });

  describe('submitting', () => {
    it('adds a layout for each profile with the typed name, and selects the first', async () => {
      await open({ A: [[1, 2]], B: [[3, 4]] });
      const before = store.ids().length;
      await type(inputs()[0], 'first');
      await type(inputs()[1], 'second');
      buttons()[1].click();
      await settle();
      expect(store.ids().length).toBe(before + 2);
      const first = store.entityMap()['first-1700000000000'];
      const second = store.entityMap()['second-1700000000000'];
      expect(first).toEqual({
        id: 'first-1700000000000',
        name: 'first',
        layout: [[1, 2]] as never,
        profile: 'A',
      } as never);
      expect(second.layout).toEqual([[3, 4]] as never);
      expect(second.profile).toBe('B' as never);
      expect(store.selectedId()).toBe('first-1700000000000');
    });

    it('uses the suggested name when it was not changed', async () => {
      await open({ A: [[1]] });
      buttons()[1].click();
      await settle();
      expect(store.selectedId()).toBe(`My device_A_${stamp}-1700000000000`);
      expect(store.entityMap()[store.selectedId()!].name).toBe(
        `My device_A_${stamp}`,
      );
    });

    it('closes after saving', async () => {
      await open({ A: [[1]] });
      buttons()[1].click();
      await settle();
      expect(closed).toBeTrue();
    });

    it('does not save while a name is empty', async () => {
      await open({ A: [[1]] });
      const before = store.ids().length;
      await type(inputs()[0], '');
      ref.componentInstance.onSubmit();
      await settle();
      expect(store.ids().length).toBe(before);
      expect(closed).toBeFalse();
    });
  });
});
