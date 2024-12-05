import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ReportsService } from '@shared/services/reports/reports.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-template-download',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './template-download.component.html',
  styleUrl: './template-download.component.scss'
})
export class TemplateDownloadComponent implements OnInit {

  selected_type :string = "";
  billNumber: string = "";

  constructor(private reportService: ReportsService, private router :ActivatedRoute) {
    router.queryParams.subscribe(res => {
       
      this.billNumber = res['billnumber']!;
      this.selected_type = res['type']!;
      
    })
   }

  ngOnInit() {
    this.handelReportExport();
  }


  handelReportExport() {
    this.reportService.downloadNotificationTemplate(this.billNumber , this.selected_type, true).subscribe();
   }
}

