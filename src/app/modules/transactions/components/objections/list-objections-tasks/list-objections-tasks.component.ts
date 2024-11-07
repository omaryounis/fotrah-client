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
import { IObjectionMission } from "./objections.model";
@Component({
  selector: "list-objections-tasks",
  standalone: true,
  imports: [
    TableComponent,
    SearchBarComponent,
    PageHeaderComponent,
    TranslateModule,
  PaginatorModule  ],
  templateUrl: "./list-objections-tasks.component.html",
  styleUrl: "./list-objections-tasks.component.scss",
})
export class ListObjectionsMissionsComponent implements OnInit {
  showTableCollapseMode: boolean = false;
  actions: any[] = [];
  // tasks: IObjection[] = [];
  requests_type :string = 'ALL';
  first: number = 1;
  rows: number = 10;

  columns: ITableColumn[] = [];

  constructor(private screenService: ScreenService, private router :ActivatedRoute,private langService : LanguageService, private objectionService: ObjectionService) {
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

  ngOnInit(): void {

    this.showTableCollapseMode = this.screenService.isScreenBelowThan(888);
    this.actions = [ 
      {
        label: "اظهار",
        icon: "pi pi-eye",
        component: ObjectionWorkflowComponent,
      },
     
    ];
    this.columns = [
      {
        text: "ObjectorName",
        dataIndex: "objectorName",
        hidden: this.showTableCollapseMode,
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
        thTemplate: "actionTemplate",
        tdTemplate: "actionListTemplate",
        showOnExpandedRow: true,
      },
    ];
  }

  get totalCount() {
    return this.objectionService.totalCount ;
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
  ]
  getTranslatedStatus(statusId: number): string {
    const status = this.status_list.find(s => s.id === statusId);
    return status ? status.text : ''; 
  }
  getObjectionList(rows: number, pageIndex: any) {
    this.objectionService.getObjections(pageIndex, rows , this.selected_status , this.searchQuery()).subscribe()
  }
}
