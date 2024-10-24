import { Component, OnInit, signal } from "@angular/core";

import { TableComponent } from "@shared/components/table/table.component";
import { SearchBarComponent } from "@shared/components/search-bar/search-bar.component";
import { PageHeaderComponent } from "@shared/components/page-header/page-header.component";

import { EditEconomicClassificationsComponent } from "../edit-economic-classifications/edit-economic-classifications.component";
import { ShowEconomicClassificationsComponent } from "../show-economic-classifications/show-economic-classifications.component";
import { CreateEconomicClassificationsComponent } from "../create-economic-classifications/create-economic-classifications.component";

import { ITableColumn } from "@shared/components/table/table.models";
import { IEconomicClassification } from "../../economic-classifications.model";

import { ScreenService } from "@shared/services/screen/screen.service";
import { TranslateModule } from "@ngx-translate/core";
import { EconomicClassificationsService } from "@shared/services/main-data-management/economic-classifications/economic-classifications.service";
import { PaginatorModule } from "primeng/paginator";
import { CanComponent } from "@shared/components/can/can.component";
import { LanguageService } from "@shared/services/language/language.service";
import { ChangeStatusEconomicClassificationsComponent } from "../change-status-economic-classifications/change-status-economic-classifications.component";

@Component({
  selector: "app-list-economic-classifications",
  standalone: true,
  imports: [
    TableComponent,
    SearchBarComponent,
    PageHeaderComponent,
    CreateEconomicClassificationsComponent,
    TranslateModule,
    PaginatorModule,
    CanComponent
  ],
  templateUrl: "./list-economic-classifications.component.html",
  styleUrl: "./list-economic-classifications.component.scss",
})
export class ListEconomicClassificationsComponent implements OnInit {
  showTableCollapseMode: boolean = false;
  actions: any[] = [];

  columns: ITableColumn[] = [];
  searchQuery = signal<string>('');

  constructor(private screenService: ScreenService , private ecService :EconomicClassificationsService, private langService:LanguageService) {
     this.getEconomicClassfications(10 ,1)
  }
  onSearchTextChange(searchValue: any) { 
    this.searchQuery.set(searchValue);
  }
  get economicClassificationItems() {
    const searchText = this.searchQuery();
    return this.ecService.entities().filter((a: IEconomicClassification) => a.name?.includes(searchText) || a.beneficiaryAgencyName?.includes(searchText));
  }
  ngOnInit(): void {
    this.showTableCollapseMode = this.screenService.isScreenBelowThan(888);
    this.actions = [
      {
        label: "اظهار",
        icon: "pi pi-eye",
        component: ShowEconomicClassificationsComponent,
      },
      // { label: "تنزيل", icon: "pi pi-download" },
      {
        label: "تعديل",
        icon: "pi pi-file-edit",
        permission : 'Gfs',
        component: EditEconomicClassificationsComponent,
      },
      {
        label: "مفعل",
        icon: "",
        component: ChangeStatusEconomicClassificationsComponent,
      },
    ];
    this.columns = [
      {
        text: "e-class-name",
        dataIndex: this.langService.getNameFormat(),
      },
      {
        text: "beneficiary-agency-name",
        dataIndex: "beneficiaryAgencyName",
        hidden: this.showTableCollapseMode,
        // tdClassList: ["w-[200px]"],
      },
      {
        text: "",
        tdTemplate: "expandArrow",
        hidden: !this.showTableCollapseMode,
      },
      {
        text: "e-class-no",
        dataIndex: "code",
      },
      {
        thTemplate: "actionTemplate",
        tdTemplate: "actionListTemplate",
      },
    ];
  }
  getEconomicClassfications(pageSize: number, pageIndex: any) {
    this.ecService.getEconomicClassifications(pageSize , pageIndex).subscribe();
  }
    //paginator configs
    get totalCount() {
      return this.ecService.totalCount ;
    } 
    first: number = 1;
    rows: number = 10;
  
    onPageChange(event: any) {
        this.first = event.first;
        this.rows = event.rows;
        this.getEconomicClassfications(this.rows, event.page + 1);
    }

}
