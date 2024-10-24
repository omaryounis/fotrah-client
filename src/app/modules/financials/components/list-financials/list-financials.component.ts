import { Component, OnInit, signal } from "@angular/core";

import { TableComponent } from "@shared/components/table/table.component";
import { SearchBarComponent } from "@shared/components/search-bar/search-bar.component";
import { PageHeaderComponent } from "@shared/components/page-header/page-header.component";

import { ShowFinancialComponent } from "../show-financial/show-financial.component";
import { EditFinancialComponent } from "../edit-financial/edit-financial.component";
import { CreateFinancialComponent } from "../create-financial/create-financial.component";
import { ChangeFinancialStatus } from "../change-financial-status/change-financial-status.component";

import { IFinancial } from "../../financials.model";
import { ITableColumn } from "@shared/components/table/table.models";

import { ScreenService } from "@shared/services/screen/screen.service";
import { FinancialItemsService } from "@shared/services/main-data-management/financial-items/financial-items.service";
import { LanguageService } from "@shared/services/language/language.service";
import { TranslateModule } from "@ngx-translate/core";
import { PaginatorModule } from "primeng/paginator";
import { CanComponent } from "@shared/components/can/can.component";

@Component({
  selector: "app-list-financials",
  standalone: true,
  imports: [
    TableComponent,
    SearchBarComponent,
    PageHeaderComponent,
    CreateFinancialComponent,
    TranslateModule,
    PaginatorModule,
    CanComponent
  ],
  templateUrl: "./list-financials.component.html",
  styleUrl: "./list-financials.component.scss",
})
export class ListFinancialsComponent implements OnInit {
  showTableCollapseMode: boolean = false;
  actions: any[] = [];
  columns: ITableColumn[] = [];
  searchQuery = signal<string>('');
  
  constructor(private screenService: ScreenService , private financialItemsService : FinancialItemsService, private langServices : LanguageService) {
    this.getFinancialItems(10 ,1)
  }
  onSearchTextChange(searchValue: any) { 
    this.searchQuery.set(searchValue);
    // this.getFinancialItems(10 , 1)
  }
  get financialItems() {
    const searchText = this.searchQuery();
    return this.financialItemsService.entities()
  }


  ngOnInit(): void {
    this.showTableCollapseMode = this.screenService.isScreenBelowThan(888);
    this.actions = [
      {
        label: "اظهار",
        icon: "pi pi-eye",
        component: ShowFinancialComponent,
      },
      // { label: "تنزيل", icon: "pi pi-download" },
      {
        label: "تعديل",
        icon: "pi pi-file-edit",
        permission : "FinancialItems",
        component: EditFinancialComponent,
      },
      {
        label: this.langServices.getInstantTranslation('active') ,
        icon: "",
        component: ChangeFinancialStatus,
      },
    ];
    this.columns = [
      {
        text: "item-name",
        dataIndex: this.langServices.getNameFormat(),
      },
      {
        text: "classification",
        dataIndex: "categoryName",
        hidden: this.showTableCollapseMode,
      },
      {
        text: "",
        tdTemplate: "expandArrow",
        hidden: !this.showTableCollapseMode,
      },
      {
        text: "item-no",
        dataIndex: "code",
      },
      {
        text: "activity",
        dataIndex: "activityName",
        hidden: this.showTableCollapseMode,
      },
      {
        thTemplate: "actionTemplate",
        tdTemplate: "actionListTemplate",
       

      },
    ];
  }
  getFinancialItems(pageSize: number, pageIndex: number) {
    this.financialItemsService.getFinancials(pageSize, pageIndex ,this.searchQuery()).subscribe();

  }
    //paginator configs
    get totalCount() {
      return this.financialItemsService.totalCount ;
    } 
    first: number = 1;
    rows: number = 10;
  
    onPageChange(event: any) {
        this.first = event.first;
        this.rows = event.rows;
        this.getFinancialItems(this.rows, event.page + 1 );
    }

}
