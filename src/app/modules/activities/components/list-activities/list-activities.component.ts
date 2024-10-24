import { Component, OnInit, inject, signal } from "@angular/core";

import { TableComponent } from "@shared/components/table/table.component";
import { SearchBarComponent } from "@shared/components/search-bar/search-bar.component";
import { PageHeaderComponent } from "@shared/components/page-header/page-header.component";

import { CreateActivityComponent } from "../create-activity/create-activity.component";

import { IActivity } from "../../activities.model";
import { ITableColumn } from "@shared/components/table/table.models";
import { ShowActivityComponent } from "../show-activity/show-activity.component";
import { EditActivityComponent } from "../edit-activity/edit-activity.component";
import { ChangeStatusActivityComponent } from "../change-status-activity/change-status-activity.component";

import { ScreenService } from "@shared/services/screen/screen.service";
import { ActivitiesService } from "@shared/services/main-data-management/activities/activities.service";
import { TranslateModule } from "@ngx-translate/core";
import { EconomicClassificationsService } from "@shared/services/main-data-management/economic-classifications/economic-classifications.service";
import { LanguageService } from "@shared/services/language/language.service";
import { PaginatorModule } from "primeng/paginator";
import { CanComponent } from "@shared/components/can/can.component";

@Component({
  selector: "app-list-activities",
  standalone: true,
  imports: [
    TableComponent,
    SearchBarComponent,
    PageHeaderComponent,
    CreateActivityComponent,
    TranslateModule,
    PaginatorModule,
    CanComponent
  ],
  templateUrl: "./list-activities.component.html",
  styleUrl: "./list-activities.component.scss",
})
export class ListActivitiesComponent implements OnInit {
  showTableCollapseMode: boolean = false;
  actions: any[] = [];
  
  columns: ITableColumn[] = [];
  searchQuery = signal<string>('');
  get totalCount() {
    return this.activitiesService.totalCount ;
  } 
    

  constructor(private screenService: ScreenService , private activitiesService : ActivitiesService ,private langService :LanguageService ) {
   this.getActivities(1 , 10);
  }
  getActivities(pageIndex: number, pageSize: number) {
    this.activitiesService.getActivities(pageIndex ,pageSize).subscribe();
  }

  onSearchTextChange(searchValue: any) { 
    this.searchQuery.set(searchValue);
  }
  get activities() {
    const searchText = this.searchQuery();
    return this.activitiesService.entities().filter((a: IActivity) => a.nameAr?.includes(searchText) || a.nameEn?.includes(searchText));
  }

  ngOnInit(): void {
    this.showTableCollapseMode = this.screenService.isScreenBelowThan(888);
    this.actions = [
      {
        label: "اظهار",
        icon: "pi pi-eye",
        component: ShowActivityComponent,
      },
      // { label: "تنزيل", icon: "pi pi-download" },
      {
        label: "تعديل",
        icon: "pi pi-file-edit",
        permission : "Activities",
        component: EditActivityComponent,
      },
      {
        label: "مفعل",
        icon: "",
        component: ChangeStatusActivityComponent,
      },
    ];
    this.columns = [
      {
        text: "activity-name",
        dataIndex: this.langService.getNameFormat(),
      },
      {
        text: "activity-desc",
        dataIndex: "description",
        hidden: this.showTableCollapseMode,
        tdClassList: ["w-[200px]"],
      },
      {
        text: "",
        tdTemplate: "expandArrow",
        hidden: !this.showTableCollapseMode,
      },
      {
        text: "activity-no",
        dataIndex: "code",
      },
      {
        thTemplate: "actionTemplate",
        tdTemplate: "actionListTemplate",
      },
    ];
  }

  //paginator configs
  
  first: number = 1;
  rows: number = 10;

  onPageChange(event: any) {
      this.first = event.first;
      this.rows = event.rows;
      this.getActivities(event.page + 1 , this.rows);
  }
}
