import { Injectable, signal } from '@angular/core';
import { IFinancialsPermits, IFinancialsPermitsResponse } from '@root/src/app/modules/financials-permits/financials-permits.model';
import { environment } from '@root/src/environments/environment';
import { BaseEntityService } from '@shared/base-entity/base-entity.service';
import { IResponse } from '@shared/models/respoonse.model';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FinancialsPermitsService extends BaseEntityService<IFinancialsPermits> {
  public rowData = signal<IFinancialsPermits>({} as IFinancialsPermits)
  getFinancialsPermits(pageIndex? : number ,pageSize? : number): Observable<IFinancialsPermitsResponse> {
    pageIndex = pageIndex || 1;
    pageSize = pageSize || 50;
    var addtionUrl = '/PermitConfigrations?PageIndex=' + pageIndex + '&PageSize=' + pageSize;
    return this.http
      .get<IFinancialsPermitsResponse>(environment.proxyBase + addtionUrl)
      .pipe(tap((response: IFinancialsPermitsResponse) => {
        this.setBaseEntity(response.data.permitConfigrations);
        this.setTotalCount(response.data.totalCount);
      }));
  }

  createFinIFinancialsPermit(financialPermitsData: IFinancialsPermits): Observable<IResponse<IFinancialsPermits>> {
    delete financialPermitsData.formValidation;
    return this.http
      .post<IResponse<IFinancialsPermits>>(`${environment.proxyBase}/PermitConfigrations`, financialPermitsData)
      .pipe(tap((response: IResponse<IFinancialsPermits>) => {
        // Assuming setBaseEntity returns BaseEntityType<IFinancialsPermits>[].
        // this.upsertBaseEntity(response.data);
      }));
  }

  updateFinIFinancialsPermit(financialPermitsData: IFinancialsPermits): Observable<IResponse<IFinancialsPermits>> {
    return this.http
      .put<IResponse<IFinancialsPermits>>(`${environment.proxyBase}/PermitConfigrations`, financialPermitsData)
      .pipe(tap((response: IResponse<IFinancialsPermits>) => {
        // Assuming setBaseEntity returns BaseEntityType<IFinancialsPermits>[].
        // this.upsertBaseEntity(response.data);
      }));
  }

  deleteFinIFinancialsPermit(id: number): Observable<IFinancialsPermits> {
    return this.http
      .delete<IFinancialsPermits>(`${environment.proxyBase}/PermitConfigrations/${id}`)
      .pipe(tap(() => this.removeBaseEntity(id)));
  }
}
