import { Injectable, signal } from '@angular/core';
import { IEconomicClassification } from '@root/src/app/modules/economic-classifications/economic-classifications.model';
import { IFinancial, IFinancialResponse } from '@root/src/app/modules/financials/financials.model';
import { environment } from '@root/src/environments/environment';
import { BaseEntityService } from '@shared/base-entity/base-entity.service';
import { IResponse } from '@shared/models/respoonse.model';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FinancialItemsService extends BaseEntityService<IFinancial> {
  public rowData = signal<IFinancial>({} as IFinancial);

    getFinancials(pageSize?: number, pageIndex?: number , searchQuery? :string): Observable<IFinancialResponse> {
      pageIndex = pageIndex || 1;
      pageSize = pageSize || 50;
      searchQuery = searchQuery || '';
      var addtionUrl = '/FinancialItems?PageIndex=' + pageIndex + '&PageSize=' + pageSize + '&KeyWord=' + searchQuery;
      return this.http
        .get<IFinancialResponse>(`${environment.proxyBase}${addtionUrl}`)
        .pipe(tap((response: IFinancialResponse) => {
          // Assuming setBaseEntity returns BaseEntityType<IFinancial>[].
          this.setBaseEntity(response.data.financialItems);
          this.setTotalCount(response.data.totalCount);
        }));
    }
  
    createFinancial(Financial: IFinancial): Observable<IResponse<IFinancial>> {
      delete Financial.id;
      return this.http
        .post<IResponse<IFinancial>>(`${environment.proxyBase}/FinancialItems`, Financial)
        .pipe(tap((response: IResponse<IFinancial>) => {
          // Assuming setBaseEntity returns BaseEntityType<IFinancial>[].
          // this.upsertBaseEntity(response.data);
        }));
    }
  
    updateFinancial(Financial: IFinancial): Observable<IResponse<IFinancial>> {
      return this.http
        .put<IResponse<IFinancial>>(`${environment.proxyBase}/FinancialItems`, Financial)
        .pipe(tap((response: IResponse<IFinancial>) => {
          // Assuming setBaseEntity returns BaseEntityType<IFinancial>[].
          // this.upsertBaseEntity(response.data);
        }));
    }
  
    deleteFinancial(id: number): Observable<IFinancial> {
      return this.http
        .delete<IFinancial>(`${environment.proxyBase}/FinancialItems/${id}`)
        .pipe(tap(() => this.removeBaseEntity(id)));
    }
  }


