import { Component, OnInit, signal } from "@angular/core";

import { TableComponent } from "@shared/components/table/table.component";
import { SearchBarComponent } from "@shared/components/search-bar/search-bar.component";
import { PageHeaderComponent } from "@shared/components/page-header/page-header.component";

import { ShowMunicipalityComponent } from "../show-municipality/show-municipality.component";
import { CreateMunicipalityComponent } from "../create-municipality/create-municipality.component";
import { ChangeMunicipalityStatusComponent } from "../change-municipality-status/change-municipality-status.component";

import { IMunicipalities } from "../../municipalities.model";
import { ITableColumn } from "@shared/components/table/table.models";

import { ScreenService } from "@shared/services/screen/screen.service";
import { MunicipalsService } from "@shared/services/main-data-management/municipals/municipals.service";
import { LanguageService } from "@shared/services/language/language.service";
import { TranslateModule } from "@ngx-translate/core";
import { EditMunicipalityComponent } from "../edit-municipality/edit-municipality.component";
import { PaginatorModule } from "primeng/paginator";
import { CanComponent } from "@shared/components/can/can.component";

@Component({
  selector: "app-list-municipality",
  standalone: true,
  imports: [
    TableComponent,
    SearchBarComponent,
    PageHeaderComponent,
    CreateMunicipalityComponent,
    TranslateModule,
    PaginatorModule,
    CanComponent
  ],
  templateUrl: "./list-municipality.component.html",
  styleUrl: "./list-municipality.component.scss",
})
export class ListMunicipalityComponent implements OnInit {
  showTableCollapseMode: boolean = false;
  actions: any[] = [];
  municipalitiesData: IMunicipalities[] = [
  ];
  columns: ITableColumn[] = [];

  searchQuery = signal<string>('');
  get totalCount() {
    return this.municipalsService.totalCount ;
  } 
  constructor(private screenService: ScreenService , private municipalsService :MunicipalsService, private langServices : LanguageService) {
  }
  onSearchTextChange(searchValue: any) { 
    this.searchQuery.set(searchValue);
  }
  get municipals() {
    const searchText = this.searchQuery();
    return this.municipalsService.entities();
  }

  ngOnInit(): void {
    this.getMunicipalities(1, 10)
    this.showTableCollapseMode = this.screenService.isScreenBelowThan(888);
    this.actions = [
      {
        label: "اظهار",
        icon: "pi pi-eye",
        component: ShowMunicipalityComponent,
      },
      // { label: "تنزيل", icon: "pi pi-download" },
      {
        label: "تعديل",
        icon: "pi pi-file-edit",
        permission : 'Municipals',
        component: EditMunicipalityComponent,
      },
      {
        label: "مفعل",
        icon: "",
        component: ChangeMunicipalityStatusComponent,
      },
    ];
    this.columns = [
      {
        text: "municipality-name",
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
        text: "area",
        dataIndex: this.langServices.getStringFormat('regionName'),
        hidden: this.showTableCollapseMode,
      },
      {
        text: "classification",
        dataIndex: this.langServices.getStringFormat('classificationName'),
      },
      {
        text: "nic-code",
        dataIndex: "code",
        hidden: this.showTableCollapseMode,
      },
      {
        thTemplate: "actionTemplate",
        tdTemplate: "actionListTemplate",
      },
    ];
  }
  getMunicipalities(pageIndex: number ,pageSize: number) {
    this.municipalsService.getMunicipals( pageIndex , pageSize ,this.searchQuery(),).subscribe();

  }
   //paginator configs
   first: number = 1;
   rows: number = 10;
 
   onPageChange(event: any) {
     
       this.first = event.first;
       this.rows = event.rows;
       this.getMunicipalities(event.page + 1 ,this.rows, );
   }

}
