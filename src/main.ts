import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { APP_INITIALIZER, ErrorHandler, inject, provideZoneChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
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
    provideZoneChangeDetection(),provideRouter(APP_ROUTES, withComponentInputBinding()),
    provideAnimations(),
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
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAppFactory,
      deps: [TranslateService, LanguageSettingStore],
      multi: true,
    },
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler,
    },
  ],
}).catch((err) => console.error(err));
