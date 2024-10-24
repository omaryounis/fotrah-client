import { Injectable, signal } from '@angular/core';
import { IExcavationType, IExcavationTypeResponse } from '@root/src/app/modules/excavation-type/excavation-type.model';
import { environment } from '@root/src/environments/environment';
import { BaseEntityService } from '@shared/base-entity/base-entity.service';
import { ExcavationRoute } from '@shared/enums/excavation-route.enum';
import { IResponse } from '@shared/models/respoonse.model';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExcavationTypeService  extends BaseEntityService<IExcavationType> {
  public rowData = signal<IExcavationType>({} as IExcavationType);
  getExcavationTypes( excavationRoute : string ,pageIndex? : number ,pageSize? : number ): Observable<IExcavationTypeResponse> {
    pageIndex = pageIndex || 1;
    pageSize = pageSize || 50;
    var addtionUrl = excavationRoute == ExcavationRoute.EXCAVATIONTYPE ? '/ExcavationType' : '/ExcavationPathType' ;
    var responsData = excavationRoute == ExcavationRoute.EXCAVATIONTYPE ? 'excavationTypes' : 'excavationPathTypes'
    addtionUrl += '?PageIndex=' + pageIndex + '&PageSize=' + pageSize
    return this.http
      .get<IExcavationTypeResponse>(environment.proxyBase + addtionUrl)
      .pipe(tap((response: IExcavationTypeResponse) => {
        this.setBaseEntity(response.data[responsData]);
        this.setTotalCount(response.data.totalCount);
      }));
  }

  createExcavationType(permitType: any , excavationRoute : string): Observable<IResponse<IExcavationType>> {
    delete permitType.id;
    var addtionUrl = excavationRoute == ExcavationRoute.EXCAVATIONTYPE ? '/ExcavationType' : '/ExcavationPathType' ;

    return this.http
      .post<IResponse<IExcavationType>>(`${environment.proxyBase}${addtionUrl}`, permitType)
      .pipe(tap((response: IResponse<IExcavationType>) => {
        // Assuming setBaseEntity returns BaseEntityType<IExcavationType>[].
        // this.upsertBaseEntity(response.data);
      }));
  }

  updateExcavationType(permitType: IExcavationType , excavationRoute : string) : Observable<IResponse<IExcavationType>> {
    var addtionUrl = excavationRoute == ExcavationRoute.EXCAVATIONTYPE ? '/ExcavationType' : '/ExcavationPathType' ;

    return this.http
      .put<IResponse<IExcavationType>>(`${environment.proxyBase}${addtionUrl}`, permitType)
      .pipe(tap((response: IResponse<IExcavationType>) => {
        // Assuming setBaseEntity returns BaseEntityType<IExcavationType>[].
        // this.upsertBaseEntity(response.data);
      }));
  }

  deleteExcavationType(id: number): Observable<IExcavationType> {
    return this.http
      .delete<IExcavationType>(`${environment.proxyBase}/ExcavationType/${id}`)
      .pipe(tap(() => this.removeBaseEntity(id)));
  }
}
