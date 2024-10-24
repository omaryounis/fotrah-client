import { Injectable, signal } from '@angular/core';
import { IEconomicClassification, IEconomicClassificationResponse } from '@root/src/app/modules/economic-classifications/economic-classifications.model';
import { environment } from '@root/src/environments/environment';
import { BaseEntityService } from '@shared/base-entity/base-entity.service';
import { IResponse } from '@shared/models/respoonse.model';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EconomicClassificationsService extends BaseEntityService<IEconomicClassification> {
  public rowData = signal<IEconomicClassification>({} as IEconomicClassification);
  getEconomicClassifications(pageSize? :number , pageIndex? :number): Observable<IEconomicClassificationResponse> {
    pageIndex = pageIndex || 1;
    pageSize = pageSize || 50;
    var addtionUrl = '/Gfs?PageIndex=' + pageIndex + '&PageSize=' + pageSize;
    return this.http
      .get<IEconomicClassificationResponse>(`${environment.proxyBase}${addtionUrl}`)
      .pipe(tap((response: IEconomicClassificationResponse) => {
        // Assuming setBaseEntity returns BaseEntityType<IEconomicClassification>[].
        this.setBaseEntity(response.data.gfsDetails);
        this.setTotalCount(response.data.totalCount);
      }));
  }

  createEconomicClassification(EconomicClassification: any): Observable<IResponse<IEconomicClassification>> {
    delete EconomicClassification.id;
    return this.http
      .post<IResponse<IEconomicClassification>>(`${environment.proxyBase}/Gfs`, EconomicClassification)
      .pipe(tap((response: IResponse<IEconomicClassification>) => {
        // Assuming setBaseEntity returns BaseEntityType<IEconomicClassification>[].
        // this.upsertBaseEntity(response.data);
      }));
  }

  updateEconomicClassification(EconomicClassification: any): Observable<IResponse<IEconomicClassification>> {
    return this.http
      .put<IResponse<IEconomicClassification>>(`${environment.proxyBase}/Gfs`, EconomicClassification)
      .pipe(tap((response: IResponse<IEconomicClassification>) => {
        // Assuming setBaseEntity returns BaseEntityType<IEconomicClassification>[].
        // this.upsertBaseEntity(response.data);
      }));
  }

  deleteEconomicClassification(id: number): Observable<IEconomicClassification> {
    return this.http
      .delete<IEconomicClassification>(`${environment.proxyBase}/Gfs/${id}`)
      .pipe(tap(() => this.removeBaseEntity(id)));
  }
}
