import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '../../services/login/login.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard implements CanActivate {

  constructor(private authService: LoginService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
    
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    const requiredPermission = route.data['permissions'];
    const hasListPermission = this.authService.hasPermission(requiredPermission);

    if (!hasListPermission) {
      // Redirect to a 'not authorized' page or home page
      this.router.navigate(['/dashboard'])
      return false;
    }
    return true;
  }
}
