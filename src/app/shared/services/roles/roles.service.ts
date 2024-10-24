import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { IRole, IRoleResponse } from '@root/src/app/modules/roles-management/role.model';
import { environment } from '@root/src/environments/environment';
import { IResponse } from '@shared/models/respoonse.model';
import { BaseEntityService } from '@shared/base-entity/base-entity.service';



@Injectable({
  providedIn: 'root',
})
export class RoleService extends BaseEntityService<IRole> {
  getRoles(pageSize?: number , pageIndex?: number ,searchQuery? :string): Observable<IRoleResponse> {
     
    pageIndex = pageIndex || 1;
    pageSize = pageSize || 50;
    searchQuery = searchQuery ||  '';
    return this.http
      .get<IRoleResponse>(`${environment.proxyBase}/Roles?PageIndex=${pageIndex}&PageSize=${pageSize}&KeyWord=${searchQuery}`)
      .pipe(tap((response: IRoleResponse) => {
        // Assuming setBaseEntity returns BaseEntityType<IRole>[].
        
        this.setBaseEntity(response.data.roles);
        this.setTotalCount(response.data.totalCount);
      }));
  }

  createRole(role: IRole): Observable<IResponse<IRole>> {
    delete role.id;
    return this.http
      .post<IResponse<IRole>>(`${environment.proxyBase}/Roles`, role)
      .pipe(tap((response: IResponse<IRole>) => {
        // Assuming setBaseEntity returns BaseEntityType<IRole>[].
        // this.upsertBaseEntity(response.data);
      }));
  }

  updateRole(role: IRole): Observable<IResponse<IRole>> {
    return this.http
      .put<IResponse<IRole>>(`${environment.proxyBase}/Roles`, role)
      .pipe(tap((response: IResponse<IRole>) => {
        // Assuming setBaseEntity returns BaseEntityType<IRole>[].
        // this.upsertBaseEntity(response.data);
      }));
  }

  deleteRole(id: number): Observable<IRole> {
    return this.http
      .delete<IRole>(`${environment.proxyBase}/Roles/${id}`)
      .pipe(tap(() => this.removeBaseEntity(id)));
  }
}