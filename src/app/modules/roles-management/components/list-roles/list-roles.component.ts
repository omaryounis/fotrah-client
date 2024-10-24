import { Component, ViewChild, inject, signal } from '@angular/core';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { SearchBarComponent } from '@shared/components/search-bar/search-bar.component';
import { ButtonModule } from 'primeng/button';
import { Menu, MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { CreateRoleComponent } from '../create-role/create-role.component';
import { EditRoleComponent } from '../edit-role/edit-role.component';
import { ShowRoleComponent } from '../show-role/show-role.component';
import { ModalService } from '@shared/services/modal/modal.service';
import { ScreenService } from '@shared/services/screen/screen.service';
import { IRole } from '../../role.model';
import { MessagesModule } from 'primeng/messages';
import { Message } from 'primeng/api/message';
import { RoleService } from '@shared/services/roles/roles.service';
import { take } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { NameFormatterPipe } from '@shared/pipes/name-formatter.pipe';
import { Paginator, PaginatorModule } from 'primeng/paginator';
import { FormRoleComponent } from '../form-role/form-role.component';

@Component({
  selector: 'app-list-roles',
  standalone: true,
 
  imports: [
    MenuModule,
    TableModule,
    ButtonModule,
    MessagesModule,
    ShowRoleComponent,
    EditRoleComponent,
    SearchBarComponent,
    PageHeaderComponent,
    TranslateModule,
    CreateRoleComponent,
    PaginatorModule
  ],
  templateUrl: './list-roles.component.html',
  styleUrl: './list-roles.component.scss'
})
export class ListRolesComponent {
  @ViewChild("menu") menu!: Menu;
  roleService = inject(RoleService);
  searchQuery = signal<string>('');
  @ViewChild(EditRoleComponent) formRole: EditRoleComponent | undefined;

  onSearchTextChange(searchValue: any) { 
    this.searchQuery.set(searchValue);
  }
  get roles() {
    const searchText = this.searchQuery();
    return this.roleService.entities()
  }
  searchValue: string = "";
  showTableCollapseMode: boolean = false;
  actionItems = [
    // { label: "تنزيل", icon: "pi pi-download" },
    // { label: "حذف", icon: "pi pi-trash" },
    {
      label: "اظهار",
      icon: "pi pi-eye",
      command: () => {
        this.showModalService.openModal();
      },
    },
    {
      label: "تعديل",
      icon: "pi pi-file-edit",
      command: () => {
        this.editModalService.openModal();
      },
    },
  ];

  selectedRole: IRole = {
    nameAr: "",
    nameEn: "",
    status: "",
    usersPerRoleCount: 0,
    id: -1,
  };
  editModalService: ModalService = new ModalService();
  showModalService: ModalService = new ModalService();

  constructor(private screenService: ScreenService , private nameFormatterPipe: NameFormatterPipe) {
    this.getRoles(10 , 1);
  }


  toggleActionsMenu($event: MouseEvent) {
    this.menu.toggle($event);
  }

  openEditRole(roleData: IRole) {
    this.formRole!.roleData = {...roleData};
    this.editModalService.openModal();
  }

  openShowRole(roleData: IRole) {
    this.selectedRole = roleData;
    this.showModalService.openModal();
  }


  ngOnInit(): void {
    this.showTableCollapseMode = this.screenService.isScreenBelowThan(888);

  }
  getRoles(pageSize: number, pageIndex: number) {
     
    this.roleService.getRoles(pageSize, pageIndex,this.searchQuery()).pipe(take(1)).subscribe();
  }
 getFormatedName(names : {}) {
  return this.nameFormatterPipe.transform(names);
 }

     //paginator configs
     get totalCount() {
      return this.roleService.totalCount ;
    } 
    first: number = 1;
    rows: number = 10;
  
    onPageChange(event: any) {
        this.first = event.first;
        this.rows = event.rows;
        this.getRoles(this.rows, event.page + 1);
    }
 
}
