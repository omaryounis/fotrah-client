import { Component, ElementRef, inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { BillsType } from '@shared/enums/bills-type.enum';
import { ReportType } from '@shared/enums/report-type.enum';
import { BillService } from '@shared/services/bill/bill.service';
import { LanguageService } from '@shared/services/language/language.service';
import { Chart } from 'chart.js';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { MultiSelectModule } from 'primeng/multiselect';
import pluginDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-quarter-bills',
  standalone : true,
  imports : [CardModule, MultiSelectModule, ChartModule, TranslateModule ,FormsModule],
  templateUrl: './quarter-bills.component.html',
  styleUrls: ['./quarter-bills.component.scss']
})
export class QuarterBillsComponent implements OnInit {
 

  statusCountsArray: { status: string; count: unknown; }[] = [];
  langService = inject(LanguageService)
  public barChartPlugins = [pluginDataLabels];
  // mapBill: any = { paidBillsCount: this.langService.getInstantTranslation('paid'), canceledBillsCount: this.langService.getInstantTranslation('canceled'), unpaidBillsCount: this.langService.getInstantTranslation('unpaid') }
  billReportData: any = {};
  @Input() reportType :string = ReportType.VIOLATIONS;

  billTypes: any[] = []
  public selectedBillTypes: any[] = [];

  chart: Chart | undefined;
  chartData: any = [];
  chartOptions: any = {};
  constructor(private billService: BillService) {
   
  }
  ngOnInit() {
    this.fillChart();
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x:
        {
          id: 'x-axis-1',
          grid: {
            display: false,
            drawBorder: false
          },
          categoryPercentage: 0.2,
          barPercentage : 0.5,
          barThickness: 6,
          title: {
            display: false,
            text: this.langService.getInstantTranslation('bills-count'),
            color: '#874E9F',
            font: {
              size: 15,
              family: "Neo Sans Arabic", // Replace 'serif' with the desired font family
            },
          },
          ticks: {
            color: "#6D6D6D",
            font: {
              size: 11,
              family: "Neo Sans Arabic", // Replace 'serif' with the desired font family
            },
          },
        } ,
        y:
        {
          id: 'y-axis-1',
          display:false,
          grid: {
            display: false,
            drawBorder: false
          },
          title: {
            display: false,
            text: this.langService.getInstantTranslation('bills-count'),
            color: '#874E9F',
            font: {
              size: 20,
              family: "Neo Sans Arabic", // Replace 'serif' with the desired font family
            },
          },
          ticks: {
            callback: (value: number) => value.toString(), // Display only first two characters
            color: "#6D6D6D",
            label: this.langService.getInstantTranslation(this.reportType == ReportType.VIOLATIONS ? BillsType.VIOLATIONS : BillsType.PERMITS),
            position: 'right',
            mirror: true,
            labels: {
              font: {
                size: 14,
                family: "Neo Sans Arabic", // Replace 'serif' with the desired font family
              }
            }

          },

        }

      },
      plugins: {
        legend: {
          position: "none", // Place legend below the chart
          labels: {
            usePointStyle: true,
            pointStyle: "circle",
            pointStyleWidth: 4,
            boxHeight: 3,
            font: {
              size: 14,
              family: "Neo Sans Arabic", // Replace 'serif' with the desired font family
            },
          },

        },
      },
    };
    
  }
  fillChart(reportType? : string) {
    
    if (reportType) {
      this.reportType = reportType!; 
    }
    var quarterDates = this.getQuartersForCurrentYear()
    
    this.billService.getBillsReport(this.reportType ,quarterDates[0].start.toString() , quarterDates[0].end.toString() ).subscribe(res => {
       this.prepareCharts(res, 1)
    })
    this.billService.getBillsReport(this.reportType  ,quarterDates[1].start.toString() , quarterDates[1].end.toString()).subscribe(res => {
       this.prepareCharts(res, 2)
    })
    this.billService.getBillsReport(this.reportType  ,quarterDates[2].start.toString() , quarterDates[2].end.toString()).subscribe(res => {
       this.prepareCharts(res, 3)
    })
    this.billService.getBillsReport(this.reportType , quarterDates[3].start.toString() , quarterDates[3].end.toString()).subscribe(res => {
       this.prepareCharts(res, 4)
    })
  }
  prepareCharts(response :any ,index :number) {
     
    this.billReportData = response.data;
    var billData = Object.entries(this.billReportData).map(([key, value]) => {
      // Exclude entries with key 'totalPaid'
      return { key, value };
    });

    var counts: any[] = billData;
    var countsData = counts.filter((a: any) => /(totalBillsCount|unpaidBillsCount|paidBillsCount)/.test(a.key));

    this.chartData[index] = {
      labels: countsData.map((a: any) => a.value),
      datasets: [
        {
          label: this.langService.getInstantTranslation(this.reportType == ReportType.VIOLATIONS ? BillsType.VIOLATIONS : BillsType.PERMITS),
          data: countsData.map((a: any) => a.value),
          backgroundColor: ["#99744ECC", "#874E9F" ,"#4E9B6E" ],
          borderColor: "rgba(75,192,192,1)",
          borderWidth: 0,
          type: "bar",
          borderRadius: 25,
          barThickness: 15
          
        },
      ],
    };
  }
   getQuartersForCurrentYear(): { start: string; end: string }[] {
    const currentYear = new Date().getFullYear();
  
    const quarters: { start: string; end: string }[] = [];
  
    for (let quarter = 1; quarter <= 4; quarter++) {
      const startOfMonth = new Date(currentYear, (quarter - 1) * 3, 1);
      const endOfMonth = new Date(currentYear, quarter * 3, 0);
  
      quarters.push({
        start: this.formatDate(startOfMonth), 
        end: this.formatDate(endOfMonth)
      });
    }
  
    return quarters;
  }

  formatDate(date: Date): string {
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${year}/${month}/${day}`;
  }
}


