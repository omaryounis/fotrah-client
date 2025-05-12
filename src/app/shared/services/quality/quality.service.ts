 import { IQualityMission,IAttachmentDetail,IVoteDetail,IQualityMissionResponse,IVoteRequest,IQualityProgressRequest } from '@root/src/app/modules/transactions/components/quality/models/quality.model';
import { Injectable, signal } from "@angular/core";
import { environment } from "@root/src/environments/environment";
import { BaseEntityService } from "@shared/base-entity/base-entity.service";
import { IResponse } from "@shared/models/respoonse.model";
import { Observable, tap } from "rxjs";
import { IFinancialResponse } from "@root/src/app/modules/financials/financials.model";
import { CancelTypes } from '@shared/enums/cancel-types.enum';

@Injectable({
  providedIn: 'root'
})


export class QualityService extends BaseEntityService<IQualityMission> {

  rowData = signal<IQualityMission>({} as IQualityMission);
  qualityMissions = signal<IQualityMission[]>([] as IQualityMission[]);

  getQualityMissions(
    pageIndex?: string,
    pageSize?: number,
    status?: number,
    objectionNumber?: string,
    voteStatus?: number,
    objectorName?:string,
    finItemId?:number
  ): Observable<IQualityMissionResponse> {

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
      .get<IQualityMissionResponse>(
        `${environment.proxyBase}/Quality/missions?PageIndex=` +
          effectivePageIndex +
          `&PageSize=` +
          effectivePageSize +
          params
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

}
 
