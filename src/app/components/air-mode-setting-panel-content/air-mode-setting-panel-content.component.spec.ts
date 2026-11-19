import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCheckbox } from '@angular/material/checkbox';
import { By } from '@angular/platform-browser';
import { provideTranslateService } from '@ngx-translate/core';
import { AirModeSettingStore } from 'src/app/stores/air-mode-setting.store';
import { AirModeSettingPanelContentComponent } from './air-mode-setting-panel-content.component';

describe('AirModeSettingPanelContentComponent', () => {
  let fixture: ComponentFixture<AirModeSettingPanelContentComponent>;
  let store: InstanceType<typeof AirModeSettingStore>;

  const inputs = () =>
    Array.from(
      fixture.nativeElement.querySelectorAll('input[type=number]'),
    ) as HTMLInputElement[];
  const checkboxInput = () =>
    fixture.nativeElement.querySelector(
      'input[type=checkbox]',
    ) as HTMLInputElement;
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
      imports: [AirModeSettingPanelContentComponent],
      providers: [provideTranslateService()],
    }).compileComponents();
    store = TestBed.inject(AirModeSettingStore);
    fixture = TestBed.createComponent(AirModeSettingPanelContentComponent);
    await settle();
  });

  afterEach(() => localStorage.clear());

  it('shows the description', () => {
    expect(fixture.nativeElement.textContent).toContain(
      'settings.air-mode.description',
    );
  });

  it('shows the stored settings', async () => {
    store.set('enabled', true);
    store.set('characterEntrySpeed', 45);
    store.set('chordSpeed', 55);
    await settle();
    expect(checkboxInput().checked).toBe(true);
    expect(inputs().map((i) => i.value)).toEqual(['45', '55']);
  });

  it('starts disabled with the default speeds', () => {
    expect(checkboxInput().checked).toBe(false);
    expect(inputs().map((i) => i.value)).toEqual(['30', '30']);
  });

  it('turns air mode on and off through the checkbox', async () => {
    checkboxInput().click();
    await settle();
    expect(store.enabled()).toBe(true);
    checkboxInput().click();
    await settle();
    expect(store.enabled()).toBe(false);
  });

  it('disables the speed inputs while air mode is off, and enables them when on', async () => {
    expect(inputs().every((i) => i.disabled)).toBe(true);
    store.set('enabled', true);
    await settle();
    expect(inputs().every((i) => !i.disabled)).toBe(true);
  });

  it('writes the character entry speed to the store', async () => {
    store.set('enabled', true);
    await settle();
    await typeInto(inputs()[0], '60');
    expect(store.characterEntrySpeed()).toBe(60);
    expect(store.chordSpeed()).toBe(30);
  });

  it('writes the chord speed to the store', async () => {
    store.set('enabled', true);
    await settle();
    await typeInto(inputs()[1], '80');
    expect(store.chordSpeed()).toBe(80);
    expect(store.characterEntrySpeed()).toBe(30);
  });

  it('shows the speed units', () => {
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('general.character-entry-speed-unit');
    expect(text).toContain('general.chord-speed-unit');
  });

  it('has a MatCheckbox for the switch', () => {
    expect(fixture.debugElement.query(By.directive(MatCheckbox))).toBeTruthy();
  });
});
