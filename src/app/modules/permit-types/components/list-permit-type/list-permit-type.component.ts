import { Component, OnInit, signal } from "@angular/core";

import { TableComponent } from "@shared/components/table/table.component";
import { SearchBarComponent } from "@shared/components/search-bar/search-bar.component";
import { PageHeaderComponent } from "@shared/components/page-header/page-header.component";

import { ShowPermitTypeComponent } from "../show-permit-type/show-permit-type.component";
import { CreatePermitTypeComponent } from "../create-permit-type/create-permit-type.component";
import { ChangePermitTypeStatusComponent } from "../change-permit-type-status/change-permit-type-status.component";

import { IPermitTypes } from "../../permit-types.model";
import { ITableColumn } from "@shared/components/table/table.models";

import { ScreenService } from "@shared/services/screen/screen.service";
import { LanguageService } from "@shared/services/language/language.service";
import { TranslateModule } from "@ngx-translate/core";
import { EditPermitTypeComponent } from "../edit-permit-type/edit-permit-type.component";
import { PaginatorModule } from "primeng/paginator";
import { PermitTypesService } from "@shared/services/permit-types/permit-types.service";

@Component({
  selector: "app-list-permit-type",
  standalone: true,
  imports: [
    TableComponent,
    SearchBarComponent,
    PageHeaderComponent,
    CreatePermitTypeComponent,
    TranslateModule,
    PaginatorModule
  ],
  templateUrl: "./list-permit-type.component.html",
  styleUrl: "./list-permit-type.component.scss",
})
export class ListPermitTypeComponent implements OnInit {
  showTableCollapseMode: boolean = false;
  actions: any[] = [];
  municipalitiesData: IPermitTypes[] = [];
  columns: ITableColumn[] = [];
  searchQuery = signal<string>('');

  get totalCount() {
    return this.permitTypesService.totalCount ;
  } 
  constructor(private screenService :ScreenService, private permitTypesService :PermitTypesService, private langServices :LanguageService) {}
  onSearchTextChange = (searchValue: any) => this.searchQuery.set(searchValue); 
  get permitTypes() {
    const searchText = this.searchQuery();
    return this.permitTypesService.entities().filter((a: IPermitTypes) => a.nameAr?.toLowerCase().includes(searchText) || a.nameEn?.toLowerCase().includes(searchText));
  }

  ngOnInit(): void {
    this.getPermitTypes(1, 10)
    this.showTableCollapseMode = this.screenService.isScreenBelowThan(888);
    this.actions = [
      {
        label: "اظهار",
        icon: "pi pi-eye",
        component: ShowPermitTypeComponent,
      },
      // { label: "تنزيل", icon: "pi pi-download" },
      {
        label: "تعديل",
        icon: "pi pi-file-edit",
        component: EditPermitTypeComponent,
      },
      {
        label: "مفعل",
        icon: "",
        component: ChangePermitTypeStatusComponent,
      },
    ];
    this.columns = [
      {
        text: "name-ar",
        dataIndex: "nameAr",
      },
      {
        text: "name-en",
        dataIndex: "nameEn",
        hidden: this.showTableCollapseMode,
        tdClassList: ["w-[200px]"],
      },
      {
        text: "",
        tdTemplate: "expandArrow",
        hidden: !this.showTableCollapseMode,
      },
      {
        text: "Code",
        dataIndex: "code",
        hidden: this.showTableCollapseMode,
      },
      {
        text: "period-days",
        dataIndex: "validityBillPaymentPeriodInDays",
      },
      {
        thTemplate: "actionTemplate",
        tdTemplate: "actionListTemplate",
      },
    ];
  }
  getPermitTypes(pageIndex: number ,pageSize: number) {
    this.permitTypesService.getPermitTypes( pageIndex , pageSize).subscribe();

  }
   //paginator configs
   first: number = 1;
   rows: number = 10;
   onPageChange(event: any) {
       this.first = event.first;
       this.rows = event.rows;
       this.getPermitTypes(event.page + 1 ,this.rows);
   }
}
