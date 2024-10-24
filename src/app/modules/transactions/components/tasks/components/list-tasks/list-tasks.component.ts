import { Component, OnInit, signal } from "@angular/core";

import { ShowTaskComponent } from "../show-task/show-task.component";
import { EditTaskComponent } from "./../edit-task/edit-task.component";
import { TableComponent } from "@shared/components/table/table.component";
import { SearchBarComponent } from "@shared/components/search-bar/search-bar.component";
import { PageHeaderComponent } from "@shared/components/page-header/page-header.component";

import { ScreenService } from "@shared/services/screen/screen.service";

import { ITask } from "./../../tasks.model";
import { ITableColumn } from "@shared/components/table/table.models";
import { TranslateModule } from "@ngx-translate/core";
import { TasksService } from "@shared/services/tasks/tasks.service";
import { PaginatorModule } from "primeng/paginator";
import { LanguageService } from "@shared/services/language/language.service";
import { LoginService } from "@shared/services/login/login.service";

@Component({
  selector: "app-list-tasks",
  standalone: true,
  imports: [
    TableComponent,
    ShowTaskComponent,
    EditTaskComponent,
    SearchBarComponent,
    PageHeaderComponent,
    TranslateModule,
    PaginatorModule
  ],
  templateUrl: "./list-tasks.component.html",
  styleUrl: "./list-tasks.component.scss",
})
export class ListTasksComponent implements OnInit {
  showTableCollapseMode: boolean = false;
  actions: any[] = [];
  // tasks: ITask[] = [];

  first: number = 1;
  rows: number = 10;

  columns: ITableColumn[] = [];
  selected_status: number | undefined;

  constructor(private screenService: ScreenService, private loginService:LoginService, private taskService: TasksService , private langService :LanguageService) {
    this.getTasksList(this.rows, this.first)
  }
  searchQuery = signal<string>('');
  get tasks() {
    const searchText = this.searchQuery();
    return this.taskService.entities();
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
        component: EditTaskComponent,
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
    this.getTasksList(this.rows, event.page + 1);
  }
  getTasksList(rows: number, pageIndex: any) {
    this.taskService.getTasks(pageIndex, rows ,this.selected_status , parseInt(this.searchQuery())).subscribe()
  }
  checkPermission() : boolean {
    return this.loginService.hasPermission(["Procceed_NotSerious_Objection_CommitteeCoordinator" , "Procceed_Objection_CommitteeCoordinator" , "Add_NotSerious_Objection_Member_Vote" , "Add_Objection_Member_Vote"]);
  }
  status_list = [
    {text : this.langService.getInstantTranslation(this.checkPermission() ?'obj-statuses.1' : 'statuses.1') , id : 1},
    {text : this.langService.getInstantTranslation(this.checkPermission() ?'obj-statuses.2' :'statuses.2') , id : 2},
    {text : this.langService.getInstantTranslation(this.checkPermission() ?'obj-statuses.3' :'statuses.3') , id : 3},
    {text : this.langService.getInstantTranslation(this.checkPermission() ?'obj-statuses.4' :'statuses.4') , id : 4},
  ]
}
