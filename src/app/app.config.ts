import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { provideMatomo } from 'ngx-matomo-client';
import { Settings } from './config/settings';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

const httpLoaderFactory: (http: HttpClient) => TranslateHttpLoader = (
  http: HttpClient,
) => new TranslateHttpLoader(http, './assets/i18n/', '.json');

const providers = [
  provideRouter(routes),
  provideAnimationsAsync(),
  provideHttpClient(),
  importProvidersFrom([
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ]),
];

const matomoConfigExists: boolean = !!(
  Settings.matomo &&
  Settings.matomo.siteId &&
  Settings.matomo.trackerUrl
);
if (matomoConfigExists) {
  providers.push(
    provideMatomo({
      siteId: Settings.matomo.siteId,
      trackerUrl: Settings.matomo.trackerUrl,
    }),
  );
}

export const appConfig: ApplicationConfig = {
  providers: providers,
};
