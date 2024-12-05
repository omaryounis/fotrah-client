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
  selector: 'app-notification-template',
  standalone :true,
  imports : [CalendarModule ,DropdownModule ,TranslateModule ,FormsModule ,CardModule ,ButtonModule],
  templateUrl: './notification-template.component.html',
  styleUrls: ['./notification-template.component.scss']
})
export class NotificationTemplateComponent implements OnInit {
  billNumber: any;
  template_types = [{}];
  selected_type :string = "";
  constructor(private translateService :TranslateService , private reportService:ReportsService) {
     this.getTemplates();
   }

  ngOnInit() {
  }
 getTemplates() {
    // Define the templates array with specific keys
    const templateList = [
      { id: 1, name: 'template-1' },
      { id: 1, name: 'template-2' },
      { id: 3, name: 'template-3' },
      { id: 4, name: 'template-4' },
      { id: 5, name: 'template-5' },
      { id: 6, name: 'template-6' },
      { id: 7, name: 'template-7' }
    ];

    // Translate template names
    this.translateService.get(templateList.map(t => t.name)).subscribe(translations => {
      this.template_types = templateList.map(template => ({
        id: template.id,
        name: translations[template.name]
      }));
    });
 }
 handelReportExport() {
  this.reportService.downloadNotificationTemplate(this.billNumber , this.selected_type, false).subscribe();
 }
}
