import { Component, OnInit, signal } from "@angular/core";


import { TableComponent } from "@shared/components/table/table.component";
import { SearchBarComponent } from "@shared/components/search-bar/search-bar.component";
import { PageHeaderComponent } from "@shared/components/page-header/page-header.component";

import { ScreenService } from "@shared/services/screen/screen.service";


import { ITableColumn } from "@shared/components/table/table.models";

import { TranslateModule } from "@ngx-translate/core";
import { TasksService } from "@shared/services/tasks/tasks.service";
import { EditTaskComponent } from "../../../tasks/components/edit-task/edit-task.component";
import { EditOrderComponent } from "../edit-order/edit-order.component";
import { PaginatorModule } from "primeng/paginator";
import { ActivatedRoute } from "@angular/router";
import { IObjection } from "@shared/models/objection.model";
import { LanguageService } from "@shared/services/language/language.service";

@Component({
  selector: "app-list-objections",
  standalone: true,
  imports: [
    TableComponent,
    SearchBarComponent,
    PageHeaderComponent,
    TranslateModule,
  PaginatorModule  ],
  templateUrl: "./list-objections.component.html",
  styleUrl: "./list-objections.component.scss",
})
export class ListObjectionsComponent implements OnInit {
  showTableCollapseMode: boolean = false;
  actions: any[] = [];
  // tasks: IObjection[] = [];
  requests_type :string = 'ALL';
  first: number = 1;
  rows: number = 10;

  columns: ITableColumn[] = [];

  constructor(private screenService: ScreenService, private router :ActivatedRoute,private langService : LanguageService, private taskService: TasksService) {
    this.getObjectionList(this.rows, this.first)
  }
  searchQuery = signal<string>('');
  get requestsList() {
    const searchText = this.searchQuery();
    return this.taskService.objections()  }
  onSearchTextChange(searchValue: any) {
    this.searchQuery.set(searchValue);
    // this.getObjectionList(this.rows , 1);
  }
  selected_status: number | undefined;

  ngOnInit(): void {

    this.showTableCollapseMode = this.screenService.isScreenBelowThan(888);
    this.actions = [
      // { label: "تنزيل", icon: "pi pi-download" },
      // { label: "حذف", icon: "pi pi-trash" },
      // {
      //   label: "اظهار",
      //   icon: "pi pi-eye",
      //   component: EditOrderComponent,
      // },
      // {
      //   label: "تعديل",
      //   icon: "pi pi-file-edit",
      //   component: EditTaskComponent,
      // },
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
        dataIndex: "status",
        showOnExpandedRow: true,
      },
      // {
      //   thTemplate: "actionTemplate",
      //   tdTemplate: "actionListTemplate",
      // },
    ];
  }

  get totalCount() {
    return this.taskService.totalCount ;
  } 
  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.getObjectionList(this.rows, event.page + 1);
  }
  getObjectionList(rows: number, pageIndex: any) {
    this.taskService.getObjectionList(pageIndex, rows , this.selected_status ,this.searchQuery()).subscribe()
  }
  status_list = [
    {text : this.langService.getInstantTranslation('objection-statuses.1') , id : 1},
    {text : this.langService.getInstantTranslation('objection-statuses.2') , id : 2},
    {text : this.langService.getInstantTranslation('objection-statuses.3') , id : 3},
    {text : this.langService.getInstantTranslation('objection-statuses.4') , id : 4},
    {text : this.langService.getInstantTranslation('objection-statuses.5') , id : 5},
    {text : this.langService.getInstantTranslation('objection-statuses.6') , id : 6},
  ]
}
