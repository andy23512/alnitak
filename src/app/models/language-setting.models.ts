export interface LanguageSetting {
  uiLanguage: UiLanguage;
}

export enum UiLanguage {
  EN = 'en',
  ZH_TW = 'zh-TW',
}

export const SUPPORTED_LANGUAGES: UiLanguage[] = [
  UiLanguage.EN,
  UiLanguage.ZH_TW,
];
