import { Injectable, signal } from '@angular/core';
import { IMunicipalities, IMunicipalitiesResponse } from '@root/src/app/modules/municipalities/municipalities.model';
import { environment } from '@root/src/environments/environment';
import { BaseEntityService } from '@shared/base-entity/base-entity.service';
import { IResponse } from '@shared/models/respoonse.model';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MunicipalsService extends BaseEntityService<IMunicipalities> {

  public rowData = signal<IMunicipalities>({} as IMunicipalities)
  
  getMunicipals(pageIndex? : number ,pageSize? : number , searchQuery? :string ): Observable<IMunicipalitiesResponse> {
    pageIndex = pageIndex || 1;
    pageSize = pageSize || 50;
    searchQuery = searchQuery || '';
    var addtionUrl = '/Municipals?PageIndex=' + pageIndex + '&PageSize=' + pageSize + '&KeyWord=' + searchQuery;
    return this.http
      .get<IMunicipalitiesResponse>(`${environment.proxyBase}${addtionUrl}`)
      .pipe(tap((response: IMunicipalitiesResponse) => {
        // Assuming setBaseEntity returns BaseEntityType<IMunicipalities>[].
        this.setBaseEntity(response.data.municipals);
        this.setTotalCount(response.data.totalCount);
      }));
  }

  createMunicipals(Municipals: IMunicipalities): Observable<IResponse<IMunicipalities>> {
    delete Municipals.id;
    return this.http
      .post<IResponse<IMunicipalities>>(`${environment.proxyBase}/Municipals`, Municipals)
      .pipe(tap((response: IResponse<IMunicipalities>) => {
        // Assuming setBaseEntity returns BaseEntityType<IMunicipalities>[].
        // this.upsertBaseEntity(response.data);
      }));
  }

  updateMunicipals(Municipals: IMunicipalities): Observable<IResponse<IMunicipalities>> {
    return this.http
      .put<IResponse<IMunicipalities>>(`${environment.proxyBase}/Municipals`, Municipals)
      .pipe(tap((response: IResponse<IMunicipalities>) => {
        // Assuming setBaseEntity returns BaseEntityType<IMunicipalities>[].
        // this.upsertBaseEntity(response.data);
      }));
  }

  deleteMunicipals(id: number): Observable<IMunicipalities> {
    return this.http
      .delete<IMunicipalities>(`${environment.proxyBase}/Municipals/${id}`)
      .pipe(tap(() => this.removeBaseEntity(id)));
  }
}

