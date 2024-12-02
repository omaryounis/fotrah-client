import { Component, OnInit, signal } from "@angular/core";


import { TableComponent } from "@shared/components/table/table.component";
import { SearchBarComponent } from "@shared/components/search-bar/search-bar.component";
import { PageHeaderComponent } from "@shared/components/page-header/page-header.component";

import { ScreenService } from "@shared/services/screen/screen.service";

import { ITableColumn } from "@shared/components/table/table.models";

import { TranslateModule } from "@ngx-translate/core";
import { ObjectionService } from "@shared/services/objection/objection.service";
// import { EditOrderComponent } from "../edit-order/edit-order.component";
import { PaginatorModule } from "primeng/paginator";
import { ActivatedRoute } from "@angular/router";
// import { IObjection } from "@shared/models/objection.model";
import { LanguageService } from "@shared/services/language/language.service";
import { ObjectionWorkflowComponent } from "../objection-workflow/objection-workflow.component";
import { IObjectionMission, IVoteDetail } from "./objections.model";
import { JwtPayload, jwtDecode } from 'jwt-decode';
import { LoginService } from "@shared/services/login/login.service";
import { CommonModule } from "@angular/common";



@Component({
  selector: "list-objections-tasks",
  standalone: true,
  imports: [
    TableComponent,
    SearchBarComponent,
    PageHeaderComponent,
    TranslateModule,
  PaginatorModule,
CommonModule
],
  templateUrl: "./list-objections-tasks.component.html",
  styleUrl: "./list-objections-tasks.component.scss",
})
export class ListObjectionsMissionsComponent implements OnInit {
  showTableCollapseMode: boolean = false;
  actions: any[] = [];
  // tasks: IObjection[] = [];
  first: number = 1;
  rows: number = 10;
  userData: any;

  columns: ITableColumn[] = [];

  constructor(private screenService: ScreenService, private router :ActivatedRoute,private langService : LanguageService, private objectionService: ObjectionService, private loginService: LoginService) {
    this.getObjectionList(this.rows, this.first)
  }
  get requestsList() {
    const searchText = this.searchQuery();
    return this.objectionService.objections() }
  searchQuery = signal<string>('');

  onSearchTextChange(searchValue: any) {
    this.searchQuery.set(searchValue);
    // this.getObjectionList(this.rows , 1);
  }
  selected_status: number | undefined;
  selected_vote_status: number | undefined;

  ngOnInit(): void {

    this.showTableCollapseMode = this.screenService.isScreenBelowThan(888);
    this.actions = [ 
      {
        label: "اظهار",
        icon: "pi pi-eye",
        status: this.selected_status,
        component: ObjectionWorkflowComponent,
      },
     
    ];
    this.columns = [
      {
        text: "ObjectorName",
        dataIndex: "objectorName",
        hidden: this.showTableCollapseMode,
        tdClassList: ["w-[300px]"],
      },
      {
        text: "ObjectionNumber",
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
      {
        text: "mobileNumber",
        dataIndex: "objectorMobileNumber",
        hidden: this.showTableCollapseMode,
      },
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
        condition: (item) => this.hasVotedByUser(item.votes) === true
      },
      {
        thTemplate: "actionTemplate",
        tdTemplate: "actionListTemplate",
        showOnExpandedRow: true,
      },
    ];
  }

  get totalCount() {
    return this.objectionService.totalCount ;
  } 
  checkIsvisible(): boolean {
     
    if (
      
      this.loginService.hasPermission([
        "Procceed_NotSerious_Objection_CommitteeCoordinator",
        "Procceed_Objection_CommitteeCoordinator",
      ])
    ) {
      return true;
    }
    return false;
  }
  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.getObjectionList(this.rows, event.page + 1);
  }
  status_list = [
    // {text : this.langService.getInstantTranslation('objection-statuses.1') , id : 1},
    {text : this.langService.getInstantTranslation('objection-statuses.2') , id : 2},
    {text : this.langService.getInstantTranslation('objection-statuses.3') , id : 3},
    {text : this.langService.getInstantTranslation('objection-statuses.4') , id : 4},
    {text : this.langService.getInstantTranslation('objection-statuses.5') , id : 5},
    {text : this.langService.getInstantTranslation('objection-statuses.6') , id : 6},
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
  getObjectionList(rows: number, pageIndex: any) {

    this.objectionService.getObjections(pageIndex, rows , this.selected_status , this.searchQuery(),this.selected_vote_status).subscribe()
  }
  hasVotedByUser(votes: IVoteDetail[]): boolean {
    const token = localStorage.getItem('accessToken')!;
    this.userData = jwtDecode(token) as JwtPayload & { sid: '' }; 
    
    return votes?.some(vote => vote.createdBy === this.userData.sid) || false; 
  }
  
}