import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSelect } from '@angular/material/select';
import { By } from '@angular/platform-browser';
import { provideTranslateService } from '@ngx-translate/core';
import { LessonSettingStore } from 'src/app/stores/lesson-setting.store';
import { LessonSettingPanelContentComponent } from './lesson-setting-panel-content.component';

describe('LessonSettingPanelContentComponent', () => {
  let fixture: ComponentFixture<LessonSettingPanelContentComponent>;
  let store: InstanceType<typeof LessonSettingStore>;

  const selects = () =>
    fixture.debugElement
      .queryAll(By.directive(MatSelect))
      .map((d) => d.componentInstance as MatSelect);
  const languageSelect = () => selects()[0];
  const layoutSelect = () => selects()[1];
  async function settle() {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  beforeEach(async () => {
    TestBed.resetTestingModule();
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [LessonSettingPanelContentComponent],
      providers: [provideTranslateService()],
    }).compileComponents();
    store = TestBed.inject(LessonSettingStore);
    fixture = TestBed.createComponent(LessonSettingPanelContentComponent);
    await settle();
  });

  afterEach(() => localStorage.clear());

  it('has a language select and a keyboard layout select, with labels', () => {
    expect(selects().length).toBe(2);
    const text = fixture.nativeElement.textContent.toLowerCase();
    expect(text).toContain('settings.lesson.language-label');
    expect(text).toContain('settings.lesson.os-keyboard-layout-label');
  });

  describe('language', () => {
    it('shows English as the only, disabled choice', () => {
      expect(languageSelect().disabled).toBeTrue();
      expect(languageSelect().value).toBe('en');
      expect(languageSelect().options.map((o) => o.value)).toEqual(['en']);
      expect(languageSelect().options.get(0)!.viewValue.trim()).toBe('English');
    });

    it('is dimmed like a disabled field', () => {
      expect(
        fixture.nativeElement.querySelector('mat-form-field').classList,
      ).toContain('opacity-50');
    });
  });

  describe('OS keyboard layout', () => {
    it('shows the selected layout of the store', () => {
      expect(layoutSelect().value).toBe(store.keyboardLayoutId());
      expect(layoutSelect().value).toBe('us');
    });

    it('offers the layouts of the language, in the order of the store', () => {
      expect(layoutSelect().options.map((o) => o.value)).toEqual(
        store.keyboardLayoutOptions().map((l) => l.id),
      );
      expect(layoutSelect().options.map((o) => o.viewValue.trim())).toEqual(
        store.keyboardLayoutOptions().map((l) => l.name),
      );
      expect(layoutSelect().options.length).toBeGreaterThan(1);
    });

    it('is enabled', () => {
      expect(layoutSelect().disabled).toBeFalse();
    });

    it('selects a layout in the store when one is picked', async () => {
      const other = layoutSelect().options.find((o) => o.value !== 'us')!;
      other._selectViaInteraction();
      await settle();
      expect(store.keyboardLayoutId()).toBe(other.value);
    });

    it('shows a layout that changed in the store', async () => {
      const other = store.keyboardLayoutOptions().find((l) => l.id !== 'us')!;
      store.setKeyboardLayoutId(other.id);
      await settle();
      expect(layoutSelect().value).toBe(other.id);
    });
  });
});
