import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TReportDurration } from '@shared/models/reports.model';
import { LanguageService } from '@shared/services/language/language.service';
import { ReportsService } from '@shared/services/reports/reports.service';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-committe-meeting-template',
  standalone :true,
  imports : [CalendarModule ,DropdownModule ,TranslateModule ,FormsModule ,CardModule ,ButtonModule],
  templateUrl: './committe-meeting-template-component.html',
  styleUrls: ['./committe-meeting-template-component.scss']
})
export class CommitteMeetingTemplateComponent implements OnInit {
  range_dates!: (string | null)[] ;
  template_types = [{}];
  selected_type :string = "";
  objectionNumber: any;
  constructor(private translateService :TranslateService , private reportService:ReportsService) {
   }

  ngOnInit() {
  }

 handelReportExport() {
  this.reportService.downloadCommitteMeetingTemplate(this.objectionNumber).subscribe();
 }
}
