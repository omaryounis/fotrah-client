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
import { CanComponent } from "../../../../shared/components/can/can.component";

@Component({
  selector: 'app-court-pleading-template',
  standalone: true,
  imports: [CalendarModule, DropdownModule, TranslateModule, FormsModule, CardModule, ButtonModule, CanComponent],
  templateUrl: './court-pleading-template.component.html',
  styleUrl: './court-pleading-template.component.scss'
})
export class CourtPleadingTemplateComponent implements OnInit {
  objectionNumber: any;

  constructor(private translateService :TranslateService , private reportService:ReportsService) {
    
  }
  ngOnInit(): void {
  }

  handleExportReport(){
    this.reportService.downloadCourtPleading(this.objectionNumber).subscribe();

  }
}

