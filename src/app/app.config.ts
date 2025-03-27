import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
<<<<<<< HEAD
import { provideRouter, Router, withViewTransitions } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
=======
import { provideRouter } from '@angular/router';

>>>>>>> 5a871ec (initial commit)
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
<<<<<<< HEAD
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes , withViewTransitions()),
    provideClientHydration(withEventReplay()),
    provideAnimations(),
  ]
=======
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideClientHydration(withEventReplay())]
>>>>>>> 5a871ec (initial commit)
};
