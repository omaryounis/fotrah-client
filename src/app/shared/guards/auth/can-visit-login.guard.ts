import { Observable } from 'rxjs';
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChildFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

import { LoginService } from '@shared/services/login/login.service';

export const canVisitLoginGuard: CanActivateChildFn = (childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot):
  Observable<boolean | UrlTree>
  | Promise<boolean | UrlTree>
  | boolean
  | UrlTree => {
  return inject(LoginService).isLoggedIn()
    ? inject(Router).createUrlTree(["/dashboard"])
    : true;
};
