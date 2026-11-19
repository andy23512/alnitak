import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { DeviceLayoutStore } from 'src/app/stores/device-layout.store';
import { VisibilitySettingStore } from 'src/app/stores/visibility-setting.store';
import { QuickSettingPanelContentComponent } from './quick-setting-panel-content.component';

describe('QuickSettingPanelContentComponent', () => {
  let fixture: ComponentFixture<QuickSettingPanelContentComponent>;
  let layouts: InstanceType<typeof DeviceLayoutStore>;
  let visibility: InstanceType<typeof VisibilitySettingStore>;

  const buttons = () =>
    Array.from(
      fixture.nativeElement.querySelectorAll('button'),
    ) as HTMLButtonElement[];
  const text = (b: HTMLElement) => (b.textContent ?? '').trim();
  async function settle() {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  beforeEach(async () => {
    TestBed.resetTestingModule();
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [QuickSettingPanelContentComponent],
      providers: [provideTranslateService()],
    }).compileComponents();
    layouts = TestBed.inject(DeviceLayoutStore);
    visibility = TestBed.inject(VisibilitySettingStore);
    fixture = TestBed.createComponent(QuickSettingPanelContentComponent);
    await settle();
  });

  afterEach(() => localStorage.clear());

  it('offers the CC1/CC2 default and the M4G default, in that order', () => {
    expect(buttons().map(text)).toEqual([
      'quick-setting.cc1-cc2-default-layout',
      'quick-setting.m4g-default-layout',
    ]);
  });

  it('lays the buttons out in a column', () => {
    expect(fixture.nativeElement.classList).toContain('flex-col');
  });

  it('shows the selected layout as the highlighted, non-clickable button', async () => {
    expect(layouts.selectedId()).toBe('default');
    const [cc, m4g] = buttons();
    expect(cc.classList).not.toContain('!bg-gray-600');
    expect(m4g.classList).toContain('!bg-gray-600');
    cc.click();
    await settle();
    expect(layouts.selectedId()).toBe('default');
  });

  it('selects the M4G layout and hides the third thumb switch', async () => {
    buttons()[1].click();
    await settle();
    expect(layouts.selectedId()).toBe('m4g-default');
    expect(visibility.layoutThumb3Switch()).toBe(false);
  });

  it('swaps which button is highlighted after a click', async () => {
    buttons()[1].click();
    await settle();
    const [cc, m4g] = buttons();
    expect(cc.classList).toContain('!bg-gray-600');
    expect(m4g.classList).not.toContain('!bg-gray-600');
  });

  it('selects the default layout again and shows the third thumb switch', async () => {
    buttons()[1].click();
    await settle();
    buttons()[0].click();
    await settle();
    expect(layouts.selectedId()).toBe('default');
    expect(visibility.layoutThumb3Switch()).toBe(true);
  });
});
