import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';

import { catchError, throwError } from 'rxjs';

import { MessageService } from 'primeng/api';
import { LoginService } from '@shared/services/login/login.service';
import { ErrorService } from '@shared/services/error/error.service';
import { LanguageService } from '@shared/services/language/language.service';
import { TranslateService } from '@ngx-translate/core';

let router: Router;
let errorService: ErrorService;
let loginService: LoginService;
let messageService: MessageService;
let langService: TranslateService;

export const errorHandelerInterceptor: HttpInterceptorFn = (req, next) => {
  router = inject(Router);
  errorService = inject(ErrorService);
  loginService = inject(LoginService);
  messageService = inject(MessageService);
  langService = inject(TranslateService);

  return next(req).pipe(
    catchError(async (error: HttpErrorResponse): Promise<any> => {
      if (error?.status === 401) {
        
        // return handel401(req, next, error ,langService.instant('error'));
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = window.origin + '/auth/login';
      return throwError(() => error);
      }
      if (error?.status === 403) {
        return handel403(req, next, error ,langService.instant('error'));
      }

      console.log(error)
      const errorMessage = errorService.getErrorMessage(error);
      messageService.add({ severity: 'error', summary: langService.instant('error') , detail: errorMessage });
    })
  );
};

const handelInvalidToken = (request: any, next: any) => {
  // const accessToken = localStorage.getItem('accessToken') || '';
  const refreshToken = localStorage.getItem('refreshToken') || '';
  loginService.refreshToken(refreshToken).subscribe( res => {
     
    localStorage.setItem('accessToken', res.toString());

  },
    error => {
      loginService.logout();
    },
 
  )
}

const handel401 = (req: any, next: any, error: any , title :string) => {
    if (error.error.message === "access token has expired") {
    return handelInvalidToken(req, next);
  }
  messageService.add({ severity: 'error', summary: title, detail: error.error.message });
}

const handel403 = (req: any, next: any, error: any , title :string) => {

  if (req?.url?.includes("RefreshToken")) {
    return loginService.logout();
  }
  // history.back();
  // messageService.add({ severity: 'error', summary: title, detail: error.error.message });
}