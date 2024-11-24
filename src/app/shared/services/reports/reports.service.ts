import { signal } from '@angular/core';
import { Router } from "@angular/router";
import { Injectable } from '@angular/core';

import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { HttpClient, HttpParams } from "@angular/common/http";
import { toObservable } from '@angular/core/rxjs-interop';

import { saveAs } from "file-saver";

import { MessageService } from "primeng/api";

import { environment } from '@root/src/environments/environment';
import { TReportDurration, IBillReportResponse } from '@shared/models/reports.model';
import { TranslateService } from '@ngx-translate/core';
import { ReportType } from '@shared/enums/report-type.enum';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  billCountReport = signal<IBillReportResponse>({} as IBillReportResponse);
  billCountReportPermits = signal<IBillReportResponse>({} as IBillReportResponse);
  billCountReport$ = toObservable(this.billCountReport);
  billCountReportPermits$ = toObservable(this.billCountReportPermits);
  unpaidBillsReport = signal<IBillReportResponse>({} as IBillReportResponse);
  unpaidBillsReport$ = toObservable(this.unpaidBillsReport);

  reportDates = signal<(string | null)[]>([]);
  reportDates$ = toObservable(this.reportDates);

  isBillCountReport = signal<(boolean | null)>(true);
  isUnpaidBillsReport = signal<(boolean | null)>(true);
  // reportType$ = toObservable(this.reportType);

  constructor(private http: HttpClient, private messageService: MessageService , private translateService : TranslateService) { }

  getBillReport(duration: TReportDurration = null , reportType? : string): Observable<any> {
    
    let search = reportType ? reportType : ReportType.VIOLATIONS;
    if (duration) {
      search += `?StartDate=${duration.startDate}&EndDate=${duration.endDate}`
    }
    const getBillReportUrl = `${environment.proxyBase}/Reports/${search}`;

    return this.http
      .get(getBillReportUrl)
      .pipe(
        tap((success) => { this.handleGetBillReportSuccess(success ) })
      );
  }
  getBillReportPermits(duration: TReportDurration = null): Observable<any> {
    let search = 'PermitsBills';
    if (duration) {
      search += `?StartDate=${duration.startDate}&EndDate=${duration.endDate}`
    }
    const getBillReportUrl = `${environment.proxyBase}/Reports/${search}`;
    return this.http
      .get(getBillReportUrl)
      .pipe(
        tap((success) => { this.handleGetBillReportSuccess(success ) })
      );
  }

  exportBillReport(duration: TReportDurration = null , exportType : string): Observable<any> {
    let search = exportType == 'Bills' ? 'ExportBills' : 'ExportPermitBills';

    if (duration) {
      search += `?StartDate=${duration.startDate}&EndDate=${duration.endDate}`
    }

    const exportBillReportUrl = `${environment.proxyBase}/Reports/${search}`;

    return this.http
      .get(exportBillReportUrl, { responseType: 'blob' })
      .pipe(
        tap((success) => { this.handleExportBillSuccess(success , exportType) }),
      );
  }


  private handleGetBillReportSuccess(response: any) {
    
    if (this.reportDates().length == 0) {
      this.unpaidBillsReport.set(response);
      this.billCountReport.set(response);
    } else if (this.isBillCountReport()) {
      this.billCountReport.set(response);
    } else if (this.isUnpaidBillsReport()){
      this.unpaidBillsReport.set(response);
    }
  }

  private handleExportBillSuccess(response: any , exportType : string) {
    const fileName = exportType + '.xlsx'; // Replace with desired filename
    const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, fileName);
    var details = this.translateService.instant('exported-succeeded');
    this.messageService.add({ severity: 'success', summary: this.translateService.instant('done'), detail:  details});

  }

  getNotificationReport(duration: TReportDurration = null , type? : string): Observable<any> {
    
   // Build query parameters
   let params = new HttpParams();
   if (type && type != '') {
     params = params.set('Template', type);
   }
   if (duration!.startDate) {
     params = params.set('StartDate', duration!.startDate);
   }
   if (duration!.endDate) {
     params = params.set('EndDate', duration!.endDate);
   }

    const exportBillReportUrl = `${environment.proxyBase}/Reports/ExportNotificationReport`;

    return this.http
      .get(exportBillReportUrl , {params : params , responseType : 'blob'})
      .pipe(
        tap((success) => { 
          
          this.handleExportBillSuccess(success , 'Notification Report ' + ( type ?  '- template ' + type : '')) 
         }),
      );
     
     
  }
  getOjectionReport(duration: TReportDurration = null ): Observable<any> {
    
   // Build query parameters
   let params = new HttpParams();
   if (duration!.startDate) {
     params = params.set('StartDate', duration!.startDate);
   }
   if (duration!.endDate) {
     params = params.set('EndDate', duration!.endDate);
   }

    const exportBillReportUrl = `${environment.proxyBase}/Objection/Export`;

    return this.http
      .get(exportBillReportUrl , {params : params , responseType : 'blob'})
      .pipe(
        tap((success) => { 
          
          this.handleExportBillSuccess(success , 'Objection Report ') 
         }),
      );
     
     
  }
  // getNotificationReport(duration: TReportDurration = null , template : string): Observable<any> {
  //   let search = '';

  //   if (duration && duration.startDate) {
  //     search += `StartDate=${duration.startDate}&EndDate=${duration.endDate}`
  //   }
  //   if (template && template != '') {
  //   search += `Template=${template}`
  //   }
  //   const exportBillReportUrl = `${environment.proxyBase}/Reports/ExportNotificationReport?${search}`;

  //   return this.http
  //     .get(exportBillReportUrl, { responseType: 'blob' })
  //     .pipe(
  //       tap((success) => { this.handleExportBillSuccess(success , template) }),
  //     );
  // }

  
  downloadNotificationTemplate(billnumber: any , type? : any): Observable<any> {
    let params = new HttpParams();

      params = params.set('billnumber', billnumber);
   
      params = params.set('tempateKey', type);

     const exportBillReportUrl = `${environment.proxyBase}/Pdf`;
 
     return this.http
       .get(exportBillReportUrl , {params : params , responseType : 'blob'})
       .pipe(
         tap((success) => { 
           
           this.handleDownloadNotificationTemplateSuccess(success , 'Notification Report ' + ( type ?  '- template ' + type : '')) 
          }),
       );
      
      
   }

   private handleDownloadNotificationTemplateSuccess(response: any , exportType : string) {
    const fileName = "نموذج طباعة الإشعارات النصية.pdf"; // Replace with desired filename
    const blob = new Blob([response], { type: 'application/pdf' });
    saveAs(blob, fileName);
    var details = this.translateService.instant('exported-succeeded');
    this.messageService.add({ severity: 'success', summary: this.translateService.instant('done'), detail:  details});

  }
}
