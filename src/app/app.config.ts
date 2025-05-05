import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, Router, withViewTransitions } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes , withViewTransitions()),
    provideClientHydration(withEventReplay()),
    provideAnimations(),
  ]
};
