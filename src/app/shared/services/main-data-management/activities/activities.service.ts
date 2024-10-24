import { Injectable, signal } from '@angular/core';
import { IActivity, IActivityResponse } from '@root/src/app/modules/activities/activities.model';
import { environment } from '@root/src/environments/environment';
import { BaseEntityService } from '@shared/base-entity/base-entity.service';
import { IResponse } from '@shared/models/respoonse.model';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivitiesService extends BaseEntityService<IActivity> {
  public rowData = signal<IActivity>({} as IActivity)
  getActivities(pageIndex? : number ,pageSize? : number): Observable<IActivityResponse> {
    pageIndex = pageIndex || 1;
    pageSize = pageSize || 50;
    var addtionUrl = '/Activities?PageIndex=' + pageIndex + '&PageSize=' + pageSize;
    return this.http
      .get<IActivityResponse>(environment.proxyBase + addtionUrl)
      .pipe(tap((response: IActivityResponse) => {
        this.setBaseEntity(response.data.activities);
        this.setTotalCount(response.data.totalCount);
      }));
  }

  createActivity(activity: any): Observable<IResponse<IActivity>> {
    delete activity.id;
    return this.http
      .post<IResponse<IActivity>>(`${environment.proxyBase}/Activities`, activity)
      .pipe(tap((response: IResponse<IActivity>) => {
        // Assuming setBaseEntity returns BaseEntityType<IActivity>[].
        // this.upsertBaseEntity(response.data);
      }));
  }

  updateActivity(activity: IActivity): Observable<IResponse<IActivity>> {
    return this.http
      .put<IResponse<IActivity>>(`${environment.proxyBase}/Activities`, activity)
      .pipe(tap((response: IResponse<IActivity>) => {
        // Assuming setBaseEntity returns BaseEntityType<IActivity>[].
        // this.upsertBaseEntity(response.data);
      }));
  }

  deleteActivity(id: number): Observable<IActivity> {
    return this.http
      .delete<IActivity>(`${environment.proxyBase}/Activities/${id}`)
      .pipe(tap(() => this.removeBaseEntity(id)));
  }
}

