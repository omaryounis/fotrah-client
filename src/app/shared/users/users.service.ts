import { Injectable } from '@angular/core';
import { IUser } from '../../modules/user-managment/user-managment.model';
import { environment } from '@root/src/environments/environment';
import { BaseEntityService } from '@shared/base-entity/base-entity.service';
import { IResponse } from '@shared/models/respoonse.model';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService extends BaseEntityService<IUser> {
  
  getUsers(pageSize : number , pageIndex : number ,search? : string ): Observable<IResponse<any>> {
    // const additionUrl = search ? `&Email=${search}&UserName=${search}&IdentityNumber=${search}` : ``;
    const additionUrl = search ? `&KeyWord=${search}` : ``;
    return this.http
      .get<IResponse<any>>(`${environment.proxyBase}/Users?PageIndex=${pageIndex}&PageSize=${pageSize}${additionUrl}`)
      .pipe(tap((response: IResponse<any>) => {
        // Assuming setBaseEntity returns BaseEntityType<IUser>[].
        this.setBaseEntity(response.data.users);
        this.setTotalCount(response.data.totalCount);
        this.setPageIndex(pageIndex);
      }));
  }
  getADUsers(): Observable<IResponse<any>> {
    return this.http
      .get<IResponse<any>>(`${environment.proxyBase}/Users/GetADUsers`)
      .pipe(tap((response: IResponse<any>) => {
        // Assuming setBaseEntity returns BaseEntityType<IUser>[].
        // this.setBaseEntity(response.data.users);
      }));
  }
  createUser(role: IUser): Observable<IResponse<IUser>> {
    delete role.id;
    return this.http
      .post<IResponse<IUser>>(`${environment.proxyBase}/Users/register`, role)
      .pipe(tap((response: IResponse<IUser>) => {
        // Assuming setBaseEntity returns BaseEntityType<IUser>[].
        // response.data.userName = response.data.username;
        this.upsertBaseEntity(response.data);
      }));
  }

  updateUser(role: IUser): Observable<IResponse<IUser>> {
    return this.http
      .put<IResponse<IUser>>(`${environment.proxyBase}/Users`, role)
      .pipe(tap((response: IResponse<IUser>) => {
        // Assuming setBaseEntity returns BaseEntityType<IUser>[].
        // this.upsertBaseEntity(response.data);
      }));
  }

  deleteUser(id: number): Observable<IResponse<IUser>> {
    return this.http
      .delete<IResponse<IUser>>(`${environment.proxyBase}/Users?id=${id}`)
      .pipe(tap(() => this.entities));
  }
}
