import { signal } from '@angular/core';
import { Router } from "@angular/router";
import { Injectable } from '@angular/core';

import { Observable, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { toObservable } from '@angular/core/rxjs-interop';

import { MessageService } from "primeng/api";

import { environment } from '@root/src/environments/environment';
import { CancelTypes } from '@shared/enums/cancel-types.enum';
import { ReportType } from '@shared/enums/report-type.enum';

@Injectable({
  providedIn: 'root'
})
export class BillService {
  showBill = signal<boolean>(false);
  private billInformation = signal<any>({});
  public billsReport = signal<any>({});
  private billsStatics = signal<any>({});
  private billsPaymentStatics = signal<any>({});
  billInformation$ = toObservable(this.billInformation);

  constructor(private http: HttpClient, private router: Router, private messageService: MessageService) { }

  searchBill(billNumber: string = '0'): Observable<any> {
    this.hideBillInfo();

    const searchBillUrl = `${environment.proxyBase}/Bill/${billNumber || '0'}`;
    return this.http
      .get(searchBillUrl)
      .pipe(
        tap((success) => { this.handleSuccess(success) })
      );
  }
  publicBill(billNumber: string = '0'): Observable<any> {
    this.hideBillInfo();

    const searchBillUrl = `${environment.proxyBase}/Bill/Inquiry/${billNumber || '0'}`;
    return this.http
      .get(searchBillUrl)
      .pipe(
        tap((success) => { })
      );
  }
  getBillsReport(reportType?:string,startDate?: string, endDate?: string ) {
    
    var addtionUrl = reportType ? reportType : ReportType.VIOLATIONS;
    addtionUrl += startDate ? '?startDate=' + startDate + '&endDate=' + endDate : '';
    const bill = `${environment.proxyBase}/Reports/${addtionUrl}`;
    return this.http
      .get(bill)
      .pipe(
        tap((success: any) => { this.billsReport.set(success.data) })
      );
  }
  getBillsStatics(filterType?: string , reportType?: string) {
    const addtionUrl = reportType ? reportType : ReportType.VIOLATIONS;

    const bill = `${environment.proxyBase}/Reports/${addtionUrl}Statistics?ReportType=` + filterType ;
    return this.http
      .get(bill)
      .pipe(
        tap((success: any) => { this.billsStatics.set(success.data) })
      );
  }
  getBillsPaymnetStatics(filterType?: string , reportType?: string) {

    var checkReportType = reportType ? reportType : ReportType.VIOLATIONS;
    const addtionUrl = checkReportType === ReportType.PERMITS ? ReportType.PERMIT : checkReportType;
    const bill = `${environment.proxyBase}/Reports/${addtionUrl}ByPaymentDate?ReportType=` + filterType ;
    return this.http
      .get(bill)
      .pipe(
        tap((success: any) => { this.billsPaymentStatics.set(success.data) })
      );
  }
  cancelBill(fromData: FormData , cancelType : string) {
    const additionUrl = cancelType === CancelTypes.CANCELBILL ? 'BillCancel' : cancelType === CancelTypes.CANCELBILL ? 'CancelRefund' : 'Refund';
    const billUrl = `${environment.proxyBase}/Bill/${additionUrl}`;
    return this.http
      .post(billUrl, fromData)
      .pipe(
        tap((success: any) => {  })
      );
  }

  hideBillInfo() {
    this.showBill.set(false);
  }

  showBillInfo() {
    this.showBill.set(true);
  }

  private handleSuccess(response: any) {
    this.billInformation.set(response.data);
    this.showBillInfo();
  }
}
