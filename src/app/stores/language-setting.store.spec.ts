import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { UiLanguage } from '../models/language-setting.models';
import { LanguageSettingStore } from './language-setting.store';

describe('LanguageSettingStore', () => {
  let use: jasmine.Spy;

  function create(browserLanguage: string | undefined, keepStorage = false) {
    TestBed.resetTestingModule();
    if (!keepStorage) {
      localStorage.clear();
    }
    use = jasmine.createSpy('use');
    TestBed.configureTestingModule({
      providers: [
        {
          provide: TranslateService,
          useValue: { getBrowserCultureLang: () => browserLanguage, use },
        },
      ],
    });
    const store = TestBed.inject(LanguageSettingStore);
    TestBed.tick();
    return store;
  }

  beforeEach(() => localStorage.clear());

  describe('first language', () => {
    it('follows the browser language when it is supported', () => {
      expect(create('zh-TW').uiLanguage()).toBe(UiLanguage.ZH_TW);
      expect(create('jp').uiLanguage()).toBe(UiLanguage.JP);
      expect(create('en').uiLanguage()).toBe(UiLanguage.EN);
    });

    it('uses English when the browser language is not supported', () => {
      expect(create('fr').uiLanguage()).toBe(UiLanguage.EN);
      expect(create('en-US').uiLanguage()).toBe(UiLanguage.EN);
    });

    it('uses English when the browser language is unknown', () => {
      expect(create(undefined).uiLanguage()).toBe(UiLanguage.EN);
    });
  });

  describe('switching the page language', () => {
    it('applies the first language straight away', () => {
      create('zh-TW');
      expect(use).toHaveBeenCalledWith('zh-TW');
    });

    it('applies a language that is set later', () => {
      const store = create('en');
      use.calls.reset();
      store.set('uiLanguage', UiLanguage.JP);
      TestBed.tick();
      expect(use).toHaveBeenCalledOnceWith('jp');
    });
  });

  describe('local storage', () => {
    it('saves the chosen language', () => {
      const store = create('en');
      store.set('uiLanguage', UiLanguage.ZH_TW);
      TestBed.tick();
      expect(JSON.parse(localStorage.getItem('languageSetting')!)).toEqual({
        uiLanguage: 'zh-TW',
      });
    });

    it('prefers the saved language over the browser language', () => {
      localStorage.setItem(
        'languageSetting',
        JSON.stringify({ uiLanguage: 'jp' }),
      );
      expect(create('zh-TW', true).uiLanguage()).toBe(UiLanguage.JP);
    });
  });
});
