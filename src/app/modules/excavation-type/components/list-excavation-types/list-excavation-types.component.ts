import { Component, OnInit, signal } from '@angular/core';
import { CreateExcavationTypeComponent } from '../create-excavation-type/create-excavation-type.component';
import { ExcavationTypeService } from '@shared/services/main-data-management/excavation-type/excavation-type.service';
import { IExcavationType } from '../../excavation-type.model';
import { TranslateModule } from '@ngx-translate/core';
import { CanComponent } from '@shared/components/can/can.component';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { SearchBarComponent } from '@shared/components/search-bar/search-bar.component';
import { TableComponent } from '@shared/components/table/table.component';
import { ITableColumn } from '@shared/components/table/table.models';
import { LanguageService } from '@shared/services/language/language.service';
import { ScreenService } from '@shared/services/screen/screen.service';
import { PaginatorModule } from 'primeng/paginator';
import { EditExcavationTypeComponent } from '../edit-excavation-type/edit-excavation-type.component';
import { ShowExcavationTypeComponent } from '../show-excavation-type/show-excavation-type.component';
import { ActivatedRoute } from '@angular/router';
import { ExcavationChangeStatusComponent } from '../excavation-change-status/excavation-change-status.component';

@Component({
  selector: 'app-list-excavation-types',
  standalone : true,
  imports: [
    TableComponent,
    SearchBarComponent,
    PageHeaderComponent,
    CreateExcavationTypeComponent,
    TranslateModule,
    PaginatorModule,
    CanComponent
  ],
  templateUrl: './list-excavation-types.component.html',
  styleUrls: ['./list-excavation-types.component.scss']
})
export class ListExcavationTypesComponent implements OnInit {
  showTableCollapseMode: boolean = false;
  actions: any[] = [];
  
  columns: ITableColumn[] = [];
  searchQuery = signal<string>('');
  excavationRoute: string = "";
  get totalCount() {
    return this.excavationTypeService.totalCount ;
  } 
    

  constructor(private screenService: ScreenService,private router :ActivatedRoute , private excavationTypeService : ExcavationTypeService ,private langService :LanguageService ) {
   router.params.subscribe(res => this.excavationRoute = res['excavationRoute'])
   this.getExcavationTypes(1 , 10);
  }
  getExcavationTypes(pageIndex: number, pageSize: number) {
    this.excavationTypeService.getExcavationTypes( this.excavationRoute ,pageIndex ,pageSize).subscribe();
  }

  onSearchTextChange(searchValue: any) { 
    this.searchQuery.set(searchValue);
  }
  get excavationTypes() {
    const searchText = this.searchQuery();
    return this.excavationTypeService.entities().filter((a: IExcavationType) => a.nameAr?.includes(searchText) || a.nameEn?.includes(searchText));
  }

  ngOnInit(): void {
    this.showTableCollapseMode = this.screenService.isScreenBelowThan(888);
    this.actions = [
      {
        label: "اظهار",
        icon: "pi pi-eye",
        component: ShowExcavationTypeComponent,
      },
      // { label: "تنزيل", icon: "pi pi-download" },
      {
        label: "تعديل",
        icon: "pi pi-file-edit",
        permission : "Activities",
        component: EditExcavationTypeComponent,
      },
      {
        label: "مفعل",
        icon: "",
        component: ExcavationChangeStatusComponent,
      },
    ]
    this.columns = [
      {
        text: "name",
        dataIndex: this.langService.getNameFormat(),
      },
      {
        text: "excavation-type-desc",
        dataIndex: "descriptionAr",
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
      this.getExcavationTypes(event.page + 1 ,this.rows);
  }
}
