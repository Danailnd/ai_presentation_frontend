import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  provideHttpClient,
  withFetch,
  HTTP_INTERCEPTORS,
  withInterceptorsFromDi,
} from '@angular/common/http';

import { routes } from './app.routes';
import {
  MsalInterceptor,
  MsalService,
  MsalGuard,
  MsalBroadcastService,
} from '@azure/msal-angular';

import { msalProviders } from './auth.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptorsFromDi()),

    ...msalProviders,

    MsalService,
    MsalGuard,
    MsalBroadcastService,

    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true,
    },
  ],
};
