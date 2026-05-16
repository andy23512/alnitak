import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  ErrorHandler,
  inject,
  provideAppInitializer,
  provideZoneChangeDetection,
} from '@angular/core';
import { MAT_TOOLTIP_DEFAULT_OPTIONS } from '@angular/material/tooltip';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideLoadingBarInterceptor } from '@ngx-loading-bar/http-client';
import { provideLoadingBarRouter } from '@ngx-loading-bar/router';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppComponent } from './app/app.component';
import { APP_ROUTES } from './app/app.routes';
import { GlobalErrorHandler } from './app/error-handler/global-error-handler';
import { LanguageSettingStore } from './app/stores/language-setting.store';

export function initializeAppFactory() {
  const _languageSettingStore = inject(LanguageSettingStore);
  return () => {};
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection(),
    provideRouter(APP_ROUTES, withComponentInputBinding()),
    provideHttpClient(withInterceptorsFromDi()),
    provideLoadingBarInterceptor(),
    provideLoadingBarRouter(),
    provideTranslateService({
      lang: 'en',
      fallbackLang: 'en',
      loader: provideTranslateHttpLoader({
        prefix: './assets/i18n/',
        suffix: '.json',
      }),
    }),
    provideAppInitializer(() => {
      const _languageSettingStore = inject(LanguageSettingStore);
      const _translateService = inject(TranslateService);
    }),
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler,
    },
    {
      provide: MAT_TOOLTIP_DEFAULT_OPTIONS,
      useValue: { disableTooltipInteractivity: true },
    },
  ],
}).catch((err) => console.error(err));
