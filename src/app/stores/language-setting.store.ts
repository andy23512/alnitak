import {
  withDevtools,
  withStorageSync,
} from '@angular-architects/ngrx-toolkit';
import { effect, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { TranslateService } from '@ngx-translate/core';
import {
  LanguageSetting,
  SUPPORTED_LANGUAGES,
  UiLanguage,
} from '../models/language-setting.models';

function getInitialLanguageSetting(): LanguageSetting {
  const translateService = inject(TranslateService);
  const detectedLanguage =
    translateService.getBrowserCultureLang() as UiLanguage;
  let uiLanguage: UiLanguage = UiLanguage.EN;
  if (SUPPORTED_LANGUAGES.includes(detectedLanguage)) {
    uiLanguage = detectedLanguage;
  }
  return {
    uiLanguage,
  };
}

export const LanguageSettingStore = signalStore(
  { providedIn: 'root' },
  withDevtools('languageSetting'),
  withStorageSync({
    key: 'languageSetting',
    parse(stateString: string) {
      return { ...getInitialLanguageSetting(), ...JSON.parse(stateString) };
    },
  }),
  withState(() => getInitialLanguageSetting()),
  withMethods((store) => ({
    set<K extends keyof LanguageSetting>(key: K, value: LanguageSetting[K]) {
      patchState(store, (state) => ({
        ...state,
        [key]: value,
      }));
    },
  })),
  withHooks({
    onInit(store) {
      const translateService = inject(TranslateService);
      effect(() => {
        translateService.use(store.uiLanguage());
      });
    },
  }),
);
