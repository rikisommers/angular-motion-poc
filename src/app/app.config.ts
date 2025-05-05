import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
<<<<<<< HEAD
import { provideRouter, Router, withViewTransitions } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
=======
import { provideRouter, withViewTransitions } from '@angular/router';

>>>>>>> final
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
<<<<<<< HEAD
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes , withViewTransitions()),
    provideClientHydration(withEventReplay()),
    provideAnimations(),
=======
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes, withViewTransitions()),
    provideClientHydration(withEventReplay())
>>>>>>> final
  ]
};
