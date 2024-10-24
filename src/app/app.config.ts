import { APP_INITIALIZER, ApplicationConfig, Injector, importProvidersFrom } from "@angular/core";
import { provideRouter } from "@angular/router";
import { HttpClient, provideHttpClient, withInterceptors } from "@angular/common/http";

import { MessageService } from "primeng/api";
import { AbilityModule, AbilityService } from "@casl/angular";
import { LoaderService } from "@shared/services/loader/loader.service";
import { DialogService, DynamicDialogConfig } from "primeng/dynamicdialog";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";

import {
  createAbility,
  AppAbility,
} from "@shared/services/ability/ability.service";

import { tokenInterceptor } from "@shared/interceptors/token/token.interceptor";
import { languageInterceptor } from "@shared/interceptors/language/language.interceptor";
import { contentTypeInterceptor } from "@shared/interceptors/content-type/content-type.interceptor";
import { errorHandelerInterceptor } from "@shared/interceptors/error-handeler/error-handeler.interceptor";
import { loadingSpinnerInterceptor } from "@shared/interceptors/loading-spinner/loading-spinner.interceptor";

import { routes } from "./app.routes";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { TranslateDirective, TranslateLoader, TranslateModule, TranslateService } from "@ngx-translate/core";
import { LOCATION_INITIALIZED } from "@angular/common";
import { take } from "rxjs";
import { NameFormatterPipe } from "@shared/pipes/name-formatter.pipe";
import { UtilsService } from "@shared/services/utils/utils.service";

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
export const appConfig: ApplicationConfig = {
  providers: [
    LoaderService,
    DialogService,
    MessageService,
    AbilityService,
    UtilsService,
    DynamicDialogConfig,
    NameFormatterPipe,
    provideHttpClient(),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([tokenInterceptor])),
    provideHttpClient(withInterceptors([languageInterceptor])),
    provideHttpClient(withInterceptors([contentTypeInterceptor])),
    provideHttpClient(withInterceptors([errorHandelerInterceptor])),
    provideHttpClient(withInterceptors([loadingSpinnerInterceptor])),
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        },
      })
    ),
    { provide: AppAbility, useFactory: createAbility },
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFactory,
      deps: [TranslateService, Injector],
      multi: true
  }

  ],
};
export function appInitializerFactory(translateService: TranslateService, injector: Injector): () => Promise<any> {
  // tslint:disable-next-line:no-any
  return () => new Promise<any>((resolve: any) => {
    const locationInitialized = injector.get(LOCATION_INITIALIZED, Promise.resolve(null));
    locationInitialized.then(() => {
      translateService.use(localStorage.getItem("lang") || window.navigator.language) // here u can change language loaded before reander enything
        .pipe(take(1))
        .subscribe(() => {},
        err => console.error(err), () => resolve(null));
    });
  });
}
