import { Injectable } from '@angular/core';
import { environment } from '@root/src/environments/environment';
import { BaseEntityService } from '@shared/base-entity/base-entity.service';
import { IPermission } from '@shared/models/permission.model';
import { IResponse } from '@shared/models/respoonse.model';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PermissionService extends BaseEntityService<IPermission> {

  getPermissions(): Observable<IResponse<any>> {
    return this.http
      .get<IResponse<any>>(`${environment.proxyBase}/Permissions`)
      .pipe(tap((response: IResponse<any>) => {
        // Assuming setBaseEntity returns BaseEntityType<IPermission>[].
        this.setBaseEntity(response.data.permissions);
      }));
  }

  createPermission(permission: IPermission): Observable<IResponse<IPermission>> {
    delete permission.id;
    return this.http
      .post<IResponse<IPermission>>(`${environment.proxyBase}/Permissions`, permission)
      .pipe(tap((response: IResponse<IPermission>) => {
        // Assuming setBaseEntity returns BaseEntityType<IPermission>[].
        this.upsertBaseEntity(response.data);
      }));
  }

  updatePermission(permission: IPermission): Observable<IResponse<IPermission>> {
    return this.http
      .put<IResponse<IPermission>>(`${environment.proxyBase}/Permissions`, permission)
      .pipe(tap((response: IResponse<IPermission>) => {
        // Assuming setBaseEntity returns BaseEntityType<IPermission>[].
        this.upsertBaseEntity(response.data);
      }));
  }

  deletePermission(id: number): Observable<IPermission> {
    return this.http
      .delete<IPermission>(`${environment.proxyBase}/Permissions/${id}`)
      .pipe(tap(() => this.removeBaseEntity(id)));
  }
}
