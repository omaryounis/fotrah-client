import { IQualityMission,IAttachmentDetail,IVoteDetail,IQualityMissionResponse,IVoteRequest,IQualityProgressRequest, IReturnRequest } from '@root/src/app/modules/transactions/components/quality/models/quality.model';
import { Injectable, signal } from "@angular/core";
import { environment } from "@root/src/environments/environment";
import { BaseEntityService } from "@shared/base-entity/base-entity.service";
import { IResponse } from "@shared/models/respoonse.model";
import { Observable, tap } from "rxjs";
import { IFinancialResponse } from "@root/src/app/modules/financials/financials.model";
import { CancelTypes } from '@shared/enums/cancel-types.enum';
import { IObjectionMissionResponse } from '@root/src/app/modules/transactions/components/objections/list-objections-tasks/objections.model';

@Injectable({
  providedIn: 'root'
})


export class QualityService extends BaseEntityService<IQualityMission> {

  rowData = signal<IQualityMission>({} as IQualityMission);
  qualityMissions = signal<IQualityMission[]>([] as IQualityMission[]);
  qualityObjection = signal<any>(null);

  getQualityMissions(
    pageIndex?: string,
    pageSize?: number,
    status?: number,
    billNumber?: number | null,
    voteStatus?: number | null,
    objectorName?:string,
    finItemId?: number | null
  ): Observable<IQualityMissionResponse> {

    const effectivePageIndex = pageIndex ?? '1';
    const effectivePageSize = pageSize ?? '10';
    const effectiveStatus = status ?? undefined;
    const effectiveBillNumber = billNumber ?? null;
    const effectiveVoteStatus = voteStatus ?? null;
    const effectiveObjectorName = objectorName ?? undefined;
    const effectivefinItemId = finItemId ?? null;

    const requestBody = {
      pageIndex: effectivePageIndex,
      pageSize: parseInt(effectivePageSize.toString()),
      status: effectiveStatus || null,
      billNumber: effectiveBillNumber,
      voteStatus: effectiveVoteStatus,
      objectorName: effectiveObjectorName,
      financialItemId: effectivefinItemId
    };
    return this.http
      .post<IQualityMissionResponse>(
        `${environment.proxyBase}/Quality/missions`,
        requestBody
      )
      .pipe(
        tap((response: IQualityMissionResponse) => {
          this.qualityMissions.set(response.data.qualityMissions);
          this.setTotalCount(response.data.totalCount);
        })
      );
  }


  getUserQualityMissions(
    pageIndex?: string | null,
    pageSize?: number | null,
    status?: number | null,
    billNumber?: number | null,
    voteStatus?: number | null,
    objectorName?:string | null,
    finItemId?: number | null
  ): Observable<IQualityMissionResponse> {

    const effectivePageIndex = pageIndex ?? '1';
    const effectivePageSize = pageSize ?? '10';
    const effectiveStatus = status ?? null;
    const effectiveBillNumber = billNumber ?? null;
    const effectiveVoteStatus = voteStatus ?? null;
    const effectiveObjectorName = objectorName ?? null;
    const effectivefinItemId = finItemId ?? null;

    const requestBody = {
      pageIndex: effectivePageIndex,
      pageSize: parseInt(effectivePageSize.toString()),
      status: effectiveStatus,
      billNumber: effectiveBillNumber,
      voteStatus: effectiveVoteStatus,
      objectorName: effectiveObjectorName || null,
      finItemId: effectivefinItemId
    };

    console.log('Sending request body:', requestBody);

    return this.http
      .post<IQualityMissionResponse>(
        `${environment.proxyBase}/Quality/my-quality-objections`,
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      .pipe(
        tap((response: IQualityMissionResponse) => {
          this.qualityMissions.set(response.data.qualityMissions);
          this.setTotalCount(response.data.totalCount);
        })
      );
  }

  proceedObjection(
    formData: FormData
  ): Observable<IResponse<IQualityMissionResponse>> {
    return this.http
      .post<IResponse<IQualityMissionResponse>>(
        `${environment.proxyBase}/Quality/proceed-to-voters`,
        formData
      )
      .pipe(
        tap((response: IResponse<IQualityMissionResponse>) => {
        })
      );
  }
  vote(
    Task: IQualityProgressRequest
  ): Observable<IResponse<IQualityMissionResponse>> {
    return this.http
      .post<IResponse<IQualityMissionResponse>>(
        `${environment.proxyBase}/Quality/vote`,
        Task
      )
      .pipe(
        tap((response: IResponse<IQualityMissionResponse>) => {
        })
      );
  }


  finalDesicision(
    Task: IQualityProgressRequest
  ): Observable<IResponse<IQualityMissionResponse>> {
    return this.http
      .post<IResponse<IQualityMissionResponse>>(
        `${environment.proxyBase}/Quality/finalize`,
        Task
      )
      .pipe(
        tap((response: IResponse<IQualityMissionResponse>) => {
        })
      );
  }
  
  isCoordinator(): boolean {
    return this.loginService.hasPermission(["Procceed_Quality_CommitteeCoordinator"]);
  }


  cancelBill(fromData: FormData , cancelType : string) {
    // const additionUrl = cancelType === CancelTypes.CANCELBILL ? 'BillCancel' : cancelType === CancelTypes.CANCELBILL ? 'CancelRefund' : 'Refund';
    const billUrl = `${environment.proxyBase}/Quality/quality-objection`;
    return this.http
      .post(billUrl, fromData)
      .pipe(
        tap((success: any) => {  })
      );
  }

  
  sendBackToObjector(Task:IReturnRequest): Observable<IResponse<IObjectionMissionResponse>>{
    return this.http
      .post<IResponse<IObjectionMissionResponse>>(
        `${environment.proxyBase}/Quality/return-objection`,
        Task
      )
      .pipe(
        tap((response: IResponse<IObjectionMissionResponse>) => {
          // Assuming setBaseEntity returns BaseEntityType<ITaskConfirm>[].
          // this.upsertBaseEntity(response.data);s
        })
      );
  }

  getQualityObjectionByBillNumber(billNumber: number): Observable<IResponse<any>> {
    return this.http
    .post<IResponse<any>>(`${environment.proxyBase}/Quality/quality-objection-details`, { billNumber })
    .pipe(
        tap((response: IResponse<any>) => {
          this.qualityObjection.set(response.data);
        })
      );
  }

}
 
