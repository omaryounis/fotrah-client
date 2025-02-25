import { Injectable, signal } from "@angular/core";
import { environment } from "@root/src/environments/environment";
import { BaseEntityService } from "@shared/base-entity/base-entity.service";
import { IResponse } from "@shared/models/respoonse.model";
import { Observable, tap } from "rxjs";

import {
  IObjectionMission,
  IObjectionMissionResponse,
  IObjectionProgressRequest,
  IOperationRequest,
  IReturnRequest,
} from "@root/src/app/modules/transactions/components/objections/list-objections-tasks/objections.model";
import { IFinancialResponse } from "@root/src/app/modules/financials/financials.model";

@Injectable({
  providedIn: "root",
})
export class ObjectionService extends BaseEntityService<IObjectionMission> {
  rowData = signal<IObjectionMission>({} as IObjectionMission);

  objections = signal<IObjectionMission[]>([] as IObjectionMission[]);
 

  getObjections(
    pageIndex?: string,
    pageSize?: number,
    status?: number,
    objectionNumber?: string,
    voteStatus?: number,
    objectorName?:string,
    finItemId?:number
  ): Observable<IObjectionMissionResponse> {

    const effectivePageIndex = pageIndex ?? '1';
    const effectivePageSize = pageSize ?? '10';
    const effectiveStatus = status ?? undefined;
    const effectiveObjectionNumber = objectionNumber ?? '';
    const effectiveVoteStatus = voteStatus ?? undefined;

    const effectiveObjectorName = objectorName ?? '';
    const effectivefinItemId = finItemId ?? undefined;

    var params = status ? "&status=" + effectiveStatus : "";
    params += objectionNumber ? "&objectionNumber=" + effectiveObjectionNumber : "";
    params += voteStatus ? "&voteStatus=" + effectiveVoteStatus: "";
    params += objectorName ? "&objectorName=" + effectiveObjectorName: "";
    params+= finItemId? "&financialItemId=" + effectivefinItemId:""
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
    Task: IOperationRequest
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

  sendBackToObjector(Task:IReturnRequest): Observable<IResponse<IObjectionMissionResponse>>{
    return this.http
      .post<IResponse<IObjectionMissionResponse>>(
        `${environment.proxyBase}/Objection/return-objection`,
        Task
      )
      .pipe(
        tap((response: IResponse<IObjectionMissionResponse>) => {
          // Assuming setBaseEntity returns BaseEntityType<ITaskConfirm>[].
          // this.upsertBaseEntity(response.data);s
        })
      );
  }
  
}

