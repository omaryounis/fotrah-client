import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { Injectable, signal } from "@angular/core";


import { MessageService } from "primeng/api";

import { clearAbility, createAbility } from "../ability/ability.service";

import { IUserCredentials, IUserInfo } from "@shared/models/user.model";

import { environment } from '@root/src/environments/environment';
import { data } from "autoprefixer";
import { JwtPayload, jwtDecode } from "jwt-decode";

@Injectable({
  providedIn: "root",
})
export class LoginService {
  userInfo = signal<IUserInfo | null>(null);

  constructor(private http: HttpClient, private router: Router, private messageService: MessageService) { }

  login(credentials: IUserCredentials): Observable<any> {
    const loginUrl = `${environment.proxyBase}/Users/login`;
    return this.http
      .post(loginUrl, credentials)
      .pipe(
        tap((success) => { this.handleLoginSuccess(success) })
      );
  }

  private handleLoginSuccess(response: any) {
    const { data: { accessToken, refreshToken } } = response;
    this.userInfo.set(response.data);
    localStorage.setItem("userInfo", JSON.stringify(response.data));
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    createAbility();
  }

  refreshToken( refreshToken: string) {
    const url = `${environment.proxyBase}/Tokens/RefreshToken`;
    const reqBody = {
      // token,
      refreshToken : refreshToken,
    };

    return this.http.post(url, reqBody , {responseType : 'text'});
  }

  logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userInfo");
    clearAbility();

    this.router.navigate(["/auth/login"]);
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem("accessToken");
    return !!token;
  }

  getUserInfo() {
    let userInfo = this.userInfo();
    if (!userInfo) {
      userInfo = JSON.parse(localStorage.getItem("userInfo") || "");
    }

    return userInfo;
  }
  hasPermission(permission: string[]): boolean {
    // Replace with your actual permission check logic
    // For example, you might check user roles or permissions stored in local storage
    const accessToken = localStorage.getItem('accessToken');
    const decodedAccessToken = jwtDecode(accessToken!) as JwtPayload & { permissions: string[] };
    // permissionList = decodedAccessToken?.permissions || [];
    const userPermissions = decodedAccessToken?.permissions || []; // Replace with actual user permissions
    return userPermissions.some(data => permission.includes(data));
  }
  checkPermissions(currComponent: string , checkByComponent : boolean ): boolean {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      return false;
    }
    let permissionList = [] as string[];
    const decodedAccessToken = jwtDecode(accessToken) as JwtPayload & { permissions: string[] };
    permissionList = decodedAccessToken?.permissions || [];
    permissionList = checkByComponent ? permissionList.map(a => a.split('_')[1]) : permissionList;
    return permissionList.includes(currComponent);
  }
}
