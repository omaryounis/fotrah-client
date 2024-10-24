import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { Subscription } from "rxjs";

import { CardModule } from "primeng/card";
import { ButtonModule } from "primeng/button";

import { DoughnutWithLabelComponent } from "@shared/components/doughnut-with-label/doughnut-with-label.component";

import { ChartService } from "@shared/services/chart/chart.service";
import { ReportsService } from "@shared/services/reports/reports.service";
import { IReportDurration } from "@shared/models/reports.model";
import { CalendarModule } from "primeng/calendar";
import { FormsModule } from "@angular/forms";
import { LanguageService } from "@shared/services/language/language.service";
import { TranslateModule } from "@ngx-translate/core";

@Component({
  selector: "app-violation-count",
  standalone: true,
  imports: [CardModule, ButtonModule, DoughnutWithLabelComponent, CalendarModule, FormsModule, TranslateModule],
  templateUrl: "./violation-count.component.html",
  styleUrl: "./violation-count.component.scss",
})
export class ViolationCountComponent implements OnInit, OnDestroy {
  violationCountData: any;
  paidBillsCount: string = "0";
  unpaidBillsCount: string = "0";
  violationCountDataPermits: any;
  paidBillsCountPermits: string = "0";
  unpaidBillsCountPermits: string = "0";
  reportServiceSubscription!: Subscription;
  reportServiceSubscriptionPermits!: Subscription;
  violationCountSubscription!: Subscription;
  violationCountSubscriptionPermits!: Subscription;
  reportExportSubscription!: Subscription;
  reportDatesObservableSubscription!: Subscription;
  rangeDates!: (string | null)[];
  @Input() title: string = '';
  @Input() reportType: string = '';

  constructor(private chartService: ChartService, private reportsService: ReportsService, public langService: LanguageService) { }

  updateChartData(violationCount: string = "0") {
    return {
      // labels: [this.langService.getInstantTranslation('total-bills')],
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

  handelReportExport() {
    const dates = this.reportsService.reportDates();
    this.reportExportSubscription = this.reportsService.exportBillReport({
      startDate: dates[0] as string,
      endDate: dates[1] as string,
    }, this.reportType).subscribe();

  }
  // handelReportPermitsExport() {
  //   const dates = this.reportsService.reportDates();
  //   this.reportExportSubscription = this.reportsService.exportBillReport({
  //     startDate: dates[0] as string,
  //     endDate: dates[1] as string,
  //   } , 'PermitsBills').subscribe();

  // }

  handleDateSelect(newDate: any) {
    this.reportsService.isBillCountReport.set(true);
    this.reportsService.isUnpaidBillsReport.set(false);

    if (!this.rangeDates?.includes(null)) {
      const startDate = this.rangeDates[0] as string;
      const endDate = this.rangeDates[1] as string;
      this.reportsService.reportDates.set(this.rangeDates);

      this.violationCountSubscription.unsubscribe();
      this.violationCountSubscription = this.reportsService.getBillReport({
        startDate,
        endDate,
      }, this.reportType).subscribe();
    }
  }

  ngOnInit(): void {
    this.getReports(this.reportType);
    this.reportServiceSubscription = this.reportsService.billCountReport$.subscribe((reportData) => {
      this.violationCountData = this.updateChartData(String(reportData?.data?.totalBillsCount));
      this.paidBillsCount = String(reportData?.data?.paidBillsCount);
      this.unpaidBillsCount = String(reportData?.data?.unpaidBillsCount);
    });
    this.violationCountData = this.violationCountDataPermits = {
      // labels: [this.langService.getInstantTranslation('total-bills')],
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



  }
  getReports(reportType?: string) {
    this.reportsService.isBillCountReport.set(true);
    this.reportsService.isUnpaidBillsReport.set(false);
    if (reportType) this.reportType = reportType!;
    this.violationCountSubscription = this.reportsService.getBillReport(null, this.reportType).subscribe();
  }
  ngOnDestroy(): void {
    if (this.violationCountSubscription) this.violationCountSubscription.unsubscribe();
    if (this.violationCountSubscriptionPermits) this.violationCountSubscriptionPermits.unsubscribe();
    if (this.reportServiceSubscription) this.reportServiceSubscription.unsubscribe();
    if (this.reportServiceSubscriptionPermits) this.reportServiceSubscriptionPermits.unsubscribe();
  }
}
