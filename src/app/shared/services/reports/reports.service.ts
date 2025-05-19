import { signal } from '@angular/core';
import { Router } from "@angular/router";
import { Injectable } from '@angular/core';

import { Observable } from "rxjs";
import { catchError, tap } from "rxjs/operators";
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

  getQualityOjectionWithVotesReport(duration: TReportDurration = null, objectionNumber?:string, objectionType?: number | null, billNumber?: string): Observable<any> {
    let params = new HttpParams();
    if (duration && duration.startDate) {
      params = params.set('StartDate', duration.startDate);
    }
    if (duration && duration.endDate) {
      params = params.set('EndDate', duration.endDate);
    }
    if(objectionNumber && objectionNumber.trim()){
      params = params.set('ObjectionNumber',objectionNumber)
    }
    if (objectionType) {
      params = params.set('ObjectionType', objectionType.toString());
    }
    if (billNumber && billNumber.trim()) {
      params = params.set('BillNumber', billNumber);
    }

    const exportQualityObjectionBillReportUrl = `${environment.proxyBase}/Objection/export-quality-objection-data`;
    return this.http
       .get(exportQualityObjectionBillReportUrl , {params : params , responseType : 'blob'})
       .pipe(
         tap((success) => { 
           this.handleExportBillSuccess(success , 'Objection Report V-02') 
          })  
       );
  }

  getOjectionWithVotesReport(duration: TReportDurration = null, objectionNumber?: string): Observable<any> {
    let params = new HttpParams();
    if (duration && duration.startDate) {
      params = params.set('StartDate', duration.startDate);
    }
    if (duration && duration.endDate) {
      params = params.set('EndDate', duration.endDate);
    }
    if (objectionNumber && objectionNumber.trim()) {
      params = params.set('ObjectionNumber', objectionNumber);
    }

    const exportBillReportUrl = `${environment.proxyBase}/Objection/export-objection-data`;
    return this.http
      .get(exportBillReportUrl, { params: params, responseType: 'blob' })
      .pipe(
        tap((success) => {
          this.handleExportBillSuccess(success , 'Objection Report V-02') 
        })
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

  
  downloadNotificationTemplate(billnumber: any , type? : any, openInNewTab? : boolean): Observable<any> {
    let params = new HttpParams();

      params = params.set('billnumber', billnumber);
   
      params = params.set('tempateKey', type);

     const exportBillReportUrl = `${environment.proxyBase}/Pdf`;
 
     return this.http
       .get(exportBillReportUrl , {params : params , responseType : 'blob'})
       .pipe(
         tap((success) => { 
           if(openInNewTab)
            {
              this.handleOpenNotificationTemplateSuccess(success , 'Notification Report ' + ( type ?  '- template ' + type : ''))
           }
           else{
              this.handleDownloadNotificationTemplateSuccess(success , 'Notification Report ' + ( type ?  '- template ' + type : ''))
           } 
          }),
       );
   }

   downloadCommitteMeetingTemplate(objectionnumber: any): Observable<any> {
    let params = new HttpParams();

      params = params.set('objectionNumber', objectionnumber);

     const exportBillReportUrl = `${environment.proxyBase}/Pdf/CommitteeMeetingTemplate`;
 
     return this.http
       .get(exportBillReportUrl , {params : params , responseType : 'blob'})
       .pipe(
         tap((success) => { 
              this.handleDownloadCommitteMeetingTemplateSuccess(success)
          }),
       );
   }

   downloadCourtPleading(objectionnumber: any): Observable<any> {
    let params = new HttpParams();

      params = params.set('objectionNumber', objectionnumber);

     const exportBillReportUrl = `${environment.proxyBase}/Pdf/objection-court-pleading`;
 
     return this.http
       .get(exportBillReportUrl , {params : params , responseType : 'blob'})
       .pipe(
         tap((success) => { 
              this.handleDownloadCourtPleadingDocument(success)
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

  private handleOpenNotificationTemplateSuccess(response: any, exportType: string) {
    const fileName = "نموذج طباعة الإشعارات النصية.pdf"; 
    const blob = new Blob([response], { type: 'application/pdf' });

    // Create a URL for the Blob
    const fileURL = URL.createObjectURL(blob);

    // Open the file in the same window
    window.location.href = fileURL;

    // Display success message
    const details = this.translateService.instant('exported-succeeded');
    this.messageService.add({
      severity: 'success', 
      summary: this.translateService.instant('done'), 
      detail: details
    });
  }

  private handleDownloadCommitteMeetingTemplateSuccess(response: any) {
    const fileName = "مسودة محضر اجتماع لجنة.docx"; // Replace with desired filename
    const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    saveAs(blob, fileName);
    var details = this.translateService.instant('exported-succeeded');
    this.messageService.add({ severity: 'success', summary: this.translateService.instant('done'), detail:  details});

  }

  private handleDownloadCourtPleadingDocument(response:any){
    const fileName = " محضر الترافع القضائي.docx";
    const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    saveAs(blob, fileName);
    var details = this.translateService.instant('exported-succeeded');
    this.messageService.add({ severity: 'success', summary: this.translateService.instant('done'), detail:  details});


  }
  
}
