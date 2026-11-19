import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { MiscSettingStore } from 'src/app/stores/misc-setting.store';
import { LayoutComponent } from '../layout/layout.component';
import { MiscSettingPanelContentComponent } from './misc-setting-panel-content.component';

describe('MiscSettingPanelContentComponent', () => {
  let fixture: ComponentFixture<MiscSettingPanelContentComponent>;
  let store: InstanceType<typeof MiscSettingStore>;

  const inputs = () =>
    Array.from(
      fixture.nativeElement.querySelectorAll('input[type=number]'),
    ) as HTMLInputElement[];
  async function settle() {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }
  async function typeInto(input: HTMLInputElement, value: string) {
    input.value = value;
    input.dispatchEvent(new Event('input'));
    await settle();
  }

  beforeEach(async () => {
    TestBed.resetTestingModule();
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [MiscSettingPanelContentComponent],
      providers: [provideTranslateService()],
    }).compileComponents();
    store = TestBed.inject(MiscSettingStore);
    fixture = TestBed.createComponent(MiscSettingPanelContentComponent);
    await settle();
  });

  afterEach(() => localStorage.clear());

  it('shows the default rotation angles', () => {
    expect(inputs().map((i) => i.value)).toEqual(['10', '0']);
  });

  it('shows the angles from the store', async () => {
    store.set('thumbRotationAngle', 25);
    store.set('nonThumbRotationAngle', -5);
    await settle();
    expect(inputs().map((i) => i.value)).toEqual(['25', '-5']);
  });

  it('writes the thumb rotation angle to the store', async () => {
    await typeInto(inputs()[0], '30');
    expect(store.thumbRotationAngle()).toBe(30);
    expect(store.nonThumbRotationAngle()).toBe(0);
  });

  it('writes the non-thumb rotation angle to the store', async () => {
    await typeInto(inputs()[1], '12');
    expect(store.nonThumbRotationAngle()).toBe(12);
    expect(store.thumbRotationAngle()).toBe(10);
  });

  it('shows a degree sign after each input', () => {
    const suffixes = Array.from(
      fixture.nativeElement.querySelectorAll('.mat-mdc-form-field-text-suffix'),
    ).map((s) => (s as HTMLElement).textContent?.trim());
    expect(suffixes).toEqual(['°', '°']);
  });

  describe('the preview layout', () => {
    const layout = () =>
      fixture.debugElement.children.find(
        (c) => c.componentInstance instanceof LayoutComponent,
      )!;
    it('is shown even when the layout is hidden in the settings', () => {
      expect(layout().componentInstance.alwaysShowLayout()).toBe(true);
      expect(
        layout().nativeElement.querySelectorAll('g[appswitch]').length,
      ).toBe(18);
    });

    it('is given direction labels for the centre-adjacent keys', () => {
      const map = layout().componentInstance.keyLabelMap();
      expect(Object.keys(map).length).toBeGreaterThan(0);
      for (const list of Object.values(map) as { c: string }[][]) {
        expect(list.length).toBe(1);
        expect(['E', 'N', 'W', 'S'].map((d) => 'direction.' + d)).toContain(
          list[0].c,
        );
      }
    });

    it('turns with the angle settings', async () => {
      const d = () =>
        (
          layout().nativeElement.querySelector(
            'g[appswitch] path',
          ) as SVGPathElement
        ).getAttribute('d');
      const before = d();
      store.set('thumbRotationAngle', 40);
      store.set('nonThumbRotationAngle', 40);
      await settle();
      expect(d()).not.toBe(before);
    });
  });
});
