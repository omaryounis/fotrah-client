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
  private currentPageIndex: string = '1';
  private currentPageSize: number = 10;
  private currentStatus?: number;
  private currentObjectionNumber?: string;
  private currentVoteStatus?: number;

  getObjections(
    pageIndex?: string,
    pageSize?: number,
    status?: number,
    objectionNumber?: string,
    voteStatus?: number
  ): Observable<IObjectionMissionResponse> {

    const effectivePageIndex = pageIndex ?? this.currentPageIndex;
    const effectivePageSize = pageSize ?? this.currentPageSize;
    const effectiveStatus = status ?? this.currentStatus;
    const effectiveObjectionNumber = objectionNumber ?? this.currentObjectionNumber;
    const effectiveVoteStatus = voteStatus ?? this.currentVoteStatus;

    // Update the cached values
    this.currentPageIndex = effectivePageIndex;
    this.currentPageSize = effectivePageSize;
    this.currentStatus = effectiveStatus;
    this.currentObjectionNumber = effectiveObjectionNumber;
    this.currentVoteStatus = effectiveVoteStatus;

    var params = status ? "&status=" + effectiveStatus : "";
    params += objectionNumber ? "&objectionNumber=" + effectiveObjectionNumber : "";
    params += voteStatus ? "&voteStatus=" + effectiveVoteStatus: "";
    return this.http
      .get<IObjectionMissionResponse>(
        `${environment.proxyBase}/Objection/missions?PageIndex=` +
          effectivePageIndex +
          `&PageSize=` +
          effectivePageSize +
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
  sendToCoordinator(
    Task: IObjectionProgressRequest
  ): Observable<IResponse<IObjectionMissionResponse>> {
    return this.http
      .post<IResponse<IObjectionMissionResponse>>(
        `${environment.proxyBase}/Objection/send-to-coordinator`,
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

