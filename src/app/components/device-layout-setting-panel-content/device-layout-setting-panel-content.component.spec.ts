import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { MatTooltip } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { patchState } from '@ngrx/signals';
import { addEntity } from '@ngrx/signals/entities';
import { TranslateService, provideTranslateService } from '@ngx-translate/core';
import { Subject, of } from 'rxjs';
import { SerialHandlerService } from 'src/app/services/serial-handler.service';
import { DeviceLayoutStore } from 'src/app/stores/device-layout.store';
import { DEFAULT_DEVICE_LAYOUT } from 'tangent-cc-lib';
import { DeleteDeviceLayoutConfirmDialogComponent } from '../delete-device-layout-confirm-dialog/delete-device-layout-confirm-dialog.component';
import { DeviceLayoutImportDialogComponent } from '../device-layout-import-dialog/device-layout-import-dialog.component';
import { ProgressSnackBarComponent } from '../progress-snack-bar/progress-snack-bar.component';
import { DeviceLayoutSettingPanelContentComponent } from './device-layout-setting-panel-content.component';

describe('DeviceLayoutSettingPanelContentComponent', () => {
  let fixture: ComponentFixture<DeviceLayoutSettingPanelContentComponent>;
  let component: DeviceLayoutSettingPanelContentComponent;
  let store: InstanceType<typeof DeviceLayoutStore>;
  let dialog: MatDialog;
  let snackBar: MatSnackBar;
  let dialogResult: unknown;
  let serial: {
    connect: jasmine.Spy;
    disconnect: jasmine.Spy;
    loadProfileLayoutMap: jasmine.Spy;
    device: string;
  };
  let progress: Subject<any>;

  const el = () => fixture.nativeElement as HTMLElement;
  const buttons = () =>
    Array.from(el().querySelectorAll('button')) as HTMLButtonElement[];
  const buttonByIcon = (icon: string) =>
    buttons().find((b) => b.querySelector('mat-icon')?.textContent === icon)!;
  const select = () =>
    fixture.debugElement.query(By.directive(MatSelect))
      .componentInstance as MatSelect;
  const custom = {
    ...DEFAULT_DEVICE_LAYOUT,
    id: 'custom',
    name: 'My layout',
  };
  async function settle() {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }
  async function create() {
    fixture = TestBed.createComponent(DeviceLayoutSettingPanelContentComponent);
    component = fixture.componentInstance;
    await settle();
  }

  beforeEach(async () => {
    TestBed.resetTestingModule();
    localStorage.clear();
    progress = new Subject();
    serial = {
      connect: jasmine.createSpy('connect').and.resolveTo(),
      disconnect: jasmine.createSpy('disconnect').and.resolveTo(),
      loadProfileLayoutMap: jasmine
        .createSpy('loadProfileLayoutMap')
        .and.callFake(() => progress),
      device: 'TWO',
    };
    await TestBed.configureTestingModule({
      imports: [DeviceLayoutSettingPanelContentComponent],
      providers: [
        provideTranslateService(),
        { provide: SerialHandlerService, useValue: serial },
      ],
    }).compileComponents();
    store = TestBed.inject(DeviceLayoutStore);
    dialog = TestBed.inject(MatDialog);
    snackBar = TestBed.inject(MatSnackBar);
    dialogResult = undefined;
    spyOn(dialog, 'open').and.callFake(
      () => ({ afterClosed: () => of(dialogResult) }) as never,
    );
    spyOn(snackBar, 'open');
  });

  afterEach(() => localStorage.clear());

  describe('the layout list', () => {
    beforeEach(async () => {
      const translate = TestBed.inject(TranslateService);
      for (const lang of ['en', 'zh-TW', 'jp']) {
        translate.setTranslation(lang, {
          'device-layout': {
            'cc1-cc2-default': 'CC1/CC2 default',
            'm4g-default': 'M4G default',
            'cc1-cc2-right-hand-only': 'Right only',
            'cc1-cc2-left-hand-only': 'Left only',
          },
        });
      }
      patchState(store, addEntity(custom));
      await create();
    });

    it('lists the built-in layouts by their translated names, then custom ones', () => {
      expect(component.translatedDeviceLayouts().map((l) => l.name)).toEqual([
        'CC1/CC2 default',
        'M4G default',
        'Right only',
        'Left only',
        'My layout',
      ]);
      expect(select().options.map((o) => o.viewValue.trim())).toEqual([
        'CC1/CC2 default',
        'M4G default',
        'Right only',
        'Left only',
        'My layout',
      ]);
    });

    it('keeps the ids of the layouts', () => {
      expect(select().options.map((o) => o.value)).toEqual([
        'default',
        'm4g-default',
        'cc1-cc2-right-hand-only',
        'cc1-cc2-left-hand-only',
        'custom',
      ]);
    });

    it('shows the selected layout', () => {
      expect(select().value).toBe('default');
    });

    it('selects a layout in the store when one is picked', async () => {
      select().options.get(4)!._selectViaInteraction();
      await settle();
      expect(store.selectedId()).toBe('custom');
    });

    it('translates the names again when the language changes', async () => {
      const translate = TestBed.inject(TranslateService);
      translate.setTranslation('jp', {
        'device-layout': { 'm4g-default': 'M4G 既定' },
      });
      translate.use('jp');
      await settle();
      expect(component.translatedDeviceLayouts()[1].name).toBe('M4G 既定');
    });
  });

  describe('built-in versus custom layouts', () => {
    beforeEach(create);

    it('knows the four built-in layouts', () => {
      for (const id of [
        'default',
        'm4g-default',
        'cc1-cc2-right-hand-only',
        'cc1-cc2-left-hand-only',
      ]) {
        store.setSelectedId(id);
        expect(component.selectedDeviceLayoutIsDefault())
          .withContext(id)
          .toBe(true);
      }
    });

    it('treats other layouts as custom', () => {
      patchState(store, addEntity(custom));
      store.setSelectedId('custom');
      expect(component.selectedDeviceLayoutIsDefault()).toBe(false);
    });

    it('has no delete button for a built-in layout', async () => {
      await settle();
      expect(buttonByIcon('delete')).toBeUndefined();
    });

    it('has a delete button for a custom layout', async () => {
      patchState(store, addEntity(custom));
      store.setSelectedId('custom');
      await settle();
      expect(buttonByIcon('delete')).toBeDefined();
    });
  });

  describe('download', () => {
    let clicked: { download: string; href: string }[];

    beforeEach(async () => {
      clicked = [];
      spyOn(URL, 'createObjectURL').and.returnValue('blob:fake');
      spyOn(URL, 'revokeObjectURL');
      spyOn(HTMLAnchorElement.prototype, 'click').and.callFake(function (
        this: HTMLAnchorElement,
      ) {
        clicked.push({ download: this.download, href: this.href });
      });
      patchState(store, addEntity(custom));
      store.setSelectedId('custom');
      await create();
    });

    it('downloads the selected layout as a json file named after it', () => {
      buttonByIcon('download').click();
      expect(clicked).toEqual([
        { download: 'My layout.json', href: 'blob:fake' },
      ]);
    });

    it('does not trigger anything else', () => {
      buttonByIcon('download').click();
      expect(dialog.open).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    beforeEach(async () => {
      patchState(store, addEntity(custom));
      store.setSelectedId('custom');
      await create();
    });

    it('asks for confirmation with the name of the layout', () => {
      dialogResult = { confirmed: false };
      buttonByIcon('delete').click();
      expect(dialog.open).toHaveBeenCalledOnceWith(
        DeleteDeviceLayoutConfirmDialogComponent,
        { data: { deviceLayoutName: 'My layout' } },
      );
    });

    it('keeps the layout when it is not confirmed', () => {
      dialogResult = { confirmed: false };
      buttonByIcon('delete').click();
      expect(store.ids()).toContain('custom');
      expect(store.selectedId()).toBe('custom');
      expect(snackBar.open).not.toHaveBeenCalled();
    });

    it('removes the layout, selects the default one and says so when confirmed', () => {
      dialogResult = { confirmed: true };
      buttonByIcon('delete').click();
      expect(store.ids()).not.toContain('custom');
      expect(store.selectedId()).toBe('default');
      expect(snackBar.open).toHaveBeenCalledOnceWith(
        'settings.device-layout.single-device-layout-deleted-message',
        undefined,
        { duration: 2000 },
      );
    });

    it('does nothing for a built-in layout', () => {
      store.setSelectedId('default');
      component.onDeleteDeviceLayoutButtonClick(new MouseEvent('click'));
      expect(dialog.open).not.toHaveBeenCalled();
    });
  });

  describe('loading from a file', () => {
    beforeEach(create);

    async function pick(content: string, name = 'my.json') {
      const input = el().querySelector('input[type=file]') as HTMLInputElement;
      const transfer = new DataTransfer();
      transfer.items.add(
        new File([content], name, { type: 'application/json' }),
      );
      input.files = transfer.files;
      component.loadDeviceLayoutFile();
      await new Promise((r) => setTimeout(r, 50));
      return input;
    }

    it('accepts only json files', () => {
      const input = el().querySelector('input[type=file]') as HTMLInputElement;
      expect(input.accept).toBe('.json');
      expect(input.hidden).toBe(true);
    });

    it('opens the file chooser from the choose file button', () => {
      const input = el().querySelector('input[type=file]') as HTMLInputElement;
      const click = spyOn(input, 'click');
      buttonByIcon('upload').click();
      expect(click).toHaveBeenCalled();
    });

    it('does nothing when no file is chosen', () => {
      component.loadDeviceLayoutFile();
      expect(dialog.open).not.toHaveBeenCalled();
    });

    it('opens the import dialog for a plain layout file', async () => {
      await pick(JSON.stringify({ layout: [[1, 2]] }), 'plain.json');
      expect(dialog.open).toHaveBeenCalledTimes(1);
      const [type, config] = (dialog.open as jasmine.Spy).calls.mostRecent()
        .args;
      expect(type).toBe(DeviceLayoutImportDialogComponent);
      expect(config.width).toBe('400px');
      expect(config.data.device).toBe('plain.json');
      expect(config.data.layoutMap).toEqual({ A: [[1, 2]] });
      expect(config.data.date instanceof Date).toBe(true);
    });

    it('takes the first layout of a supported device from a history file', async () => {
      await pick(
        JSON.stringify({
          history: [
            [
              { type: 'settings', device: 'TWO', layout: ['no'] },
              { type: 'layout', device: 'ONE', layout: ['yes'] },
              { type: 'layout', device: 'TWO', layout: ['later'] },
            ],
          ],
        }),
      );
      const config = (dialog.open as jasmine.Spy).calls.mostRecent().args[1];
      expect(config.data.layoutMap).toEqual({ A: ['yes'] });
    });

    it('accepts every device name of the history format', async () => {
      for (const device of ['One', 'ONE', 'TWO', 'M4G']) {
        (dialog.open as jasmine.Spy).calls.reset();
        await pick(
          JSON.stringify({
            history: [[{ type: 'layout', device, layout: [device] }]],
          }),
        );
        expect(dialog.open).withContext(device).toHaveBeenCalledTimes(1);
      }
    });

    it('ignores a history file without a supported layout', async () => {
      await pick(
        JSON.stringify({
          history: [[{ type: 'layout', device: 'LITE', layout: ['x'] }]],
        }),
      );
      expect(dialog.open).not.toHaveBeenCalled();
    });

    it('ignores a file that holds null', async () => {
      await pick('null');
      expect(dialog.open).not.toHaveBeenCalled();
    });

    it('clears the file input after the dialog is closed', async () => {
      const input = await pick(JSON.stringify({ layout: [] }));
      expect(input.value).toBe('');
    });
  });

  describe('loading from the device', () => {
    const loadButton = () => buttonByIcon('developer_board');

    it('is enabled when the Web Serial API is available', async () => {
      await create();
      expect(loadButton().disabled).toBe(!component.isWebSerialApiSupported);
      expect(component.isWebSerialApiSupported).toBe('serial' in navigator);
    });

    it('explains why it is disabled only when the Web Serial API is missing', async () => {
      await create();
      const tooltip = () =>
        fixture.debugElement
          .query(By.directive(MatTooltip))
          .injector.get(MatTooltip);
      // the tooltip is switched off while the API is available
      expect(tooltip().disabled).toBe(component.isWebSerialApiSupported);
      expect(tooltip().message).toBe(
        'general.web-serial-api-not-supported-message',
      );
    });

    it('is disabled, and dimmed, when the Web Serial API is not available', async () => {
      const descriptor = Object.getOwnPropertyDescriptor(
        Navigator.prototype,
        'serial',
      );
      delete (Navigator.prototype as any).serial;
      try {
        await create();
        expect(component.isWebSerialApiSupported).toBe(false);
        expect(loadButton().disabled).toBe(true);
        expect(loadButton().classList).toContain('opacity-30');
        expect(
          fixture.debugElement
            .query(By.directive(MatTooltip))
            .injector.get(MatTooltip).disabled,
        ).toBe(false);
      } finally {
        if (descriptor) {
          Object.defineProperty(Navigator.prototype, 'serial', descriptor);
        }
      }
    });

    it('connects, shows progress, and opens the import dialog when complete', fakeAsync(() => {
      const dismiss = jasmine.createSpy('dismiss');
      const updateProgress = jasmine.createSpy('updateProgress');
      spyOn(snackBar, 'openFromComponent').and.returnValue({
        dismiss,
        instance: { updateProgress },
      } as never);
      fixture = TestBed.createComponent(
        DeviceLayoutSettingPanelContentComponent,
      );
      component = fixture.componentInstance;
      fixture.detectChanges();

      component.loadDeviceLayoutFromDevice();
      tick();
      expect(serial.connect).toHaveBeenCalled();
      expect(snackBar.openFromComponent).toHaveBeenCalledTimes(1);
      const [type, config] = (
        snackBar.openFromComponent as jasmine.Spy
      ).calls.mostRecent().args;
      expect(type).toBe(ProgressSnackBarComponent);
      expect(config.data.progress).toBe(0);

      progress.next({ complete: false, loaded: 1, total: 4 });
      tick(300);
      expect(updateProgress).toHaveBeenCalledWith(25);

      const map = { A: [[1]] };
      progress.next({ complete: true, profileLayoutMap: map });
      tick(300);
      expect(serial.disconnect).toHaveBeenCalled();
      expect(dismiss).toHaveBeenCalled();
      const [dialogType, dialogConfig] = (
        dialog.open as jasmine.Spy
      ).calls.mostRecent().args;
      expect(dialogType).toBe(DeviceLayoutImportDialogComponent);
      expect(dialogConfig.width).toBe('400px');
      expect(dialogConfig.data.device).toBe('TWO');
      expect(dialogConfig.data.layoutMap).toBe(map);
      expect(dialogConfig.data.date instanceof Date).toBe(true);
    }));
  });
});
