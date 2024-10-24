import { Component, OnInit, signal } from "@angular/core";


import { TableComponent } from "@shared/components/table/table.component";
import { SearchBarComponent } from "@shared/components/search-bar/search-bar.component";
import { PageHeaderComponent } from "@shared/components/page-header/page-header.component";

import { ScreenService } from "@shared/services/screen/screen.service";


import { ITableColumn } from "@shared/components/table/table.models";
import { IOrder } from "../../orders.model";
import { TranslateModule } from "@ngx-translate/core";
import { TasksService } from "@shared/services/tasks/tasks.service";
import { EditTaskComponent } from "../../../tasks/components/edit-task/edit-task.component";
import { ITask } from "../../../tasks/tasks.model";
import { EditOrderComponent } from "../edit-order/edit-order.component";
import { PaginatorModule } from "primeng/paginator";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-list-orders",
  standalone: true,
  imports: [
    TableComponent,
    SearchBarComponent,
    PageHeaderComponent,
    TranslateModule,
  PaginatorModule  ],
  templateUrl: "./list-orders.component.html",
  styleUrl: "./list-orders.component.scss",
})
export class ListOrdersComponent implements OnInit {
  showTableCollapseMode: boolean = false;
  actions: any[] = [];
  // tasks: ITask[] = [];
  requests_type :string = 'ALL';
  first: number = 1;
  rows: number = 10;

  columns: ITableColumn[] = [];

  constructor(private screenService: ScreenService, private router :ActivatedRoute, private taskService: TasksService) {
    router.queryParamMap.subscribe(res => this.requests_type = res.get('request_typpe')!)
    this.getRequestsList(this.rows, this.first)
  }
  searchQuery = signal<string>('');
  get requestsList() {
    const searchText = this.searchQuery();
    return this.taskService.entities().filter((a: ITask) => a.requestType?.includes(searchText) || a.requestStatus?.includes(searchText));
  }
  onSearchTextChange(searchValue: any) {
    this.searchQuery.set(searchValue);
  }

  ngOnInit(): void {

    this.showTableCollapseMode = this.screenService.isScreenBelowThan(888);
    this.actions = [
      // { label: "تنزيل", icon: "pi pi-download" },
      // { label: "حذف", icon: "pi pi-trash" },
      {
        label: "اظهار",
        icon: "pi pi-eye",
        component: EditOrderComponent,
      },
      // {
      //   label: "تعديل",
      //   icon: "pi pi-file-edit",
      //   component: EditTaskComponent,
      // },
    ];
    this.columns = [
      {
        text: "request-type",
        dataIndex: "requestType",
        hidden: this.showTableCollapseMode,
      },
      {
        text: "request-no",
        dataIndex: "id",
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
        text: "sender",
        dataIndex: "userName",
        hidden: this.showTableCollapseMode,
      },
      {
        text: "request-status",
        dataIndex: "requestStatus",
        showOnExpandedRow: true,
      },
      {
        thTemplate: "actionTemplate",
        tdTemplate: "actionListTemplate",
      },
    ];
  }

  get totalCount() {
    return this.taskService.totalCount ;
  } 
  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.getRequestsList(this.rows, event.page + 1);
  }
  getRequestsList(rows: number, pageIndex: any) {
    this.taskService.getRequestsList(pageIndex, rows).subscribe()
  }
}
