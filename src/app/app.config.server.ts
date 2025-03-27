import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
<<<<<<< HEAD
import { provideServerRouting } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
=======
import { appConfig } from './app.config';
>>>>>>> 5a871ec (initial commit)

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
<<<<<<< HEAD
    provideServerRouting(serverRoutes)
=======
>>>>>>> 5a871ec (initial commit)
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
