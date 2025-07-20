import { Component, Input, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";

import { Subscription } from "rxjs";

import { CardModule } from "primeng/card";
import { ChartModule } from "primeng/chart";
import { CalendarModule } from 'primeng/calendar';
import { BreadcrumbComponent } from "@shared/components/breadcrumb/breadcrumb.component";

import { ViolationCountComponent } from "./components/violation-count/violation-count.component";
import { CommitmentRatioComponent } from "./components/commitment-ratio/commitment-ratio.component";

import { ReportsService } from "@shared/services/reports/reports.service";
import { UnpaidBillsCountComponent } from "./components/unpaid-bills-count/unpaid-bills-count.component";
import { TranslateModule } from "@ngx-translate/core";
import { ReportType } from "@shared/enums/report-type.enum";
import { LanguageService } from "@shared/services/language/language.service";
import { DropdownModule } from "primeng/dropdown";
import { UpperCasePipe } from "@angular/common";
import { QuarterBillsComponent } from "./components/quarter-bills/quarter-bills.component";
import { CalenderPaymentBillChartComponent } from "./components/calender-payment-bill-chart/calender-payment-bill-chart.component";
import { FilterCalender } from "@shared/enums/filter-calender.enum";
import { NotificationReportComponent } from "./components/notification-report/notification-report.component";
import { ObjectionReportComponent } from "./components/objection-report/objection-report.component";
import { CanComponent } from "../../shared/components/can/can.component";
import { NotificationTemplateComponent } from "./components/notification-template/notification-template.component";
import { CommitteMeetingTemplateComponent } from "./components/committe-meeting-template/committe-meeting-template-component";
import { CanListComponent } from "../../shared/components/can-list/can.component";
import { CourtPleadingTemplateComponent } from "./components/court-pleading-template/court-pleading-template.component";
import { LoginService } from "@shared/services/login/login.service";
@Component({
  selector: "app-reports",
  standalone: true,
  imports: [
    CardModule,
    FormsModule,
    ChartModule,
    CalendarModule,
    ReactiveFormsModule,
    BreadcrumbComponent,
    ViolationCountComponent,
    CommitmentRatioComponent,
    UnpaidBillsCountComponent,
    TranslateModule,
    DropdownModule,
    QuarterBillsComponent,
    CalenderPaymentBillChartComponent,
    NotificationReportComponent,
    ObjectionReportComponent,
    CanComponent,
    NotificationTemplateComponent,
    CommitteMeetingTemplateComponent,
    CanListComponent,
    CourtPleadingTemplateComponent
],
  templateUrl: "./reports.component.html",
  styleUrl: "./reports.component.scss",
})
export class ReportsComponent implements OnInit, OnDestroy {
  enumsOfReports = ReportType;
  reportType = ReportType.VIOLATIONS;
  reportTypes: { value: ReportType; name: string }[] = [];
  @ViewChild(ViolationCountComponent) violationCount: ViolationCountComponent | undefined;
  @ViewChild(UnpaidBillsCountComponent) UnpaidBillsCount: UnpaidBillsCountComponent | undefined;
  @ViewChild(QuarterBillsComponent) quarterBillsComponent: QuarterBillsComponent | undefined;
  @ViewChild(CalenderPaymentBillChartComponent) calenderPaymentBillChartComponent: CalenderPaymentBillChartComponent | undefined;
 
  violationCountSubscription!: Subscription;
  rangeDates!: (string | null)[];
  quartlyBillComparisonBg = [
    "rgba(79, 155, 111, 0.82)",
    "rgba(135, 78, 159, 0.82)",
    "rgba(153, 116, 78, 0.82)",
  ];

  constructor(private reportsService: ReportsService, private langService: LanguageService, private loginService: LoginService) {
    // Initialize reportTypes based on permissions
    if (this.canViewViolationReports()) {
      this.reportTypes.push({ value: ReportType.VIOLATIONS, name: this.langService.getInstantTranslation('violations') });
    }
    if (this.canViewPermitReports()) {
      this.reportTypes.push({ value: ReportType.PERMITS, name: this.langService.getInstantTranslation('permits') });
    }
    // Set initial reportType to first available option
    if (this.reportTypes.length > 0) {
      this.reportType = this.reportTypes[0].value;
    }
  }


  

  createGradientColor(
    colors: any[],
    coord = { x0: 0, y0: 0, x1: 0, y1: 400 }
  ): CanvasGradient | string {
    const ctx = document.createElement("canvas").getContext("2d");
    if (ctx) {
      const gradient = ctx.createLinearGradient(
        coord.x0,
        coord.y0,
        coord.x1,
        coord.y1
      );
      colors.forEach((color) => {
        gradient.addColorStop(color.offset, color.value);
      });
      return gradient;
    } else {
      throw new Error("Canvas not supported");
    }
  }

  handleDateSelect(newDate: any) {
    if (!this.rangeDates?.includes(null)) {
      const startDate = this.rangeDates[0] as string;
      const endDate = this.rangeDates[1] as string;
      this.reportsService.reportDates.set(this.rangeDates);
      this.violationCountSubscription.unsubscribe();
      this.violationCountSubscription = this.reportsService.getBillReport({
        startDate,
        endDate,
      }).subscribe();
    }
  }
  handleFillData = () => {
    this.violationCount!.rangeDates = [];
    this.reportsService.reportDates.set([]);
    this.UnpaidBillsCount!.selectedDate = "";
    
    // Check permissions and set report type accordingly
    if (this.canViewPermitReports()) {
      this.reportType = ReportType.PERMITS;
    }
    else if (this.canViewViolationReports()) {
      this.reportType = ReportType.VIOLATIONS;
    }
    else if(this.canViewViolationReports() && this.canViewPermitReports()){
      
      this.reportType = ReportType.VIOLATIONS;
    }
    var checkReportType = this.reportType === ReportType.PERMITS ? ReportType.PERMIT : this.reportType;
    this.calenderPaymentBillChartComponent!.selectedBillFilter = [];
    this.violationCount!.getReports(this.reportType);
    this.UnpaidBillsCount!.getBills(this.reportType);
    this.quarterBillsComponent!.fillChart(this.reportType);
    this.calenderPaymentBillChartComponent?.fillChart(FilterCalender.WEEKLY, checkReportType);
  }



  
  changeFillData = () => {
    console.log(this.reportType);
    this.violationCount!.rangeDates = [];
    this.reportsService.reportDates.set([]);
    this.UnpaidBillsCount!.selectedDate = "";
    var checkReportType = this.reportType === ReportType.PERMITS ? ReportType.PERMIT : this.reportType;
    this.calenderPaymentBillChartComponent!.selectedBillFilter = [];
    this.violationCount!.getReports(this.reportType);
    this.UnpaidBillsCount!.getBills(this.reportType);
    this.quarterBillsComponent!.fillChart(this.reportType);
    this.calenderPaymentBillChartComponent?.fillChart(FilterCalender.WEEKLY, checkReportType);
  }
  
  
  canViewPermitReports(): boolean {
    return this.loginService.hasPermission([
      "View_PermitReports",
    ]);
  }
  canViewViolationReports(): boolean {
    return this.loginService.hasPermission([
      "View_ViolationReports",
    ]);
  }
  ngOnInit(): void {
    // Remove handleFillData from here
  }

  ngAfterViewInit(): void {
    // Call handleFillData after view is initialized
    this.handleFillData();
  }

  ngOnDestroy(): void {
    // this.violationCountSubscription.unsubscribe();
  }
}
