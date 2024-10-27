import { Component, ElementRef, Input, OnInit, ViewChild, inject } from '@angular/core';
import { BillService } from '@shared/services/bill/bill.service';
import { Chart } from 'chart.js';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { MultiSelectModule } from 'primeng/multiselect';
import pluginDataLabels from 'chartjs-plugin-datalabels';
import { LanguageService } from '@shared/services/language/language.service';
import { TranslateModule } from '@ngx-translate/core';
import { FilterBillTypes } from '@shared/enums/filter-bill-types.enum';
import { ReportType } from '@shared/enums/report-type.enum';
import { BillsType } from '@shared/enums/bills-type.enum';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-general-bill-chart',
  standalone: true,
  imports: [CardModule, MultiSelectModule, ChartModule, TranslateModule ,FormsModule],
  templateUrl: './general-bill-chart.component.html',
  styleUrl: './general-bill-chart.component.scss'
})
export class GeneralBillChartComponent implements OnInit {
  statusCountsArray: { status: string; count: unknown; }[] = [];
  langService = inject(LanguageService)
  public barChartPlugins = [pluginDataLabels];
  mapBill: any = { paidBillsCount: this.langService.getInstantTranslation('paid'), canceledBillsCount: this.langService.getInstantTranslation('canceled'), unpaidBillsCount: this.langService.getInstantTranslation('unpaid') }
  billReportData: any = {};
  reportType :string = ReportType.VIOLATIONS;

  billTypes: any[] = []
  public selectedBillTypes: any[] = [];
  @ViewChild('chart') chartViewChild: ElementRef | undefined;

  chart: Chart | undefined;
  chartData: any = {};
  chartOptions: any = {};
  constructor(private billService: BillService) {
    this.billTypes = this.prepareBillTypes()
  }
  ngOnInit() {
    this.fillChart([]);
  }
  fillChart(selectedBillTypes: any[] , reportType? : string) {
    
    if (reportType) {
      this.reportType = reportType!; 
    }
    this.mapBill = { paidBillsCount: this.langService.getInstantTranslation('paid'), canceledBillsCount: this.langService.getInstantTranslation(this.reportType == 'PermitsBills' ? 'PermitCanceled' :'canceled'), unpaidBillsCount: this.langService.getInstantTranslation('unpaid') }

    this.billService.getBillsReport(this.reportType).subscribe(res => {
      this.billReportData = res.data;
      var billData = Object.entries(this.billReportData).map(([key, value]) => {
        // Exclude entries with key 'totalPaid'
        return { key, value };
      });

      var counts: any[] = billData;
      var amounts: any[] = billData;
      if (selectedBillTypes.length != 0) {
        const tempCount = billData.filter(item => {
          return selectedBillTypes.some(data => data.value === item!.key);
        });
        const tempAmount = billData.filter(item => {
          var result = item!.key.replace('Amount', '').replace('total', '').toLowerCase();
          return selectedBillTypes.some(data => data.value.replace('Count', '').toLowerCase() == result);
        });
        counts = tempCount;
        amounts = tempAmount;
      }
      var countsData = counts.filter((a: any) => /(canceledBillsCount|unpaidBillsCount|paidBillsCount)/.test(a.key));
      var amountsData = amounts.filter((a: any) => /(totalUnpaidBillsAmount|totalPaidBillsAmount|totalCanceledBillsAmount)/.test(a.key));

      this.chartData = {
        labels: countsData.map((a: any) => this.mapBill[a.key]),
        datasets: [
          {
            data: countsData.map((a: any) => a.value),
            label: this.langService.getInstantTranslation(this.reportType == ReportType.VIOLATIONS ? BillsType.VIOLATIONS : BillsType.PERMITS),
            backgroundColor: this.prepareColors(countsData , selectedBillTypes),
            borderColor: "rgba(75,192,192,1)",
            borderWidth: 0,
            type: "bar",
            barThickness: window.innerWidth <= 768 ? 70 : 105,

          },

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
                size: window.innerWidth <= 768 ? 10 : 14,
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
              display: true,
              text: this.langService.getInstantTranslation('bills-count'),
              color: '#874E9F',
              font: {
                size: window.innerWidth <= 768 ? 16 : 20,
                family: "Neo Sans Arabic", // Replace 'serif' with the desired font family
              },
            },
            ticks: {
              callback: (value: number) => value.toString(), // Display only first two characters
              color: "#6D6D6D",
              label: this.langService.getInstantTranslation(this.reportType == ReportType.VIOLATIONS ? BillsType.VIOLATIONS : BillsType.PERMITS),
              mirror: true,
              // padding: -20,
              z : 100,
              labels: {
                position: 'right',
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
            // color: selectedBillTypes.length == 0 || selectedBillTypes.filter(a => a.value === "paidBillsCount").length > 0 ? ['#fff' , '#874e9f' , '#874e9f'] : ['#874e9f'],
            color: ['#874e9f'],
            font: {
              weight: 'bold',
              size: window.innerWidth <= 768 ? '10px' : '16px',
              family: 'Neo Sans Arabic',
            },

            textAlign: 'center',
            offset: 0,

            formatter: (value: any, context: any) => {
              var index = context.dataIndex;
              // Check if amountsData and index are valid
              if (amountsData && amountsData.length > 0 && index >= 0 && index < amountsData.length) {
                // Return the custom value for the current bar
                const getTrnaslate = this.langService.getInstantTranslation('sar-2');
                var currency = parseInt(amountsData[index].value) == 0 ? '' : '\n' + getTrnaslate;
                return amountsData[index].value.toLocaleString('ar').replace('.00', '') + currency;
              } else {
                // Return a default value or handle the error condition appropriately
                return 'N/A';
              }

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
              anchor: 'top', // Anchor the labels to the end of the bars
              align: 'top',
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
  prepareColors(countsData: any[] , selectedBillTypes : any[]) : any[] {
    var colors = [];
    if(selectedBillTypes.length === 0 || selectedBillTypes.filter(a => a.value === "paidBillsCount").length > 0) {
      colors =["#4E9B6E" , "#eee" ,"#eee"];
    }else {
      colors = ["#eee"];
    }
    return colors;
  }
 

  prepareBillTypes = (): any[] =>
    [{ name: this.langService.getInstantTranslation('canceled'), value: FilterBillTypes.canceled },
    { name: this.langService.getInstantTranslation('paid'), value: FilterBillTypes.paid },
    { name: this.langService.getInstantTranslation('unpaid'), value: FilterBillTypes.unpaid }];
}
