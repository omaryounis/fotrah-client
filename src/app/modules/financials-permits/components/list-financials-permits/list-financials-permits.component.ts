import { Component, OnInit, signal } from '@angular/core';
import { FinancialItemsService } from '@shared/services/main-data-management/financial-items/financial-items.service';
import { IFinancialsPermits } from '../../financials-permits.model';
import { ShowFinancialsPermitsComponent } from '../show-financials-permits/show-financials-permits.component';
import { ITableColumn } from '@shared/components/table/table.models';
import { LanguageService } from '@shared/services/language/language.service';
import { ScreenService } from '@shared/services/screen/screen.service';
import { CreateFinancialsPermitsComponent } from '../create-financials-permits/create-financials-permits.component';
import { TranslateModule } from '@ngx-translate/core';
import { CanComponent } from '@shared/components/can/can.component';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { SearchBarComponent } from '@shared/components/search-bar/search-bar.component';
import { TableComponent } from '@shared/components/table/table.component';
import { PaginatorModule } from 'primeng/paginator';
import { FinancialsPermitsService } from '@shared/services/main-data-management/financials-permits/financials-permits.service';

@Component({
  selector: 'app-list-financials-permits',
  standalone : true,
  imports : [
    TableComponent,
    SearchBarComponent,
    PageHeaderComponent,
    CreateFinancialsPermitsComponent,
    TranslateModule,
    PaginatorModule,
    CanComponent
  ],
  templateUrl: './list-financials-permits.component.html',
  styleUrls: ['./list-financials-permits.component.scss']
})
export class ListFinancialsPermitsComponent implements OnInit {

  showTableCollapseMode: boolean = false;
  actions: any[] = [];
  
  columns: ITableColumn[] = [];
  searchQuery = signal<string>('');
  get totalCount() {
    return this.financialsPermitsService.totalCount ;
  } 
    

  constructor(private screenService: ScreenService , private financialsPermitsService : FinancialsPermitsService ,private langService :LanguageService ) {
   this.getFinancialsPermits(1 , 10);
  }
  getFinancialsPermits(pageIndex: number, pageSize: number) {
    this.financialsPermitsService.getFinancialsPermits(pageIndex ,pageSize).subscribe();
  }

  onSearchTextChange(searchValue: any) { 
    this.searchQuery.set(searchValue);
  }
  get financialsPermits() {
    const searchText = this.searchQuery();
    return this.financialsPermitsService.entities().filter((a: IFinancialsPermits) => a.excavationTypeId?.toString().includes(searchText) );
  }

  ngOnInit(): void {
    this.showTableCollapseMode = this.screenService.isScreenBelowThan(888);
    this.actions = [
      {
        label: "اظهار",
        icon: "pi pi-eye",
        component: ShowFinancialsPermitsComponent,
      },
      // { label: "تنزيل", icon: "pi pi-download" },
      // {
      //   label: "تعديل",
      //   icon: "pi pi-file-edit",
      //   permission : "Activities",
      //   component: EditFinancialsPermitsComponent,
      // },
      // {
      //   label: "مفعل",
      //   icon: "",
      //   component: ChangeStatusFinancialsPermitsComponent,
      // },
    ];
    this.columns = [
      {
        text: "excavation-type-name",
        dataIndex: this.langService.getNameFormatAddtion('excavationPathType'),
      },
      {
        text: "excavation-path-name",
        dataIndex: this.langService.getNameFormatAddtion('excavationType'),
        hidden: this.showTableCollapseMode,
       
      },
      {
        text: "",
        tdTemplate: "expandArrow",
        hidden: !this.showTableCollapseMode,
      },
      {
        text: "max-days-number",
        dataIndex: "maxDaysNumber",
        tdClassList: ["w-[200px]"],
      },
      // {
      //   text: "Code",
      //   dataIndex: "code",
      //   tdClassList: ["w-[200px]"],
      // },
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
      this.getFinancialsPermits(event.page + 1 ,this.rows);
  }


}
