import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DoughnutWithLabelComponent } from '@shared/components/doughnut-with-label/doughnut-with-label.component';
import { ChartService } from '@shared/services/chart/chart.service';
import { ReportsService } from '@shared/services/reports/reports.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { Subscription } from 'rxjs';
import { ISelectValue } from '../../../roles-management/role.model';
import { LanguageService } from '@shared/services/language/language.service';

@Component({
  selector: 'app-unpaid-bills-count',
  standalone: true,
  imports: [
    CardModule, ButtonModule, DoughnutWithLabelComponent, DropdownModule, FormsModule, TranslateModule
  ],
  templateUrl: './unpaid-bills-count.component.html',
  styleUrl: './unpaid-bills-count.component.scss',
})
export class UnpaidBillsCountComponent {
  violationCountData: any;
  paidBillsCount: string = "0";
  unpaidBillsAmount: string = "0";
  reportServiceSubscription!: Subscription;
  unPaidBills!: Subscription;
  reportExportSubscription!: Subscription;
  reportDatesObservableSubscription!: Subscription;
  @Input() reportType: string = '';

  dates: any[] = [
    "<31",
    "31-60",
    "61-90",
    "91-120",
    "121-150",
    "151-180",
    ">150"
  ];

  rangeDates: any[] = []
  selectedDate: any = {};
  constructor(private chartService: ChartService, private reportsService: ReportsService, private langservice : LanguageService) {
    this.rangeDates = this.dates.map((a: string) =>  ({ value: a, name: this.langservice.getInstantTranslation(a) }));
  }

  updateChartData(violationCount: string = "0") {
    return {
      labels: ["عدد الفواتير", "عدد الفواتير"],
      datasets: [
        {
          data: [violationCount], // Total count of violations
          backgroundColor: this.chartService.createGradientColor([
            { offset: 0.0562, value: "rgba(79, 155, 111, 1)" },
            { offset: 0.8508, value: "rgba(79, 155, 111, 0)" },
          ]),
          hoverBackgroundColor: this.chartService.createGradientColor([
            { offset: 0.0562, value: "rgba(79, 155, 111, 1)" },
            { offset: 0.8508, value: "rgba(79, 155, 111, 0)" },
          ]),
        },
      ],
    }
  }


  ngOnInit(): void {
    this.getBills()
    this.violationCountData = {
      labels: ["عدد الفواتير", "عدد الفواتير"],
      datasets: [
        {
          data: ["123"], // Total count of violations
          backgroundColor: this.chartService.createGradientColor([
            { offset: 0.0562, value: "rgba(79, 155, 111, 1)" },
            { offset: 0.8508, value: "rgba(79, 155, 111, 0)" },
          ]),
          hoverBackgroundColor: this.chartService.createGradientColor([
            { offset: 0.0562, value: "rgba(79, 155, 111, 1)" },
            { offset: 0.8508, value: "rgba(79, 155, 111, 0)" },
          ]),
        },
      ],
    };

    this.reportServiceSubscription = this.reportsService.unpaidBillsReport$.subscribe((reportData) => {
      this.violationCountData = this.updateChartData(String(reportData?.data?.unpaidBillsCount));
      this.paidBillsCount = String(reportData?.data?.paidBillsCount);
      this.unpaidBillsAmount = reportData?.data?.totalUnpaidBillsAmount.toLocaleString("ar").replace('.00', '');
    });
  }
  getBills(reportType? : string) {
    if (reportType) this.reportType = reportType!;
    this.reportsService.isUnpaidBillsReport.set(true);
    this.reportsService.isBillCountReport.set(false);
    this.unPaidBills = this.reportsService.getBillReport(null, this.reportType).subscribe();
  }

  ngOnDestroy(): void {
    this.unPaidBills.unsubscribe();
    this.reportServiceSubscription.unsubscribe();
    // this.reportExportSubscription.unsubscribe();
  }
  handleDateSelect() {
    const rangeDates = this.generateDates();
    if (rangeDates) {
      const startDate = rangeDates[0] as string;
      const endDate = rangeDates[1] as string;
      this.reportsService.isUnpaidBillsReport.set(true);
    this.reportsService.isBillCountReport.set(false);
      this.reportsService.reportDates.set(rangeDates);
      this.unPaidBills.unsubscribe();
      this.unPaidBills = this.reportsService.getBillReport({
        startDate,
        endDate,
      }, this.reportType).subscribe();
    }
  }
  generateDates(): (string | null)[] {
    const today = new Date();
    let startDate = new Date();
    let endDate = new Date();
    if (this.selectedDate.value.includes('-')) {
      let start = this.selectedDate.value.split("-")[0];
      let end = this.selectedDate.value.split("-")[1];
      startDate.setDate(today.getDate() - parseInt(start));
      endDate.setDate(today.getDate() - parseInt(end));
      return [this.formatDate(endDate), this.formatDate(startDate)];
    } else if (this.selectedDate.value.includes('<')) {
      startDate.setDate(today.getDate());
      endDate.setDate(today.getDate() - 30);
      return [this.formatDate(endDate), this.formatDate(startDate)];
    } else {
      startDate.setDate(today.getDate() - 180);
      endDate.setDate(today.getDate() - 360);
      return [this.formatDate(endDate), this.formatDate(startDate)];
    }
  }
  formatDate(date: Date): string {
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${year}/${month}/${day}`;
  }


}
