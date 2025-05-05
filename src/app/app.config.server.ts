import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
<<<<<<< HEAD
import { provideServerRouting } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
=======
import { appConfig } from './app.config';
>>>>>>> final

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
<<<<<<< HEAD
    provideServerRouting(serverRoutes)
=======
>>>>>>> final
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
