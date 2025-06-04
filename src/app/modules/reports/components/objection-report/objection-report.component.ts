import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MessagesResponse } from "@shared/enums/messages-response.enum";
import { TReportDurration } from '@shared/models/reports.model';
import { ReportsService } from '@shared/services/reports/reports.service';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { MessageService } from "primeng/api";
import { LanguageService } from "@shared/services/language/language.service";

@Component({
  selector: 'app-objection-report',
  standalone :true,
  imports : [CommonModule , ButtonModule , CalendarModule , FormsModule ,TranslateModule ,CardModule],
  templateUrl: './objection-report.component.html',
  styleUrls: ['./objection-report.component.scss']
})
export class ObjectionReportComponent implements OnInit {

  range_dates!: (string | null)[] ;
  range_dates2!: (string | null)[] ;
  objectionNumber: (string | undefined) = '';
  objectionType: number | null = null;
  billNumber: string = '';

   constructor(private translateService :TranslateService , private reportService:ReportsService, private message:MessageService, private langService:LanguageService) {
   }

  ngOnInit() {
  }

 handelReportExport() {
  var dates = this.range_dates ?  { startDate : this.range_dates[0] , endDate : this.range_dates[1]} as TReportDurration : {} as TReportDurration
  this.reportService.getOjectionReport(dates ).subscribe();
 }
 handelReportWithVotesExport() {
  var dates = this.range_dates2 ?  { startDate : this.range_dates2[0] , endDate : this.range_dates2[1]} as TReportDurration : {} as TReportDurration
  
  if (this.objectionType === 1) {
    // Handle complaint objection report
    this.reportService.getOjectionWithVotesReport(dates, this.objectionNumber).subscribe({
      next: (res) => {
      },
      error: (error) => {
        this.message.add({
          severity: "error",
          summary: this.langService.getInstantTranslation("error"),
          detail: error.message || 'Objection Request is not exist !',
        });
      }
    });
  } else if (this.objectionType === 2) {
    // Handle quality objection report
    this.reportService.getQualityOjectionWithVotesReport(dates, this.objectionNumber, this.billNumber).subscribe({
      next: (res) => {
      },
      error: (error) => {
        this.message.add({
          severity: "error",
          summary: this.langService.getInstantTranslation("error"),
          detail: error.message || 'Objection Request is not exist !',
        });
      }
    });
  }
 }
}
