import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';



if (environment.production) {
  enableProdMode();
}
registerLocaleData(localeEs);

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
