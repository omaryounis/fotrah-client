import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TReportDurration } from '@shared/models/reports.model';
import { ReportsService } from '@shared/services/reports/reports.service';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-objection-report',
  standalone :true,
  imports : [CommonModule , ButtonModule , CalendarModule , FormsModule ,TranslateModule ,CardModule],
  templateUrl: './objection-report.component.html',
  styleUrls: ['./objection-report.component.scss']
})
export class ObjectionReportComponent implements OnInit {

  range_dates!: (string | null)[] ;
   constructor(private translateService :TranslateService , private reportService:ReportsService) {
   }

  ngOnInit() {
  }

 handelReportExport() {
  var dates = this.range_dates ?  { startDate : this.range_dates[0] , endDate : this.range_dates[1]} as TReportDurration : {} as TReportDurration
  this.reportService.getOjectionReport(dates ).subscribe();
 }
 handelReportWithVotesExport() {
  var dates = this.range_dates ?  { startDate : this.range_dates[0] , endDate : this.range_dates[1]} as TReportDurration : {} as TReportDurration
  this.reportService.getOjectionWithVotesReport(dates ).subscribe();
 }
}
