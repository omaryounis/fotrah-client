import { Component, OnInit, signal } from "@angular/core";

import { TableComponent } from "@shared/components/table/table.component";
import { SearchBarComponent } from "@shared/components/search-bar/search-bar.component";
import { PageHeaderComponent } from "@shared/components/page-header/page-header.component";

import { ScreenService } from "@shared/services/screen/screen.service";

import { ITableColumn } from "@shared/components/table/table.models";

import { TranslateModule } from "@ngx-translate/core";
import { PaginatorModule } from "primeng/paginator";
import { ActivatedRoute } from "@angular/router";
import { LanguageService } from "@shared/services/language/language.service";
import { IQualityMission, IVoteDetail } from "../models/quality.model";
import { JwtPayload, jwtDecode } from "jwt-decode";
import { LoginService } from "@shared/services/login/login.service";
import { CommonModule } from "@angular/common";
import { single } from "rxjs";
import { FinancialItemsService } from "@shared/services/main-data-management/financial-items/financial-items.service";
import { IFinancial } from "@root/src/app/modules/financials/financials.model";
import { QualityWorkflowComponent } from "../quality-workflow/quality-workflow.component";
import { QualityService } from "@shared/services/quality/quality.service";

@Component({
  selector: "app-list-quality-tasks",
  standalone: true,
  imports: [
    TableComponent,
    SearchBarComponent,
    PageHeaderComponent,
    TranslateModule,
    PaginatorModule,
    CommonModule,
  ],
  templateUrl: "./list-quality-tasks.component.html",
  styleUrl: "./list-quality-tasks.component.scss",
})
export class ListQualityTasksComponent {
  showTableCollapseMode: boolean = false;
  actions: any[] = [];
  // tasks: IObjection[] = [];
  first: number = 1;
  rows: number = 10;
  index: number = 1;
  userData: any;

  //previous filter value
  previous_status: number | undefined;
  previous_vote_status: number | undefined;
  previous_search_query: string = "";
  columns: ITableColumn[] = [];
  financialItems: { id: number; name: string }[] = [];
  selected_finItem: number | undefined;

  selected_status: number | undefined;
  selected_vote_status: number | undefined;
  searchQuery = signal<string>("");
  searchObjectorName = signal<string>("");

  constructor(
    private screenService: ScreenService,
    private router: ActivatedRoute,
    private langService: LanguageService,
    private qualityService: QualityService,
    private loginService: LoginService,
    private finItemService: FinancialItemsService
  ) {

  }
  ngOnInit(): void {
    this.showTableCollapseMode = this.screenService.isScreenBelowThan(888);
    this.getQualityList(this.rows, this.first)

    this.actions = this.getActions();

    this.columns = [
      {
        text: "company-name",
        dataIndex: "objectorName",
        hidden: this.showTableCollapseMode,
        tdClassList: ["w-[300px]"],
      },
      {
        text: "quality-mission-number",
        dataIndex: "objectionNumber",
        hidden: this.showTableCollapseMode,
      },
      {
        text: "BillNumber",
        dataIndex: "billNumber",
        tdClassList: ["w-[200px]"],
      },
      {
        text: "",
        tdTemplate: "expandArrow",
        hidden: !this.showTableCollapseMode,
      },
      {
        text: "request-date",
        dataIndex: "createdAt",
        hidden: this.showTableCollapseMode,
      },
      // {
      //   text: "mobileNumber",
      //   dataIndex: "objectorMobileNumber",
      //   hidden: this.showTableCollapseMode,
      // },
      {
        text: "request-status",
        dataIndex: "statusName",
        tdClassList: ["w-[300px]"],
        showOnExpandedRow: true,
      },
      {
        text: "",
        tdTemplate: "checkIcon",
        showOnExpandedRow: true,
        condition: (item) => this.hasVotedByUser(item.votes) === true,
      },
      {
        thTemplate: "actionTemplate",
        tdTemplate: "actionListTemplate",
        showOnExpandedRow: true,
      },
    ];

    this.finItemService.getFinancials(1000, 1).subscribe((res) => {
      this.financialItems = res.data.financialItems.map(
        (finItem: IFinancial) => ({
          id: finItem.id,
          name: this.langService.getInstantTranslation(
            this.langService.browserLang === "ar"
              ? finItem.nameAr || ""
              : finItem.nameEn || ""
          ),
        })
      );
    });

  }
  get requestsList() {
     const searchText = this.searchQuery();
    return this.qualityService.qualityMissions();
  }

  onSearchTextChange(searchValue: any) {
    this.searchQuery.set(searchValue);
    // this.getObjectionList(this.rows , 1);
  }
  onSearchObjectorNameChange(searchValue: any) {
    if (searchValue.length >= 3) {
      this.searchObjectorName.set(searchValue);
    } else {
      this.searchObjectorName.set("");
    }
  }

  getQualityList(rows: number, pageIndex: any) {
    this.resetOnFilterChange();
    this.actions = this.getActions();
    this.qualityService
      .getQualityMissions(
        pageIndex,
        rows,
        this.selected_status,
        this.searchQuery(),
        this.selected_vote_status,
        this.searchObjectorName(),
        this.selected_finItem
      )
      .subscribe();
  }
  resetOnFilterChange() {
    if (
      this.selected_status != this.previous_status ||
      this.selected_vote_status != this.previous_vote_status
    ) {
      this.first = 1;
      this.index = 1;
      this.rows = 10;
      this.previous_status = this.selected_status;
      this.previous_vote_status = this.selected_vote_status;
    }
  }
  
  get totalCount() {
    return this.qualityService.totalCount ;
  } 
  checkIsvisible(): boolean {
     
    if (
      
      this.loginService.hasPermission([
        "Procceed_Quality_CommitteeCoordinator"
       ])
    ) {
      return true;
    }
    return false;
  }
  onPageChange(event: any) {
    this.first = event.first;
    this.index = event.page + 1
    this.rows = event.rows;
    this.getQualityList(this.rows, event.page + 1);
    this.actions = this.getActions()
  }
  status_list = [
    // {text : this.langService.getInstantTranslation('objection-statuses.1') , id : 1},
    {text : this.langService.getInstantTranslation('objection-statuses.2') , id : 2},
    {text : this.langService.getInstantTranslation('objection-statuses.3') , id : 3},
    {text : this.langService.getInstantTranslation('objection-statuses.4') , id : 4},
    {text : this.langService.getInstantTranslation('objection-statuses.5') , id : 5},
    
  ]
  vote_status_list= [
    {text : this.langService.getInstantTranslation('objection-vote-status.1') , id : 1},
    {text : this.langService.getInstantTranslation('objection-vote-status.2') , id : 2},
    {text : this.langService.getInstantTranslation('objection-vote-status.3') , id : 3},
  ]
  getTranslatedStatus(statusId: number): string {
    const status = this.status_list.find(s => s.id === statusId);
    return status ? status.text : ''; 
  }
  getActions(): any[] {
    const searchObjectorNameValue = this.searchObjectorName();
    return [
      {
        label: "اظهار",
        icon: "pi pi-eye",
        status: this.selected_status,
        queryParams: {
          pageIndex: this.index,
          pageSize: this.rows,
          status: this.selected_status ?? undefined,
          objectionNumber:
            this.searchQuery().length == 0 ? undefined : this.searchQuery(),
          voteStatus: this.selected_vote_status ?? undefined,
          objectorName:
            this.searchObjectorName().length == 0
              ? undefined
              : this.searchObjectorName(),
          finItemId: this.selected_finItem ?? undefined,
        },
        component: QualityWorkflowComponent,
      },
    ];
  }
  hasVotedByUser(votes: IVoteDetail[]): boolean {
    const token = localStorage.getItem("accessToken")!;
    this.userData = jwtDecode(token) as JwtPayload & { sid: "" };

    return votes?.some((vote) => vote.createdBy === this.userData.sid) || false;
  }
}
