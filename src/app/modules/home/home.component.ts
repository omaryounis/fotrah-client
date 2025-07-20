import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, inject } from "@angular/core";

import { ChartModule } from "primeng/chart";
import { CardModule } from "primeng/card";
import { ButtonModule } from "primeng/button";
import { GoogleMap, MapMarker } from "@angular/google-maps";
import { StatisticsCardComponent } from "@shared/components/statistics-card/statistics-card.component";
import { MultiSelectModule } from "primeng/multiselect";
import { FormsModule } from "@angular/forms";
import { BillService } from "@shared/services/bill/bill.service";
import pluginDataLabels from 'chartjs-plugin-datalabels';
import { Chart } from "chart.js";
import { GeneralBillChartComponent } from "./general-bill-chart/general-bill-chart.component";
import { CalenderBillChartComponent } from "./calender-bill-chart/calender-bill-chart.component";
import { TranslateModule } from "@ngx-translate/core";
import { LanguageService } from "@shared/services/language/language.service";
import { DropdownModule } from "primeng/dropdown";
import { ReportType } from "@shared/enums/report-type.enum";
import { FilterCalender } from "@shared/enums/filter-calender.enum";
import { TasksService } from "@shared/services/tasks/tasks.service";
import { CanComponent } from "@shared/components/can/can.component";
import { LoginService } from "@shared/services/login/login.service";
import { CanListComponent } from "../../shared/components/can-list/can.component";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [
    GoogleMap,
    MapMarker,
    CardModule,
    ChartModule,
    ButtonModule,
    StatisticsCardComponent,
    GeneralBillChartComponent,
    CalenderBillChartComponent,
    MultiSelectModule,
    FormsModule,
    TranslateModule,
    DropdownModule,
    CanComponent,
    CanListComponent
],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.scss",
})

export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild(GeneralBillChartComponent) billChart: GeneralBillChartComponent | undefined;
  @ViewChild(CalenderBillChartComponent) calenderBillChart: CalenderBillChartComponent | undefined;
  statusCountsArray: { status: string; count: unknown; }[] = [];
  langService = inject(LanguageService)
  public barChartPlugins = [pluginDataLabels];
  mapBill: any = { paidBillsCount: this.langService.getInstantTranslation('paid'), canceledBillsCount: this.langService.getInstantTranslation('canceled'), unpaidBillsCount: this.langService.getInstantTranslation('unpaid') }
  billList: any = {};
  billTypes: any[] = [{ name: this.langService.getInstantTranslation('canceled'), value: 'canceledBillsCount' }, { name: this.langService.getInstantTranslation('paid'), value: 'paidBillsCount' }, { name: this.langService.getInstantTranslation('unpaid'), value: 'unpaidBillsCount' }];
  selectedBillTypes: any[] = [{value : ReportType.VIOLATIONS ,  name : this.langService.getInstantTranslation('violations')}];
  reportType :string | null = this.canViewPermitOverViewMainPage() ? ReportType.PERMITS : this.canViewViolationOverViewMainPage() ? ReportType.VIOLATIONS :  null;

  reportTypes: { value: ReportType; name: string }[] = [];
  @ViewChild('chart') chartViewChild: ElementRef | undefined;

  chart: Chart | undefined;
  center: google.maps.LatLngLiteral = { lat: 24.7254554, lng: 46.4928744 };
  zoom = 10;
  chartData: any = {};
  chartOptions: any = {};
  get kpis() {
   return this.tasksService.taksRequestsData();
  } 
  get billInfo() {
   return this.billService.billsReport();
  } 
  constructor(private tasksService: TasksService ,private billService: BillService , public authService:LoginService) {
  tasksService.getTasksAndRequests().subscribe();
     // Initialize reportTypes based on permissions
    if (this.canViewPermitOverViewMainPage()) {
      this.reportTypes.push({ value: ReportType.PERMITS, name: this.langService.getInstantTranslation('permits') });
    }
     debugger;
     if (this.canViewViolationOverViewMainPage()) {
      this.reportTypes.push({ value: ReportType.VIOLATIONS, name: this.langService.getInstantTranslation('violations') });
    }
   
    console.log(this.reportTypes);
  }

  
  
  canViewPermitOverViewMainPage(): boolean {
    return this.authService.hasPermission([
      "View_PermitOverViewMainPage",
    ]);
  }
  canViewViolationOverViewMainPage(): boolean {
    return this.authService.hasPermission([
      "View_ViolationOverViewMainPage",
    ]);
  }
  ngAfterViewInit(): void {

  }


  createGradientColor(alpha: number): CanvasGradient | string {
    const ctx = document.createElement("canvas").getContext("2d");
    if (ctx) {
      const gradient = ctx.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, `rgba(243, 246, 249, ${alpha})`);
      gradient.addColorStop(0.7364, `rgba(180, 191, 205, 0)`);
      return gradient;
    } else {
      throw new Error("Canvas not supported");
    }
  }

  getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.center = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
        },
        (error) => {
          console.error(`Error getting location: ${error.message}`);
        },
        {
          enableHighAccuracy: true,
        }
      );
    }
  }
  handleFillData = () => {
    // Check permissions and set report type accordingly
    if (this.canViewPermitOverViewMainPage() && this.canViewViolationOverViewMainPage()) {
      // User has both permissions, use the selected report type
      // this.reportType is already set from the dropdown selection
    } else if (this.canViewPermitOverViewMainPage()) {
      this.reportType = ReportType.PERMITS;
    } else if (this.canViewViolationOverViewMainPage()) {
      this.reportType = ReportType.VIOLATIONS;
    }
    
    this.billChart!.selectedBillTypes! = [];
    this.billChart?.fillChart([] , this.reportType!);
    var checkReportRype= this.reportType === ReportType.PERMITS ? ReportType.PERMIT : this.reportType;
    this.calenderBillChart!.selectedBillFilter = [];
    this.calenderBillChart?.fillChart(FilterCalender.WEEKLY , checkReportRype!);
  }
  ngOnInit(): void {
    // this.getCurrentLocation();
  }
}
