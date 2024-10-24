import { Injectable, signal } from '@angular/core';
import { IPermitTypes, IPermitTypesResponse } from '@root/src/app/modules/permit-types/permit-types.model';
import { environment } from '@root/src/environments/environment';
import { BaseEntityService } from '@shared/base-entity/base-entity.service';
import { IResponse } from '@shared/models/respoonse.model';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PermitTypesService extends BaseEntityService<IPermitTypes> {

  public rowData = signal<IPermitTypes>({} as IPermitTypes)
  getPermitTypes(pageIndex? : number ,pageSize? : number): Observable<IPermitTypesResponse> {
    pageIndex = pageIndex || 1;
    pageSize = pageSize || 50;
    var addtionUrl = '/PermitType?PageIndex=' + pageIndex + '&PageSize=' + pageSize;
    return this.http
      .get<IPermitTypesResponse>(environment.proxyBase + addtionUrl)
      .pipe(tap((response: IPermitTypesResponse) => {
        this.setBaseEntity(response.data.data);
        this.setTotalCount(response.data.totalCount);
      }));
  }

  createPermitType(activity: any): Observable<IResponse<IPermitTypes>> {
    delete activity.id;
    return this.http
      .post<IResponse<IPermitTypes>>(`${environment.proxyBase}/PermitType`, activity)
      .pipe(tap((response: IResponse<IPermitTypes>) => {
        // Assuming setBaseEntity returns BaseEntityType<IPermitType>[].
        // this.upsertBaseEntity(response.data);
      }));
  }

  updatePermitType(activity: IPermitTypes): Observable<IResponse<IPermitTypes>> {
    return this.http
      .put<IResponse<IPermitTypes>>(`${environment.proxyBase}/PermitType`, activity)
      .pipe(tap((response: IResponse<IPermitTypes>) => {
        // Assuming setBaseEntity returns BaseEntityType<IPermitType>[].
        // this.upsertBaseEntity(response.data);
      }));
  }

  deletePermitType(id: number): Observable<IPermitTypes> {
    return this.http
      .delete<IPermitTypes>(`${environment.proxyBase}/PermitType/${id}`)
      .pipe(tap(() => this.removeBaseEntity(id)));
  }
}
