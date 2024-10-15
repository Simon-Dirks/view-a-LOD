import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { provideMatomo } from 'ngx-matomo-client';
import { Settings } from './config/settings';

const providers = [
  provideRouter(routes),
  provideAnimationsAsync(),
  provideHttpClient(),
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
