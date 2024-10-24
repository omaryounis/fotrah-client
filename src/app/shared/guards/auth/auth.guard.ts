import { Observable } from 'rxjs';
import { inject } from '@angular/core';
import { Router, CanActivateChildFn, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';

import { LoginService } from '@shared/services/login/login.service';

export const authGuard: CanActivateChildFn = (childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot):
  Observable<boolean | UrlTree>
  | Promise<boolean | UrlTree>
  | boolean
  | UrlTree => {
  return inject(LoginService).isLoggedIn()
    ? true
    : inject(Router).createUrlTree(["/auth/login"]);
};
