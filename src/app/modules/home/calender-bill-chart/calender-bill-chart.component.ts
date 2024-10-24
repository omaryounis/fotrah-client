import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BillService } from '@shared/services/bill/bill.service';
import { Chart } from 'chart.js';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { MultiSelectModule } from 'primeng/multiselect';
import pluginDataLabels from 'chartjs-plugin-datalabels';
import { LanguageService } from '@shared/services/language/language.service';
import { TranslateModule } from '@ngx-translate/core';
import { DropdownModule } from 'primeng/dropdown';
import { FilterCalender } from '@shared/enums/filter-calender.enum';
import { ReportType } from '@shared/enums/report-type.enum';
import { FormsModule } from '@angular/forms';
import { BillsType } from '@shared/enums/bills-type.enum';


@Component({
  selector: 'app-calender-bill-chart',
  standalone: true,
  imports: [CardModule, DropdownModule, ChartModule ,TranslateModule ,FormsModule],
  templateUrl: './calender-bill-chart.component.html',
  styleUrl: './calender-bill-chart.component.scss'
})
export class CalenderBillChartComponent implements OnInit {
  rangesDates: string = "";
  prepareFilterList(): any[] {
   return [{ name: this.langService.getInstantTranslation('weekly'), value: FilterCalender.WEEKLY }, 
    { name: this.langService.getInstantTranslation('monthly'), value: FilterCalender.MONTHLY },
     { name: this.langService.getInstantTranslation('yearly'), value: FilterCalender.YEARLY }];
  }
  statusCountsArray: { status: string; count: unknown; }[] = [];
  public barChartPlugins = [pluginDataLabels];
  total = 0;
  // mapBill: any = { paidBillsCount: 'محصلة', canceledBillsCount: 'ملغاة', unpaidBillsCount: 'غير محصلة' }
  billsStatics: any = {};
  BillsFilter: any[] = this.prepareFilterList();
  selectedBillFilter: any[] = [];
  @ViewChild('chart') chartViewChild: ElementRef | undefined;
  reportType :string = ReportType.VIOLATIONS;

  chart: Chart | undefined;
  chartData: any = {};
  chartOptions: any = {};
  constructor(private billService: BillService, private langService: LanguageService) {

  }
  ngOnInit() {
    this.fillChart(FilterCalender.WEEKLY );
  }
  fillChart(filterType: string , reportType? :string) {
    if (reportType) {
      this.reportType = reportType!; 
    }
    this.billService.getBillsStatics(filterType , reportType).subscribe(res => {
      this.billsStatics = res.data.details.sort((a:any, b:any) => a.id - b.id);;
      this.rangesDates = res.data.dateFromTo;
      const totalList = this.billsStatics.map((a: any) => a.totalBillsCount);
      this.total = this.billsStatics.map((a: any) => a.totalBillsAmount).reduce((sum :any, value:any) => sum + value, 0).toLocaleString('ar').replace('.00', '');
      const verianceMin = this.calculateVarianceArray(totalList);
      this.chartData = {
        labels: this.prepareLabels(this.billsStatics , filterType),
        datasets: [
          {
            label: this.langService.getInstantTranslation(this.reportType == ReportType.VIOLATIONS ? BillsType.VIOLATIONS : BillsType.PERMITS),
            data: totalList,
            backgroundColor: ["#4E9B6E" ],
            borderColor: "rgba(75,192,192,1)",
            borderWidth: 0,
            type: "bar",
            barThickness: this.checkWidth(this.billsStatics),
          },
          // {
          //   label: this.langService.getInstantTranslation('violations'),
          //   data: verianceMin,
          //   backgroundColor: "#45f",
          //   borderColor: "#ef4444",
          //   borderWidth: 1,
          //   fill: false,
          //   type: "line",
            
          //   tension: 0.4

          // },
          // {
          //   label: this.langService.getInstantTranslation('violations'),
          //   data: totalList,
          //   backgroundColor: "#eee",
          //   fill: true,
          //   borderColor: "#999",
          //   borderWidth: 2,
          //   type: "line",
          //   tension: 0.4

          // },

        ],
      };

      this.chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x:
          {
            id: 'x-axis-1',
            categoryPercentage: 0.5,
            ticks: {
              color: "#6D6D6D",
              font: {
                size: 14,
                family: "Neo Sans Arabic", // Replace 'serif' with the desired font family
              },
            },
          }
          ,
          y:
          {
            id: 'y-axis-1',
            position: this.langService.browserLang == 'ar' ?  'right' : 'left',
            title: {
              display: false,
              // text: 'عـــــــدد الـــــــفــــــواتــــــيــــــــــــــر',
              color: '#874E9F',
              font: {
                size: 20,
                family: "Neo Sans Arabic", // Replace 'serif' with the desired font family
              },
            },
            ticks: {
              callback: (value: number) => value.toString(), // Display only first two characters
              color: "#6D6D6D",
              label: 'عدد المخالفات',
              position: 'right',
              anchor : 'end',
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
          datalabels: {
            anchor: 'top', // Anchor the labels to the end of the bars
            align: 'top',
            color: '#fff',
            font: {
              weight: 'bold',
              size: '16px',
              family: 'Neo Sans Arabic',
            },

            textAlign: 'center',
            offset: 0,

            formatter: (value: any, context: any) => {
              var index = context.dataIndex;
              return '';

            },

          },
          labels: {
            title: null,
            font: {
              weight: 'bold',
              size: '16px',
              family: 'Neo Sans Arabic',
            }
          },
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

    })
  }
  prepareLabels(billsStatics: any[], filterType: string) : any[] {
    const preTranslate = filterType === "3" ? "years." : "";
   return billsStatics.map((a: any) => {
      var dateLabel = filterType != "3" ? (filterType == "2" ? a.key.slice(5 ,11) : a.key.slice(5 ,11) ) : "";
     return this.langService.getInstantTranslation(preTranslate + a.name.toLowerCase()) + '\n' + dateLabel;
    }
   )
    
  }

  calculateVarianceArray(arr: number[]): number[] {
    if (arr.length === 0) return [];

    // Step 1: Calculate the mean
    const mean = arr.reduce((sum, value) => sum + value, 0) / arr.length;

    // Step 2: Calculate the squared differences from the mean
    const varianceArray = arr.map(value => Math.pow(value - mean, 2));

    return varianceArray;
  }

   checkWidth = (billsStatics : any[]) : number => window.innerWidth <= 768 ? 30 : window.innerWidth >= 768 && window.innerWidth <= 850 ? 40 : billsStatics.length < 9 ? 70 : billsStatics.length > 9 ? 30 : 55;



}
