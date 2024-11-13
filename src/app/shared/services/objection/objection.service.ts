import { Injectable, signal } from "@angular/core";
import { environment } from "@root/src/environments/environment";
import { BaseEntityService } from "@shared/base-entity/base-entity.service";
import { IResponse } from "@shared/models/respoonse.model";
import { Observable, tap } from "rxjs";

import {
  IObjectionMission,
  IObjectionMissionResponse,
  IObjectionProgressRequest,
} from "@root/src/app/modules/transactions/components/objections/list-objections-tasks/objections.model";

@Injectable({
  providedIn: "root",
})
export class ObjectionService extends BaseEntityService<IObjectionMission> {
  rowData = signal<IObjectionMission>({} as IObjectionMission);

  objections = signal<IObjectionMission[]>([] as IObjectionMission[]);

  getObjections(
    pageIndex: string,
    pageSize: number,
    status?: number,
    objectionNumber?: string
  ): Observable<IObjectionMissionResponse> {
    var params = status ? "&status=" + status : "";
    params += objectionNumber ? "&objectionNumber=" + objectionNumber : "";
    return this.http
      .get<IObjectionMissionResponse>(
        `${environment.proxyBase}/Objection/missions?PageIndex=` +
          pageIndex +
          `&PageSize=` +
          pageSize +
          params
      )
      .pipe(
        tap((response: IObjectionMissionResponse) => {
          // Assuming setBaseEntity returns BaseEntityType<ITask>[].
          this.objections.set(response.data.objectionMissions);
          this.setTotalCount(response.data.totalCount);
        })
      );
  }

  proceedObjection(
    formData: FormData
  ): Observable<IResponse<IObjectionMissionResponse>> {
    return this.http
      .post<IResponse<IObjectionMissionResponse>>(
        `${environment.proxyBase}/Objection/proceed`,
        formData
      )
      .pipe(
        tap((response: IResponse<IObjectionMissionResponse>) => {
          // Assuming setBaseEntity returns BaseEntityType<ITaskConfirm>[].
          // this.upsertBaseEntity(response.data);s
        })
      );
  }
  sendtoOperations(
    Task: IObjectionProgressRequest
  ): Observable<IResponse<IObjectionMissionResponse>> {
    return this.http
      .post<IResponse<IObjectionMissionResponse>>(
        `${environment.proxyBase}/Objection/send-to-operational-management`,
        Task
      )
      .pipe(
        tap((response: IResponse<IObjectionMissionResponse>) => {
          
        })
      );
  }

  vote(
    Task: IObjectionProgressRequest
  ): Observable<IResponse<IObjectionMissionResponse>> {
    return this.http
      .post<IResponse<IObjectionMissionResponse>>(
        `${environment.proxyBase}/Objection/vote`,
        Task
      )
      .pipe(
        tap((response: IResponse<IObjectionMissionResponse>) => {
          // Assuming setBaseEntity returns BaseEntityType<ITaskConfirm>[].
          // this.upsertBaseEntity(response.data);s
        })
      );
  }

  finalDesicision(
    Task: IObjectionProgressRequest
  ): Observable<IResponse<IObjectionMissionResponse>> {
    return this.http
      .post<IResponse<IObjectionMissionResponse>>(
        `${environment.proxyBase}/Objection/coordinator-final-descision`,
        Task
      )
      .pipe(
        tap((response: IResponse<IObjectionMissionResponse>) => {
          // Assuming setBaseEntity returns BaseEntityType<ITaskConfirm>[].
          // this.upsertBaseEntity(response.data);s
        })
      );
  }

  OperationReview(
    formData: FormData
  ): Observable<IResponse<IObjectionMissionResponse>> {
    return this.http
      .post<IResponse<IObjectionMissionResponse>>(
        `${environment.proxyBase}/Objection/review-operational-management`,
        formData
      )
      .pipe(
        tap((response: IResponse<IObjectionMissionResponse>) => {
          // Assuming setBaseEntity returns BaseEntityType<ITaskConfirm>[].
          // this.upsertBaseEntity(response.data);s
        })
      );
  }

}

